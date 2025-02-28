import React from 'react';
import LazyLoadImage from './Image';

// 使用示例
const ImageComponent: React.FC = () => {
  return (
    <div className="border border-amber-200 w-[400px]">
      <div className=""></div>
      {['http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg'].map((url) => (
        <LazyLoadImage src={url} alt="示例图片" />
      ))}
      <h1>测试布局</h1>
    </div>
  );
};

export default ImageComponent;
