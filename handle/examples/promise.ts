// Promise 的三种状态
enum PromiseState {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

// Promise 处理函数的类型定义
type Executor = (resolve: (value: any) => void, reject: (reason: any) => void) => void;

// 回调函数类型定义
type OnFulfilled = (value: any) => any;
type OnRejected = (reason: any) => any;

class MyPromise {
  private state: PromiseState = PromiseState.PENDING; // Promise 当前状态
  private value: any = null; // Promise 的值
  private reason: any = null; // Promise 被拒绝的原因
  private onFulfilledCallbacks: Function[] = []; // 成功回调函数队列
  private onRejectedCallbacks: Function[] = []; // 失败回调函数队列

  constructor(executor: Executor) {
    try {
      // 执行器函数立即执行
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      // 如果执行器抛出错误，直接reject
      this.reject(error);
    }
  }

  // resolve方法
  private resolve(value: any): void {
    // 确保状态只能改变一次
    if (this.state === PromiseState.PENDING) {
      this.state = PromiseState.FULFILLED;
      this.value = value;
      // 执行所有成功回调
      this.onFulfilledCallbacks.forEach((callback) => callback());
    }
  }

  // reject方法
  private reject(reason: any): void {
    // 确保状态只能改变一次
    if (this.state === PromiseState.PENDING) {
      this.state = PromiseState.REJECTED;
      this.reason = reason;
      // 执行所有失败回调
      this.onRejectedCallbacks.forEach((callback) => callback());
    }
  }

  // then方法
  then(onFulfilled?: OnFulfilled, onRejected?: OnRejected): MyPromise {
    // 处理参数可选的情况
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value: any) => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason: any) => {
            throw reason;
          };

    // 返回新的Promise以实现链式调用
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled!(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected!(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      // 根据当前状态进行处理
      if (this.state === PromiseState.FULFILLED) {
        fulfilledMicrotask();
      } else if (this.state === PromiseState.REJECTED) {
        rejectedMicrotask();
      } else {
        // PENDING状态时，将回调存入队列
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    });

    return promise2;
  }

  // 处理Promise解析过程
  private resolvePromise(promise2: MyPromise, x: any, resolve: Function, reject: Function): void {
    // 防止循环引用
    if (promise2 === x) {
      reject(new TypeError('Chaining cycle detected for promise'));
      return;
    }

    let called = false;

    if (x instanceof MyPromise) {
      // 如果x是Promise实例，等待其状态改变
      x.then(
        (value) => {
          this.resolvePromise(promise2, value, resolve, reject);
        },
        (reason) => {
          reject(reason);
        },
      );
    } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      // 如果x是对象或函数
      try {
        const then = x.then;
        if (typeof then === 'function') {
          then.call(
            x,
            (value: any) => {
              if (called) return;
              called = true;
              this.resolvePromise(promise2, value, resolve, reject);
            },
            (reason: any) => {
              if (called) return;
              called = true;
              reject(reason);
            },
          );
        } else {
          resolve(x);
        }
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      // 如果x是普通值，直接resolve
      resolve(x);
    }
  }

  // 实现catch方法
  catch(onRejected: OnRejected): MyPromise {
    return this.then(undefined, onRejected);
  }

  // 实现finally方法
  finally(callback: () => void): MyPromise {
    return this.then(
      (value: any) => MyPromise.resolve(callback()).then(() => value),
      (reason: any) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason;
        }),
    );
  }

  // 静态resolve方法
  static resolve(value: any): MyPromise {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => resolve(value));
  }

  // 静态reject方法
  static reject(reason: any): MyPromise {
    return new MyPromise((_, reject) => reject(reason));
  }

  // 静态all方法
  static all(promises: any[]): MyPromise {
    return new MyPromise((resolve, reject) => {
      const results: any[] = [];
      let count = 0;

      if (promises.length === 0) {
        resolve(results);
        return;
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          (value) => {
            results[index] = value;
            count++;
            if (count === promises.length) {
              resolve(results);
            }
          },
          (reason) => {
            reject(reason);
          },
        );
      });
    });
  }

  // 静态race方法
  static race(promises: any[]): MyPromise {
    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) return;
      promises.forEach((promise) => {
        MyPromise.resolve(promise).then(resolve, reject);
      });
    });
  }
}

export default MyPromise;

/**
 * 1. 声明变量保存状态，通过执行器函数来改变状态，并确保状态只能从 PENFDING 转为其它并且不能再改变
 *
 * 要点1: 在 constructor 中立即执行执行器函数，执行出错则立即转为 REJECTED 状态。
 * 要点2: 在 resolve/reject 函数中确保状态只能转换一次
 * 要点3: 因为 resolve/reject 函数要在外部调用，并且要访问内部的 state，所以要绑定 this 为当前实例
 */

/**
 * 为什么 onFulfilledCallbacks 要定义为一个数组呢？
 *
 * 因为可以多次调用 then
 * p.then(value => console.log('第一次then:', value));
 * p.then(value => console.log('第二次then:', value));
 * p.then(value => console.log('第三次then:', value));
 */

/**
 * queueMicrotask 的作用是什么？
 *
 * queueMicrotask 是一个全局函数，它的主要作用是将一个任务加入到微任务队列中。
 */
