/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'ib-commerce-v2';
const FINANCE_CACHE = 'ib-finance-data-v1';
const STATIC_CACHE = 'ib-static-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Finance API endpoints to cache for offline
const FINANCE_API_PATTERNS = [
  '/api/ib-finance/dashboard',
  '/api/ib-finance/billing',
  '/api/ib-finance/receivables',
  '/api/ib-finance/payables',
  '/api/ib-finance/ledger',
  '/api/ib-finance/assets',
  '/api/ib-finance/tax',
  '/api/ib-finance/close',
  '/api/ib-finance/gst'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.log('[SW] Some static assets failed to cache:', err);
        });
      }),
      caches.open(FINANCE_CACHE).then(() => {
        console.log('[SW] Finance cache ready');
      })
    ])
  );
  self.skipWaiting();
});

// Activate service worker and clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== FINANCE_CACHE && cacheName !== STATIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Check if URL is a finance API that should be cached
function isFinanceAPI(url) {
  return FINANCE_API_PATTERNS.some(pattern => url.includes(pattern));
}

// Fetch strategy: Network first for APIs, cache with network fallback for static
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Skip cross-origin requests
  if (!url.startsWith(self.location.origin) && !url.includes('preview.emergentagent.com')) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Finance API - Network first, cache as fallback for offline
  if (isFinanceAPI(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(FINANCE_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(async () => {
          // Network failed, try cache
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            console.log('[SW] Serving finance data from cache:', url);
            return cachedResponse;
          }
          // Return offline response
          return new Response(
            JSON.stringify({ 
              success: false, 
              offline: true, 
              message: 'You are offline. Showing cached data.',
              data: []
            }),
            { 
              status: 503, 
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // Other API requests - skip caching
  if (url.includes('/api/')) {
    return;
  }

  // Static assets - Cache first, network fallback
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version, but also update cache in background
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  let data = { title: 'IB Finance Alert', body: 'New notification' };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    data.body = event.data ? event.data.text() : 'New notification';
  }

  const options = {
    body: data.body || data.message,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    tag: data.tag || 'finance-alert',
    data: {
      url: data.url || '/ib-finance',
      dateOfArrival: Date.now()
    },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'IB Finance', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/ib-finance';

  // Handle action buttons
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-finance-data') {
    event.waitUntil(syncPendingActions());
  }
  if (event.tag === 'sync-offline-changes') {
    event.waitUntil(syncOfflineChanges());
  }
});

// Sync pending actions when back online
async function syncPendingActions() {
  console.log('[SW] Starting background sync for pending actions');
  
  try {
    const db = await openIndexedDB();
    const tx = db.transaction('pending-actions', 'readonly');
    const store = tx.objectStore('pending-actions');
    const actions = await getAllFromStore(store);
    
    if (actions.length === 0) {
      console.log('[SW] No pending actions to sync');
      return;
    }
    
    console.log(`[SW] Syncing ${actions.length} pending actions`);
    
    const results = [];
    for (const action of actions) {
      try {
        const result = await executeAction(action);
        results.push({ action, result, success: true });
        
        // Remove successful action from queue
        const removeTx = db.transaction('pending-actions', 'readwrite');
        await removeTx.objectStore('pending-actions').delete(action.id);
      } catch (error) {
        console.error('[SW] Action failed:', action.id, error);
        results.push({ action, error: error.message, success: false });
        
        // Mark action as failed with retry count
        const updateTx = db.transaction('pending-actions', 'readwrite');
        const updateStore = updateTx.objectStore('pending-actions');
        action.retryCount = (action.retryCount || 0) + 1;
        action.lastError = error.message;
        action.lastAttempt = Date.now();
        await updateStore.put(action);
      }
    }
    
    // Notify clients about sync results
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        results,
        timestamp: Date.now()
      });
    });
    
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync offline changes with conflict detection
async function syncOfflineChanges() {
  console.log('[SW] Syncing offline changes with conflict detection');
  
  try {
    const db = await openIndexedDB();
    const tx = db.transaction('offline-changes', 'readonly');
    const store = tx.objectStore('offline-changes');
    const changes = await getAllFromStore(store);
    
    if (changes.length === 0) return;
    
    const conflicts = [];
    const synced = [];
    
    for (const change of changes) {
      try {
        // Check for conflicts by comparing timestamps
        const serverData = await fetchServerData(change.endpoint, change.resourceId);
        
        if (serverData && serverData.updated_at) {
          const serverTime = new Date(serverData.updated_at).getTime();
          const localTime = change.timestamp;
          
          if (serverTime > localTime) {
            // Server has newer data - conflict detected
            conflicts.push({
              change,
              serverData,
              conflictType: 'SERVER_NEWER',
              resolution: null
            });
            continue;
          }
        }
        
        // No conflict, push changes
        await pushChange(change);
        synced.push(change);
        
        // Remove synced change
        const removeTx = db.transaction('offline-changes', 'readwrite');
        await removeTx.objectStore('offline-changes').delete(change.id);
        
      } catch (error) {
        console.error('[SW] Change sync failed:', change.id, error);
      }
    }
    
    // Notify clients about conflicts
    if (conflicts.length > 0) {
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_CONFLICTS',
          conflicts,
          synced,
          timestamp: Date.now()
        });
      });
    }
    
  } catch (error) {
    console.error('[SW] Offline change sync failed:', error);
  }
}

