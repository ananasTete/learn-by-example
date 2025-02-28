import EasyTooltip from './easy';
import React from 'react';
export const EasyTooltipDemo = () => {
  return (
    <div className="flex flex-col gap-4">
      <EasyTooltip title="测试弹出层的样式" placement="top">
        <div>Hello</div>
      </EasyTooltip>

      <EasyTooltip title="测试弹出层的样式" placement="bottom">
        <div>Hello</div>
      </EasyTooltip>

      <EasyTooltip title="测试弹出层的样式" placement="left">
        <div>Hello</div>
      </EasyTooltip>

      <EasyTooltip title="测试弹出层的样式" placement="right">
        <div>Hello</div>
      </EasyTooltip>
    </div>
  );
};
