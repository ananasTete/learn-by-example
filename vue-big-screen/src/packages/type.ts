import type { Component } from "vue";

export type ChartConfig = {
  metadata: {
    key: string;
    title: string;
    image: string;
  };
  render: () => Promise<Component>;
  config: () => any;
  createConfig: () => any;
};
