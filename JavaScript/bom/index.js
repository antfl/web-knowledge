// JavaScript BOM（浏览器对象模型）示例
// 注意：BOM 是浏览器环境特有的，Node.js 中不存在 window 对象
// 以下代码需要在浏览器控制台或 HTML 文件中运行

// 模拟浏览器环境（仅在 Node.js 中演示）
const mockWindow = {
  innerWidth: 1920,
  innerHeight: 1080,
  outerWidth: 1920,
  outerHeight: 1080,
  document: {},
  scrollY: 0,
  devicePixelRatio: 1
};

// 在浏览器中使用真实的 window 对象
const win = typeof window !== 'undefined' ? window : mockWindow;

console.log('========== window 对象 ==========');

// 窗口属性
console.log('窗口内部宽度:', win.innerWidth);
console.log('窗口内部高度:', win.innerHeight);
console.log('窗口外部宽度:', win.outerWidth);
console.log('窗口外部高度:', win.outerHeight);

// window 是全局对象（仅在浏览器中）
if (typeof window !== 'undefined') {
  console.log('window 是全局对象:', window === this);
  console.log('window 包含 document:', window.document !== undefined);
  
  // 全局变量自动成为 window 的属性
  var globalVar = '我是全局变量';
  console.log('全局变量:', window.globalVar);
} else {
  console.log('Node.js 环境：window 对象不存在');
}

console.log('\n========== location 对象 ==========');

// 模拟 location 对象
const mockLocation = {
  href: 'https://example.com/path?id=123&name=test#section',
  protocol: 'https:',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/path',
  search: '?id=123&name=test',
  hash: '#section'
};

const loc = typeof location !== 'undefined' ? location : mockLocation;

// location 属性
console.log('完整 URL:', loc.href);
console.log('协议:', loc.protocol);
console.log('主机名和端口:', loc.host);
console.log('主机名:', loc.hostname);
console.log('端口号:', loc.port);
console.log('路径:', loc.pathname);
console.log('查询字符串:', loc.search);
console.log('锚点:', loc.hash);

// 解析 URL 参数
function getUrlParams() {
  const search = typeof location !== 'undefined' ? location.search : '?id=123&name=test';
  const params = new URLSearchParams(search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

console.log('URL 参数示例:', getUrlParams());

// 获取单个参数
function getUrlParam(name) {
  const search = typeof location !== 'undefined' ? location.search : '?id=123&name=test';
  const params = new URLSearchParams(search);
  return params.get(name);
}

console.log('获取参数示例:', getUrlParam('id'));

console.log('\n========== navigator 对象 ==========');

// 模拟 navigator 对象
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  language: 'zh-CN',
  languages: ['zh-CN', 'zh', 'en'],
  onLine: true,
  cookieEnabled: true,
  platform: 'Win32',
  hardwareConcurrency: 8,
  maxTouchPoints: 0
};

const nav = typeof navigator !== 'undefined' ? navigator : mockNavigator;

// 浏览器信息
console.log('用户代理:', nav.userAgent);
console.log('浏览器语言:', nav.language);
console.log('用户偏好语言:', nav.languages);
console.log('是否在线:', nav.onLine);
console.log('是否启用 Cookie:', nav.cookieEnabled);
console.log('操作系统平台:', nav.platform);
console.log('逻辑处理器数量:', nav.hardwareConcurrency);
console.log('最大触摸点数:', nav.maxTouchPoints);

// 浏览器检测
function detectBrowser() {
  const ua = nav.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Unknown';
}

console.log('浏览器类型:', detectBrowser());

// 检测是否为移动设备
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(nav.userAgent);
}

console.log('是否移动设备:', isMobile());

console.log('\n========== history 对象 ==========');

// 模拟 history 对象
const mockHistory = {
  length: 5
};

const hist = typeof history !== 'undefined' ? history : mockHistory;

// 历史记录数量
console.log('历史记录数量:', hist.length);

// 注意：以下方法在 Node.js 环境中不可用，仅作示例
// history.back();      // 后退
// history.forward();   // 前进
// history.go(-1);      // 后退一页
// history.go(1);       // 前进一页

// History API 示例（用于单页应用路由）
function pushStateExample() {
  const state = { page: 'about', id: 123 };
  const title = '关于页面';
  const url = '/about?id=123';
  
  // 添加历史记录（不刷新页面）
  // history.pushState(state, title, url);
  
  console.log('pushState 示例:', { state, title, url });
}

