<script setup>
import { defineAsyncComponent } from 'vue'

/**
 * 封装公共函数进行异步组件的加载，写到 utils 文件夹下
 */
const loadAsyncComponent = (loader) => {
  return defineAsyncComponent({
    loader,
    loadingComponent: LoadingComp, // 公共的 loading 组件
    delay: 20, // 延迟时间
  })
}

// 使用
const AsyncChartList = loadAsyncComponent(() => import('./components/ChartList.vue'))
</script>

<template>
  <AsyncChartList />
</template>