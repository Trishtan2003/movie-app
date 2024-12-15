import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST || []);


registerRoute(
  ({ url }) => url.origin === 'https://www.omdbapi.com',
  new CacheFirst({
    cacheName: 'api-cache',
  })
);


self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
});
