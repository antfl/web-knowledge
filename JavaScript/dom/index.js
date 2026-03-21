// JavaScript DOM（文档对象模型）示例
// 注意：DOM 是浏览器环境特有的，需要在浏览器中运行

console.log('========== DOM ==========\n');

console.log('========== 1. DOM 基础 ==========');

// 节点类型枚举
const nodeTypes = {
  1: 'Element',
  2: 'Attribute',
  3: 'Text',
  8: 'Comment',
  9: 'Document',
  11: 'DocumentFragment'
};

console.log('节点类型:', nodeTypes);

console.log('\n========== 2. 获取元素 ==========');

// 注意：以下代码需要在浏览器环境中运行
if (typeof document !== 'undefined') {
  // 通过 ID 获取
  // const elementById = document.getElementById('example');
  
  // 通过类名获取
  // const elementsByClass = document.getElementsByClassName('example');
  
  // 通过标签名获取
  // const elementsByTag = document.getElementsByTagName('div');
  
  // 通过选择器获取
  // const element = document.querySelector('.example');
  // const elements = document.querySelectorAll('.example');
  
  console.log('DOM 获取元素方法示例（需要在浏览器中运行）');
  console.log('- getElementById(id)');
  console.log('- getElementsByClassName(class)');
  console.log('- getElementsByTagName(tag)');
  console.log('- querySelector(selector)');
  console.log('- querySelectorAll(selector)');
} else {
  console.log('Node.js 环境：document 对象不存在');
}

console.log('\n========== 3. 遍历 DOM ==========');

// 创建模拟 DOM 结构
function createMockElement(tagName, children = []) {
  return {
    tagName,
    children,
    parentNode: null,
    nextSibling: null,
    previousSibling: null,
    firstChild: children[0] || null,
    lastChild: children[children.length - 1] || null
  };
}

// 创建模拟 DOM 树
const mockDiv1 = createMockElement('div1');
const mockDiv2 = createMockElement('div2');
const mockDiv3 = createMockElement('div3');
const mockParent = createMockElement('parent', [mockDiv1, mockDiv2, mockDiv3]);

// 设置父子关系和兄弟关系
mockDiv1.parentNode = mockParent;
mockDiv2.parentNode = mockParent;
mockDiv3.parentNode = mockParent;

mockDiv1.nextSibling = mockDiv2;
mockDiv2.previousSibling = mockDiv1;
mockDiv2.nextSibling = mockDiv3;
mockDiv3.previousSibling = mockDiv2;

console.log('模拟 DOM 树结构:');
console.log('Parent children:', mockParent.children.map(c => c.tagName));
console.log('div1 next sibling:', mockDiv1.nextSibling?.tagName);
console.log('div2 previous sibling:', mockDiv2.previousSibling?.tagName);
console.log('parent first child:', mockParent.firstChild?.tagName);
console.log('parent last child:', mockParent.lastChild?.tagName);

console.log('\n========== 4. 创建元素 ==========');

console.log('创建元素方法:');
console.log('- document.createElement(tag) - 创建元素');
console.log('- document.createTextNode(text) - 创建文本节点');
console.log('- document.createDocumentFragment() - 创建文档片段');
console.log('- document.createComment(text) - 创建注释');

console.log('\n========== 5. 修改 DOM ==========');

console.log('修改 DOM 方法:');
console.log('- parent.appendChild(child) - 添加子元素');
console.log('- parent.insertBefore(new, ref) - 在参考元素前插入');
console.log('- parent.replaceChild(new, old) - 替换元素');
console.log('- parent.removeChild(child) - 删除子元素');
console.log('- element.remove() - 删除自身');
console.log('- element.cloneNode(true) - 深克隆');
console.log('- element.cloneNode(false) - 浅克隆');

console.log('\n========== 6. 属性操作 ==========');

console.log('属性操作方法:');
console.log('- element.getAttribute(name) - 获取属性');
console.log('- element.setAttribute(name, value) - 设置属性');
console.log('- element.hasAttribute(name) - 检查属性');
console.log('- element.removeAttribute(name) - 删除属性');
console.log('- element.dataset.key - data-* 属性');

