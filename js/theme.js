/**
 * theme.js — ThemeManager 主题管理（深色/浅色模式 + 代码高亮）
 * 依赖：utils.js（需先加载）
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var THEMES = [
      { name: 'light', label: '纯净白', color: '#ffffff', isDark: false },
      { name: 'cupcake', label: '马卡龙', color: '#fbcfe8', isDark: false },
      { name: 'emerald', label: '翡翠绿', color: '#34d399', isDark: false },
      { name: 'corporate', label: '商务蓝', color: '#3b82f6', isDark: false },
      { name: 'lemonade', label: '柠檬黄', color: '#84cc16', isDark: false },
      { name: 'garden', label: '花园绿', color: '#4ade80', isDark: false },
      { name: 'valentine', label: '粉红恋', color: '#ec4899', isDark: false },
      { name: 'retro', label: '复古风', color: '#ea580c', isDark: false },
      { name: 'dark', label: '深夜蓝', color: '#1e293b', isDark: true },
      { name: 'dracula', label: '德古拉', color: '#bd93f9', isDark: true },
      { name: 'synthwave', label: '赛博朋克', color: '#f472b6', isDark: true },
      { name: 'forest', label: '森林绿', color: '#22c55e', isDark: true },
      { name: 'night', label: '夜空紫', color: '#8b5cf6', isDark: true },
      { name: 'coffee', label: '咖啡棕', color: '#92400e', isDark: true },
      { name: 'sunset', label: '落日橙', color: '#f97316', isDark: true },
      { name: 'halloween', label: '万圣夜', color: '#fb923c', isDark: true }
    ];

    var STORAGE_KEY = 'blog-theme';
    var $html = document.documentElement;

    function applyTheme(themeName) {
      var theme = THEMES.find(function (t) { return t.name === themeName; });
      if (!theme) return;
      $html.setAttribute('data-theme', themeName);
      $html.setAttribute('data-theme-type', theme.isDark ? 'dark' : 'light');
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
      var currentTheme = localStorage.getItem(STORAGE_KEY) || 'light';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
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
        color.style.background = theme.color;
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
    applyTheme(saved && THEMES.find(function (t) { return t.name === saved; }) ? saved : 'light');
    initThemeColors();
    initModeButtons();
  });
})();