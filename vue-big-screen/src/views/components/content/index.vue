<script setup lang="ts">
import { useEditingStore } from '../../../store/editingStore';
import { getRenderComponent } from '../../../packages';

const editingStore = useEditingStore();

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault();
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();

  const chartKey = e.dataTransfer?.getData('text/plain');
  if (!chartKey) return;

  editingStore.addInstance(chartKey, { x: e.offsetX, y: e.offsetY });
};
</script>

<template>
  <div @dragenter="handleDragEnter" @dragover="handleDragOver" @drop="handleDrop" class="w-full h-full bg-white relative">
    <div v-for="instance in editingStore.instances" :key="instance.instanceId">
      {{ getRenderComponent(instance.chartKey) }}
      <component :is="getRenderComponent(instance.chartKey)" />
    </div>
  </div>
</template>
