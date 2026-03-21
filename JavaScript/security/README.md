
# JavaScript 安全

Web 安全是前端开发中非常重要的部分，了解常见的安全威胁和防护措施对于开发安全的应用至关重要。

## 常见安全威胁

### 1. XSS (跨站脚本攻击)

XSS 攻击是指攻击者向网页注入恶意脚本，当用户浏览页面时执行这些脚本。

#### 类型

- **存储型 XSS** - 恶意脚本存储在服务器上
- **反射型 XSS** - 恶意脚本通过 URL 参数传递
- **DOM 型 XSS** - 通过修改页面 DOM 结构执行攻击

#### 防护措施

```javascript
// 输入过滤和转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 使用 CSP (内容安全策略)
// Content-Security-Policy: default-src 'self'
```

### 2. CSRF (跨站请求伪造)

CSRF 攻击是指攻击者诱导用户在已认证的网站上执行非预期的操作。

#### 防护措施

```javascript
// 使用 CSRF Token
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

fetch('/api/action', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken
  }
});
```

### 3. SQL 注入

虽然前端不直接操作数据库，但需要确保传递给后端的数据是安全的。

#### 防护措施

```javascript
// 参数化查询（在后端实现）
// 永远不要直接拼接 SQL 语句
```

### 4. 点击劫持

攻击者通过透明的 iframe 覆盖在页面上，诱导用户点击。

#### 防护措施

```javascript
// 使用 X-Frame-Options 响应头
// X-Frame-Options: DENY
// X-Frame-Options: SAMEORIGIN

// 或使用 CSP
// Content-Security-Policy: frame-ancestors 'none'
```

## 安全编码实践

### 输入验证

```javascript
function validateInput(input, type) {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\d{11}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/
  };
  
  return patterns[type]?.test(input) ?? false;
}
```

### 输出编码

```javascript
function encodeOutput(data) {
  return data
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

### 安全的 Cookie 设置

```javascript
document.cookie = 'sessionId=xxx; Secure; HttpOnly; SameSite=Strict';
```

## 安全 HTTP 头

### 重要的安全头

- **Content-Security-Policy** - 定义内容安全策略
- **X-Content-Type-Options** - 防止 MIME 类型嗅探
- **X-Frame-Options** - 防止点击劫持
- **X-XSS-Protection** - 启用浏览器 XSS 过滤
- **Strict-Transport-Security** - 强制使用 HTTPS
- **Referrer-Policy** - 控制 Referrer 信息

## 密码安全

### 密码存储

```javascript
// 永远不要明文存储密码
// 使用 bcrypt、scrypt 或 Argon2 等算法

// 示例（Node.js 后端）
const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};
```

### 密码强度验证

```javascript
function checkPasswordStrength(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  let strength = 0;
  if (password.length >= minLength) strength++;
  if (hasUpperCase) strength++;
  if (hasLowerCase) strength++;
  if (hasNumbers) strength++;
  if (hasSpecialChar) strength++;
  
  return strength;
}
```

## 会话管理

### 安全的会话处理

```javascript
// 使用安全的会话存储
// 避免在 localStorage 中存储敏感信息

// 设置会话过期时间
const setSessionTimeout = (timeoutMinutes = 30) => {
  setTimeout(() => {
    logout();
  }, timeoutMinutes * 60 * 1000);
};
```

## HTTPS 和 TLS

### 强制 HTTPS

```javascript
// 检测是否使用 HTTPS
if (window.location.protocol !== 'https:') {
  window.location.href = window.location.href.replace('http:', 'https:');
}
```

## 第三方库安全

### 依赖检查

```bash
# 检查依赖漏洞
npm audit
npm audit fix

# 使用 Snyk 等工具
npx snyk test
```

## 安全测试

### 常用的安全测试工具

- **OWASP ZAP** - Web 应用安全扫描
- **Burp Suite** - Web 安全测试平台
- **Snyk** - 依赖漏洞扫描
- **ESLint Security Plugin** - 代码安全规则检查

## 最佳实践

1. **最小权限原则** - 只授予必要的权限
2. **防御性编程** - 假设所有输入都是恶意的
3. **安全默认值** - 使用安全的默认配置
4. **定期更新** - 及时更新依赖和框架
5. **安全审计** - 定期进行安全审计

## 学习建议

1. 理解常见的 Web 安全威胁
2. 学习安全编码实践
3. 了解 CSP 和其他安全机制
4. 掌握密码学和哈希算法基础
5. 学习使用安全测试工具
