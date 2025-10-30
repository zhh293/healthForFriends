<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="handleCancel">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ mode === 'add' ? '添加计划' : '编辑计划' }}</h2>
          <button @click="handleCancel" class="close-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="workout-name" class="form-label">
              计划名称 <span class="required">*</span>
            </label>
            <input
              id="workout-name"
              v-model="formData.name"
              type="text"
              placeholder="例如：俯卧撑、跑步..."
              class="form-input"
              autofocus
            />
            <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
          </div>

          <div class="form-group">
            <label for="workout-duration" class="form-label">
              运动时长（分钟）
            </label>
            <input
              id="workout-duration"
              v-model.number="formData.duration"
              type="number"
              min="1"
              placeholder="可选"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="workout-reps" class="form-label">
              目标次数
            </label>
            <input
              id="workout-reps"
              v-model.number="formData.targetReps"
              type="number"
              min="1"
              placeholder="可选"
              class="form-input"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button @click="handleCancel" class="btn btn-cancel">取消</button>
          <button @click="handleSave" class="btn btn-save">保存</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { WorkoutItem } from '../types/workout';
import type { EditMode } from '../types/workout';

interface Props {
  show: boolean;
  mode: EditMode;
  workout?: WorkoutItem;
}

interface Emits {
  (e: 'save', data: { name: string; duration?: number; targetReps?: number }): void;
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = ref({
  name: '',
  duration: undefined as number | undefined,
  targetReps: undefined as number | undefined
});

const errors = ref({
  name: ''
});

// 监听 workout 变化，填充表单
watch(() => props.workout, (newWorkout) => {
  if (newWorkout) {
    formData.value = {
      name: newWorkout.name,
      duration: newWorkout.duration,
      targetReps: newWorkout.targetReps
    };
  } else {
    resetForm();
  }
}, { immediate: true });

// 监听 modal 显示状态，重置表单
watch(() => props.show, (newShow) => {
  if (!newShow) {
    resetForm();
  }
});

function resetForm() {
  formData.value = {
    name: '',
    duration: undefined,
    targetReps: undefined
  };
  errors.value = { name: '' };
}

function validateForm(): boolean {
  errors.value = { name: '' };
  
  if (!formData.value.name || formData.value.name.trim() === '') {
    errors.value.name = '请输入计划名称';
    return false;
  }
  
  return true;
}

function handleSave() {
  if (!validateForm()) {
    return;
  }
  
  emit('save', {
    name: formData.value.name,
    duration: formData.value.duration,
    targetReps: formData.value.targetReps
  });
  
  emit('close');
}

function handleCancel() {
  emit('close');
}
</script>

<style scoped>
/* Modal 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2d3436;
}

.close-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #666;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn svg {
  width: 24px;
  height: 24px;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3436;
  font-size: 0.95rem;
}

.required {
  color: #e74c3c;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #0984e3;
  box-shadow: 0 0 0 3px rgba(9, 132, 227, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.error-message {
  margin: 0.5rem 0 0;
  color: #e74c3c;
  font-size: 0.875rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-save {
  background: #0984e3;
  color: white;
}

.btn-save:hover {
  background: #0984d0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(9, 132, 227, 0.3);
}

.btn-save:active {
  transform: translateY(0);
}
</style>

