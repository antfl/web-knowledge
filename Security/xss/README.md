# XSS 防护模块

## 模块概述

XSS (Cross-Site Scripting) 防护模块提供了全面的跨站脚本攻击防护功能，包括输入验证、输出编码、内容安全策略 (CSP) 配置、DOM-based XSS 防护等。该模块旨在帮助开发者构建更安全的 Web 应用，防止恶意脚本注入攻击。

## 功能列表

- **输入验证**：检测和过滤恶意输入
- **输出编码**：对用户输入进行适当的编码，防止脚本执行
- **内容安全策略 (CSP)**：配置和实施 CSP，限制页面可执行的脚本来源
- **DOM-based XSS 防护**：防止通过 DOM 操作注入恶意脚本
- **存储型 XSS 防护**：防止存储在数据库中的恶意内容被执行
- **反射型 XSS 防护**：防止 URL 参数中的恶意内容被执行
- **XSS 检测**：检测潜在的 XSS 攻击尝试
- **安全的 DOM 操作**：提供安全的 DOM 元素创建和修改方法

## 安装和使用

### 基本使用

```javascript
// 导入 XSS 防护模块
const xss = require('./security-demo');

// 1. 输入验证
const isSafe = xss.validateInput('<script>alert(1)</script>');
console.log('输入是否安全:', isSafe);

// 2. 输出编码
const encoded = xss.encodeHTML('<script>alert(1)</script>');
console.log('编码后:', encoded);

// 3. 配置 CSP
xss.setCSP({
  defaultSrc: "'self'",
  scriptSrc: "'self' https://trusted-cdn.com",
  styleSrc: "'self' 'unsafe-inline'"
});

// 4. 安全的 DOM 操作
xss.createSafeElement('div', '安全内容');

// 5. 检测 XSS
const xssDetected = xss.detectXSS('<script>alert(1)</script>');
console.log('是否检测到 XSS:', xssDetected);

// 6. 清理用户输入
const cleaned = xss.sanitizeInput('<script>alert(1)</script>');
console.log('清理后:', cleaned);
```

## 安全最佳实践

1. **始终进行输入验证**：对所有用户输入进行严格验证，拒绝或清理恶意内容
2. **使用输出编码**：在将用户输入显示到页面之前，对其进行适当的编码
3. **实施内容安全策略 (CSP)**：限制页面可执行的脚本来源，减少 XSS 攻击的风险
4. **使用安全的 DOM 操作**：避免使用 `innerHTML` 等可能导致 XSS 的方法
5. **使用 HTTP-only cookies**：防止 JavaScript 访问 cookies，减少会话劫持的风险
6. **保持软件更新**：定期更新依赖库和框架，修复已知的安全漏洞
7. **使用现代框架**：现代前端框架（如 React、Vue、Angular）通常内置了 XSS 防护机制
8. **进行安全测试**：定期进行安全测试，检测和修复潜在的 XSS 漏洞

## XSS 类型及其防护

### 1. 存储型 XSS

**描述**：恶意脚本被存储在服务器数据库中，当其他用户访问包含该内容的页面时被执行。

**防护**：
- 对存储的用户输入进行严格验证和清理
- 在显示存储的内容时进行适当的编码
- 实施 CSP，限制脚本执行

### 2. 反射型 XSS

**描述**：恶意脚本通过 URL 参数传递，服务器将其反射回页面并执行。

**防护**：
- 对 URL 参数进行验证和清理
- 在显示 URL 参数值时进行适当的编码
- 使用 `encodeURIComponent` 对 URL 参数进行编码

### 3. DOM-based XSS

**描述**：恶意脚本通过 DOM 操作在客户端执行，不涉及服务器。

**防护**：
- 避免使用 `innerHTML`、`outerHTML` 等直接插入 HTML 的方法
- 使用 `textContent` 或 `createTextNode` 来设置文本内容
- 对所有用户输入进行验证和清理
- 实施 CSP，限制脚本执行

## 示例应用

查看 `security-demo.js` 文件获取完整的实现示例，包括所有功能的详细代码。

## 注意事项

- 本模块仅作为示例实现，实际生产环境中需要根据具体需求进行调整
- 安全是一个持续的过程，需要定期更新和维护
- 不同的上下文需要不同的编码策略（HTML、JavaScript、CSS、URL 等）
- 始终遵循最小权限原则，只允许必要的脚本执行
- 定期进行安全审计，检测和修复潜在的 XSS 漏洞