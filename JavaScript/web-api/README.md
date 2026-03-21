
# JavaScript Web API

Web API 是浏览器提供的一组接口，允许 JavaScript 与浏览器和操作系统进行交互。

## DOM API

### 元素选择和操作

```javascript
// 选择元素
const element = document.getElementById('id');
const elements = document.querySelectorAll('.class');

// 创建元素
const newDiv = document.createElement('div');

// 修改内容
element.textContent = 'Hello';
element.innerHTML = '<span>Hello</span>';

// 修改样式
element.style.color = 'red';
element.classList.add('active');
```

### 事件处理

```javascript
// 添加事件监听
element.addEventListener('click', (e) => {
  console.log('Clicked!', e.target);
});

// 事件委托
document.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    console.log('Button clicked!');
  }
});
```

## Fetch API

### 基本用法

```javascript
// GET 请求
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// POST 请求
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'John' })
});
```

### 错误处理

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => console.error('Error:', error));
```

## Storage API

### localStorage

```javascript
// 存储数据
localStorage.setItem('key', 'value');

// 读取数据
const value = localStorage.getItem('key');

// 删除数据
localStorage.removeItem('key');

// 清空所有数据
localStorage.clear();
```

### sessionStorage

```javascript
// 会话级存储，页面关闭后清除
sessionStorage.setItem('key', 'value');
```

## History API

```javascript
// 添加历史记录
history.pushState({ page: 1 }, 'Title', '/page1');

// 替换当前历史记录
history.replaceState({ page: 2 }, 'Title', '/page2');

// 监听历史变化
window.addEventListener('popstate', (e) => {
  console.log('State:', e.state);
});
```

## Geolocation API

```javascript
// 获取当前位置
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
  },
  (error) => {
    console.error('Error:', error.message);
  }
);

// 持续监听位置
const watchId = navigator.geolocation.watchPosition((position) => {
  console.log('Position updated');
});

// 停止监听
navigator.geolocation.clearWatch(watchId);
```

## Notification API

```javascript
// 请求通知权限
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    new Notification('Hello!', {
      body: 'This is a notification',
      icon: '/icon.png'
    });
  }
});
```

## Clipboard API

```javascript
// 复制到剪贴板
navigator.clipboard.writeText('Hello World')
  .then(() => console.log('Copied!'));

// 从剪贴板读取
navigator.clipboard.readText()
  .then(text => console.log('Pasted:', text));
```

## File API

```javascript
// 读取文件
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (event) => {
    console.log('File content:', event.target.result);
  };
  
  reader.readAsText(file);
});
```

## Drag and Drop API

```javascript
const dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  console.log('Dropped files:', files);
});
```

## Intersection Observer API

```javascript
// 监听元素可见性变化
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Element is visible');
    }
  });
}, { threshold: 0.5 });

observer.observe(document.getElementById('target'));
```

## Resize Observer API

```javascript
// 监听元素大小变化
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    console.log('Element size:', entry.contentRect);
  }
});

resizeObserver.observe(document.getElementById('element'));
```

## Mutation Observer API

```javascript
// 监听 DOM 变化
const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log('DOM changed:', mutation);
  });
});

mutationObserver.observe(document.body, {
  childList: true,
  subtree: true
});
```

## Web Workers API

```javascript
// 创建 Web Worker
const worker = new Worker('worker.js');

// 发送消息给 Worker
worker.postMessage({ data: 'Hello Worker' });

// 接收 Worker 消息
worker.onmessage = (e) => {
  console.log('From Worker:', e.data);
};

// 终止 Worker
worker.terminate();
```

## Service Worker API

```javascript
// 注册 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered');
    });
}
```

## WebSocket API

```javascript
// 创建 WebSocket 连接
const ws = new WebSocket('wss://example.com/socket');

ws.onopen = () => {
  console.log('Connected');
  ws.send('Hello Server');
};

ws.onmessage = (e) => {
  console.log('Received:', e.data);
};

ws.onclose = () => {
  console.log('Disconnected');
};
```

## Canvas API

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 绘制矩形
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 100);

// 绘制文本
ctx.fillStyle = 'black';
ctx.font = '20px Arial';
ctx.fillText('Hello', 50, 50);
```

## Web Audio API

```javascript
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 创建振荡器
const oscillator = audioContext.createOscillator();
oscillator.connect(audioContext.destination);
oscillator.start();
```

## 最佳实践

1. **检查 API 支持** - 使用特性检测确保浏览器支持
2. **错误处理** - 始终处理可能的错误情况
3. **性能考虑** - 合理使用 API，避免过度使用
4. **用户体验** - 请求权限时给用户明确的理由
5. **安全性** - 注意 API 的安全限制和最佳实践

## 学习建议

1. 熟悉常用的 DOM 操作和事件处理
2. 掌握 Fetch API 进行网络请求
3. 了解现代浏览器的新 API
4. 学习如何优雅地降级处理
5. 关注 Web 标准和浏览器兼容性
