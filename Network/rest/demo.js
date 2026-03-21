/**
 * RESTful API 示例代码
 * 演示 REST API 的设计和实现
 */

// ==================== REST API 客户端 ====================

class RESTClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };
    this.timeout = options.timeout || 10000;
  }

  // 设置认证令牌
  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 构建 URL
  buildURL(path, params = {}) {
    const url = new URL(path, this.baseURL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    return url.toString();
  }

  // 发送请求
  async request(method, path, options = {}) {
    const url = this.buildURL(path, options.params);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: { ...this.defaultHeaders, ...options.headers },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 解析响应
      const data = await this.parseResponse(response);

      // 处理错误
      if (!response.ok) {
        throw new RESTError(response.status, data);
      }

      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new RESTError(408, { message: '请求超时' });
      }
      throw error;
    }
  }

  // 解析响应
  async parseResponse(response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  // HTTP 方法
  get(path, params, options = {}) {
    return this.request('GET', path, { ...options, params });
  }

  post(path, body, options = {}) {
    return this.request('POST', path, { ...options, body });
  }

  put(path, body, options = {}) {
    return this.request('PUT', path, { ...options, body });
  }

  patch(path, body, options = {}) {
    return this.request('PATCH', path, { ...options, body });
  }

  delete(path, options = {}) {
    return this.request('DELETE', path, options);
  }
}

// REST 错误类
class RESTError extends Error {
  constructor(status, data) {
    super(data.message || `HTTP ${status}`);
    this.name = 'RESTError';
    this.status = status;
    this.data = data;
  }
}

// ==================== REST 资源类 ====================

class RESTResource {
  constructor(client, resourcePath) {
    this.client = client;
    this.resourcePath = resourcePath;
  }

  // 获取列表
  async list(params = {}) {
    const response = await this.client.get(this.resourcePath, params);
    return new RESTCollection(response.data, response);
  }

  // 获取单个资源
  async get(id) {
    const response = await this.client.get(`${this.resourcePath}/${id}`);
    return new RESTItem(response.data, response);
  }

  // 创建资源
  async create(data) {
    const response = await this.client.post(this.resourcePath, data);
    return new RESTItem(response.data, response);
  }

  // 更新资源（全量）
  async update(id, data) {
    const response = await this.client.put(`${this.resourcePath}/${id}`, data);
    return new RESTItem(response.data, response);
  }

  // 部分更新资源
  async patch(id, data) {
    const response = await this.client.patch(`${this.resourcePath}/${id}`, data);
    return new RESTItem(response.data, response);
  }

  // 删除资源
  async delete(id) {
    await this.client.delete(`${this.resourcePath}/${id}`);
    return true;
  }

  // 嵌套资源
  nested(nestedPath) {
    return {
      list: (parentId, params) => 
        this.client.get(`${this.resourcePath}/${parentId}/${nestedPath}`, params),
      create: (parentId, data) => 
        this.client.post(`${this.resourcePath}/${parentId}/${nestedPath}`, data),
      get: (parentId, nestedId) => 
        this.client.get(`${this.resourcePath}/${parentId}/${nestedPath}/${nestedId}`)
    };
  }
}

// REST 集合（列表响应）
class RESTCollection {
  constructor(data, response) {
    this.items = data.data || data;
    this.meta = data.meta || {};
    this.links = data.links || {};
    this.response = response;
  }

  // 获取分页信息
  get pagination() {
    return {
      page: this.meta.page,
      limit: this.meta.limit,
      total: this.meta.total,
      totalPages: this.meta.totalPages
    };
  }

  // 是否有下一页
  get hasNext() {
    return !!this.links.next;
  }

  // 是否有上一页
  get hasPrev() {
    return !!this.links.prev;
  }

  // 遍历
  forEach(callback) {
    this.items.forEach(callback);
  }

  // 映射
  map(callback) {
    return this.items.map(callback);
  }
}

// REST 单项（单个资源）
class RESTItem {
  constructor(data, response) {
    Object.assign(this, data);
    this._links = data._links || {};
    this.response = response;
  }

  // 获取关联链接
  getLink(rel) {
    return this._links[rel]?.href;
  }

  // 获取所有链接
  get links() {
    return this._links;
  }
}

// ==================== 查询参数构建器 ====================

class QueryBuilder {
  constructor() {
    this.params = {};
  }

  // 过滤
  where(field, operator, value) {
    if (value === undefined) {
      value = operator;
      operator = 'eq';
    }
    this.params[`${field}[${operator}]`] = value;
    return this;
  }

  // 等于
  eq(field, value) {
    return this.where(field, 'eq', value);
  }

  // 不等于
  ne(field, value) {
    return this.where(field, 'ne', value);
  }

  // 大于
  gt(field, value) {
    return this.where(field, 'gt', value);
  }

  // 大于等于
  gte(field, value) {
    return this.where(field, 'gte', value);
  }

  // 小于
  lt(field, value) {
    return this.where(field, 'lt', value);
  }

