import { useCallback, useRef, CSSProperties } from 'react';

type Options = {
  delay?: number; // 触发长按所需的延迟时间（毫秒），默认为 300ms
  onLongPressStart?: (event: React.PointerEvent<Element>) => void; // 长按持续时间达到后（释放前）触发的回调
  onLongPressEnd?: (event: React.PointerEvent<Element>) => void; // 长按触发后，指针释放时触发的回调
  onClick?: (event: React.PointerEvent<Element>) => void; // 在延迟时间之前释放指针（普通点击）时触发的回调
  onCancel?: (event: React.PointerEvent<Element>) => void; // 如果指针交互意外取消（例如浏览器介入），则触发回调
};

type LongPressBindings = {
  onPointerDown: (event: React.PointerEvent<Element>) => void;
  onPointerUp: (event: React.PointerEvent<Element>) => void;
  onPointerCancel: (event: React.PointerEvent<Element>) => void;
  style: CSSProperties;
};

export const useLongPress = ({ delay = 300, onLongPressStart, onLongPressEnd, onClick, onCancel }: Options): LongPressBindings => {
  const timeoutRef = useRef<number | null>(null);
  const isLongPressTriggered = useRef(false); // 是否触发了长按
  const isPressed = useRef(false); // 跟踪指针当前是否在元素上按下
  const targetRef = useRef<EventTarget | null>(null); // 事件绑定元素

  // 清理计时器和重置标志的函数
  const cleanup = useCallback((event: React.PointerEvent<Element> | PointerEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isPressed.current = false; // 标记为未按下状态

    // 仅当是由此 hook 发起捕获时才释放指针捕获
    if (targetRef.current && event.isPrimary) {
      try {
        // 确保 target 是 Element 实例再调用 DOM 方法
        if (targetRef.current instanceof Element) {
          targetRef.current.releasePointerCapture(event.pointerId);
        }
      } catch (error) {
        console.warn('无法释放指针捕获:', error);
      }
      targetRef.current = null; // 清空目标引用
    }
  }, []);

  // 按下
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<Element>) => {
      // 忽略非主指针（例如多点触控的第二根手指）或已按下状态
      if (!event.isPrimary || isPressed.current) {
        return;
      }

      isPressed.current = true;
      isLongPressTriggered.current = false; // 重置长按触发状态
      targetRef.current = event.currentTarget; // 存储元素用于释放捕获

      // 捕获指针
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch (error) {
        console.error('捕获指针失败:', error);
        // 如果捕获失败，则不继续执行长按逻辑
        isPressed.current = false;
        targetRef.current = null;
        return;
      }

      // 清除任何之前的计时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 启动计时器以检测长按
      timeoutRef.current = setTimeout(() => {
        // 当计时器触发时，检查是否仍然处于按下状态
        if (isPressed.current) {
          isLongPressTriggered.current = true;
          onLongPressStart?.(event);
        }
        // 触发后或在触发前按压结束，清除计时器引用
        timeoutRef.current = null;
      }, delay);
    },
    [delay, onLongPressStart],
  );

  // 抬起
  const handlePointerUp = useCallback(
    (event: React.PointerEvent<Element>) => {
      if (!event.isPrimary || !isPressed.current) {
        return;
      }

      const wasLongPress = isLongPressTriggered.current;
      const hadTimerPending = !!timeoutRef.current; // 计时器是否仍在运行（即尚未达到长按时间）

      cleanup(event); // 始终清理计时器和指针捕获

      if (wasLongPress) {
        // 如果长按已被触发，则调用结束处理程序
        onLongPressEnd?.(event);
      } else if (hadTimerPending) {
        // 如果不是长按，并且是本次抬起操作清除了计时器。意味着未达到超时时间），则视为单击。
        onClick?.(event);
      }

      // 在回调之后重置长按标志，为下一次交互做准备
      isLongPressTriggered.current = false;
    },
    [onClick, onLongPressEnd, cleanup],
  );

  // Pointer Cancel: （意外）结束处理流程
  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<Element>) => {
      if (!event.isPrimary || !isPressed.current) {
        return;
      }

      // 清理计时器和指针捕获
      cleanup(event);

      // 可选地触发特定的取消处理程序
      onCancel?.(event);

      // 重置长按标志，为下一次交互做准备
      isLongPressTriggered.current = false;
    },
    [onCancel, cleanup],
  );

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    style: { touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' } as CSSProperties,
  };
};

// 使用示例:
// function MyComponent() {
//   const longPressProps = useLongPress({
//     onLongPressStart: (e) => console.log('长按开始!', e.type),
//     onLongPressEnd: (e) => console.log('长按结束!', e.type),
//     onClick: (e) => console.log('点击!', e.type),
//     onCancel: (e) => console.log('按压取消!', e.type),
//     delay: 500,
//   });
//
//   return (
//     <button {...longPressProps}>
//       按住我
//     </button>
//   );
// }
