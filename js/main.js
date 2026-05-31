/**
 * main.js v2 — 入口 + 各 UI 模块
 * 已拆分至独立文件：utils.js, data.js, theme.js, search.js
 * 依赖顺序：utils.js → data.js → theme.js → search.js → main.js
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  var C = window.CONFIG || {};
  var isPostPage = !!document.getElementById('post-content');

  /* ============================================================
   * BackgroundManager - 背景模式管理
   * ============================================================ */
  var BackgroundManager = (function () {
    var STORAGE_KEY = 'banner-mode', DEFAULT_MODE = 'normal';
    var BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';

    function applyBgMode(mode) {
      var $html = document.documentElement, $banner = document.querySelector('.banner'), $waves = document.querySelector('.waves');
      localStorage.setItem(STORAGE_KEY, mode);
      $html.setAttribute('data-banner-mode', mode);
      updateActiveButton(mode);
      switch (mode) {
        case 'normal':
          document.body.style.background = '';
          if ($banner) $banner.style.height = '';
          if ($waves) $waves.style.display = 'block';
          break;
        case 'fullscreen':
          document.body.style.background = '';
          if ($banner) $banner.style.height = '100vh';
          if ($waves) $waves.style.display = 'none';
          break;
        case 'background':
          document.body.style.background = 'url(' + BACKGROUND_IMAGE + ') center/cover fixed';
          if ($banner) $banner.style.height = '20vh';
          if ($waves) $waves.style.display = 'none';
          break;
        case 'hide':
          document.body.style.background = '';
          if ($banner) { $banner.style.height = '40vh'; $banner.style.background = 'linear-gradient(135deg, oklch(var(--p)) 0%, oklch(var(--s)) 100%)'; }
          if ($waves) $waves.style.display = 'block';
          break;
      }
    }

    function updateActiveButton(mode) {
      ['bg-banner', 'bg-fullscreen', 'bg-background', 'bg-hide'].forEach(function (id) {
        var btn = document.getElementById(id);
        if (btn) btn.classList.toggle('bg-base-200', id === 'bg-' + (mode === 'normal' ? 'banner' : mode));
      });
    }

    function initButtons() {
      var btnBanner = document.getElementById('bg-banner'); if (btnBanner) btnBanner.addEventListener('click', function () { applyBgMode('normal'); });
      var btnFs = document.getElementById('bg-fullscreen'); if (btnFs) btnFs.addEventListener('click', function () { applyBgMode('fullscreen'); });
      var btnBg = document.getElementById('bg-background'); if (btnBg) btnBg.addEventListener('click', function () { applyBgMode('background'); });
      var btnHide = document.getElementById('bg-hide'); if (btnHide) btnHide.addEventListener('click', function () { applyBgMode('hide'); });
    }

    applyBgMode(localStorage.getItem(STORAGE_KEY) || DEFAULT_MODE);
    initButtons();
  })();

  /* ============================================================
   * NavbarScroll - 导航栏滚动隐藏/显示
   * ============================================================ */
  var NavbarScroll = (function () {
    var $navbar = document.getElementById('navbar-desktop');
    if (!$navbar) return;
    var lastScrollY = window.scrollY, ticking = false;
    var TH = C.NAVBAR_SCROLL_THRESHOLD || 10;

    function update() {
      var s = window.scrollY;
      if (Math.abs(s - lastScrollY) < TH) { ticking = false; return; }
      if (s > lastScrollY && s > 80) { $navbar.classList.add('opacity-0', 'pointer-events-none'); $navbar.classList.remove('opacity-100'); }
      else { $navbar.classList.remove('opacity-0', 'pointer-events-none'); $navbar.classList.add('opacity-100'); }
      lastScrollY = s; ticking = false;
    }

    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });

    var touchStartY = 0;
    document.addEventListener('touchstart', function (e) { touchStartY = e.touches[0].clientY; }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      var d = touchStartY - e.touches[0].clientY;
      if (Math.abs(d) > TH) {
        if (d > 0 && window.scrollY > 80) { $navbar.classList.add('opacity-0', 'pointer-events-none'); $navbar.classList.remove('opacity-100'); }
        else { $navbar.classList.remove('opacity-0', 'pointer-events-none'); $navbar.classList.add('opacity-100'); }
      }
    }, { passive: true });
  })();

  /* ============================================================
   * NavbarHover - 导航栏鼠标悬停
   * ============================================================ */
  var NavbarHover = (function () {
    var $nav = document.getElementById('navbar-desktop');
    if (!$nav) return;
    var dimTimer = null;
    $nav.setAttribute('data-nav-dimmed', 'true');
    $nav.addEventListener('mouseenter', function () { clearTimeout(dimTimer); $nav.setAttribute('data-nav-dimmed', 'false'); });
    $nav.addEventListener('mouseleave', function () { dimTimer = setTimeout(function () { $nav.setAttribute('data-nav-dimmed', 'true'); }, 400); });
    $nav.querySelectorAll('.dropdown-content').forEach(function ($dd) {
      $dd.addEventListener('mouseenter', function () { clearTimeout(dimTimer); });
      $dd.addEventListener('mouseleave', function () { dimTimer = setTimeout(function () { $nav.setAttribute('data-nav-dimmed', 'true'); }, 400); });
    });
  })();

  /* ============================================================
   * Typewriter - 打字机效果
   * ============================================================ */
  var Typewriter = (function () {
    var $el = document.getElementById('typewriter-text');
    if (!$el) return;
    var TEXTS = ['🌸 欲买桂花同载酒，终不似，少年游！', '🌸 花有重开日，人无再少年！', '🌿 记录生活的点滴，分享美好的瞬间！', '📚 纸上得来终觉浅，绝知此事要躬行！'];
    var TS = C.TYPEWRITER_SPEED || 150, DS = C.TYPEWRITER_DELETE_SPEED || 50, PA = C.TYPEWRITER_PAUSE || 2500;
    var textIndex = 0, charIndex = 0, isDeleting = false, timer = null;

    function type() {
      var text = TEXTS[textIndex];
      if (isDeleting) {
        charIndex--; $el.textContent = text.substring(0, charIndex);
        if (charIndex === 0) { isDeleting = false; textIndex = (textIndex + 1) % TEXTS.length; timer = setTimeout(type, 500); return; }
        timer = setTimeout(type, DS);
      } else {
        charIndex++; $el.textContent = text.substring(0, charIndex);
        if (charIndex === text.length) { isDeleting = true; timer = setTimeout(type, PA); return; }
        timer = setTimeout(type, TS);
      }
    }

    timer = setTimeout(type, 800);
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else timer = setTimeout(type, 300); });
  })();

  /* ============================================================
   * BannerCarousel - 动态 API 随机图片轮播
   * ============================================================ */
  var BannerCarousel = (function () {
    var $banner = document.getElementById('banner'), $bgCurrent = document.getElementById('banner-bg-current'), $bgNext = document.getElementById('banner-bg-next');
    if (!$banner || !$bgCurrent || !$bgNext) return;
    var API_URL = C.BANNER_API_URL || 'https://t.alcy.cc/ycy';
    var INTERVAL = C.BANNER_INTERVAL || 6000;
    var FADE_DURATION = C.BANNER_FADE_DURATION || 800;
    var isCurrentActive = true, carouselTimer = null, isPaused = false, isTransitioning = false;

    function preloadImage(url) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { resolve(img); };
        img.onerror = function () { reject(new Error('Failed to load: ' + url)); };
        img.src = url;
      });
    }

    function getRandomUrl() { return API_URL + '?t=' + Date.now(); }

    async function switchBanner() {
      if (isTransitioning || isPaused) return;
      isTransitioning = true;
      try {
        var url = getRandomUrl();
        await preloadImage(url);
        var $active = isCurrentActive ? $bgCurrent : $bgNext;
        var $inactive = isCurrentActive ? $bgNext : $bgCurrent;
        $inactive.style.backgroundImage = 'url(' + url + ')';
        $inactive.classList.remove('opacity-0'); $inactive.classList.add('opacity-100');
        $active.classList.remove('opacity-100'); $active.classList.add('opacity-0');
        await new Promise(function (r) { setTimeout(r, FADE_DURATION); });
        isCurrentActive = !isCurrentActive;
      } catch (e) { console.warn('轮播切换失败:', e); }
      isTransitioning = false;
      if (!isPaused) scheduleNext();
    }

    function scheduleNext() { clearTimeout(carouselTimer); carouselTimer = setTimeout(switchBanner, INTERVAL); }

    function pause() { isPaused = true; clearTimeout(carouselTimer); }
    function resume() { isPaused = false; scheduleNext(); }

    document.addEventListener('visibilitychange', function () { document.hidden ? pause() : resume(); });
    var observer = new IntersectionObserver(function (entries) { entries[0].isIntersecting ? resume() : pause(); }, { threshold: 0.1 });
    observer.observe($banner);

    $bgCurrent.style.backgroundImage = 'url(' + getRandomUrl() + ')';
    $bgCurrent.classList.add('opacity-100');
    scheduleNext();
  })();

  /* ============================================================
   * Sidebar - 侧边栏展开/折叠
   * ============================================================ */
  var Sidebar = (function () {
    var $sidebar = document.getElementById('sidebar');
    var $toc = document.getElementById('toc-section');
    if ($sidebar && !isPostPage) {
      var bp = C.SIDEBAR_BREAKPOINT || 1024;
      var $sidebarToggler = document.getElementById('sidebar-toggler');
      function setCollapsed(c) {
        if (c) { $sidebar.classList.add('collapsed-sidebar'); $sidebar.setAttribute('data-collapsed', 'true'); }
        else { $sidebar.classList.remove('collapsed-sidebar'); $sidebar.setAttribute('data-collapsed', 'false'); }
      }
      if ($sidebarToggler) $sidebarToggler.addEventListener('click', function () { setCollapsed($sidebar.getAttribute('data-collapsed') !== 'true'); });
      function autoCollapse() { setCollapsed(window.innerWidth < bp); }
      autoCollapse(); window.addEventListener('resize', autoCollapse);
    }
    if ($toc) {
      var closeBtn = document.getElementById('toc-close');
      if (closeBtn) closeBtn.addEventListener('click', function () { var btn = document.getElementById('toc-toggle'); if (btn) btn.click(); });
    }
  })();

  /* ============================================================
   * BackToTop - 回到顶部
   * ============================================================ */
  var BackToTop = (function () {
    var $btn = document.getElementById('back-to-top');
    if (!$btn) return;
    window.addEventListener('scroll', function () { $btn.style.display = window.scrollY > 400 ? 'flex' : 'none'; }, { passive: true });
    $btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  })();

  /* ============================================================
   * MobileMenu - 移动端菜单
   * ============================================================ */
  var MobileMenu = (function () {
    var $hamburger = document.getElementById('mobile-menu-toggle');
    var $menu = document.getElementById('mobile-menu');
    if (!$hamburger || !$menu) return;
    var isOpen = false;

    function openMenu() {
      isOpen = true; $menu.classList.remove('hidden');
      requestAnimationFrame(function () { $menu.classList.add('active'); $hamburger.classList.add('active'); document.body.classList.add('overflow-hidden'); });
    }

    function closeMenu() {
      isOpen = false; $menu.classList.remove('active'); $hamburger.classList.remove('active'); document.body.classList.remove('overflow-hidden');
      setTimeout(function () { $menu.classList.add('hidden'); }, 300);
      $menu.querySelectorAll('.dropdown-content').forEach(function (dd) { dd.classList.add('hidden'); });
    }

    $hamburger.addEventListener('click', function () { isOpen ? closeMenu() : openMenu(); });

    $menu.querySelectorAll('.dropdown-toggle-mobile').forEach(function ($toggle) {
      $toggle.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); var $content = this.nextElementSibling; if ($content && $content.classList.contains('dropdown-content')) $content.classList.toggle('hidden'); });
    });

    document.addEventListener('click', function (e) { if (isOpen && !$menu.contains(e.target) && !$hamburger.contains(e.target)) closeMenu(); });
    var resizeTimer;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { if (window.innerWidth >= 768 && isOpen) closeMenu(); }, 200); });
  })();

  /* ============================================================
   * PageAnimation - 页面滚动渐入动画
   * ============================================================ */
  var PageAnimation = (function () {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('animate-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) { observer.observe(el); });
  })();

  /* ============================================================
   * AnnouncementBar - 公告栏
   * ============================================================ */
  var AnnouncementBar = (function () {
    var $bar = document.getElementById('announcement-bar');
    if (!$bar) return;
    var $close = $bar.querySelector('.announcement-close');
    var dismissed = localStorage.getItem('announcement-dismissed');
    if (dismissed) { $bar.style.display = 'none'; return; }
    $bar.style.display = 'block';
    if ($close) {
      $close.addEventListener('click', function () { $bar.style.display = 'none'; localStorage.setItem('announcement-dismissed', '1'); });
    }
  })();

  /* ============================================================
   * ShareManager - 社交分享
   * ============================================================ */
  var ShareManager = (function () {
    document.querySelectorAll('.share-btn').forEach(function ($btn) {
      $btn.addEventListener('click', function (e) {
        e.preventDefault();
        var platform = this.getAttribute('data-share'), url = window.location.href, title = document.title;
        var shareUrls = {
          weibo: 'http://service.weibo.com/share/share.php?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title),
          twitter: 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title),
          qq: 'https://connect.qq.com/widget/shareqq/index.html?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title),
          copy: url
        };
        if (platform === 'copy') { navigator.clipboard.writeText(url).then(function () { alert('链接已复制！'); }); return; }
        if (shareUrls[platform]) window.open(shareUrls[platform], '_blank', 'width=600,height=450');
      });
    });
  })();

  /* ============================================================
   * ReadingProgress - 阅读进度条
   * ============================================================ */
  var ReadingProgress = (function () {
    var $bar = document.getElementById('reading-progress');
    if (!$bar) return;
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      $bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }, { passive: true });
  })();

  /* ============================================================
   * MiniPlayer - 移动端迷你播放器
   * ============================================================ */
  var MiniPlayer = (function () {
    var $player = document.getElementById('mini-player');
    if (!$player) return;
    var TH = C.MINIPLAYER_SCROLL_THRESHOLD || 600;
    window.addEventListener('scroll', function () {
      var shouldMini = window.scrollY > TH;
      $player.classList.toggle('mini-player-visible', shouldMini);
    }, { passive: true });
  })();

  /* ============================================================
   * LikeAndViews - 点赞与阅读量
   * ============================================================ */
  var LikeAndViews = (function () {
    document.querySelectorAll('.like-btn').forEach(function ($btn) {
      var id = $btn.getAttribute('data-post-id');
      if (!id) return;
      var key = 'like-' + id;
      if (localStorage.getItem(key)) $btn.classList.add('liked');
      $btn.addEventListener('click', function () {
        if (localStorage.getItem(key)) return;
        localStorage.setItem(key, '1');
        var $count = this.querySelector('.like-count');
        if ($count) $count.textContent = (parseInt($count.textContent) + 1);
        this.classList.add('liked');
      });
    });
  })();

  /* ============================================================
   * VisitorStats - 访客统计（本地计数）
   * ============================================================ */
  var VisitorStats = (function () {
    var $el = document.getElementById('visitor-count');
    if (!$el) return;
    var key = 'site-visitor-count', sessionKey = 'visitor-session-' + new Date().toDateString();
    if (!sessionStorage.getItem(sessionKey)) {
      var count = parseInt(localStorage.getItem(key) || '0', 10) + 1;
      localStorage.setItem(key, count);
      sessionStorage.setItem(sessionKey, '1');
      $el.textContent = count;
    } else {
      var saved = localStorage.getItem(key) || '0';
      $el.textContent = saved;
    }
  })();

  /* ============================================================
   * DynamicSEO - 动态 SEO 标题
   * ============================================================ */
  var DynamicSEO = (function () {
    if (isPostPage) {
      var titleEl = document.querySelector('.post-title');
      if (titleEl) document.title = titleEl.textContent.trim() + ' - 欲买桂花同载酒';
    }
  })();

  /* ============================================================
   * CodeCopy - 代码块复制按钮
   * ============================================================ */
  var CodeCopy = (function () {
    document.querySelectorAll('pre code').forEach(function ($code) {
      var $pre = $code.parentElement;
      var $wrapper = document.createElement('div');
      $wrapper.style.position = 'relative';
      $pre.parentNode.insertBefore($wrapper, $pre);
      $wrapper.appendChild($pre);
      var $btn = document.createElement('button');
      $btn.className = 'code-copy-btn';
      $btn.innerHTML = '<span class="iconify" data-icon="lucide:copy"></span>';
      $btn.title = '复制代码';
      $wrapper.appendChild($btn);
      $btn.addEventListener('click', function () {
        navigator.clipboard.writeText($code.textContent).then(function () {
          $btn.innerHTML = '<span class="iconify" data-icon="lucide:check"></span>';
          setTimeout(function () { $btn.innerHTML = '<span class="iconify" data-icon="lucide:copy"></span>'; }, 2000);
        });
      });
    });
  })();

  /* ============================================================
   * EntertainmentDropdown - 娱乐下拉菜单
   * ============================================================ */
  var EntertainmentDropdown = (function () {
    document.querySelectorAll('.entertainment-trigger').forEach(function ($trigger) {
      var $dd = $trigger.nextElementSibling;
      if (!$dd || !$dd.classList.contains('dropdown-content')) return;
      $trigger.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); $dd.classList.toggle('hidden'); });
      document.addEventListener('click', function () { $dd.classList.add('hidden'); });
    });
  })();

  /* ============================================================
   * PostRenderer - 首页文章渲染（仅在首页）
   * ============================================================ */
  if (!isPostPage && !document.getElementById('search-results')) {
    (async function () {
      if (!window.DataManager) { console.warn('首页：DataManager 未加载'); return; }
      var posts = await window.DataManager.fetchPosts();
      var $container = document.getElementById('posts-container');
      var $skeleton = document.getElementById('skeleton-container');
      var filteredPosts = posts.slice();
      var activeCategory = null, activeTag = null;

      function renderPost(post) {
        var hasImage = post.image;
        var postUrl = post.directUrl ? './' + window.escHtml(post.directUrl) : './pages/post.html?id=' + encodeURIComponent(post.id);
        var postTitle = window.escHtml(post.title);
        var postDate = window.escHtml(post.date);
        var postReadTime = window.escHtml(post.readTime);
        var postExcerpt = window.escHtml(post.excerpt || '');
        var postCategory = post.category ? window.escHtml(post.category) : '';
        var postTags = (post.tags || []).map(function (t) { return window.escHtml(t); });
        var postImage = post.image ? window.escHtml(post.image) : '';

        if (hasImage) {
          return '<article class="card-base flex flex-col sm:flex-row overflow-hidden animate-on-scroll"><a href="' + postUrl + '" class="relative w-full sm:w-1/3 aspect-video overflow-hidden group">' +
            '<div class="absolute inset-0 bg-black/0 group-hover:bg-black/60 z-10 transition-all duration-300 flex items-center justify-center">' +
            '<span class="iconify w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2" data-icon="lucide:arrow-right"></span></div>' +
            window.imgWithLazy(postImage, postTitle) + '</a>' +
            '<div class="flex-1 p-4 overflow-hidden flex flex-col">' +
            '<div class="mb-3"><a href="' + postUrl + '" class="ryuchan-heading">' + postTitle + '</a></div>' +
            '<div class="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-base-content/70 mb-3 opacity-75">' +
            '<span class="flex items-center gap-1"><span class="iconify h-4 w-4 flex-shrink-0" data-icon="lucide:calendar"></span><span class="truncate">' + postDate + '</span></span>' +
            '<div class="flex items-center gap-1"><span class="iconify h-4 w-4 flex-shrink-0" data-icon="lucide:book-open"></span><span class="truncate">' + postReadTime + '</span></div></div>' +
            '<p class="text-sm text-base-content/70 mb-3 line-clamp-2">' + postExcerpt + '</p>' +
            '<div class="flex flex-wrap gap-2 mt-auto">' +
            (postCategory ? '<button class="btn btn-xs btn-category rounded-lg category-filter-btn" data-category="' + postCategory + '">' + postCategory + '</button>' : '') +
            postTags.map(function (tag) { return '<button class="btn btn-xs btn-tag rounded-lg tag-filter-btn" data-tag="' + tag + '">' + tag + '</button>'; }).join('') +
            '</div></div></article>';
        }
        return '<article class="card-base p-5 animate-on-scroll"><div class="mb-3"><a href="' + postUrl + '" class="ryuchan-heading">' + postTitle + '</a></div>' +
          '<div class="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-base-content/70 mb-3 opacity-75">' +
          '<span class="flex items-center gap-1"><span class="iconify h-4 w-4 flex-shrink-0" data-icon="lucide:calendar"></span><span class="truncate">' + postDate + '</span></span>' +
          '<div class="flex items-center gap-1"><span class="iconify h-4 w-4 flex-shrink-0" data-icon="lucide:book-open"></span><span class="truncate">' + postReadTime + '</span></div></div>' +
          '<p class="text-sm text-base-content/70 mb-3 line-clamp-2">' + postExcerpt + '</p>' +
          '<div class="flex flex-wrap gap-2 mt-auto">' +
          (postCategory ? '<button class="btn btn-xs btn-category rounded-lg category-filter-btn" data-category="' + postCategory + '">' + postCategory + '</button>' : '') +
          postTags.map(function (tag) { return '<button class="btn btn-xs btn-tag rounded-lg tag-filter-btn" data-tag="' + tag + '">' + tag + '</button>'; }).join('') +
          '</div></article>';
      }

      function renderAll() {
        if ($skeleton) $skeleton.style.display = 'none';
        var html = filteredPosts.length > 0
          ? filteredPosts.map(renderPost).join('')
          : '<div class="text-center py-20 text-base-content/50"><span class="iconify text-5xl mb-3" data-icon="material-symbols:search-off-outline"></span><p class="text-lg">没有找到匹配的文章</p></div>';
        window.safeSetHTML($container, html);
        if (window.iconify) { setTimeout(function () { try { window.iconify.scan(); } catch (e) { } }, 100); }
        window.injectLazyImages($container);
        document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
          new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('animate-visible'); } });
          }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }).observe(el);
        });
        bindFilterButtons();
      }

      function applyFilter() {
        filteredPosts = posts.slice();
        if (activeCategory) filteredPosts = filteredPosts.filter(function (p) { return p.category === activeCategory; });
        if (activeTag) filteredPosts = filteredPosts.filter(function (p) { return (p.tags || []).indexOf(activeTag) !== -1; });
        renderAll();
        renderSidebar();
      }

      var SidebarRenderer = (function () {
        var $catList = document.getElementById('category-list');
        var $tagList = document.getElementById('tag-list');

        function renderCategories() {
          if (!$catList) return;
          var stats = window.DataManager.getCategoryStats(filteredPosts);
          var sorted = Object.entries(stats).sort(function (a, b) { return b[1] - a[1]; });
          if (sorted.length === 0) { window.safeSetHTML($catList, '<div class="text-sm text-base-content/50 text-center py-2">暂无分类</div>'); return; }
          var html = '';
          sorted.forEach(function (entry) {
            var cat = window.escHtml(entry[0]), count = entry[1];
            html += '<button class="w-full h-10 rounded-lg bg-none hover:bg-base-200 active:bg-base-300 transition-all pl-2 hover:pl-3 text-base-content hover:text-primary category-sidebar-btn" data-category="' + cat + '"><div class="flex items-center justify-between relative mr-2"><div class="overflow-hidden text-left whitespace-nowrap overflow-ellipsis">' + cat + '</div><div class="transition px-2 h-7 ml-4 min-w-[2rem] rounded-lg text-sm font-bold text-base-content bg-base-200 flex items-center justify-center">' + count + '</div></div></button>';
          });
          window.safeSetHTML($catList, html);
          bindSidebarButtons();
        }

        function renderTags() {
          if (!$tagList) return;
          var tags = window.DataManager.getTagStats(filteredPosts);
          if (tags.length === 0) { window.safeSetHTML($tagList, '<div class="text-sm text-base-content/50 text-center py-2">暂无标签</div>'); return; }
          var html = '';
          tags.forEach(function (entry) {
            var tag = window.escHtml(entry[0]), count = entry[1];
            html += '<button class="h-6 text-xs px-2 rounded-md border border-secondary text-base-content hover:bg-secondary hover:text-secondary-content hover:scale-110 transition-all inline-flex items-center justify-center tag-sidebar-btn" data-tag="' + tag + '">' + tag + ' <span class="ml-1 opacity-60">' + count + '</span></button>';
          });
          window.safeSetHTML($tagList, html);
          bindSidebarButtons();
        }

        function bindSidebarButtons() {
          document.querySelectorAll('.category-sidebar-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
              activeCategory = this.getAttribute('data-category');
              document.querySelectorAll('.category-sidebar-btn').forEach(function (b) { b.classList.toggle('font-bold', b === btn); });
              applyFilter();
            });
          });
          document.querySelectorAll('.tag-sidebar-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
              activeTag = this.getAttribute('data-tag');
              applyFilter();
            });
          });
        }

        return { renderCategories: renderCategories, renderTags: renderTags };
      })();

      function renderSidebar() {
        SidebarRenderer.renderCategories();
        SidebarRenderer.renderTags();
      }

      function bindFilterButtons() {
        document.querySelectorAll('.category-filter-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            activeCategory = this.getAttribute('data-category');
            activeTag = null;
            applyFilter();
          });
        });
        document.querySelectorAll('.tag-filter-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            activeTag = this.getAttribute('data-tag');
            activeCategory = null;
            applyFilter();
          });
        });
      }

      var SearchFilter = (function () {
        var $input = document.getElementById('post-search-input');
        if (!$input) return;
        $input.addEventListener('input', window.debounce(function () {
          var q = this.value.trim().toLowerCase();
          if (!q) { activeCategory = null; activeTag = null; filteredPosts = posts.slice(); }
          else {
            filteredPosts = posts.filter(function (p) {
              return p.title.toLowerCase().indexOf(q) !== -1 || (p.excerpt || '').toLowerCase().indexOf(q) !== -1 ||
                (p.tags || []).some(function (t) { return t.toLowerCase().indexOf(q) !== -1; }) || (p.category || '').toLowerCase().indexOf(q) !== -1;
            });
          }
          renderAll();
        }, C.SEARCH_DEBOUNCE_MS || 300));
      })();

      var RSSGenerator = (function () {
        var $btn = document.getElementById('rss-btn');
        if ($btn) {
          $btn.addEventListener('click', function () {
            var rss = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>欲买桂花同载酒</title><link>' + window.location.origin + '</link><description>个人博客</description>';
            posts.forEach(function (p) {
              rss += '<item><title>' + window.escHtml(p.title) + '</title><link>' + window.location.origin + '/pages/post.html?id=' + encodeURIComponent(p.id) + '</link><description>' + window.escHtml(p.excerpt || '') + '</description><pubDate>' + (p.date || '') + '</pubDate></item>';
            });
            rss += '</channel></rss>';
            var blob = new Blob([rss], { type: 'application/rss+xml' });
            var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'feed.xml'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(a.href);
          });
        }
      })();

      var SitemapGenerator = (function () {
        var $btn = document.getElementById('sitemap-btn');
        if ($btn) {
          $btn.addEventListener('click', function () {
            var sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
            sitemap += '<url><loc>' + window.location.origin + '</loc><changefreq>daily</changefreq><priority>1.0</priority></url>';
            posts.forEach(function (p) {
              sitemap += '<url><loc>' + window.location.origin + '/pages/post.html?id=' + encodeURIComponent(p.id) + '</loc><lastmod>' + (p.date || '') + '</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>';
            });
            sitemap += '</urlset>';
            var blob = new Blob([sitemap], { type: 'application/xml' });
            var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sitemap.xml'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(a.href);
          });
        }
      })();

      renderAll();
      renderSidebar();
    })();
  }

  /* ============================================================
   * 全局初始化：图片懒加载 & 移动端导航手势
   * ============================================================ */
  if (window.initLazyFallback) {
    setTimeout(function () { window.initLazyFallback(); }, 500);
    if (window.MutationObserver) {
      new MutationObserver(function () { window.initLazyFallback(); }).observe(document.body, { childList: true, subtree: true });
    }
  }

  // 移动端底部导航滑动切换
  if (window.initMobileSwipe) {
    var $mobileNav = document.querySelector('.mobile-nav-area');
    if ($mobileNav) {
      window.initMobileSwipe($mobileNav,
        function onSwipeLeft() {
          var navItems = ['/#home', '/#posts', '/pages/project.html', '/pages/links.html', '/pages/about.html'];
          var current = window.location.pathname + window.location.hash;
          var idx = navItems.indexOf(current);
          if (idx === -1) idx = 0;
          if (idx < navItems.length - 1) window.location.href = navItems[idx + 1];
        },
        function onSwipeRight() {
          var navItems = ['/#home', '/#posts', '/pages/project.html', '/pages/links.html', '/pages/about.html'];
          var current = window.location.pathname + window.location.hash;
          var idx = navItems.indexOf(current);
          if (idx === -1) idx = 0;
          if (idx > 0) window.location.href = navItems[idx - 1];
        }
      );
    }
  }

});