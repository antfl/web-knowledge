/**
 * WebSocket 示例代码
 * 演示 WebSocket 客户端和服务端实现
 */

// ==================== WebSocket 客户端 ====================

class WebSocketClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      heartbeatMsg: 'ping',
      ...options
    };

    this.ws = null;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.listeners = new Map();
    this.messageQueue = [];
  }

  // 连接
  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = (event) => {
          console.log('WebSocket 连接已建立');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.flushMessageQueue();
          this.emit('open', event);
          resolve(event);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket 连接已关闭', event.code, event.reason);
          this.stopHeartbeat();
          this.emit('close', event);

          if (this.options.reconnect && !event.wasClean) {
            this.reconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket 错误:', error);
          this.emit('error', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // 处理消息
  handleMessage(data) {
    // 处理心跳响应
    if (data === 'pong' || data === this.options.heartbeatMsg) {
      return;
    }

    // 尝试解析 JSON
    let message;
    try {
      message = JSON.parse(data);
    } catch {
      message = { type: 'text', data };
    }

    this.emit('message', message);

    // 根据消息类型触发特定事件
    if (message.type) {
      this.emit(message.type, message);
    }
  }

  // 发送消息
  send(data) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      // 连接未就绪，加入队列
      this.messageQueue.push(message);
    }
  }

  // 刷新消息队列
  flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.ws.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      this.ws.send(message);
    }
  }

  // 重连
  reconnect() {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error('达到最大重连次数');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`第 ${this.reconnectAttempts} 次重连...`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.options.reconnectInterval);
  }

  // 启动心跳
  startHeartbeat() {
    if (this.options.heartbeatInterval > 0) {
      this.heartbeatTimer = setInterval(() => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(this.options.heartbeatMsg);
        }
      }, this.options.heartbeatInterval);
    }
  }

  // 停止心跳
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 关闭连接
  close(code = 1000, reason = '正常关闭') {
    this.options.reconnect = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(code, reason);
    }
  }

  // 事件监听
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // 触发事件
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // 获取连接状态
  get readyState() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  get isConnected() {
    return this.readyState === WebSocket.OPEN;
  }
}

// ==================== WebSocket 服务端（Node.js）====================

class WebSocketServer {
  constructor(options = {}) {
    this.port = options.port || 8080;
    this.clients = new Map();
    this.rooms = new Map();
    this.middlewares = [];
  }

  // 使用中间件
  use(middleware) {
    this.middlewares.push(middleware);
  }

  // 处理连接
  handleConnection(ws, req) {
    const clientId = this.generateClientId();
    const client = {
      id: clientId,
      ws,
      rooms: new Set(),
      data: {},
      connectedAt: Date.now()
    };

    this.clients.set(clientId, client);

    console.log(`客户端 ${clientId} 已连接`);

    // 发送欢迎消息
    this.sendToClient(client, {
      type: 'connected',
      clientId,
      timestamp: Date.now()
    });

    // 处理消息
    ws.on('message', (data) => {
      this.handleMessage(client, data);
    });

    // 处理关闭
    ws.on('close', () => {
      this.handleDisconnect(client);
    });

    // 处理错误
    ws.on('error', (error) => {
      console.error(`客户端 ${clientId} 错误:`, error);
    });
  }

  // 处理消息
  handleMessage(client, data) {
    const messageStr = data.toString();

    // 处理心跳
    if (messageStr === 'ping') {
      client.ws.send('pong');
      return;
    }

    // 解析消息
    let message;
    try {
      message = JSON.parse(messageStr);
    } catch {
      message = { type: 'text', data: messageStr };
    }

    console.log(`收到来自 ${client.id} 的消息:`, message);

    // 处理不同类型的消息
    switch (message.type) {
      case 'join':
        this.joinRoom(client, message.room);
        break;
      case 'leave':
        this.leaveRoom(client, message.room);
        break;
      case 'broadcast':
        this.broadcast(message.data, client.id);
        break;
      case 'room':
        this.sendToRoom(message.room, message.data, client.id);
        break;
      case 'private':
        this.sendToClientById(message.to, message.data);
        break;
      default:
        // 触发事件
        this.emit(message.type, message, client);
    }
  }

  // 处理断开连接
  handleDisconnect(client) {
    console.log(`客户端 ${client.id} 已断开`);

    // 离开所有房间
    client.rooms.forEach(room => {
      this.leaveRoom(client, room);
    });

    this.clients.delete(client.id);
  }

  // 加入房间
  joinRoom(client, roomName) {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }

    this.rooms.get(roomName).add(client);
    client.rooms.add(roomName);

    this.sendToClient(client, {
      type: 'joined',
      room: roomName
    });

