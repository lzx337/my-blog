var BlogApp = (function() {
    'use strict';

    var DATA = {
        articles: [
            {
                id: 1,
                title: "探索现代前端架构：从 MVC 到响应式设计的演进",
                slug: "modern-frontend-architecture",
                excerpt: "深入分析过去十年前端架构的演变历程，探讨从传统的 MVC 模式到现代响应式设计框架的技术革新与最佳实践。",
                content: "## 引言\n\n前端开发在过去十年经历了翻天覆地的变化。从最初的 HTML、CSS、JavaScript 分离结构，到如今的 React、Vue、Angular 等现代化框架，我们见证了前端工程的崛起。\n\n## MVC 到 MVVM 的演变\n\n传统的 MVC 架构在后端开发中应用广泛，但随着前端复杂度提升，MVVM 模式应运而生。它通过数据绑定机制，大大简化了 UI 更新的逻辑。\n\n## 响应式设计的崛起\n\n移动设备的普及催生了响应式设计的普及。CSS Grid、Flexbox 等新技术的出现，让开发者能够更灵活地构建跨平台应用。\n\n## 结论\n\n未来的前端将更加注重性能、可访问性和开发者体验。Web Components、标准化的浏览器 API 都将推动这一进程。",
                category: "技术",
                tags: ["前端", "架构", "响应式"],
                author: "Xavier Qin",
                date: "2026-03-15",
                readTime: "8 分钟",
                featured: true,
                cover: "cover1.jpg",
                views: 2847,
                likes: 156
            },
            {
                id: 2,
                title: "设计系统实践：构建可扩展的 UI 组件库",
                slug: "design-system-ui-component-library",
                excerpt: "分享如何从零开始构建企业级设计系统，涵盖组件规范化、设计令牌、文档自动化等核心主题。",
                content: "## 什么是设计系统\n\n设计系统是一套完整的设计语言、规范和组件库，它帮助团队高效、一致地构建产品。\n\n## 设计令牌\n\n设计令牌是设计系统中存储设计决策的原子单位。它们包含了颜色、字体、间距等所有视觉元素的值。\n\n## 组件开发规范\n\n良好的组件应该具备：\n- 单一职责\n- 可复用性\n- 可访问性\n- 主题定制能力\n\n## 文档自动化\n\n使用 Storybook 等工具可以自动生成组件文档，大大提升开发效率。",
                category: "设计",
                tags: ["设计系统", "组件库", "UI"],
                author: "Sarah Liu",
                date: "2026-03-10",
                readTime: "6 分钟",
                featured: true,
                cover: "cover2.jpg",
                views: 1923,
                likes: 98
            },
            {
                id: 3,
                title: "性能优化深度解析：让你的网页快如闪电",
                slug: "web-performance-optimization",
                excerpt: "全面探讨 Web 性能优化的关键技术，包括加载性能、渲染性能、网络优化、资源缓存等实战策略。",
                content: "## 性能优化的重要性\n\n研究表明，页面加载时间每增加 1 秒，转化率就会下降 7%。性能优化直接关系到用户体验和业务指标。\n\n## 核心 Web 指标\n\nGoogle 提出的 Core Web Vitals 包括：\n- **LCP** (最大内容绘制)：应在 2.5 秒内\n- **FID** (首次输入延迟)：应小于 100 毫秒\n- **CLS** (累积布局偏移)：应小于 0.1\n\n## 优化策略\n\n1. **资源压缩与合并**：减少请求数量\n2. **懒加载**：按需加载非关键资源\n3. **CDN 部署**：就近访问静态资源\n4. **缓存策略**：合理设置 Cache-Control",
                category: "技术",
                tags: ["性能", "优化", "前端"],
                author: "Mike Wang",
                date: "2026-03-05",
                readTime: "10 分钟",
                featured: false,
                cover: "cover3.jpg",
                views: 3156,
                likes: 201
            },
            {
                id: 4,
                title: "无障碍设计：构建包容性的数字产品",
                slug: "accessibility-inclusive-design",
                excerpt: "探讨数字产品的无障碍设计原则与实践，帮助开发者构建每位用户都能使用的包容性产品。",
                content: "## 无障碍的重要性\n\n全球有超过 10 亿残障人士。构建无障碍产品不仅是法律责任，更是对用户的尊重。\n\n## WCAG 2.1 指南\n\n四大原则 **POUR**：\n- **可感知**：内容必须对用户可感知\n- **可操作**：界面元素必须可操作\n- **可理解**：信息必须可理解\n- **健壮性**：内容必须足够健壮能被各种用户代理理解\n\n## 实践建议\n\n1. 使用语义化 HTML\n2. 提供替代文本\n3. 确保键盘可访问\n4. 维持足够的颜色对比度\n5. 支持屏幕阅读器",
                category: "设计",
                tags: ["无障碍", "包容性", "WCAG"],
                author: "Emma Zhang",
                date: "2026-02-28",
                readTime: "7 分钟",
                featured: false,
                cover: "cover4.jpg",
                views: 1456,
                likes: 87
            },
            {
                id: 5,
                title: "TypeScript 高级特性：类型系统的力量",
                slug: "typescript-advanced-types",
                excerpt: "深入探索 TypeScript 的高级类型特性，包括泛型、条件类型、映射类型等，让你写出更健壮的代码。",
                content: "## TypeScript 的价值\n\nTypeScript 为 JavaScript 添加了静态类型检查，大大提升了代码质量和开发体验。\n\n## 泛型深入\n\n泛型让我们编写可复用且类型安全的代码。\n\n## 条件类型\n\n条件类型基于其他类型推导类型。\n\n## 映射类型\n\n映射类型可以批量转换类型的属性。",
                category: "技术",
                tags: ["TypeScript", "类型系统", "JavaScript"],
                author: "Xavier Qin",
                date: "2026-02-20",
                readTime: "9 分钟",
                featured: true,
                cover: "cover5.jpg",
                views: 2234,
                likes: 134
            },
            {
                id: 6,
                title: "创意编程：用代码创造艺术",
                slug: "creative-coding-art",
                excerpt: "探索创意编程的无限可能，从 Processing 到 Three.js，用代码作为画笔创造独特的数字艺术作品。",
                content: "## 什么是创意编程\n\n创意编程是一种将代码视为创作媒介的艺术形式，强调表达和创新而非功能性。\n\n## 代表性工具\n\n- **Processing**：最流行的创意编程语言\n- **p5.js**：Processing 的 JavaScript 版本\n- **Three.js**：3D 图形库\n- **GLSL**：着色器语言\n\n## 艺术案例\n\n1. 粒子系统\n2. 噪声流动\n3. 物理模拟\n4. 生成艺术",
                category: "创意",
                tags: ["创意编程", "艺术", "Processing"],
                author: "Lisa Yang",
                date: "2026-02-15",
                readTime: "5 分钟",
                featured: false,
                cover: "cover6.jpg",
                views: 1678,
                likes: 112
            },
            {
                id: 7,
                title: "微前端架构：大规模前端系统的演进之路",
                slug: "micro-frontend-architecture",
                excerpt: "深入分析微前端架构的核心理念、实现方式及在大型前端项目中的应用实践与挑战。",
                content: "## 为什么需要微前端\n\n随着前端应用规模增长，单体前端变得难以维护。微前端借鉴微服务的思想，将大型应用拆分为独立可部署的小应用。\n\n## 实现方式\n\n1. **构建时集成**：各微应用独立构建，主应用依赖它们\n2. **运行时集成**：通过 Module Federation、iframes 等方式动态加载\n3. **混合方式**：结合以上两种\n\n## 技术挑战\n\n- 样式隔离\n- 状态共享\n- 路由协调\n- 性能优化",
                category: "技术",
                tags: ["微前端", "架构", "大型项目"],
                author: "James Li",
                date: "2026-02-10",
                readTime: "11 分钟",
                featured: false,
                cover: "cover7.jpg",
                views: 2567,
                likes: 145
            },
            {
                id: 8,
                title: "CSS 新特性：下一代样式表的强大能力",
                slug: "css-new-features",
                excerpt: "全面解析 CSS 容器查询、:has() 选择器、CSS 嵌套等新特性，拥抱全新的样式表时代。",
                content: "## CSS 的复兴\n\nCSS 在近年来获得了前所未有的新特性，极大增强了样式表达能力。\n\n## 容器查询\n\n容器查询允许组件根据容器大小而非视口大小来应用样式。\n\n## :has() 选择器\n\n:has() 是 CSS 的父选择器。\n\n## CSS 嵌套\n\n现在可以直接在 CSS 中嵌套规则。",
                category: "技术",
                tags: ["CSS", "前端", "新特性"],
                author: "Sarah Liu",
                date: "2026-02-05",
                readTime: "6 分钟",
                featured: false,
                cover: "cover8.jpg",
                views: 2089,
                likes: 156
            }
        ],
        projects: [
            {
                id: 1,
                title: "智能家居控制中心",
                slug: "smart-home-dashboard",
                description: "基于 Web技术的智能家居管理平台，支持设备控制、场景联动、数据可视化及语音助手集成。",
                category: "Web应用",
                tags: ["IoT", "React", "Node.js", "WebSocket"],
                thumbnail: "project1.jpg",
                images: ["project1_1.jpg", "project1_2.jpg"],
                link: "#",
                github: "#",
                date: "2026-02",
                featured: true,
                technologies: ["React", "Node.js", "MongoDB", "WebSocket", "MQTT"]
            },
            {
                id: 2,
                title: "数据可视化仪表盘",
                slug: "data-visualization-dashboard",
                description: "企业级数据分析平台，提供实时数据监控、多维度统计图表、自定义报表生成等功能。",
                category: "数据平台",
                tags: ["D3.js", "Vue.js", "Python", "PostgreSQL"],
                thumbnail: "project2.jpg",
                images: ["project2_1.jpg", "project2_2.jpg"],
                link: "#",
                github: "#",
                date: "2026-01",
                featured: true,
                technologies: ["Vue.js", "D3.js", "Python", "Django", "PostgreSQL"]
            },
            {
                id: 3,
                title: "移动端电商应用",
                slug: "mobile-ecommerce-app",
                description: "高性能移动端购物应用，采用 PWA 技术实现类原生体验，支持离线浏览和即时加载。",
                category: "移动应用",
                tags: ["PWA", "Vue.js", "IndexedDB", "Service Worker"],
                thumbnail: "project3.jpg",
                images: ["project3_1.jpg", "project3_2.jpg"],
                link: "#",
                github: "#",
                date: "2023-12",
                featured: true,
                technologies: ["Vue.js", "PWA", "IndexedDB", "Service Worker"]
            },
            {
                id: 4,
                title: "在线协作白板",
                slug: "collaborative-whiteboard",
                description: "支持多人实时协作的在线白板工具，集成绘图、批注、思维导图等功能。",
                category: "协作工具",
                tags: ["Canvas", "WebRTC", "Socket.io", "Express"],
                thumbnail: "project4.jpg",
                images: ["project4_1.jpg"],
                link: "#",
                github: "#",
                date: "2023-11",
                featured: false,
                technologies: ["Canvas", "WebRTC", "Socket.io", "Express"]
            },
            {
                id: 5,
                title: "AI 图像生成器",
                slug: "ai-image-generator",
                description: "基于机器学习模型的图像生成工具，支持多种风格迁移和自定义参数调节。",
                category: "AI应用",
                tags: ["TensorFlow.js", "React", "Canvas API"],
                thumbnail: "project5.jpg",
                images: ["project5_1.jpg"],
                link: "#",
                github: "#",
                date: "2023-10",
                featured: false,
                technologies: ["TensorFlow.js", "React", "Canvas API"]
            },
            {
                id: 6,
                title: "个人知识管理系统",
                slug: "personal-knowledge-base",
                description: "结合笔记、标签和双向链接的个人知识整理系统，支持 Markdown 编辑和全文搜索。",
                category: "效率工具",
                tags: ["Electron", "TypeScript", "SQLite", "Markdown"],
                thumbnail: "project6.jpg",
                images: ["project6_1.jpg"],
                link: "#",
                github: "#",
                date: "2023-09",
                featured: false,
                technologies: ["Electron", "TypeScript", "SQLite", "Markdown"]
            }
        ],
        profile: {
            name: "Xavier Qin",
            title: "全栈设计师 & 前端开发者",
            avatar: "avatar.jpg",
            bio: "热爱技术，关注设计，致力于创造优雅且功能强大的数字产品。拥有8年前端开发和UI/UX设计经验，擅长构建现代化的响应式应用和设计系统。",
            location: "中国 · 广州",
            email: "alex@example.com",
            website: "https://alexchen.dev",
            social: {
                github: "https://github.com/alexchen",
                twitter: "https://twitter.com/alexchen",
                linkedin: "https://linkedin.com/in/alexchen",
                dribbble: "https://dribbble.com/alexchen",
                instagram: "https://instagram.com/alexchen"
            },
            skills: [
                { name: "前端开发", level: 95, category: "技术" },
                { name: "UI/UX设计", level: 90, category: "设计" },
                { name: "React / Vue", level: 92, category: "技术" },
                { name: "TypeScript", level: 88, category: "技术" },
                { name: "Node.js", level: 85, category: "技术" },
                { name: "CSS / Sass", level: 93, category: "设计" },
                { name: "设计系统", level: 89, category: "设计" },
                { name: "性能优化", level: 86, category: "技术" }
            ],
            experience: [
                {
                    company: "TechCorp Inc.",
                    position: "高级前端工程师",
                    period: "2021 - 至今",
                    description: "负责公司核心产品的前端架构设计与开发，带领5人小组完成多个重要项目的交付。"
                },
                {
                    company: "DesignStudio",
                    position: "UI/UX设计师",
                    period: "2018 - 2021",
                    description: "为多个知名品牌设计数字产品界面，参与从概念设计到开发落地的完整流程。"
                },
                {
                    company: "StartupXYZ",
                    position: "全栈开发工程师",
                    period: "2016 - 2018",
                    description: "作为初创团队核心成员，独立完成产品的前后端开发工作。"
                }
            ],
            education: [
                {
                    school: "广州交通大学",
                    degree: "软件编程爱好者",
                    period: "2014 - 2016",
                    description: "研究方向：人机交互与用户体验"
                },
                {
                    school: "华东理工大学",
                    degree: "软件工程学士",
                    period: "2010 - 2014",
                    description: "ACM-ICPC 竞赛获奖者"
                }
            ],
            achievements: [
                "获得 Google Developer Expert 认证",
                "开源项目累计 Star 超过 15,000",
                "多次在前端技术大会进行主题分享",
                "出版《现代前端性能优化实战》技术书籍"
            ],
            team: [
                {
                    name: "Sarah Liu",
                    role: "首席设计师",
                    avatar: "sarah.jpg",
                    bio: "深耕 UI/UX 设计领域10年，专注于设计系统与品牌视觉。"
                },
                {
                    name: "Mike Wang",
                    role: "后端架构师",
                    avatar: "mike.jpg",
                    bio: "全栈工程师，擅长系统架构与微服务设计。"
                },
                {
                    name: "Emma Zhang",
                    role: "产品经理",
                    avatar: "emma.jpg",
                    bio: "专注于用户体验研究与产品策略规划。"
                },
                {
                    name: "James Li",
                    role: "DevOps 工程师",
                    avatar: "james.jpg",
                    bio: "自动化与云原生技术专家。"
                },
                {
                    name: "Lisa Yang",
                    role: "创意工程师",
                    avatar: "lisa.jpg",
                    bio: "热爱创意编程与互动体验设计。"
                }
            ]
        }
    };

    function arrayFind(arr, callback) {
        for (var i = 0; i < arr.length; i++) {
            if (callback(arr[i], i, arr)) return arr[i];
        }
        return undefined;
    }

    var App = {
        data: {
            articles: [],
            projects: [],
            profile: null,
            currentPage: 'home',
            favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
            theme: localStorage.getItem('theme') || 'light',
            fontSize: localStorage.getItem('fontSize') || 'medium',
            currentArticle: null,
            comments: JSON.parse(localStorage.getItem('comments') || '{}')
        },
        timeThemes: [
            { start: 0, end: 5, icon: '🌙', text: '深夜', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
            { start: 5, end: 7, icon: '🌅', text: '黎明', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
            { start: 7, end: 9, icon: '🌄', text: '清晨', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
            { start: 9, end: 12, icon: '☀️', text: '上午', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { start: 12, end: 14, icon: '🌞', text: '正午', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { start: 14, end: 17, icon: '🌤️', text: '下午', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
            { start: 17, end: 19, icon: '🌇', text: '傍晚', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
            { start: 19, end: 21, icon: '🌆', text: '黄昏', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { start: 21, end: 24, icon: '🌃', text: '夜晚', gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }
        ],

        init: function() {
            var self = this;
            try { this.showLoader(); } catch(e) { console.error('showLoader error:', e); }
            try { this.loadData(); } catch(e) { console.error('loadData error:', e); }
            try { this.setupTheme(); } catch(e) { console.error('setupTheme error:', e); }
            try { this.setupTimeTheme(); } catch(e) { console.error('setupTimeTheme error:', e); }
            try { this.setupParticles(); } catch(e) { console.error('setupParticles error:', e); }
            try { this.setupNavigation(); } catch(e) { console.error('setupNavigation error:', e); }
            try { this.setupInteractions(); } catch(e) { console.error('setupInteractions error:', e); }
            try { this.setupKeyboardNav(); } catch(e) { console.error('setupKeyboardNav error:', e); }
            try { this.render(); } catch(e) { console.error('render error:', e); }
            try { this.hideLoader(); } catch(e) { console.error('hideLoader error:', e); }
            try { this.animateStats(); } catch(e) { console.error('animateStats error:', e); }
            try { this.setupScrollEffects(); } catch(e) { console.error('setupScrollEffects error:', e); }
        },

        loadData: function() {
            this.data.articles = DATA.articles;
            this.data.projects = DATA.projects;
            this.data.profile = DATA.profile;
        },

        showLoader: function() {
            document.getElementById('loader').classList.remove('hidden');
        },

        hideLoader: function() {
            setTimeout(function() {
                document.getElementById('loader').classList.add('hidden');
            }, 500);
        },

        setupTheme: function() {
            var self = this;
            document.documentElement.setAttribute('data-theme', this.data.theme);
            var toggle = document.getElementById('theme-toggle');
            toggle.addEventListener('click', function() {
                self.data.theme = self.data.theme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', self.data.theme);
                localStorage.setItem('theme', self.data.theme);
                self.showToast('success', '已切换到' + (self.data.theme === 'light' ? '浅色' : '深色') + '模式');
            });
        },

        setupTimeTheme: function() {
            var updateTheme = function() {
                var hour = new Date().getHours();
                var theme = arrayFind(App.timeThemes, function(t) { return hour >= t.start && hour < t.end; }) || App.timeThemes[0];
                var overlay = document.getElementById('gradient-overlay');
                overlay.style.background = theme.gradient;
                document.querySelector('.time-icon').textContent = theme.icon;
                document.querySelector('.time-text').textContent = theme.text;
            };
            updateTheme();
            setInterval(updateTheme, 60000);
        },

        setupParticles: function() {
            var canvas = document.getElementById('particle-canvas');
            var ctx = canvas.getContext('2d');
            var particles = [];

            var resize = function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };

            var createParticles = function() {
                particles = [];
                var count = Math.min(80, Math.floor(window.innerWidth / 15));
                for (var i = 0; i < count; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5,
                        radius: Math.random() * 2 + 1,
                        opacity: Math.random() * 0.5 + 0.2
                    });
                }
            };

            var animate = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(function(p) {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(102, 126, 234, ' + p.opacity + ')';
                    ctx.fill();
                });
                requestAnimationFrame(animate);
            };

            resize();
            createParticles();
            animate();

            window.addEventListener('resize', function() {
                resize();
                createParticles();
            });
        },

        setupNavigation: function() {
            var self = this;
            var navToggle = document.getElementById('nav-toggle');
            var navMenu = document.getElementById('nav-menu');

            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
            });

            document.querySelectorAll('[data-nav]').forEach(function(link) {
                link.addEventListener('click', function(e) {
                    var target = e.currentTarget.dataset.nav;
                    self.navigateTo(target);
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            window.addEventListener('popstate', function(e) {
                if (e.state && e.state.page) {
                    self.navigateTo(e.state.page, false);
                }
            });
        },

        navigateTo: function(page, pushState) {
            pushState = pushState !== false;
            var articleSlug = this.getArticleSlugFromHash();

            if (articleSlug && page === 'article-detail') {
                this.showArticle(articleSlug);
            } else {
                document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
                document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });

                var targetPage = document.getElementById(page);
                if (!targetPage) targetPage = document.getElementById('home');
                targetPage.classList.add('active');

                var navLink = document.querySelector('.nav-link[data-nav="' + page + '"]');
                if (navLink) navLink.classList.add('active');

                this.data.currentPage = page;
                window.scrollTo({ top: 0, behavior: 'smooth' });

                if (pushState) {
                    history.pushState({ page: page }, '', '#' + page);
                }
            }
        },

        getArticleSlugFromHash: function() {
            var hash = window.location.hash;
            var match = hash.match(/^#article-([a-z-]+)$/);
            return match ? match[1] : null;
        },

        setupInteractions: function() {
            this.setupFontSize();
            this.setupSearch();
            this.setupFavorite();
            this.setupShare();
            this.setupBackToTop();
            this.setupReadingProgress();
            this.setupContactForm();
            this.setupPortfolioModal();
            this.setupComments();
        },

        setupFontSize: function() {
            var self = this;
            var btn = document.getElementById('font-size-btn');
            var popup = document.getElementById('font-size-popup');

            btn.addEventListener('click', function() {
                popup.classList.toggle('active');
                btn.setAttribute('aria-expanded', popup.classList.contains('active'));
            });

            popup.querySelectorAll('.font-size-option').forEach(function(option) {
                option.addEventListener('click', function() {
                    var size = option.dataset.size;
                    document.documentElement.setAttribute('data-font-size', size);
                    localStorage.setItem('fontSize', size);
                    self.data.fontSize = size;

                    popup.querySelectorAll('.font-size-option').forEach(function(o) { o.classList.remove('active'); });
                    option.classList.add('active');
                    popup.classList.remove('active');

                    var sizeText = size === 'small' ? '小' : size === 'medium' ? '中' : '大';
                    self.showToast('success', '字体大小已调整为' + sizeText);
                });
            });

            document.getElementById('font-size-popup').querySelector('[data-size="' + this.data.fontSize + '"]').classList.add('active');
            document.addEventListener('click', function(e) {
                if (!e.target.closest('#font-size-btn') && !e.target.closest('#font-size-popup')) {
                    popup.classList.remove('active');
                }
            });
        },

        setupSearch: function() {
            var self = this;
            var searchBtn = document.getElementById('search-btn');
            var searchModal = document.getElementById('search-modal');
            var searchInput = document.getElementById('modal-search-input');
            var searchResults = document.getElementById('search-modal-results');

            searchBtn.addEventListener('click', function() {
                searchModal.classList.add('active');
                setTimeout(function() { searchInput.focus(); }, 100);
            });

            searchModal.querySelector('.search-modal-backdrop').addEventListener('click', function() {
                searchModal.classList.remove('active');
            });

            searchInput.addEventListener('input', function(e) {
                var query = e.target.value.toLowerCase().trim();
                if (query.length < 2) {
                    searchResults.innerHTML = '';
                    return;
                }

                var results = self.data.articles.filter(function(a) {
                    return a.title.toLowerCase().indexOf(query) !== -1 ||
                        a.content.toLowerCase().indexOf(query) !== -1 ||
                        a.tags.some(function(t) { return t.toLowerCase().indexOf(query) !== -1; });
                }).slice(0, 5);

                searchResults.innerHTML = results.map(function(r) {
                    return '<div class="search-modal-result" data-slug="' + r.slug + '">' +
                        '<div class="search-modal-result-title">' + r.title + '</div>' +
                        '<div class="search-modal-result-meta">' + r.date + ' · ' + r.readTime + '</div>' +
                        '</div>';
                }).join('');

                searchResults.querySelectorAll('.search-modal-result').forEach(function(el) {
                    el.addEventListener('click', function() {
                        self.showArticle(el.dataset.slug);
                        searchModal.classList.remove('active');
                    });
                });
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' || e.keyCode === 27) {
                    searchModal.classList.remove('active');
                }
                if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.keyCode === 75)) {
                    e.preventDefault();
                    searchModal.classList.add('active');
                    setTimeout(function() { searchInput.focus(); }, 100);
                }
            });

            var mainSearchInput = document.getElementById('search-input');
            var mainSearchResults = document.getElementById('search-results');
            var mainSearchEmpty = document.getElementById('search-empty');
            var searchClear = document.getElementById('search-clear');

            mainSearchInput.addEventListener('input', function(e) {
                var query = e.target.value.toLowerCase().trim();
                if (query.length > 0) {
                    searchClear.classList.add('show');
                } else {
                    searchClear.classList.remove('show');
                }

                if (query.length < 2) {
                    mainSearchResults.innerHTML = '';
                    mainSearchEmpty.style.display = 'none';
                    return;
                }

                var results = self.data.articles.filter(function(a) {
                    return a.title.toLowerCase().indexOf(query) !== -1 ||
                        a.excerpt.toLowerCase().indexOf(query) !== -1 ||
                        a.tags.some(function(t) { return t.toLowerCase().indexOf(query) !== -1; });
                });

                if (results.length === 0) {
                    mainSearchResults.innerHTML = '';
                    mainSearchEmpty.style.display = 'block';
                } else {
                    mainSearchEmpty.style.display = 'none';
                    mainSearchResults.innerHTML = results.map(function(r) {
                        return '<div class="search-result" data-slug="' + r.slug + '">' +
                            '<div class="search-result-title">' + r.title + '</div>' +
                            '<div class="search-result-excerpt">' + r.excerpt + '</div>' +
                            '</div>';
                    }).join('');

                    mainSearchResults.querySelectorAll('.search-result').forEach(function(el) {
                        el.addEventListener('click', function() {
                            self.showArticle(el.dataset.slug);
                        });
                    });
                }
            });

            searchClear.addEventListener('click', function() {
                mainSearchInput.value = '';
                searchClear.classList.remove('show');
                mainSearchResults.innerHTML = '';
                mainSearchEmpty.style.display = 'none';
                mainSearchInput.focus();
            });
        },

        setupFavorite: function() {
            var self = this;
            var btn = document.getElementById('favorite-btn');
            btn.addEventListener('click', function() {
                if (!self.data.currentArticle) return;
                var id = self.data.currentArticle.id;
                var idx = self.data.favorites.indexOf(id);

                if (idx === -1) {
                    self.data.favorites.push(id);
                    btn.classList.add('liked');
                    self.showToast('success', '已添加到收藏');
                } else {
                    self.data.favorites.splice(idx, 1);
                    btn.classList.remove('liked');
                    self.showToast('info', '已从收藏移除');
                }

                localStorage.setItem('favorites', JSON.stringify(self.data.favorites));
                self.updateFavoritesList();
            });
        },

        setupShare: function() {
            var self = this;
            document.getElementById('share-btn').addEventListener('click', function() {
                if (!self.data.currentArticle) return;
                var url = window.location.href;

                if (navigator.share) {
                    navigator.share({
                        title: self.data.currentArticle.title,
                        text: self.data.currentArticle.excerpt,
                        url: url
                    });
                } else {
                    navigator.clipboard.writeText(url).then(function() {
                        self.showToast('success', '链接已复制到剪贴板');
                    });
                }
            });
        },

        setupBackToTop: function() {
            var btn = document.getElementById('back-top');
            btn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        setupReadingProgress: function() {
            var progressBar = document.querySelector('.reading-progress-bar');
            var progressContainer = document.getElementById('reading-progress');

            window.addEventListener('scroll', function() {
                var article = document.querySelector('.article-body');
                if (!article) {
                    progressContainer.style.display = 'none';
                    return;
                }

                progressContainer.style.display = 'block';
                var articleTop = article.offsetTop;
                var articleHeight = article.offsetHeight;
                var windowHeight = window.innerHeight;
                var scrolled = window.scrollY - articleTop + windowHeight / 2;
                var progress = Math.max(0, Math.min(100, (scrolled / articleHeight) * 100));

                progressBar.style.width = progress + '%';
                progressContainer.setAttribute('aria-valuenow', Math.round(progress));
            });
        },

        setupContactForm: function() {
            var self = this;
            var form = document.getElementById('contact-form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var valid = true;

                form.querySelectorAll('.form-input').forEach(function(input) {
                    var error = input.parentElement.querySelector('.form-error');
                    input.classList.remove('error');
                    error.classList.remove('show');

                    if (!input.value.trim()) {
                        input.classList.add('error');
                        error.textContent = '此字段为必填项';
                        error.classList.add('show');
                        valid = false;
                    } else if (input.type === 'email' && !self.validateEmail(input.value)) {
                        input.classList.add('error');
                        error.textContent = '请输入有效的邮箱地址';
                        error.classList.add('show');
                        valid = false;
                    }
                });

                if (valid) {
                    self.showToast('success', '消息发送成功！我们会尽快回复您。');
                    form.reset();
                }
            });
        },

        validateEmail: function(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        setupPortfolioModal: function() {
            var self = this;
            var modal = document.getElementById('portfolio-modal');
            var modalBody = document.getElementById('modal-body');

            document.getElementById('portfolio-grid').addEventListener('click', function(e) {
                var card = e.target.closest('.portfolio-card');
                if (!card) return;

                var id = parseInt(card.dataset.id);
                var project = arrayFind(self.data.projects, function(p) { return p.id === id; });
                if (!project) return;

                modalBody.innerHTML = '<div class="modal-image"></div>' +
                    '<h2 id="modal-title">' + project.title + '</h2>' +
                    '<p>' + project.description + '</p>' +
                    '<div class="modal-technologies">' +
                    project.technologies.map(function(t) { return '<span class="modal-tech-tag">' + t + '</span>'; }).join('') +
                    '</div>' +
                    '<div class="modal-links">' +
                    '<a href="' + project.link + '" class="modal-link" target="_blank" rel="noopener">' +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
                    '访问网站</a>' +
                    '<a href="' + project.github + '" class="modal-link" target="_blank" rel="noopener">' +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>' +
                    'GitHub</a>' +
                    '</div>';

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            modal.querySelector('.modal-backdrop').addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });

            modal.querySelector('.modal-close').addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        },

        setupComments: function() {
            var self = this;
            var form = document.querySelector('.comment-form');
            if (!form) return;

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var textarea = form.querySelector('.comment-input');
                var text = textarea.value.trim();

                if (!text) return;

                var articleId = self.data.currentArticle ? self.data.currentArticle.id : 'home';
                if (!self.data.comments[articleId]) {
                    self.data.comments[articleId] = [];
                }

                self.data.comments[articleId].unshift({
                    id: Date.now(),
                    author: '匿名用户',
                    date: new Date().toLocaleDateString('zh-CN'),
                    content: text
                });

                localStorage.setItem('comments', JSON.stringify(self.data.comments));
                textarea.value = '';
                self.renderComments();
                self.showToast('success', '评论已发表');
            });
        },

        renderComments: function() {
            var container = document.querySelector('.comments-list');
            if (!container || !this.data.currentArticle) return;

            var articleId = this.data.currentArticle.id;
            var comments = this.data.comments[articleId] || [];

            if (comments.length === 0) {
                container.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 20px;">暂无评论，来发表第一篇评论吧！</p>';
                return;
            }

            container.innerHTML = comments.map(function(c) {
                return '<div class="comment-item">' +
                    '<div class="comment-header">' +
                    '<div class="comment-avatar">' + c.author.charAt(0) + '</div>' +
                    '<span class="comment-author">' + c.author + '</span>' +
                    '<span class="comment-date">' + c.date + '</span>' +
                    '</div>' +
                    '<div class="comment-content">' + c.content + '</div>' +
                    '</div>';
            }).join('');
        },

        setupKeyboardNav: function() {
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Tab' || e.keyCode === 9) {
                    document.body.classList.add('keyboard-nav');
                }
            });

            document.addEventListener('mousedown', function() {
                document.body.classList.remove('keyboard-nav');
            });
        },

        setupScrollEffects: function() {
            var header = document.getElementById('header');

            window.addEventListener('scroll', function() {
                var currentScroll = window.scrollY;

                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        },

        animateStats: function() {
            document.querySelectorAll('.stat-value[data-count]').forEach(function(el) {
                var target = parseInt(el.dataset.count);
                var duration = 2000;
                var step = target / (duration / 16);
                var current = 0;

                var update = function() {
                    current += step;
                    if (current < target) {
                        el.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target.toLocaleString();
                    }
                };

                update();
            });
        },

        showArticle: function(slug) {
            var self = this;
            var article = arrayFind(this.data.articles, function(a) { return a.slug === slug; });
            if (!article) {
                this.navigateTo('articles');
                return;
            }

            this.data.currentArticle = article;

            document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
            document.getElementById('article-detail').classList.add('active');

            var isFav = this.data.favorites.indexOf(article.id) !== -1;
            var favBtn = document.getElementById('favorite-btn');
            if (isFav) {
                favBtn.classList.add('liked');
            } else {
                favBtn.classList.remove('liked');
            }

            var related = this.data.articles
                .filter(function(a) { return a.id !== article.id && (a.category === article.category || a.tags.some(function(t) { return article.tags.indexOf(t) !== -1; })); })
                .slice(0, 3);

            var articleHtml = '<header class="article-header">' +
                '<h1 id="article-title">' + article.title + '</h1>' +
                '<div class="article-meta">' +
                '<span class="article-meta-item">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
                article.date + '</span>' +
                '<span class="article-meta-item">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
                article.readTime + '</span>' +
                '<span class="article-meta-item">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
                article.views.toLocaleString() + ' 浏览</span>' +
                '</div></header>' +
                '<div class="article-cover"></div>' +
                '<div class="article-body">' + this.parseMarkdown(article.content) + '</div>' +
                '<div class="article-tags">' +
                article.tags.map(function(t) { return '<span class="tag-item">' + t + '</span>'; }).join('') +
                '</div>' +
                '<div class="related-articles"><h3>相关文章</h3><div class="related-grid">' +
                related.map(function(r) {
                    return '<div class="related-card" data-slug="' + r.slug + '">' +
                        '<div class="related-card-title">' + r.title + '</div>' +
                        '<div class="related-card-meta">' + r.date + ' · ' + r.readTime + '</div>' +
                        '</div>';
                }).join('') +
                '</div></div>' +
                '<div class="comments-section"><h3>评论</h3>' +
                '<div class="comment-form"><textarea class="comment-input" placeholder="写下你的评论..."></textarea>' +
                '<button class="btn btn-primary" style="margin-top: 12px;">发表评论</button></div>' +
                '<div class="comments-list"></div></div>';

            document.getElementById('article-content').innerHTML = articleHtml;

            document.querySelectorAll('.related-card').forEach(function(el) {
                el.addEventListener('click', function() {
                    self.showArticle(el.dataset.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });

            this.renderComments();

            history.pushState({ page: 'article-detail', slug: slug }, '', '#article-' + slug);
        },

        parseMarkdown: function(text) {
            return text
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .replace(/`(.+?)`/g, '<code>$1</code>')
                .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
                .replace(/^\- (.+)$/gm, '<li>$1</li>')
                .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
                .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
                .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/^(?!<[hupol])(.+)$/gm, '<p>$1</p>')
                .replace(/<p><\/p>/g, '');
        },

        render: function() {
            this.renderFeaturedArticles();
            this.renderArticlesGrid();
            this.renderCategories();
            this.renderTagsCloud();
            this.renderFavoritesList();
            this.renderPortfolio();
            this.renderAbout();
            this.renderArchive();
            this.renderFooterCategories();
        },

        renderFeaturedArticles: function() {
            var self = this;
            var featured = this.data.articles.filter(function(a) { return a.featured; }).slice(0, 3);
            var container = document.getElementById('featured-articles');

            container.innerHTML = featured.map(function(a) {
                return '<article class="featured-card" data-slug="' + a.slug + '">' +
                    '<div class="featured-card-image"><span class="featured-card-badge">精选</span></div>' +
                    '<div class="featured-card-content">' +
                    '<h3 class="featured-card-title">' + a.title + '</h3>' +
                    '<p class="featured-card-excerpt">' + a.excerpt + '</p>' +
                    '<div class="featured-card-meta"><span>' + a.date + '</span><span>' + a.readTime + '</span></div>' +
                    '</div></article>';
            }).join('');

            container.querySelectorAll('.featured-card').forEach(function(card) {
                card.addEventListener('click', function() {
                    self.showArticle(card.dataset.slug);
                });
            });
        },

        renderArticlesGrid: function(filter, sort) {
            var self = this;
            filter = filter || 'all';
            sort = sort || 'date-desc';
            
            var articles = this.data.articles.slice();

            if (filter === 'featured') {
                articles = articles.filter(function(a) { return a.featured; });
            } else if (filter !== 'all') {
                articles = articles.filter(function(a) { return a.category === filter; });
            }

            articles.sort(function(a, b) {
                if (sort === 'date-asc') return new Date(a.date) - new Date(b.date);
                if (sort === 'views-desc') return b.views - a.views;
                if (sort === 'likes-desc') return b.likes - a.likes;
                return new Date(b.date) - new Date(a.date);
            });

            var container = document.getElementById('articles-grid');
            container.innerHTML = articles.map(function(a) {
                return '<article class="article-card ' + (a.featured ? 'featured' : '') + '" data-slug="' + a.slug + '" role="listitem">' +
                    '<div class="article-card-image"><span class="article-card-category">' + a.category + '</span></div>' +
                    '<div class="article-card-content">' +
                    '<h3 class="article-card-title">' + a.title + '</h3>' +
                    '<p class="article-card-excerpt">' + a.excerpt + '</p>' +
                    '<div class="article-card-footer">' +
                    '<div class="article-card-meta"><span>' + a.date + '</span><span>' + a.readTime + '</span></div>' +
                    '<span>❤️ ' + a.likes + '</span>' +
                    '</div></div></article>';
            }).join('');

            container.querySelectorAll('.article-card').forEach(function(card) {
                card.addEventListener('click', function() {
                    self.showArticle(card.dataset.slug);
                });
            });
        },

        renderCategories: function() {
            var self = this;
            var container = document.getElementById('category-list');
            var categories = [
                { name: '全部', slug: 'all', count: this.data.articles.length }
            ];
            
            this.data.articles.forEach(function(a) {
                var cat = arrayFind(categories, function(c) { return c.name === a.category; });
                if (cat) cat.count++;
                else categories.push({ name: a.category, slug: a.category, count: 1 });
            });

            container.innerHTML = categories.map(function(c) {
                return '<li class="category-item ' + (c.slug === 'all' ? 'active' : '') + '" data-category="' + c.slug + '">' +
                    '<span class="category-name">' + c.name + '</span>' +
                    '<span class="category-count">' + c.count + '</span></li>';
            }).join('');

            container.querySelectorAll('.category-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    container.querySelectorAll('.category-item').forEach(function(i) { i.classList.remove('active'); });
                    item.classList.add('active');
                    var filter = item.dataset.category;
                    var sort = document.getElementById('sort-select').value;
                    self.renderArticlesGrid(filter, sort);
                });
            });

            document.getElementById('sort-select').addEventListener('change', function(e) {
                var filter = container.querySelector('.category-item.active');
                filter = filter ? filter.dataset.category : 'all';
                self.renderArticlesGrid(filter, e.target.value);
            });

            document.querySelectorAll('.filter-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    var filter = btn.dataset.filter;
                    var sort = document.getElementById('sort-select').value;
                    self.renderArticlesGrid(filter, sort);
                });
            });
        },

        renderTagsCloud: function() {
            var self = this;
            var tags = [];
            this.data.articles.forEach(function(a) {
                a.tags.forEach(function(t) {
                    if (tags.indexOf(t) === -1) tags.push(t);
                });
            });
            var container = document.getElementById('tags-cloud');

            container.innerHTML = tags.map(function(t) {
                return '<span class="tag-item" data-tag="' + t + '">' + t + '</span>';
            }).join('');

            container.querySelectorAll('.tag-item').forEach(function(tag) {
                tag.addEventListener('click', function() {
                    self.navigateTo('search');
                    setTimeout(function() {
                        document.getElementById('search-input').value = tag.dataset.tag;
                        document.getElementById('search-input').dispatchEvent(new Event('input'));
                    }, 100);
                });
            });
        },

        renderFavoritesList: function() {
            var self = this;
            var container = document.getElementById('favorites-list');
            var favorites = this.data.articles.filter(function(a) { return self.data.favorites.indexOf(a.id) !== -1; });

            if (favorites.length === 0) {
                container.innerHTML = '<li class="favorite-item" style="cursor: default;">暂无收藏</li>';
                return;
            }

            container.innerHTML = favorites.map(function(a) {
                return '<li><a href="#article-' + a.slug + '" class="favorite-item" data-slug="' + a.slug + '">' + a.title + '</a></li>';
            }).join('');

            container.querySelectorAll('.favorite-item[data-slug]').forEach(function(item) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.showArticle(item.dataset.slug);
                });
            });
        },

        updateFavoritesList: function() {
            this.renderFavoritesList();
        },

        renderPortfolio: function() {
            var self = this;
            var container = document.getElementById('portfolio-grid');
            var filtersContainer = document.getElementById('portfolio-filters');
            var categories = [];
            this.data.projects.forEach(function(p) {
                if (categories.indexOf(p.category) === -1) categories.push(p.category);
            });

            filtersContainer.innerHTML = '<button class="filter-chip active" data-filter="all" role="tab" aria-selected="true">全部</button>' +
                categories.map(function(c) {
                    return '<button class="filter-chip" data-filter="' + c + '" role="tab" aria-selected="false">' + c + '</button>';
                }).join('');

            filtersContainer.querySelectorAll('.filter-chip').forEach(function(chip) {
                chip.addEventListener('click', function() {
                    filtersContainer.querySelectorAll('.filter-chip').forEach(function(c) {
                        c.classList.remove('active');
                        c.setAttribute('aria-selected', 'false');
                    });
                    chip.classList.add('active');
                    chip.setAttribute('aria-selected', 'true');
                    self.renderPortfolioGrid(chip.dataset.filter);
                });
            });

            this.renderPortfolioGrid('all');
        },

        renderPortfolioGrid: function(filter) {
            var projects = filter === 'all' ? this.data.projects : this.data.projects.filter(function(p) { return p.category === filter; });
            var container = document.getElementById('portfolio-grid');

            container.innerHTML = projects.map(function(p) {
                return '<article class="portfolio-card" data-id="' + p.id + '">' +
                    '<div class="portfolio-card-image"><div class="portfolio-card-overlay"><span>查看详情</span></div></div>' +
                    '<div class="portfolio-card-content">' +
                    '<h3 class="portfolio-card-title">' + p.title + '</h3>' +
                    '<p class="portfolio-card-desc">' + p.description + '</p>' +
                    '<div class="portfolio-card-tags">' +
                    p.tags.slice(0, 3).map(function(t) { return '<span class="portfolio-card-tag">' + t + '</span>'; }).join('') +
                    '</div></div></article>';
            }).join('');
        },

        renderAbout: function() {
            if (!this.data.profile) return;
            var p = this.data.profile;

            document.getElementById('about-bio').textContent = p.bio;
            document.getElementById('about-location').textContent = p.location;

            var socialContainer = document.getElementById('about-social');
            var socialHtml = '';
            for (var key in p.social) {
                socialHtml += '<a href="' + p.social[key] + '" class="social-link" target="_blank" rel="noopener" aria-label="' + key + '">' +
                    this.getSocialIcon(key) + '</a>';
            }
            socialContainer.innerHTML = socialHtml;

            var skillsContainer = document.getElementById('skills-grid');
            skillsContainer.innerHTML = p.skills.map(function(s) {
                return '<div class="skill-item">' +
                    '<div class="skill-header"><span class="skill-name">' + s.name + '</span><span class="skill-level">' + s.level + '%</span></div>' +
                    '<div class="skill-bar"><div class="skill-progress" style="width: 0%" data-progress="' + s.level + '"></div></div>' +
                    '</div>';
            }).join('');

            setTimeout(function() {
                skillsContainer.querySelectorAll('.skill-progress').forEach(function(bar) {
                    bar.style.width = bar.dataset.progress + '%';
                });
            }, 300);

            var expContainer = document.getElementById('experience-timeline');
            expContainer.innerHTML = p.experience.map(function(e) {
                return '<div class="timeline-item">' +
                    '<div class="timeline-date">' + e.period + '</div>' +
                    '<h4 class="timeline-title">' + e.position + '</h4>' +
                    '<div class="timeline-company">' + e.company + '</div>' +
                    '<p class="timeline-desc">' + e.description + '</p>' +
                    '</div>';
            }).join('');

            var teamContainer = document.getElementById('team-grid');
            teamContainer.innerHTML = p.team.map(function(m) {
                var initials = m.name.split(' ').map(function(n) { return n[0]; }).join('');
                return '<div class="team-card">' +
                    '<div class="team-avatar">' + initials + '</div>' +
                    '<h4 class="team-name">' + m.name + '</h4>' +
                    '<p class="team-role">' + m.role + '</p>' +
                    '<p class="team-bio">' + m.bio + '</p>' +
                    '</div>';
            }).join('');
        },

        getSocialIcon: function(platform) {
            var icons = {
                github: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
                twitter: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>',
                linkedin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
                dribbble: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>',
                instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'
            };
            return icons[platform] || '';
        },

        renderArchive: function() {
            var self = this;
            var container = document.getElementById('archive-timeline');
            var articles = this.data.articles.slice().sort(function(a, b) { return new Date(b.date) - new Date(a.date); });

            var byYear = {};
            articles.forEach(function(a) {
                var year = new Date(a.date).getFullYear();
                if (!byYear[year]) byYear[year] = [];
                byYear[year].push(a);
            });

            var years = Object.keys(byYear).sort(function(a, b) { return b - a; });
            var html = '';
            
            years.forEach(function(year) {
                html += '<div class="archive-year"><h3 class="archive-year-title">' + year + '</h3><ul class="archive-list">' +
                    byYear[year].map(function(a) {
                        return '<li class="archive-item" data-slug="' + a.slug + '">' +
                            '<span class="archive-date">' + a.date + '</span>' +
                            '<span class="archive-title">' + a.title + '</span>' +
                            '<span class="archive-category">' + a.category + '</span>' +
                            '</li>';
                    }).join('') + '</ul></div>';
            });
            
            container.innerHTML = html;

            container.querySelectorAll('.archive-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    self.showArticle(item.dataset.slug);
                });
            });
        },

        renderFooterCategories: function() {
            var container = document.getElementById('footer-categories');
            var categories = [];
            
            this.data.articles.forEach(function(a) {
                var cat = arrayFind(categories, function(c) { return c.name === a.category; });
                if (cat) cat.count++;
                else categories.push({ name: a.category, slug: a.category, count: 1 });
            });
            
            container.innerHTML = categories.map(function(c) {
                return '<li><a href="#articles" data-nav="articles">' + c.name + ' (' + c.count + ')</a></li>';
            }).join('');
        },

        showToast: function(type, message) {
            var container = document.getElementById('toast-container');
            var toast = document.createElement('div');
            toast.className = 'toast ' + type;
            
            var iconSvg = type === 'success' 
                ? '<polyline points="20 6 9 17 4 12"/>'
                : type === 'error'
                    ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
                    : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>';
            
            toast.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + iconSvg + '</svg><span>' + message + '</span>';
            container.appendChild(toast);

            setTimeout(function() {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(function() { toast.remove(); }, 300);
            }, 3000);
        }
    };

    return App;
})();

document.addEventListener('DOMContentLoaded', function() {
    try {
        BlogApp.init();

        var articleSlug = BlogApp.getArticleSlugFromHash();
        if (articleSlug) {
            BlogApp.showArticle(articleSlug);
        }
    } catch (err) {
        console.error('初始化错误:', err);
        var loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
        alert('加载出错: ' + err.message);
    }
});