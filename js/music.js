(function() {

  const STORAGE_KEY = 'ryuchan_music_state';

  const DEFAULT_SONGS = [
    { title: '青空旋律', artist: 'Takuya Matsumoto', album: '和风器乐集', duration: 218, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: '樱花小路', artist: 'Ryohei Shimoyama', album: '和风器乐集', duration: 261, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { title: '星夜漫步', artist: 'Yuki Nakamura', album: '和风器乐集', duration: 243, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { title: '晨曦微光', artist: 'Haruka Sato', album: '和风器乐集', duration: 195, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { title: '星炬不熄', artist: '星炬学院毕业生', album: '鸣潮先约电台', duration: 293, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { title: '夏日回忆', artist: 'Keiko Tanaka', album: '和风器乐集', duration: 236, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { title: '雨后晴空', artist: 'Sora Yamamoto', album: '和风器乐集', duration: 208, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { title: '花海漫游', artist: 'Rin Suzuki', album: '和风器乐集', duration: 274, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { title: '风之约定', artist: 'Mio Watanabe', album: '和风器乐集', duration: 251, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
    { title: '远航星的告别', artist: '鸣潮先约电台', album: '鸣潮先约电台', duration: 310, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
    { title: '月下轻语', artist: 'Aoi Kobayashi', album: '和风器乐集', duration: 225, file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' }
  ];

  function getSongs() {
    try {
      var adminSongs = JSON.parse(localStorage.getItem('admin-songs') || 'null');
      if (adminSongs && Array.isArray(adminSongs) && adminSongs.length > 0) return adminSongs;
    } catch(e) {}
    return DEFAULT_SONGS;
  }

  var SONGS = getSongs();

  function getMusicBasePath() {
    var path = window.location.pathname;
    if (path.includes('/pages/') || path.includes('/indextxt/')) {
      return '../music/';
    }
    return './music/';
  }

  function resolveAudioUrl(file) {
    if (/^https?:\/\//.test(file)) {
      return file;
    }
    return getMusicBasePath() + file;
  }

  let currentIndex = 4;
  let isPlaying = false;
  const audio = new Audio();
  let loopMode = 0;
  audio.volume = 0.7;
  let autoplayBlocked = false;
  let uiThrottleTimer = null;
  let playRequested = false;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function $(id) { return document.getElementById(id); }

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentIndex: currentIndex,
        currentTime: audio.currentTime || 0,
        wasPlaying: isPlaying
      }));
    } catch (e) {}
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function updateAllUI() {
    const song = SONGS[currentIndex];
    const now = formatTime(audio.currentTime);
    const total = formatTime(song.duration);
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    const pctStr = pct + '%';

    if ($('music-song-title')) {
      $('music-song-title').textContent = song.title;
    }
    if ($('music-song-artist')) {
      $('music-song-artist').textContent = song.artist + ' - ' + song.album;
    }
    if ($('music-song-album')) {
      $('music-song-album').textContent = song.album;
    }
    if ($('music-total-time')) {
      $('music-total-time').textContent = total;
    }
    if ($('music-current-time')) {
      $('music-current-time').textContent = now;
    }
    if ($('music-progress-fill')) {
      $('music-progress-fill').style.width = pctStr;
    }
    if ($('music-play-icon')) {
      $('music-play-icon').setAttribute('data-icon',
        isPlaying ? 'material-symbols:pause-circle-rounded' : 'material-symbols:play-circle-rounded');
    }

    if ($('music-title')) {
      $('music-title').textContent = song.title;
    }
    if ($('music-artist')) {
      $('music-artist').textContent = song.artist;
    }
    if ($('music-duration')) {
      $('music-duration').textContent = total;
    }
    if ($('music-current')) {
      $('music-current').textContent = now;
    }
    if ($('music-progress')) {
      $('music-progress').style.width = pctStr;
    }
    if ($('play-icon')) {
      $('play-icon').setAttribute('data-icon',
        isPlaying ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded');
    }

    if ($('music-loop-icon')) {
      const icons = ['material-symbols:repeat', 'material-symbols:repeat-one', 'material-symbols:repeat'];
      $('music-loop-icon').setAttribute('data-icon', icons[loopMode] || 'material-symbols:repeat');
      const tips = ['顺序播放', '单曲循环', '列表循环'];
      const btn = $('music-loop-btn');
      if (btn) {
        btn.setAttribute('data-tip', tips[loopMode] || '顺序播放');
        btn.classList.toggle('text-primary', loopMode > 0);
      }
    }

    document.querySelectorAll('.song-item[data-index]').forEach(function(item) {
      var idx = parseInt(item.getAttribute('data-index'), 10);
      var isActive = idx === currentIndex;
      item.classList.toggle('active', isActive);
      var nameEl = item.querySelector('.song-name');
      var artistEl = item.querySelector('.song-artist');
      var numEl = item.querySelector('.song-number');
      var iconEl = item.querySelector('.song-icon');
      if (isActive) {
        if (nameEl) { nameEl.classList.remove('text-base-content'); nameEl.classList.add('text-primary'); }
        if (artistEl) { artistEl.classList.remove('text-base-content/50'); artistEl.classList.add('text-primary/70'); }
        if (numEl) numEl.classList.add('hidden');
        if (iconEl) {
          iconEl.classList.remove('hidden');
          iconEl.setAttribute('data-icon',
            isPlaying ? 'material-symbols:equalizer-rounded' : 'material-symbols:pause-rounded');
        }
      } else {
        if (nameEl) { nameEl.classList.add('text-base-content'); nameEl.classList.remove('text-primary'); }
        if (artistEl) { artistEl.classList.add('text-base-content/50'); artistEl.classList.remove('text-primary/70'); }
        if (numEl) numEl.classList.remove('hidden');
        if (iconEl) iconEl.classList.add('hidden');
      }
    });
  }

  function loadSong(index, callback) {
    if (index < 0 || index >= SONGS.length) return;
    currentIndex = index;
    var song = SONGS[index];
    audio.src = resolveAudioUrl(song.file);
    audio.load();
    updateAllUI();
    if (callback) {
      if (audio.readyState >= 2) {
        callback();
      } else {
        var onReady = function() {
          audio.removeEventListener('canplay', onReady);
          audio.removeEventListener('loadeddata', onReady);
          callback();
        };
        audio.addEventListener('canplay', onReady, { once: true });
        audio.addEventListener('loadeddata', onReady, { once: true });
      }
    }
  }

  function play() {
    if (autoplayBlocked && !playRequested) return;
    playRequested = true;
    isPlaying = true;
    updateAllUI();
    audio.play().catch(function(err) {
      console.warn('播放失败:', err);
      isPlaying = false;
      playRequested = false;
      updateAllUI();
    });
  }

  function pause() {
    isPlaying = false;
    playRequested = false;
    updateAllUI();
    audio.pause();
  }

  function togglePlay() {
    if (isPlaying) pause(); else play();
  }

  function nextSong() {
    if (loopMode === 2) {
      currentIndex = (currentIndex + 1) % SONGS.length;
    } else {
      currentIndex = (currentIndex + 1) % SONGS.length;
      if (currentIndex === 0 && loopMode === 0) {
        pause();
        audio.currentTime = 0;
        updateAllUI();
        return;
      }
    }
    loadSong(currentIndex);
    play();
  }

  function prevSong() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      updateAllUI();
      return;
    }
    currentIndex = (currentIndex - 1 + SONGS.length) % SONGS.length;
    loadSong(currentIndex);
    play();
  }

  function toggleLoop() {
    loopMode = (loopMode + 1) % 3;
    updateAllUI();
  }

  function setupProgressBar(container) {
    if (!container) return;
    var isDragging = false;
    var progressFill = container.querySelector('.h-full') || container.querySelector('.bg-primary');

    function getPercent(e) {
      var rect = container.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var pct = (clientX - rect.left) / rect.width;
      if (pct < 0) pct = 0;
      if (pct > 1) pct = 1;
      return pct;
    }

    function setProgress(pct) {
      if (audio.duration) {
        audio.currentTime = pct * audio.duration;
        if (progressFill) {
          progressFill.style.width = (pct * 100) + '%';
        }
      }
    }

    function onStart(e) {
      isDragging = true;
      if (progressFill) {
        progressFill.style.transition = 'none';
      }
      var pct = getPercent(e);
      setProgress(pct);
      e.preventDefault();
    }

    function onMove(e) {
      if (!isDragging) return;
      var pct = getPercent(e);
      setProgress(pct);
      e.preventDefault();
    }

    function onEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      if (progressFill) {
        progressFill.style.transition = '';
      }
    }

    container.addEventListener('click', function(e) {
      if (isDragging) return;
      var pct = getPercent(e);
      setProgress(pct);
    });

    container.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    container.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  }

  function tryAutoplay(savedTime) {
    if (window.__musicAutoplayDone) return;
    window.__musicAutoplayDone = true;
    var promise = audio.play();
    if (promise !== undefined) {
      promise.then(function() {
        if (savedTime > 0 && savedTime < audio.duration) {
          audio.currentTime = savedTime;
        }
        isPlaying = true;
        updateAllUI();
      }).catch(function() {
        autoplayBlocked = true;
        isPlaying = false;
        updateAllUI();
        var resume = function() {
          autoplayBlocked = false;
          if (audio.paused && !playRequested) {
            if (savedTime > 0 && savedTime < (audio.duration || Infinity)) {
              audio.currentTime = savedTime;
            }
            playRequested = true;
            play();
          }
          document.removeEventListener('click', resume);
          document.removeEventListener('touchend', resume);
          document.removeEventListener('keydown', resume);
        };
        document.addEventListener('click', resume);
        document.addEventListener('touchend', resume);
        document.addEventListener('keydown', resume);
      });
    }
  }

  window.__musicPlayer = {
    SONGS: SONGS,
    get currentIndex() { return currentIndex; },
    set currentIndex(v) { currentIndex = v; },
    get isPlaying() { return isPlaying; },
    set isPlaying(v) { isPlaying = v; },
    audio: audio,
    get loopMode() { return loopMode; },
    set loopMode(v) { loopMode = v; },
    loadSong: loadSong,
    play: play,
    pause: pause,
    togglePlay: togglePlay,
    nextSong: nextSong,
    prevSong: prevSong,
    toggleLoop: toggleLoop,
    updateAllUI: updateAllUI,
    formatTime: formatTime
  };

  function init() {
    var $play = $('music-play');
    var $prev = $('music-prev');
    var $next = $('music-next');
    var $toggle = $('music-toggle');
    var $panel = $('music-panel');
    var $loopBtn = $('music-loop-btn');

    if ($play) $play.addEventListener('click', togglePlay);
    if ($prev) $prev.addEventListener('click', prevSong);
    if ($next) $next.addEventListener('click', nextSong);

    if ($toggle && $panel) {
      $toggle.addEventListener('click', function() {
        var hidden = $panel.style.display === 'none' || $panel.style.display === '';
        $panel.style.display = hidden ? 'block' : 'none';
      });
    }

    if ($loopBtn) {
      $loopBtn.addEventListener('click', toggleLoop);
    }

    var floProgress = $('music-progress');
    var floBar = floProgress ? floProgress.parentElement : null;
    if (floBar && floBar.id !== 'music-progress-bar') {
      setupProgressBar(floBar);
    }

    var $mainPlay = $('music-play-btn');
    var $mainPrev = $('music-prev-btn');
    var $mainNext = $('music-next-btn');

    if ($mainPlay) $mainPlay.addEventListener('click', togglePlay);
    if ($mainPrev) $mainPrev.addEventListener('click', prevSong);
    if ($mainNext) $mainNext.addEventListener('click', nextSong);

    setupProgressBar($('music-progress-bar'));

    var volBar = document.querySelector('.card-base.p-6 .max-w-32');
    if (volBar) {
      var volFill = volBar.querySelector('.h-full');
      volBar.addEventListener('click', function(e) {
        var rect = volBar.getBoundingClientRect();
        var pct = (e.clientX - rect.left) / rect.width;
        if (pct < 0) pct = 0;
        if (pct > 1) pct = 1;
        audio.volume = pct;
        if (volFill) volFill.style.width = (pct * 100) + '%';
      });
    }

    var shuffleBtn = qs('.card-base.p-6 button .iconify[data-icon="material-symbols:shuffle-rounded"]');
    if (shuffleBtn) {
      shuffleBtn.parentElement.addEventListener('click', function() {
        var idx = Math.floor(Math.random() * SONGS.length);
        loadSong(idx);
        play();
      });
    }

    var repeatBtn = qs('.card-base.p-6 button .iconify[data-icon="material-symbols:repeat-rounded"]');
    if (repeatBtn) {
      repeatBtn.parentElement.addEventListener('click', function() {
        toggleLoop();
        var icons = ['material-symbols:repeat-rounded', 'material-symbols:repeat-one-rounded', 'material-symbols:repeat-rounded'];
        repeatBtn.setAttribute('data-icon', icons[loopMode] || 'material-symbols:repeat-rounded');
        repeatBtn.closest('button').classList.toggle('text-primary', loopMode > 0);
      });
    }

    document.querySelectorAll('.song-item[data-index]').forEach(function(item) {
      item.addEventListener('click', function() {
        var idx = parseInt(item.getAttribute('data-index'), 10);
        if (idx === currentIndex) {
          togglePlay();
        } else {
          loadSong(idx);
          play();
        }
      });
    });

    var savedState = loadState();
    var startIndex = savedState && savedState.currentIndex !== undefined ? savedState.currentIndex : currentIndex;
    var savedTime = savedState ? (savedState.currentTime || 0) : 0;
    var wasPlaying = savedState ? savedState.wasPlaying : false;

    if (startIndex < 0 || startIndex >= SONGS.length) {
      startIndex = currentIndex;
    }

    currentIndex = startIndex;
    loadSong(currentIndex, function() {
      if (savedTime > 0 && savedTime < audio.duration) {
        audio.currentTime = savedTime;
      }
      if (wasPlaying) {
        tryAutoplay(savedTime);
      } else if (!savedState) {
        tryAutoplay(0);
      }
    });

    clearState();
  }

  audio.addEventListener('timeupdate', function() {
    if (uiThrottleTimer) return;
    uiThrottleTimer = setTimeout(function() {
      uiThrottleTimer = null;
      updateAllUI();
    }, 200);
  });

  audio.addEventListener('ended', function() {
    if (loopMode === 1) {
      audio.currentTime = 0;
      play();
    } else if (loopMode === 2) {
      nextSong();
    } else {
      var next = (currentIndex + 1) % SONGS.length;
      if (next === 0) {
        pause();
        audio.currentTime = 0;
        updateAllUI();
      } else {
        nextSong();
      }
    }
  });

  audio.addEventListener('error', function() {
    console.warn('音频加载失败，尝试下一首');
    var next = (currentIndex + 1) % SONGS.length;
    if (next !== 0) {
      currentIndex = next;
      loadSong(currentIndex);
      play();
    }
  });

  audio.addEventListener('loadedmetadata', function() {
    if ($('music-total-time')) {
      $('music-total-time').textContent = formatTime(audio.duration || SONGS[currentIndex].duration);
    }
  });

  window.addEventListener('pagehide', saveState);
  window.addEventListener('beforeunload', saveState);
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      saveState();
    } else {
      var saved = loadState();
      if (saved && saved.wasPlaying && !isPlaying && !autoplayBlocked) {
        if (currentIndex === saved.currentIndex && audio.src && audio.paused) {
          audio.play().catch(function() {});
        }
      }
    }
  });

  function domReady(fn) {
    if (document.readyState !== 'loading') {
      setTimeout(fn, 0);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  domReady(init);

})();