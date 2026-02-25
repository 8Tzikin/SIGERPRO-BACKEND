// Service Worker para SIGER PRO PWA
// Versión: 1.0.0

const CACHE_NAME = 'sigerpro-v1';
const RUNTIME_CACHE = 'sigerpro-runtime-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/demo.html',
  '/captura.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activar service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de caché: Network First para API, Cache First para assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar solicitudes no-GET
  if (request.method !== 'GET') {
    return;
  }

  // API calls: Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Guardar en caché si es exitoso
          if (response.ok) {
            const cache = caches.open(RUNTIME_CACHE);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fallback a caché si no hay conexión
          return caches.match(request).then((cached) => {
            return cached || new Response('Offline - No cached response', { status: 503 });
          });
        })
    );
    return;
  }

  // Assets: Cache first, fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          // Guardar en caché
          const cache = caches.open(RUNTIME_CACHE);
          cache.then((c) => c.put(request, response.clone()));
          return response;
        })
        .catch(() => {
          // Fallback para assets offline
          if (request.destination === 'image') {
            return new Response('<svg></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});

// Sincronización en background
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'sync-evaluaciones') {
    event.waitUntil(syncEvaluaciones());
  }
});

// Función para sincronizar evaluaciones
async function syncEvaluaciones() {
  try {
    const db = await openIndexedDB();
    const evaluaciones = await getUnsyncedEvaluaciones(db);
    
    for (const eval of evaluaciones) {
      try {
        const response = await fetch('/api/trpc/evaluaciones.create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eval)
        });
        
        if (response.ok) {
          await markAsSynced(db, eval.id);
        }
      } catch (error) {
        console.error('[SW] Error syncing evaluation:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync error:', error);
  }
}

// Notificaciones push
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'SIGER PRO';
  const options = {
    body: data.body || 'Nueva notificación',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Buscar ventana existente
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Abrir nueva ventana
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Funciones auxiliares para IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sigerpro', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('evaluaciones')) {
        db.createObjectStore('evaluaciones', { keyPath: 'id' });
      }
    };
  });
}

function getUnsyncedEvaluaciones(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['evaluaciones'], 'readonly');
    const store = transaction.objectStore('evaluaciones');
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const unsynced = request.result.filter((e) => !e.synced);
      resolve(unsynced);
    };
  });
}

function markAsSynced(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['evaluaciones'], 'readwrite');
    const store = transaction.objectStore('evaluaciones');
    const request = store.get(id);
    request.onsuccess = () => {
      const eval = request.result;
      eval.synced = true;
      store.put(eval);
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

console.log('[SW] Service Worker loaded');
