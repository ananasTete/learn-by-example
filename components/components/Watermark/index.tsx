import React, { FC } from 'react';

type WatermarkProps = {
  children?: React.ReactNode;
  getContainer?: () => HTMLElement;
};

const setCanvas = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.font = '600 16px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Watermark', 0, 16);
  }
  return { base64Url: canvas.toDataURL('image/png'), width: 100, height: 100 };
};

const Watermark: FC<WatermarkProps> = ({ children }) => {
  const { base64Url, width, height } = setCanvas();
  return (
    <div style={{ position: 'relative' }}>
      <img src={base64Url} width={width} height={height} />
      {children}
    </div>
  );
};

export default Watermark;
