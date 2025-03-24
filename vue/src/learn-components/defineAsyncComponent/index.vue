<script setup>
import { defineAsyncComponent } from 'vue'

const LoadingComp = defineAsyncComponent(() => import('./components/Loading.vue'))
</script>

<template>
  <LoadingComp />
</template>