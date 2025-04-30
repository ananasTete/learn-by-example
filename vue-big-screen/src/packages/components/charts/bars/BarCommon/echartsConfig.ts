const echartsConfig = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      show: true,
      type: 'shadow',
    },
  },
  xAxis: {
    show: true,
    type: 'category',
  },
  yAxis: {
    show: true,
    type: 'value',
  },
  dataset: {
    dimensions: ['product', 'data1', 'data2'],
    source: [
      {
        product: 'Mon',
        data1: 120,
        data2: 130,
      },
      {
        product: 'Tue',
        data1: 200,
        data2: 130,
      },
      {
        product: 'Wed',
        data1: 150,
        data2: 312,
      },
      {
        product: 'Thu',
        data1: 80,
        data2: 268,
      },
      {
        product: 'Fri',
        data1: 70,
        data2: 155,
      },
      {
        product: 'Sat',
        data1: 110,
        data2: 117,
      },
      {
        product: 'Sun',
        data1: 130,
        data2: 160,
      },
    ],
  },
  series: [
    {
      type: 'bar',
      barWidth: 15,
      label: {
        show: true,
        position: 'top',
        color: '#fff',
        fontSize: 12,
      },
      itemStyle: {
        color: null,
        borderRadius: 2,
      },
    },
    {
      type: 'bar',
      barWidth: 15,
      label: {
        show: true,
        position: 'top',
        color: '#fff',
        fontSize: 12,
      },
      itemStyle: {
        color: null,
        borderRadius: 2,
      },
    },
  ],
};

export default echartsConfig;