// data-* 属性示例
const mockElement = {
  dataset: {}
};

mockElement.dataset.userId = '123';
mockElement.dataset.userName = '张三';
console.log('data-* 属性示例:');
console.log('mockElement.dataset:', mockElement.dataset);
console.log('mockElement.dataset.userId:', mockElement.dataset.userId);

console.log('\n========== 7. 样式操作 ==========');

console.log('样式操作方法:');
console.log('- element.style.property - 内联样式');
console.log('- element.className - 类名');
console.log('- element.classList.add() - 添加类');
console.log('- element.classList.remove() - 移除类');
console.log('- element.classList.toggle() - 切换类');
console.log('- element.classList.contains() - 检查类');
console.log('- window.getComputedStyle(element) - 获取计算样式');

// classList 模拟
class MockClassList {
  constructor() {
    this.classes = new Set();
  }
  
  add(className) {
    this.classes.add(className);
    console.log(`添加类: ${className}`);
  }
  
  remove(className) {
    this.classes.delete(className);
    console.log(`移除类: ${className}`);
  }
  
  toggle(className) {
    if (this.classes.has(className)) {
      this.classes.delete(className);
      console.log(`切换类: ${className} (移除)`);
    } else {
      this.classes.add(className);
      console.log(`切换类: ${className} (添加)`);
    }
  }
  
  contains(className) {
    return this.classes.has(className);
  }
}

const classList = new MockClassList();
classList.add('active');
classList.add('highlight');
console.log('包含 active:', classList.contains('active'));
classList.toggle('active');
console.log('包含 active:', classList.contains('active'));

console.log('\n========== 8. 内容操作 ==========');

console.log('内容操作方法:');
console.log('- element.innerHTML - HTML 内容');
console.log('- element.textContent - 纯文本内容');
console.log('- element.innerText - 可见文本');

console.log('\n========== 9. 事件处理 ==========');

// 模拟事件系统
class MockEvent {
  constructor(type, target) {
    this.type = type;
    this.target = target;
    this.currentTarget = target;
    this.preventDefaultCalled = false;
    this.stopPropagationCalled = false;
  }
  
  preventDefault() {
    this.preventDefaultCalled = true;
    console.log('阻止默认行为');
  }
  
  stopPropagation() {
    this.stopPropagationCalled = true;
    console.log('阻止冒泡');
  }
}

class MockElement {
  constructor() {
    this.listeners = {};
  }
  
  addEventListener(type, handler) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(handler);
    console.log(`添加事件监听: ${type}`);
  }
  
  removeEventListener(type, handler) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(h => h !== handler);
    }
    console.log(`移除事件监听: ${type}`);
  }
  
  dispatchEvent(event) {
    if (this.listeners[event.type]) {
      this.listeners[event.type].forEach(handler => handler(event));
    }
  }
}

const button = new MockElement();
const clickHandler = (e) => {
  console.log('点击事件触发');
  console.log('事件目标:', e.target);
  e.preventDefault();
  e.stopPropagation();
};

button.addEventListener('click', clickHandler);
button.dispatchEvent(new MockEvent('click', button));
button.removeEventListener('click', clickHandler);

console.log('\n常见事件:');
const commonEvents = [
  'click - 点击',
  'dblclick - 双击',
  'mousedown/mouseup - 鼠标按下/抬起',
  'mousemove - 鼠标移动',
  'mouseenter/mouseleave - 鼠标进入/离开',
  'keydown/keyup - 键盘按下/抬起',
  'focus/blur - 获得/失去焦点',
  'submit - 表单提交',
  'change - 输入改变',
  'input - 输入时触发',
  'scroll - 滚动',
  'resize - 窗口大小改变',
  'load - 加载完成'
];

commonEvents.forEach(event => console.log('-', event));

console.log('\n========== 10. 事件委托 ==========');

