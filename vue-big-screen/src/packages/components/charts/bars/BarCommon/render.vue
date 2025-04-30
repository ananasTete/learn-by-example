<template>
  <v-chart :option="chartOptions" autoresize />
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

defineProps({
  chartOptions: {
    type: Object,
    required: true,
  }
});

use([BarChart, CanvasRenderer, DatasetComponent, GridComponent, TooltipComponent, LegendComponent]);
</script>
