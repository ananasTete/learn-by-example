import React, { FC, useRef, useState, useEffect, createContext, useContext } from 'react';
import * as echarts from 'echarts';
type ChartGroupProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const ChartGroupContext = createContext<{
  registerChart: (chart: HTMLDivElement, instance?: echarts.ECharts) => void;
  unregisterChart: (chart: HTMLDivElement) => void;
}>({
  registerChart: () => {},
  unregisterChart: () => {},
});

export const useChartGroup = () => useContext(ChartGroupContext);

const ChartGroup: FC<ChartGroupProps> = ({ children, style }) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPresentMode, setIsPresentMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charts, setCharts] = useState<{ chart: HTMLDivElement; instance?: echarts.ECharts }[]>([]);

  // 全屏
  const toggleFullScreen = () => {
    if (!wrapper.current) return;

    if (!isFullScreen) {
      // 进入全屏
      wrapper.current?.requestFullscreen();
    } else {
      // 退出全屏
      document?.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  // 处理键盘事件
  // useEffect(() => {
  //   if (!isPresentMode) return;

  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     const charts = Array.from(wrapper.current?.getElementsByClassName('chart-item') || []);

  //     switch (e.key) {
  //       case 'ArrowRight':
  //       case 'ArrowDown':
  //         setCurrentIndex((prev) => (prev + 1) % charts.length);
  //         break;
  //       case 'ArrowLeft':
  //       case 'ArrowUp':
  //         setCurrentIndex((prev) => (prev - 1 + charts.length) % charts.length);
  //         break;
  //       case 'Escape':
  //         setIsPresentMode(false);
  //         break;
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, [isPresentMode]);

  const registerChart = (chart: HTMLDivElement, instance?: echarts.ECharts) => {
    if (!wrapper.current) return;
    setCharts((prev) => [...prev, { chart, instance }]);
  };

  const unregisterChart = (chart: HTMLDivElement) => {
    if (!wrapper.current) return;
    setCharts((prev) => prev.filter((c) => c.chart !== chart));
  };

  const handleChangePresentMode = () => {
    setIsPresentMode(!isPresentMode);
    const { chart, instance } = charts[0];
    if (!isPresentMode) {
      setCurrentIndex(0);
      chart.style.position = 'fixed !important';
      chart.style.left = '100px';
      chart.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      setTimeout(() => {
        instance?.resize();
      }, 100);
    } else {
      chart.style.position = 'relative';
    }
  };

  return (
    <div ref={wrapper} className="relative bg-amber-200" style={style}>
      <div className="absolute top-0 left-0 z-10">
        <button onClick={toggleFullScreen}>{isFullScreen ? '退出全屏' : '全屏'}</button>
        <button onClick={handleChangePresentMode}>{isPresentMode ? '退出演示' : '演示模式'}</button>
      </div>
      <ChartGroupContext.Provider value={{ registerChart, unregisterChart }}>{children}</ChartGroupContext.Provider>
    </div>
  );
};

export default ChartGroup;

/**
 * 1. 设置组件全屏展示，chart 组件会自动 resize。
 */

/**
 * 新想法：保存每个 chart 中的一函数，调用函数在chart 内部动态设样式全屏。
 */
