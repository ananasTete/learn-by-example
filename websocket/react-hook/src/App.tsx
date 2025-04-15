import { useState, useEffect } from "react";
import { useLatest } from "ahooks";

function CounterWithStaleClosure() {
  const [count, setCount] = useState(0);

  // 这个函数是在每次渲染时创建的，它会捕获当前渲染周期的 'count' 值
  const logCurrentCount = () => {
    console.log('Count inside interval callback:', count);
  };

  const latestLogCount = useLatest(logCurrentCount);

  useEffect(() => {
    // 这个 effect 只在组件首次挂载时运行一次，因为依赖项数组为空 []
    console.log('Effect running. Setting up interval.');

    // setInterval 接收了首次渲染时创建的 logCurrentCount 函数
    // 这个函数在其闭包中捕获的 count 值是 0
    const intervalId = setInterval(() => {
      latestLogCount.current();
    }, 3000); // 每 3 秒打印一次

    // 组件卸载时清除定时器
    return () => {
      console.log('Cleaning up interval.');
      clearInterval(intervalId);
    };
  }, []); // <--- 空依赖数组，意味着 effect 和其闭包只创建一次

  const handleIncrement = () => {
    setCount(c => c + 1);
    // 即使在这里更新了 state，setInterval 中的 logCurrentCount
    // 仍然是旧的那个函数实例，它看到的 count 还是 0
  };

  return (
    <div>
      <h2>Stale Closure Example</h2>
      <p>Actual current count displayed in component: {count}</p>
      <button onClick={handleIncrement}>
        Increment Count
      </button>
      <p>
        Open your browser console. Click the button multiple times.
        Notice that the console log from the interval callback
        <b> still prints "Count inside interval callback: 0"</b> every 3 seconds,
        even though the count displayed on the page is increasing.
      </p>
    </div>
  );
}

function App() {

  return (
    <>
      <CounterWithStaleClosure />
    </>
  )
}

export default App
