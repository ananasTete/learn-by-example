## 认识元素拖拽

1. 用户可使用鼠标选择可拖拽（draggable）元素，将元素拖拽到可放置（droppable）元素，并释放鼠标按钮以放置这些元素。

2. 拖拽操作期间，会有一个可拖拽元素的半透明快照跟随着鼠标指针。

3. 默认的可拖拽元素是图像、链接、选中的文本。其他元素默认是不可拖拽的。需要使用 `draggable="true"` 属性来设置元素可拖拽。

4. 在可放置元素并不能直接获取拖拽元素的引用，但可以设置拖拽数据，并在可放置元素中国获取并根据它渲染。
4.1 所有的拖拽事件的事件对象都有一个 `dataTransfer` 对象，用来设置和获取拖拽数据。
4.2 当一个图像或链接被拖拽时，图像或链接的 URL 被自动设定为拖拽数据。选中文本的文本内容自动设定为拖拽数据。

## 可拖拽元素和可放置元素怎么用

### 对于非默认的可拖拽元素

1. 设置 `draggable="true"` 属性
2. 设置 `ondragstart` 事件处理函数，用于设置拖拽数据（常用）、拖拽过程中图像及其偏移量。
2.1 ondragstart 事件可以冒泡，所以可以在祖先元素使用。
3. 设置 `ondragend` 事件处理函数，用于在拖拽结束时执行一些操作。拖拽成功和失败都会触发。

设置常用拖拽类型及其数据：

```js
e.dataTransfer.setData("text/plain", "Text to drag"); // 设置文本类型，注意选中文本默认对此进行了设置，不用自己设置

e.dataTransfer.setData("text/uri-list", "https://www.baidu.com"); // 设置URL类型，链接元素默认进行了此设置
```

1. 数据类型为 MIME 类型或者自定义类型，如 `application/x-any` 等
2. 可以设置多个格式的拖拽数据，重复设置某个类型的会覆盖。
3. 实践：文本类型可以有很多种用法：可以设置元素的ID，以获取元素的引用；或者设置序列化的数据对象，根据对象来渲染拖拽结果。

设置图像及其偏移量：
```js
e.dataTransfer.setDragImage(element, x, y); // 设置拖拽过程中图像及其偏移量, element 为某元素的引用，可以使用 e.target 设置自身然后仅设置偏移量
```

### 可放置元素
1. 必须在 ondragenter 和 ondragover 事件中调用 `event.preventDefault()` 来阻止默认行为才能成为可放置元素。
2. 可放置元素可以监听 ondragenter \ ondragover \ ondragleave \ ondrop 事件。ondrop 事件只有在放置成功才会触发。
3. 这些事件处理程序的事件对象都可以通过 event.dataTransfer 对象来获取拖拽数据。
4. 最重要的是，必须在 ondrop 事件中手动渲染拖拽结果，并不会自动吧可拖拽对象移动到这里。

拓展：在 ondragenter 或者 ondragover 事件中根据拖拽数据类型来决定是否允许放置。
```js
function contains(list, value) {
  for (var i = 0; i < list.length; ++i) {
    if (list[i] === value) return true;
  }
  return false;
}

// 使用 event.dataTransfer.types 来获取拖拽数据类型。
function doDragOver(event) {
  var isLink = contains(event.dataTransfer.types, "text/uri-list");
  if (isLink) {
    event.preventDefault();
  }
}
```

## event.dataTransfer

`event.dataTransfer.setData("text/plain", "Text to drag");` 设置拖拽数据，表示数据类型和值。

`event.dataTransfer.getData("text/plain");` 获取拖拽数据，表示数据类型和值。

`event.dataTransfer.clearData();` 清除拖拽数据。

`event.dataTransfer.setDragImage(element, x, y);` 设置拖拽过程中图像及其偏移量。

`event.dataTransfer.types` 获取拖拽数据类型。





