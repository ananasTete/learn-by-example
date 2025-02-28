import React, { FC } from 'react';

interface EasyTooltipProps {
  title: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const EasyTooltip: FC<EasyTooltipProps> = ({ title, children, placement = 'top' }) => {
  // 设置弹出位置及其箭头位置
  const placementClass = {
    top: 'top-[-120%] left-1/2 -translate-x-1/2 before:top-[100%] before:left-1/2 before:-translate-x-1/2 before:border-t-black',
    bottom: 'bottom-[-120%] left-1/2 -translate-x-1/2 before:bottom-[100%] before:left-1/2 before:-translate-x-1/2 before:border-b-black',
    left: 'right-[120%] top-1/2 -translate-y-1/2 before:left-[100%] before:top-1/2 before:-translate-y-1/2 before:border-l-black',
    right: 'left-[120%] top-1/2 -translate-y-1/2 before:right-[100%] before:top-1/2 before:-translate-y-1/2 before:border-r-black',
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={`hidden group-hover:block absolute ${placementClass[placement]} whitespace-nowrap
        before:absolute before:content-[''] before:border-[6px] before:border-transparent bg-black text-white px-2 py-1 rounded text-sm`}
      >
        {title}
      </div>
    </div>
  );
};

export default EasyTooltip;

/**
 * 1. 使用 display: none - block 控制显示与隐藏，通过 absolute 控制位置
 * 
 * 2. 通过 group-hover 实现 hover children 显示，并在 hover tooltip 时也不会销毁。
 * 
 * 3. 通过 absolute 控制 tooltip 的位置，并使用 before 伪元素控制箭头位置。
 * 
 * 4. 使用 whitespace-nowrap 控制文本不换行。避免 tooltip 宽度受制于 children 宽度。
 */
