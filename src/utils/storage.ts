/**
 * LocalStorage 存储工具函数
 */

import type { WorkoutItem, DailyData } from '../types/workout';
import { getCurrentDate } from './date';
import { dbGetDaily, dbSetDaily, dbDeleteDaily, migrateLocalStorageToIndexedDB } from './db';

/**
 * 从 LocalStorage 获取当天计划数据
 */
export function getTodayWorkouts(): WorkoutItem[] {
    const today = getCurrentDate();
    const key = `workout_${today}`;
    const data = localStorage.getItem(key);

    if (data) {
        try {
            const dailyData: DailyData = JSON.parse(data);
            return dailyData.workouts || [];
        } catch (error) {
            console.error('解析 LocalStorage 数据失败:', error);
            return [];
        }
    }

    return [];
}

/**
 * 保存当天计划数据到 LocalStorage
 */
export function saveTodayWorkouts(workouts: WorkoutItem[]): void {
    const today = getCurrentDate();
    const key = `workout_${today}`;
    const dailyData: DailyData = {
        date: today,
        workouts
    };

    try {
        localStorage.setItem(key, JSON.stringify(dailyData));
        // 同步写入 IndexedDB
        dbSetDaily(today, workouts);
    } catch (error) {
        console.error('保存数据到 LocalStorage 失败:', error);
    }
}

/**
 * 清空当天的计划数据
 */
export function clearTodayWorkouts(): void {
    const today = getCurrentDate();
    const key = `workout_${today}`;
    localStorage.removeItem(key);
    dbDeleteDaily(today);
}

/**
 * 通用：根据指定日期获取计划数据
 */
export function getWorkoutsByDate(date: string): WorkoutItem[] {
    // 优先从 IndexedDB 读取
    // IndexedDB 是异步，现有 API 返回同步数组，这里做一个同步回退策略：
    // 1) 尝试读取 localStorage；
    // 2) 异步地触发一次 DB 读取并在读取成功后与本地保持一致（写回 localStorage）。
    const key = `workout_${date}`;
    const ls = localStorage.getItem(key);
    let fromLS: WorkoutItem[] = [];
    if (ls) {
        try {
            const dailyData: DailyData = JSON.parse(ls);
            fromLS = dailyData.workouts || [];
        } catch (error) {
            console.error('解析 LocalStorage 数据失败:', error);
        }
    }

    // 异步读取 DB 并保持一致
    dbGetDaily(date).then(d => {
        if (d) {
            try {
                localStorage.setItem(key, JSON.stringify(d));
            } catch {}
        }
    });

    return fromLS;
}

/**
 * 通用：保存指定日期的计划数据
 */
export function saveWorkoutsByDate(date: string, workouts: WorkoutItem[]): void {
    const key = `workout_${date}`;
    const dailyData: DailyData = {
        date,
        workouts
    };

    try {
        localStorage.setItem(key, JSON.stringify(dailyData));
        // 同步写入 IndexedDB
        dbSetDaily(date, workouts);
    } catch (error) {
        console.error('保存数据到 LocalStorage 失败:', error);
    }
}

/**
 * 通用：清空指定日期的计划数据
 */
export function clearWorkoutsByDate(date: string): void {
    const key = `workout_${date}`;
    localStorage.removeItem(key);
    dbDeleteDaily(date);
}

// 初始化：尝试迁移旧数据到 IndexedDB（仅运行一次）
void migrateLocalStorageToIndexedDB();

/**
 * 获取历史记录
 */
export function getWorkoutHistory(): DailyData[] {
    const historyKey = 'workout_history';
    const data = localStorage.getItem(historyKey);

    if (data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('解析历史记录失败:', error);
            return [];
        }
    }

    return [];
}

/**
 * 保存历史记录
 */
export function saveWorkoutHistory(history: DailyData[]): void {
    const historyKey = 'workout_history';

    try {
        localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
        console.error('保存历史记录失败:', error);
    }
}

/**
 * 将当天的数据移动到历史记录
 */
export function archiveTodayWorkouts(): void {
    const today = getCurrentDate();
    const todayData = getTodayWorkouts();

    if (todayData.length > 0) {
        const history = getWorkoutHistory();
        const dailyData: DailyData = {
            date: today,
            workouts: todayData
        };

        // 如果今天的数据已存在历史中，更新它；否则添加新记录
        const existingIndex = history.findIndex(item => item.date === today);
        if (existingIndex >= 0) {
            history[existingIndex] = dailyData;
        } else {
            history.push(dailyData);
        }

        saveWorkoutHistory(history);
    }

    clearTodayWorkouts();
}

