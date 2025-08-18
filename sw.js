// Define a unique name for your app's cache
const CACHE_NAME = 'abefilm-tmdb-cache-v1';

// List the essential files needed for the app to work offline
const urlsToCache = [
  '/',
  '/offline.html' // IMPORTANT: Create this page in your Blogger site
];

// The install event: fires when the service worker is first installed
self.addEventListener('install', event => {
  // We wait until the cache is opened and all our essential files are added to it
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// The fetch event: fires every time the app requests a resource (page, image, etc.)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Try to find a matching request in the cache first
    caches.match(event.request)
      .then(response => {
        // If a cached version is found, return it immediately
        if (response) {
          return response;
        }

        // If it's not in the cache, try to fetch it from the network
        return fetch(event.request).catch(() => {
          // If the network request fails (e.g., the user is offline),
          // return the pre-cached offline fallback page.
          return caches.match('/offline.html');
        });
      })
  );
});
