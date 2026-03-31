# Authentication 模块

## 模块概述

Authentication 模块提供了完整的用户认证和授权功能，包括用户注册、登录、JWT 令牌管理、密码重置、两因素认证和社交登录等功能。该模块旨在为 Web 应用提供安全、可靠的认证系统。

## 功能列表

- **用户注册**：创建新用户账号，包括密码强度检查和邮箱验证
- **用户登录**：验证用户凭据并生成 JWT 令牌
- **JWT 令牌管理**：生成、验证和刷新 JWT 令牌
- **密码重置**：通过邮箱发送密码重置链接
- **两因素认证**：支持基于时间的一次性密码 (TOTP) 验证
- **社交登录**：支持 Google、Facebook、GitHub 等第三方登录
- **会话管理**：安全的会话创建和管理
- **权限检查**：基于角色的访问控制

## 安装和使用

### 安装依赖

```bash
npm install jsonwebtoken bcryptjs speakeasy nodemailer
```

### 基本使用

```javascript
// 导入认证模块
const auth = require('./security-demo');

// 用户注册
const user = await auth.register({
  username: 'user1',
  email: 'user1@example.com',
  password: 'SecurePass123!'
});

// 用户登录
const token = await auth.login('user1@example.com', 'SecurePass123!');

// 验证 JWT 令牌
const decoded = auth.verifyToken(token);

// 刷新 JWT 令牌
const newToken = auth.refreshToken(token);

// 密码重置
await auth.requestPasswordReset('user1@example.com');

// 验证密码重置令牌
await auth.resetPassword('reset-token', 'NewSecurePass123!');

// 启用两因素认证
const totpSecret = auth.enable2FA('user1@example.com');

// 验证两因素认证
const isValid = auth.verify2FA('user1@example.com', '123456');

// 社交登录
const token = await auth.socialLogin('google', 'google-token');

// 权限检查
const hasAccess = auth.checkPermission(decoded.userId, 'admin');
```

## 安全最佳实践

1. **使用 HTTPS**：确保所有认证相关的请求都通过 HTTPS 传输
2. **密码哈希**：使用 bcrypt 等安全算法对密码进行哈希处理
3. **JWT 安全**：设置合理的过期时间，使用强密钥
4. **防止暴力攻击**：实现登录尝试限制和延迟
5. **邮箱验证**：要求用户验证邮箱地址
6. **两因素认证**：鼓励用户启用两因素认证
7. **安全的密码重置**：使用一次性、短期有效的重置令牌
8. **会话管理**：实现会话超时和自动登出
9. **输入验证**：对所有用户输入进行严格验证
10. **错误处理**：避免在错误消息中泄露敏感信息

## 示例应用

查看 `security-demo.js` 文件获取完整的实现示例，包括所有功能的详细代码。

## 注意事项

- 本模块仅作为示例实现，实际生产环境中需要根据具体需求进行调整
- 确保在生产环境中使用安全的密钥和配置
- 定期更新依赖库以修复安全漏洞
- 遵循 OWASP 认证最佳实践