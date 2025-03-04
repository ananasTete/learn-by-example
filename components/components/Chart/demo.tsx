import Chart from './index';
import { EChartsOption } from 'echarts';
import ChartGroup from './ChartGroup';
import React from 'react';

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
      <ChartGroup style={{ width: '50%', height: '100%', border: '1px solid red' }}>
        <Chart options={initialOptions} style={{ width: '100%', height: '50%', border: '1px solid red' }} />
        <Chart options={initialOptions} style={{ width: '100%', height: '50%', border: '1px solid red' }} />
      </ChartGroup>
    </>
  );
};

export default ChartDemo;
