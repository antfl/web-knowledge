/**
 * HTTP 模块测试
 */

// 在 Node.js 环境中运行测试
const { HTTPClient, HTTPError, HTTPStatus, CookieUtil, CacheControl, URLUtil } = require('./demo.js');

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

// ==================== 测试套件 ====================

console.log('🚀 开始 HTTP 模块测试\n');

// 1. URL 工具测试
test('URLUtil.parse - 解析完整 URL', () => {
  const url = 'https://user:pass@api.example.com:8080/users?id=123&name=test#section';
  const parsed = URLUtil.parse(url);
  
  assert(parsed.protocol === 'https:', '协议应该是 https:');
  assert(parsed.host === 'api.example.com:8080', '主机应该包含端口');
  assert(parsed.hostname === 'api.example.com', '主机名正确');
  assert(parsed.port === '8080', '端口正确');
  assert(parsed.pathname === '/users', '路径正确');
  assert(parsed.query.id === '123', '查询参数 id 正确');
  assert(parsed.query.name === 'test', '查询参数 name 正确');
  assert(parsed.hash === '#section', '锚点正确');
});

test('URLUtil.parseQuery - 解析查询字符串', () => {
  const query = '?name=张三&age=25&tags=js&tags=node';
  const parsed = URLUtil.parseQuery(query);
  
  assert(parsed.name === '张三', '解析中文字符');
  assert(parsed.age === '25', '解析数字字符串');
});

test('URLUtil.buildQuery - 构建查询字符串', () => {
  const params = { name: 'test', age: 25, tags: ['js', 'node'] };
  const query = URLUtil.buildQuery(params);

  assert(query.includes('name=test'), '包含 name 参数');
  assert(query.includes('age=25'), '包含 age 参数');
  assert(query.includes('tags%5B%5D=') || query.includes('tags[]='), '包含数组参数');
});

test('URLUtil.resolve - 合并 URL', () => {
  const base = 'https://example.com/path/';
  const relative = '../other/page.html';
  const resolved = URLUtil.resolve(base, relative);
  
  assert(resolved === 'https://example.com/other/page.html', 'URL 合并正确');
});

// 2. HTTP 状态码测试
test('HTTPStatus.getDescription - 获取状态码描述', () => {
  assert(HTTPStatus.getDescription(200) === '请求成功', '200 描述正确');
  assert(HTTPStatus.getDescription(404) === '资源不存在', '404 描述正确');
  assert(HTTPStatus.getDescription(500) === '服务器内部错误', '500 描述正确');
});

test('HTTPStatus.isSuccess - 判断成功状态码', () => {
  assert(HTTPStatus.isSuccess(200) === true, '200 是成功');
  assert(HTTPStatus.isSuccess(201) === true, '201 是成功');
  assert(HTTPStatus.isSuccess(404) === false, '404 不是成功');
});

test('HTTPStatus.isClientError - 判断客户端错误', () => {
  assert(HTTPStatus.isClientError(400) === true, '400 是客户端错误');
  assert(HTTPStatus.isClientError(404) === true, '404 是客户端错误');
  assert(HTTPStatus.isClientError(500) === false, '500 不是客户端错误');
});

test('HTTPStatus.isServerError - 判断服务器错误', () => {
  assert(HTTPStatus.isServerError(500) === true, '500 是服务器错误');
  assert(HTTPStatus.isServerError(502) === true, '502 是服务器错误');
  assert(HTTPStatus.isServerError(400) === false, '400 不是服务器错误');
});

// 3. 缓存控制测试
test('CacheControl.build - 构建缓存控制头部', () => {
  const header1 = CacheControl.build(3600, { isPublic: true });
  assert(header1.includes('public'), '包含 public');
  assert(header1.includes('max-age=3600'), '包含 max-age=3600');
  
  const header2 = CacheControl.build(0, { noStore: true });
  assert(header2 === 'no-store', 'no-store 正确');
});

test('CacheControl.parse - 解析缓存控制头部', () => {
  const header = 'public, max-age=3600, must-revalidate';
  const parsed = CacheControl.parse(header);
  
  assert(parsed.public === true, 'public 标志正确');
  assert(parsed['max-age'] === 3600, 'max-age 值正确');
  assert(parsed['must-revalidate'] === true, 'must-revalidate 标志正确');
});

// 4. HTTP 错误类测试
test('HTTPError - 错误类创建', () => {
  const error = new HTTPError(404, 'Not Found', null);
  assert(error.name === 'HTTPError', '错误名称正确');
  assert(error.status === 404, '状态码正确');
  assert(error.message === 'Not Found', '消息正确');
});

// 5. HTTPClient 测试
test('HTTPClient - 创建实例', () => {
  const client = new HTTPClient('https://api.example.com');
  assert(client.baseURL === 'https://api.example.com', '基础 URL 正确');
  assert(client.defaultHeaders['Content-Type'] === 'application/json', '默认头部正确');
});

test('HTTPClient.buildURL - 构建 URL', () => {
  const client = new HTTPClient('https://api.example.com');
  const url = client.buildURL('/users', { page: 1, limit: 10 });
  
  assert(url.includes('/users'), '包含路径');
  assert(url.includes('page=1'), '包含 page 参数');
  assert(url.includes('limit=10'), '包含 limit 参数');
});

test('HTTPClient.setHeader - 设置请求头', () => {
  const client = new HTTPClient();
  client.setHeader('Authorization', 'Bearer token123');
  
  assert(client.defaultHeaders['Authorization'] === 'Bearer token123', '自定义头部设置正确');
});

// ==================== 运行所有测试 ====================

console.log('\n' + '='.repeat(50));
console.log('✅ 所有测试通过!');
console.log('='.repeat(50));
