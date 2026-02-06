import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to detect online/offline status and manage offline data sync
 */
export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced, error
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [cacheStatus, setCacheStatus] = useState({ cached: false, endpoints: [] });

  // Check service worker cache status
  const checkCacheStatus = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const messageChannel = new MessageChannel();

      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          setCacheStatus(event.data);
          resolve(event.data);
        };

        registration.active?.postMessage(
          { type: 'GET_CACHE_STATUS' },
          [messageChannel.port2]
        );

        // Timeout after 2 seconds
        setTimeout(() => resolve({ cached: false, endpoints: [] }), 2000);
      });
    } catch (error) {
      console.error('Failed to check cache status:', error);
    }
  }, []);

  // Trigger background sync
  const triggerSync = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-finance-data');
      setSyncStatus('syncing');
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }, []);

  // Prefetch finance data for offline use
  const prefetchData = useCallback(async (token) => {
    if (!('serviceWorker' in navigator)) return;

    try {
      setSyncStatus('syncing');
      const registration = await navigator.serviceWorker.ready;
      const messageChannel = new MessageChannel();

      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.success) {
            setSyncStatus('synced');
            setLastSyncTime(new Date());
            checkCacheStatus();
          } else {
            setSyncStatus('error');
          }
          resolve(event.data);
        };

        registration.active?.postMessage(
          { type: 'PREFETCH_FINANCE_DATA', token },
          [messageChannel.port2]
        );

        // Timeout after 30 seconds
        setTimeout(() => {
          setSyncStatus('error');
          resolve({ success: false });
        }, 30000);
      });
    } catch (error) {
      console.error('Failed to prefetch data:', error);
      setSyncStatus('error');
    }
  }, [checkCacheStatus]);

  // Clear finance cache
  const clearCache = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const messageChannel = new MessageChannel();

      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          checkCacheStatus();
          resolve(event.data);
        };

        registration.active?.postMessage(
          { type: 'CLEAR_FINANCE_CACHE' },
          [messageChannel.port2]
        );
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, [checkCacheStatus]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerSync]);

  // Check cache status on mount
  useEffect(() => {
    checkCacheStatus();
  }, [checkCacheStatus]);

  return {
    isOnline,
    syncStatus,
    lastSyncTime,
    cacheStatus,
    prefetchData,
    clearCache,
    triggerSync,
    checkCacheStatus
  };
};

/**
 * Hook to store and retrieve data from IndexedDB for offline use
 */
export const useOfflineStorage = (storeName) => {
  const DB_NAME = 'ib-finance-offline';
  const DB_VERSION = 2;

  const openDB = useCallback(() => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create stores for different data types
        const stores = ['finance-dashboard', 'billing', 'receivables', 'payables', 'pending-actions', 'offline-changes'];
        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };
    });
  }, []);

  // Save data to IndexedDB
  const saveData = useCallback(async (data, id = 'default') => {
    try {
      const db = await openDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      await store.put({ id, data, timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error('Failed to save offline data:', error);
      return false;
    }
  }, [openDB, storeName]);

  // Get data from IndexedDB
  const getData = useCallback(async (id = 'default') => {
    try {
      const db = await openDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result?.data);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return null;
    }
  }, [openDB, storeName]);

  // Queue an action for later sync
  const queueAction = useCallback(async (action) => {
    try {
      const db = await openDB();
      const tx = db.transaction('pending-actions', 'readwrite');
      const store = tx.objectStore('pending-actions');
      
      const actionWithId = {
        ...action,
        id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
      };
      
      await store.add(actionWithId);
      return actionWithId.id;
    } catch (error) {
      console.error('Failed to queue action:', error);
      return null;
    }
  }, [openDB]);

  // Get pending actions
  const getPendingActions = useCallback(async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('pending-actions', 'readonly');
      const store = tx.objectStore('pending-actions');
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get pending actions:', error);
      return [];
    }
  }, [openDB]);

  return {
    saveData,
    getData,
    queueAction,
    getPendingActions
  };
};

/**
 * Hook to handle offline sync conflicts
 */
export const useConflictResolution = () => {
  const [conflicts, setConflicts] = useState([]);
  const [resolving, setResolving] = useState(false);

  // Listen for conflict messages from service worker
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'SYNC_CONFLICTS') {
        setConflicts(event.data.conflicts);
      }
      if (event.data?.type === 'SYNC_COMPLETE') {
        // Clear resolved conflicts
        setConflicts(prev => prev.filter(c => 
          !event.data.results.find(r => r.action.id === c.change.id && r.success)
        ));
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  // Resolve a conflict
  const resolveConflict = useCallback(async (changeId, resolution, mergedData = null) => {
    if (!('serviceWorker' in navigator)) return { success: false };

    setResolving(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const messageChannel = new MessageChannel();

      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.success) {
            setConflicts(prev => prev.filter(c => c.change.id !== changeId));
          }
          setResolving(false);
          resolve(event.data);
        };

        registration.active?.postMessage(
          { 
            type: 'RESOLVE_CONFLICT', 
            data: { changeId, resolution, mergedData }
          },
          [messageChannel.port2]
        );

        setTimeout(() => {
          setResolving(false);
          resolve({ success: false, error: 'Timeout' });
        }, 10000);
      });
    } catch (error) {
      setResolving(false);
      return { success: false, error: error.message };
    }
  }, []);

  // Auto-resolve conflicts using a strategy
  const autoResolveConflicts = useCallback(async (strategy = 'USE_SERVER') => {
    for (const conflict of conflicts) {
      await resolveConflict(conflict.change.id, strategy);
    }
  }, [conflicts, resolveConflict]);

  return {
    conflicts,
    hasConflicts: conflicts.length > 0,
    resolving,
    resolveConflict,
    autoResolveConflicts
  };
};

/**
 * Hook to queue offline actions with automatic retry
 */
export const useOfflineActions = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncResults, setSyncResults] = useState([]);

  // Helper function to open IndexedDB
  const openDB = useCallback(() => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ib-finance-offline', 2);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }, []);

  // Update pending count
  const updatePendingCount = useCallback(async () => {
    if (!('indexedDB' in window)) return;

    try {
      const db = await openDB();
      const tx = db.transaction('pending-actions', 'readonly');
      const store = tx.objectStore('pending-actions');
      const count = await new Promise((resolve) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(0);
      });
      setPendingCount(count);
    } catch (error) {
      console.error('Failed to count pending actions:', error);
    }
  }, [openDB]);

  // Listen for sync results
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'SYNC_COMPLETE') {
        setSyncResults(event.data.results);
        updatePendingCount();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
      updatePendingCount();
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, [updatePendingCount]);

  // Queue an action for later execution
  const queueAction = useCallback(async (action) => {
    if (!('serviceWorker' in navigator)) {
      return { success: false, error: 'Service worker not available' };
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const messageChannel = new MessageChannel();

      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          updatePendingCount();
          resolve(event.data);
        };

        registration.active?.postMessage(
          { type: 'QUEUE_OFFLINE_ACTION', data: action },
          [messageChannel.port2]
        );

        setTimeout(() => resolve({ success: false, error: 'Timeout' }), 5000);
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [updatePendingCount]);

  // Force sync now
  const syncNow = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('sync' in ServiceWorkerRegistration.prototype)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-finance-data');
    } catch (error) {
      console.error('Failed to trigger sync:', error);
    }
  }, []);

  return {
    pendingCount,
    syncResults,
    queueAction,
    syncNow,
    hasPending: pendingCount > 0
  };
};

export default useOfflineSync;
