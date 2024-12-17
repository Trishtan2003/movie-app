const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:\d{1,3})){3}$/)
);

export default function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const swUrl = '/service-worker.js';

    if (isLocalhost) {
      // Check for a valid service worker.
      checkValidServiceWorker(swUrl);
    } else {
      // Register the service worker for production.
      registerValidSW(swUrl);
    }
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New content is available. Please refresh.');
              } else {
                console.log('Content is cached for offline use.');
              }
            }
          };
        }
      };
    })
    .catch((error) => console.error('Error during service worker registration:', error));
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => window.location.reload());
        });
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch(() =>
      console.log('No internet connection found. App is running in offline mode.')
    );
}
