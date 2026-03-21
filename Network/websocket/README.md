# WebSocket

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，它使得客户端和服务器之间可以建立持久连接，实现实时双向数据传输。

## 目录

1. [WebSocket 基础](#websocket-基础)
2. [WebSocket 握手](#websocket-握手)
3. [WebSocket API](#websocket-api)
4. [数据帧格式](#数据帧格式)
5. [心跳机制](#心跳机制)
6. [重连机制](#重连机制)
7. [WebSocket 服务端](#websocket-服务端)
8. [应用场景](#应用场景)
9. [性能优化](#性能优化)
10. [安全考虑](#安全考虑)
11. [最佳实践](#最佳实践)

## WebSocket 基础

### 什么是 WebSocket

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

**特点：**
- **全双工通信**：客户端和服务器可以同时发送和接收数据
- **持久连接**：连接建立后保持打开状态
- **低延迟**：无需重复建立连接
- **轻量级头部**：数据传输开销小

### WebSocket vs HTTP

| 特性 | HTTP | WebSocket |
|------|------|-----------|
| 通信方式 | 单向：请求-响应 | 全双工 |
| 连接 | 短连接 | 长连接 |
| 实时性 | 轮询延迟 | 实时 |
| 头部开销 | 大（每次请求都带头部） | 小（首次握手后数据帧头部小） |
| 适用场景 | 静态资源、REST API | 实时通信 |

### WebSocket URL

```
ws://example.com/socket          # 未加密
wss://example.com/socket         # 加密（推荐）
```

## WebSocket 握手

### 握手过程

WebSocket 连接通过 HTTP 协议升级建立：

**1. 客户端请求（HTTP Upgrade）：**
```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
Origin: http://example.com
```

**2. 服务器响应（101 Switching Protocols）：**
```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

### Sec-WebSocket-Key 计算

服务器通过以下方式计算 `Sec-WebSocket-Accept`：

```javascript
const crypto = require('crypto');

const key = 'dGhlIHNhbXBsZSBub25jZQ==';
const magicString = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const accept = crypto
  .createHash('sha1')
  .update(key + magicString)
  .digest('base64');

// accept = 's3pPLMBiTxaQ9kYGzzhZRbK+xOo='
```

## WebSocket API

### 创建 WebSocket 连接

```javascript
// 创建 WebSocket 连接
const ws = new WebSocket('wss://example.com/socket');

// 带协议的连接
const ws = new WebSocket('wss://example.com/socket', ['protocol1', 'protocol2']);
```

### 事件处理

```javascript
const ws = new WebSocket('wss://example.com/socket');

// 连接建立
ws.onopen = (event) => {
  console.log('连接已建立');
  ws.send('Hello Server!');
};

// 接收消息
ws.onmessage = (event) => {
  console.log('收到消息:', event.data);
};

// 连接关闭
ws.onclose = (event) => {
  console.log('连接已关闭');
  console.log('关闭代码:', event.code);
  console.log('关闭原因:', event.reason);
};

// 发生错误
ws.onerror = (error) => {
  console.error('WebSocket 错误:', error);
};

// 使用 addEventListener
ws.addEventListener('open', (event) => {
  console.log('连接已建立');
});
```

### 发送数据

```javascript
// 发送文本
ws.send('Hello Server!');

// 发送 JSON
const data = { type: 'message', content: 'Hello' };
ws.send(JSON.stringify(data));

// 发送 Blob
const blob = new Blob(['Hello'], { type: 'text/plain' });
ws.send(blob);

// 发送 ArrayBuffer
const buffer = new ArrayBuffer(8);
ws.send(buffer);
```

### 关闭连接

```javascript
// 正常关闭
ws.close();

// 带代码和原因关闭
ws.close(1000, '正常关闭');
```

### 连接状态

```javascript
const ws = new WebSocket('wss://example.com/socket');

console.log(ws.readyState);
// 0: CONNECTING - 连接正在建立中
// 1: OPEN - 连接已建立，可以通信
// 2: CLOSING - 连接正在关闭
// 3: CLOSED - 连接已关闭或无法建立

// 常量
WebSocket.CONNECTING === 0;  // true
WebSocket.OPEN === 1;        // true
WebSocket.CLOSING === 2;     // true
WebSocket.CLOSED === 3;      // true
```

### 二进制数据类型

```javascript
const ws = new WebSocket('wss://example.com/socket');

// 设置二进制数据类型
ws.binaryType = 'blob';      // 默认值，接收 Blob
ws.binaryType = 'arraybuffer'; // 接收 ArrayBuffer

ws.onmessage = (event) => {
  if (event.data instanceof Blob) {
    // 处理 Blob
  } else if (event.data instanceof ArrayBuffer) {
    // 处理 ArrayBuffer
  } else {
    // 处理文本
  }
};
```

## 数据帧格式

WebSocket 数据帧结构：

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                               |Masking-key, if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
```

### Opcode 类型

| Opcode | 含义 |
|--------|------|
| 0x0 | 延续帧 |
| 0x1 | 文本帧 |
| 0x2 | 二进制帧 |
| 0x8 | 连接关闭 |
| 0x9 | Ping |
| 0xA | Pong |

## 心跳机制

心跳用于检测连接是否存活：

```javascript
class WebSocketWithHeartbeat {
  constructor(url, options = {}) {
    this.ws = new WebSocket(url);
    this.heartbeatInterval = options.heartbeatInterval || 30000;
    this.heartbeatMsg = options.heartbeatMsg || 'ping';
    this.heartbeatTimer = null;
    
    this.setupHeartbeat();
  }

  setupHeartbeat() {
    this.ws.onopen = () => {
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      // 收到任何消息都重置心跳
      if (event.data === 'pong' || event.data === this.heartbeatMsg) {
        return;
      }
      // 处理正常消息
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
    };
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(this.heartbeatMsg);
      }
    }, this.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}
```

## 重连机制

自动重连实现：

```javascript
class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      maxReconnectAttempts: 5,
      reconnectInterval: 3000,
      maxReconnectInterval: 30000,
      reconnectDecay: 1.5,
      ...options
    };
    
    this.ws = null;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.listeners = {};
    
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = (event) => {
      this.reconnectAttempts = 0;
      this.emit('open', event);
    };

    this.ws.onmessage = (event) => {
      this.emit('message', event);
    };

    this.ws.onclose = (event) => {
      this.emit('close', event);
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      this.emit('error', error);
    };
  }

  reconnect() {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    const timeout = Math.min(
      this.options.reconnectInterval * Math.pow(
        this.options.reconnectDecay,
        this.reconnectAttempts
      ),
      this.options.maxReconnectInterval
    );

    this.reconnectAttempts++;
    
    this.emit('reconnecting', {
      attempt: this.reconnectAttempts,
      timeout
    });

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, timeout);
  }

  // 事件系统
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  close() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.ws.close();
  }
}
```

## WebSocket 服务端

### Node.js (ws 库)

```javascript
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
  console.log('新连接:', req.socket.remoteAddress);

  // 接收消息
  ws.on('message', (message) => {
    console.log('收到:', message.toString());
    
    // 广播给所有客户端
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // 连接关闭
  ws.on('close', () => {
    console.log('连接关闭');
  });

  // 发送欢迎消息
  ws.send('欢迎连接到 WebSocket 服务器!');
});
```

### Socket.IO

```javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  // 加入房间
  socket.join('room1');

  // 接收消息
  socket.on('message', (data) => {
    // 发送给发送者
    socket.emit('message', { ...data, self: true });
    
    // 广播给房间其他人
    socket.to('room1').emit('message', data);
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log('用户断开:', socket.id);
  });
});
```

## 应用场景

### 1. 实时聊天

```javascript
const chatSocket = new WebSocket('wss://chat.example.com');

chatSocket.onopen = () => {
  // 加入房间
  chatSocket.send(JSON.stringify({
    type: 'join',
    room: 'general'
  }));
};

chatSocket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'message':
      displayMessage(message);
      break;
    case 'user_joined':
      showNotification(`${message.username} 加入聊天室`);
      break;
    case 'user_left':
      showNotification(`${message.username} 离开聊天室`);
      break;
  }
};

function sendMessage(text) {
  chatSocket.send(JSON.stringify({
    type: 'message',
    text,
    timestamp: Date.now()
  }));
}
```

### 2. 实时数据推送

```javascript
const dataSocket = new WebSocket('wss://data.example.com/stocks');

// 订阅股票数据
dataSocket.onopen = () => {
  dataSocket.send(JSON.stringify({
    action: 'subscribe',
    symbols: ['AAPL', 'GOOGL', 'MSFT']
  }));
};

dataSocket.onmessage = (event) => {
  const update = JSON.parse(event.data);
  updateStockPrice(update.symbol, update.price);
};
```

### 3. 在线游戏

```javascript
const gameSocket = new WebSocket('wss://game.example.com');

// 发送玩家动作
gameSocket.send(JSON.stringify({
  type: 'player_move',
  position: { x: 100, y: 200 },
  timestamp: Date.now()
}));

// 接收游戏状态更新
gameSocket.onmessage = (event) => {
  const state = JSON.parse(event.data);
  updateGameState(state);
};
```

### 4. 协同编辑

```javascript
const collabSocket = new WebSocket('wss://collab.example.com/document/123');

// 发送编辑操作
collabSocket.send(JSON.stringify({
  type: 'operation',
  operation: {
    type: 'insert',
    position: 10,
    text: 'Hello'
  },
  revision: 5
}));

// 接收远程操作
collabSocket.onmessage = (event) => {
  const operation = JSON.parse(event.data);
  applyRemoteOperation(operation);
};
```

## 性能优化

### 1. 消息压缩

```javascript
const ws = new WebSocket('wss://example.com', [], {
  perMessageDeflate: true
});
```

### 2. 批量发送

```javascript
class BatchSender {
  constructor(ws, options = {}) {
    this.ws = ws;
    this.batchSize = options.batchSize || 100;
    this.flushInterval = options.flushInterval || 100;
    this.buffer = [];
    
    this.start();
  }

  push(message) {
    this.buffer.push(message);
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  flush() {
    if (this.buffer.length === 0) return;
    
    this.ws.send(JSON.stringify({
      type: 'batch',
      messages: this.buffer
    }));
    
    this.buffer = [];
  }

  start() {
    this.timer = setInterval(() => this.flush(), this.flushInterval);
  }

  stop() {
    clearInterval(this.timer);
    this.flush();
  }
}
```

### 3. 连接池

```javascript
class WebSocketPool {
  constructor(url, options = {}) {
    this.url = url;
    this.poolSize = options.poolSize || 5;
    this.connections = [];
    this.currentIndex = 0;
    
    this.initialize();
  }

  initialize() {
    for (let i = 0; i < this.poolSize; i++) {
      this.connections.push(new WebSocket(this.url));
    }
  }

  getConnection() {
    const connection = this.connections[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.poolSize;
    return connection;
  }

  send(data) {
    const connection = this.getConnection();
    if (connection.readyState === WebSocket.OPEN) {
      connection.send(data);
    }
  }
}
```

## 安全考虑

### 1. 使用 WSS（WebSocket Secure）

始终使用 `wss://` 而非 `ws://`，确保数据加密传输。

### 2. 验证 Origin

```javascript
const wss = new WebSocket.Server({ 
  port: 8080,
  verifyClient: (info) => {
    const origin = info.origin;
    return allowedOrigins.includes(origin);
  }
});
```

### 3. 身份验证

```javascript
// 使用 Token 验证
ws.on('connection', (socket, req) => {
  const token = req.url.split('token=')[1];
  
  try {
    const user = jwt.verify(token, secret);
    socket.user = user;
  } catch (err) {
    socket.close(1008, '认证失败');
  }
});
```

### 4. 消息大小限制

```javascript
const wss = new WebSocket.Server({
  port: 8080,
  maxPayload: 1024 * 1024 // 1MB
});
```

### 5. 速率限制

```javascript
class RateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 100;
    this.windowMs = options.windowMs || 60000;
    this.clients = new Map();
  }

  isAllowed(clientId) {
    const now = Date.now();
    const client = this.clients.get(clientId) || { count: 0, resetTime: now + this.windowMs };

    if (now > client.resetTime) {
      client.count = 0;
      client.resetTime = now + this.windowMs;
    }

    client.count++;
    this.clients.set(clientId, client);

    return client.count <= this.maxRequests;
  }
}
```

## 最佳实践

### 1. 消息格式规范

```javascript
// 统一消息格式
{
  "type": "message_type",
  "payload": { ... },
  "timestamp": 1234567890,
  "id": "uuid"
}
```

### 2. 错误处理

```javascript
ws.onerror = (error) => {
  console.error('WebSocket 错误:', error);
  // 记录错误日志
  // 尝试重连
  // 通知用户
};

ws.onclose = (event) => {
  if (!event.wasClean) {
    console.error('连接异常关闭');
    // 尝试重连
  }
};
```

### 3. 优雅关闭

```javascript
function gracefulClose(ws) {
  if (ws.readyState === WebSocket.OPEN) {
    // 发送关闭通知
    ws.send(JSON.stringify({ type: 'disconnecting' }));
    
    // 等待确认后关闭
    setTimeout(() => {
      ws.close(1000, '正常关闭');
    }, 1000);
  }
}
```

### 4. 监控和日志

```javascript
class WebSocketMonitor {
  constructor() {
    this.metrics = {
      connections: 0,
      messagesSent: 0,
      messagesReceived: 0,
      errors: 0
    };
  }

  recordConnection() {
    this.metrics.connections++;
  }

  recordMessageSent() {
    this.metrics.messagesSent++;
  }

  recordMessageReceived() {
    this.metrics.messagesReceived++;
  }

  recordError() {
    this.metrics.errors++;
  }

  getMetrics() {
    return { ...this.metrics };
  }
}
```

## 学习建议

1. **理解协议**：了解 WebSocket 握手和数据帧格式
2. **实践项目**：实现一个简单的聊天应用
3. **关注性能**：学习连接管理和消息优化
4. **安全优先**：始终使用 WSS，做好身份验证
5. **监控运维**：建立连接监控和日志系统
