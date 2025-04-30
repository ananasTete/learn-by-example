import BarX from '@/assets/images/chart/charts/bar_x.png';
import type { ChartConfig } from '../../../../type';
import { defineAsyncComponent } from 'vue';
import echartsConfig from './echartsConfig';

const BarConfig: ChartConfig = {
  metadata: {
    key: 'BarCommon',
    title: '柱状图',
    image: BarX,
  },
  render: defineAsyncComponent(() => import('./render.vue')),
  config: defineAsyncComponent(() => import('./config.vue')),
  createConfig: () => ({
    position: {
      left: 0,
      top: 0,
    },
    size: {
      width: 300,
      height: 200,
    },
    options: echartsConfig,
  }),
};

export default BarConfig;
