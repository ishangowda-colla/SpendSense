const CACHE_NAME = 'spendsense-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/metadata.json',
  '/icon.svg',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/hooks/useLocalStorage.ts',
  '/services/geminiService.ts',
  '/components/Header.tsx',
  '/components/Dashboard.tsx',
  '/components/Summary.tsx',
  '/components/ExpensePieChart.tsx',
  '/components/TransactionList.tsx',
  '/components/AddTransactionModal.tsx',
  '/components/Icons.tsx',
  '/components/Navigation.tsx',
  '/components/AnalyticsView.tsx',
  '/components/IncomeExpenseBarChart.tsx',
  '/components/TransactionsView.tsx',
  '/components/BudgetTracker.tsx',
  '/components/EditBudgetModal.tsx',
  '/components/IncomePieChart.tsx',
];

// Install the service worker and pre-cache all app assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Force activation of the new service worker
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients
  );
});

// Intercept fetch requests and serve from cache first (cache-first strategy)
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, cache it, and return response
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // Do not cache calls to the Gemini API
            if (networkResponse.url.includes('generativelanguage.googleapis.com')) {
              return networkResponse;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.error('Fetch failed; user is likely offline.', error);
          // Optionally, you could return a custom offline fallback page here.
        });
      })
  );
});