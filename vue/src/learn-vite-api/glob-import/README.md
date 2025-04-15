`import.meta.glob` 用于批量导入项目文件（或者说模块）。适合对本地文件批量处理的场景。

## 对于大量项目文件的按需使用，可以使用懒加载模式。

vite 会对每个文件分包，访问时才会请求，以此优化首屏加载。

```ts
// 批量导入图片
const imagesModules = import.meta.glob('../assets/images/chart/**'); // 默认就是懒加载

// 返回一个对象，Record<string, () => Promise<{ default: string }>>
// 返回的 key 是图片对于当前目录的相对路径，value 是一个异步请求图片的函数， value.default 是图片对于根目录的相对路径

export const fetchImages = async (imageName: string) => {
  for (const key in imagesModules) {
    // 使用图片的名称匹配图片路径中的名称
    const urlSplit = key.split('/');
    if (urlSplit[urlSplit.length - 1] === imageName) {
      const module = await imagesModules[key](); // 异步请求图片
      return module.default;
    }
  }
};
```

注意！每个图片都会发起一个请求，如果使用的图片量较大，反而会影响性能。

## 对于大量项目文件的全部使用、立即使用，可以立即加载全部文件资源，不用懒加载。

```ts
const imagesModules = import.meta.glob('../assets/images/chart/**', {
  eager: true,
});

// 返回一个对象，Record<string, { default: string }>
// 返回的 key 是图片对于当前目录的相对路径，value.default 是图片对于根目录的相对路径

// 然后可以在 fetchImages 函数中动态查找匹配的图片
export const fetchImages = async (imageName: string) => {
  for (const key in imagesModules) {
    const urlSplit = key.split('/');
    if (urlSplit[urlSplit.length - 1] === imageName) {
      return imagesModules[key]?.default;
    }
  }
};
```

## 具体场景

1. 一个拖拽可视化大屏项目，需要使用大量本地图片用于组件库的展示和拖拽。在每一个配置对象中配置一个 image 字段，值为图片的名称。
就可以使用 `import.meta.glob` 批量导入图片资源，然后根据图片的名称动态查找匹配的图片。因为每个组件图片都会用到，并且数量较多，所以使用立即加载全部图片资源，不用懒加载。

2. 插件系统，根据需要动态导入插件，且单次使用时不需要加载很多，所以使用懒加载。

```ts
// 动态加载插件
const plugins = import.meta.glob('./plugins/*.ts')

// 按需加载插件
async function loadPlugin(pluginName: string) {
  const modules = Object.entries(plugins)
  const targetPlugin = modules.find(([path]) => path.includes(pluginName))
  if (targetPlugin) {
    const module = await targetPlugin[1]()
    return module.default
  }
}
```

3. 主题系统

```ts
// 加载所有主题配置
const themes = import.meta.glob('./themes/*.css', {
  eager: true
})

// 切换主题
function changeTheme(themeName: string) {
  const theme = Object.entries(themes).find(([path]) => 
    path.includes(themeName)
  )
  if (theme) {
    applyTheme(theme[1].default)
  }
}
```

4. 自动注册 pinia 模块，全部立即使用。

```ts
// 自动导入所有 store 模块
const storeModules = import.meta.glob('./stores/**/*.ts', {
  eager: true
})

// 注册到 store 中
Object.entries(storeModules).forEach(([path, module]) => {
  const storeName = path.match(/\.\/stores\/(.*)\.ts/)[1]
  store.registerModule(storeName, module.default)
})
```

5. 自动注册全局组件。

```ts
// 全局组件自动注册
const components = import.meta.glob('./components/**/*.vue', {
  eager: true
})

export default {
  install(app) {
    Object.entries(components).forEach(([path, module]) => {
      // 获取组件名
      const componentName = path.split('/').pop().replace('.vue', '')
      // 注册组件
      app.component(componentName, module.default)
    })
  }
}
```

## 路径的匹配也是有语法的

```ts
'../assets/i18n/*/*.{png,jpg}'
```

详情参考文档。

## 不适合使用 `import.meta.glob` 的场景

少量且固定的文件使用，比如一个页面上用了几个图标，几个配图。没必要批量加载。