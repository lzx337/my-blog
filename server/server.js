const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const {
  loadDB, initSchema, checkDefaultAdmin, initDefaults,
  getDB, postQueries, contentQueries, songQueries,
  logQueries, settingQueries, authQueries
} = require('./db');

const app = express();
const PORT = process.env.PORT || 9000;

// 环境变量检查
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
if (!DEEPSEEK_API_KEY) {
  console.error('请设置 DEEPSEEK_API_KEY 环境变量（DeepSeek API Key）');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

// SMTP 邮件配置（可选，用于登录邮箱验证）
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const smtpEnabled = !!(SMTP_HOST && SMTP_USER && SMTP_PASS && ADMIN_EMAIL);

// 验证码存储（内存，5 分钟过期）
const verifyCodes = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of verifyCodes) {
    if (now > val.expiresAt) verifyCodes.delete(key);
  }
}, 60000);

// ---------- 中间件 ----------
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 登录速率限制
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: '登录尝试过多，请15分钟后再试' }
});

// JWT 鉴权中间件
function authMiddleware(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token) {
    return res.status(401).json({ success: false, error: '未登录' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminUser = decoded.username;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Token 无效或已过期' });
  }
}

// ---------- 系统 ----------
app.get('/api/status', (req, res) => {
  try {
    const db = getDB();
    res.json({ status: 'ok', db: !!db });
  } catch (e) {
    res.json({ status: 'error', db: false });
  }
});

// ---------- 认证 ----------
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, error: '请提供用户名和密码' });
  }
  const valid = authQueries.verify(username, password);
  if (!valid) {
    logQueries.add('login_fail', `登录失败 - 用户名: ${username}`, req.ip, req.headers['user-agent'] || '');
    return res.json({ success: false, error: '用户名或密码错误' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  logQueries.add('login_success', `管理员 ${username} 登录成功`, req.ip, req.headers['user-agent'] || '');
  res.json({ success: true, token, username });
});

// 发送邮箱验证码（需要先登录拿到 JWT）
app.post('/api/auth/send-code', authMiddleware, async (req, res) => {
  if (!smtpEnabled) {
    return res.json({ success: false, error: 'SMTP 未配置，无法发送验证码' });
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const key = req.adminUser + ':' + req.ip;
  verifyCodes.set(key, { code, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0 });
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST, port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    await transporter.sendMail({
      from: SMTP_USER, to: ADMIN_EMAIL,
      subject: '博客后台登录验证码',
      html: `<div style="max-width:480px;margin:0 auto;padding:24px;font-family:sans-serif">
        <h2 style="margin:0 0 8px">博客后台登录验证</h2>
        <p style="color:#666;margin:0 0 20px">您的验证码为（5 分钟内有效）：</p>
        <div style="font-size:36px;font-weight:700;letter-spacing:8px;text-align:center;padding:16px;background:#f4f4f4;border-radius:8px">${code}</div>
        <p style="color:#999;font-size:12px;margin-top:20px">IP: ${req.ip} | 时间: ${new Date().toLocaleString('zh-CN')}</p>
      </div>`
    });
    res.json({ success: true, message: '验证码已发送到管理员邮箱' });
  } catch (e) {
    console.error('Send email error:', e.message);
    res.json({ success: false, error: '邮件发送失败: ' + e.message });
  }
});

// 验证邮箱验证码
app.post('/api/auth/verify-code', authMiddleware, (req, res) => {
  const { code } = req.body;
  if (!code) return res.json({ success: false, error: '请提供验证码' });
  const key = req.adminUser + ':' + req.ip;
  const stored = verifyCodes.get(key);
  if (!stored || Date.now() > stored.expiresAt) {
    verifyCodes.delete(key);
    return res.json({ success: false, error: '验证码已过期，请重新发送' });
  }
  stored.attempts++;
  if (stored.attempts > 5) {
    verifyCodes.delete(key);
    return res.json({ success: false, error: '验证失败次数过多，请重新发送验证码' });
  }
  if (stored.code !== code) {
    return res.json({ success: false, error: '验证码错误，剩余尝试次数: ' + (5 - stored.attempts) });
  }
  verifyCodes.delete(key);
  const token = jwt.sign({ username: req.adminUser }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, token, message: '验证成功' });
});

