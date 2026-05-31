/**
 * ============================================================
 * YQLCH Blog — 智能交互助手 v2
 * 左下角按钮 → 弹出对话框
 * 对话框内对话/选择组员，音乐按钮弹出独立音乐播放器
 * ============================================================
 */

(function () {
  'use strict';

  // ---- API 代理 ----
  // API Key 已移至后端 server/.env，前端不再硬编码
  const API_URL = "/api/chat";

  const systemPrompt = "你需要扮演五位不同性格的组员...";

  // ---- 状态 ----
  let currentView = 'main'; // 'main' | 'chat' | 'members'
  let chatHistory = [];
  let currentMemberKey = '';
  let currentMemberProfile = null;
  let musicTimer = null;

  // ---- 组员配置 ----
  const members = [
    { key: 'qin',   name: '秦鑫炎', avatar: '🔥', color: '#ff6b9d', desc: '应届·前端·开朗' },
    { key: 'huang', name: '黄润华', avatar: '🍃', color: '#7ec8a0', desc: '前端+安全·温和' },
    { key: 'lin',   name: '林志轩', avatar: '😎', color: '#4facfe', desc: '前端·3年·8项目' },
    { key: 'yuan',  name: '袁圣杰', avatar: '⚡', color: '#f9d56e', desc: '直爽·行动派' },
    { key: 'chen',  name: '陈景威', avatar: '📚', color: '#6c5ce7', desc: '理性·稳重·靠谱' }
  ];

  const memberProfiles = {
    'qin': {
      name: '秦鑫炎', avatar: '🔥', color: '#ff6b9d',
      personality: '中专软件专业应届生，Web前端开发，性格开朗',
      style: '你是秦鑫炎，一个中专软件与信息服务专业的应届毕业男生...',
      catchphrases: ['哇哦', '好家伙', '学到了', '笑死', '冲就完事了'],
      opening: '哇哦！我是秦鑫炎，软件专业的应届生，前端方向～有啥想聊的？技术八卦都行！'
    },
    'huang': {
      name: '黄润华', avatar: '🍃', color: '#7ec8a0',
      personality: '中职三年级，软件与信息服务专业，热爱前端与网络安全',
      style: '你是黄润华...',
      catchphrases: ['嗯嗯', '慢慢来', '没关系的', '我理解'],
      opening: '你好呀……我是黄润华，学软件专业的。想聊技术、学习还是日常都可以哦，我会认真听的。'
    },
    'lin': {
      name: '林志轩', avatar: '😎', color: '#4facfe',
      personality: '中职软件专业，前端开发方向，3年自学经验，8+项目实战',
      style: '你是林志轩...',
      catchphrases: ['离谱', '绷不住了', '你品你细品', '笑不活了'],
      opening: '哟！林志轩在此，前端选手一枚～写了8个多项目了，来聊聊代码还是讲段子？我都行！'
    },
    'yuan': {
      name: '袁圣杰', avatar: '⚡', color: '#f9d56e',
      personality: '中职生，直爽开朗，说话干脆利落，为人仗义',
      style: '你是袁圣杰...',
      catchphrases: ['没问题', '包在我身上', '给力', '冲'],
      opening: '嘿！袁圣杰，有啥事尽管说！我这人说话直，但办事绝对靠谱！'
    },
    'chen': {
      name: '陈景威', avatar: '📚', color: '#6c5ce7',
      personality: '沉稳靠谱，谈吐理性有条理，待人谦和，做事稳重',
      style: '你是陈景威...',
      catchphrases: ['我建议', '理性来看', '可以考虑', '慢慢分析'],
      opening: '你好，我是陈景威。有什么想法或问题，我们可以一起探讨。'
    }
  };

  // ---- 嵌入对话中的音乐回复 ----
  function genMusicReply(input) {
    const lower = input.toLowerCase();
    if (lower.includes('推荐') || lower.includes('有什么') || lower.includes('好听'))
      return ['试试《晴天》吧，治愈力满分！', '《起风了》每次听都觉得温柔～', '《小美满》轻快又治愈！'][Math.floor(Math.random() * 3)];
    if (lower.includes('歌词') || lower.includes('解读'))
      return '这首歌的歌词确实写得很有味道～';
    if (lower.includes('谢谢') || lower.includes('感谢'))
      return '不客气呀～随时想听歌就找我！🎵';
    const r = ['听歌是最好的放松方式啦～', '音乐的魅力在于总有一首歌懂你', '你觉得什么风格适合现在的心情？'];
    return r[Math.floor(Math.random() * r.length)];
  }

  function genLocalReply(t) {
    const profile = memberProfiles[currentMemberKey];
    if (!profile) return '嗯嗯～';
    const replies = ['嗯嗯，我听到了～', '这个嘛，我觉得挺有意思的！', '你继续说说，我在听～'];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // ---- 初始化 ----
  function init() {
    createFloatingBtn();
    createDialog();
    createMusicPopup();
    bindEvents();
  }

  // ---- 悬浮按钮 ----
  function createFloatingBtn() {
    const w = document.createElement('div');
    w.id = 'ai-assistant-container';
    w.style.cssText = 'position:fixed;bottom:24px;left:16px;z-index:9999';
    w.innerHTML = `
      <button id="ai-floating-btn" class="ai-floating-btn" aria-label="智能助手">
        <span class="ai-btn-pulse-ring"></span>
        <span class="ai-btn-icon-wrapper">
          <span class="iconify ai-btn-icon-main" data-icon="material-symbols:chat-rounded" style="font-size:1.4rem;color:white;"></span>
        </span>
      </button>
    `;
    document.body.appendChild(w);
  }

  // ---- 对话框 ----
  function createDialog() {
    const d = document.createElement('div');
    d.id = 'ai-dialog-box';
    d.className = 'ai-dialog-box hidden';
    d.innerHTML = `
      <!-- 标题栏 -->
      <div class="ai-dlg-header">
        <button id="ai-dlg-back" class="ai-dlg-back-btn hidden" aria-label="返回">
          <span class="iconify" data-icon="material-symbols:arrow-back-rounded" style="font-size:1.1rem;"></span>
        </button>
        <span class="ai-dlg-title" id="ai-dlg-title">👥 组员AI对话</span>
        <div class="ai-dlg-header-actions">
          <button id="ai-dlg-close" class="ai-dlg-close-btn" aria-label="关闭">
            <span class="iconify" data-icon="material-symbols:close-rounded" style="font-size:1.1rem;"></span>
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="ai-dlg-body" id="ai-dlg-body">

        <!-- === 主视图 === -->
        <div id="ai-dlg-main-view" class="ai-dlg-view">
          <div class="ai-dlg-greeting">👋 欢迎使用组员AI对话</div>
          <div class="ai-dlg-shortcuts">
            <button class="ai-dlg-shortcut" id="ai-dlg-shortcut-members">
              <span class="ai-dlg-shortcut-icon">👥</span>
              <span>选择组员对话</span>
            </button>
          </div>
        </div>

        <!-- === 组员列表视图 === -->
        <div id="ai-dlg-members-view" class="ai-dlg-view hidden">
          <div class="ai-dlg-view-label">选择一个组员开始对话</div>
          <div class="ai-dlg-members-list">
            ${members.map(m => `
              <div class="ai-dlg-member-item" data-key="${m.key}">
                <span class="ai-dlg-member-avatar" style="background:${m.color}">${m.avatar}</span>
                <div class="ai-dlg-member-info">
                  <div class="ai-dlg-member-name">${m.name}</div>
                  <div class="ai-dlg-member-desc">${m.desc}</div>
                </div>
                <span class="iconify" data-icon="material-symbols:chevron-right-rounded" style="font-size:1rem;color:oklch(var(--bc)/0.3)"></span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- === 对话视图 === -->
        <div id="ai-dlg-chat-view" class="ai-dlg-view hidden">
          <div class="ai-dlg-chat-messages" id="ai-dlg-chat-messages">
            <div class="ai-dlg-chat-empty" id="ai-dlg-chat-empty">
              <div class="ai-dlg-chat-empty-icon">💬</div>
              <div class="ai-dlg-chat-empty-text">开始对话吧～</div>
            </div>
          </div>
        </div>

      </div>

      <!-- 底部栏：输入框 + 选择成员按钮 + 音乐按钮 + 发送 -->
      <div class="ai-dlg-bottom">
        <button id="ai-dlg-members-btn" class="ai-dlg-bottom-btn ai-dlg-bottom-members" aria-label="选择组员" title="选择组员">
          <span class="iconify" data-icon="material-symbols:group-rounded" style="font-size:1.2rem;"></span>
        </button>
        <button id="ai-dlg-music-btn" class="ai-dlg-bottom-btn ai-dlg-bottom-music" aria-label="播放音乐" title="播放音乐">
          <span class="iconify" data-icon="material-symbols:music-note-rounded" style="font-size:1.2rem;"></span>
        </button>
        <div class="ai-dlg-input-wrap">
          <input type="text" id="ai-dlg-input" class="ai-dlg-input" placeholder="输入消息..." maxlength="200">
        </div>
        <button id="ai-dlg-send" class="ai-dlg-send-btn" aria-label="发送">
          <span class="iconify" data-icon="material-symbols:send-rounded" style="font-size:1.1rem;"></span>
        </button>
      </div>
    `;
    document.body.appendChild(d);
  }

  // ---- 独立音乐播放器弹窗 ----
  function createMusicPopup() {
    const p = document.createElement('div');
    p.id = 'ai-music-popup';
    p.className = 'ai-music-popup hidden';
    p.innerHTML = `
      <div class="ai-music-popup-header">
        <span class="ai-music-popup-title">🎵 音乐播放器</span>
        <button id="ai-music-popup-close" class="ai-music-popup-close" aria-label="关闭">
          <span class="iconify" data-icon="material-symbols:close-rounded" style="font-size:1.2rem;"></span>
        </button>
      </div>
      <div class="ai-music-popup-body">
        <div class="ai-music-popup-cover">
          <span class="iconify" data-icon="material-symbols:music-note-rounded" style="font-size:2.5rem;color:white;"></span>
        </div>
        <div class="ai-music-popup-info">
          <div class="ai-music-popup-title-text" id="ai-music-title">星炬不熄</div>
          <div class="ai-music-popup-artist" id="ai-music-artist">星炬学院毕业生</div>
        </div>
        <div class="ai-music-popup-progress">
          <div class="ai-music-popup-bar" id="ai-music-progress-bar">
            <div class="ai-music-popup-fill" id="ai-music-progress-fill" style="width:0%"></div>
          </div>
          <div class="ai-music-popup-time">
            <span id="ai-music-curr">0:00</span>
            <span id="ai-music-dur">4:30</span>
          </div>
        </div>
        <div class="ai-music-popup-controls">
          <button class="ai-music-popup-mctrl" id="ai-music-loop" aria-label="循环">
            <span class="iconify" data-icon="material-symbols:repeat" style="font-size:1.1rem;"></span>
          </button>
          <button class="ai-music-popup-mctrl" id="ai-music-prev" aria-label="上一首">
            <span class="iconify" data-icon="material-symbols:skip-previous-rounded" style="font-size:1.4rem;"></span>
          </button>
          <button class="ai-music-popup-play" id="ai-music-play" aria-label="播放/暂停">
            <span class="iconify" id="ai-music-play-icon" data-icon="material-symbols:play-arrow-rounded" style="font-size:1.8rem;color:white;"></span>
          </button>
          <button class="ai-music-popup-mctrl" id="ai-music-next" aria-label="下一首">
            <span class="iconify" data-icon="material-symbols:skip-next-rounded" style="font-size:1.4rem;"></span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(p);
  }

  // ---- 独立音乐弹窗控件绑定 ----
  function bindMusicPopupEvents() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    bind('ai-music-play', () => {
      const p = window.__musicPlayer;
      if (p) { p.togglePlay(); updateMusicPopupUI(); }
    });
    bind('ai-music-prev', () => {
      const p = window.__musicPlayer;
      if (p) { p.prevSong(); updateMusicPopupUI(); }
    });
    bind('ai-music-next', () => {
      const p = window.__musicPlayer;
      if (p) { p.nextSong(); updateMusicPopupUI(); }
    });
    bind('ai-music-loop', () => {
      const p = window.__musicPlayer;
      if (p) {
        p.toggleLoop();
        const el = document.getElementById('ai-music-loop');
        el.classList.toggle('active', p.loopMode > 0);
        const icons = ['material-symbols:repeat', 'material-symbols:repeat-one', 'material-symbols:repeat'];
        el.querySelector('.iconify').setAttribute('data-icon', icons[p.loopMode] || 'material-symbols:repeat');
      }
    });
    bind('ai-music-popup-close', closeMusicPopup);

    const bar = document.getElementById('ai-music-progress-bar');
    if (bar) {
      bar.addEventListener('click', e => {
        const p = window.__musicPlayer;
        if (!p || !p.audio || !p.audio.duration) return;
        const rect = bar.getBoundingClientRect();
        p.audio.currentTime = ((e.clientX - rect.left) / rect.width) * p.audio.duration;
      });
    }
  }

  // ---- 独立音乐弹窗 UI 更新 ----
  function updateMusicPopupUI() {
    const p = window.__musicPlayer;
    if (!p) return;
    const song = p.SONGS[p.currentIndex];
    if (!song) return;

    document.getElementById('ai-music-title').textContent = song.title;
    document.getElementById('ai-music-artist').textContent = song.artist;
    document.getElementById('ai-music-dur').textContent = p.formatTime(song.duration);
    document.getElementById('ai-music-curr').textContent = p.formatTime(p.audio.currentTime || 0);

    const fill = document.getElementById('ai-music-progress-fill');
    if (fill && p.audio) {
      const dur = p.audio.duration || song.duration;
      fill.style.width = (dur > 0 ? ((p.audio.currentTime || 0) / dur) * 100 : 0) + '%';
    }

    const icon = document.getElementById('ai-music-play-icon');
    if (icon) icon.setAttribute('data-icon', p.isPlaying ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded');
  }

  // ---- 切换音乐弹窗 ----
  function toggleMusicPopup() {
    const popup = document.getElementById('ai-music-popup');
    if (!popup) return;
    if (popup.classList.contains('open')) {
      closeMusicPopup();
    } else {
      openMusicPopup();
    }
  }

  function openMusicPopup() {
    const popup = document.getElementById('ai-music-popup');
    popup.classList.remove('hidden');
    void popup.offsetWidth;
    popup.classList.add('open');
    updateMusicPopupUI();
    startMusicTimer();
  }

  function closeMusicPopup() {
    const popup = document.getElementById('ai-music-popup');
    popup.classList.remove('open');
    stopMusicTimer();
    setTimeout(() => {
      if (!popup.classList.contains('open')) popup.classList.add('hidden');
    }, 250);
  }

  // ---- 绑定事件 ----
  function bindEvents() {
    const btn = document.getElementById('ai-floating-btn');
    const dialog = document.getElementById('ai-dialog-box');

    // 悬浮按钮
    btn.addEventListener('click', toggleDialog);

    // 关闭
    document.getElementById('ai-dlg-close').addEventListener('click', closeDialog);

    // 返回
    document.getElementById('ai-dlg-back').addEventListener('click', goBack);

    // 主视图快捷按钮
    document.getElementById('ai-dlg-shortcut-members').addEventListener('click', showMembersView);

    // 底部按钮
    document.getElementById('ai-dlg-members-btn').addEventListener('click', showMembersView);
    document.getElementById('ai-dlg-music-btn').addEventListener('click', toggleMusicPopup);

    // 底部输入 + 发送
    document.getElementById('ai-dlg-send').addEventListener('click', handleSend);
    document.getElementById('ai-dlg-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSend();
    });

    // 组员列表点击
    bindMemberItems();

    // 音乐弹窗控件
    bindMusicPopupEvents();

    // ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const popup = document.getElementById('ai-music-popup');
        if (popup && popup.classList.contains('open')) {
          closeMusicPopup();
          return;
        }
        closeDialog();
      }
    });

    // 点击外部关闭
    document.addEventListener('click', e => {
      // 关闭对话框（点击外部）
      if (dialog.classList.contains('open') && !dialog.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        closeDialog();
      }
      // 关闭音乐弹窗（点击外部）
      const popup = document.getElementById('ai-music-popup');
      if (popup && popup.classList.contains('open') && !popup.contains(e.target) && e.target !== btn && !btn.contains(e.target) && e.target.id !== 'ai-dlg-music-btn' && !e.target.closest('#ai-dlg-music-btn')) {
        closeMusicPopup();
      }
    });
  }

  // ---- 组员列表事件 ----
  function bindMemberItems() {
    setTimeout(() => {
      document.querySelectorAll('.ai-dlg-member-item').forEach(el => {
        el.addEventListener('click', () => {
          const key = el.dataset.key;
          if (key) startMemberChat(key);
        });
      });
    }, 50);
  }

  // ---- 视图切换 ----
  function showMainView() {
    currentView = 'main';
    showView('ai-dlg-main-view');
    document.getElementById('ai-dlg-back').classList.add('hidden');
    document.getElementById('ai-dlg-title').textContent = '👥 组员AI对话';
  }

  function showMembersView() {
    currentView = 'members';
    showView('ai-dlg-members-view');
    document.getElementById('ai-dlg-back').classList.remove('hidden');
    document.getElementById('ai-dlg-title').textContent = '👥 选择组员';
  }

  function showChatView() {
    currentView = 'chat';
    showView('ai-dlg-chat-view');
    document.getElementById('ai-dlg-back').classList.remove('hidden');
  }

  function showView(id) {
    document.querySelectorAll('.ai-dlg-view').forEach(v => v.classList.add('hidden'));
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  }

  // ---- 返回 ----
  function goBack() {
    if (currentView === 'chat') {
      const dlg = document.getElementById('ai-dlg-chat-messages');
      if (dlg) dlg.innerHTML = '';
      chatHistory = [];
      currentMemberKey = '';
      currentMemberProfile = null;
    }
    showMainView();
  }

  function startMusicTimer() {
    stopMusicTimer();
    musicTimer = setInterval(updateMusicPopupUI, 300);
  }

  function stopMusicTimer() {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
  }

  // ---- 打开/关闭对话框 ----
  function openDialog() {
    const dialog = document.getElementById('ai-dialog-box');
    dialog.classList.remove('hidden');
    void dialog.offsetWidth;
    dialog.classList.add('open');
    initDefaultChat();
    setTimeout(() => document.getElementById('ai-dlg-input').focus(), 300);
  }

  function closeDialog() {
    const dialog = document.getElementById('ai-dialog-box');
    dialog.classList.remove('open');
    if (currentView === 'chat') {
      const dlg = document.getElementById('ai-dlg-chat-messages');
      if (dlg) dlg.innerHTML = '';
      chatHistory = [];
      currentMemberKey = '';
      currentMemberProfile = null;
    }
    setTimeout(() => {
      if (!dialog.classList.contains('open')) dialog.classList.add('hidden');
    }, 300);
  }

  function toggleDialog() {
    const dialog = document.getElementById('ai-dialog-box');
    if (dialog.classList.contains('open')) closeDialog();
    else openDialog();
  }

  // ============================================================
  //  发送消息
  // ============================================================
  async function handleSend() {
    const input = document.getElementById('ai-dlg-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    // 如果没有选中组员，进入音乐助手模式
    if (!currentMemberKey) {
      if (currentView !== 'chat') {
        initMusicChat();
      }
    }

    // 确保在聊天视图
    if (currentView !== 'chat') {
      initMusicChat();
    }

    // 添加用户消息
    addChatMessage(text, 'user');
    chatHistory.push({ role: 'user', content: text });

    // 显示打字指示
    showTypingIndicator();

    try {
      let reply;
      if (currentMemberKey) {
        reply = await callAPI(currentMemberKey, text);
      } else {
        reply = genMusicReply(text);
      }
      hideTypingIndicator();
      addChatMessage(reply, 'bot');
      chatHistory.push({ role: 'assistant', content: reply });
    } catch (e) {
      hideTypingIndicator();
      const fallback = genLocalReply(text);
      addChatMessage(fallback, 'bot');
      chatHistory.push({ role: 'assistant', content: fallback });
    }

    scrollChat();
  }

  // ---- 初始化音乐对话 ----
  function initMusicChat() {
    currentMemberKey = '';
    currentMemberProfile = null;
    chatHistory = [];
    const dlg = document.getElementById('ai-dlg-chat-messages');
    if (dlg) dlg.innerHTML = '';
    showChatView();
    document.getElementById('ai-dlg-title').textContent = '🎵 音乐助手';
    setTimeout(() => {
      addChatMessage('嗨～想聊天还是听歌？随时告诉我！', 'bot');
    }, 100);
  }

  // ---- 初始化默认对话（介绍助手功能）----
  function initDefaultChat() {
    currentMemberKey = '';
    currentMemberProfile = null;
    chatHistory = [];
    const dlg = document.getElementById('ai-dlg-chat-messages');
    if (dlg) dlg.innerHTML = '';
    showChatView();
    document.getElementById('ai-dlg-title').textContent = '👥 组员AI对话';
    setTimeout(() => {
      addChatMessage('🤖 你好！我是组员AI对话助手，我可以帮你：\n\n👥 **与组员对话** — 选择秦鑫炎、黄润华、林志轩、袁圣杰、陈景威任意一位组员进行AI对话\n\n🎵 **播放音乐** — 点击底部 🎵 按钮打开音乐播放器\n\n💬 **自由聊天** — 选择组员后即可畅聊任何话题\n\n试试选择下方 👥 组员按钮，或者直接输入消息开始吧！', 'bot');
    }, 100);
  }

  // ---- 开始组员对话 ----
  function startMemberChat(key) {
    const profile = memberProfiles[key];
    if (!profile) return;
    currentMemberKey = key;
    currentMemberProfile = profile;
    chatHistory = [];

    const dlg = document.getElementById('ai-dlg-chat-messages');
    if (dlg) dlg.innerHTML = '';

    showChatView();
    document.getElementById('ai-dlg-title').textContent = `${profile.avatar} ${profile.name}`;

    setTimeout(() => {
      addChatMessage(profile.opening, 'bot');
    }, 100);
  }

  // ---- 添加聊天消息 ----
  function addChatMessage(text, type) {
    const container = document.getElementById('ai-dlg-chat-messages');
    if (!container) return;

    const empty = document.getElementById('ai-dlg-chat-empty');
    if (empty) empty.style.display = 'none';

    const msg = document.createElement('div');
    msg.className = `ai-dlg-chat-msg ai-dlg-chat-msg-${type}`;
    msg.innerHTML = `<div class="ai-dlg-chat-bubble ai-dlg-chat-bubble-${type}">${escHTML(text)}</div>`;
    container.appendChild(msg);
    scrollChat();
  }

  // ---- 打字指示器 ----
  function showTypingIndicator() {
    const container = document.getElementById('ai-dlg-chat-messages');
    if (!container) return;
    const old = document.getElementById('ai-dlg-typing');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'ai-dlg-chat-msg ai-dlg-chat-msg-bot';
    t.id = 'ai-dlg-typing';
    t.innerHTML = `<div class="ai-dlg-chat-bubble ai-dlg-chat-bubble-bot ai-dlg-typing-bubble">
      <span class="ai-dlg-typing-dot"></span>
      <span class="ai-dlg-typing-dot"></span>
      <span class="ai-dlg-typing-dot"></span>
    </div>`;
    container.appendChild(t);
    scrollChat();
  }

  function hideTypingIndicator() {
    const t = document.getElementById('ai-dlg-typing');
    if (t) t.remove();
  }

  function scrollChat() {
    const container = document.getElementById('ai-dlg-chat-messages');
    if (container) {
      setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
    }
  }

  function escHTML(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

  // ---- API 调用 ----
  async function callAPI(memberKey, userText) {
    const profile = memberProfiles[memberKey];
    if (!profile) return '嗯嗯～';
    const content = `当前对话角色：${profile.name}\n用户：${userText}`;
    const messages = [{ role: "system", content: systemPrompt }, ...chatHistory];
    if (messages.length >= 2 && messages[messages.length - 1].role === 'user')
      messages[messages.length - 1] = { role: "user", content };
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, memberKey })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "API status " + res.status);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  }

  // ============================================================
  //  启动
  // ============================================================
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();