<template>
  <header class="workout-header">
    <h1 class="header-title">健身计划</h1>
    <p class="header-date">{{ formattedDate }}</p>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getCurrentDate, formatDateChinese } from '../utils/date';

const formattedDate = computed(() => {
  const date = getCurrentDate();
  return formatDateChinese(date);
});
</script>

<style scoped>
.workout-header {
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
  color: white;
}

.header-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-date {
  font-size: 1rem;
  margin: 0;
  opacity: 0.95;
}
</style>

