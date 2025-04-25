import BarX from '@/assets/images/chart/charts/bar_x.png';
import type { ChartConfig } from '../../../../type';
import { defineAsyncComponent } from 'vue';

const BarConfig: ChartConfig = {
  metadata: {
    key: 'BarCommon',
    title: '柱状图',
    image: BarX,
  },
  render: defineAsyncComponent(() => import('./render.vue')),
  config: () => import('./config.vue'),
  createConfig: () => ({
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 100,
      height: 100,
    },
    options: {
      title: '柱状图',
      xAxis: [],
      yAxis: [],
      series: [],
    },
  }),
};

export default BarConfig;