app.put('/api/auth/password', authMiddleware, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.json({ success: false, error: '密码长度至少4位' });
  }
  authQueries.changePassword(req.adminUser, newPassword);
  logQueries.add('password_change', `管理员 ${req.adminUser} 修改密码`, req.ip, req.headers['user-agent'] || '');
  res.json({ success: true });
});

// ---------- 文章 ----------
app.get('/api/posts', authMiddleware, (req, res) => {
  try {
    res.json(postQueries.listAll());
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/posts', authMiddleware, (req, res) => {
  try {
    const post = req.body;
    if (!post || !post.id || !post.title) {
      return res.status(400).json({ success: false, error: '文章缺少 id 或 title' });
    }
    postQueries.insert(post);
    if (post.content !== undefined) {
      contentQueries.upsert(post.id, post.content);
    } else {
      const existing = contentQueries.getByPostId(post.id);
      if (!existing) contentQueries.upsert(post.id, '');
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/posts/:id/content', authMiddleware, (req, res) => {
  try {
    const content = contentQueries.getByPostId(req.params.id);
    res.json(content || { body: '' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 公开文章列表（无需登录）
app.get('/api/posts/public', (req, res) => {
  try {
    res.json(postQueries.listPublished());
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ---------- 歌曲 ----------
app.get('/api/songs', authMiddleware, (req, res) => {
  try {
    res.json(songQueries.listAll());
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ---------- 日志 ----------
app.get('/api/logs', authMiddleware, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 200;
    res.json(logQueries.list(limit));
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/logs', authMiddleware, (req, res) => {
  try {
    const { type, detail } = req.body;
    if (!type) {
      return res.status(400).json({ success: false, error: '缺少日志类型' });
    }
    logQueries.add(type, detail || '', req.ip, req.headers['user-agent'] || '');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ---------- 设置 ----------
app.get('/api/settings/:key', authMiddleware, (req, res) => {
  try {
    const value = settingQueries.get(req.params.key);
    res.json({ key: req.params.key, value: value || null });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.put('/api/settings/:key', authMiddleware, (req, res) => {
  try {
    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ success: false, error: '缺少 value' });
    }
    settingQueries.set(req.params.key, value);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ---------- 导入 / 导出 ----------
app.post('/api/import', authMiddleware, (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, error: '缺少导入数据' });
    }
    if (data.posts && Array.isArray(data.posts)) {
      data.posts.forEach(p => postQueries.insert(p));
    }
    if (data.contents && typeof data.contents === 'object') {
      Object.entries(data.contents).forEach(([postId, body]) => {
        contentQueries.upsert(postId, body);
      });
    }
    if (data.songs && Array.isArray(data.songs)) {
      data.songs.forEach(s => songQueries.insert(s));
    }
    logQueries.add('import', `管理员 ${req.adminUser} 导入了数据`, req.ip, req.headers['user-agent'] || '');
    res.json({ success: true, message: '导入成功' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/export', authMiddleware, (req, res) => {
  try {
    const posts = postQueries.listAll();
    const contents = contentQueries.getMap();
    const songs = songQueries.listAll();
    res.json({ success: true, data: { posts, contents, songs } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ---------- AI 聊天（DeepSeek 代理） ----------
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: '缺少 messages 或格式错误' });
    }

    const deepseekResp = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.8,
        max_tokens: 4096
      })
    });

    if (!deepseekResp.ok) {
      const errText = await deepseekResp.text();
      console.error('DeepSeek error:', deepseekResp.status, errText);
      return res.status(502).json({ error: 'AI 服务调用失败' });
    }

    const data = await deepseekResp.json();
    res.json(data);
  } catch (e) {
    console.error('Chat API error:', e.message);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// ---------- 404 / 错误处理 ----------
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: '服务器内部错误' });
});

// ---------- 启动 ----------
async function start() {
  try {
    await loadDB();
    initSchema();
    checkDefaultAdmin();
    initDefaults();
    logQueries.cleanup();
    console.log('✅ 数据库初始化完成');
  } catch (e) {
    console.error('❌ 数据库初始化失败:', e.message);
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ 服务器运行在端口 ${PORT}`);
  });
}

start();