<template>
  <div class="statistics-bar">
    <div class="stat-item">
      <div class="stat-label">总计划</div>
      <div class="stat-value">{{ total }}</div>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <div class="stat-label">已完成</div>
      <div class="stat-value completed-value">{{ completed }}</div>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <div class="stat-label">完成率</div>
      <div class="stat-value rate-value">{{ completionRate }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  total: number;
  completed: number;
  completionRate: number;
}

defineProps<Props>();
</script>

<style scoped>
.statistics-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px 16px 0 0;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3436;
}

.completed-value {
  color: #51cf66;
}

.rate-value {
  color: #0984e3;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e0e0e0;
  margin: 0 1rem;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .statistics-bar {
    padding: 1rem 0.75rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
}
</style>

