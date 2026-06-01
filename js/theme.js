(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var THEMES = [
      { name: 'cloud-white',     label: '云白清透', primary: '#E8EEF8', bg: '#FDFEFE', text: '#1F2937', textSecondary: '#6E7485', isDark: false },
      { name: 'peach-pink',      label: '蜜桃浅粉', primary: '#F29BB8', bg: '#FFF5F8', text: '#4A2E38', textSecondary: '#946B7C', isDark: false },
      { name: 'lime-mint',       label: '青柠薄荷', primary: '#76D7C4', bg: '#F2FCF9', text: '#234F44', textSecondary: '#5A8C7F', isDark: false },
      { name: 'sky-blue',        label: '晴空浅蓝', primary: '#74A9F2', bg: '#F5F9FF', text: '#273F60', textSecondary: '#627A9C', isDark: false },
      { name: 'soft-lavender',   label: '柔樱粉紫', primary: '#C898E8', bg: '#F8F4FC', text: '#3D2E4F', textSecondary: '#826F99', isDark: false },
      { name: 'warm-apricot',    label: '暖杏浅橙', primary: '#F7B787', bg: '#FFF8F2', text: '#5C3F2A', textSecondary: '#A07E62', isDark: false },
      { name: 'forest-light',    label: '森系浅绿', primary: '#89C997', bg: '#F4FAF5', text: '#2E4A33', textSecondary: '#678A6E', isDark: false },
      { name: 'star-night',      label: '星夜紫',   primary: '#8A70FF', bg: '#161728', text: '#F0EBFF', textSecondary: '#A89CCF', isDark: true },
      { name: 'ocean-blue',      label: '深海静谧蓝', primary: '#5B9CF2', bg: '#141E2F', text: '#E6F0FF', textSecondary: '#7A96BF', isDark: true },
      { name: 'dark-teal',       label: '暗夜青灰', primary: '#4ECDC4', bg: '#191C22', text: '#E4F8F6', textSecondary: '#73A8A2', isDark: true },
      { name: 'vintage-wine',    label: '复古酒红', primary: '#D86B8C', bg: '#241A1F', text: '#FFE8EF', textSecondary: '#A27282', isDark: true },
      { name: 'dark-orange',     label: '暗夜橙焰', primary: '#FF9A6C', bg: '#1F1A18', text: '#FFE9D9', textSecondary: '#B98C72', isDark: true },
      { name: 'misty-blue',      label: '雾境灰蓝', primary: '#8298D8', bg: '#1C1D29', text: '#E8EDF8', textSecondary: '#7A88A8', isDark: true },
      { name: 'forest-night',    label: '森夜墨绿', primary: '#59B977', bg: '#17201B', text: '#E2F2E6', textSecondary: '#6B9478', isDark: true }
    ];

    var STORAGE_KEY = 'blog-theme';
    var CUSTOM_KEY  = 'blog-custom-theme';
    var $html = document.documentElement;

    function hexToRgb(hex) {
      var v = parseInt(hex.slice(1), 16);
      return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
    }

    function applyTheme(themeName) {
      var theme = THEMES.find(function (t) { return t.name === themeName; });
      if (!theme) return;

      $html.setAttribute('data-theme', theme.isDark ? 'dark' : 'light');
      $html.setAttribute('data-theme-type', theme.isDark ? 'dark' : 'light');
      $html.setAttribute('data-theme-name', theme.name);

      var root = document.documentElement;
      root.style.setProperty('--theme-primary', theme.primary);
      root.style.setProperty('--theme-bg', theme.bg);
      root.style.setProperty('--theme-text', theme.text);
      root.style.setProperty('--theme-text-secondary', theme.textSecondary);
      root.style.setProperty('--custom-page-bg', theme.bg);

      var rgb = hexToRgb(theme.primary);
      root.style.setProperty('--theme-primary-rgb', rgb.join(', '));

      localStorage.setItem(STORAGE_KEY, themeName);
      updateModeButtons(theme.isDark);
      updateHighlightTheme(theme.isDark);
      window.__themeIsDark = theme.isDark;
    }

    function updateModeButtons(isDark) {
      var sunIcon = document.getElementById('sun-icon');
      var moonIcon = document.getElementById('moon-icon');
      if (sunIcon && moonIcon) {
        sunIcon.classList.toggle('hidden', isDark);
        moonIcon.classList.toggle('hidden', !isDark);
      }
      var modeLabel = document.getElementById('theme-mode-label');
      var modeText = document.getElementById('theme-mode-text');
      if (modeLabel) {
        var iconEl = modeLabel.querySelector('.iconify');
        if (iconEl) iconEl.setAttribute('data-icon', isDark ? 'material-symbols:dark-mode' : 'material-symbols:sunny');
        if (modeText) modeText.textContent = isDark ? '夜晚' : '白天';
        if (window.iconify) { try { window.iconify.scan(modeLabel); } catch(e) {} }
      }
    }

    function updateHighlightTheme(isDark) {
      var lightTheme = document.getElementById('hljs-light-theme');
      var darkTheme = document.getElementById('hljs-dark-theme');
      if (lightTheme && darkTheme) {
        if (isDark) { lightTheme.disabled = true; darkTheme.disabled = false; }
        else { lightTheme.disabled = false; darkTheme.disabled = true; }
      }
    }

    function toggleMode() {
      var current = localStorage.getItem(STORAGE_KEY) || 'cloud-white';
      var curTheme = THEMES.find(function (t) { return t.name === current; });
      var nextIsDark = !(curTheme ? curTheme.isDark : false);
      var candidate = THEMES.find(function (t) { return t.isDark === nextIsDark; });
      if (candidate) applyTheme(candidate.name);
    }

    function initThemeColors() {
      var lightSection = document.getElementById('theme-light-section');
      var darkSection = document.getElementById('theme-dark-section');
      if (!lightSection || !darkSection) return;
      lightSection.innerHTML = '';
      darkSection.innerHTML = '';
      THEMES.forEach(function (theme) {
        var wrapper = document.createElement('div');
        wrapper.className = 'flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-base-200 transition-colors cursor-pointer';
        wrapper.addEventListener('click', function () { applyTheme(theme.name); });
        var color = document.createElement('div');
        color.className = 'w-10 h-10 rounded-full ring-2 ring-base-300 ring-offset-2 ring-offset-base-100 transition-all hover:scale-110';
        color.style.background = theme.primary;
        var label = document.createElement('span');
        label.className = 'text-xs text-base-content/60 truncate max-w-[80px] text-center';
        label.textContent = theme.label;
        wrapper.appendChild(color);
        wrapper.appendChild(label);
        (theme.isDark ? darkSection : lightSection).appendChild(wrapper);
      });
    }

    function initModeButtons() {
      var toggleBtn = document.getElementById('theme-toggle');
      if (toggleBtn) toggleBtn.addEventListener('click', toggleMode);
      var mobileToggle = document.getElementById('theme-toggle-mobile');
      if (mobileToggle) mobileToggle.addEventListener('click', toggleMode);
    }

    var saved = localStorage.getItem(STORAGE_KEY);
    var valid = saved && THEMES.some(function (t) { return t.name === saved; });
    applyTheme(valid ? saved : 'cloud-white');
    initThemeColors();
    initModeButtons();
  });
})();