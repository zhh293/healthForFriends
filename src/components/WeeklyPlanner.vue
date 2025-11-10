<template>
  <div class="weekly-planner">
    <div class="planner-header">
      <div class="week-range">{{ weekRange }}</div>
      <div class="nav-actions">
        <button class="nav-btn" @click="goPrevWeek">← 上一周</button>
        <button class="nav-btn" @click="goNextWeek">下一周 →</button>
      </div>
      <div class="template-actions">
        <span class="template-label">快速套用模板：</span>
        <button class="template-btn" @click="applyTemplate('balanced')">均衡训练</button>
        <button class="template-btn" @click="applyTemplate('strength_split')">力量分化</button>
        <button class="template-btn secondary" @click="clearWeek">清空本周</button>
      </div>
    </div>

    <div class="grid">
      <div v-for="date in weekDates" :key="date" class="day-column">
        <div class="day-header">
          <div class="weekday">{{ getChineseWeekday(date) }}</div>
          <div class="date-short">{{ formatDateShort(date) }}</div>
        </div>

        <!-- 快速添加 -->
        <div class="quick-add">
          <input v-model="quickAdd[date].name" type="text" placeholder="添加计划，如：跑步、俯卧撑" class="qa-input" />
          <div class="qa-row">
            <input v-model.number="quickAdd[date].duration" type="number" min="1" placeholder="时长(分钟)" class="qa-input small" />
            <input v-model.number="quickAdd[date].targetReps" type="number" min="1" placeholder="次数" class="qa-input small" />
            <button class="qa-btn" @click="addQuick(date)">添加</button>
          </div>
          <div class="qa-suggestions">
            <button class="chip" @click="addSuggest(date, '慢跑', 20, undefined)">慢跑 20'</button>
            <button class="chip" @click="addSuggest(date, '俯卧撑', undefined, 30)">俯卧撑 x30</button>
            <button class="chip" @click="addSuggest(date, '深蹲', undefined, 40)">深蹲 x40</button>
            <button class="chip" @click="addSuggest(date, '瑜伽与拉伸', 30, undefined)">瑜伽 30'</button>
          </div>
        </div>

        <!-- 列表 -->
        <div class="day-list" v-if="(weekData[date] || []).length > 0">
          <WorkoutCard
            v-for="w in weekData[date]"
            :key="w.id"
            :workout="w"
            @toggle-complete="toggleCompleteInDate(date, $event)"
            @edit="openEdit(date, $event)"
            @delete="deleteWorkoutFromDate(date, $event)"
          />
        </div>
        <div v-else class="empty">本日暂无计划</div>

        <!-- 日级操作 -->
        <div class="day-actions">
          <button class="day-btn" @click="copyFromPrev(date)">从前一天复制</button>
          <button class="day-btn" @click="clearDay(date)">清空当天</button>
        </div>
      </div>
    </div>

    <!-- 底部统计 -->
    <StatisticsBar :total="totalWorkouts" :completed="completedWorkouts" :completion-rate="completionRate" />

    <!-- 编辑模态框 -->
    <WorkoutModal
      :show="showModal"
      :mode="modalMode"
      :workout="editingWorkout"
      @save="handleSave"
      @close="closeModal"
    />
  </div>
  
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import WorkoutCard from './WorkoutCard.vue';
import StatisticsBar from './StatisticsBar.vue';
import WorkoutModal from './WorkoutModal.vue';
import type { WorkoutItem, EditMode } from '../types/workout';
import { useWeeklyPlan } from '../composables/useWeeklyPlan';
import { getChineseWeekday, formatDateShort, getWeekRangeLabel } from '../utils/date';

const {
  weekDates,
  weekData,
  setWeek,
  addWorkoutToDate,
  updateWorkoutInDate,
  deleteWorkoutFromDate,
  toggleCompleteInDate,
  copyDay,
  clearWeek,
  totalWorkouts,
  completedWorkouts,
  completionRate
} = useWeeklyPlan();

const weekRange = ref(getWeekRangeLabel());
watch(weekDates, () => {
  weekRange.value = getWeekRangeLabel(weekDates.value[0]);
});

// 快速添加表单状态：每个日期一个对象
const quickAdd = reactive<Record<string, { name: string; duration?: number; targetReps?: number }>>({});
for (const d of weekDates.value) {
  quickAdd[d] = { name: '', duration: undefined, targetReps: undefined };
}
watch(weekDates, (dates) => {
  for (const d of dates) {
    if (!quickAdd[d]) quickAdd[d] = { name: '', duration: undefined, targetReps: undefined };
  }
});

