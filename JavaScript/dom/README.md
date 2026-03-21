# JavaScript DOM（文档对象模型）

DOM（Document Object Model）是 HTML 和 XML 文档的编程接口，它将文档表示为节点树，允许程序动态访问和修改文档的内容、结构和样式。

## DOM 基础

### 节点类型

- `Document` - 文档节点
- `Element` - 元素节点
- `Text` - 文本节点
- `Attribute` - 属性节点
- `Comment` - 注释节点
- `DocumentFragment` - 文档片段

### 节点树结构

```html
<html>
  <head>
    <title>示例</title>
  </head>
  <body>
    <h1>标题</h1>
    <p>段落</p>
  </body>
</html>
```

## 获取元素

### 通过 ID 获取

```javascript
const element = document.getElementById('id');
```

### 通过类名获取

```javascript
const elements = document.getElementsByClassName('class-name');
```

### 通过标签名获取

```javascript
const elements = document.getElementsByTagName('tag-name');
```

### 通过选择器获取

```javascript
const element = document.querySelector('.class-name');
const elements = document.querySelectorAll('.class-name');
```

### 其他获取方式

```javascript
document.documentElement // <html>
document.head // <head>
document.body // <body>
```

## 遍历 DOM

### 父节点

```javascript
element.parentNode
element.parentElement
```

### 子节点

```javascript
element.childNodes // 所有子节点（包含文本和注释）
element.children // 所有元素子节点
element.firstChild // 第一个子节点
element.firstElementChild // 第一个元素子节点
element.lastChild // 最后一个子节点
element.lastElementChild // 最后一个元素子节点
```

### 兄弟节点

```javascript
element.nextSibling // 下一个兄弟节点
element.nextElementSibling // 下一个元素兄弟节点
element.previousSibling // 上一个兄弟节点
element.previousElementSibling // 上一个元素兄弟节点
```

## 创建元素

### 创建元素

```javascript
const element = document.createElement('div');
```

### 创建文本节点

```javascript
const text = document.createTextNode('文本内容');
```

### 创建文档片段

```javascript
const fragment = document.createDocumentFragment();
```

### 创建注释

```javascript
const comment = document.createComment('这是注释');
```

## 修改 DOM

### 添加子元素

```javascript
parent.appendChild(child);
parent.insertBefore(newElement, referenceElement);
```

### 替换元素

```javascript
parent.replaceChild(newElement, oldElement);
```

### 删除元素

```javascript
parent.removeChild(child);
element.remove();
```

### 克隆元素

```javascript
const clone = element.cloneNode(true); // 深克隆，包含子元素
const shallowClone = element.cloneNode(false); // 浅克隆，不包含子元素
```

## 属性操作

### 获取属性

```javascript
element.getAttribute('attribute-name');
element.attributeName; // 对于标准属性
```

### 设置属性

```javascript
element.setAttribute('attribute-name', 'value');
element.attributeName = 'value'; // 对于标准属性
```

### 检查属性

```javascript
element.hasAttribute('attribute-name');
```

### 删除属性

```javascript
element.removeAttribute('attribute-name');
```

### data-* 属性

```javascript
element.dataset.key = 'value';
element.dataset.key; // 获取值
```

## 样式操作

### 内联样式

```javascript
element.style.color = 'red';
element.style.fontSize = '16px';
element.style.backgroundColor = '#fff';
```

### 类名操作

```javascript
element.className = 'class1 class2';
element.classList.add('class3');
element.classList.remove('class1');
element.classList.toggle('class2');
element.classList.contains('class3');
```

### 获取计算样式

```javascript
const styles = window.getComputedStyle(element);
styles.color;
styles.fontSize;
```

## 内容操作

### innerHTML

```javascript
element.innerHTML = '<p>新内容</p>';
element.innerHTML; // 获取内容
```

### textContent

```javascript
element.textContent = '纯文本内容';
element.textContent; // 获取纯文本
```

### innerText

```javascript
element.innerText = '可见文本';
element.innerText; // 获取可见文本
```

## 事件处理

### 事件监听

```javascript
element.addEventListener('click', handler);
element.addEventListener('click', handler, { once: true });
element.addEventListener('click', handler, { capture: true });
```

### 移除监听

```javascript
element.removeEventListener('click', handler);
```

### 事件对象

```javascript
function handler(event) {
  event.target; // 事件目标
  event.currentTarget; // 当前元素
  event.preventDefault(); // 阻止默认行为
  event.stopPropagation(); // 阻止冒泡
  event.stopImmediatePropagation(); // 阻止冒泡并停止后续监听
}
```

### 常见事件

- `click` - 点击
- `dblclick` - 双击
- `mousedown` / `mouseup` - 鼠标按下/抬起
- `mousemove` - 鼠标移动
- `mouseenter` / `mouseleave` - 鼠标进入/离开（不冒泡）
- `mouseover` / `mouseout` - 鼠标悬停/移出（冒泡）
- `keydown` / `keyup` - 键盘按下/抬起
- `keypress` - 按键（已废弃）
- `focus` / `blur` - 获得/失去焦点
- `submit` - 表单提交
- `change` - 输入改变
- `input` - 输入时触发
- `scroll` - 滚动
- `resize` - 窗口大小改变
- `load` - 加载完成

## 事件委托

利用事件冒泡，在父元素上监听子元素的事件。

```javascript
parent.addEventListener('click', (e) => {
  if (e.target.matches('.child')) {
    // 处理子元素点击
  }
});
```

## 位置和尺寸

### 元素尺寸

```javascript
element.offsetWidth // 包含边框
element.offsetHeight // 包含边框
element.clientWidth // 不包含边框
element.clientHeight // 不包含边框
element.scrollWidth // 滚动宽度
element.scrollHeight // 滚动高度
```

### 元素位置

```javascript
element.offsetLeft // 相对于 offsetParent 的左偏移
element.offsetTop // 相对于 offsetParent 的上偏移
element.getBoundingClientRect() // 获取相对于视口的位置
```

### 滚动位置

```javascript
element.scrollTop // 垂直滚动位置
element.scrollLeft // 水平滚动位置
window.scrollX // 页面水平滚动
window.scrollY // 页面垂直滚动
```

### 滚动方法

```javascript
element.scrollTo(0, 100);
element.scrollBy(0, 50);
element.scrollIntoView();
element.scrollIntoView({ behavior: 'smooth' });
```

## 表单操作

### 获取表单元素

```javascript
const form = document.forms[0];
const input = form.elements['input-name'];
```

### 获取和设置值

```javascript
input.value;
input.value = '新值';
input.checked; // 复选框和单选框
input.selected; // 下拉选项
```

### 表单验证

```javascript
input.validity.valid;
input.checkValidity();
input.setCustomValidity('错误信息');
```

## 性能优化

### 文档片段

使用 `DocumentFragment` 减少重排和重绘。

```javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
parent.appendChild(fragment);
```

### 虚拟 DOM

使用虚拟 DOM 库（如 React、Vue）优化更新。

### 防抖和节流

减少事件触发频率。

```javascript
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

## 浏览器兼容性

### 特性检测

```javascript
if ('querySelector' in document) {
  // 支持
} else {
  // 不支持
}
```

### 前缀

处理浏览器前缀。

```javascript
const element = document.createElement('div');
const transform = 'transform' in element.style 
  ? 'transform' 
  : 'webkitTransform';
```

## 学习建议

1. 理解 DOM 树结构
2. 掌握常用的选择器 API
3. 熟练使用事件处理
4. 了解性能优化技巧
5. 注意浏览器兼容性
6. 多做实际练习
