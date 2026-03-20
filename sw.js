// ═══════════════════════════════════════
// 고양이 관상 앱 - Service Worker
// 오프라인에서도 앱이 작동하도록 캐싱 처리
// ═══════════════════════════════════════

const CACHE_NAME = 'cat-face-v1';

// 캐시할 파일 목록
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// 설치: 필수 파일 캐싱
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// 활성화: 오래된 캐시 삭제
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 요청 처리: 캐시 우선, 없으면 네트워크
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // 오프라인 + 캐시 없을 때 기본 페이지 반환
        return caches.match('./index.html');
      });
    })
  );
});
