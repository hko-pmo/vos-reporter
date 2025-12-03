importScripts('version.js');

const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './data.js',
    './store.js',
    './renderers.js',
    './version.js',
    './manifest.json'
];

// Install event: Cache core assets
self.addEventListener('install', (e) => {
    // Force this service worker to become the active one, bypassing the waiting state
    self.skipWaiting(); 
    
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (e) => {
    // Take control of all clients immediately
    e.waitUntil(clients.claim());

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event: Network First for App, Cache First for Clouds
self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // Strategy 1: Cache First for Cloud Images (they don't change often and are large)
    if (url.pathname.includes('/clouds/')) {
        e.respondWith(
            caches.match(e.request).then((response) => {
                return response || fetch(e.request);
            })
        );
        return;
    }

    // Strategy 2: Network First for everything else (HTML, JS, CSS)
    // This ensures users get the latest version if they are online.
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response to put it in the cache
                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(e.request, responseToCache);
                    });

                return response;
            })
            .catch(() => {
                // If network fails, fall back to cache
                return caches.match(e.request);
            })
    );
});
