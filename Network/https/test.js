/**
 * HTTPS/SSL/TLS 模块测试
 */

const {
  SymmetricEncryption,
  AsymmetricEncryption,
  HashUtil,
  CertificateUtil,
  TLSConfig,
  SecurityHeaders
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

console.log('🚀 开始 HTTPS/SSL/TLS 模块测试\n');

// 1. 对称加密测试
test('SymmetricEncryption - AES-256-GCM 加密解密', () => {
  const key = SymmetricEncryption.generateKey();
  const plaintext = '这是一段需要加密的敏感数据';
  
  const encrypted = SymmetricEncryption.encrypt(plaintext, key);
  assert(encrypted.iv !== undefined, '包含 IV');
  assert(encrypted.authTag !== undefined, '包含认证标签');
  assert(encrypted.encrypted !== undefined, '包含密文');
  
  const decrypted = SymmetricEncryption.decrypt(encrypted, key);
  assert(decrypted === plaintext, '解密后数据与原文一致');
});

test('SymmetricEncryption - 生成密钥', () => {
  const key1 = SymmetricEncryption.generateKey();
  const key2 = SymmetricEncryption.generateKey();
  
  assert(key1.length === 32, '密钥长度为 32 字节 (256 位)');
  assert(!key1.equals(key2), '每次生成的密钥不同');
});

// 2. 非对称加密测试
test('AsymmetricEncryption - RSA 密钥对生成', () => {
  const keyPair = AsymmetricEncryption.generateKeyPair();
  
  assert(keyPair.publicKey !== undefined, '包含公钥');
  assert(keyPair.privateKey !== undefined, '包含私钥');
  assert(keyPair.publicKey.includes('BEGIN PUBLIC KEY'), '公钥格式正确');
  assert(keyPair.privateKey.includes('BEGIN PRIVATE KEY'), '私钥格式正确');
});

test('AsymmetricEncryption - RSA 加密解密', () => {
  const keyPair = AsymmetricEncryption.generateKeyPair();
  const message = 'Hello, RSA Encryption!';
  
  const encrypted = AsymmetricEncryption.encrypt(message, keyPair.publicKey);
  assert(encrypted !== message, '加密后数据不同');
  
  const decrypted = AsymmetricEncryption.decrypt(encrypted, keyPair.privateKey);
  assert(decrypted === message, '解密后数据与原文一致');
});

test('AsymmetricEncryption - RSA 数字签名', () => {
  const keyPair = AsymmetricEncryption.generateKeyPair();
  const data = '这是一份重要文件';
  
  const signature = AsymmetricEncryption.sign(data, keyPair.privateKey);
  assert(signature !== undefined, '签名生成成功');
  assert(signature.length > 0, '签名不为空');
  
  const isValid = AsymmetricEncryption.verify(data, signature, keyPair.publicKey);
  assert(isValid === true, '签名验证通过');
  
  const isInvalid = AsymmetricEncryption.verify('篡改的数据', signature, keyPair.publicKey);
  assert(isInvalid === false, '篡改后的数据签名验证失败');
});

// 3. 哈希工具测试
test('HashUtil - SHA-256 哈希', () => {
  const hash1 = HashUtil.sha256('test');
  const hash2 = HashUtil.sha256('test');
  const hash3 = HashUtil.sha256('different');
  
  assert(hash1.length === 64, 'SHA-256 哈希长度为 64 字符');
  assert(hash1 === hash2, '相同输入产生相同哈希');
  assert(hash1 !== hash3, '不同输入产生不同哈希');
});

test('HashUtil - SHA-512 哈希', () => {
  const hash = HashUtil.sha512('test');
  assert(hash.length === 128, 'SHA-512 哈希长度为 128 字符');
});

test('HashUtil - HMAC', () => {
  const key = 'secret-key';
  const data = 'message';
  
  const hmac1 = HashUtil.hmac(data, key);
  const hmac2 = HashUtil.hmac(data, key);
  const hmac3 = HashUtil.hmac(data, 'different-key');
  
  assert(hmac1 === hmac2, '相同数据和密钥产生相同 HMAC');
  assert(hmac1 !== hmac3, '不同密钥产生不同 HMAC');
});

test('HashUtil - 带盐密码哈希', () => {
  const password = 'userPassword123';
  
  const hashed = HashUtil.hashWithSalt(password);
  assert(hashed.salt !== undefined, '包含盐值');
  assert(hashed.hash !== undefined, '包含哈希值');
  assert(hashed.salt.length === 32, '盐值长度为 32 字符');
  
  const isValid = HashUtil.verifyPassword(password, hashed.salt, hashed.hash);
  assert(isValid === true, '正确密码验证通过');
  
  const isInvalid = HashUtil.verifyPassword('wrongPassword', hashed.salt, hashed.hash);
  assert(isInvalid === false, '错误密码验证失败');
});

// 4. 证书工具测试
test('CertificateUtil - 生成自签名证书信息', () => {
  const cert = CertificateUtil.generateSelfSignedCert('test.example.com');
  
  assert(cert.subject.commonName === 'test.example.com', '主题 CN 正确');
  assert(cert.publicKey !== undefined, '包含公钥');
  assert(cert.privateKey !== undefined, '包含私钥');
  assert(cert.validFrom !== undefined, '包含生效日期');
  assert(cert.validTo !== undefined, '包含过期日期');
});

test('CertificateUtil - 检查证书过期', () => {
  const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  assert(CertificateUtil.isExpired(futureDate) === false, '未来日期未过期');
  assert(CertificateUtil.isExpired(pastDate) === true, '过去日期已过期');
});

test('CertificateUtil - 计算证书剩余天数', () => {
  const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const days = CertificateUtil.getDaysUntilExpiry(thirtyDaysLater);
  
  assert(days >= 29 && days <= 30, '剩余天数计算正确');
});

// 5. TLS 配置测试
test('TLSConfig - 推荐配置', () => {
  const config = TLSConfig.recommended;
  
  assert(config.minVersion === 'TLSv1.2', '最小 TLS 版本为 1.2');
  assert(config.maxVersion === 'TLSv1.3', '最大 TLS 版本为 1.3');
  assert(Array.isArray(config.cipherSuites), '加密套件是数组');
  assert(config.cipherSuites.length > 0, '加密套件不为空');
});

test('TLSConfig - 弱配置', () => {
  const config = TLSConfig.weak;
  
  assert(config.minVersion === 'TLSv1', '弱配置最小版本为 TLSv1');
  assert(Array.isArray(config.cipherSuites), '弱配置加密套件是数组');
});

// 6. 安全响应头测试
test('SecurityHeaders - 推荐配置', () => {
  const headers = SecurityHeaders.recommended;
  
  assert(headers['Strict-Transport-Security'] !== undefined, '包含 HSTS');
  assert(headers['X-Content-Type-Options'] === 'nosniff', '包含 X-Content-Type-Options');
  assert(headers['X-Frame-Options'] === 'DENY', '包含 X-Frame-Options');
  assert(headers['Content-Security-Policy'] !== undefined, '包含 CSP');
});

test('SecurityHeaders - 生成 Nginx 配置', () => {
  const config = SecurityHeaders.generateNginxConfig();
  
  assert(config.includes('add_header'), '包含 add_header 指令');
  assert(config.includes('Strict-Transport-Security'), '包含 HSTS 配置');
});

test('SecurityHeaders - 生成 Express 中间件', () => {
  const middleware = SecurityHeaders.generateExpressMiddleware();
  assert(typeof middleware === 'function', '中间件是函数');
});

test('SecurityHeaders - 验证响应头', () => {
  const validHeaders = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };
  
  const result = SecurityHeaders.validateHeaders(validHeaders);
  assert(result.valid === true, '有效头部验证通过');
  assert(result.issues.length === 0, '没有验证问题');
  
  const invalidHeaders = {
    'X-Content-Type-Options': 'nosniff'
  };
  
  const invalidResult = SecurityHeaders.validateHeaders(invalidHeaders);
  assert(invalidResult.valid === false, '无效头部验证失败');
  assert(invalidResult.issues.length > 0, '存在验证问题');
});

// ==================== 运行所有测试 ====================

console.log('\n' + '='.repeat(50));
console.log('✅ 所有测试通过!');
console.log('='.repeat(50));
