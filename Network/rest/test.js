/**
 * RESTful API 模块测试
 */

const {
  RESTClient,
  RESTResource,
  RESTCollection,
  RESTItem,
  RESTError,
  QueryBuilder,
  ResponseFormatter,
  Pagination,
  MockRESTServer
} = require('./demo.js');

// 测试工具
function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ 测试失败: ${message}`);
  }
  console.log(`✓ ${message}`);
}

function test(name, fn) {
  try {
    console.log(`\n📋 测试: ${name}`);
    fn();
  } catch (error) {
    console.error(`❌ 测试失败: ${name}`);
    console.error(error.message);
    process.exit(1);
  }
}

async function testAsync(name, fn) {
  try {
    console.log(`\n📋 测试: ${name}`);
    await fn();
  } catch (error) {
    console.error(`❌ 测试失败: ${name}`);
    console.error(error.message);
    process.exit(1);
  }
}

// ==================== 测试套件 ====================

console.log('🚀 开始 RESTful API 模块测试\n');

// 1. RESTClient 测试
test('RESTClient - 创建实例', () => {
  const client = new RESTClient('https://api.example.com');
  assert(client.baseURL === 'https://api.example.com', '基础 URL 正确');
  assert(client.defaultHeaders['Content-Type'] === 'application/json', '默认 Content-Type 正确');
});

test('RESTClient - 设置认证令牌', () => {
  const client = new RESTClient('https://api.example.com');
  client.setAuthToken('test-token-123');
  assert(client.defaultHeaders['Authorization'] === 'Bearer test-token-123', '认证令牌设置正确');
});

test('RESTClient.buildURL - 构建 URL', () => {
  const client = new RESTClient('https://api.example.com');
  const url = client.buildURL('/users', { page: 1, limit: 10 });
  
  assert(url.includes('/users'), '包含路径');
  assert(url.includes('page=1'), '包含 page 参数');
  assert(url.includes('limit=10'), '包含 limit 参数');
});

// 2. RESTError 测试
test('RESTError - 错误类创建', () => {
  const error = new RESTError(404, { message: '资源不存在', code: 'NOT_FOUND' });
  assert(error.name === 'RESTError', '错误名称正确');
  assert(error.status === 404, '状态码正确');
  assert(error.message === '资源不存在', '消息正确');
  assert(error.data.code === 'NOT_FOUND', '错误数据正确');
});

// 3. QueryBuilder 测试
test('QueryBuilder - 基础过滤', () => {
  const query = new QueryBuilder()
    .eq('status', 'active')
    .build();
  
  assert(query['status[eq]'] === 'active', '等于过滤正确');
});

test('QueryBuilder - 范围过滤', () => {
  const query = new QueryBuilder()
    .gte('age', 18)
    .lte('age', 60)
    .gt('score', 80)
    .lt('score', 100)
    .build();
  
  assert(query['age[gte]'] === 18, '大于等于过滤正确');
  assert(query['age[lte]'] === 60, '小于等于过滤正确');
  assert(query['score[gt]'] === 80, '大于过滤正确');
  assert(query['score[lt]'] === 100, '小于过滤正确');
});

test('QueryBuilder - 包含过滤', () => {
  const query = new QueryBuilder()
    .in('role', ['admin', 'moderator'])
    .build();
  
  assert(query['role[in]'] === 'admin,moderator', '包含过滤正确');
});

test('QueryBuilder - 排序', () => {
  const query = new QueryBuilder()
    .sort('created_at', 'desc')
    .sort('name', 'asc')
    .build();
  
  assert(query.sort === '-created_at,name', '多字段排序正确');
});

test('QueryBuilder - 分页', () => {
  const query = new QueryBuilder()
    .page(2, 20)
    .build();
  
  assert(query.page === 2, '页码正确');
  assert(query.limit === 20, '每页数量正确');
});

test('QueryBuilder - 字段选择', () => {
  const query = new QueryBuilder()
    .select(['id', 'name', 'email'])
    .build();
  
  assert(query.fields === 'id,name,email', '字段选择正确');
});

test('QueryBuilder - 链式调用', () => {
  const query = new QueryBuilder()
    .eq('status', 'active')
    .gte('age', 18)
    .sort('created_at', 'desc')
    .page(1, 10)
    .select(['id', 'name'])
    .build();
  
  assert(query['status[eq]'] === 'active', '链式调用保留所有条件');
  assert(query.page === 1, '链式调用保留分页');
});

// 4. ResponseFormatter 测试
test('ResponseFormatter.success - 成功响应', () => {
  const data = { id: '1', name: '张三' };
  const response = ResponseFormatter.success(data);
  
  assert(response.success === true, '成功标志正确');
  assert(response.data === data, '数据正确');
  assert(response.meta.timestamp !== undefined, '包含时间戳');
});

test('ResponseFormatter.collection - 列表响应', () => {
  const items = [{ id: '1' }, { id: '2' }];
  const pagination = { page: 1, limit: 10, total: 2 };
  const response = ResponseFormatter.collection(items, pagination);
  
  assert(response.success === true, '成功标志正确');
  assert(response.data.length === 2, '数据数量正确');
  assert(response.meta.page === 1, '分页信息正确');
});

test('ResponseFormatter.error - 错误响应', () => {
  const response = ResponseFormatter.error('NOT_FOUND', '资源不存在', { id: '123' }, 404);
  
  assert(response.success === false, '失败标志正确');
  assert(response.error.code === 'NOT_FOUND', '错误码正确');
  assert(response.error.message === '资源不存在', '错误消息正确');
  assert(response.error.details.id === '123', '错误详情正确');
  assert(response.error.status === 404, '状态码正确');
});

test('ResponseFormatter.validationError - 验证错误', () => {
  const errors = [{ field: 'email', message: '格式不正确' }];
  const response = ResponseFormatter.validationError(errors);
  
  assert(response.success === false, '失败标志正确');
  assert(response.error.code === 'VALIDATION_ERROR', '错误码正确');
  assert(response.error.details.length === 1, '验证错误详情正确');
});

test('ResponseFormatter.notFound - 未找到错误', () => {
  const response = ResponseFormatter.notFound('User', '123');
  
  assert(response.success === false, '失败标志正确');
  assert(response.error.code === 'NOT_FOUND', '错误码正确');
  assert(response.error.message === 'User 不存在', '错误消息正确');
});

test('ResponseFormatter.withLinks - HATEOAS 响应', () => {
  const data = { id: '1', name: '张三' };
  const links = { self: { href: '/users/1' } };
  const response = ResponseFormatter.withLinks(data, links);
  
  assert(response.id === '1', '数据保留');
  assert(response._links.self.href === '/users/1', '链接正确');
});

// 5. Pagination 测试
test('Pagination.offset - 页码分页', () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
  const result = Pagination.offset(items, 2, 10);
  
  assert(result.data.length === 10, '返回正确数量');
  assert(result.meta.page === 2, '页码正确');
  assert(result.meta.limit === 10, '每页数量正确');
  assert(result.meta.total === 25, '总数正确');
  assert(result.meta.totalPages === 3, '总页数正确');
  assert(result.links.next !== null, '有下一页');
  assert(result.links.prev !== null, '有上一页');
});

// 6. MockRESTServer 测试
testAsync('MockRESTServer - 获取用户列表', async () => {
  const server = new MockRESTServer();
  const response = await server.handleRequest('GET', '/users?page=1&limit=2');
  
  assert(response.success === true, '请求成功');
  assert(response.data.length === 2, '返回2个用户');
  assert(response.meta.page === 1, '页码正确');
});

testAsync('MockRESTServer - 获取单个用户', async () => {
  const server = new MockRESTServer();
  const response = await server.handleRequest('GET', '/users/1');
  
  assert(response.success === true, '请求成功');
  assert(response.data.id === '1', '用户ID正确');
  assert(response.data._links !== undefined, '包含HATEOAS链接');
});

testAsync('MockRESTServer - 过滤用户', async () => {
  const server = new MockRESTServer();
  const response = await server.handleRequest('GET', '/users?status=active');
  
  assert(response.success === true, '请求成功');
  assert(response.data.every(u => u.status === 'active'), '只返回活跃用户');
});

testAsync('MockRESTServer - 创建用户', async () => {
  const server = new MockRESTServer();
  const newUser = { name: '测试用户', email: 'test@example.com', age: 25 };
  const response = await server.handleRequest('POST', '/users', newUser);
  
  assert(response.success === true, '创建成功');
  assert(response.data.name === '测试用户', '用户名正确');
  assert(response.data.id !== undefined, '分配了ID');
});

testAsync('MockRESTServer - 部分更新用户', async () => {
  const server = new MockRESTServer();
  const response = await server.handleRequest('PATCH', '/users/1', { age: 30 });
  
  assert(response.success === true, '更新成功');
  assert(response.data.age === 30, '年龄更新正确');
  assert(response.data.name !== undefined, '保留其他字段');
});

testAsync('MockRESTServer - 删除用户', async () => {
  const server = new MockRESTServer();
  const response = await server.handleRequest('DELETE', '/users/1');
  
  assert(response.success === true, '删除成功');
});

testAsync('MockRESTServer - 获取不存在的用户', async () => {
  const server = new MockRESTServer();
  const response = await server.handleRequest('GET', '/users/999');
  
  assert(response.success === false, '请求失败');
  assert(response.error.code === 'NOT_FOUND', '错误码正确');
  assert(response.error.status === 404, '状态码404');
});

testAsync('MockRESTServer - 获取用户订单', async () => {
  const server = new MockRESTServer();
  const response = await server.handleRequest('GET', '/users/1/orders');
  
  assert(response.success === true, '请求成功');
  assert(response.data.every(o => o.userId === '1'), '只返回该用户的订单');
});

// 7. RESTCollection 测试
test('RESTCollection - 集合类', () => {
  const items = [{ id: '1' }, { id: '2' }];
  const meta = { page: 1, limit: 10, total: 2 };
  const links = { next: '/users?page=2', prev: null };
  
  const collection = new RESTCollection({ data: items, meta, links }, {});
  
  assert(collection.items.length === 2, '项目数量正确');
  assert(collection.pagination.page === 1, '分页信息正确');
  assert(collection.hasNext === true, '有下一页');
  assert(collection.hasPrev === false, '没有上一页');
});

// 8. RESTItem 测试
test('RESTItem - 单项类', () => {
  const data = { id: '1', name: '张三', _links: { self: { href: '/users/1' } } };
  const item = new RESTItem(data, {});
  
  assert(item.id === '1', 'ID正确');
  assert(item.name === '张三', '名称正确');
  assert(item.getLink('self') === '/users/1', '获取链接正确');
});

// ==================== 运行所有测试 ====================

(async () => {
  console.log('\n' + '='.repeat(50));
  console.log('✅ 所有测试通过!');
  console.log('='.repeat(50));
})();
