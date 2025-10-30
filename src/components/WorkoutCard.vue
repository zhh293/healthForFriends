<template>
  <Transition name="workout-card">
    <div class="workout-card" :class="{ 'completed': workout.completed }">
      <div class="card-content">
        <!-- 完成复选框 -->
        <label class="checkbox-wrapper">
          <input
            type="checkbox"
            :checked="workout.completed"
            @change="handleToggle"
            class="checkbox-input"
          />
          <span class="checkbox-custom" :class="{ 'checked': workout.completed }">
            <svg v-if="workout.completed" viewBox="0 0 20 20" class="check-icon">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </span>
        </label>

        <!-- 计划名称 -->
        <span class="workout-name" :class="{ 'completed-text': workout.completed }">
          {{ workout.name }}
        </span>
      </div>

      <!-- 可选字段显示 -->
      <div v-if="workout.duration || workout.targetReps" class="card-meta">
        <span v-if="workout.duration" class="meta-item">
          🏃 {{ workout.duration }}分钟
        </span>
        <span v-if="workout.targetReps" class="meta-item">
          💪 {{ workout.targetReps }}次
        </span>
      </div>

      <!-- 操作按钮 -->
      <div class="card-actions">
        <button @click="handleEdit" class="action-btn edit-btn" title="编辑">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
          </svg>
        </button>
        <button @click="handleDelete" class="action-btn delete-btn" title="删除">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { WorkoutItem } from '../types/workout';

interface Props {
  workout: WorkoutItem;
}

interface Emits {
  (e: 'toggle-complete', id: string): void;
  (e: 'edit', workout: WorkoutItem): void;
  (e: 'delete', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function handleToggle() {
  emit('toggle-complete', props.workout.id);
}

function handleEdit() {
  emit('edit', props.workout);
}

function handleDelete() {
  emit('delete', props.workout.id);
}
</script>

<style scoped>
.workout-card {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease-out;
}

.workout-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.workout-card.completed {
  opacity: 0.7;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 删除动画 */
.workout-card-leave-active {
  transition: all 0.3s ease;
}

.workout-card-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

/* 复选框样式 */
.checkbox-wrapper {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid #0984e3;
  border-radius: 6px;
  background: white;
  transition: all 0.2s ease;
}

.checkbox-custom:hover {
  background: #f0f8ff;
}

.checkbox-custom.checked {
  background: #51cf66;
  border-color: #51cf66;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: white;
}

.workout-name {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  color: #2d3436;
  word-break: break-word;
}

.workout-name.completed-text {
  text-decoration: line-through;
  color: #999;
}

.card-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  margin-left: 34px;
  font-size: 0.9rem;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  align-self: flex-end;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.edit-btn {
  color: #0984e3;
}

.edit-btn:hover {
  background: #e3f2fd;
  transform: scale(1.1);
}

.delete-btn {
  color: #e74c3c;
}

.delete-btn:hover {
  background: #ffebee;
  transform: scale(1.1);
}
</style>