pushStateExample();

function replaceStateExample() {
  const state = { page: 'home' };
  const title = '首页';
  const url = '/';
  
  // 替换当前历史记录（不刷新页面）
  // history.replaceState(state, title, url);
  
  console.log('replaceState 示例:', { state, title, url });
}

replaceStateExample();

console.log('\n========== screen 对象 ==========');

// 模拟 screen 对象
const mockScreen = {
  width: 1920,
  height: 1080,
  availWidth: 1920,
  availHeight: 1040,
  colorDepth: 24,
  pixelDepth: 24,
  orientation: { type: 'landscape-primary' }
};

const scr = typeof screen !== 'undefined' ? screen : mockScreen;

// 屏幕信息
console.log('屏幕宽度:', scr.width);
console.log('屏幕高度:', scr.height);
console.log('可用宽度:', scr.availWidth);
console.log('可用高度:', scr.availHeight);
console.log('颜色深度:', scr.colorDepth);
console.log('像素深度:', scr.pixelDepth);
console.log('屏幕方向:', scr.orientation ? scr.orientation.type : '不支持');

// 判断是否为高清屏
function isHighDensity() {
  return win.devicePixelRatio > 1;
}

console.log('是否高清屏:', isHighDensity());
console.log('设备像素比:', win.devicePixelRatio);

console.log('\n========== 定时器 ==========');

// setTimeout - 延时执行
const timeoutId = setTimeout(() => {
  console.log('setTimeout: 2秒后执行');
}, 2000);

// 清除定时器
// clearTimeout(timeoutId);

// setInterval - 定时执行
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`setInterval: 第 ${count} 次执行`);
  if (count >= 3) {
    clearInterval(intervalId);
    console.log('setInterval: 已清除');
  }
}, 1000);

// requestAnimationFrame - 请求动画帧
let animationId;
function animate() {
  console.log('requestAnimationFrame: 动画帧');
  // 继续请求下一帧
  // animationId = requestAnimationFrame(animate);
}

// 开始动画
// animationId = requestAnimationFrame(animate);

// 取消动画
// cancelAnimationFrame(animationId);

console.log('\n========== 本地存储 ==========');

// localStorage 示例
// 注意：Node.js 环境不支持 localStorage，以下代码在浏览器中运行

function localStorageDemo() {
  // 设置数据
  // localStorage.setItem('username', '张三');
  // localStorage.setItem('age', '25');
  
  // 获取数据
  // const username = localStorage.getItem('username');
  // console.log('用户名:', username);
  
  // 删除数据
  // localStorage.removeItem('age');
  
  // 清空所有数据
  // localStorage.clear();
  
  // 获取数据项数量
  // console.log('数据项数量:', localStorage.length);
  
  // 获取指定索引的键
  // console.log('第0个键:', localStorage.key(0));
  
  console.log('localStorage API 示例');
}

localStorageDemo();

// sessionStorage 示例
function sessionStorageDemo() {
  // 与 localStorage API 相同
  // sessionStorage.setItem('sessionData', '临时数据');
  // const data = sessionStorage.getItem('sessionData');
  // console.log('会话数据:', data);
  
  console.log('sessionStorage API 示例');
}

sessionStorageDemo();

// 存储对象（需要序列化）
function storeObject() {
  const user = { name: '张三', age: 25, city: '北京' };
  // localStorage.setItem('user', JSON.stringify(user));
  
  // 读取对象
  // const storedUser = JSON.parse(localStorage.getItem('user'));
  // console.log('存储的用户:', storedUser);
  
  console.log('对象存储示例');
}

storeObject();

console.log('\n========== URL 操作 ==========');

// URL 构建
function buildUrl(base, params) {
  const url = new URL(base);
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  return url.toString();
}

console.log('构建 URL:', buildUrl('https://example.com/search', { q: 'javascript', page: 1 }));

// URL 解析
function parseUrl(urlString) {
  const url = new URL(urlString);
  return {
    protocol: url.protocol,
    host: url.host,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    params: Object.fromEntries(url.searchParams)
  };
}

console.log('解析 URL:', parseUrl('https://example.com/path?id=123&name=test#section'));

console.log('\n========== 工具函数 ==========');

