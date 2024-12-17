const CACHE_NAME = 'dubflix-cache-v1';
const DATA_CACHE_NAME = 'dubflix-data-cache-v1';
const MOVIE_DETAILS_CACHE_NAME = 'dubflix-movie-details-cache-v1';

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
          if (
            cache !== CACHE_NAME && 
            cache !== DATA_CACHE_NAME && 
            cache !== MOVIE_DETAILS_CACHE_NAME
          ) {
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
  // OMDb API caching
  if (event.request.url.includes('www.omdbapi.com')) {
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
  } 
  // Movie details caching
  else if (event.request.url.includes('/movie-details/')) {
    event.respondWith(
      caches.open(MOVIE_DETAILS_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              // Cache a clone of the response
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch(() => {
            // If offline, try to retrieve from cache
            return cache.match(event.request);
          });
      })
    );
  } 
  // Existing static file and fallback handling
  else {
    event.respondWith(
      caches.match(event.request).then((response) =>
        response || fetch(event.request).catch(() => caches.match('/index.html'))
      )
    );
  }

  // Intercept and cache movie details
  if (event.request.url.includes('www.omdbapi.com')) {
    event.waitUntil(
      caches.open(MOVIE_DETAILS_CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(event.request);
          if (response.status === 200) {
            const movieData = await response.clone().json();
            // Cache movie details using a unique key
            await cache.put(`movie-details-${movieData.imdbID}`, new Response(JSON.stringify(movieData)));
          }
        } catch (error) {
          console.error('Error caching movie details:', error);
        }
      })
    );
  }
});

// Optional: Add a message listener for manual caching
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_MOVIE_DETAILS') {
    const { movie } = event.data;
    event.waitUntil(
      caches.open(MOVIE_DETAILS_CACHE_NAME).then((cache) => 
        cache.put(`movie-details-${movie.imdbID}`, new Response(JSON.stringify(movie)))
      )
    );
  }
});