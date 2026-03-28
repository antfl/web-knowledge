# 浏览器缓存

## 1. 缓存概述

### 1.1 什么是浏览器缓存

浏览器缓存是浏览器存储资源（如 HTML、CSS、JavaScript、图片等）的一种机制，用于减少网络请求，提高页面加载速度和用户体验。

### 1.2 缓存的作用

- **减少网络请求**：避免重复下载相同的资源
- **提高页面加载速度**：直接从本地读取缓存的资源
- **减少服务器负担**：降低服务器的请求压力
- **离线访问**：在网络不稳定或断开时仍能访问部分内容

### 1.3 缓存的分类

- **强缓存**：直接从本地缓存获取资源，不发送请求到服务器
- **协商缓存**：发送请求到服务器，根据服务器的响应决定是否使用本地缓存
- **浏览器存储**：localStorage、sessionStorage、IndexedDB 等（详见 storage 目录）

## 2. 强缓存

### 2.1 强缓存的原理

强缓存通过 HTTP 响应头中的 `Cache-Control` 和 `Expires` 字段来控制，浏览器在第一次请求资源后会缓存该资源，并设置过期时间。在过期时间内，浏览器直接使用本地缓存，不发送请求到服务器。

### 2.2 相关 HTTP 头

#### Cache-Control

`Cache-Control` 是 HTTP/1.1 中引入的字段，优先级高于 `Expires`。

常用指令：

- `max-age`：设置缓存的最大过期时间（秒）
- `no-cache`：需要进行协商缓存
- `no-store`：不缓存任何响应
- `public`：允许任何缓存（包括 CDN）缓存响应
- `private`：只允许浏览器缓存，不允许 CDN 等中间缓存

示例：
```
Cache-Control: max-age=3600, public
```

#### Expires

`Expires` 是 HTTP/1.0 中的字段，设置缓存的绝对过期时间。

示例：
```
Expires: Wed, 21 Oct 2026 07:28:00 GMT
```

### 2.3 强缓存的工作流程

1. 浏览器第一次请求资源，服务器返回资源并设置 `Cache-Control` 或 `Expires` 头
2. 浏览器缓存资源和响应头
3. 浏览器再次请求同一资源时，检查缓存是否过期
4. 如果未过期，直接使用本地缓存，状态码为 200 (from memory cache) 或 200 (from disk cache)
5. 如果已过期，进入协商缓存流程

## 3. 协商缓存

### 3.1 协商缓存的原理

协商缓存通过 HTTP 响应头中的 `Last-Modified`/`If-Modified-Since` 和 `ETag`/`If-None-Match` 字段来控制。浏览器在缓存过期后，发送请求到服务器，服务器根据这些字段判断资源是否发生变化，决定是返回新资源还是使用缓存。

### 3.2 相关 HTTP 头

#### Last-Modified / If-Modified-Since

- `Last-Modified`：服务器返回资源的最后修改时间
- `If-Modified-Since`：浏览器发送的请求头，包含上次获取的 `Last-Modified` 值

#### ETag / If-None-Match

- `ETag`：服务器返回的资源唯一标识符（通常是资源内容的哈希值）
- `If-None-Match`：浏览器发送的请求头，包含上次获取的 `ETag` 值

### 3.3 协商缓存的工作流程

1. 浏览器第一次请求资源，服务器返回资源并设置 `Last-Modified` 和 `ETag` 头
2. 浏览器缓存资源和响应头
3. 浏览器再次请求同一资源时，发送 `If-Modified-Since` 和 `If-None-Match` 头
4. 服务器检查资源是否发生变化：
   - 如果未变化，返回 304 Not Modified，浏览器使用本地缓存
   - 如果已变化，返回 200 OK 和新资源

### 3.4 Last-Modified 与 ETag 的区别

- **Last-Modified**：基于时间戳，精度为秒，可能存在时间戳变化但内容未变的情况
- **ETag**：基于资源内容的哈希值，精度更高，能更准确地判断资源是否变化
- **优先级**：ETag 优先级高于 Last-Modified

## 4. 缓存策略

### 4.1 不同资源的缓存策略

