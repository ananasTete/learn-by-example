import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 存储正在进行的请求
const pendingRequests = new Map<string, AbortController>();

// 生成请求唯一标识
const generateRequestKey = (config: InternalAxiosRequestConfig) => {
  return `${config.method}-${config.url}-${JSON.stringify(config.params)}`;
};

// 设置取消请求信号
const setCancelSignal = (config: InternalAxiosRequestConfig) => {
  const key = generateRequestKey(config);
  // 判断是否存在请求
  if (pendingRequests.has(key)) {
    // 取消请求并删除
    pendingRequests.get(key)?.abort();
    pendingRequests.delete(key);
  }
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequests.set(key, controller);
};

// 请求完成移除
const removePendingRequest = (config: InternalAxiosRequestConfig) => {
  const key = generateRequestKey(config);
  pendingRequests.delete(key);
};

// ------------------------------------------------------------

const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 1000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 设置取消请求信号
    setCancelSignal(config);
    return config;
  },
  (error: any) => {
    // 请求失败移除
    if (error.config) {
      removePendingRequest(error.config);
    }
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求完成移除
    removePendingRequest(response.config);
    return response.data;
  },
  (error: any) => {
    // 请求失败移除
    if (axios.isCancel(error)) {
      return Promise.reject(new Error('重复请求被取消'));
    } else {
      if (error.config) {
        removePendingRequest(error.config);
      }
    }
    return Promise.reject(error);
  },
);

/**
 * 取消重复请求
 *
 * 是什么？如果一个请求没有完成，再次发送相同的请求，会取消前一个请求。
 *
 * 有啥用？为了避免短时间内发送多个相同的请求。
 *
 * 实现要求？
 * 1. 辨别请求是否相同：通过请求的 url 和 请求参数来作为唯一标识
 * 2. 如何取消一个请求？使用 AbortController 创建一个实例，设置 config.signal = controller.signal。之后调用 controller.abort() 即可取消请求。
 * 3. 如何在当前请求中，调用上一次请求的 controller.abort()？创建一个 Map 来存储请求的 controller 实例，key 为请求的唯一标识。
 * 4. 取消请求会抛出一个被响应拦截器捕获的错误，如何与其他错误区分处理？使用 axios.isCancel(error) 判断是否为取消的请求，并进行处理。
 * 5. 注意在请求完成后删除请求的缓存。
 */
