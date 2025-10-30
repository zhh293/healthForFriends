<template>
  <div class="workout-list">
    <!-- 空状态 -->
    <div v-if="workouts.length === 0" class="empty-state">
      <div class="empty-icon">💪</div>
      <p class="empty-text">今天还没有健身计划</p>
      <p class="empty-hint">点击右下角按钮添加第一个计划</p>
    </div>

    <!-- 计划列表 -->
    <div v-else class="list-container">
      <WorkoutCard
        v-for="workout in workouts"
        :key="workout.id"
        :workout="workout"
        @toggle-complete="handleToggleComplete"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WorkoutCard from './WorkoutCard.vue';
import type { WorkoutItem } from '../types/workout';

interface Props {
  workouts: WorkoutItem[];
}

interface Emits {
  (e: 'toggle-complete', id: string): void;
  (e: 'edit', workout: WorkoutItem): void;
  (e: 'delete', id: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

function handleToggleComplete(id: string) {
  emit('toggle-complete', id);
}

function handleEdit(workout: WorkoutItem) {
  emit('edit', workout);
}

function handleDelete(id: string) {
  emit('delete', id);
}
</script>

<style scoped>
.workout-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.list-container {
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  color: white;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.empty-text {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 0 0.5rem;
  opacity: 0.95;
}

.empty-hint {
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.8;
}
</style>