| 资源类型 | 缓存策略 | 说明 |
|---------|---------|------|
| HTML | 协商缓存 | 通常不设置强缓存，确保用户能获取最新内容 |
| CSS | 强缓存 + 版本号 | 设置较长的缓存时间，通过版本号更新 |
| JavaScript | 强缓存 + 版本号 | 设置较长的缓存时间，通过版本号更新 |
| 图片 | 强缓存 + 版本号 | 设置较长的缓存时间，通过版本号更新 |
| API 数据 | 协商缓存 | 根据数据更新频率设置适当的缓存策略 |

### 4.2 缓存更新策略

- **版本号**：在资源 URL 后添加版本号或哈希值，如 `style.css?v=1.0.0`
- **文件名哈希**：将资源内容的哈希值作为文件名的一部分，如 `style.abc123.css`
- **CDN 缓存刷新**：通过 CDN 提供商的 API 刷新缓存
- **Cache-Control: no-cache**：强制进行协商缓存

### 4.3 缓存控制最佳实践

- **静态资源**：使用强缓存 + 版本号，设置较长的过期时间
- **动态资源**：使用协商缓存，根据实际情况设置缓存策略
- **避免缓存敏感信息**：对包含敏感信息的响应使用 `Cache-Control: no-store`
- **合理设置缓存头**：根据资源类型和更新频率设置合适的缓存头

## 5. 缓存的优缺点

### 5.1 优点

- **提高性能**：减少网络请求，提高页面加载速度
- **降低带宽消耗**：减少数据传输量
- **减轻服务器负担**：降低服务器的请求压力
- **改善用户体验**：页面加载更快，响应更迅速

### 5.2 缺点

- **可能导致内容过时**：用户可能看到过期的内容
- **调试困难**：缓存可能导致开发过程中看不到最新的修改
- **存储空间占用**：缓存会占用浏览器的存储空间
- **缓存一致性**：需要额外的机制确保缓存与服务器数据一致

## 6. 缓存相关 API

### 6.1 Service Worker

Service Worker 是一种浏览器后台运行的脚本，可以拦截和处理网络请求，实现更强大的缓存策略。

```javascript
// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker 注册成功:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker 注册失败:', error);
      });
  });
}

// sw.js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有响应，直接返回
        if (response) {
          return response;
        }
        
        // 否则发起网络请求
        return fetch(event.request)
          .then(response => {
            // 缓存新的响应
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open('v1')
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          });
      })
  );
});
```

### 6.2 Cache API

Cache API 提供了编程方式操作缓存的能力，通常与 Service Worker 配合使用。

```javascript
// 打开缓存
caches.open('v1')
  .then(cache => {
    // 添加资源到缓存
    return cache.addAll([
      '/',
      '/styles.css',
      '/script.js',
      '/image.jpg'
    ]);
  });

// 从缓存中获取资源
caches.match('/styles.css')
  .then(response => {
    if (response) {
      // 使用缓存的资源
      console.log('从缓存获取资源');
    } else {
      // 缓存中不存在，发起网络请求
      console.log('缓存中不存在资源');
    }
  });

// 删除缓存
caches.delete('v1')
  .then(success => {
    if (success) {
      console.log('缓存删除成功');
    }
  });
```

## 7. 缓存调试

### 7.1 浏览器开发者工具

- **Network 面板**：查看资源的缓存状态和 HTTP 头
  - `200 (from memory cache)`：从内存缓存获取
  - `200 (from disk cache)`：从磁盘缓存获取
  - `304 Not Modified`：协商缓存命中
  - `200 OK`：从服务器获取新资源

- **Application 面板**：
  - **Cache Storage**：查看和管理 Service Worker 缓存
  - **Clear site data**：清除网站的所有缓存和存储数据

### 7.2 常用调试命令

```bash
# 清除浏览器缓存
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete
# Safari: Command+Option+E

# 禁用缓存（开发模式）
# Chrome: F12 -> Network -> 勾选 Disable cache
```

### 7.3 缓存测试工具

- **WebPageTest**：测试页面加载性能和缓存情况
- **Lighthouse**：分析页面性能和缓存策略
- **Chrome DevTools**：详细的缓存分析和调试工具

## 8. 缓存性能

### 8.1 缓存对性能的影响

- **减少网络延迟**：从本地缓存获取资源比网络请求快得多
- **降低带宽消耗**：减少数据传输量，节省用户流量
- **提高页面加载速度**：特别是重复访问时的加载速度
- **减轻服务器负担**：减少对服务器的请求压力

### 8.2 性能测试方法

#### 网络请求缓存测试

