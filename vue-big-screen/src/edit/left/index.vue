<script setup lang="ts">
import packageList from '../../packages';

console.log(100, packageList);

</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-auto p-2">
    <div v-for="key in Object.keys(packageList)" :key="key">
      <div>{{ key }}</div>
      <div v-for="item in packageList[key]" :key="item.key">
        <div>{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>