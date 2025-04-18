import Charts from './components/Charts';
import { PackagesCategoryEnum } from './type';

export const packageList = {
  [PackagesCategoryEnum.CHARTS]: Charts,
};

console.log(packageList);

