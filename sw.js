const CACHE_NAME = 'html-runner-cache-v2';

// The files we want to save to the user's device
const urlsToCache = [
    './',
    './index.html',
    './sw.js'
];

// 1. Install Event: When the site loads for the first time, save these files in the background
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and saved files for offline use');
                return cache.addAll(urlsToCache);
            })
    );
    // Force the waiting service worker to become the active service worker immediately
    self.skipWaiting(); 
});

// 2. Fetch Event: Intercept network requests and serve from cache if offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return the cached file if found, otherwise try to fetch it from the internet
                return response || fetch(event.request);
            })
    );
});

// 3. Activate Event: Clean up old caches if you update your website code later
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Take control of all pages immediately without needing a page refresh
    self.clients.claim();
});
