import React, { FC, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

type ChartProps = {
  options: echarts.EChartsOption;
  loading?: boolean;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  allowExport?: boolean;
};

const Chart: FC<ChartProps> = ({ options, loading = false, width = '100%', height = '100%', style, allowExport = false }) => {
  const chartRef = useRef<ReactECharts>(null);

  // 自动 resize
  useEffect(() => {
    const handleResize = () => {
      chartRef.current?.getEchartsInstance()?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 加载状态
  useEffect(() => {
    const chartInstance = chartRef.current?.getEchartsInstance();
    if (!chartInstance) return;
    if (loading) {
      chartInstance.showLoading();
    } else {
      chartInstance.hideLoading();
    }
  }, [loading]);

  // 导出为图片
  const handleExport = () => {
    const chartInstance = chartRef.current?.getEchartsInstance();
    if (!chartInstance) return;
    const url = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff',
    });
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart.png';
    a.click();
  };

  return (
    <div className="relative" style={{ width, height, ...style }}>
      {allowExport && (
        <div className="absolute top-0 right-0 z-10">
          <button disabled={loading} onClick={handleExport}>
            导出
          </button>
        </div>
      )}
      <ReactECharts ref={chartRef} option={options} />
    </div>
  );
};

export default Chart;

/**
 * 使用 echarts-for-react 库
 * 
 * 1. 自动 resize 功能
 * 
 * 2. 导出为图片功能
 * 
 * 3. 加载状态功能
 */