  // 小于等于
  lte(field, value) {
    return this.where(field, 'lte', value);
  }

  // 包含
  in(field, values) {
    this.params[`${field}[in]`] = Array.isArray(values) ? values.join(',') : values;
    return this;
  }

  // 模糊查询
  like(field, value) {
    return this.where(field, 'like', value);
  }

  // 排序
  sort(field, direction = 'asc') {
    const prefix = direction === 'desc' ? '-' : '';
    this.params.sort = this.params.sort 
      ? `${this.params.sort},${prefix}${field}`
      : `${prefix}${field}`;
    return this;
  }

  // 分页
  page(page, limit = 10) {
    this.params.page = page;
    this.params.limit = limit;
    return this;
  }

  // 偏移分页
  offset(offset, limit = 10) {
    this.params.offset = offset;
    this.params.limit = limit;
    return this;
  }

  // 游标分页
  cursor(cursor, limit = 10) {
    this.params.cursor = cursor;
    this.params.limit = limit;
    return this;
  }

  // 字段选择
  select(fields) {
    this.params.fields = Array.isArray(fields) ? fields.join(',') : fields;
    return this;
  }

  // 构建参数对象
  build() {
    return { ...this.params };
  }
}

// ==================== 响应格式化器 ====================

const ResponseFormatter = {
  // 成功响应
  success(data, meta = {}) {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    };
  },

  // 列表响应
  collection(items, pagination = {}, links = {}) {
    return {
      success: true,
      data: items,
      meta: {
        timestamp: new Date().toISOString(),
        ...pagination
      },
      links
    };
  },

  // 错误响应
  error(code, message, details = null, status = 400) {
    const response = {
      success: false,
      error: {
        code,
        message,
        status
      }
    };
    if (details) {
      response.error.details = details;
    }
    return response;
  },

  // 验证错误
  validationError(errors) {
    return this.error(
      'VALIDATION_ERROR',
      '请求参数验证失败',
      errors,
      422
    );
  },

  // 未找到
  notFound(resource, id) {
    return this.error(
      'NOT_FOUND',
      `${resource} 不存在`,
      { resource, id },
      404
    );
  },

  // HATEOAS 响应
  withLinks(data, links) {
    return {
      ...data,
      _links: links
    };
  }
};

// ==================== 分页策略 ====================

const Pagination = {
  // 页码分页
  offset(items, page = 1, limit = 10) {
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      data: paginatedItems,
      meta: {
        page,
        limit,
        total,
        totalPages
      },
      links: {
        self: `?page=${page}&limit=${limit}`,
        first: `?page=1&limit=${limit}`,
        prev: page > 1 ? `?page=${page - 1}&limit=${limit}` : null,
        next: page < totalPages ? `?page=${page + 1}&limit=${limit}` : null,
        last: `?page=${totalPages}&limit=${limit}`
      }
    };
  },

  // 游标分页
  cursor(items, cursorField = 'id') {
    return {
      data: items,
      meta: {
        nextCursor: items.length > 0 ? items[items.length - 1][cursorField] : null,
        hasMore: items.length === limit
      }
    };
  }
};

// ==================== 模拟 API 服务器 ====================

class MockRESTServer {
  constructor() {
    this.data = {
      users: [
        { id: '1', name: '张三', email: 'zhangsan@example.com', age: 25, status: 'active' },
        { id: '2', name: '李四', email: 'lisi@example.com', age: 30, status: 'active' },
        { id: '3', name: '王五', email: 'wangwu@example.com', age: 28, status: 'inactive' },
        { id: '4', name: '赵六', email: 'zhaoliu@example.com', age: 35, status: 'active' },
        { id: '5', name: '孙七', email: 'sunqi@example.com', age: 22, status: 'active' }
      ],
      orders: [
        { id: '1', userId: '1', amount: 100, status: 'completed' },
        { id: '2', userId: '1', amount: 200, status: 'pending' },
        { id: '3', userId: '2', amount: 150, status: 'completed' }
      ]
    };
    this.nextId = 6;
  }

  // 处理请求
  async handleRequest(method, path, body = null, params = {}) {
    const url = new URL(path, 'http://localhost');
    const pathname = url.pathname;
    const searchParams = Object.fromEntries(url.searchParams);

    // 解析路径
    const parts = pathname.split('/').filter(p => p);
    const resource = parts[0];
    const id = parts[1];
    const nestedResource = parts[2];
    const nestedId = parts[3];

    // 路由处理
    if (resource === 'users') {
      return this.handleUsers(method, id, nestedResource, nestedId, body, searchParams);
    }

    return ResponseFormatter.error('NOT_FOUND', '资源不存在', null, 404);
  }

