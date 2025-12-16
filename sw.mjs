// sw.mjs - Service Worker for Pro Games Collection PWA
const CACHE_NAME = 'pro-games-v3';  // Increment version if you add new files

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/styles/base.css',
    '/styles/medium.css',
    '/styles/large.css',
    '/script/games.mjs',
    '/script/tictactoe.mjs',
    '/script/rps.mjs',
    '/script/snake.mjs',
    '/script/memorygame.mjs',
    '/script/pong.mjs',
    '/script/flappy.mjs',
    '/script/storage.mjs',
    '/script/liveclock.mjs',
    '/script/footer.mjs',
    '/script/hambutton.mjs',
    '/script/modetoggle.mjs',
    '/images/games.webp',
    '/images/icons/android-chrome-192x192.png',
    '/images/icons/android-chrome-512x512.png',
    '/images/icons/apple-touch-icon.png',
    '/images/icons/favicon-16x16.png',
    '/images/icons/favicon-32x32.png',
    '/images/icons/favicon.ico',
    '/images/github.svg',
    '/images/linkedin.svg',
    '/images/whatsapp.svg',
    '/images/icons/location.svg',
    '/images/icons/email.svg',
    // === SOUND FILES ===
    '/sounds/flap.mp3',
    '/sounds/point.mp3',
    '/sounds/hit.mp3',
    '/sounds/win.mp3',
    '/sounds/flip.mp3',
    '/sounds/place.mp3',
    '/sounds/throw.mp3',
    '/sounds/bounce.mp3',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Cache files one by one for better error reporting
                return Promise.all(
                    FILES_TO_CACHE.map(url => {
                        return fetch(url, { credentials: 'omit' }).then(response => {
                            if (!response.ok) {
                                console.error(`SW: Failed to fetch ${url} (status: ${response.status})`);
                                // Don't throw — allow partial caching
                                return;
                            }
                            return cache.put(url, response.clone());
                        }).catch(err => {
                            console.error(`SW: Error caching ${url}:`, err);
                        });
                    })
                ).then(() => self.skipWaiting());
            })
            .catch(err => console.error('SW: Cache open failed:', err))
    );
});

self.addEventListener('activate', event => {
    // Clean up old caches
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then(networkResponse => {
                    // Clone BEFORE returning so we can cache it
                    if (event.request.method === 'GET' && networkResponse.ok) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    return caches.match('/index.html');  // Offline fallback
                });
            })
    );
});