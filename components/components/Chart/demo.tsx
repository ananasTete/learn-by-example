import Chart from './index';
import { EChartsOption } from 'echarts';
import ChartGroup from './ChartGroup';
const initialOptions: EChartsOption = {
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
};

const ChartDemo = () => {
  return (
    <>
      <ChartGroup>
        <Chart options={initialOptions} allowExport style={{ width: '100%', height: 300, border: '1px solid red' }} />
        <Chart options={initialOptions} allowExport style={{ width: '100%', height: 300, border: '1px solid red' }} />
      </ChartGroup>
    </>
  );
};

export default ChartDemo;
