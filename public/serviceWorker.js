import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST || []);


registerRoute(
  ({ url }) => url.origin === 'https://www.omdbapi.com',
  new CacheFirst({
    cacheName: 'api-cache',
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          if (response.ok) return response;
          return null;
        },
      },
    ],
  })
);
