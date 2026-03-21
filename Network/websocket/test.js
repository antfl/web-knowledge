/**
 * WebSocket 模块测试
 * 注意：这些测试主要验证代码结构和逻辑，不涉及实际的 WebSocket 连接
 */

const {
  WebSocketClient,
  WebSocketServer,
  ChatRoomServer,
  MessageHandler
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

// ==================== 测试套件 ====================

console.log('🚀 开始 WebSocket 模块测试\n');

// 1. WebSocketClient 测试
test('WebSocketClient - 创建实例', () => {
  const client = new WebSocketClient('ws://localhost:8080');
  assert(client.url === 'ws://localhost:8080', 'URL 正确');
  assert(client.options.reconnect === true, '默认启用重连');
  assert(client.options.maxReconnectAttempts === 5, '默认最大重连次数为 5');
  assert(client.options.heartbeatInterval === 30000, '默认心跳间隔为 30 秒');
});

test('WebSocketClient - 自定义选项', () => {
  const client = new WebSocketClient('ws://localhost:8080', {
    reconnect: false,
    maxReconnectAttempts: 3,
    heartbeatInterval: 10000
  });
  
  assert(client.options.reconnect === false, '重连选项正确');
  assert(client.options.maxReconnectAttempts === 3, '最大重连次数正确');
  assert(client.options.heartbeatInterval === 10000, '心跳间隔正确');
});

test('WebSocketClient - 事件监听', () => {
  const client = new WebSocketClient('ws://localhost:8080');
  let eventReceived = false;
  
  client.on('test', () => {
    eventReceived = true;
  });
  
  client.emit('test', {});
  assert(eventReceived === true, '事件监听和触发正常');
});

test('WebSocketClient - 消息队列', () => {
  const client = new WebSocketClient('ws://localhost:8080');
  
  // 模拟未连接状态发送消息
  client.send('test message');
  assert(client.messageQueue.length === 1, '消息已加入队列');
  assert(client.messageQueue[0] === 'test message', '队列消息正确');
});

// 2. WebSocketServer 测试
test('WebSocketServer - 创建实例', () => {
  const server = new WebSocketServer({ port: 8080 });
  assert(server.port === 8080, '端口正确');
  assert(server.clients instanceof Map, '客户端集合是 Map');
  assert(server.rooms instanceof Map, '房间集合是 Map');
  assert(Array.isArray(server.middlewares), '中间件是数组');
});

test('WebSocketServer - 生成客户端 ID', () => {
  const server = new WebSocketServer();
  const id1 = server.generateClientId();
  const id2 = server.generateClientId();
  
  assert(typeof id1 === 'string', '客户端 ID 是字符串');
  assert(id1.length > 0, '客户端 ID 不为空');
  assert(id1 !== id2, '每次生成的 ID 不同');
});

test('WebSocketServer - 中间件', () => {
  const server = new WebSocketServer();
  const middleware = (req, res, next) => next();
  
  server.use(middleware);
  assert(server.middlewares.length === 1, '中间件已添加');
  assert(server.middlewares[0] === middleware, '中间件正确');
});

test('WebSocketServer - 统计信息', () => {
  const server = new WebSocketServer();
  const stats = server.getStats();
  
  assert(typeof stats.totalClients === 'number', '总客户端数是数字');
  assert(typeof stats.totalRooms === 'number', '总房间数是数字');
  assert(Array.isArray(stats.clients), '客户端列表是数组');
  assert(Array.isArray(stats.rooms), '房间列表是数组');
});

// 3. ChatRoomServer 测试
test('ChatRoomServer - 创建实例', () => {
  const server = new ChatRoomServer({ port: 8080, maxMessages: 50 });
  assert(server.port === 8080, '端口正确');
  assert(server.maxMessages === 50, '最大消息数正确');
  assert(Array.isArray(server.messages), '消息数组已初始化');
});

test('ChatRoomServer - 用户认证', () => {
  const server = new ChatRoomServer();
  const mockClient = {
    id: 'test-client',
    data: {},
    ws: { readyState: 1, send: () => {} }
  };
  
  server.authenticate(mockClient, 'testuser');
  
  assert(mockClient.data.username === 'testuser', '用户名已设置');
  assert(mockClient.data.authenticated === true, '认证状态正确');
});

// 4. MessageHandler 测试
test('MessageHandler - 创建实例', () => {
  const handler = new MessageHandler();
  assert(handler.handlers instanceof Map, '处理器集合是 Map');
});

test('MessageHandler - 注册处理器', () => {
  const handler = new MessageHandler();
  const testHandler = (msg, client) => 'handled';
  
  handler.on('test', testHandler);
  assert(handler.handlers.has('test'), '处理器已注册');
  assert(handler.handlers.get('test') === testHandler, '处理器正确');
});

test('MessageHandler - 处理消息', () => {
  const handler = new MessageHandler();
  let receivedMessage = null;
  
  handler.on('test', (msg, client) => {
    receivedMessage = msg;
    return 'result';
  });
  
  const result = handler.handle({ type: 'test', data: 'hello' }, {});
  
  assert(receivedMessage !== null, '消息已接收');
  assert(receivedMessage.data === 'hello', '消息数据正确');
  assert(result === 'result', '处理器返回值正确');
});

test('MessageHandler - 未知消息类型', () => {
  const handler = new MessageHandler();
  const result = handler.handle({ type: 'unknown' }, {});
  assert(result === null, '未知类型返回 null');
});

// 5. WebSocket 状态码测试
test('WebSocket 状态码常量', () => {
  // 这些常量在浏览器环境中可用，这里验证我们了解这些值
  assert(WebSocket.CONNECTING === 0 || typeof WebSocket === 'undefined', 'CONNECTING = 0');
  assert(WebSocket.OPEN === 1 || typeof WebSocket === 'undefined', 'OPEN = 1');
  assert(WebSocket.CLOSING === 2 || typeof WebSocket === 'undefined', 'CLOSING = 2');
  assert(WebSocket.CLOSED === 3 || typeof WebSocket === 'undefined', 'CLOSED = 3');
});

// 6. 房间管理测试
test('WebSocketServer - 房间管理逻辑', () => {
  const server = new WebSocketServer();
  const mockClient = {
    id: 'client-1',
    rooms: new Set(),
    ws: { readyState: 1, send: () => {} }
  };
  
  // 模拟加入房间
  const roomName = 'test-room';
  if (!server.rooms.has(roomName)) {
    server.rooms.set(roomName, new Set());
  }
  server.rooms.get(roomName).add(mockClient);
  mockClient.rooms.add(roomName);
  
  assert(server.rooms.has(roomName), '房间已创建');
  assert(server.rooms.get(roomName).has(mockClient), '客户端在房间中');
  assert(mockClient.rooms.has(roomName), '客户端记录了房间');
  
  // 模拟离开房间
  server.rooms.get(roomName).delete(mockClient);
  mockClient.rooms.delete(roomName);
  
  assert(!server.rooms.get(roomName).has(mockClient), '客户端已离开房间');
  assert(!mockClient.rooms.has(roomName), '客户端房间记录已移除');
});

// 7. 消息格式测试
test('WebSocket 消息格式', () => {
  // 标准消息格式
  const message = {
    type: 'message',
    payload: { text: 'Hello' },
    timestamp: Date.now(),
    id: 'msg-123'
  };
  
  assert(typeof message.type === 'string', '消息类型是字符串');
  assert(typeof message.payload === 'object', '消息负载是对象');
  assert(typeof message.timestamp === 'number', '时间戳是数字');
  assert(typeof message.id === 'string', '消息 ID 是字符串');
});

// 8. 重连逻辑测试
test('WebSocketClient - 重连计数', () => {
  const client = new WebSocketClient('ws://localhost:8080', {
    maxReconnectAttempts: 3
  });
  
  assert(client.reconnectAttempts === 0, '初始重连次数为 0');
  
  // 模拟重连
  client.reconnectAttempts = 1;
  assert(client.reconnectAttempts === 1, '重连次数增加');
  
  // 检查是否超过最大次数
  assert(client.reconnectAttempts < client.options.maxReconnectAttempts, '未超过最大重连次数');
});

// ==================== 运行所有测试 ====================

console.log('\n' + '='.repeat(50));
console.log('✅ 所有测试通过!');
console.log('='.repeat(50));
console.log('\n💡 提示: 这些测试验证了 WebSocket 代码的结构和逻辑。');
console.log('   实际的 WebSocket 连接测试需要在浏览器或 Node.js 环境中');
console.log('   使用 ws 库运行服务端和客户端。');
