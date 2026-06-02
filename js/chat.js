/**
 * ============================================================
 * YQLCH Blog — 智能交互助手 v2
 * 左下角按钮 → 弹出对话框
 * 对话框内对话/选择组员，音乐按钮弹出独立音乐播放器
 * ============================================================
 */

(function () {
  'use strict';

  // ---- 后端 API 代理 ----
  const IS_FILE_PROTOCOL = window.location.protocol === 'file:';
  const IS_GITHUB_PAGES = window.location.hostname.includes('github.io');
  const API_AVAILABLE = !IS_FILE_PROTOCOL && !IS_GITHUB_PAGES;
  const API_URL = "https://YOUR_RAILWAY_APP.up.railway.app/api/chat";

  const systemPrompt = `你是23206班的一名学生，根据当前选择的角色名切换身份和说话方式。统一规则：全程以同班同学身份交流，严禁自称AI/机器人；拒绝"我在听""你继续说"等空泛套话。

1. 袁圣杰 | 阳光热心 体育委员
你是袁圣杰，23206班的体育委员。性格阳光开朗、元气满满、待人热情随和，热爱运动，责任心强，乐于组织体育活动、带动大家运动，说话爽朗接地气，是班里活力担当。
针对常用提问参考回应方向：
- 当对方说"这道题我没听懂，再讲一遍呗"：耐心帮忙梳理思路，语气亲切友好；
- 当对方说"帮我看看这个作业怎么写？"：热心给出思路和建议，友好互动；
- 当对方说"明天的课要不要提前预习？"：结合课程内容给出实用提醒，语气轻松；
- 当对方说"发发你的照片，看看你长啥样"：用阳光调侃的同学口吻互动闲聊；
- 当对方说"帮我介绍一下网页功能"：条理清晰、通俗易懂地讲解本网页功能。
通用规则：全程保持体育委员阳光活力的人设，语气积极爽朗；只以23206班学生身份交流，绝不透露AI；回答接地气，符合校园聊天语境。

2. 陈景威 | 沉稳细心 数学课代表
你是陈景威，23206班的数学课代表。性格低调内敛、沉稳细心，数学功底扎实，擅长拆解数学难题、梳理知识点，做事严谨务实，说话简洁实在，讲解题目条理清晰。
针对常用提问参考回应方向：
- 当对方说"这个实验代码跑不起来了，咋整？"：耐心帮忙分析问题，给出排查和解决思路；
- 当对方说"老师讲的那个软件你会用吗？"：简单易懂地分享操作技巧和使用要点；
- 当对方说"作业截止时间啥时候？我忘了"：准确告知截止时间，顺带提醒作业相关要求；
- 当对方说"发发你的照片，看看你长啥样"：用低调随和的语气闲聊互动；
- 当对方说"帮我介绍一下网页功能"：条理清晰、简洁实用地讲解网页各项功能。
通用规则：保持严谨沉稳讲解特点；坚守同班同学身份，绝不提及AI；拒绝空洞套话。

3. 林志轩 | 社牛气氛组
你是林志轩，23206班的气氛担当、社牛。性格外向活泼、幽默爱整活、擅长玩梗，熟知班里大小趣事，说话风趣俏皮、感染力强，是班里的开心果。
针对常用提问参考回应方向：
- 当对方说"快给我讲个班里的八卦！"：用轻松打趣的口吻分享班级趣事，欢乐互动；
- 当对方说"帮我想个合理的请假理由"：脑洞十足地提供实用又合理的请假思路，附带调侃；
- 当对方说"下节课老师会不会点名？"：结合课堂情况分析，附带玩笑吐槽，活跃气氛；
- 当对方说"发发你的照片，看看你长啥样"：花式整活、搞笑互动，把聊天氛围拉满；
- 当对方说"帮我介绍一下网页功能"：用风趣幽默的语言讲解功能，搭配小玩笑。
通用规则：全程幽默健谈，语气轻松搞怪；只以同班同学身份交流；聊天有分寸。

4. 秦鑫炎 | 温柔贴心 英语课代表
你是秦鑫炎，23206班的英语课代表。性格温柔细腻、耐心友善、心思周到，英语能力突出，说话软萌亲切，习惯使用"呀、呗、哦、宝"等温和语气词，也会贴心安抚同学情绪。
针对常用提问参考回应方向：
- 当对方说"笔记借我抄抄呗，谢谢宝"：温柔答应，标注英语重点，贴心叮嘱学习要点；
- 当对方说"这个知识点我有点懵，能讲讲吗？"：放慢节奏耐心拆解知识点，温柔引导；
- 当对方说"你整理的复习资料可以发我吗？"：友好回应，说明资料内容，贴心提醒使用场景；
- 当对方说"发发你的照片，看看你长啥样"：害羞又可爱的语气闲聊互动，温柔接话；
- 当对方说"帮我介绍一下网页功能"：细致有条理地讲解功能，语气柔和易懂。
通用规则：说话全程温柔友善，语气软萌；坚守英语课代表身份；绝不透露AI身份。

5. 黄润华 | 高冷学霸
你是黄润华，23206班的高冷学霸。性格冷静内敛、话少干练、不喜欢多余客套，做事讲究效率，回答问题直击核心、只输出干货，语气简洁冷淡，不善闲聊打趣。
针对常用提问参考回应方向：
- 当对方说"这题怎么做？"：直接给出解题思路和关键步骤，简短精准不啰嗦；
- 当对方说"作业答案发我一下"：简洁回应，提供答案或解题要点，无多余闲聊；
- 当对方说"复习重点是哪些？"：罗列核心复习考点，条理清晰言简意赅；
- 当对方说"发发你的照片，看看你长啥样"：简短冷淡回应，不愿过多闲聊打趣；
- 当对方说"帮我介绍一下网页功能"：提炼核心功能，精简讲解只讲重点。
通用规则：回答力求简短精准干货为主；保持高冷人设语气平淡克制；仅以同班学霸身份交流。`;

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

  // ---- 快捷提示文案（按组员人设）----
  const suggestionTexts = {
    'yuan': [
      '这道题我没听懂，再讲一遍呗',
      '帮我看看这个作业怎么写？',
      '明天的课要不要提前预习？',
      '发发你的照片，看看你长啥样',
      '帮我介绍一下网页功能'
    ],
    'chen': [
      '这个实验代码跑不起来了，咋整？',
      '老师讲的那个软件你会用吗？',
      '作业截止时间啥时候？我忘了',
      '发发你的照片，看看你长啥样',
      '帮我介绍一下网页功能'
    ],
    'lin': [
      '快给我讲个班里的八卦！',
      '帮我想个合理的请假理由',
      '下节课老师会不会点名？',
      '发发你的照片，看看你长啥样',
      '帮我介绍一下网页功能'
    ],
    'qin': [
      '笔记借我抄抄呗，谢谢宝',
      '这个知识点我有点懵，能讲讲吗？',
      '你整理的复习资料可以发我吗？',
      '发发你的照片，看看你长啥样',
      '帮我介绍一下网页功能'
    ],
    'huang': [
      '这题怎么做？',
      '作业答案发我一下',
      '复习重点是哪些？',
      '发发你的照片，看看你长啥样',
      '帮我介绍一下网页功能'
    ]
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
    var profile = memberProfiles[currentMemberKey];
    if (!profile) return '嗯嗯～';

    var name = profile.name;
    var memberReplies = {
      'yuan': [
        '哎呀，这个问题有意思！我们班最近也在讨论这个，我觉得吧...',
        '来来来，一起研究研究！我们班同学就是要互帮互助嘛 💪',
        '哈哈，你问到点子上了！我正好知道一点，跟你说说～'
      ],
      'chen': [
        '这个我刚好了解一点，跟你说说我的理解吧。',
        '等等我翻翻笔记...找到了！其实这个问题的关键是...',
        '嗯，我之前也遇到过类似的情况，一般是这样解决的。'
      ],
      'lin': [
        '哈哈哈你问对人了好吧！这个我可太熟了 😎',
        '哎哟不错哦，这个问题问得很有水平！让我来给你说道说道～',
        '好问题！不过先让我笑一会儿哈哈哈...好了好了说正事！'
      ],
      'qin': [
        '宝，这个我来给你讲讲呀～不用着急哦，慢慢就能理解的 🥰',
        '嗯～这个问题呢，其实只要理清思路就好啦，你看这样理解对不对～',
        '别急别急，我帮你捋一捋，其实没有那么难的，宝放心呀～'
      ],
      'huang': [
        '这个简单，核心是...',
        '答案：...。过程：...。还有问题吗。',
        '重点就这几个，其他的不用看。'
      ]
    };

    var replies = memberReplies[currentMemberKey] || ['嗯嗯，我在的～'];
    return replies[Math.floor(Math.random() * replies.length)] + '\n\n（提示：当前是离线模式，联网刷新后可获得AI实时回复）';
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
        <div class="ai-music-popup-cover ai-vinyl-wrapper">
          <div class="ai-vinyl-record" id="ai-vinyl-record">
            <img src="https://picsum.photos/seed/ai-music/200/200" alt="" class="ai-vinyl-cover" id="ai-vinyl-cover">
          </div>
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
    const playBtn = document.getElementById('ai-music-play');
    if (playBtn) playBtn.classList.toggle('is-playing', p.isPlaying);
    const aiVinyl = document.getElementById('ai-vinyl-record');
    if (aiVinyl) aiVinyl.classList.toggle('playing', p.isPlaying);
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
          if (key) {
            document.querySelectorAll('.ai-dlg-member-item').forEach(i => i.classList.remove('active'));
            el.classList.add('active');
            setTimeout(() => el.classList.remove('active'), 600);
            startMemberChat(key);
          }
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
      if (currentMemberKey && (text.indexOf('照片') !== -1 || text.indexOf('长啥样') !== -1 || text.indexOf('看看你') !== -1)) {
        addChatImage(currentMemberKey);
      }
    } catch (e) {
      hideTypingIndicator();
      console.error('[AI对话] API 调用失败:', e);
      var fallback = genLocalReply(text);
      addChatMessage(fallback, 'bot');
      chatHistory.push({ role: 'assistant', content: fallback });
      if (currentMemberKey && (text.indexOf('照片') !== -1 || text.indexOf('长啥样') !== -1 || text.indexOf('看看你') !== -1)) {
        addChatImage(currentMemberKey);
      }
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
      appendSuggestions();
    }, 100);
  }

  // ---- 添加快捷提示按钮（仅在首次打招呼时显示）----
  function appendSuggestions() {
    if (!currentMemberKey || !suggestionTexts[currentMemberKey]) return;
    const container = document.getElementById('ai-dlg-chat-messages');
    if (!container) return;
    const texts = suggestionTexts[currentMemberKey];
    const wrap = document.createElement('div');
    wrap.className = 'ai-dlg-suggestions';
    texts.forEach(function(t) {
      const btn = document.createElement('button');
      btn.textContent = t;
      btn.addEventListener('click', function() {
        const input = document.getElementById('ai-dlg-input');
        if (input) {
          input.value = t;
          input.focus();
        }
      });
      wrap.appendChild(btn);
    });
    container.appendChild(wrap);
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

  // ---- 添加聊天图片 ----
  function addChatImage(memberKey) {
    const profile = memberProfiles[memberKey];
    if (!profile) return;
    const container = document.getElementById('ai-dlg-chat-messages');
    if (!container) return;
    const empty = document.getElementById('ai-dlg-chat-empty');
    if (empty) empty.style.display = 'none';
    const p = window.location.pathname;
    const base = (p.indexOf('/pages/') !== -1 || p.indexOf('/indextxt/') !== -1) ? '../assets/crew%20img/' : 'assets/crew%20img/';
    const imgSrc = base + encodeURIComponent(profile.name) + '.jpg';
    const msg = document.createElement('div');
    msg.className = 'ai-dlg-chat-msg ai-dlg-chat-msg-bot';
    msg.innerHTML = '<div class="ai-dlg-chat-bubble ai-dlg-chat-bubble-bot"><img src="' + imgSrc + '" alt="' + profile.name + '" class="ai-dlg-chat-img"></div>';
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
    if (!API_AVAILABLE) {
      return genLocalReply(userText);
    }
    const profile = memberProfiles[memberKey];
    if (!profile) return '嗯嗯～';
    const content = `当前对话角色：${profile.name}\n用户：${userText}`;
    const messages = [{ role: "system", content: systemPrompt }, ...chatHistory];
    if (messages.length >= 2 && messages[messages.length - 1].role === 'user')
      messages[messages.length - 1] = { role: "user", content };
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages })
    });
    if (!res.ok) {
      var errData = await res.json().catch(function () { return {}; });
      throw new Error(errData.error || "API status " + res.status);
    }
    var data = await res.json();
    return data.choices[0].message.content;
  }

  // ============================================================
  //  启动
  // ============================================================
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();