function addQuick(date: string) {
  const f = quickAdd[date];
  addWorkoutToDate(date, f.name, f.duration, f.targetReps);
  quickAdd[date] = { name: '', duration: undefined, targetReps: undefined };
}

function addSuggest(date: string, name: string, duration?: number, targetReps?: number) {
  addWorkoutToDate(date, name, duration, targetReps);
}

function copyFromPrev(date: string) {
  const idx = weekDates.value.indexOf(date);
  if (idx > 0) {
    copyDay(weekDates.value[idx - 1], date, true);
  }
}

function clearDay(date: string) {
  copyDay(date, date, true); // 复制空数组也需要入口，这里做一个清空
  // 更直接：weekData[date] = []; 但保持通过 composable 方法写入
  weekData[date] = [];
}

function goPrevWeek() {
  const start = new Date(weekDates.value[0]);
  start.setDate(start.getDate() - 7);
  const y = start.getFullYear();
  const m = String(start.getMonth() + 1).padStart(2, '0');
  const d = String(start.getDate()).padStart(2, '0');
  setWeek(`${y}-${m}-${d}`);
}

function goNextWeek() {
  const start = new Date(weekDates.value[0]);
  start.setDate(start.getDate() + 7);
  const y = start.getFullYear();
  const m = String(start.getMonth() + 1).padStart(2, '0');
  const d = String(start.getDate()).padStart(2, '0');
  setWeek(`${y}-${m}-${d}`);
}

function applyTemplate(name: 'balanced' | 'strength_split') {
  // 调用 composable 中的模板应用函数
  // 为了更好的类型推导，单独使用 any 访问
  (useWeeklyPlan() as any).applyTemplate(name, true);
}

// 编辑模态框管理
const showModal = ref(false);
const modalMode = ref<EditMode>('edit');
const editingWorkout = ref<WorkoutItem | undefined>(undefined);
const editingDate = ref<string>('');

function openEdit(date: string, w: WorkoutItem) {
  modalMode.value = 'edit';
  editingWorkout.value = w;
  editingDate.value = date;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingWorkout.value = undefined;
  editingDate.value = '';
}

function handleSave(data: { name: string; duration?: number; targetReps?: number }) {
  if (editingWorkout.value && editingDate.value) {
    updateWorkoutInDate(editingDate.value, editingWorkout.value.id, data.name, data.duration, data.targetReps);
  }
}
</script>

<style scoped>
.weekly-planner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.planner-header {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.week-range {
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 0.5rem;
}

.nav-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.nav-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: #f5f5f5;
  color: #333;
  cursor: pointer;
}

.nav-btn:hover { background: #e0e0e0; }

.template-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.template-label { color: #666; font-size: 0.9rem; }

.template-btn {
  padding: 0.4rem 0.7rem;
  border: none;
  border-radius: 8px;
  background: #0984e3;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.template-btn.secondary {
  background: #f5f5f5;
  color: #333;
}

.template-btn:hover { filter: brightness(0.95); }

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.day-column {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.weekday { font-weight: 600; color: #2d3436; }
.date-short { color: #666; font-size: 0.9rem; }

.quick-add { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.5rem; }
.qa-row { display: flex; gap: 0.5rem; }
.qa-input { width: 100%; padding: 0.5rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 0.95rem; }
.qa-input.small { max-width: 120px; }
.qa-input:focus { outline: none; border-color: #0984e3; box-shadow: 0 0 0 3px rgba(9, 132, 227, 0.1); }
.qa-btn { padding: 0.5rem 0.75rem; border: none; border-radius: 8px; background: #00b894; color: #fff; cursor: pointer; }
.qa-btn:hover { filter: brightness(0.95); }

.qa-suggestions { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.chip { padding: 0.35rem 0.6rem; font-size: 0.85rem; border: none; border-radius: 999px; background: #f0f9ff; color: #0984e3; cursor: pointer; }
.chip:hover { filter: brightness(0.95); }

.day-list { display: flex; flex-direction: column; }
.empty { color: #999; font-size: 0.9rem; text-align: center; padding: 0.75rem 0; }

.day-actions { display: flex; gap: 0.5rem; margin-top: auto; }
.day-btn { padding: 0.4rem 0.6rem; border: none; border-radius: 8px; background: #f5f5f5; color: #333; cursor: pointer; font-size: 0.9rem; }
.day-btn:hover { background: #e0e0e0; }

@media (max-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .grid { grid-template-columns: repeat(1, 1fr); }
}
</style>