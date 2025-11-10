/**
 * 轻量级 IndexedDB 封装，用于持久化每天/每周的健身计划
 */
import type { DailyData, WorkoutItem } from '../types/workout';

const DB_NAME = 'workout-db';
const DB_VERSION = 1;
const STORE_WORKOUTS = 'workouts'; // key: date (YYYY-MM-DD), value: DailyData

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_WORKOUTS)) {
        db.createObjectStore(STORE_WORKOUTS, { keyPath: 'date' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function getStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  const db = await openDB();
  const tx = db.transaction(STORE_WORKOUTS, mode);
  return tx.objectStore(STORE_WORKOUTS);
}

export async function dbGetDaily(date: string): Promise<DailyData | undefined> {
  try {
    const store = await getStore('readonly');
    return await new Promise((resolve, reject) => {
      const req = store.get(date);
      req.onsuccess = () => resolve(req.result as DailyData | undefined);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB 读取失败，使用本地存储回退', e);
    return undefined;
  }
}

export async function dbSetDaily(date: string, workouts: WorkoutItem[]): Promise<void> {
  try {
    const store = await getStore('readwrite');
    await new Promise<void>((resolve, reject) => {
      const req = store.put({ date, workouts } as DailyData);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB 写入失败', e);
  }
}

export async function dbDeleteDaily(date: string): Promise<void> {
  try {
    const store = await getStore('readwrite');
    await new Promise<void>((resolve, reject) => {
      const req = store.delete(date);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB 删除失败', e);
  }
}

export async function dbListAll(): Promise<DailyData[]> {
  try {
    const store = await getStore('readonly');
    return await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as DailyData[]);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB getAll 失败', e);
    return [];
  }
}

// 将 localStorage 中的旧数据迁移到 IndexedDB（幂等）
export async function migrateLocalStorageToIndexedDB(): Promise<void> {
  try {
    const flag = localStorage.getItem('workout_db_migrated');
    if (flag === 'true') return;

    // 迁移以 workout_ 开头的键
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith('workout_')) {
        const data = localStorage.getItem(key);
        if (!data) continue;
        try {
          const parsed = JSON.parse(data) as DailyData;
          if (parsed && parsed.date) {
            await dbSetDaily(parsed.date, parsed.workouts || []);
          }
        } catch (err) {
          console.warn('迁移失败，忽略键：', key, err);
        }
      }
    }

    localStorage.setItem('workout_db_migrated', 'true');
  } catch (e) {
    console.warn('迁移到 IndexedDB 失败', e);
  }
}