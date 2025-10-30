/**
 * LocalStorage 存储工具函数
 */

import type { WorkoutItem, DailyData } from '../types/workout';
import { getCurrentDate } from './date';

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
}

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

