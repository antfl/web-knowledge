/**
 * HTTPS/SSL/TLS 示例代码
 * 演示加密、证书、安全头等概念
 */

const crypto = require('crypto');

// ==================== 加密算法演示 ====================

// 对称加密（AES）
const SymmetricEncryption = {
  // AES-256-GCM 加密
  encrypt(text, key) {
    // 生成随机 IV（初始化向量）
    const iv = crypto.randomBytes(16);
    
    // 创建加密器
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    // 加密数据
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // 获取认证标签
    const authTag = cipher.getAuthTag();
    
    // 返回 IV + 认证标签 + 密文
    return {
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      encrypted: encrypted
    };
  },

  // AES-256-GCM 解密
  decrypt(encryptedData, key) {
    const { iv, authTag, encrypted } = encryptedData;
    
    // 创建解密器
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(iv, 'hex')
    );
    
    // 设置认证标签
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    // 解密数据
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  },

  // 生成密钥
  generateKey() {
    return crypto.randomBytes(32); // 256 位
  }
};

// 非对称加密（RSA）
const AsymmetricEncryption = {
  // 生成 RSA 密钥对
  generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
  },

  // 公钥加密
  encrypt(text, publicKey) {
    const buffer = Buffer.from(text, 'utf8');
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      buffer
    );
    return encrypted.toString('base64');
  },

  // 私钥解密
  decrypt(encryptedText, privateKey) {
    const buffer = Buffer.from(encryptedText, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      buffer
    );
    return decrypted.toString('utf8');
  },

  // 私钥签名
  sign(data, privateKey) {
    const signer = crypto.createSign('SHA256');
    signer.update(data);
    return signer.sign(privateKey, 'base64');
  },

  // 公钥验证签名
  verify(data, signature, publicKey) {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(data);
    return verifier.verify(publicKey, signature, 'base64');
  }
};

// 哈希函数
const HashUtil = {
  // SHA-256 哈希
  sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  },

  // SHA-512 哈希
  sha512(data) {
    return crypto.createHash('sha512').update(data).digest('hex');
  },

  // HMAC
  hmac(data, key, algorithm = 'sha256') {
    return crypto.createHmac(algorithm, key).update(data).digest('hex');
  },

  // 带盐的哈希（用于密码存储）
  hashWithSalt(password, salt) {
    if (!salt) {
      salt = crypto.randomBytes(16).toString('hex');
    }
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return {
      salt,
      hash: hash.toString('hex')
    };
  },

  // 验证密码
  verifyPassword(password, salt, hash) {
    const result = this.hashWithSalt(password, salt);
    return result.hash === hash;
  }
};

// ==================== 证书工具 ====================

const CertificateUtil = {
  // 生成自签名证书（用于测试）
  generateSelfSignedCert(commonName) {
    const { privateKey, publicKey } = AsymmetricEncryption.generateKeyPair();
    
    // 这里简化处理，实际证书需要 X.509 格式
    const certInfo = {
      subject: {
        commonName,
        organization: 'Test Organization',
        country: 'CN'
      },
      issuer: {
        commonName,
        organization: 'Test Organization',
        country: 'CN'
      },
      validFrom: new Date(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1年
      publicKey,
      privateKey
    };

    return certInfo;
  },

  // 解析证书信息
  parseCertificate(certPem) {
    // 简化实现，实际使用 x509 库
    const lines = certPem.split('\n');
    const info = {
      subject: {},
      issuer: {},
      validFrom: null,
      validTo: null
    };

    lines.forEach(line => {
      if (line.includes('Subject:')) {
        const match = line.match(/CN=([^,]+)/);
        if (match) info.subject.commonName = match[1];
      }
      if (line.includes('Issuer:')) {
        const match = line.match(/CN=([^,]+)/);
        if (match) info.issuer.commonName = match[1];
      }
    });

    return info;
  },

  // 检查证书是否过期
  isExpired(validTo) {
    return new Date() > new Date(validTo);
  },

  // 计算证书剩余天数
  getDaysUntilExpiry(validTo) {
    const now = new Date();
    const expiry = new Date(validTo);
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
};

// ==================== TLS/SSL 配置工具 ====================

const TLSConfig = {
  // 推荐的 TLS 配置
  recommended: {
    // 最小 TLS 版本
    minVersion: 'TLSv1.2',
    
    // 最大 TLS 版本
    maxVersion: 'TLSv1.3',
    
    // 加密套件（TLS 1.2）
    cipherSuites: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256',
      'ECDHE-ECDSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-ECDSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES256-GCM-SHA384'
    ],

    // 椭圆曲线
    ecdhCurves: ['X25519', 'secp256r1', 'secp384r1'],

    // 是否优先使用服务器加密套件
    honorCipherOrder: true
  },

  // 弱配置（不推荐，仅用于兼容性）
  weak: {
    minVersion: 'TLSv1',
    cipherSuites: [
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES128-GCM-SHA256',
      'DHE-RSA-AES256-GCM-SHA384',
      'DHE-RSA-AES128-GCM-SHA256'
    ]
  },

  // 生成 Node.js HTTPS 配置
  generateNodeConfig(certPath, keyPath, options = {}) {
    const fs = require('fs');
    
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
      minVersion: options.minVersion || this.recommended.minVersion,
      maxVersion: options.maxVersion || this.recommended.maxVersion,
      ciphers: (options.cipherSuites || this.recommended.cipherSuites).join(':'),
      honorCipherOrder: options.honorCipherOrder !== false
    };
  }
};

