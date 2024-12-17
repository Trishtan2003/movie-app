import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Service worker registration
import registerServiceWorker from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Fallback in case the service worker file is missing
if (registerServiceWorker) {
  registerServiceWorker();
} else {
  console.log('Service worker registration skipped.');
}
