import type { DefineComponent } from "vue";

export type ChartConfig = {
  metadata: {
    key: string;
    title: string;
    image: string;
  };
  render: DefineComponent<{}, {}, any>;
  config: DefineComponent<{}, {}, any>;
  createConfig: () => {
    position: {
      left: number;
      top: number;
    };
    size: {
      width: number;
      height: number;
    };
    options: any;
  };
};
