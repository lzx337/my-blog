var CACHE_NAME = 'ycqh-blog-v3';
var STATIC_CACHE = 'ycqh-static-v3';
var API_CACHE = 'ycqh-api-v3';

var PRECACHE_URLS = [
  './',
  './index.html',
  './pages/post.html',
  './pages/post1.html',
  './pages/post2.html',
  './pages/post3.html',
  './pages/post4.html',
  './pages/about.html',
  './pages/search.html',
  './pages/navigation.html',
  './pages/project.html',
  './pages/friend.html',
  './pages/anime.html',
  './pages/music.html',
  './pages/archives.html',
  './pages/categories.html',
  './pages/tags.html',
  './posts.json',
  './manifest.json',
  './js/utils.js',
  './js/data.js',
  './js/theme.js',
  './js/search.js',
  './js/main.js',
  './js/music.js',
  './js/chat.js',
  './js/seo.js',
  './css/glass.css',
  './css/glass-standalone.css',
  './assets/favicon.png',
  './assets/profile.png',
  './assets/logo.png',
  './assets/home.webp',
  './assets/sakura.png',
  'https://cdn.jsdelivr.net/npm/daisyui@4.12.24/dist/full.min.css',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://code.iconify.design/3/3.1.0/iconify.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] 预缓存核心资源');
      return cache.addAll(PRECACHE_URLS).catch(function(err) {
        console.warn('[SW] 部分资源预缓存失败:', err);
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME && name !== STATIC_CACHE && name !== API_CACHE;
        }).map(function(name) {
          console.log('[SW] 清理旧缓存:', name);
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  var path = url.pathname;

  if (url.hostname === 'busuanzi.ibruce.info' || url.hostname === 'busuanzi.icodef.com') {
    return;
  }
  if (url.hostname === 'api.github.com' || path.includes('giscus')) {
    return;
  }

  if (path.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  if (path.endsWith('/posts.json')) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  if (event.request.method === 'GET') {
    event.respondWith(cacheFirst(event.request));
  }
});

function cacheFirst(request) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;

    return fetch(request).then(function(response) {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      var clone = response.clone();
      caches.open(STATIC_CACHE).then(function(cache) {
        cache.put(request, clone);
      });

      return response;
    }).catch(function() {
      return new Response(
        '<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1a2e;color:#eee;"><div style="text-align:center"><h1>\u79BB\u7EBF\u6A21\u5F0F</h1><p>\u7F51\u7EDC\u672A\u8FDE\u63A5\uFF0C\u90E8\u5206\u5185\u5BB9\u4E0D\u53EF\u7528\u3002</p><p>\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002</p></div></body></html>',
        { status: 503, headers: { 'Content-Type': 'text/html' } }
      );
    });
  });
}

function networkFirst(request, cacheName) {
  return fetch(request).then(function(response) {
    if (response && response.status === 200) {
      var clone = response.clone();
      caches.open(cacheName || API_CACHE).then(function(cache) {
        cache.put(request, clone);
      });
      return response;
    }
    return caches.match(request);
  }).catch(function() {
    return caches.match(request).then(function(cached) {
      if (cached) return cached;
      if (request.url.includes('/api/') || request.url.endsWith('/posts.json')) {
        return new Response(
          JSON.stringify({ error: '\u79BB\u7EBF\u6A21\u5F0F\uFF0C\u6570\u636E\u4E0D\u53EF\u7528' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        '<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1a2e;color:#eee;"><div style="text-align:center"><h1>\u79BB\u7EBF\u6A21\u5F0F</h1><p>\u7F51\u7EDC\u672A\u8FDE\u63A5\uFF0C\u90E8\u5206\u5185\u5BB9\u4E0D\u53EF\u7528\u3002</p><p>\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002</p></div></body></html>',
        { status: 503, headers: { 'Content-Type': 'text/html' } }
      );
    });
  });
}