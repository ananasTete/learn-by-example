/**
 * 节流：一段时间内多次触发只执行第一次
 *
 * 1. 接受一个函数和一个毫秒数，返回一个函数
 * 2. 声明一个变量保存上次调用时间，在返回的函数里判断当前时间与上次调用时间的差值是否大于等于毫秒数，如果大于则执行函数，并更新上次调用时间
 * 3. fn.apply(this, ...args) 保证 this 指向正确
 *
 * 为什么要使用 fn.apply? 而不是直接执行 fn?
 * 因为 fn 可能是一个对象的方法，使用 fn.apply 可以保证 this 指向正确
 * 如果直接执行 fn，this 会指向 window
 */

/**
 * JS 版本，易于理解
 *
 * function throttleJS(fn, delay) {
 *   let lastTime = 0;
 *
 *   return function (...args) {
 *     const now = Date.now();
 *
 *     if (now - lastTime >= delay) {
 *       fn.apply(this, args);
 *       lastTime = now;
 *     }
 *   };
 * }
 */

/**
 *
 * TS 版本，因为返回的函数的参数等同于 fn 的参数，所以重点在于通过函数的类型获取其 this 和 args 的类型赋给返回的函数。
 */

function throttle<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let lastTime = 0;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

const fn = throttle((a: number, b: number) => {
  console.log(a, b);
}, 1000);

fn(1, 2);
fn(3, 4);


/**
 * 防抖和节流都是闭包，因为它们都依赖于外部的变量 lastTime 和 timer
 *
 * 闭包：函数 A 返回一个函数 B，函数 B 中引用了函数 A 的变量。
 *
 * 由此推测，闭包的应用场景就是在对一个函数的多次调用中共享变量，他们访问到的是同一个变量。
 */