    // 通知房间其他成员
    this.sendToRoom(roomName, {
      type: 'userJoined',
      clientId: client.id
    }, client.id);
  }

  // 离开房间
  leaveRoom(client, roomName) {
    if (this.rooms.has(roomName)) {
      this.rooms.get(roomName).delete(client);
      client.rooms.delete(roomName);

      // 清理空房间
      if (this.rooms.get(roomName).size === 0) {
        this.rooms.delete(roomName);
      }

      this.sendToClient(client, {
        type: 'left',
        room: roomName
      });
    }
  }

  // 发送给指定客户端
  sendToClient(client, data) {
    if (client.ws.readyState === 1) { // WebSocket.OPEN
      client.ws.send(JSON.stringify(data));
    }
  }

  // 通过 ID 发送给客户端
  sendToClientById(clientId, data) {
    const client = this.clients.get(clientId);
    if (client) {
      this.sendToClient(client, data);
    }
  }

  // 广播给所有客户端
  broadcast(data, excludeClientId = null) {
    const message = JSON.stringify(data);

    this.clients.forEach((client, id) => {
      if (id !== excludeClientId && client.ws.readyState === 1) {
        client.ws.send(message);
      }
    });
  }

  // 发送给房间
  sendToRoom(roomName, data, excludeClientId = null) {
    if (!this.rooms.has(roomName)) return;

    const message = JSON.stringify(data);
    const room = this.rooms.get(roomName);

    room.forEach(client => {
      if (client.id !== excludeClientId && client.ws.readyState === 1) {
        client.ws.send(message);
      }
    });
  }

  // 生成客户端 ID
  generateClientId() {
    return Math.random().toString(36).substring(2, 15);
  }

  // 事件触发（供继承使用）
  emit(event, ...args) {
    // 子类可以重写此方法
  }

  // 获取统计信息
  getStats() {
    return {
      totalClients: this.clients.size,
      totalRooms: this.rooms.size,
      clients: Array.from(this.clients.keys()),
      rooms: Array.from(this.rooms.keys())
    };
  }
}

// ==================== 聊天室实现 ====================

class ChatRoomServer extends WebSocketServer {
  constructor(options = {}) {
    super(options);
    this.messages = [];
    this.maxMessages = options.maxMessages || 100;
  }

  handleMessage(client, data) {
    const messageStr = data.toString();

    // 处理心跳
    if (messageStr === 'ping') {
      client.ws.send('pong');
      return;
    }

    let message;
    try {
      message = JSON.parse(messageStr);
    } catch {
      return;
    }

    switch (message.type) {
      case 'auth':
        this.authenticate(client, message.username);
        break;
      case 'message':
        this.handleChatMessage(client, message);
        break;
      case 'typing':
        this.handleTyping(client);
        break;
      default:
        super.handleMessage(client, data);
    }
  }

  authenticate(client, username) {
    client.data.username = username;
    client.data.authenticated = true;

    this.sendToClient(client, {
      type: 'authSuccess',
      username,
      history: this.messages.slice(-20)
    });

    this.broadcast({
      type: 'userJoined',
      username,
      timestamp: Date.now()
    }, client.id);
  }

  handleChatMessage(client, message) {
    if (!client.data.authenticated) {
      this.sendToClient(client, {
        type: 'error',
        message: '请先登录'
      });
      return;
    }

    const chatMessage = {
      type: 'message',
      username: client.data.username,
      text: message.text,
      timestamp: Date.now()
    };

    // 保存消息
    this.messages.push(chatMessage);
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }

    // 广播消息
    this.broadcast(chatMessage);
  }

  handleTyping(client) {
    if (!client.data.authenticated) return;

    this.broadcast({
      type: 'typing',
      username: client.data.username
    }, client.id);
  }
}

// ==================== WebSocket 消息处理器 ====================

class MessageHandler {
  constructor() {
    this.handlers = new Map();
  }

  // 注册处理器
  on(type, handler) {
    this.handlers.set(type, handler);
  }

  // 处理消息
  handle(message, client) {
    const handler = this.handlers.get(message.type);
    if (handler) {
      return handler(message, client);
    }
    return null;
  }
}

// ==================== 演示函数 ====================

function demonstrateWebSocket() {
  console.log('=== WebSocket 演示 ===\n');

  // 由于 Node.js 环境无法直接使用浏览器 WebSocket API
  // 这里展示 WebSocket 客户端和服务端的结构

  console.log('1. WebSocket 客户端结构:');
  console.log('   - WebSocketClient 类');
  console.log('   - 支持自动重连');
  console.log('   - 支持心跳机制');
  console.log('   - 消息队列管理');
  console.log('   - 事件系统');

  console.log('\n2. WebSocket 服务端结构:');
  console.log('   - WebSocketServer 类');
  console.log('   - 客户端管理');
  console.log('   - 房间管理');
  console.log('   - 消息广播');
  console.log('   - 私有消息');

  console.log('\n3. 聊天室服务器:');
  console.log('   - ChatRoomServer 类');
  console.log('   - 用户认证');
  console.log('   - 消息历史');
  console.log('   - 输入状态');

  console.log('\n4. 使用示例:');
  console.log(`
  // 客户端使用
  const client = new WebSocketClient('ws://localhost:8080');
  
  client.on('open', () => {
    console.log('连接成功');
  });
  
  client.on('message', (msg) => {
    console.log('收到消息:', msg);
  });
  
  client.connect();
  
  // 发送消息
  client.send({ type: 'message', text: 'Hello' });
  
  // 服务端使用（Node.js + ws 库）
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ port: 8080 });
  
  const server = new ChatRoomServer();
  
  wss.on('connection', (ws, req) => {
    server.handleConnection(ws, req);
  });
  `);

  console.log('\n5. WebSocket 状态码:');
  console.log('   1000 - 正常关闭');
  console.log('   1001 - 终端离开');
  console.log('   1006 - 异常关闭');
  console.log('   1008 - 策略违反');
  console.log('   1009 - 消息太大');
  console.log('   1011 - 服务器错误');

  console.log('\n6. 最佳实践:');
  console.log('   ✓ 使用 WSS (WebSocket Secure)');
  console.log('   ✓ 实现心跳机制');
  console.log('   ✓ 实现自动重连');
  console.log('   ✓ 消息格式统一');
  console.log('   ✓ 错误处理完善');
  console.log('   ✓ 连接状态管理');

  console.log('\n=== 演示完成 ===');
}

// 运行演示
demonstrateWebSocket();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WebSocketClient,
    WebSocketServer,
    ChatRoomServer,
    MessageHandler
  };
}
