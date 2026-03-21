
const WebAPIUtils = require('./index.js');

console.log('=== 测试 Web API 工具 ===\n');

console.log('1. 测试 API 支持检测:');
const supports = WebAPIUtils.utils.supports();
console.log('  支持的 API:');
Object.entries(supports).forEach(([api, supported]) => {
  console.log(`    ${api}: ${supported ? '✓' : '✗'}`);
});

console.log('\n2. 测试工具函数:');

// 测试防抖
let debounceCount = 0;
const debouncedFn = WebAPIUtils.utils.debounce(() => {
  debounceCount++;
}, 100);

debouncedFn();
debouncedFn();
debouncedFn();
console.log('  防抖函数调用3次，当前计数:', debounceCount);

// 测试节流
let throttleCount = 0;
const throttledFn = WebAPIUtils.utils.throttle(() => {
  throttleCount++;
}, 100);

throttledFn();
throttledFn();
throttledFn();
console.log('  节流函数调用3次，当前计数:', throttleCount);

// 测试 once
let onceCount = 0;
const onceFn = WebAPIUtils.utils.once(() => {
  onceCount++;
  return 'called';
});

console.log('  once函数第1次调用:', onceFn());
console.log('  once函数第2次调用:', onceFn());
console.log('  once函数第3次调用:', onceFn());
console.log('  once函数实际执行次数:', onceCount);

// 测试 memoize
let fibCallCount = 0;
const fibonacci = WebAPIUtils.utils.memoize((n) => {
  fibCallCount++;
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log('  fibonacci(10):', fibonacci(10));
console.log('  fibonacci(10) 再次:', fibonacci(10));
console.log('  fibonacci(8):', fibonacci(8));
console.log('  函数调用次数:', fibCallCount);

console.log('\n3. 测试存储工具 (Node.js 环境不可用):');
console.log('  localStorage 可用:', typeof localStorage !== 'undefined');
console.log('  sessionStorage 可用:', typeof sessionStorage !== 'undefined');

console.log('\n4. 测试 Fetch 工具:');
console.log('  fetch 可用:', typeof fetch !== 'undefined');

console.log('\n5. 测试 Canvas 工具:');
console.log('  Canvas 可用:', typeof HTMLCanvasElement !== 'undefined');

console.log('\n6. 测试 WebSocket 工具:');
console.log('  WebSocket 可用:', typeof WebSocket !== 'undefined');

console.log('\n7. 测试 Notification 工具:');
console.log('  Notification 可用:', typeof Notification !== 'undefined');

console.log('\n8. 测试 Clipboard 工具:');
console.log('  Clipboard 可用:', typeof navigator !== 'undefined' && 'clipboard' in navigator);

console.log('\n9. 测试 Geolocation 工具:');
console.log('  Geolocation 可用:', typeof navigator !== 'undefined' && 'geolocation' in navigator);

console.log('\n10. 测试 Observer 工具:');
console.log('  IntersectionObserver 可用:', typeof IntersectionObserver !== 'undefined');
console.log('  ResizeObserver 可用:', typeof ResizeObserver !== 'undefined');
console.log('  MutationObserver 可用:', typeof MutationObserver !== 'undefined');

console.log('\n11. 测试 Audio 工具:');
console.log('  AudioContext 可用:', typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined');

console.log('\n12. 测试 File 工具:');
console.log('  FileReader 可用:', typeof FileReader !== 'undefined');

console.log('\n13. 测试 History 工具:');
console.log('  History API 可用:', typeof history !== 'undefined');

console.log('\n14. 测试 Worker 工具:');
console.log('  Worker 可用:', typeof Worker !== 'undefined');
console.log('  ServiceWorker 可用:', typeof navigator !== 'undefined' && 'serviceWorker' in navigator);

console.log('\n=== 所有测试完成 ===');
console.log('\n注意: 大部分 Web API 需要在浏览器环境中运行才能完全测试。');
console.log('Node.js 环境主要用于验证代码结构和基本逻辑。');