console.log('事件委托: 利用事件冒泡，在父元素上监听子元素的事件');
console.log('示例代码:');
console.log(`
parent.addEventListener('click', (e) => {
  if (e.target.matches('.child')) {
    console.log('子元素被点击');
  }
});
`);

console.log('\n========== 11. 位置和尺寸 ==========');

console.log('元素尺寸:');
console.log('- element.offsetWidth/offsetHeight - 包含边框');
console.log('- element.clientWidth/clientHeight - 不包含边框');
console.log('- element.scrollWidth/scrollHeight - 滚动尺寸');

console.log('\n元素位置:');
console.log('- element.offsetLeft/offsetTop - 相对于 offsetParent');
console.log('- element.getBoundingClientRect() - 相对于视口');

console.log('\n滚动位置:');
console.log('- element.scrollTop/scrollLeft - 元素滚动');
console.log('- window.scrollX/scrollY - 页面滚动');

console.log('\n滚动方法:');
console.log('- element.scrollTo(x, y) - 滚动到指定位置');
console.log('- element.scrollBy(x, y) - 相对滚动');
console.log('- element.scrollIntoView() - 滚动到视口');

console.log('\n========== 12. 表单操作 ==========');

console.log('表单操作:');
console.log('- document.forms[index] - 获取表单');
console.log('- form.elements[name] - 获取表单元素');
console.log('- input.value - 获取/设置值');
console.log('- input.checked - 复选框/单选框');
console.log('- input.selected - 下拉选项');
console.log('- input.validity.valid - 验证');
console.log('- input.checkValidity() - 检查验证');

console.log('\n========== 13. 性能优化 ==========');

// 文档片段示例
console.log('文档片段 - 减少重排和重绘:');
console.log(`
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  div.textContent = i;
  fragment.appendChild(div);
}
parent.appendChild(fragment);
`);

// 防抖函数
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流函数
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

console.log('\n防抖函数:');
const debouncedLog = debounce(() => console.log('防抖执行'), 100);
console.log('创建防抖函数');

console.log('\n节流函数:');
const throttledLog = throttle(() => console.log('节流执行'), 100);
console.log('创建节流函数');

console.log('\n========== 14. 浏览器兼容性 ==========');

console.log('特性检测:');
console.log(`
if ('querySelector' in document) {
  console.log('支持 querySelector');
} else {
  console.log('不支持 querySelector');
}
`);

console.log('\n浏览器前缀:');
console.log(`
const element = document.createElement('div');
const transform = 'transform' in element.style 
  ? 'transform' 
  : 'webkitTransform';
`);

console.log('\n========== 总结 ==========');

console.log(`
DOM 核心要点：

1. DOM 基础：
   - Document、Element、Text、Comment 等节点类型
   - 节点树结构，父子兄弟关系

2. 获取元素：
   - getElementById：快速获取单个元素
   - querySelector/querySelectorAll：灵活的选择器

3. 遍历 DOM：
   - parentNode/parentElement：父节点
   - children/childNodes：子节点
   - nextSibling/previousSibling：兄弟节点

4. 修改 DOM：
   - createElement：创建元素
   - appendChild/insertBefore：添加元素
   - removeChild/remove：删除元素
   - cloneNode：克隆元素

5. 属性操作：
   - getAttribute/setAttribute：属性操作
   - dataset：data-* 属性

6. 样式操作：
   - style：内联样式
   - classList：类名操作
   - getComputedStyle：计算样式

7. 事件处理：
   - addEventListener/removeEventListener：事件监听
   - 事件对象：target、preventDefault、stopPropagation
   - 事件委托：利用冒泡优化性能

8. 位置和尺寸：
   - offsetWidth/clientWidth：元素尺寸
   - getBoundingClientRect：位置信息
   - scrollTop/scrollTo：滚动操作

9. 性能优化：
   - DocumentFragment：减少重排
   - 防抖/节流：优化事件
   - 事件委托：减少监听

10. 浏览器兼容性：
    - 特性检测
    - 浏览器前缀

掌握 DOM，是前端开发的核心技能！
`);