// 页面跳转
function redirect(url, replace = false) {
  if (replace) {
    location.replace(url);
  } else {
    location.href = url;
  }
}

// 重新加载页面
function reload(force = false) {
  location.reload(force);
}

// 获取当前页面名称
function getPageName() {
  const pathname = typeof location !== 'undefined' ? location.pathname : '/path/page.html';
  const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
  return filename || 'index';
}

console.log('当前页面:', getPageName());

// 滚动到顶部
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 滚动到指定元素
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

console.log('\n========== 事件监听示例 ==========');

// 窗口大小改变事件（使用防抖）
const handleResize = debounce(() => {
  console.log('窗口大小改变:', window.innerWidth, 'x', window.innerHeight);
}, 250);

// window.addEventListener('resize', handleResize);

// 页面滚动事件（使用节流）
const handleScroll = throttle(() => {
  console.log('页面滚动位置:', window.scrollY);
}, 100);

// window.addEventListener('scroll', handleScroll);

// 页面加载完成事件
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    console.log('页面加载完成');
  });

  // 页面卸载前事件
  window.addEventListener('beforeunload', (e) => {
    // 可以在这里提示用户保存数据
    // e.preventDefault();
    // e.returnValue = '';
  });

  // 在线/离线事件
  window.addEventListener('online', () => {
    console.log('网络已连接');
  });

  window.addEventListener('offline', () => {
    console.log('网络已断开');
  });
}

// 页面可见性改变事件
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('页面隐藏');
    } else {
      console.log('页面显示');
    }
  });
} else {
  console.log('事件监听示例（需要在浏览器中运行）');
}

console.log('\n========== 现代 API 示例 ==========');

// 剪贴板 API
async function copyToClipboard(text) {
  try {
    // await navigator.clipboard.writeText(text);
    console.log('已复制到剪贴板:', text);
  } catch (err) {
    console.error('复制失败:', err);
  }
}

// 读取剪贴板
async function readFromClipboard() {
  try {
    // const text = await navigator.clipboard.readText();
    // console.log('剪贴板内容:', text);
    console.log('读取剪贴板示例');
  } catch (err) {
    console.error('读取失败:', err);
  }
}

// Web Share API
async function shareContent(data) {
  try {
    // await navigator.share(data);
    console.log('分享成功:', data);
  } catch (err) {
    console.error('分享失败:', err);
  }
}

// 使用示例
// shareContent({
//   title: '分享标题',
//   text: '分享内容',
//   url: 'https://example.com'
// });

// 发送信标（用于埋点）
function sendBeacon(url, data) {
  // const success = navigator.sendBeacon(url, JSON.stringify(data));
  // console.log('信标发送:', success ? '成功' : '失败');
  console.log('sendBeacon 示例');
}

console.log('\n========== 总结 ==========');

console.log(`
BOM 核心要点：

1. window 对象：
   - BOM 的核心，代表浏览器窗口
   - 全局对象，所有全局变量和函数都是其属性
   - 提供窗口操作、定时器、弹窗等方法

2. location 对象：
   - 管理当前 URL 信息
   - 页面跳转、刷新、参数解析
   - URLSearchParams 简化参数操作

3. navigator 对象：
   - 浏览器信息和功能检测
   - 现代 API：地理位置、剪贴板、分享等
   - 通过 userAgent 进行浏览器检测

4. history 对象：
   - 浏览器历史记录管理
   - History API 实现无刷新路由
   - pushState / replaceState 操作历史

5. screen 对象：
   - 屏幕尺寸和属性信息
   - 响应式设计和适配
   - devicePixelRatio 高清屏检测

6. 存储 API：
   - localStorage：持久化本地存储
   - sessionStorage：会话级存储
   - 需要序列化存储对象

7. 定时器：
   - setTimeout / setInterval：延时/定时执行
   - requestAnimationFrame：动画优化
   - 注意清除定时器避免内存泄漏

8. 事件处理：
   - resize、scroll：窗口和页面事件
   - online、offline：网络状态事件
   - visibilitychange：页面可见性

9. 最佳实践：
   - 使用防抖和节流优化性能
   - 特性检测优于浏览器检测
   - 注意存储容量限制和安全性
   - 处理浏览器兼容性问题

掌握 BOM，是与浏览器交互的基础！
`);
