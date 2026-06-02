/**
 * data.js — DataManager 数据管理与缓存
 * 依赖：utils.js（需先加载）
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var isPostPage = !!document.getElementById('post-content');
    var isSearchPage = !!(document.getElementById('search-input') && document.getElementById('search-results'));

    window.DataManager = (function () {
      var cachedPosts = null;

      async function fetchPosts() {
        if (cachedPosts) return cachedPosts;
        try {
          var adminPosts = await getAdminOverrides();
          if (adminPosts && adminPosts.length > 0) {
            cachedPosts = adminPosts;
            return cachedPosts;
          }
          var basePath = (isPostPage || isSearchPage) ? '../' : './';
          var resp = await fetch(basePath + 'posts.json');
          if (!resp.ok) throw new Error('posts.json 加载失败');
          cachedPosts = await resp.json();
          return cachedPosts;
        } catch (err) {
          console.warn('posts.json 加载失败，使用内置数据:', err);
          cachedPosts = getFallbackPosts();
          return cachedPosts;
        }
      }

      async function getAdminOverrides() {
        var isFileProtocol = window.location.protocol === 'file:';
        var isGithubPages = window.location.hostname.includes('github.io');
        if (!isFileProtocol && !isGithubPages) {
          try {
            var resp = await fetch('https://YOUR_RAILWAY_APP.up.railway.app/api/posts/public');
            if (resp.ok) {
              var posts = await resp.json();
              if (posts && Array.isArray(posts) && posts.length > 0) {
                localStorage.setItem('admin-posts', JSON.stringify(posts));
                return posts;
              }
            }
          } catch (e) { }
        }
        try {
          var data = JSON.parse(localStorage.getItem('admin-posts') || 'null');
          if (data && Array.isArray(data) && data.length > 0) return data;
        } catch (e) { }
        return null;
      }

      function getFallbackPosts() {
        return [
          { id: 'git-install-push', title: 'Git 安装与推送到 GitHub', date: '2026-04-18', readTime: '216 字 · 1 分钟', excerpt: '首次仓库构建初始化与远程推送', category: '教程', tags: ['Git', 'GitHub'], image: 'assets/images/git/b9cb7653e82633e5.png' },
          { id: 'markdown-style-guide', title: 'Markdown 样式指南', date: '2026-04-17', readTime: '520 字 · 2 分钟', excerpt: '这是一篇Markdown样式指南，展示各种Markdown语法', category: null, tags: ['Markdown', '样式指南'], directUrl: 'indextxt/Markdown 样式指南.html' },
          { id: 'chainsaw-man', title: '电锯人', date: '2026-04-16', readTime: '180 字 · 1 分钟', excerpt: '关于电锯人动漫的感想与推荐', category: '动漫', tags: ['电锯人'], directUrl: 'indextxt/电锯人.html' },
          { id: 'math-formula-demo', title: '数学公式示例', date: '2026-04-15', readTime: '350 字 · 2 分钟', excerpt: '展示如何在 Markdown 中使用 LaTeX 语法书写数学公式', category: null, tags: ['数学公式'], directUrl: 'indextxt/数学公式示例.html' },
          { id: 'add-comment-system', title: '添加评论系统', date: '2026-04-14', readTime: '420 字 · 2 分钟', excerpt: '为博客添加评论功能', category: '教程', tags: ['评论系统'], directUrl: 'indextxt/添加评论系统.html' },
          { id: 'mdx-component-demo', title: 'MDX 组件演示', date: '2026-04-13', readTime: '600 字 · 3 分钟', excerpt: '演示如何在 MDX 中使用自定义 React 组件', category: '技术', tags: ['MDX'], directUrl: 'indextxt/MDX 组件演示.html' },
          { id: 'using-mdx', title: '使用 MDX', date: '2026-04-12', readTime: '280 字 · 1 分钟', excerpt: '介绍 MDX 的基本用法', category: '教程', tags: ['MDX', 'Markdown'], directUrl: 'indextxt/使用 MDX.html' }
        ];
      }

      function getCategoryStats(posts) {
        var stats = {};
        posts.forEach(function (p) { if (p.category) stats[p.category] = (stats[p.category] || 0) + 1; });
        return stats;
      }

      function getTagStats(posts) {
        var stats = {};
        posts.forEach(function (p) { (p.tags || []).forEach(function (tag) { stats[tag] = (stats[tag] || 0) + 1; }); });
        return Object.entries(stats).sort(function (a, b) { return b[1] - a[1]; });
      }

      function getPostById(posts, id) { return posts.find(function (p) { return p.id === id; }) || null; }

      return { fetchPosts: fetchPosts, getCategoryStats: getCategoryStats, getTagStats: getTagStats, getPostById: getPostById };
    })();

    // 文章页/搜索页预加载数据
    if (isPostPage || isSearchPage) {
      window.DataManager.fetchPosts();
    }
  });
})();