  // 处理用户资源
  handleUsers(method, id, nestedResource, nestedId, body, params) {
    const users = this.data.users;

    switch (method) {
      case 'GET':
        if (nestedResource === 'orders' && id) {
          // GET /users/:id/orders
          const userOrders = this.data.orders.filter(o => o.userId === id);
          return ResponseFormatter.success(userOrders);
        }
        
        if (id) {
          // GET /users/:id
          const user = users.find(u => u.id === id);
          if (!user) {
            return ResponseFormatter.notFound('User', id);
          }
          return ResponseFormatter.success(
            ResponseFormatter.withLinks(user, {
              self: { href: `/users/${id}` },
              orders: { href: `/users/${id}/orders` }
            })
          );
        }
        
        // GET /users (支持过滤和分页)
        let result = [...users];
        
        // 过滤
        if (params.status) {
          result = result.filter(u => u.status === params.status);
        }
        if (params.age_gte) {
          result = result.filter(u => u.age >= parseInt(params.age_gte));
        }
        
        // 分页
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const paginated = Pagination.offset(result, page, limit);
        
        return ResponseFormatter.collection(
          paginated.data,
          paginated.meta,
          paginated.links
        );

      case 'POST':
        // POST /users
        const newUser = {
          id: String(this.nextId++),
          ...body,
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        return ResponseFormatter.success(newUser);

      case 'PUT':
        // PUT /users/:id
        const putIndex = users.findIndex(u => u.id === id);
        if (putIndex === -1) {
          return ResponseFormatter.notFound('User', id);
        }
        users[putIndex] = { ...body, id };
        return ResponseFormatter.success(users[putIndex]);

      case 'PATCH':
        // PATCH /users/:id
        const patchIndex = users.findIndex(u => u.id === id);
        if (patchIndex === -1) {
          return ResponseFormatter.notFound('User', id);
        }
        users[patchIndex] = { ...users[patchIndex], ...body };
        return ResponseFormatter.success(users[patchIndex]);

      case 'DELETE':
        // DELETE /users/:id
        const deleteIndex = users.findIndex(u => u.id === id);
        if (deleteIndex === -1) {
          return ResponseFormatter.notFound('User', id);
        }
        users.splice(deleteIndex, 1);
        return ResponseFormatter.success(null);

      default:
        return ResponseFormatter.error('METHOD_NOT_ALLOWED', '方法不允许', null, 405);
    }
  }
}

// ==================== 演示函数 ====================

async function demonstrateREST() {
  console.log('=== RESTful API 演示 ===\n');

  const server = new MockRESTServer();

  // 1. 获取用户列表
  console.log('1. 获取用户列表:');
  let response = await server.handleRequest('GET', '/users?page=1&limit=3');
  console.log('  状态:', response.success ? '✓ 成功' : '✗ 失败');
  console.log('  用户数量:', response.data.length);
  console.log('  分页信息:', JSON.stringify(response.meta, null, 2));

  // 2. 获取单个用户
  console.log('\n2. 获取单个用户 (ID: 1):');
  response = await server.handleRequest('GET', '/users/1');
  console.log('  用户:', JSON.stringify(response.data, null, 2));

  // 3. 过滤用户
  console.log('\n3. 过滤活跃用户:');
  response = await server.handleRequest('GET', '/users?status=active');
  console.log('  活跃用户数量:', response.data.length);

  // 4. 创建用户
  console.log('\n4. 创建新用户:');
  response = await server.handleRequest('POST', '/users', {
    name: '周八',
    email: 'zhouba@example.com',
    age: 29,
    status: 'active'
  });
  console.log('  创建的用户:', JSON.stringify(response.data, null, 2));

  // 5. 部分更新用户
  console.log('\n5. 部分更新用户 (ID: 1):');
  response = await server.handleRequest('PATCH', '/users/1', { age: 26 });
  console.log('  更新后的用户:', JSON.stringify(response.data, null, 2));

  // 6. 获取用户订单
  console.log('\n6. 获取用户订单 (User ID: 1):');
  response = await server.handleRequest('GET', '/users/1/orders');
  console.log('  订单数量:', response.data.length);

  // 7. 删除用户
  console.log('\n7. 删除用户 (ID: 2):');
  response = await server.handleRequest('DELETE', '/users/2');
  console.log('  删除结果:', response.success ? '✓ 成功' : '✗ 失败');

  // 8. 查询不存在的用户
  console.log('\n8. 查询不存在的用户 (ID: 999):');
  response = await server.handleRequest('GET', '/users/999');
  console.log('  错误码:', response.error?.code);
  console.log('  错误信息:', response.error?.message);

  // 9. 查询构建器演示
  console.log('\n9. 查询构建器演示:');
  const query = new QueryBuilder()
    .eq('status', 'active')
    .gte('age', 25)
    .sort('created_at', 'desc')
    .page(1, 10)
    .select(['id', 'name', 'email'])
    .build();
  console.log('  构建的查询参数:', JSON.stringify(query, null, 2));

  console.log('\n=== 演示完成 ===');
}

// 运行演示
demonstrateREST().catch(console.error);

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RESTClient,
    RESTResource,
    RESTCollection,
    RESTItem,
    RESTError,
    QueryBuilder,
    ResponseFormatter,
    Pagination,
    MockRESTServer
  };
}
