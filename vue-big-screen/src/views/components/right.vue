<script setup lang="ts">
import { getConfigComponent } from '../../packages';
import { useEditingStore } from '../../store/editingStore';

const editingStore = useEditingStore();
</script>

<template>
  <div v-if="editingStore.currentInstance">
    <component :is="getConfigComponent(editingStore.currentInstance.chartKey)" />
  </div>
  <div v-else>
    No current instance available.
  </div>
</template>
