# HTTP (HyperText Transfer Protocol)

HTTP 是互联网上应用最为广泛的一种网络协议，用于从 Web 服务器传输超文本到本地浏览器。

## 目录

1. [HTTP 基础](#http-基础)
2. [HTTP 方法](#http-方法)
3. [HTTP 状态码](#http-状态码)
4. [HTTP 头部](#http-头部)
5. [HTTP 版本演进](#http-版本演进)
6. [HTTP 缓存](#http-缓存)
7. [Cookie 和 Session](#cookie-和-session)
8. [跨域 CORS](#跨域-cors)
9. [实际应用示例](#实际应用示例)

## HTTP 基础

### 什么是 HTTP

HTTP 是一个基于 TCP/IP 协议的应用层协议，用于客户端和服务器之间的通信。

**特点：**
- 简单快速：客户向服务器请求服务时，只需传送请求方法和路径
- 灵活：HTTP 允许传输任意类型的数据对象
- 无连接：限制每次连接只处理一个请求
- 无状态：协议对于事务处理没有记忆能力

### URI、URL 和 URN

```
URI (Uniform Resource Identifier) - 统一资源标识符
├── URL (Uniform Resource Locator) - 统一资源定位符
│   └── 例如: https://www.example.com/path?query=1
└── URN (Uniform Resource Name) - 统一资源名称
    └── 例如: urn:isbn:0451450523
```

**URL 结构：**
```
https://www.example.com:8080/path/to/resource?key=value#fragment
\___/   \_____________/ \___/\_____________/ \___________/ \______/
  |           |          |         |              |           |
协议        主机名      端口      路径          查询参数     锚点
```

## HTTP 方法

| 方法 | 描述 | 幂等性 | 安全性 |
|------|------|--------|--------|
| GET | 获取资源 | 是 | 是 |
| POST | 创建资源 | 否 | 否 |
| PUT | 更新资源（完整） | 是 | 否 |
| PATCH | 更新资源（部分） | 否 | 否 |
| DELETE | 删除资源 | 是 | 否 |
| HEAD | 获取响应头 | 是 | 是 |
| OPTIONS | 获取支持的方法 | 是 | 是 |
| TRACE | 追踪请求路径 | 是 | 是 |
| CONNECT | 建立隧道连接 | 否 | 否 |

### 方法详解

**GET vs POST**
```javascript
// GET 请求
// - 参数在 URL 中可见
// - 有长度限制（浏览器通常限制 2KB-8KB）
// - 可被缓存、收藏为书签
// - 用于获取数据
fetch('/api/users?id=123')

// POST 请求
// - 参数在请求体中
// - 无长度限制
// - 不可被缓存
// - 用于提交数据
fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: '张三' })
})
```

**PUT vs PATCH**
```javascript
// PUT - 完整更新（替换整个资源）
fetch('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({
    id: '123',
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25
  })
})

// PATCH - 部分更新（只修改指定字段）
fetch('/api/users/123', {
  method: 'PATCH',
  body: JSON.stringify({ age: 26 }) // 只更新 age 字段
})
```

## HTTP 状态码

### 1xx - 信息响应
- `100 Continue` - 继续发送请求的剩余部分
- `101 Switching Protocols` - 切换协议（如升级到 WebSocket）

### 2xx - 成功
- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `202 Accepted` - 请求已接受，正在处理
- `204 No Content` - 请求成功，无返回内容

### 3xx - 重定向
- `301 Moved Permanently` - 永久重定向
- `302 Found` - 临时重定向
- `304 Not Modified` - 资源未修改，使用缓存

### 4xx - 客户端错误
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未认证
- `403 Forbidden` - 无权限
- `404 Not Found` - 资源不存在
- `405 Method Not Allowed` - 请求方法不允许
- `408 Request Timeout` - 请求超时
- `409 Conflict` - 资源冲突
- `429 Too Many Requests` - 请求过于频繁

### 5xx - 服务器错误
- `500 Internal Server Error` - 服务器内部错误
- `502 Bad Gateway` - 网关错误
- `503 Service Unavailable` - 服务不可用
- `504 Gateway Timeout` - 网关超时

## HTTP 头部

### 通用头部

| 头部 | 说明 | 示例 |
|------|------|------|
| Date | 消息创建时间 | Date: Wed, 21 Oct 2023 07:28:00 GMT |
| Connection | 连接管理 | Connection: keep-alive |
| Cache-Control | 缓存控制 | Cache-Control: no-cache |

### 请求头部

| 头部 | 说明 | 示例 |
|------|------|------|
| Host | 目标主机 | Host: www.example.com |
| User-Agent | 客户端信息 | User-Agent: Mozilla/5.0... |
| Accept | 可接受的响应类型 | Accept: application/json |
| Accept-Language | 可接受的语言 | Accept-Language: zh-CN |
| Accept-Encoding | 可接受的编码 | Accept-Encoding: gzip, deflate |
| Authorization | 认证信息 | Authorization: Bearer token |
| Cookie | Cookie 数据 | Cookie: sessionId=xxx |
| Content-Type | 请求体类型 | Content-Type: application/json |
| Content-Length | 请求体长度 | Content-Length: 123 |
| Referer | 来源页面 | Referer: https://example.com |

### 响应头部

| 头部 | 说明 | 示例 |
|------|------|------|
| Server | 服务器信息 | Server: nginx/1.18.0 |
| Content-Type | 响应体类型 | Content-Type: text/html |
| Content-Length | 响应体长度 | Content-Length: 1234 |
| Content-Encoding | 响应体编码 | Content-Encoding: gzip |
| Set-Cookie | 设置 Cookie | Set-Cookie: sessionId=xxx |
| Location | 重定向地址 | Location: /new-path |
| Access-Control-Allow-Origin | CORS 允许来源 | Access-Control-Allow-Origin: * |

### Content-Type 常见类型

```
text/plain          - 纯文本
text/html           - HTML 文档
text/css            - CSS 样式
application/json    - JSON 数据
application/xml     - XML 数据
application/javascript - JavaScript 代码
multipart/form-data - 表单文件上传
application/x-www-form-urlencoded - 表单数据
image/jpeg          - JPEG 图片
image/png           - PNG 图片
application/pdf     - PDF 文档
```

## HTTP 版本演进

### HTTP/1.0 (1996)
- 每次请求都需要新建 TCP 连接
- 无 Host 头部（无法支持虚拟主机）

### HTTP/1.1 (1997)
- **持久连接**：Connection: keep-alive，复用 TCP 连接
- **管道化**：允许连续发送多个请求（但响应必须按顺序返回）
- **Host 头部**：支持虚拟主机
- **缓存控制**：Cache-Control、ETag、If-None-Match
- **断点续传**：Range 请求头

### HTTP/2 (2015)
- **二进制分帧**：将数据分割为二进制帧，提高传输效率
- **多路复用**：单个 TCP 连接上并行传输多个请求和响应
- **头部压缩**：HPACK 算法压缩头部
- **服务器推送**：服务器可主动推送资源

### HTTP/3 (2022)
- **基于 QUIC**：使用 UDP 而非 TCP
- **内置 TLS 1.3**：强制加密
- **0-RTT 连接**：更快的连接建立
- **连接迁移**：网络切换时保持连接

## HTTP 缓存

### 缓存类型

**1. 强制缓存（不会发请求到服务器）**
```http
Cache-Control: max-age=3600  // 缓存 1 小时
Expires: Wed, 21 Oct 2023 07:28:00 GMT  // 过期时间（HTTP/1.0）
```

**2. 协商缓存（会发请求到服务器验证）**
```http
// 基于最后修改时间
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT

// 基于内容哈希（更精确）
ETag: "33a64df5"
If-None-Match: "33a64df5"
```

### 缓存策略

```http
# 不缓存
Cache-Control: no-store

# 缓存但需要重新验证
Cache-Control: no-cache

# 私有缓存（仅浏览器）
Cache-Control: private, max-age=3600

# 公共缓存（CDN 等也可缓存）
Cache-Control: public, max-age=86400
```

## Cookie 和 Session

### Cookie

**设置 Cookie：**
```http
Set-Cookie: sessionId=abc123; Expires=Wed, 21 Oct 2023 07:28:00 GMT; 
            Path=/; Domain=.example.com; Secure; HttpOnly; SameSite=Strict
```

**属性说明：**
- `Expires/Max-Age` - 过期时间
- `Path` - Cookie 生效路径
- `Domain` - Cookie 生效域名
- `Secure` - 仅 HTTPS 传输
- `HttpOnly` - 禁止 JavaScript 访问
- `SameSite` - 跨站请求控制（Strict/Lax/None）

### Session

Session 是服务器端保存用户状态的机制：

```
1. 用户首次访问，服务器创建 Session，生成 Session ID
2. 服务器通过 Set-Cookie 将 Session ID 发送给客户端
3. 客户端后续请求携带 Cookie: sessionId=xxx
4. 服务器根据 Session ID 查找对应的 Session 数据
```

## 跨域 CORS

### 简单请求

满足以下条件的请求为简单请求：
- 方法：GET、HEAD、POST
- 头部：仅包含安全头部（Accept、Accept-Language 等）
- Content-Type：application/x-www-form-urlencoded、multipart/form-data、text/plain

```http
# 请求
GET /api/data HTTP/1.1
Origin: https://example.com

# 响应
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

### 预检请求（Preflight）

非简单请求会先发送 OPTIONS 预检请求：

```http
# 预检请求
OPTIONS /api/data HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Content-Type, Authorization

# 预检响应
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

## 实际应用示例

### 使用 fetch API

```javascript
// GET 请求
fetch('https://api.example.com/users')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST 请求
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: '张三', age: 25 })
});
```

### 使用 XMLHttpRequest

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/users', true);

xhr.setRequestHeader('Accept', 'application/json');
xhr.setRequestHeader('Authorization', 'Bearer token123');

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(JSON.parse(xhr.responseText));
    } else {
      console.error('请求失败:', xhr.statusText);
    }
  }
};

xhr.send();
```

## 学习建议

1. **理解基础**：掌握 HTTP 请求/响应的结构
2. **熟悉状态码**：能够快速定位问题
3. **实践调试**：使用浏览器开发者工具 Network 面板
4. **了解安全**：理解 HTTPS、CORS、CSRF 等安全机制
5. **性能优化**：掌握缓存策略和 HTTP/2 特性

## 推荐工具

- **浏览器 DevTools**：Network 面板分析请求
- **Postman/Insomnia**：API 测试工具
- **curl**：命令行 HTTP 客户端
- **Wireshark**：网络抓包分析