- 测试首次请求（无缓存）的时间
- 测试二次请求（有缓存）的时间
- 计算缓存提升百分比

#### Service Worker 缓存测试

- 测试通过 Service Worker 缓存的资源加载时间
- 对比网络请求和缓存请求的性能差异

#### Cache API 性能测试

- 测试 Cache API 的读写性能
- 对比不同缓存策略的性能表现

#### 多资源缓存测试

- 测试多个资源同时加载时的缓存效果
- 分析缓存对整体页面加载性能的影响

### 8.3 性能优化策略

- **合理设置缓存过期时间**：根据资源更新频率设置合适的过期时间
- **使用版本号或哈希值**：确保资源更新时能及时刷新缓存
- **实现 Service Worker**：提供更强大的离线缓存能力
- **使用 CDN**：利用 CDN 的缓存能力，减少网络延迟
- **优化资源大小**：压缩资源，减少传输时间
- **使用 HTTP/2**：支持多路复用，提高并发请求性能
- **预缓存关键资源**：在用户访问前提前缓存关键资源

### 8.4 性能监控指标

- **首次内容绘制 (FCP)**：页面开始显示内容的时间
- **最大内容绘制 (LCP)**：页面主要内容完成绘制的时间
- **累积布局偏移 (CLS)**：页面布局不稳定的程度
- **首次输入延迟 (FID)**：用户首次交互到浏览器响应的时间
- **时间到交互 (TTI)**：页面达到完全可交互状态的时间

### 8.5 性能测试工具

- **Chrome DevTools Performance**：详细的性能分析工具
- **Lighthouse**：综合性能评估工具
- **WebPageTest**：多地点性能测试
- **Sentry Performance**：实时性能监控
- **New Relic**：应用性能监控

## 9. 缓存最佳实践

### 9.1 前端最佳实践

- **使用版本号或哈希值**：确保资源更新时能及时刷新缓存
- **合理设置缓存头**：根据资源类型设置不同的缓存策略
- **使用 CDN**：利用 CDN 的缓存能力
- **实现 Service Worker**：提供更强大的离线缓存能力
- **避免内联资源**：将 CSS 和 JavaScript 分离，便于缓存
- **使用 HTTP/2**：支持多路复用，减少连接开销

### 9.2 后端最佳实践

- **正确设置缓存头**：根据资源类型设置合适的 Cache-Control 指令
- **实现 ETag**：提供更准确的资源变化检测
- **支持 Range 请求**：允许部分内容的缓存和传输
- **使用 Gzip/Brotli 压缩**：减少传输大小
- **设置合理的 Vary 头**：根据不同的请求头返回不同的响应

### 9.3 常见问题及解决方案

| 问题 | 解决方案 |
|------|---------|
| 缓存过期时间设置过长 | 使用版本号或哈希值，结合合理的过期时间 |
| 缓存导致内容不更新 | 使用版本号或哈希值，确保资源更新时 URL 变化 |
| 敏感信息被缓存 | 使用 Cache-Control: no-store |
| 缓存占用空间过大 | 定期清理不必要的缓存，设置合理的缓存策略 |
| 跨域资源缓存 | 正确设置 CORS 头，确保资源可以被缓存 |

## 10. 缓存与安全

### 10.1 缓存安全风险

- **敏感信息泄露**：缓存可能存储包含敏感信息的响应
- **缓存投毒**：攻击者可能通过特殊请求污染缓存
- **点击劫持**：缓存的页面可能被用于点击劫持攻击

### 10.2 安全最佳实践

- **对敏感资源使用 no-store**：避免缓存包含敏感信息的响应
- **设置合适的 Vary 头**：根据用户认证状态返回不同的响应
- **使用 HTTPS**：确保缓存的资源不被篡改
- **定期清理缓存**：减少敏感信息的暴露时间
- **实现内容安全策略 (CSP)**：防止恶意内容的执行

## 11. 总结

浏览器缓存是前端性能优化的重要组成部分，通过合理的缓存策略可以显著提高页面加载速度和用户体验。在实际开发中，应该根据资源类型和更新频率选择合适的缓存策略，结合版本号、CDN、Service Worker 等技术，实现高效、可靠的缓存系统。

同时，需要注意缓存的安全性和一致性，避免缓存导致的内容过期、敏感信息泄露等问题。通过浏览器开发者工具和专业的性能测试工具，可以监控和优化缓存策略，确保缓存系统的正常运行。