import React, { FC, useRef, useState, useEffect } from 'react';

type TextProps = {
  children: string;
  rowCount?: number;
};

const Text: FC<TextProps> = ({ children, rowCount = 1 }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const { scrollHeight, clientHeight } = textRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    }
  }, [children, rowCount]);

  return (
    <div className="relative group">
      <span
        ref={textRef}
        style={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: rowCount,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {children}
      </span>
      {isTruncated && <span className="hidden group-hover:block absolute t-[120%] whitespace-nowrap bg-blue-300">{children}</span>}
    </div>
  );
};

export default Text;


/**
 * 1. 如何设置任意行省略？
 * 通过 webkitLineClamp 属性设置行数，超出则省略。其他属性也是必须的。
 * 
 * 
 * 2. 如何判断是否省略了，从而显示 Tooltip？
 * 用以上的方法省略文本时，scrollHeight 还是没省略时的高度， clientHeight 是省略后的高度。对比可知是否省略了。
 * 
 * 3. 可以结合 antd 的 Tooltip 组件。
 */