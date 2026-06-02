/**
 * SQLite 数据库（sql.js - 纯 JavaScript 实现，无需编译）
 */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// 云函数环境只有 /tmp 可写；本地开发用项目下的 data/ 目录
const DB_PATH = fs.existsSync('/tmp')
  ? '/tmp/data/cgbb.db'
  : path.join(__dirname, '..', 'data', 'cgbb.db');
let db = null;

async function initSQL() {
  if (typeof initSqlJs === 'undefined') {
    initSqlJs = require('sql.js');
  }
  return await initSqlJs();
}

async function loadDB() {
  const SQL = await initSQL();
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }
  return db;
}

function saveDB() {
  if (!db) return;
  const data = db.export();
  const buf = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buf);
}

function initSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, date TEXT, readTime TEXT,
      excerpt TEXT, category TEXT, tags TEXT DEFAULT '[]', image TEXT,
      directUrl TEXT, status TEXT DEFAULT 'published', deletedAt TEXT,
      created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS contents (
      post_id TEXT PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
      body TEXT DEFAULT '', updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
      artist TEXT, album TEXT, duration INTEGER DEFAULT 0, file TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL,
      detail TEXT, time INTEGER NOT NULL, ip TEXT, ua TEXT
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, value TEXT
    );
    CREATE TABLE IF NOT EXISTS credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL
    );
  `);
  saveDB();
}

function checkDefaultAdmin() {
  const row = db.exec('SELECT id FROM credentials WHERE username = ?', ['admin']);
  if (row.length === 0 || row[0].values.length === 0) {
    const hash = bcrypt.hashSync('admin', 12);
    db.run('INSERT INTO credentials (username, password) VALUES (?, ?)', ['admin', hash]);
    saveDB();
  }
}

function initDefaults() {
  const keys = ['captcha_enabled', 'appearance'];
  const stmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  stmt.run(['captcha_enabled', 'false']);
  stmt.run(['appearance', '{}']);
  stmt.free();
  saveDB();
}

// ====== Posts ======
const postQueries = {
  listAll: () => {
    const rows = db.exec('SELECT * FROM posts ORDER BY date DESC');
    if (!rows.length) return [];
    return rows[0].values.map(r => rowToObj(rows[0].columns, r));
  },
  listPublished: () => {
    const rows = db.exec("SELECT * FROM posts WHERE (deletedAt IS NULL OR deletedAt = '') AND status = 'published' ORDER BY date DESC");
    if (!rows.length) return [];
    return rows[0].values.map(r => rowToObj(rows[0].columns, r));
  },
  getById: (id) => {
    const rows = db.exec('SELECT * FROM posts WHERE id = ?', [id]);
    if (!rows.length || !rows[0].values.length) return null;
    return rowToObj(rows[0].columns, rows[0].values[0]);
  },
  insert: (p) => {
    db.run('INSERT OR REPLACE INTO posts (id, title, date, readTime, excerpt, category, tags, image, directUrl, status, deletedAt, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime(\'now\'))',
      [p.id, p.title, p.date || null, p.readTime || null, p.excerpt || null, p.category || null,
       JSON.stringify(p.tags || []), p.image || null, p.directUrl || null, p.status || 'published', p.deletedAt || null]);
    saveDB();
  },
  update: (id, p) => {
    const existing = postQueries.getById(id);
    if (!existing) return false;
    const m = { ...existing, ...p };
    db.run('UPDATE posts SET title=?,date=?,readTime=?,excerpt=?,category=?,tags=?,image=?,directUrl=?,status=?,deletedAt=?,updated_at=datetime(\'now\') WHERE id=?',
      [m.title, m.date || null, m.readTime || null, m.excerpt || null, m.category || null,
       JSON.stringify(m.tags || []), m.image || null, m.directUrl || null, m.status || 'published', m.deletedAt || null, id]);
    saveDB();
    return true;
  },
  softDelete: (id) => {
    db.run("UPDATE posts SET deletedAt = datetime('now'), updated_at = datetime('now') WHERE id=?", [id]);
    saveDB();
  },
  restore: (id) => {
    db.run("UPDATE posts SET deletedAt = NULL, updated_at = datetime('now') WHERE id=?", [id]);
    saveDB();
  },
  hardDelete: (id) => {
    db.run('DELETE FROM posts WHERE id = ?', [id]);
    db.run('DELETE FROM contents WHERE post_id = ?', [id]);
    saveDB();
  }
};

// ====== Contents ======
const contentQueries = {
  getByPostId: (postId) => {
    const rows = db.exec('SELECT body FROM contents WHERE post_id = ?', [postId]);
    if (!rows.length || !rows[0].values.length) return null;
    return { body: rows[0].values[0][0] };
  },
  upsert: (postId, body) => {
    db.run('INSERT INTO contents (post_id, body, updated_at) VALUES (?,?,datetime(\'now\')) ON CONFLICT(post_id) DO UPDATE SET body=excluded.body, updated_at=datetime(\'now\')',
      [postId, body || '']);
    saveDB();
  },
  getMap: () => {
    const rows = db.exec('SELECT post_id, body FROM contents');
    const map = {};
    if (rows.length) {
      rows[0].values.forEach(r => { map[r[0]] = r[1]; });
    }
    return map;
  }
};

// ====== Songs ======
const songQueries = {
  listAll: () => {
    const rows = db.exec('SELECT * FROM songs ORDER BY id ASC');
    if (!rows.length) return [];
    return rows[0].values.map(r => rowToObj(rows[0].columns, r));
  },
  getById: (id) => {
    const rows = db.exec('SELECT * FROM songs WHERE id = ?', [id]);
    if (!rows.length || !rows[0].values.length) return null;
    return rowToObj(rows[0].columns, rows[0].values[0]);
  },
  insert: (s) => {
    db.run('INSERT INTO songs (title, artist, album, duration, file) VALUES (?,?,?,?,?)',
      [s.title, s.artist || null, s.album || null, s.duration || 0, s.file || null]);
    saveDB();
    const rows = db.exec('SELECT last_insert_rowid()');
    return rows[0].values[0][0];
  },
  update: (id, s) => {
    db.run('UPDATE songs SET title=?,artist=?,album=?,duration=?,file=? WHERE id=?',
      [s.title, s.artist || null, s.album || null, s.duration || 0, s.file || null, id]);
    saveDB();
  },
  delete: (id) => {
    db.run('DELETE FROM songs WHERE id = ?', [id]);
    saveDB();
  }
};

// ====== Logs ======
const logQueries = {
  list: (limit = 200) => {
    const rows = db.exec('SELECT * FROM logs ORDER BY time DESC LIMIT ?', [limit]);
    if (!rows.length) return [];
    return rows[0].values.map(r => rowToObj(rows[0].columns, r));
  },
  add: (type, detail, ip, ua) => {
    db.run('INSERT INTO logs (type, detail, time, ip, ua) VALUES (?,?,?,?,?)',
      [type, detail, Date.now(), ip || '', ua || '']);
    saveDB();
  },
  clear: () => {
    db.run('DELETE FROM logs');
    saveDB();
  },
  cleanup: () => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    db.run('DELETE FROM logs WHERE time < ?', [cutoff]);
    const count = db.exec('SELECT COUNT(*) as cnt FROM logs')[0].values[0][0];
    if (count > 200) {
      db.run('DELETE FROM logs WHERE id NOT IN (SELECT id FROM logs ORDER BY time DESC LIMIT 200)');
    }
    saveDB();
  }
};

// ====== Settings ======
const settingQueries = {
  get: (key) => {
    const rows = db.exec('SELECT value FROM settings WHERE key = ?', [key]);
    if (!rows.length || !rows[0].values.length) return null;
    return rows[0].values[0][0];
  },
  set: (key, value) => {
    db.run('INSERT INTO settings (key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', [key, value]);
    saveDB();
  }
};

// ====== Auth ======
const authQueries = {
  verify: (username, password) => {
    const rows = db.exec('SELECT password FROM credentials WHERE username = ?', [username]);
    if (!rows.length || !rows[0].values.length) return false;
    return bcrypt.compareSync(password, rows[0].values[0][0]);
  },
  changePassword: (username, newPassword) => {
    const hash = bcrypt.hashSync(newPassword, 12);
    db.run('UPDATE credentials SET password = ? WHERE username = ?', [hash, username]);
    saveDB();
  }
};

// 工具函数
function rowToObj(columns, values) {
  const obj = {};
  columns.forEach((col, i) => { obj[col] = values[i]; });
  return obj;
}

function getDB() { return db; }

module.exports = { loadDB, initSchema, checkDefaultAdmin, initDefaults, getDB, saveDB, postQueries, contentQueries, songQueries, logQueries, settingQueries, authQueries, DB_PATH };