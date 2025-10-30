<template>
  <div class="app">
    <!-- 顶部标题栏 -->
    <WorkoutHeader />

    <!-- 健身计划列表 -->
    <WorkoutList
      :workouts="workouts"
      @toggle-complete="handleToggleComplete"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- 添加按钮 -->
    <AddWorkoutButton @click="openAddModal" />

    <!-- 底部统计信息 -->
    <StatisticsBar
      :total="totalWorkouts"
      :completed="completedWorkouts"
      :completion-rate="completionRate"
    />

    <!-- 添加/编辑模态框 -->
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
import { ref } from 'vue';
import { useWorkouts } from './composables/useWorkouts';
import { useDailyReset } from './composables/useDailyReset';
import type { WorkoutItem, EditMode } from './types/workout';

import WorkoutHeader from './components/WorkoutHeader.vue';
import WorkoutList from './components/WorkoutList.vue';
import AddWorkoutButton from './components/AddWorkoutButton.vue';
import StatisticsBar from './components/StatisticsBar.vue';
import WorkoutModal from './components/WorkoutModal.vue';

// 使用 composables
const {
  workouts,
  totalWorkouts,
  completedWorkouts,
  completionRate,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  toggleComplete
} = useWorkouts();

useDailyReset();

// 模态框状态
const showModal = ref(false);
const modalMode = ref<EditMode>('add');
const editingWorkout = ref<WorkoutItem | undefined>(undefined);

// 打开添加模态框
function openAddModal() {
  modalMode.value = 'add';
  editingWorkout.value = undefined;
  showModal.value = true;
}

// 关闭模态框
function closeModal() {
  showModal.value = false;
  editingWorkout.value = undefined;
}

// 处理编辑
function handleEdit(workout: WorkoutItem) {
  modalMode.value = 'edit';
  editingWorkout.value = workout;
  showModal.value = true;
}

// 处理保存
function handleSave(data: { name: string; duration?: number; targetReps?: number }) {
  if (modalMode.value === 'add') {
    addWorkout(data.name, data.duration, data.targetReps);
  } else if (modalMode.value === 'edit' && editingWorkout.value) {
    updateWorkout(editingWorkout.value.id, data.name, data.duration, data.targetReps);
  }
}

// 处理切换完成状态
function handleToggleComplete(id: string) {
  toggleComplete(id);
}

// 处理删除
function handleDelete(id: string) {
  if (confirm('确定要删除这个计划吗？')) {
    deleteWorkout(id);
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
}

.app {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>

