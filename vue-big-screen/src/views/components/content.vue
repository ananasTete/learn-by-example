<script setup lang="ts">
import { useEditingStore } from '../../store/editingStore';
import { chartOptions, getRenderComponent } from '../../packages';

const editingStore = useEditingStore();

const handleDrop = (e: DragEvent) => {
  e.preventDefault();

  const dragData = JSON.parse(e.dataTransfer?.getData('text/plain') || '');
  if (!dragData) return;
  const { key, startOffsetX, startOffsetY } = dragData;

  editingStore.addInstance(key, { left: e.offsetX - startOffsetX, top: e.offsetY - startOffsetY });
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault();
};
</script>

<template>
  <div @dragenter="handleDragEnter" @dragover="handleDragOver" @drop="handleDrop" class="w-full h-full bg-white relative">
    <div
      v-for="instance in editingStore.instances"
      :key="instance.instanceId"
      class="absolute"
      :class="{
        'border-2 border-amber-600 cursor-grab': instance.instanceId === editingStore.currentInstanceId,
      }"
      :style="{
        left: instance.config.position.left + 'px',
        top: instance.config.position.top + 'px',
        width: instance.config.size.width + 'px',
        height: instance.config.size.height + 'px',
      }"
      @click="editingStore.selectInstance(instance.instanceId)"
    >
      <component :is="getRenderComponent(instance.chartKey)" :chartOptions="instance.config.options" />
    </div>
  </div>
</template>
