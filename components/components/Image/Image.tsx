import React, { CSSProperties, useEffect, useRef, useState } from 'react';

type LazyLoadImageProps = {
  src: string;
  alt: string;
  distance?: number;
  style?: CSSProperties
};

const LazyLoadImage: React.FC<LazyLoadImageProps> = ({ src, alt, distance = 100, style }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: `${distance}px`, // 提前加载
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // 停止观察
        }
      });
    }, options);

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return <img ref={imgRef} src={isVisible ? src : undefined} alt={alt} style={style} />;
};

export default LazyLoadImage



/**
 * 1. 什么是懒加载
 * 图片在页面中未进入可视区域时，不进行加载，当图片进入可视区域时，进行加载
 *
 * 2. 实现？
 * 通过 IntersectionObserver 监听图片元素，当图片元素进入可视区域时，再设置正确的图片 URL 到 img 元素。
 *
 * 3. 如何避免在快速滚动时，图片加载过慢？
 *  3.1 通过 IntersectionObserver 的 rootMargin 属性，提前加载图片
 *  3.2 配置没有进入视图的图片使用默认提供的加载图片
 * 
 * 4. 一般在写图片的时候，只设置宽高的一个另一个由图片比例自动设置。但图片如果没有宽高属性的话在网速慢时先渲染了其他元素
 *    而不知道图片的大小导致没有给图片留出正确的空间，加载完成后出发重排，导致图片闪烁问题。解决？
 *  4.1 为 img 元素设置宽高比 aspect-ratio: 2 / 3 再加上一边的尺寸，浏览器就能在图片加载完成前正确计算布局空间。
 */
