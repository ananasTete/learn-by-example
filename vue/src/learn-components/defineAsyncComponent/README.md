异步组件就是组件级的懒加载。

```ts
const AsyncComp = defineAsyncComponent({
  // 通过 import() 函数告诉构建工具单独打包这个组件
  loader: () => import('./Foo.vue'),

  // loading 组件
  loadingComponent: LoadingComponent,

  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,

  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000,
});
```

什么时候用？

- 非首屏组件
  页面中不属于首屏渲染的部分，例如页面底部的推荐内容、弹窗、抽屉等。
  这些组件可以在用户滚动或触发特定事件时再加载，避免首屏加载时占用资源。
- 条件渲染的组件
  基于用户权限或状态才显示的组件，例如管理员面板、VIP专区等。
  只有在满足条件时才加载和渲染，避免不必要的资源消耗。
- 动态组件
  根据用户交互动态切换的组件，例如 Tab 页、步骤条等。
  只有在切换到具体 Tab 或步骤时才加载对应组件，减少初始加载负担。
- 不常用功能
  应用中不常用的功能组件，例如设置选项、帮助文档等。
  只有在用户访问时才加载，避免启动时加载不必要的代码。

优势

- 精细化控制：可以针对页面内的特定组件优化加载时机。
- 减少首屏负担：降低首屏 JavaScript 体积，提升渲染速度。
