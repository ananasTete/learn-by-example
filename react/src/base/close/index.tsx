import { useState, useEffect } from 'react';
import { useLatest } from 'ahooks';

function CounterWithStaleClosure() {
  const [count, setCount] = useState(0);

  const logCurrentCount = () => {
    console.log('Count inside interval callback:', count);
  };

  const latestLogCount = useLatest(logCurrentCount);

  useEffect(() => {
    const intervalId = setInterval(() => {
    //   logCurrentCount();
      latestLogCount.current();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleIncrement = () => {
    setCount((c) => c + 1);
  };

  return (
    <div>
      <h2>Stale Closure Example</h2>
      <p>Actual current count displayed in component: {count}</p>
      <button onClick={handleIncrement}>Increment Count</button>
    </div>
  );
}

export default CounterWithStaleClosure;


/**
 * 闭包陷阱：
 * 
 * 第一次渲染时，useEffect 的回调就是一个闭包。
 * 
 * 下一次渲染时， count 和 logCurrentCount 函数被重新创建，但 useEffect 不会重新注册。
 * 
 * 所以，logCurrentCount 函数在闭包中捕获的 count 值始终是 0。
 * 
 * 通过 useLatest, 可以确保 logCurrentCount 函数在闭包中捕获的 count 值始终是最新的。
 * 
 */