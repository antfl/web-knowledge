
const security = require('./index.js');

console.log('=== 测试安全功能 ===\n');

console.log('1. 测试 HTML 转义:');
const maliciousHtml = '<script>alert("xss")</script>';
console.log('  原始:', maliciousHtml);
console.log('  转义后:', security.escapeHtml(maliciousHtml));

console.log('\n2. 测试输出编码:');
const dangerousOutput = '<div onclick="alert(1)">test</div>';
console.log('  原始:', dangerousOutput);
console.log('  编码后:', security.encodeOutput(dangerousOutput));

console.log('\n3. 测试输入验证:');
console.log('  验证邮箱 test@example.com:', security.validateInput('test@example.com', 'email'));
console.log('  验证邮箱 invalid:', security.validateInput('invalid', 'email'));
console.log('  验证用户名 user123:', security.validateInput('user123', 'username'));
console.log('  验证用户名 ab:', security.validateInput('ab', 'username'));

console.log('\n4. 测试密码强度:');
console.log('  密码 "123456":', security.checkPasswordStrength('123456'));
console.log('  密码 "Password123!":', security.checkPasswordStrength('Password123!'));

console.log('\n5. 测试 CSRF Token:');
const csrfToken = security.generateCSRFToken();
console.log('  生成的 Token:', csrfToken.substring(0, 16) + '...');
console.log('  Token 长度:', csrfToken.length);

console.log('\n6. 测试字符串哈希:');
const hash1 = security.hashString('hello');
const hash2 = security.hashString('hello');
const hash3 = security.hashString('world');
console.log('  hash("hello"):', hash1);
console.log('  hash("hello") 再次:', hash2);
console.log('  hash("world"):', hash3);
console.log('  相同输入哈希相同:', hash1 === hash2);

console.log('\n7. 测试 XSS 检测:');
console.log('  检测 "<script>alert(1)</script>":', security.detectXSS('<script>alert(1)</script>'));
console.log('  检测 "javascript:void(0)":', security.detectXSS('javascript:void(0)'));
console.log('  检测 "正常文本":', security.detectXSS('正常文本'));

console.log('\n8. 测试 SQL 注入检测:');
console.log('  检测 "\' OR \'1\'=\'1":', security.detectSQLInjection("' OR '1'='1"));
console.log('  检测 "UNION SELECT":', security.detectSQLInjection('UNION SELECT'));
console.log('  检测 "正常文本":', security.detectSQLInjection('正常文本'));

console.log('\n9. 测试限流器:');
let callCount = 0;
const limitedFn = security.rateLimiter(() => {
  callCount++;
  return 'called';
}, 3, 1000);

try {
  console.log('  第1次调用:', limitedFn());
  console.log('  第2次调用:', limitedFn());
  console.log('  第3次调用:', limitedFn());
  console.log('  第4次调用 (应该失败):', limitedFn());
} catch (e) {
  console.log('  第4次调用失败:', e.message);
}

console.log('\n10. 测试防抖和节流:');
let debounceCount = 0;
const debouncedFn = security.debounce(() => {
  debounceCount++;
}, 100);

debouncedFn();
debouncedFn();
debouncedFn();
console.log('  防抖函数调用3次，实际执行:', debounceCount, '次 (应该是0，因为还没过100ms)');

console.log('\n11. 测试安全存储:');
const secureStorage = security.createSecureStorage();
secureStorage.set('key1', 'value1', 1000);
console.log('  设置值:', secureStorage.get('key1'));

console.log('\n12. 测试对象清理:');
const dirtyObject = { id: 1, name: 'test', password: 'secret', token: 'abc123' };
const cleanObject = security.sanitizeObject(dirtyObject, ['id', 'name']);
console.log('  原始对象:', dirtyObject);
console.log('  清理后:', cleanObject);

console.log('\n13. 测试文件上传验证:');
const mockFile = {
  name: 'test.jpg',
  size: 1024,
  type: 'image/jpeg'
};
console.log('  验证图片文件:', security.validateFileUpload(mockFile));

const mockLargeFile = {
  name: 'large.jpg',
  size: 10 * 1024 * 1024,
  type: 'image/jpeg'
};
console.log('  验证大文件:', security.validateFileUpload(mockLargeFile));

const mockExeFile = {
  name: 'virus.exe',
  size: 1024,
  type: 'application/x-msdownload'
};
console.log('  验证可执行文件:', security.validateFileUpload(mockExeFile));

console.log('\n=== 所有测试完成 ===');
