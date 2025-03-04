import React, { FC, useRef, useState } from 'react';

type ChartGroupProps = {
  children: React.ReactNode;
};

const ChartGroup: FC<ChartGroupProps> = ({ children }) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  return (
    <div ref={wrapper} className="relative bg-amber-200 w-1/2 h-full">
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <button onClick={toggleFullScreen}>{isFullScreen ? '退出全屏' : '全屏'}</button>
      </div>
      {children}
    </div>
  );
};

export default ChartGroup;
