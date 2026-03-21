# JavaScript BOM（浏览器对象模型）

BOM（Browser Object Model）是浏览器提供的与浏览器窗口交互的对象集合，独立于文档内容。

## window 对象

window 是 BOM 的核心对象，代表浏览器窗口，也是全局对象。

### 窗口属性

- `window.innerWidth` - 窗口内部宽度
- `window.innerHeight` - 窗口内部高度
- `window.outerWidth` - 窗口外部宽度
- `window.outerHeight` - 窗口外部高度
- `window.screenX` / `window.screenLeft` - 窗口相对于屏幕左侧的距离
- `window.screenY` / `window.screenTop` - 窗口相对于屏幕顶部的距离

### 窗口方法

- `window.alert()` - 警告框
- `window.confirm()` - 确认框
- `window.prompt()` - 输入框
- `window.open()` - 打开新窗口
- `window.close()` - 关闭窗口
- `window.moveTo()` - 移动窗口到指定位置
- `window.resizeTo()` - 调整窗口大小
- `window.scrollTo()` / `window.scrollBy()` - 滚动窗口
- `window.setTimeout()` - 延时执行
- `window.setInterval()` - 定时执行
- `window.clearTimeout()` - 清除延时
- `window.clearInterval()` - 清除定时器
- `window.requestAnimationFrame()` - 请求动画帧
- `window.cancelAnimationFrame()` - 取消动画帧

## location 对象

location 对象包含当前 URL 的信息。

### 属性

- `location.href` - 完整 URL
- `location.protocol` - 协议（http:、https:）
- `location.host` - 主机名和端口
- `location.hostname` - 主机名
- `location.port` - 端口号
- `location.pathname` - 路径
- `location.search` - 查询字符串
- `location.hash` - 锚点

### 方法

- `location.assign()` - 加载新文档
- `location.replace()` - 替换当前文档（不保留历史）
- `location.reload()` - 重新加载页面
- `location.toString()` - 返回完整 URL

## navigator 对象

navigator 对象包含浏览器的信息。

### 常用属性

- `navigator.userAgent` - 用户代理字符串
- `navigator.language` - 浏览器语言
- `navigator.languages` - 用户偏好的语言数组
- `navigator.onLine` - 是否在线
- `navigator.cookieEnabled` - 是否启用 Cookie
- `navigator.platform` - 操作系统平台
- `navigator.hardwareConcurrency` - 逻辑处理器数量
- `navigator.maxTouchPoints` - 最大触摸点数

### 现代 API

- `navigator.geolocation` - 地理位置 API
- `navigator.mediaDevices` - 媒体设备 API
- `navigator.clipboard` - 剪贴板 API
- `navigator.permissions` - 权限 API
- `navigator.serviceWorker` - Service Worker API
- `navigator.share()` - Web Share API
- `navigator.sendBeacon()` - 发送信标

## history 对象

history 对象包含浏览器会话历史。

### 属性

- `history.length` - 历史记录数量

### 方法

- `history.back()` - 后退
- `history.forward()` - 前进
- `history.go()` - 跳转到指定历史记录
- `history.pushState()` - 添加历史记录（不刷新）
- `history.replaceState()` - 替换当前历史记录（不刷新）

## screen 对象

screen 对象包含屏幕信息。

### 属性

- `screen.width` - 屏幕宽度
- `screen.height` - 屏幕高度
- `screen.availWidth` - 可用宽度
- `screen.availHeight` - 可用高度（减去任务栏）
- `screen.colorDepth` - 颜色深度
- `screen.pixelDepth` - 像素深度
- `screen.orientation` - 屏幕方向

## document 对象

虽然 document 属于 DOM，但它是 window 对象的属性。

- `window.document` 或直接使用 `document`

## 事件处理

### 窗口事件

- `load` - 页面加载完成
- `unload` - 页面卸载
- `beforeunload` - 页面卸载前
- `resize` - 窗口大小改变
- `scroll` - 页面滚动
- `focus` / `blur` - 获得/失去焦点
- `error` - 发生错误

### 在线/离线事件

- `online` - 网络连接
- `offline` - 网络断开

### 页面可见性

- `visibilitychange` - 页面可见性改变
- `document.hidden` - 页面是否隐藏
- `document.visibilityState` - 可见性状态

## 存储 API

### localStorage

- `localStorage.setItem(key, value)` - 设置数据
- `localStorage.getItem(key)` - 获取数据
- `localStorage.removeItem(key)` - 删除数据
- `localStorage.clear()` - 清空所有数据
- `localStorage.length` - 数据项数量
- `localStorage.key(index)` - 获取指定索引的键

### sessionStorage

- 与 localStorage API 相同
- 数据在会话结束时清除

## 弹窗相关

### alert

显示警告对话框，只有确定按钮。

### confirm

显示确认对话框，有确定和取消按钮，返回布尔值。

### prompt

显示输入对话框，有输入框、确定和取消按钮，返回输入值或 null。

## 实际应用

### 页面跳转

- 使用 `location.href` 或 `location.assign()`
- 使用 `location.replace()` 不保留历史记录
- 使用 `history.pushState()` 实现无刷新路由

### 获取 URL 参数

- 解析 `location.search` 获取查询参数
- 使用 URLSearchParams API

### 浏览器检测

- 通过 `navigator.userAgent` 识别浏览器
- 通过特性检测判断功能支持

### 响应式设计

- 监听 `resize` 事件
- 使用 `window.innerWidth` 判断视口大小
- 使用 `matchMedia()` 监听媒体查询

### 性能优化

- 使用 `requestAnimationFrame` 优化动画
- 使用 `setTimeout` 和 `setInterval` 控制执行时机
- 使用 `navigator.sendBeacon()` 发送埋点数据

## 学习建议

1. 理解 BOM 与 DOM 的区别
2. 掌握 window 对象的核心方法
3. 熟练使用 location 进行页面导航
4. 了解 navigator 的现代 API
5. 掌握 history API 实现前端路由
6. 合理使用存储 API
7. 注意浏览器兼容性问题
8. 结合实际场景练习
