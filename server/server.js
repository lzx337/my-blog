/**
 * CG博客 API 服务器
 * - 静态文件服务
 * - DashScope API 代理
 * - SQLite 数据存储 REST API
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const {
  loadDB, initSchema, checkDefaultAdmin, initDefaults, getDB,
  postQueries, contentQueries, songQueries,
  logQueries, settingQueries, authQueries
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || 'sk-2814efd200044088b1d800b6d1fa13e3';
const DASHSCOPE_API_URL = 'https://api.deepseek.com/v1/chat/completions';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 静态文件
app.use(express.static(path.join(__dirname, '..'), {
  index: 'index.html',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
  }
}));

// ==================== AI Chat 代理 ====================
app.post('/api/chat', async (req, res) => {
  if (!DASHSCOPE_API_KEY) {
    return res.status(500).json({ error: 'API Key 未配置' });
  }
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: '缺少 messages 数组' });
  }
  try {
    const response = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + DASHSCOPE_API_KEY
      },
      body: JSON.stringify({ model: 'deepseek-v4-flash', messages, temperature: 0.85, max_tokens: 180 })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error('[Chat API] Error:', response.status, errText);
      return res.status(response.status).json({ error: 'AI API 请求失败', status: response.status, detail: errText });
    }
    res.json(await response.json());
  } catch (err) {
    console.error('[Chat API] Exception:', err.message);
    res.status(500).json({ error: '代理内部错误', detail: err.message });
  }
});

// ==================== 鉴权中间件 ====================
function authMiddleware(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (!token) return res.status(401).json({ error: '未登录' });
  try {
    const [username, hash] = Buffer.from(token, 'base64').toString().split(':');
    if (authQueries.verify(username, hash)) {
      req.adminUser = username;
      return next();
    }
  } catch (e) {}
  res.status(401).json({ error: 'Token 无效' });
}

// ==================== Auth ====================
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: '缺少用户名或密码' });

  try {
    if (authQueries.verify(username, password)) {
      const token = Buffer.from(username + ':' + password).toString('base64');
      logQueries.add('login_success', '用户 ' + username + ' 登录成功', req.ip, req.headers['user-agent'] || '');
      res.json({ success: true, token, username });
    } else {
      logQueries.add('login_fail', '用户 ' + username + ' 登录失败', req.ip, req.headers['user-agent'] || '');
      res.status(401).json({ error: '用户名或密码错误' });
    }
  } catch (err) {
    res.status(500).json({ error: '登录异常', detail: err.message });
  }
});

app.put('/api/auth/password', authMiddleware, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) return res.status(400).json({ error: '密码至少 4 位' });
  try {
    authQueries.changePassword(req.adminUser, newPassword);
    logQueries.add('password_change', '用户 ' + req.adminUser + ' 修改了密码', req.ip, req.headers['user-agent'] || '');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '修改失败', detail: err.message });
  }
});

// ==================== Posts ====================
app.get('/api/posts', authMiddleware, (req, res) => {
  try {
    const posts = postQueries.listAll().map(p => ({
      ...p, tags: JSON.parse(p.tags || '[]')
    }));
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts/public', (req, res) => {
  try {
    const posts = postQueries.listPublished().map(p => ({
      ...p, tags: JSON.parse(p.tags || '[]')
    }));
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts/:id', authMiddleware, (req, res) => {
  try {
    const post = postQueries.getById(req.params.id);
    if (!post) return res.status(404).json({ error: '文章不存在' });
    post.tags = JSON.parse(post.tags || '[]');
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts', authMiddleware, (req, res) => {
  try {
    const p = req.body;
    if (!p.id || !p.title) return res.status(400).json({ error: 'id 和 title 是必填项' });
    postQueries.insert(p);
    if (p.content !== undefined) contentQueries.upsert(p.id, p.content);
    logQueries.add('post_create', '创建文章: ' + p.title, req.ip, req.headers['user-agent'] || '');
    const created = postQueries.getById(p.id);
    created.tags = JSON.parse(created.tags || '[]');
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/posts/:id', authMiddleware, (req, res) => {
  try {
    const existing = postQueries.getById(req.params.id);
    if (!existing) return res.status(404).json({ error: '文章不存在' });
    postQueries.update(req.params.id, req.body);
    if (req.body.content !== undefined) contentQueries.upsert(req.params.id, req.body.content);
    logQueries.add('post_update', '编辑文章: ' + (req.body.title || existing.title), req.ip, req.headers['user-agent'] || '');
    const updated = postQueries.getById(req.params.id);
    updated.tags = JSON.parse(updated.tags || '[]');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id', authMiddleware, (req, res) => {
  try {
    const { permanent } = req.query;
    if (permanent === 'true') {
      postQueries.hardDelete(req.params.id);
      logQueries.add('post_delete_perm', '永久删除文章: ' + req.params.id, req.ip, req.headers['user-agent'] || '');
    } else {
      postQueries.softDelete(req.params.id);
      logQueries.add('post_delete', '移至回收站: ' + req.params.id, req.ip, req.headers['user-agent'] || '');
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts/:id/restore', authMiddleware, (req, res) => {
  try {
    postQueries.restore(req.params.id);
    logQueries.add('post_restore', '恢复文章: ' + req.params.id, req.ip, req.headers['user-agent'] || '');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== Contents ====================
app.get('/api/posts/:id/content', authMiddleware, (req, res) => {
  try {
    const row = contentQueries.getByPostId(req.params.id);
    res.json({ body: row ? row.body : '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/posts/:id/content', authMiddleware, (req, res) => {
  try {
    contentQueries.upsert(req.params.id, req.body.body || '');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== Songs ====================
app.get('/api/songs', (req, res) => {
  try { res.json(songQueries.listAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/songs/:id', authMiddleware, (req, res) => {
  try {
    const song = songQueries.getById(req.params.id);
    if (!song) return res.status(404).json({ error: '歌曲不存在' });
    res.json(song);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/songs', authMiddleware, (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'title 是必填项' });
    const id = songQueries.insert(req.body);
    logQueries.add('song_create', '添加歌曲: ' + title, req.ip, req.headers['user-agent'] || '');
    res.status(201).json(songQueries.getById(id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/songs/:id', authMiddleware, (req, res) => {
  try {
    const existing = songQueries.getById(req.params.id);
    if (!existing) return res.status(404).json({ error: '歌曲不存在' });
    songQueries.update(req.params.id, req.body);
    logQueries.add('song_update', '编辑歌曲: ' + (req.body.title || existing.title), req.ip, req.headers['user-agent'] || '');
    res.json(songQueries.getById(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/songs/:id', authMiddleware, (req, res) => {
  try {
    const song = songQueries.getById(req.params.id);
    songQueries.delete(req.params.id);
    logQueries.add('song_delete', '删除歌曲: ' + (song ? song.title : req.params.id), req.ip, req.headers['user-agent'] || '');
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== Export/Import ====================
app.get('/api/export', authMiddleware, (req, res) => {
  try {
    const posts = postQueries.listAll().map(p => ({
      ...p, tags: JSON.parse(p.tags || '[]')
    }));
    const contents = contentQueries.getMap();
    const songs = songQueries.listAll();
    const logs = logQueries.list(200);
    const appearance = settingQueries.get('appearance');
    const captchaEnabled = settingQueries.get('captcha_enabled');

    const data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      meta: {
        postCount: posts.length,
        songCount: songs.length,
        contentCount: Object.keys(contents).length,
        logCount: logs.length
      },
      posts,
      contents,
      songs,
      logs,
      appearance: appearance ? JSON.parse(appearance) : null,
      captcha_enabled: captchaEnabled === 'true'
    };

    logQueries.add('data_export', '导出备份 v2（' + posts.length + ' 篇文章）', req.ip, req.headers['user-agent'] || '');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/import', authMiddleware, (req, res) => {
  const { data } = req.body;
  if (!data || !Array.isArray(data.posts)) {
    return res.status(400).json({ error: '无效的导入数据' });
  }
  try {
    const db = getDB();
    db.run('DELETE FROM contents');
    db.run('DELETE FROM posts');
    db.run('DELETE FROM songs');
    if (data.logs) db.run('DELETE FROM logs');
    for (const p of data.posts) {
      if (!p.status) p.status = 'published';
      if (p.deletedAt === undefined) p.deletedAt = null;
      postQueries.insert(p);
    }
    if (data.contents) {
      for (const [postId, body] of Object.entries(data.contents)) {
        contentQueries.upsert(postId, body);
      }
    }
    if (data.songs) {
      for (const s of data.songs) { songQueries.insert(s); }
    }
    if (data.logs && Array.isArray(data.logs)) {
      for (const l of data.logs) {
        db.run('INSERT INTO logs (type, detail, time, ip, ua) VALUES (?,?,?,?,?)',
          [l.type || '', l.detail || '', l.time || Date.now(), l.ip || '', l.ua || '']);
      }
    }
    if (data.appearance) settingQueries.set('appearance', JSON.stringify(data.appearance));
    if (data.captcha_enabled !== undefined) settingQueries.set('captcha_enabled', data.captcha_enabled ? 'true' : 'false');
    require('./db').saveDB();
    logQueries.add('data_import', '导入备份 v' + (data.version || 1) + '（' + data.posts.length + ' 篇文章）', req.ip, req.headers['user-agent'] || '');
    res.json({
      success: true,
      stats: { posts: data.posts.length, songs: (data.songs || []).length, contents: Object.keys(data.contents || {}).length }
    });
  } catch (err) {
    console.error('[Import] Error:', err);
    res.status(500).json({ error: '导入失败: ' + err.message });
  }
});

// ==================== Logs ====================
app.get('/api/logs', authMiddleware, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 200;
    logQueries.cleanup();
    res.json(logQueries.list(limit));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/logs', authMiddleware, (req, res) => {
  try {
    const { type, detail } = req.body;
    logQueries.add(type || 'manual', detail || '', req.ip, req.headers['user-agent'] || '');
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/logs', authMiddleware, (req, res) => {
  try {
    logQueries.clear();
    logQueries.add('clear_logs', '清空所有操作日志', req.ip, req.headers['user-agent'] || '');
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== Settings ====================
app.get('/api/settings/:key', authMiddleware, (req, res) => {
  try {
    const val = settingQueries.get(req.params.key);
    res.json({ key: req.params.key, value: val ? (() => { try { return JSON.parse(val); } catch (e) { return val; } })() : null });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/settings/:key', authMiddleware, (req, res) => {
  try {
    const val = typeof req.body.value === 'string' ? req.body.value : JSON.stringify(req.body.value);
    settingQueries.set(req.params.key, val);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== 服务器状态 ====================
app.get('/api/status', (req, res) => {
  try {
    const db = getDB();
    const postsCount = db.prepare('SELECT COUNT(*) as cnt FROM posts WHERE deletedAt IS NULL').get().cnt;
    const songsCount = db.prepare('SELECT COUNT(*) as cnt FROM songs').get().cnt;
    res.json({ status: 'ok', db: true, posts: postsCount, songs: songsCount, time: new Date().toISOString() });
  } catch (err) {
    res.json({ status: 'ok', db: false, error: err.message });
  }
});

// ==================== 启动 ====================
(async function() {
  try {
    await loadDB();
    initSchema();
    checkDefaultAdmin();
    initDefaults();
    console.log('📊 数据库加载成功');
  } catch(e) {
    console.error('❌ 数据库初始化失败:', e.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('✅ API 服务器已启动: http://localhost:' + PORT);
    if (!DASHSCOPE_API_KEY) console.warn('⚠️  未配置 DASHSCOPE_API_KEY');
    else console.log('🔑 API Key: ' + DASHSCOPE_API_KEY.slice(0, 8) + '...');
    try {
      const db = getDB();
      const res = db.exec('SELECT COUNT(*) as cnt FROM posts');
      const cnt = res.length && res[0].values.length ? res[0].values[0][0] : 0;
      console.log('📊 文章数量: ' + cnt);
    } catch(e) {}
  });
})();