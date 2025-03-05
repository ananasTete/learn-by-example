import React, { FC, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useChartGroup } from './ChartGroup';
type ChartProps = {
  options: echarts.EChartsOption;
  loading?: boolean;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
};

const Chart: FC<ChartProps> = ({ options, loading = false, width = '100%', height = '100%', style }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>(null);

  const { registerChart, unregisterChart } = useChartGroup();

  // 初始化 chart
  useEffect(() => {
    chartInstance.current = echarts.init(chartRef.current);
    chartInstance.current?.setOption(options);
  }, [options]);

  useEffect(() => {
    if (chartRef.current && chartInstance.current) {
      registerChart(chartRef.current, chartInstance.current);
    }
    return () => {
      if (chartRef.current) {
        unregisterChart(chartRef.current);
      }
    };
  }, []);

  // 自动 resize
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => {
        chartInstance.current?.resize();
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 加载状态
  useEffect(() => {
    const instance = chartInstance.current;
    if (!instance) return;
    if (loading) {
      instance.showLoading();
    } else {
      instance.hideLoading();
    }
  }, [loading]);

  // 导出为图片
  const handleExport = () => {
    const instance = chartInstance.current;
    if (!instance) return;

    const url = instance.getDataURL({
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

  return <div ref={chartRef} onClick={handleExport} style={{ width, height, ...style, transition: 'all 0.3s ease' }} />;
};

export default Chart;

/**
 * 1. 自动 resize 功能，使用 requestAnimationFrame 实现高效重绘。
 *
 * 2. 导出为图片功能
 *
 * 3. 加载状态功能
 *
 * 使用 echarts-for-react 库，支持自动 resize、加载状态功能。
 */

/**
 * 不该根据 window 的 resize 事件来触发 resize，因为他可能是固定宽高的，或者他的容器是可以拖拽设置宽高的。要改！！！！
 */