// ==================== 安全响应头 ====================

const SecurityHeaders = {
  // 推荐的完整安全头配置
  recommended: {
    // 强制 HTTPS
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    
    // 防止 MIME 类型嗅探
    'X-Content-Type-Options': 'nosniff',
    
    // 点击劫持保护
    'X-Frame-Options': 'DENY',
    
    // XSS 保护
    'X-XSS-Protection': '1; mode=block',
    
    // 内容安全策略
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    
    // 引用策略
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // 权限策略
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  },

  // 生成 Nginx 配置
  generateNginxConfig(headers = this.recommended) {
    const configs = [];
    for (const [key, value] of Object.entries(headers)) {
      configs.push(`add_header ${key} "${value}" always;`);
    }
    return configs.join('\n');
  },

  // 生成 Express 中间件
  generateExpressMiddleware(headers = this.recommended) {
    return (req, res, next) => {
      for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value);
      }
      next();
    };
  },

  // 验证响应头
  validateHeaders(headers) {
    const issues = [];
    const required = ['Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options'];
    
    required.forEach(header => {
      if (!headers[header]) {
        issues.push(`缺少必需的安全头: ${header}`);
      }
    });

    // 检查 HSTS 配置
    if (headers['Strict-Transport-Security']) {
      const hsts = headers['Strict-Transport-Security'];
      if (!hsts.includes('max-age=')) {
        issues.push('HSTS 缺少 max-age 指令');
      }
      const maxAge = parseInt(hsts.match(/max-age=(\d+)/)?.[1] || 0);
      if (maxAge < 31536000) {
        issues.push('HSTS max-age 建议至少为 1 年 (31536000 秒)');
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
};

// ==================== HTTPS 混合加密演示 ====================

const HybridEncryption = {
  // 模拟 HTTPS 混合加密过程
  simulateHTTPSHandshake() {
    console.log('=== 模拟 HTTPS 握手过程 ===\n');

    // 1. 服务器生成密钥对
    console.log('1. 服务器生成 RSA 密钥对...');
    const serverKeys = AsymmetricEncryption.generateKeyPair();
    console.log('   ✓ 密钥对生成完成');

    // 2. 客户端生成预主密钥
    console.log('\n2. 客户端生成预主密钥（随机对称密钥）...');
    const preMasterSecret = crypto.randomBytes(48).toString('hex');
    console.log('   ✓ 预主密钥:', preMasterSecret.substring(0, 16) + '...');

    // 3. 客户端用公钥加密预主密钥
    console.log('\n3. 客户端使用服务器公钥加密预主密钥...');
    const encryptedPreMaster = AsymmetricEncryption.encrypt(
      preMasterSecret,
      serverKeys.publicKey
    );
    console.log('   ✓ 加密后的预主密钥:', encryptedPreMaster.substring(0, 32) + '...');

    // 4. 服务器用私钥解密
    console.log('\n4. 服务器使用私钥解密预主密钥...');
    const decryptedPreMaster = AsymmetricEncryption.decrypt(
      encryptedPreMaster,
      serverKeys.privateKey
    );
    console.log('   ✓ 解密后的预主密钥:', decryptedPreMaster.substring(0, 16) + '...');

    // 5. 双方派生会话密钥
    console.log('\n5. 双方使用预主密钥派生会话密钥...');
    const sessionKey = HashUtil.sha256(decryptedPreMaster).substring(0, 64);
    console.log('   ✓ 会话密钥:', sessionKey.substring(0, 16) + '...');

    // 6. 使用会话密钥加密通信
    console.log('\n6. 使用会话密钥进行对称加密通信...');
    const message = 'Hello, HTTPS!';
    // AES-256 需要 32 字节密钥，从 SHA-256 哈希中取前 64 个十六进制字符（32 字节）
    const keyBuffer = Buffer.from(sessionKey.substring(0, 64), 'hex');
    const encrypted = SymmetricEncryption.encrypt(message, keyBuffer);
    console.log('   原文:', message);
    console.log('   密文:', encrypted.encrypted.substring(0, 32) + '...');

    const decrypted = SymmetricEncryption.decrypt(encrypted, keyBuffer);
    console.log('   解密:', decrypted);

    console.log('\n=== 握手过程演示完成 ===\n');
  }
};

// ==================== 演示函数 ====================

function demonstrateHTTPS() {
  console.log('=== HTTPS/加密工具演示 ===\n');

  // 1. 对称加密演示
  console.log('1. 对称加密 (AES-256-GCM):');
  const key = SymmetricEncryption.generateKey();
  const plaintext = '这是一段需要加密的敏感数据';
  const encrypted = SymmetricEncryption.encrypt(plaintext, key);
  const decrypted = SymmetricEncryption.decrypt(encrypted, key);
  console.log('   原文:', plaintext);
  console.log('   加密后:', encrypted.encrypted.substring(0, 32) + '...');
  console.log('   解密后:', decrypted);
  console.log('   验证:', plaintext === decrypted ? '✓ 成功' : '✗ 失败');

  // 2. 非对称加密演示
  console.log('\n2. 非对称加密 (RSA):');
  const keyPair = AsymmetricEncryption.generateKeyPair();
  const message = 'Hello, RSA!';
  const rsaEncrypted = AsymmetricEncryption.encrypt(message, keyPair.publicKey);
  const rsaDecrypted = AsymmetricEncryption.decrypt(rsaEncrypted, keyPair.privateKey);
  console.log('   原文:', message);
  console.log('   公钥加密后:', rsaEncrypted.substring(0, 32) + '...');
  console.log('   私钥解密后:', rsaDecrypted);

  // 3. 数字签名演示
  console.log('\n3. 数字签名:');
  const data = '这是一份重要文件';
  const signature = AsymmetricEncryption.sign(data, keyPair.privateKey);
  const isValid = AsymmetricEncryption.verify(data, signature, keyPair.publicKey);
  console.log('   原文:', data);
  console.log('   签名:', signature.substring(0, 32) + '...');
  console.log('   验证结果:', isValid ? '✓ 签名有效' : '✗ 签名无效');

  // 4. 哈希演示
  console.log('\n4. 哈希函数:');
  const hashInput = 'password123';
  console.log('   原文:', hashInput);
  console.log('   SHA-256:', HashUtil.sha256(hashInput));
  console.log('   SHA-512:', HashUtil.sha512(hashInput));

  // 5. 密码哈希（带盐）
  console.log('\n5. 密码哈希（带盐）:');
  const password = 'userPassword';
  const hashed = HashUtil.hashWithSalt(password);
  console.log('   密码:', password);
  console.log('   盐值:', hashed.salt);
  console.log('   哈希:', hashed.hash.substring(0, 32) + '...');
  const isPasswordValid = HashUtil.verifyPassword(password, hashed.salt, hashed.hash);
  console.log('   验证:', isPasswordValid ? '✓ 密码正确' : '✗ 密码错误');

  // 6. HMAC 演示
  console.log('\n6. HMAC:');
  const hmacKey = 'secret-key';
  const hmacData = 'message';
  const hmac = HashUtil.hmac(hmacData, hmacKey);
  console.log('   数据:', hmacData);
  console.log('   密钥:', hmacKey);
  console.log('   HMAC:', hmac);

  // 7. 安全头验证
  console.log('\n7. 安全响应头验证:');
  const testHeaders = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };
  const validation = SecurityHeaders.validateHeaders(testHeaders);
  console.log('   验证结果:', validation.valid ? '✓ 通过' : '✗ 未通过');
  if (validation.issues.length > 0) {
    validation.issues.forEach(issue => console.log('   -', issue));
  }

  // 8. 混合加密演示（HTTPS 握手模拟）
  console.log('\n8. HTTPS 混合加密演示:');
  HybridEncryption.simulateHTTPSHandshake();

  console.log('=== 演示完成 ===');
}

// 运行演示
demonstrateHTTPS();

// 导出模块
module.exports = {
  SymmetricEncryption,
  AsymmetricEncryption,
  HashUtil,
  CertificateUtil,
  TLSConfig,
  SecurityHeaders,
  HybridEncryption
};
