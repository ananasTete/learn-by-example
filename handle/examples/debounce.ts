/**
 * 防抖：在延迟执行时间内再次触发时重新计时
 *
 * 1. 接受一个函数和一个毫秒数，返回一个函数
 * 2. 声明一个变量保存 Timer, 在返回的函数里判断 Timer 是否存在，如果存在则清除，然后设置新的 Timer
 * 3. fn.apply(this, ...args) 保证 this 指向正确
 */

/**
 * JS 版本
 * function debounce(fn, delay) {
 *   let timer = null;
 * 
 *   return function () {
 *     clearTimeout(timer);
 *     timer = setTimeout(fn, delay);
 *   };
 * }
 */

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: NodeJS.Timeout | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const debounceFn = debounce((a: number, b: number) => {
  console.log(a, b);
}, 1000);

debounceFn(1, 2);
debounceFn(3, 4);
debounceFn(5, 6);
debounceFn(7, 8);
debounceFn(9, 10);
debounceFn(11, 12);
debounceFn(13, 14);

