import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

type RetryConfig = {
  retryCount: number;
  retry: number;
  retryDelay: number;
  shouldRetry: (error: any) => boolean;
};

const defaultRetryConfig: RetryConfig = {
  retryCount: 3,
  retry: 0,
  retryDelay: 1000,
  shouldRetry: (error) => {
    const codes = [500, 502, 503, 504, 'ECONNABORTED', 'ETIMEDOUT'];
    const status = error.response?.status;
    return codes.includes(error.code) || (status && codes.includes(status));
  },
};

const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 1000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error) => {
    const config = error.config;
    const retryConfig = Object.assign({}, defaultRetryConfig, config?.retryConfig);

    if (!config || !retryConfig.shouldRetry(error)) {
      return Promise.reject(error);
    }

    if (retryConfig.retry === retryConfig.retryCount) {
      return Promise.reject(error);
    }

    retryConfig.retry++;

    await new Promise((resolve) => {
      setTimeout(resolve, retryConfig.retryDelay * Math.pow(2, retryConfig.retry));
    });

    return instance(config);
  },
);

/**
 * 请求错误重试
 *
 * 描述：
 * 1. 当请求失败时，会自动重试请求
 * 2. 可配置重试次数，每个请求可配置，没配置就用默认
 * 3. 每次重试使用不同的间隔
 * 4. 设置重试条件，不是每个请求都要重试
 *
 * 实现：
 * 1. 在响应拦截器中 return instance(config) 来发起重新请求
 * 2. 每次错误时要在响应拦截器里判断是否还有重试次数，所以不能将重试次数保存在拦截器里。为了兼顾每个请求可配置，
 *    所以将重试次数配置在 config 中。
 * 3. 使用 setTimeout 设置间隔，使用 await Promise() 阻塞。重试间隔使用指数退避算法，每次重试时间是上次的 2 倍。
 * 4. 设置重试条件，可以在 config 中配置 shouldRetry，接收一个函数，函数返回 true 时重试。
 */
