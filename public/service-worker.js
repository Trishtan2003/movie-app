const CACHE_NAME = 'dubflix-cache-v1';
const DATA_CACHE_NAME = 'dubflix-data-cache-v1';

const STATIC_FILES = [
  '/',
  '/index.html',
  '/bundle.js',
  '/favicon.ico',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pre-caching static assets...');
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== DATA_CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('www.omdbapi.com')) {
    // Cache API requests
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) =>
        fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch(() => cache.match(event.request))
      )
    );
  } else {
    // Cache static files
    event.respondWith(
      caches.match(event.request).then((response) =>
        response || fetch(event.request).catch(() => caches.match('/index.html'))
      )
    );
  }
});
