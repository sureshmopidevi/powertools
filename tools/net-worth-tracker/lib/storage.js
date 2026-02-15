
export class StorageManager {
    constructor() {
        this.dbName = 'NetWorthTrackerDB';
        this.version = 3;
        this.storeNames = {
            snapshots: 'snapshots',
            items: 'items',
            settings: 'settings',
            recurring: 'recurring'
        };
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains(this.storeNames.snapshots)) {
                    db.createObjectStore(this.storeNames.snapshots, { keyPath: 'date' });
                }

                if (!db.objectStoreNames.contains(this.storeNames.items)) {
                    db.createObjectStore(this.storeNames.items, { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains(this.storeNames.settings)) {
                    db.createObjectStore(this.storeNames.settings, { keyPath: 'key' });
                }

                if (!db.objectStoreNames.contains(this.storeNames.recurring)) {
                    db.createObjectStore(this.storeNames.recurring, { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    // --- Items Management ---
    async getAllItems() {
        return this._getAll(this.storeNames.items);
    }

    async saveItem(item) {
        if (!item.id) item.id = crypto.randomUUID();
        item.updatedAt = new Date().toISOString();
        return this._put(this.storeNames.items, item);
    }

    async deleteItem(id) {
        return this._delete(this.storeNames.items, id);
    }

    // --- Snapshot Management ---
    async saveSnapshot(snapshot) {
        return this._put(this.storeNames.snapshots, snapshot);
    }

    async getAllSnapshots() {
        const data = await this._getAll(this.storeNames.snapshots);
        return data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    async deleteSnapshot(date) {
        return this._delete(this.storeNames.snapshots, date);
    }

    // --- Recurring Transactions ---
    async getAllRecurring() {
        const data = await this._getAll(this.storeNames.recurring);
        return data.sort((a, b) => a.name.localeCompare(b.name));
    }

    async saveRecurring(entry) {
        if (!entry.id) entry.id = crypto.randomUUID();
        entry.updatedAt = new Date().toISOString();
        return this._put(this.storeNames.recurring, entry);
    }

    async deleteRecurring(id) {
        return this._delete(this.storeNames.recurring, id);
    }

    // --- Helper Methods ---
    async _getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = (event) => resolve(event.target.result || []);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async _put(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async _delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }
}
