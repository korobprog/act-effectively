// Service Worker for PWA
const CACHE_NAME = 'offline-site-v1';
const OFFLINE_URL = '/offline-fallback';

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/offline-fallback',
                '/icon-192x192.png',
                '/icon-512x512.png',
            ]);
        })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activate');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                    return Promise.resolve();
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
    // Skip caching for non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone the response only if it's ok
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((response) => {
                    return response || caches.match(OFFLINE_URL);
                });
            })
    );
});

// Push notification handler
self.addEventListener('push', (event) => {
    console.log('Push notification received');
    
    let data = { title: 'Уведомление', body: 'Новое уведомление', url: '/' };
    
    if (event.data) {
        try {
            data = JSON.parse(event.data.text());
        } catch (e) {
            console.error('Failed to parse push notification data:', e);
            data.body = event.data.text();
        }
    }
    
    const options = {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [200, 100, 200],
        tag: 'notification',
        data: { url: data.url || '/' },
        requireInteraction: false,
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Уведомление', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked');
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                // Check if there's already a window/tab open with the target URL
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, open a new window/tab
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});