const CACHE_NAME = 'dubflix-cache-v1';
const API_CACHE_NAME = 'dubflix-api-cache';
const PRECACHE_URLS = ['/', '/index.html', '/app.js', '/index.css'];


self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets...');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});


self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

 
  if (requestUrl.origin === 'https://www.omdbapi.com') {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Returning cached API response:', event.request.url);
          }
          const fetchPromise = fetch(event.request)
            .then((response) => {
              if (response.ok) {
                console.log('Caching new API response:', event.request.url);
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => cachedResponse || Promise.reject('No cache match'));
          return cachedResponse || fetchPromise;
        })
      )
    );
    return;
  }

  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
