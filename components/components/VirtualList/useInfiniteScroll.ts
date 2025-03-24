import { useEffect, useState, useRef, RefObject } from 'react';

type UseInfiniteScrollOptions = {
  target: RefObject<HTMLElement>;
  isNoMore: boolean;
  threshold?: number;
  onLoadMore: () => Promise<void> | void;
};

type UseInfiniteScrollReturn = {
  loadingMore: boolean;
  noMore: boolean;
};


export const useInfiniteScroll = ({ target, isNoMore, threshold = 100, onLoadMore }: UseInfiniteScrollOptions): UseInfiniteScrollReturn => {
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [noMore, setNoMore] = useState<boolean>(isNoMore);

  const loadingRef = useRef(false);

  useEffect(() => {
    setNoMore(isNoMore);
  }, [isNoMore]);

  useEffect(() => {
    const element = target.current;
    if (!element) return;

    const handleScroll = async () => {
      if (loadingRef.current || noMore) return;

      const { scrollTop, scrollHeight, clientHeight } = element;

      if (scrollHeight - scrollTop - clientHeight <= threshold) {
        try {
          setLoadingMore(true);
          loadingRef.current = true;

          await onLoadMore();
        } finally {
          setLoadingMore(false);
          loadingRef.current = false;
        }
      }
    };

    element.addEventListener('scroll', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [target, threshold, noMore, onLoadMore]);

  return { loadingMore, noMore };
};
