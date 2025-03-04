import React, { FC, useRef, useState, useEffect } from 'react';

type ChartGroupProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const ChartGroup: FC<ChartGroupProps> = ({ children, style }) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPresentMode, setIsPresentMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
  useEffect(() => {
    if (!isPresentMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const charts = Array.from(wrapper.current?.getElementsByClassName('chart-item') || []);

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          setCurrentIndex((prev) => (prev + 1) % charts.length);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          setCurrentIndex((prev) => (prev - 1 + charts.length) % charts.length);
          break;
        case 'Escape':
          setIsPresentMode(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentMode]);

  // 包装子元素
  // const wrappedChildren = React.Children.map(children, (child, index) => (
  //   <div
  //     className="chart-item"
  //     style={{
  //       display: isPresentMode ? (index === currentIndex ? 'block' : 'none') : 'block',
  //       height: isPresentMode ? '100vh' : 'auto',
  //     }}
  //   >
  //     {child}
  //   </div>
  // ));

  return (
    <div ref={wrapper} className="relative bg-amber-200" style={style}>
      <div className="absolute top-0 left-0 z-10">
        <button onClick={toggleFullScreen}>{isFullScreen ? '退出全屏' : '全屏'}</button>
        <button onClick={() => setIsPresentMode(!isPresentMode)}>{isPresentMode ? '退出演示' : '演示模式'}</button>
      </div>
      {children}
    </div>
  );
};

export default ChartGroup;

/**
 * 1. 设置组件全屏展示，chart 组件会自动 resize。
 */
