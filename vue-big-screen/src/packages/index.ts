import { PackagesCategoryEnum } from './type';

const Charts: Record<string, { default: any }> = import.meta.glob('./components/Charts/*/*/index.ts', {
  eager: true,
});

export const packageList = {
  [PackagesCategoryEnum.CHARTS]: Object.values(Charts).map((item) => item.default),
};

