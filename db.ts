
const DB_NAME = 'IndraVisualsDB_v2';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

let dbInstance: IDBDatabase | null = null;
let initPromise: Promise<IDBDatabase> | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        console.log("DB Upgrade Initiated...");
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        dbInstance = request.result;
        dbInstance.onversionchange = () => {
          dbInstance?.close();
          dbInstance = null;
          console.warn("DB out of date, reloading...");
          window.location.reload();
        };
        dbInstance.onclose = () => { dbInstance = null; };
        console.log("Visual Engine Database Synced.");
        resolve(dbInstance);
      };

      request.onerror = () => {
        console.error("Critical Storage Error:", request.error);
        reject(request.error);
      };

      request.onblocked = () => {
        console.warn("DB Blocked: Close other tabs with this site open.");
        alert("Please close other open instances of this portfolio to sync updates.");
      };
    } catch (e) {
      reject(e);
    }
  });

  return initPromise;
};

export const getAllProjects = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Fetch Interrupted:", error);
    return [];
  }
};

export const saveProject = async (project: any): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(project);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Write Interrupted:", error);
    throw error;
  }
};

export const deleteProjectFromDB = async (id: string): Promise<void> => {
  try {
    const db = await initDB();
    const stringId = String(id);
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(stringId);

      transaction.oncomplete = () => {
        console.log(`Artifact ${stringId} successfully purged.`);
        resolve();
      };

      transaction.onerror = () => {
        console.error("Purge Transaction Failed:", transaction.error);
        reject(transaction.error);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Purge Lifecycle Fault:", error);
    throw error;
  }
};
