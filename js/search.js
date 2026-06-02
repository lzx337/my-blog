/**
 * search.js — SearchRenderer 搜索页渲染（带防抖）
 * 依赖：utils.js, data.js
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var isSearchPage = !!(document.getElementById('search-input') && document.getElementById('search-results'));
    if (!isSearchPage) return;

    if (!window.DataManager) { console.warn('搜索页：DataManager 未加载'); return; }

    (async function () {
      var $input = document.getElementById('search-input');
      var $results = document.getElementById('search-results');
      var $clear = document.getElementById('search-clear');
      var $count = document.getElementById('search-count');
      var allPosts = await window.DataManager.fetchPosts();
      var allContents = {};
      try {
        var stored = localStorage.getItem('admin-post-contents');
        if (stored) allContents = JSON.parse(stored);
      } catch(e) {}

      function renderSearchResults(posts) {
        if ($count) $count.textContent = '共找到 ' + posts.length + ' 篇相关文章';
        var existingItems = $results.querySelectorAll('.search-result-item');
        existingItems.forEach(function (el) { el.remove(); });
        var emptyMsg = $results.querySelector('.search-empty');
        if (emptyMsg) emptyMsg.remove();

        if (posts.length === 0) {
          $results.insertAdjacentHTML('beforeend',
            '<div class="search-empty text-center py-16 text-base-content/50">' +
            '<span class="iconify text-5xl mb-3" data-icon="material-symbols:search-off-outline"></span>' +
            '<p class="text-lg">没有找到匹配的文章</p></div>');
          if (window.iconify) { setTimeout(function () { try { window.iconify.scan(); } catch (e) { } }, 100); }
          return;
        }

        var html = posts.map(renderSearchItem).join('');
        $results.insertAdjacentHTML('beforeend', html);
        if (window.iconify) { setTimeout(function () { try { window.iconify.scan(); } catch (e) { } }, 100); }
      }

      function renderSearchItem(post) {
        var postUrl = post.directUrl
          ? '../' + post.directUrl
          : 'post.html?id=' + encodeURIComponent(post.id);
        var icon = getCategoryIcon(post.category);
        var iconColors = getIconColors(post.category);
        return '<a href="' + postUrl + '" class="search-result-item card-base p-5 block">' +
          '<div class="flex items-start gap-4">' +
          '<div class="hidden sm:flex w-28 h-20 rounded-xl ' + iconColors + ' items-center justify-center flex-shrink-0">' +
          '<span class="iconify text-3xl" data-icon="' + icon + '"></span></div>' +
          '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center gap-2 mb-2">' +
          (post.category ? '<span class="badge badge-primary badge-sm">' + window.escHtml(post.category) + '</span>' : '') +
          '<span class="text-xs text-base-content/40">' + window.escHtml(post.date) + '</span></div>' +
          '<h3 class="text-lg font-bold text-base-content mb-1.5 hover:text-primary transition-colors">' + window.escHtml(post.title) + '</h3>' +
          '<p class="text-sm text-base-content/60 line-clamp-2">' + window.escHtml(post.excerpt || '') + '</p>' +
          '<div class="flex items-center gap-2 mt-3">' +
          (post.tags || []).map(function (t) { return '<span class="btn btn-xs btn-tag rounded-lg">' + window.escHtml(t) + '</span>'; }).join('') +
          '</div></div></div></a>';
      }

      function getCategoryIcon(cat) {
        var icons = { '教程': 'material-symbols:school-outline', '动漫': 'material-symbols:movie-outline', '技术': 'material-symbols:code-blocks-outline', '生活': 'material-symbols:emoji-nature-outline' };
        return icons[cat] || 'material-symbols:article-outline';
      }

      function getIconColors(cat) {
        var colors = { '教程': 'bg-gradient-to-br from-primary/20 to-secondary/20 text-primary', '动漫': 'bg-gradient-to-br from-error/20 to-warning/20 text-error', '技术': 'bg-gradient-to-br from-info/20 to-success/20 text-info', '生活': 'bg-gradient-to-br from-accent/20 to-warning/20 text-accent' };
        return colors[cat] || 'bg-gradient-to-br from-primary/20 to-secondary/20 text-primary';
      }

      function performSearch(query) {
        var q = query.toLowerCase().trim();
        var results = allPosts.slice();
        if (q) {
          results = results.filter(function (p) {
            var matchesTitle = p.title.toLowerCase().indexOf(q) !== -1;
            var matchesExcerpt = (p.excerpt || '').toLowerCase().indexOf(q) !== -1;
            var matchesTags = (p.tags || []).some(function (t) { return t.toLowerCase().indexOf(q) !== -1; });
            var matchesCategory = (p.category || '').toLowerCase().indexOf(q) !== -1;
            var matchesBody = (allContents[p.id] || '').toLowerCase().indexOf(q) !== -1;
            return matchesTitle || matchesExcerpt || matchesTags || matchesCategory || matchesBody;
          });
        }
        renderSearchResults(results);
      }

      var debouncedSearch = window.debounce(function () {
        performSearch($input.value);
        if ($clear) {
          $clear.style.display = $input.value ? '' : 'none';
          if ($input.value) { $clear.classList.add('opacity-100'); $clear.classList.remove('opacity-0'); }
          else { $clear.classList.remove('opacity-100'); $clear.classList.add('opacity-0'); }
        }
      }, window.CONFIG.SEARCH_DEBOUNCE_MS);

      renderSearchResults(allPosts);

      if ($input) $input.addEventListener('input', debouncedSearch);

      if ($clear) {
        $clear.addEventListener('click', function () {
          $input.value = '';
          $clear.style.display = 'none';
          $clear.classList.remove('opacity-100');
          $clear.classList.add('opacity-0');
          performSearch('');
        });
      }

      var urlParams = new URLSearchParams(window.location.search);
      var initQuery = urlParams.get('q') || '';
      if (initQuery) {
        $input.value = initQuery;
        if ($clear) { $clear.style.display = ''; $clear.classList.add('opacity-100'); $clear.classList.remove('opacity-0'); }
        performSearch(initQuery);
      }
    })();
  });
})();