/**
 * 健身计划项数据结构
 */
export interface WorkoutItem {
    id: string;
    name: string;
    completed: boolean;
    createdAt: string; // ISO timestamp
    duration?: number; // 可选：运动时长（分钟）
    targetReps?: number; // 可选：目标次数
}

/**
 * 每日数据数据结构
 */
export interface DailyData {
    date: string; // YYYY-MM-DD
    workouts: WorkoutItem[];
}

/**
 * 编辑模式类型
 */
export type EditMode = 'add' | 'edit';

