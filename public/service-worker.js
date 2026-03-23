const CACHE_NAME = 'jacyara-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './offline.html'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('✅ Cache aberto:', CACHE_NAME);
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.log('⚠️ Alguns arquivos não foram cacheados:', err);
            });
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }

            return fetch(event.request)
                .then(response => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Clone and cache successful responses
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                })
                .catch(() => {
                    // Return offline page if available
                    return caches.match('./offline.html').then(response => {
                        return response || new Response('Offline - tente novamente quando conectado');
                    });
                });
        })
    );
});

// Push notification event
self.addEventListener('push', event => {
    console.log('🔔 Push recebido:', event);

    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Clínica Estética Jacyara Ponte';
    const options = {
        body: data.body || 'Você tem uma notificação',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%238b4d7a" width="192" height="192"/><text x="50%" y="50%" font-size="80" fill="white" text-anchor="middle" dy=".3em" font-weight="bold">J</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%238b4d7a" width="192" height="192"/></svg>',
        tag: data.tag || 'notification',
        requireInteraction: data.requireInteraction || false,
        actions: [
            {
                action: 'open',
                title: 'Abrir'
            },
            {
                action: 'close',
                title: 'Fechar'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            // Check if there's already a window/tab open
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'sync-appointments') {
        event.waitUntil(syncAppointments());
    }
});

async function syncAppointments() {
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao sincronizar:', error);
        throw error;
    }
}

// Periodic background sync (se suportado)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'check-reminders') {
        event.waitUntil(checkReminders());
    }
});

async function checkReminders() {
    try {
        const appointments = await getUpcomingAppointments();
        appointments.forEach(apt => {
            if (shouldNotify(apt)) {
                self.registration.showNotification(
                    '🔔 Lembrete de Agendamento',
                    {
                        body: `${apt.cliente}: ${apt.procedimento} às ${apt.horario}`,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%238b4d7a" width="192" height="192"/></svg>'
                    }
                );
            }
        });
    } catch (error) {
        console.error('Erro ao verificar lembretes:', error);
    }
}

function shouldNotify(appointment) {
    const now = new Date();
    const aptTime = new Date(appointment.data + ' ' + appointment.horario);
    const diffMinutes = (aptTime - now) / (1000 * 60);
    return diffMinutes > 0 && diffMinutes <= 60; // Notificar 1 hora antes
}

async function getUpcomingAppointments() {
    return [];
}

console.log('✅ Service Worker carregado');
