/**
 * Qin Resume - Custom JavaScript
 * 修复轮播图片和主题切换功能
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
   * 1. ThemeManager - 主题管理
   * ============================================================ */
  const ThemeManager = (() => {
    const THEMES = [
      { name: 'light', label: 'Light', color: '#fef3c7', isDark: false },
      { name: 'dark', label: 'Dark', color: '#374151', isDark: true },
      { name: 'cupcake', label: 'Cupcake', color: '#fbcfe8', isDark: false },
      { name: 'bumblebee', label: 'Bumblebee', color: '#fcd34d', isDark: false },
      { name: 'emerald', label: 'Emerald', color: '#34d399', isDark: false },
      { name: 'corporate', label: 'Corporate', color: '#60a5fa', isDark: false },
      { name: 'synthwave', label: 'Synthwave', color: '#f472b6', isDark: true },
      { name: 'retro', label: 'Retro', color: '#f97316', isDark: true },
      { name: 'cyberpunk', label: 'Cyberpunk', color: '#a855f7', isDark: true },
      { name: 'valentine', label: 'Valentine', color: '#ec4899', isDark: true },
      { name: 'garden', label: 'Garden', color: '#4ade80', isDark: false },
      { name: 'forest', label: 'Forest', color: '#22c55e', isDark: true },
      { name: 'dracula', label: 'Dracula', color: '#bd93f9', isDark: true },
      { name: 'luxury', label: 'Luxury', color: '#fbbf24', isDark: true },
      { name: 'halloween', label: 'Halloween', color: '#fb923c', isDark: true },
      { name: 'coffee', label: 'Coffee', color: '#d97706', isDark: true },
      { name: 'business', label: 'Business', color: '#3b82f6', isDark: true },
      { name: 'night', label: 'Night', color: '#8b5cf6', isDark: true }
    ];

    const STORAGE_KEY = 'blog-theme';
    const DEFAULT_LIGHT = 'light';
    const DEFAULT_DARK = 'dark';

    const $html = document.documentElement;

    function applyTheme(themeName) {
      const theme = THEMES.find(t => t.name === themeName);
      if (!theme) return;
      
      $html.setAttribute('data-theme', themeName);
      $html.setAttribute('data-theme-type', theme.isDark ? 'dark' : 'light');
      localStorage.setItem(STORAGE_KEY, themeName);
      updateActiveMode(theme.isDark);
      updateThemeIcon(theme.isDark);
    }

    function updateActiveMode(isDark) {
      const lightBtn = document.getElementById('theme-light-mode');
      const darkBtn = document.getElementById('theme-dark-mode');
      
      if (lightBtn) {
        lightBtn.classList.toggle('bg-base-200', !isDark);
      }
      if (darkBtn) {
        darkBtn.classList.toggle('bg-base-200', isDark);
      }
    }

    function updateThemeIcon(isDark) {
      const themeIcon = document.getElementById('theme-icon');
      if (themeIcon) {
        themeIcon.setAttribute('data-icon', isDark ? 'material-symbols:light-mode-outline' : 'material-symbols:dark-mode-outline');
      }
      const mobileIcon = document.getElementById('theme-icon-mobile');
      if (mobileIcon) {
        mobileIcon.setAttribute('data-icon', isDark ? 'material-symbols:light-mode-outline' : 'material-symbols:dark-mode-outline');
      }
    }

    function initThemeColors() {
      const colorsSection = document.querySelector('#theme-colors-section');
      if (!colorsSection) return;

      THEMES.forEach(theme => {
        const button = document.createElement('button');
        button.className = 'w-8 h-8 rounded-full transition-all hover:scale-110 hover:ring-2 hover:ring-offset-1';
        button.style.background = theme.color;
        button.setAttribute('data-theme', theme.name);
        button.setAttribute('title', theme.label);
        button.addEventListener('click', () => applyTheme(theme.name));
        colorsSection.appendChild(button);
      });
    }

    function initModeButtons() {
      const lightBtn = document.getElementById('theme-light-mode');
      const darkBtn = document.getElementById('theme-dark-mode');
      const themeToggle = document.getElementById('theme-toggle');
      const themeToggleMobile = document.getElementById('theme-toggle-mobile');
      
      if (lightBtn) {
        lightBtn.addEventListener('click', () => applyTheme(DEFAULT_LIGHT));
      }
      if (darkBtn) {
        darkBtn.addEventListener('click', () => applyTheme(DEFAULT_DARK));
      }
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const currentTheme = $html.getAttribute('data-theme');
          const currentIsDark = $html.getAttribute('data-theme-type') === 'dark';
          applyTheme(currentIsDark ? DEFAULT_LIGHT : DEFAULT_DARK);
        });
      }
      if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', () => {
          const currentTheme = $html.getAttribute('data-theme');
          const currentIsDark = $html.getAttribute('data-theme-type') === 'dark';
          applyTheme(currentIsDark ? DEFAULT_LIGHT : DEFAULT_DARK);
        });
      }
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    const themeNames = THEMES.map(t => t.name);
    if (saved && themeNames.includes(saved)) {
      applyTheme(saved);
    } else {
      applyTheme(DEFAULT_LIGHT);
    }

    initThemeColors();
    initModeButtons();
  })();

  /* ============================================================
   * 2. BannerCarousel - Banner轮播（针对qin.html的修复版本）
   * ============================================================ */
  const BannerCarousel = (() => {
    const $bannerInner = document.querySelector('.banner-inner');
    if (!$bannerInner) return;

    const API_URL = 'https://t.alcy.cc/ycy';
    const INTERVAL = 6000;
    const FADE_DURATION = 1000;

    let currentImg = null;
    let nextImg = null;
    let carouselTimer = null;
    let isPaused = false;

    function preloadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    }

    function getRandomUrl() {
      return `${API_URL}?t=${Date.now()}`;
    }

    async function switchBanner() {
      if (isPaused) return;

      try {
        const url = getRandomUrl();
        await preloadImage(url);

        nextImg = new Image();
        nextImg.src = url;
        nextImg.style.cssText = `
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: cover; opacity: 0;
          transition: opacity ${FADE_DURATION}ms ease-in-out;
          z-index: 0;
        `;
        $bannerInner.style.position = 'relative';
        $bannerInner.appendChild(nextImg);

        // 触发淡入
        requestAnimationFrame(() => {
          nextImg.style.opacity = '1';
        });

        // 淡入完成后移除旧图
        setTimeout(() => {
          if (currentImg && currentImg.parentNode) {
            currentImg.parentNode.removeChild(currentImg);
          }
          currentImg = nextImg;
          nextImg = null;
        }, FADE_DURATION);

      } catch (err) {
        console.warn('Banner图片加载失败:', err);
      }
    }

    function startCarousel() {
      // 初始化第一张
      const initImg = new Image();
      initImg.src = getRandomUrl();
      initImg.style.cssText = `
        position: absolute; top: 0; left: 0;
        width: 100%; height: 100%;
        object-fit: cover;
        z-index: 0;
      `;
      $bannerInner.appendChild(initImg);
      currentImg = initImg;

      // 定时切换
      carouselTimer = setInterval(switchBanner, INTERVAL);
    }

    startCarousel();

    // 页面不可见时暂停
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isPaused = true;
        clearInterval(carouselTimer);
      } else {
        isPaused = false;
        carouselTimer = setInterval(switchBanner, INTERVAL);
      }
    });
  })();

  /* ============================================================
   * 3. BackToTop - 回到顶部
   * ============================================================ */
  const BackToTop = (() => {
    const $btn = document.getElementById('back-to-top');
    if (!$btn) return;

    const SHOW_THRESHOLD = 300;

    function toggleVisibility() {
      if (window.scrollY > SHOW_THRESHOLD) {
        $btn.classList.remove('opacity-0', 'pointer-events-none');
        $btn.classList.add('opacity-100');
      } else {
        $btn.classList.add('opacity-0', 'pointer-events-none');
        $btn.classList.remove('opacity-100');
      }
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    $btn.addEventListener('click', scrollToTop);

    toggleVisibility();
  })();

  /* ============================================================
   * 4. NavbarScroll - 导航栏滚动隐藏/显示
   * ============================================================ */
  const NavbarScroll = (() => {
    const $navbar = document.getElementById('navbar-desktop');
    if (!$navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const SCROLL_THRESHOLD = 10;

    function update() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (Math.abs(delta) < SCROLL_THRESHOLD) {
        ticking = false;
        return;
      }

      if (delta > 0 && currentScrollY > 80) {
        $navbar.classList.add('opacity-0', 'pointer-events-none');
        $navbar.classList.remove('opacity-100');
      } else {
        $navbar.classList.remove('opacity-0', 'pointer-events-none');
        $navbar.classList.add('opacity-100');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      const touchDelta = touchStartY - e.touches[0].clientY;
      if (Math.abs(touchDelta) > SCROLL_THRESHOLD) {
        if (touchDelta > 0 && window.scrollY > 80) {
          $navbar.classList.add('opacity-0', 'pointer-events-none');
          $navbar.classList.remove('opacity-100');
        } else {
          $navbar.classList.remove('opacity-0', 'pointer-events-none');
          $navbar.classList.add('opacity-100');
        }
      }
    }, { passive: true });
  })();

});
