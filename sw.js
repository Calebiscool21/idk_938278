const CACHE_NAME = 'html-runner-cache-v1';

// We use relative paths ('./') so it works dynamically with GitHub Pages sub-directories
const urlsToCache = [
    './',
    './index.html',
    './sw.js'
];

// Install event - Cache the files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - Serve from cache if offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If the file is in the cache, return it. Otherwise, fetch from the network.
                return response || fetch(event.request);
            })
    );
});

// Activate event - Clean up old caches if you update the app
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
});
