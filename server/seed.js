/**
 * seed.js — 将默认文章数据写入 SQLite
 * 用于首次部署时初始化数据库
 * 执行: node seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { loadDB, initSchema, checkDefaultAdmin, initDefaults, postQueries, contentQueries, songQueries, saveDB } = require('./db');

const DEFAULT_POSTS = [
  {
    id: 'git-install-push', title: 'Git 安装与推送到 GitHub',
    date: '2026-04-18', readTime: '216 字 · 1 分钟',
    excerpt: '首次仓库构建初始化与远程推送', category: '教程',
    tags: ['Git', 'GitHub'], image: 'assets/images/git/b9cb7653e82633e5.png'
  },
  {
    id: 'markdown-style-guide', title: 'Markdown 样式指南',
    date: '2026-04-17', readTime: '520 字 · 2 分钟',
    excerpt: '这是一篇Markdown样式指南，展示各种Markdown语法',
    tags: ['Markdown', '样式指南'], directUrl: 'indextxt/Markdown 样式指南.html'
  },
  {
    id: 'chainsaw-man', title: '电锯人',
    date: '2026-04-16', readTime: '180 字 · 1 分钟',
    excerpt: '关于电锯人动漫的感想与推荐', category: '动漫',
    tags: ['电锯人'], directUrl: 'indextxt/电锯人.html'
  },
  {
    id: 'math-formula-demo', title: '数学公式示例',
    date: '2026-04-15', readTime: '350 字 · 2 分钟',
    excerpt: '展示如何在 Markdown 中使用 LaTeX 语法书写数学公式',
    tags: ['数学公式'], directUrl: 'indextxt/数学公式示例.html'
  },
  {
    id: 'add-comment-system', title: '添加评论系统',
    date: '2026-04-14', readTime: '420 字 · 2 分钟',
    excerpt: '为博客添加评论功能', category: '教程',
    tags: ['评论系统'], directUrl: 'indextxt/添加评论系统.html'
  },
  {
    id: 'mdx-component-demo', title: 'MDX 组件演示',
    date: '2026-04-13', readTime: '600 字 · 3 分钟',
    excerpt: '演示如何在 MDX 中使用自定义 React 组件', category: '技术',
    tags: ['MDX'], directUrl: 'indextxt/MDX 组件演示.html'
  },
  {
    id: 'using-mdx', title: '使用 MDX',
    date: '2026-04-12', readTime: '280 字 · 1 分钟',
    excerpt: '介绍 MDX 的基本用法', category: '教程',
    tags: ['MDX', 'Markdown'], directUrl: 'indextxt/使用 MDX.html'
  }
];

async function seed() {
  console.log('开始初始化数据库...');
  await loadDB();
  initSchema();
  checkDefaultAdmin();
  initDefaults();

  // 检查是否已有数据
  const existing = require('./db').getDB().exec('SELECT COUNT(*) as cnt FROM posts');
  const count = existing.length && existing[0].values.length ? existing[0].values[0][0] : 0;
  if (count > 0) {
    console.log('数据库已有 ' + count + ' 篇文章，跳过 seed');
    saveDB();
    return;
  }

  // 插入默认文章
  for (const p of DEFAULT_POSTS) {
    postQueries.insert(p);
  }

  // 插入默认歌曲
  const DEFAULT_SONGS = [
    { title: '起风了', artist: '买辣椒也用券', duration: 260 },
    { title: '晴天', artist: '周杰伦', duration: 280 },
    { title: '孤勇者', artist: '陈奕迅', duration: 240 }
  ];
  for (const s of DEFAULT_SONGS) {
    songQueries.insert(s);
  }

  saveDB();
  console.log('✅ Seed 完成！');
  console.log('  文章: ' + DEFAULT_POSTS.length + ' 篇');
  console.log('  歌曲: ' + DEFAULT_SONGS.length + ' 首');
  console.log('  管理员: admin / admin');
}

seed().catch(err => {
  console.error('Seed 失败:', err);
  process.exit(1);
});