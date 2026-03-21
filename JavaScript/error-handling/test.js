
const {
  CustomError,
  ValidationError,
  NetworkError,
  safeDivide,
  safeParseJSON,
  validateUser,
  errorLogger,
  withErrorHandler
} = require('./index.js');

console.log('=== 测试错误处理 ===\n');

console.log('1. 测试 safeDivide:');
try {
  console.log('  10 / 2 =', safeDivide(10, 2));
  console.log('  10 / 0 =', safeDivide(10, 0));
} catch (e) {
  console.log('  捕获错误:', e.name, '-', e.message);
}

console.log('\n2. 测试 safeParseJSON:');
console.log('  解析有效 JSON:', safeParseJSON('{"name": "test"}'));
console.log('  解析无效 JSON:', safeParseJSON('invalid json', { fallback: true }));

console.log('\n3. 测试 validateUser:');
try {
  validateUser({ name: '张三', email: 'zhangsan@example.com', age: 20 });
  console.log('  用户验证通过');
} catch (e) {
  console.log('  用户验证失败:', e.field, '-', e.message);
}

try {
  validateUser({ name: '', email: 'invalid', age: 17 });
} catch (e) {
  console.log('  用户验证失败:', e.field, '-', e.message);
}

console.log('\n4. 测试自定义错误:');
const customError = new CustomError('测试自定义错误', 'TEST_ERROR');
console.log('  自定义错误:', customError.name, customError.code, customError.message);

console.log('\n5. 测试错误日志:');
errorLogger(new Error('测试错误'), { test: true });

console.log('\n6. 测试 withErrorHandler:');
const riskyFunction = () => {
  throw new Error('危险操作失败');
};

const safeFunction = withErrorHandler(riskyFunction, (error) => {
  console.log('  安全函数捕获错误:', error.message);
  return '默认值';
});

console.log('  安全函数结果:', safeFunction());

console.log('\n=== 所有测试完成 ===');
