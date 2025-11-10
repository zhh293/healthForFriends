/**
 * 每周健身计划数据管理 composable
 */
import { ref, computed } from 'vue';
import type { WorkoutItem } from '../types/workout';
import { generateId } from '../utils/uuid';
import { getCurrentTimestamp, getWeekDates, getWeekStart } from '../utils/date';
import { getWorkoutsByDate, saveWorkoutsByDate, clearWorkoutsByDate } from '../utils/storage';

type WeekData = Record<string, WorkoutItem[]>; // key: YYYY-MM-DD

export function useWeeklyPlan() {
  const weekStart = ref<string>(getWeekStart());
  const weekDates = ref<string[]>(getWeekDates(weekStart.value));
  const weekData = ref<WeekData>({});

  function setWeek(dateStr?: string) {
    weekStart.value = getWeekStart(dateStr);
    weekDates.value = getWeekDates(weekStart.value);
    loadWeek();
  }

  function loadWeek() {
    const data: WeekData = {};
    for (const date of weekDates.value) {
      data[date] = getWorkoutsByDate(date);
    }
    weekData.value = data;
  }

  function saveDay(date: string) {
    saveWorkoutsByDate(date, weekData.value[date] || []);
  }

  function addWorkoutToDate(date: string, name: string, duration?: number, targetReps?: number) {
    if (!name || name.trim() === '') return;
    const newWorkout: WorkoutItem = {
      id: generateId(),
      name: name.trim(),
      completed: false,
      createdAt: getCurrentTimestamp(),
      duration,
      targetReps
    };
    const list = weekData.value[date] || [];
    list.push(newWorkout);
    weekData.value[date] = list;
    saveDay(date);
  }

  function updateWorkoutInDate(date: string, id: string, name: string, duration?: number, targetReps?: number) {
    const list = weekData.value[date] || [];
    const index = list.findIndex(w => w.id === id);
    if (index >= 0) {
      list[index].name = name.trim();
      if (duration !== undefined) list[index].duration = duration;
      if (targetReps !== undefined) list[index].targetReps = targetReps;
      weekData.value[date] = list;
      saveDay(date);
    }
  }

  function deleteWorkoutFromDate(date: string, id: string) {
    const list = weekData.value[date] || [];
    const index = list.findIndex(w => w.id === id);
    if (index >= 0) {
      list.splice(index, 1);
      weekData.value[date] = list;
      saveDay(date);
    }
  }

  function toggleCompleteInDate(date: string, id: string) {
    const list = weekData.value[date] || [];
    const item = list.find(w => w.id === id);
    if (item) {
      item.completed = !item.completed;
      saveDay(date);
    }
  }

  function copyDay(fromDate: string, toDate: string, overwrite = true) {
    const fromList = weekData.value[fromDate] || [];
    const cloned = fromList.map(w => ({ ...w }));
    if (overwrite) {
      weekData.value[toDate] = cloned;
    } else {
      const toList = weekData.value[toDate] || [];
      weekData.value[toDate] = [...toList, ...cloned];
    }
    saveDay(toDate);
  }

  function clearWeek() {
    for (const date of weekDates.value) {
      weekData.value[date] = [];
      clearWorkoutsByDate(date);
    }
  }

  // 预设模板：均衡训练
  const templates: Record<string, (dates: string[]) => WeekData> = {
    balanced: (dates) => {
      const plan: WeekData = {};
      plan[dates[0]] = [ // 周一
        { id: generateId(), name: '俯卧撑', completed: false, createdAt: getCurrentTimestamp(), targetReps: 30 },
        { id: generateId(), name: '慢跑', completed: false, createdAt: getCurrentTimestamp(), duration: 20 }
      ];
      plan[dates[1]] = [ // 周二
        { id: generateId(), name: '引体向上', completed: false, createdAt: getCurrentTimestamp(), targetReps: 15 },
        { id: generateId(), name: '平板支撑', completed: false, createdAt: getCurrentTimestamp(), duration: 5 }
      ];
      plan[dates[2]] = []; // 周三 休息
      plan[dates[3]] = [ // 周四
        { id: generateId(), name: '深蹲', completed: false, createdAt: getCurrentTimestamp(), targetReps: 40 },
        { id: generateId(), name: '骑行', completed: false, createdAt: getCurrentTimestamp(), duration: 30 }
      ];
      plan[dates[4]] = [ // 周五
        { id: generateId(), name: 'HIIT 间歇训练', completed: false, createdAt: getCurrentTimestamp(), duration: 25 }
      ];
      plan[dates[5]] = [ // 周六
        { id: generateId(), name: '瑜伽与拉伸', completed: false, createdAt: getCurrentTimestamp(), duration: 30 }
      ];
      plan[dates[6]] = []; // 周日 恢复
      return plan;
    },
    strength_split: (dates) => {
      const plan: WeekData = {};
      plan[dates[0]] = [{ id: generateId(), name: '胸肌训练', completed: false, createdAt: getCurrentTimestamp(), targetReps: 50 }];
      plan[dates[1]] = [{ id: generateId(), name: '背部训练', completed: false, createdAt: getCurrentTimestamp(), targetReps: 50 }];
      plan[dates[2]] = [{ id: generateId(), name: '腿部训练', completed: false, createdAt: getCurrentTimestamp(), targetReps: 60 }];
      plan[dates[3]] = [{ id: generateId(), name: '肩部训练', completed: false, createdAt: getCurrentTimestamp(), targetReps: 40 }];
      plan[dates[4]] = [{ id: generateId(), name: '手臂训练', completed: false, createdAt: getCurrentTimestamp(), targetReps: 40 }];
      plan[dates[5]] = [{ id: generateId(), name: '核心训练', completed: false, createdAt: getCurrentTimestamp(), duration: 20 }];
      plan[dates[6]] = []; // 休息
      return plan;
    }
  };

  function applyTemplate(name: keyof typeof templates, overwrite = true) {
    const builder = templates[name];
    if (!builder) return;
    const plan = builder(weekDates.value);
    for (const date of weekDates.value) {
      const list = plan[date] || [];
      if (overwrite) {
        weekData.value[date] = list;
      } else {
        const toList = weekData.value[date] || [];
        weekData.value[date] = [...toList, ...list];
      }
      saveDay(date);
    }
  }

  const totalWorkouts = computed(() =>
    weekDates.value.reduce((sum, d) => sum + (weekData.value[d]?.length || 0), 0)
  );
  const completedWorkouts = computed(() =>
    weekDates.value.reduce((sum, d) => sum + (weekData.value[d]?.filter(i => i.completed).length || 0), 0)
  );
  const completionRate = computed(() => {
    const total = totalWorkouts.value;
    if (total === 0) return 0;
    return Math.round((completedWorkouts.value / total) * 100);
  });

  // 初始化
  loadWeek();

  return {
    weekStart,
    weekDates,
    weekData,
    setWeek,
    loadWeek,
    addWorkoutToDate,
    updateWorkoutInDate,
    deleteWorkoutFromDate,
    toggleCompleteInDate,
    copyDay,
    clearWeek,
    applyTemplate,
    totalWorkouts,
    completedWorkouts,
    completionRate
  };
}