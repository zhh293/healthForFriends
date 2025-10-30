/**
 * 健身计划数据管理 composable
 */
import { ref, computed, watch } from 'vue';
import type { WorkoutItem } from '../types/workout';
import { generateId } from '../utils/uuid';
import { getCurrentTimestamp } from '../utils/date';
import { getTodayWorkouts, saveTodayWorkouts } from '../utils/storage';

export function useWorkouts() {
    // 健身计划列表
    const workouts = ref<WorkoutItem[]>([]);

    // 统计信息
    const totalWorkouts = computed(() => workouts.value.length);
    const completedWorkouts = computed(() =>
        workouts.value.filter(item => item.completed).length
    );
    const completionRate = computed(() => {
        if (totalWorkouts.value === 0) return 0;
        return Math.round((completedWorkouts.value / totalWorkouts.value) * 100);
    });

    // 加载当天数据
    function loadWorkouts() {
        workouts.value = getTodayWorkouts();
    }

    // 保存数据
    function saveWorkouts() {
        saveTodayWorkouts(workouts.value);
    }

    // 监听 workouts 变化，自动保存
    watch(workouts, () => {
        saveWorkouts();
    }, { deep: true });

    // 添加计划
    function addWorkout(name: string, duration?: number, targetReps?: number): void {
        if (!name || name.trim() === '') {
            return;
        }

        const newWorkout: WorkoutItem = {
            id: generateId(),
            name: name.trim(),
            completed: false,
            createdAt: getCurrentTimestamp(),
            duration,
            targetReps
        };

        workouts.value.push(newWorkout);
    }

    // 更新计划
    function updateWorkout(id: string, name: string, duration?: number, targetReps?: number): void {
        const index = workouts.value.findIndex(item => item.id === id);
        if (index >= 0) {
            workouts.value[index].name = name.trim();
            if (duration !== undefined) {
                workouts.value[index].duration = duration;
            }
            if (targetReps !== undefined) {
                workouts.value[index].targetReps = targetReps;
            }
        }
    }

    // 删除计划
    function deleteWorkout(id: string): void {
        const index = workouts.value.findIndex(item => item.id === id);
        if (index >= 0) {
            workouts.value.splice(index, 1);
        }
    }

    // 切换完成状态
    function toggleComplete(id: string): void {
        const workout = workouts.value.find(item => item.id === id);
        if (workout) {
            workout.completed = !workout.completed;
        }
    }

    // 初始化时加载数据
    loadWorkouts();

    return {
        workouts,
        totalWorkouts,
        completedWorkouts,
        completionRate,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        toggleComplete,
        loadWorkouts
    };
}

