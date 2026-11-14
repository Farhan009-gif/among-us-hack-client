/* Among Us Hack Client - Service Worker */
const CACHE_NAME = 'among-us-hack-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/utils.js',
  '/js/premium.js',
  '/js/hacks/speed.js',
  '/js/hacks/esp.js',
  '/js/hacks/colors.js'
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => {
          console.log('Deleting old cache:', name);
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache new responses on the fly
        if (response && response.ok) {
          return response;
        }
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
      
      return response || fetchPromise;
    })
  );
});

// Background sync for premium features when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'premium-sync') {
    event.waitUntil(syncPremiumData());
  }
});

async function syncPremiumData() {
  // Sync any queued premium feature changes
  console.log('Syncing premium data...');
}
