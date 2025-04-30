import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { chartRegistry } from '../packages';

export const useEditingStore = defineStore('editing', () => {
  const instances = ref<any[]>([]); // 存储图表实例
  const currentInstanceId = ref<string>(''); // 当前选中的图表实例
  const metadata = ref<any>({ name: '', size: '', theme: 'dark' }); // 存储图表的元数据

  const currentInstance = computed(() => {
    const chart = instances.value.find((item) => item.instanceId === currentInstanceId.value);
    return chart || null;
  });

  function addInstance(chartKey: string, position: { left: number; top: number }) {
    const chartConfig = chartRegistry.get(chartKey);
    if (!chartConfig) {
      console.error(`Chart with key ${chartKey} not found`);
      return;
    }

    const newConfig = chartConfig.createConfig();

    const instance = {
      instanceId: `${chartKey}-${Date.now()}`,
      chartKey,
      config: {
        ...newConfig,
        position,
      },
    };
    instances.value.push(instance);
    selectInstance(instance.instanceId);
  }

  function selectInstance(instanceId: string) {
    currentInstanceId.value = instanceId;
  }

  return { instances, currentInstance, metadata, currentInstanceId, addInstance, selectInstance };
});