// Execute a queued action
async function executeAction(action) {
  const response = await fetch(action.url, {
    method: action.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': action.token ? `Bearer ${action.token}` : ''
    },
    body: action.body ? JSON.stringify(action.body) : undefined
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch server data for conflict detection
async function fetchServerData(endpoint, resourceId) {
  try {
    const response = await fetch(`${endpoint}/${resourceId}`);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('[SW] Failed to fetch server data:', error);
  }
  return null;
}

// Push a change to the server
async function pushChange(change) {
  const response = await fetch(change.endpoint, {
    method: change.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': change.token ? `Bearer ${change.token}` : ''
    },
    body: JSON.stringify(change.data)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

// Open IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ib-finance-offline', 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create stores if they don't exist
      const stores = [
        'finance-dashboard',
        'billing',
        'receivables',
        'payables',
        'pending-actions',
        'offline-changes'
      ];
      
      stores.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };
  });
}

// Get all items from a store
function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  const { type, token, endpoint, data } = event.data;
  
  if (type === 'GET_CACHE_STATUS') {
    caches.open(FINANCE_CACHE).then(async (cache) => {
      const keys = await cache.keys();
      event.ports[0].postMessage({
        cached: keys.length > 0,
        endpoints: keys.map(r => r.url),
        count: keys.length
      });
    });
  }
  
  if (type === 'PREFETCH_FINANCE_DATA') {
    prefetchFinanceData(token).then((result) => {
      event.ports[0].postMessage(result);
    });
  }
  
  if (type === 'CLEAR_FINANCE_CACHE') {
    caches.delete(FINANCE_CACHE).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
  
  if (type === 'QUEUE_OFFLINE_ACTION') {
    queueOfflineAction(data).then((id) => {
      event.ports[0].postMessage({ success: true, id });
    }).catch((error) => {
      event.ports[0].postMessage({ success: false, error: error.message });
    });
  }
  
  if (type === 'RESOLVE_CONFLICT') {
    resolveConflict(data).then((result) => {
      event.ports[0].postMessage(result);
    });
  }
});

// Queue an offline action
async function queueOfflineAction(action) {
  const db = await openIndexedDB();
  const tx = db.transaction('pending-actions', 'readwrite');
  const store = tx.objectStore('pending-actions');
  
  const actionWithId = {
    ...action,
    id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    retryCount: 0
  };
  
  await store.add(actionWithId);
  return actionWithId.id;
}

// Resolve a conflict
async function resolveConflict(data) {
  const { changeId, resolution, mergedData } = data;
  
  const db = await openIndexedDB();
  const tx = db.transaction('offline-changes', 'readwrite');
  const store = tx.objectStore('offline-changes');
  
  if (resolution === 'USE_SERVER') {
    // Discard local change
    await store.delete(changeId);
    return { success: true, resolution: 'USED_SERVER_VERSION' };
  }
  
  if (resolution === 'USE_LOCAL') {
    // Force push local change
    const change = await store.get(changeId);
    change.forceOverwrite = true;
    await store.put(change);
    
    // Trigger sync
    await self.registration.sync.register('sync-offline-changes');
    return { success: true, resolution: 'WILL_OVERWRITE_SERVER' };
  }
  
  if (resolution === 'MERGE') {
    // Update with merged data
    const change = await store.get(changeId);
    change.data = mergedData;
    change.mergedAt = Date.now();
    await store.put(change);
    
    // Trigger sync
    await self.registration.sync.register('sync-offline-changes');
    return { success: true, resolution: 'MERGED_AND_SYNCING' };
  }
  
  return { success: false, error: 'Unknown resolution type' };
}

// Prefetch finance data
async function prefetchFinanceData(token) {
  const endpoints = [
    '/api/ib-finance/dashboard',
    '/api/ib-finance/billing',
    '/api/ib-finance/receivables',
    '/api/ib-finance/payables'
  ];
  
  const cache = await caches.open(FINANCE_CACHE);
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        await cache.put(endpoint, response.clone());
        results.push({ endpoint, success: true });
      } else {
        results.push({ endpoint, success: false, status: response.status });
      }
    } catch (error) {
      results.push({ endpoint, success: false, error: error.message });
    }
  }
  
  return { success: results.every(r => r.success), results };
}

console.log('[SW] IB Commerce Service Worker loaded - v2 with Finance Offline Support');
