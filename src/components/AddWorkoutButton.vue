<template>
  <button class="add-button" @click="$emit('click')" title="添加新计划">
    <svg class="plus-icon" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.add-button {
  position: fixed;
  bottom: 5rem;
  right: 1.5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0984e3 0%, #00b894 100%);
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(9, 132, 227, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.add-button:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 6px 20px rgba(9, 132, 227, 0.5);
}

.add-button:active {
  transform: translateY(-2px) scale(1.05);
}

.plus-icon {
  width: 28px;
  height: 28px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .add-button {
    bottom: 4.5rem;
    right: 1rem;
    width: 52px;
    height: 52px;
  }
  
  .plus-icon {
    width: 24px;
    height: 24px;
  }
}
</style>

