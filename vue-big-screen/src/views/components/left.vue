<script setup lang="ts">
import { chartOptions } from '../../packages';

const handleDragStart = (event: any, chart: any) => {
  // 设置图像位置为鼠标开始拖拽的位置
  event.dataTransfer.setDragImage(event.target, event.offsetX, event.offsetY);

  // 设置拖拽数据
  event.dataTransfer.setData('text/plain', JSON.stringify({ key: chart.metadata.key, startOffsetX: event.offsetX, startOffsetY: event.offsetY }));
};
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-auto p-2">
    <div v-for="option in chartOptions" :key="option.key">
      <h2 class="text-lg font-bold">{{ option.label }}</h2>

      <div v-for="chart in option.list" :key="chart.metadata.key" class="mt-2 p-2 border border-gray-200 rounded-md">
        <div class="text-sm text-gray-500">{{ chart.metadata.title }}</div>

        <!-- draggable element -->
        <img draggable="true" @dragstart="handleDragStart($event, chart)" :src="chart.metadata.image" loading="lazy" class="mt-1 w-full" />
      </div>
    </div>
  </div>
</template>
