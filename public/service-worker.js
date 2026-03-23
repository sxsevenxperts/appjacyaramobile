const CACHE_NAME = 'jacyara-v11';
const ASSETS_TO_CACHE = [
    './manifest.json',
    './offline.html'
];

// Install — force activate immediately, wipe old caches
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('✅ Cache aberto:', CACHE_NAME);
            return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
        })
    );
    self.skipWaiting();
});

// Activate — delete ALL old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(names.filter(n => n !== CACHE_NAME).map(n => {
                console.log('🗑️ Removendo cache antigo:', n);
                return caches.delete(n);
            }))
        )
    );
    self.clients.claim();
});

// Fetch — NETWORK-FIRST for HTML pages, cache-first for assets
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // HTML / navigation: always network first
    if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
        event.respondWith(
            fetch(event.request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                    return res;
                })
                .catch(() => caches.match(event.request).then(r => r || caches.match('./offline.html')))
        );
        return;
    }

    // service-worker.js itself: never cache
    if (url.pathname.includes('service-worker')) return;

    // Static assets: cache-first
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(res => {
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                }
                return res;
            }).catch(() => new Response('Offline'));
        })
    );
});

// Push notification
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Easy Shedulle — Jacyara Ponte';
    const options = {
        body: data.body || 'Você tem uma notificação',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23d946a8" width="192" height="192" rx="40"/><text x="50%" y="50%" font-size="80" fill="white" text-anchor="middle" dy=".3em" font-weight="bold">J</text></svg>',
        tag: data.tag || 'notification',
        requireInteraction: data.requireInteraction || false,
        actions: [
            { action: 'open', title: 'Abrir' },
            { action: 'close', title: 'Fechar' }
        ]
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'close') return;
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(list => {
            for (const c of list) if ('focus' in c) return c.focus();
            if (clients.openWindow) return clients.openWindow('/');
        })
    );
});

// Background sync
self.addEventListener('sync', event => {
    if (event.tag === 'sync-appointments') {
        event.waitUntil(fetch('/health').catch(() => {}));
    }
});

console.log('✅ Service Worker v5 carregado — Easy Shedulle');
