# RESTful API

REST（Representational State Transfer）是一种软件架构风格，用于设计网络应用程序的 API。

## 目录

1. [REST 基础](#rest-基础)
2. [REST 设计原则](#rest-设计原则)
3. [URI 设计](#uri-设计)
4. [HTTP 方法](#http-方法)
5. [状态码](#状态码)
6. [请求与响应格式](#请求与响应格式)
7. [版本控制](#版本控制)
8. [认证与授权](#认证与授权)
9. [分页与过滤](#分页与过滤)
10. [HATEOAS](#hateoas)
11. [最佳实践](#最佳实践)

## REST 基础

### 什么是 REST

REST 是由 Roy Fielding 在 2000 年提出的架构风格，它利用 HTTP 协议的特性来构建可扩展的 Web 服务。

**核心概念：**
- **资源（Resource）**：网络上的任何信息都可以抽象为资源
- **表现层（Representation）**：资源的具体呈现形式（JSON、XML 等）
- **状态转移（State Transfer）**：通过 HTTP 方法操作资源的状态

### REST 架构约束

1. **客户端-服务器架构**：分离关注点，提高可移植性
2. **无状态**：每个请求包含所有必要信息，服务器不保存客户端状态
3. **可缓存**：响应必须明确定义是否可缓存
4. **统一接口**：使用标准的 HTTP 方法和状态码
5. **分层系统**：客户端不需要知道是否直接连接到服务器
6. **按需代码（可选）**：服务器可以扩展客户端功能

## REST 设计原则

### 资源导向

一切皆资源，使用名词而非动词：

```
✓ GET /users          # 获取用户列表
✓ GET /users/123      # 获取特定用户
✗ GET /getUsers       # 避免使用动词
✗ GET /getUserById    # 避免使用动词
```

### 使用复数名词

```
✓ GET /users
✓ GET /orders
✗ GET /user
✗ GET /order
```

### 正确的 HTTP 方法

| 操作 | HTTP 方法 | 幂等性 |
|------|-----------|--------|
| 查询 | GET | 是 |
| 创建 | POST | 否 |
| 全量更新 | PUT | 是 |
| 部分更新 | PATCH | 否 |
| 删除 | DELETE | 是 |

## URI 设计

### 基本规则

```
# 集合资源
GET    /users              # 获取所有用户
POST   /users              # 创建新用户

# 单个资源
GET    /users/123          # 获取 ID 为 123 的用户
PUT    /users/123          # 更新 ID 为 123 的用户
PATCH  /users/123          # 部分更新 ID 为 123 的用户
DELETE /users/123          # 删除 ID 为 123 的用户
```

### 资源嵌套

```
# 获取用户的订单
GET /users/123/orders

# 获取用户的特定订单
GET /users/123/orders/456

# 创建用户的订单
POST /users/123/orders
```

### 过滤、排序、分页

```
# 过滤
GET /users?status=active
GET /users?age[gte]=18&age[lte]=60
GET /products?category=electronics&price[lte]=1000

# 排序
GET /users?sort=created_at              # 升序
GET /users?sort=-created_at             # 降序
GET /users?sort=age,-name               # 多字段排序

# 分页
GET /users?page=2&limit=10              # 页码分页
GET /users?offset=20&limit=10           # 偏移分页
GET /users?cursor=xxx&limit=10          # 游标分页

# 字段选择
GET /users?fields=id,name,email         # 只返回指定字段
```

### 避免的操作

```
# 避免使用动词
✗ GET /getUsers
✗ POST /createUser
✗ PUT /updateUser
✗ DELETE /deleteUser

# 避免使用动作
✗ GET /users/123/activate
✗ POST /users/123/sendEmail

# 应该使用资源表示
✓ PATCH /users/123 { "status": "active" }
✓ POST /emails { "userId": 123, ... }
```

## HTTP 方法

### GET - 获取资源

```http
GET /users/123 HTTP/1.1
Host: api.example.com
Accept: application/json
```

**特性：**
- 安全且幂等
- 可被缓存
- 参数在 URL 中
- 有长度限制

### POST - 创建资源

```http
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

**特性：**
- 非幂等（多次调用会创建多个资源）
- 不可缓存
- 参数在请求体中
- 用于创建资源或触发操作

### PUT - 全量更新

```http
PUT /users/123 HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "id": "123",
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 25
}
```

**特性：**
- 幂等
- 替换整个资源
- 如果资源不存在，可能创建新资源

### PATCH - 部分更新

```http
PATCH /users/123 HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "age": 26
}
```

**特性：**
- 非幂等（取决于实现）
- 只更新提供的字段
- 更节省带宽

### DELETE - 删除资源

```http
DELETE /users/123 HTTP/1.1
Host: api.example.com
```

**特性：**
- 幂等
- 删除后再次删除应返回 404 或 204

## 状态码

### 成功状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 OK | 请求成功 | GET、PUT、PATCH、DELETE |
| 201 Created | 创建成功 | POST |
| 202 Accepted | 已接受 | 异步处理 |
| 204 No Content | 无内容 | DELETE、空的 PUT/PATCH |

### 客户端错误

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 400 Bad Request | 请求格式错误 | 参数验证失败 |
| 401 Unauthorized | 未认证 | 缺少认证信息 |
| 403 Forbidden | 无权限 | 权限不足 |
| 404 Not Found | 资源不存在 | 资源 ID 不存在 |
| 405 Method Not Allowed | 方法不允许 | 使用了错误的 HTTP 方法 |
| 409 Conflict | 资源冲突 | 唯一约束冲突 |
| 422 Unprocessable Entity | 语义错误 | 业务逻辑错误 |
| 429 Too Many Requests | 请求过多 | 限流 |

### 服务器错误

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 500 Internal Server Error | 服务器错误 | 未预期的错误 |
| 502 Bad Gateway | 网关错误 | 上游服务错误 |
| 503 Service Unavailable | 服务不可用 | 维护或过载 |

## 请求与响应格式

### 请求格式

```http
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json
Authorization: Bearer token123

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 25
}
```

### 成功响应格式

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /users/123

{
  "id": "123",
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 25,
  "createdAt": "2024-01-15T08:30:00Z",
  "updatedAt": "2024-01-15T08:30:00Z"
}
```

### 错误响应格式

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      },
      {
        "field": "age",
        "message": "年龄必须在 18-120 之间"
      }
    ]
  }
}
```

### 列表响应格式

```json
{
  "data": [
    { "id": "1", "name": "张三" },
    { "id": "2", "name": "李四" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "links": {
    "self": "/users?page=1&limit=10",
    "first": "/users?page=1&limit=10",
    "prev": null,
    "next": "/users?page=2&limit=10",
    "last": "/users?page=10&limit=10"
  }
}
```

## 版本控制

### URL 路径版本

```
/v1/users
/v2/users
```

**优点：** 简单直观，易于缓存
**缺点：** URL 变更，破坏 REST 原则

### 请求头版本

```http
GET /users HTTP/1.1
Host: api.example.com
Accept: application/vnd.api.v2+json
```

**优点：** URL 保持不变
**缺点：** 不够直观，需要文档说明

### 查询参数版本

```
/users?version=2
/users?v=2
```

**优点：** 简单
**缺点：** 不够规范，可能被缓存问题

## 认证与授权

### API Key

```http
GET /users HTTP/1.1
X-API-Key: your-api-key
```

### Bearer Token (JWT)

```http
GET /users HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### OAuth 2.0

```http
GET /users HTTP/1.1
Authorization: Bearer access_token
```

## 分页与过滤

### 页码分页

```
GET /users?page=1&limit=10
```

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 游标分页

```
GET /users?cursor=eyJpZCI6MTB9&limit=10
```

```json
{
  "data": [...],
  "meta": {
    "nextCursor": "eyJpZCI6MjB9",
    "hasMore": true
  }
}
```

**游标分页优点：**
- 数据一致性更好
- 适合实时数据
- 性能更好

### 过滤语法

```
# 精确匹配
GET /users?status=active

# 范围查询
GET /users?age[gte]=18&age[lte]=60
GET /products?price[gt]=100&price[lt]=1000

# 包含查询
GET /users?role[in]=admin,moderator

# 模糊查询
GET /users?name[like]=张%

# 排除查询
GET /users?status[ne]=deleted
```

## HATEOAS

HATEOAS（Hypermedia as the Engine of Application State）是 REST 的最高成熟度级别。

```json
{
  "id": "123",
  "name": "张三",
  "email": "zhangsan@example.com",
  "_links": {
    "self": {
      "href": "/users/123"
    },
    "orders": {
      "href": "/users/123/orders"
    },
    "edit": {
      "href": "/users/123",
      "method": "PATCH"
    },
    "delete": {
      "href": "/users/123",
      "method": "DELETE"
    }
  }
}
```

**优点：**
- API 可发现性强
- 客户端无需硬编码 URL
- 服务端可以灵活变更 URL

**缺点：**
- 增加了响应大小
- 客户端需要解析链接
- 实现复杂

## 最佳实践

### 1. 使用 HTTPS

始终使用 HTTPS 保护 API 通信。

### 2. 使用标准 HTTP 状态码

不要自定义状态码，使用标准的 HTTP 状态码。

### 3. 提供有意义的错误信息

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "用户不存在",
    "details": {
      "userId": "123"
    }
  }
}
```

### 4. 支持过滤、排序、分页

不要一次性返回所有数据。

### 5. 使用复数名词

```
/users 而不是 /user
/orders 而不是 /order
```

### 6. 正确处理 HTTP 方法

- GET 不应该有副作用
- PUT 应该是幂等的
- POST 用于创建资源

### 7. 使用合适的 Content-Type

```http
Content-Type: application/json
Accept: application/json
```

### 8. API 文档

使用 OpenAPI（Swagger）规范文档：

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: 获取用户列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        200:
          description: 成功
```

### 9. 限流

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

### 10. 缓存控制

```http
Cache-Control: max-age=3600
ETag: "abc123"
```

## 学习建议

1. **理解 REST 原则**：资源、表现层、状态转移
2. **实践设计**：设计一套完整的 RESTful API
3. **阅读优秀 API**：GitHub API、Stripe API 等
4. **使用工具**：Postman、Swagger 等
5. **关注安全**：认证、授权、HTTPS、输入验证
