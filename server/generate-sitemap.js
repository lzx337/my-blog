/**
 * generate-sitemap.js — 从 SQLite 数据库读取文章，生成 sitemap.xml
 * 用法:
 *   npm run sitemap          # 从数据库读取（需要服务器初始化过）
 *   node generate-sitemap.js --static  # 从 posts.json 读取（纯静态）
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');
const SITE_URL = process.env.SITE_URL || 'https://yqlch-blog.vercel.app';
const CHANGEFREQ_POST = 'monthly';
const CHANGEFREQ_PAGE = 'weekly';
const PRIORITY_HOME = '1.0';
const PRIORITY_POST = '0.8';
const PRIORITY_PAGE = '0.6';

async function getPosts() {
  var isStatic = process.argv.includes('--static');
  if (isStatic) {
    return getPostsFromJSON();
  }
  return getPostsFromDB();
}

async function getPostsFromDB() {
  try {
    var dbModule = require('./db');
    await dbModule.loadDB();
    dbModule.initSchema();
    return dbModule.postQueries.listPublished();
  } catch (e) {
    console.warn('[Sitemap] 数据库读取失败，回退到 posts.json:', e.message);
    return getPostsFromJSON();
  }
}

function getPostsFromJSON() {
  var jsonPaths = [
    path.join(__dirname, '..', 'posts.json'),
    path.join(__dirname, '..', 'public', 'posts.json')
  ];
  for (var i = 0; i < jsonPaths.length; i++) {
    if (fs.existsSync(jsonPaths[i])) {
      var raw = fs.readFileSync(jsonPaths[i], 'utf-8');
      return JSON.parse(raw);
    }
  }
  // 内置默认文章列表
  return [
    { id: 'git-install-push', title: 'Git 安装与推送到 GitHub', date: '2026-04-18', directUrl: null },
    { id: 'markdown-style-guide', title: 'Markdown 样式指南', date: '2026-04-17', directUrl: 'indextxt/Markdown 样式指南.html' },
    { id: 'chainsaw-man', title: '电锯人', date: '2026-04-16', directUrl: 'indextxt/电锯人.html' },
    { id: 'math-formula-demo', title: '数学公式示例', date: '2026-04-15', directUrl: 'indextxt/数学公式示例.html' },
    { id: 'add-comment-system', title: '添加评论系统', date: '2026-04-14', directUrl: 'indextxt/添加评论系统.html' },
    { id: 'mdx-component-demo', title: 'MDX 组件演示', date: '2026-04-13', directUrl: 'indextxt/MDX 组件演示.html' },
    { id: 'using-mdx', title: '使用 MDX', date: '2026-04-12', directUrl: 'indextxt/使用 MDX.html' }
  ];
}

function escapeXml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap(posts) {
  var lastmod = new Date().toISOString().split('T')[0];

  var urls = [];

  // 首页
  urls.push({
    loc: SITE_URL,
    lastmod: lastmod,
    changefreq: CHANGEFREQ_PAGE,
    priority: PRIORITY_HOME
  });

  // 主要页面
  var staticPages = [
    { path: '/pages/about.html', priority: PRIORITY_PAGE },
    { path: '/pages/archives.html', priority: PRIORITY_PAGE },
    { path: '/pages/categories.html', priority: PRIORITY_PAGE },
    { path: '/pages/tags.html', priority: PRIORITY_PAGE },
    { path: '/pages/project.html', priority: PRIORITY_PAGE },
    { path: '/pages/navigation.html', priority: PRIORITY_PAGE },
    { path: '/pages/music.html', priority: PRIORITY_PAGE },
    { path: '/pages/friend.html', priority: PRIORITY_PAGE },
    { path: '/pages/anime.html', priority: PRIORITY_PAGE },
    { path: '/pages/search.html', priority: PRIORITY_PAGE }
  ];
  staticPages.forEach(function (page) {
    urls.push({
      loc: SITE_URL + page.path,
      lastmod: lastmod,
      changefreq: 'monthly',
      priority: page.priority
    });
  });

  // 文章页
  posts.forEach(function (p) {
    var url = p.directUrl
      ? SITE_URL + '/' + p.directUrl.replace(/\\/g, '/')
      : SITE_URL + '/pages/post.html?id=' + encodeURIComponent(p.id);
    urls.push({
      loc: url,
      lastmod: p.date || lastmod,
      changefreq: CHANGEFREQ_POST,
      priority: PRIORITY_POST
    });
  });

  var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  urls.forEach(function (u) {
    xml += '  <url>\n';
    xml += '    <loc>' + escapeXml(u.loc) + '</loc>\n';
    xml += '    <lastmod>' + u.lastmod + '</lastmod>\n';
    xml += '    <changefreq>' + u.changefreq + '</changefreq>\n';
    xml += '    <priority>' + u.priority + '</priority>\n';
    xml += '  </url>\n';
  });
  xml += '</urlset>\n';

  return xml;
}

// ====== 主流程 ======
getPosts().then(function (posts) {
  var sitemap = buildSitemap(posts);
  fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf-8');
  console.log('✅ sitemap.xml 已生成: ' + SITEMAP_PATH);
  console.log('   共 ' + (1 + 10 + posts.length) + ' 条 URL');
  console.log('   首页:       1');
  console.log('   静态页面:  10');
  console.log('   文章:       ' + posts.length);
}).catch(function (err) {
  console.error('❌ 生成失败:', err.message);
  process.exit(1);
});