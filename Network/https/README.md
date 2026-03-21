# HTTPS (HTTP Secure)

HTTPS 是 HTTP 的安全版本，通过 SSL/TLS 协议对通信进行加密，确保数据传输的安全性。

## 目录

1. [HTTPS 基础](#https-基础)
2. [SSL/TLS 协议](#ssltls-协议)
3. [加密原理](#加密原理)
4. [证书体系](#证书体系)
5. [HTTPS 握手过程](#https-握手过程)
6. [HTTPS 配置](#https-配置)
7. [安全最佳实践](#安全最佳实践)
8. [常见问题](#常见问题)

## HTTPS 基础

### 什么是 HTTPS

HTTPS = HTTP + SSL/TLS，在 HTTP 和 TCP 之间增加了安全层：

```
HTTP 层
   ↓
SSL/TLS 层（加密/解密）
   ↓
TCP 层
   ↓
IP 层
```

### 为什么需要 HTTPS

1. **数据加密**：防止数据被窃听
2. **身份认证**：验证服务器身份，防止中间人攻击
3. **数据完整性**：防止数据被篡改

### HTTPS 端口

- HTTP 默认端口：80
- HTTPS 默认端口：443

## SSL/TLS 协议

### SSL 与 TLS 的关系

| 版本 | 名称 | 发布时间 | 状态 |
|------|------|----------|------|
| SSL 1.0 | Secure Sockets Layer | 1994 | 未发布 |
| SSL 2.0 | Secure Sockets Layer | 1995 | 已弃用（不安全） |
| SSL 3.0 | Secure Sockets Layer | 1996 | 已弃用（不安全） |
| TLS 1.0 | Transport Layer Security | 1999 | 已弃用 |
| TLS 1.1 | Transport Layer Security | 2006 | 已弃用 |
| TLS 1.2 | Transport Layer Security | 2008 | 推荐使用 |
| TLS 1.3 | Transport Layer Security | 2018 | 最新标准 |

### TLS 1.2 与 TLS 1.3 对比

**TLS 1.2：**
- 握手需要 2-RTT（往返时间）
- 支持多种加密算法（包括不安全的）
- 握手消息明文传输

**TLS 1.3：**
- 握手仅需 1-RTT（0-RTT 恢复）
- 仅支持安全的加密算法
- 握手消息加密传输
- 移除过时特性，性能更好

## 加密原理

### 对称加密

使用相同的密钥进行加密和解密：

```
明文 + 密钥 → 密文
密文 + 密钥 → 明文
```

**常用算法：**
- AES（Advanced Encryption Standard）- 推荐使用
- ChaCha20 - 移动端性能好
- 3DES - 已弃用

**优点**：速度快，适合加密大量数据
**缺点**：密钥分发困难

### 非对称加密

使用公钥和私钥配对：

```
明文 + 公钥 → 密文
密文 + 私钥 → 明文
```

**常用算法：**
- RSA（Rivest-Shamir-Adleman）
- ECDSA（Elliptic Curve DSA）
- Ed25519

**优点**：密钥分发安全
**缺点**：速度慢，不适合加密大量数据

### 混合加密系统

HTTPS 使用混合加密：

```
1. 客户端生成随机对称密钥（会话密钥）
2. 使用服务器公钥加密会话密钥
3. 服务器使用私钥解密获得会话密钥
4. 后续通信使用会话密钥对称加密
```

## 证书体系

### 数字证书

证书包含以下信息：
- 域名（Common Name）
- 公钥
- 颁发者（Issuer）
- 有效期
- 数字签名

### 证书类型

**1. 按验证级别分类：**

| 类型 | 验证内容 | 适用场景 | 颁发时间 |
|------|----------|----------|----------|
| DV（Domain Validation） | 仅验证域名所有权 | 个人网站、博客 | 几分钟 |
| OV（Organization Validation） | 验证域名 + 组织信息 | 企业官网 | 1-3 天 |
| EV（Extended Validation） | 严格验证组织合法性 | 金融、电商 | 1-2 周 |

**2. 按域名覆盖分类：**

- **单域名证书**：仅保护一个域名（如 www.example.com）
- **通配符证书**：保护主域名及所有子域名（如 *.example.com）
- **SAN 证书**：保护多个不同域名（Subject Alternative Name）

### 证书链

```
根证书（Root CA）
    ↓ 签名
中间证书（Intermediate CA）
    ↓ 签名
服务器证书（End-entity Certificate）
```

**根证书**：自签名，预装在操作系统/浏览器中
**中间证书**：由根证书签发，用于签发服务器证书
**服务器证书**：由中间证书签发，用于实际通信

### 证书格式

| 格式 | 扩展名 | 说明 |
|------|--------|------|
| PEM | .pem, .crt, .key | Base64 编码，最常见 |
| DER | .der, .cer | 二进制编码 |
| PKCS#12 | .p12, .pfx | 包含证书和私钥 |

## HTTPS 握手过程

### TLS 1.2 握手（2-RTT）

```
客户端                              服务器
  |                                   |
  | ------- ClientHello ---------->   |
  |  支持的 TLS 版本                  |
  |  支持的加密套件                   |
  |  客户端随机数                     |
  |                                   |
  | <------ ServerHello -----------   |
  |  选择的 TLS 版本                  |
  |  选择的加密套件                   |
  |  服务器随机数                     |
  |  服务器证书                       |
  |                                   |
  | <------ ServerHelloDone -------   |
  |                                   |
  | ------- ClientKeyExchange ---->   |
  |  用公钥加密的预主密钥             |
  |                                   |
  | ------- ChangeCipherSpec ----->   |
  | ------- Finished -------------->  |
  |                                   |
  | <------ ChangeCipherSpec ------   |
  | <------ Finished ---------------  |
  |                                   |
  | ====== 加密通信开始 ======        |
```

### TLS 1.3 握手（1-RTT）

```
客户端                              服务器
  |                                   |
  | ------- ClientHello ---------->   |
  |  支持的密钥共享                   |
  |  客户端随机数                     |
  |  支持的加密套件                   |
  |                                   |
  | <------ ServerHello -----------   |
  |  选择的密钥共享                   |
  |  服务器随机数                     |
  |  服务器证书                       |
  |  服务器 Finished                  |
  |                                   |
  | ------- Finished -------------->  |
  |                                   |
  | ====== 加密通信开始 ======        |
```

### 密钥派生

```
预主密钥（Pre-master Secret）
    + 客户端随机数
    + 服务器随机数
    ↓
主密钥（Master Secret）
    ↓
密钥块（Key Block）
    ├── 客户端写入密钥
    ├── 服务器写入密钥
    ├── 客户端 MAC 密钥
    └── 服务器 MAC 密钥
```

## HTTPS 配置

### Nginx HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # 证书配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # TLS 版本
    ssl_protocols TLSv1.2 TLSv1.3;

    # 加密套件
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # 会话缓存
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/chain.pem;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

### Node.js HTTPS 服务器

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Hello HTTPS!\n');
}).listen(443);
```

### Express HTTPS 配置

```javascript
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

// 路由配置
app.get('/', (req, res) => {
  res.send('Hello HTTPS!');
});

// HTTPS 服务器
const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});
```

## 安全最佳实践

### 1. 使用最新 TLS 版本

```nginx
# 仅启用 TLS 1.2 和 1.3
ssl_protocols TLSv1.2 TLSv1.3;
```

### 2. 配置强加密套件

```nginx
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;
```

### 3. 启用 HSTS

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

### 4. 配置安全响应头

```nginx
# 防止 MIME 类型嗅探
add_header X-Content-Type-Options nosniff;

# XSS 保护
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";

# 内容安全策略
add_header Content-Security-Policy "default-src 'self'";
```

### 5. 使用证书透明度

```nginx
ssl_ct on;
ssl_ct_static_scts /path/to/scts;
```

### 6. 定期更新证书

- 设置证书过期提醒
- 使用自动化工具（如 Certbot）
- 监控证书状态

## 常见问题

### 混合内容（Mixed Content）

HTTPS 页面加载 HTTP 资源会被浏览器阻止：

```
Mixed Content: The page at 'https://example.com' was loaded over HTTPS, 
but requested an insecure image 'http://example.com/image.jpg'.
```

**解决方案：**
- 将所有资源改为 HTTPS
- 使用相对协议（//example.com/image.jpg）
- 配置 CSP upgrade-insecure-requests

### 证书错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| NET::ERR_CERT_AUTHORITY_INVALID | 自签名证书或不受信任的 CA | 安装受信任证书 |
| NET::ERR_CERT_DATE_INVALID | 证书过期 | 更新证书 |
| NET::ERR_CERT_COMMON_NAME_INVALID | 域名不匹配 | 检查证书域名配置 |
| SSL_ERROR_BAD_CERT_DOMAIN | 证书域名与访问域名不符 | 使用正确域名的证书 |

### 性能优化

**1. 启用会话恢复：**
```nginx
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
```

**2. 启用 OCSP Stapling：**
```nginx
ssl_stapling on;
ssl_stapling_verify on;
```

**3. 使用 TLS 1.3：**
```nginx
ssl_protocols TLSv1.3;
```

**4. 证书优化：**
- 使用 ECDSA 证书（比 RSA 小）
- 证书链不要太长
- 启用证书压缩（TLS 1.3）

### 调试工具

- **OpenSSL**：命令行 SSL/TLS 工具
  ```bash
  openssl s_client -connect example.com:443 -tls1_3
  ```

- **SSL Labs**：在线 SSL 检测
  https://www.ssllabs.com/ssltest/

- **浏览器 DevTools**：Security 面板

- **curl**：测试 HTTPS 连接
  ```bash
  curl -v https://example.com
  ```

## 学习建议

1. **理解基础**：掌握对称加密、非对称加密、哈希函数
2. **实践配置**：动手配置 HTTPS 服务器
3. **安全测试**：使用工具检测 SSL/TLS 配置
4. **持续关注**：跟踪 TLS 1.3 发展和安全漏洞
5. **性能平衡**：在安全性和性能之间找到平衡点
