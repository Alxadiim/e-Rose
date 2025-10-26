const CACHE_NAME = 'erose-cache-v4-links-fixes';
const OFFLINE_URL = './offline.html';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './cancer-sein.html',
  './cancer-col.html',
  './depistage-general.html',
  './dashboard.html',
  './offline.html',
  './css/styles.css',
  './js/app.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie: Cache First, Network Fallback
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  // Gestion des requêtes d'API différemment
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la requête réussit, on met en cache la réponse
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // En cas d'échec, on essaie de récupérer depuis le cache
          return caches.match(event.request);
        })
    );
  } else {
    // Pour les autres ressources, stratégie Cache First
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Renvoie la réponse en cache si elle existe
          if (cachedResponse) {
            return cachedResponse;
          }
          // Sinon, essaie le réseau
          return fetch(event.request)
            .then((response) => {
              // Si pas de réponse valide, on renvoie la page d'erreur
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              // On met en cache la réponse pour plus tard
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              return response;
            })
            .catch(() => {
              // Si échec du réseau et que c'est une navigation, on renvoie la page hors ligne
              if (event.request.mode === 'navigate') {
                return caches.match(OFFLINE_URL);
              }
              return new Response('Hors ligne', { status: 503 });
            });
        })
    );
  }
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        const url = event.notification.data.url || '/';
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
