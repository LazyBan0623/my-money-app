// sw.js - 知恩手帳 Service Worker v27
const CACHE_NAME = 'zhien-diary-v27';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// 安裝並快取資源
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 立即接管，不等舊版 SW 退出
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 攔截請求，優先從快取讀取（讓 App 秒開）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 清除舊快取，並立即接管所有頁面
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(), // 立即接管頁面
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) return caches.delete(key);
          })
        );
      })
    ])
  );
});
