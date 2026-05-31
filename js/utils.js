/**
 * utils.js — 公共工具函数、配置常量、图片懒加载、移动端手势
 */
(function () {
  'use strict';

  // ==================== CONFIG ====================
  window.CONFIG = {
    // Banner 轮播
    BANNER_API_URL: 'https://t.alcy.cc/ycy',
    BANNER_INTERVAL: 6000,
    BANNER_FADE_DURATION: 800,

    // 打字机效果
    TYPEWRITER_SPEED: 80,
    TYPEWRITER_DELETE_SPEED: 40,
    TYPEWRITER_PAUSE: 2000,

    // 导航栏滚动
    NAVBAR_SCROLL_THRESHOLD: 10,

    // 迷你播放器
    MINIPLAYER_SCROLL_THRESHOLD: 600,

    // 侧边栏折叠断点
    SIDEBAR_BREAKPOINT: 1024,

    // 分页
    PAGE_SIZE: 10,

    // 缓存过期
    CACHE_TTL: 30 * 60 * 1000,

    // 搜索防抖
    SEARCH_DEBOUNCE_MS: 300,

    // 图片占位图
    IMG_PLACEHOLDER: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect fill="#e5e7eb" width="400" height="225"/><text fill="#9ca3af" font-family="sans-serif" font-size="16" text-anchor="middle" x="200" y="118">图片加载失败</text></svg>'),

    // 滑动阈值（像素）
    SWIPE_THRESHOLD: 60
  };

  // ==================== XSS 安全 ====================
  window.escHtml = function (s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  };

  window.safeSetHTML = function (el, html) {
    if (!el) return;
    if (typeof DOMPurify !== 'undefined') {
      el.innerHTML = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'em', 'strong', 'del', 'ins', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div', 'button', 'input', 'label', 'article', 'aside', 'nav', 'section', 'header', 'footer', 'main', 'svg', 'path', 'use', 'g', 'defs'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target', 'rel', 'type', 'checked', 'disabled', 'data-icon', 'data-url', 'data-category', 'data-tags', 'data-pg', 'data-id', 'data-real-idx', 'data-tab', 'data-sub', 'data-tip', 'onclick', 'role', 'tabindex', 'aria-label', 'viewBox', 'preserveAspectRatio', 'fill', 'd', 'x', 'y', 'width', 'height', 'xmlns', 'xlink:href', 'loading']
      });
    } else {
      el.innerHTML = html;
    }
  };

  // ==================== 图片 ====================
  function imgWithLazy(src, alt) {
    alt = alt || '';
    return '<img src="' + escHtml(src) + '" alt="' + escHtml(alt) + '" loading="lazy" class="w-full h-full object-cover" onerror="this.onerror=null;this.src=\'' + window.CONFIG.IMG_PLACEHOLDER + '\';this.classList.add(\'img-fallback\');">';
  }

  window.imgWithLazy = imgWithLazy;

  window.initLazyFallback = function () {
    document.querySelectorAll('img').forEach(function (img) {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('data-onerror-bound')) {
        img.setAttribute('data-onerror-bound', '1');
        img.addEventListener('error', function () {
          if (this.src !== window.CONFIG.IMG_PLACEHOLDER) {
            this.src = window.CONFIG.IMG_PLACEHOLDER;
            this.classList.add('img-fallback');
            this.style.objectFit = 'contain';
            this.style.background = '#f3f4f6';
          }
        });
      }
    });
  };

  // 给动态注入的 HTML 片段附加 lazy + onerror
  window.injectLazyImages = function (container) {
    if (!container) return;
    var imgs = container.querySelectorAll ? container.querySelectorAll('img') : [];
    imgs.forEach(function (img) {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.hasAttribute('data-onerror-bound')) {
        img.setAttribute('data-onerror-bound', '1');
        img.addEventListener('error', function () {
          if (this.src !== window.CONFIG.IMG_PLACEHOLDER) {
            this.src = window.CONFIG.IMG_PLACEHOLDER;
            this.classList.add('img-fallback');
            this.style.objectFit = 'contain';
            this.style.background = '#f3f4f6';
          }
        });
      }
    });
  };

  // ==================== 移动端手势 ====================
  window.initMobileSwipe = function (el, onSwipeLeft, onSwipeRight) {
    if (!el || (!onSwipeLeft && !onSwipeRight)) return;
    var startX = 0, startY = 0, isSwiping = false;

    el.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      isSwiping = true;
    }, { passive: true });

    el.addEventListener('touchmove', function (e) {
      if (!isSwiping) return;
      var t = e.touches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        e.preventDefault();
      }
    }, { passive: false });

    el.addEventListener('touchend', function (e) {
      if (!isSwiping) return;
      isSwiping = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      if (Math.abs(dx) < Math.abs(dy)) return;
      if (Math.abs(dx) < window.CONFIG.SWIPE_THRESHOLD) return;
      if (dx > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (dx < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    });
  };

  // ==================== 防抖 ====================
  window.debounce = function (fn, delay) {
    delay = delay || window.CONFIG.SEARCH_DEBOUNCE_MS;
    var timer = null;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  };

})();