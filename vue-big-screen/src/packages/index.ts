import type { ChartConfig } from './type';

type CategoryConfigType = {
  label: string;
  key: string;
  globResult: Record<string, { default: ChartConfig }>;
};

const categoryConfig: CategoryConfigType[] = [
  {
    label: '图表',
    key: 'charts',
    globResult: import.meta.glob('./components/Charts/*/*/index.ts', {
      eager: true,
    }),
  },
  {
    label: '信息',
    key: 'information',
    globResult: import.meta.glob('./components/Information/*/*/index.ts', {
      eager: true,
    }),
  },
];

const chartRegistry = new Map<string, ChartConfig>();
const chartOptions: { label: string, key: string, list: ChartConfig[]}[] = [];

categoryConfig.forEach((item) => {
  const configMap = item.globResult;
  const configList: ChartConfig[] = [];

  for (const key in configMap) {
    const item = configMap[key].default;
    configList.push(item);
    chartRegistry.set(item.metadata.key, item);
  }

  chartOptions.push({
    label: item.label,
    key: item.key,
    list: configList,
  });
});

function getRenderComponent(key: string) {
  const chartConfig = chartRegistry.get(key);
  if (!chartConfig) {
    console.error(`Chart with key ${key} not found`);
    return;
  }
  return chartConfig.render;
}

function getConfigComponent(key: string) {
  const chartConfig = chartRegistry.get(key);
  if (!chartConfig) {
    console.error(`Chart with key ${key} not found`);
    return;
  }
  return chartConfig.config;
}

export { chartRegistry, chartOptions, getRenderComponent, getConfigComponent };
