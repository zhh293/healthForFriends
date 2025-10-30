/**
 * 每日自动清空 composable
 */
import { ref, onMounted, onUnmounted } from 'vue';
import { getCurrentDate } from '../utils/date';
import { archiveTodayWorkouts, getTodayWorkouts } from '../utils/storage';

export function useDailyReset() {
    const lastCheckDate = ref<string>('');
    let checkInterval: number | null = null;

    /**
     * 检查日期变化并执行清空操作
     */
    function checkAndReset() {
        const currentDate = getCurrentDate();

        // 如果是新的一天
        if (lastCheckDate.value && lastCheckDate.value !== currentDate) {
            console.log('检测到新的一天，清空昨天数据');
            archiveTodayWorkouts();
            // 触发页面刷新以显示新数据（可选）
            // window.location.reload();
        }

        lastCheckDate.value = currentDate;
    }

    /**
     * 启动每日重置检查
     */
    function startDailyReset() {
        // 初始化当前日期
        lastCheckDate.value = getCurrentDate();

        // 每分钟检查一次日期变化
        checkInterval = window.setInterval(() => {
            checkAndReset();
        }, 60 * 1000); // 60000ms = 1分钟
    }

    /**
     * 停止每日重置检查
     */
    function stopDailyReset() {
        if (checkInterval !== null) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }

    onMounted(() => {
        startDailyReset();
    });

    onUnmounted(() => {
        stopDailyReset();
    });

    return {
        startDailyReset,
        stopDailyReset
    };
}

