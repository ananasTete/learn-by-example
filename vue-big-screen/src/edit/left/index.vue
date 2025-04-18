<script setup lang="ts">
import { packageList } from '@/packages';
import { PackagesCategoryNameEnum } from '@/packages/type';

// 侧边栏配置
const options = Object.keys(packageList).map((key) => ({
  key,
  label: PackagesCategoryNameEnum[key],
  list: packageList[key],
}));

const handleDragStart = (event: any, item: any) => {
  // 设置图像位置为鼠标开始拖拽的位置
  event.dataTransfer.setDragImage(event.target, event.offsetX, event.offsetY);

  // 设置拖拽数据
  event.dataTransfer.setData('item', JSON.stringify(item));
};

const handleDragEnd = (item: any) => {
  console.log(100, item);
};
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-auto p-2">
    <div v-for="option in options" :key="option.key">
      <h2 class="text-lg font-bold">{{ option.label }}</h2>

      <div v-for="item in option.list" :key="item.key" class="mt-2 p-2 border border-gray-200 rounded-md">
        <div class="text-sm text-gray-500">{{ item.title }}</div>

        <!-- draggable element -->
        <img
          draggable="true"
          @dragstart="handleDragStart($event, item)"
          @dragend="handleDragEnd(item)"
          :src="item.image"
          class="mt-1 w-full"
        />
      </div>
    </div>
  </div>
</template>
