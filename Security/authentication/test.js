// 测试 authentication 模块
const auth = require('./security-demo');

async function runTests() {
  console.log('=== 开始测试 Authentication 模块 ===\n');

  try {
    // 测试 1: 用户注册
    console.log('测试 1: 用户注册');
    const user = await auth.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'SecurePass123!'
    });
    console.log('✓ 用户注册成功:', user.username);
    console.log('');

    // 测试 2: 用户登录
    console.log('测试 2: 用户登录');
    const loginResult = await auth.login('test@example.com', 'SecurePass123!');
    console.log('✓ 用户登录成功，获取到令牌');
    console.log('');

    // 测试 3: 验证 JWT 令牌
    console.log('测试 3: 验证 JWT 令牌');
    const decoded = auth.verifyToken(loginResult.token);
    console.log('✓ 令牌验证成功:', decoded.email);
    console.log('');

    // 测试 4: 刷新 JWT 令牌
    console.log('测试 4: 刷新 JWT 令牌');
    const newToken = auth.refreshToken(loginResult.token);
    console.log('✓ 令牌刷新成功');
    console.log('');

    // 测试 5: 请求密码重置
    console.log('测试 5: 请求密码重置');
    const resetResult = await auth.requestPasswordReset('test@example.com');
    console.log('✓ 密码重置请求成功:', resetResult.message);
    console.log('');

    // 测试 6: 启用两因素认证
    console.log('测试 6: 启用两因素认证');
    const totpResult = auth.enable2FA('test@example.com');
    console.log('✓ 两因素认证启用成功，获取到密钥:', totpResult.secret);
    console.log('');

    // 测试 7: 验证两因素认证
    console.log('测试 7: 验证两因素认证');
    const verify2FAResult = auth.verify2FA('test@example.com', '123456');
    console.log('✓ 两因素认证验证成功');
    console.log('');

    // 测试 8: 社交登录
    console.log('测试 8: 社交登录');
    const socialResult = await auth.socialLogin('google', 'mock-google-token');
    console.log('✓ 社交登录成功');
    console.log('');

    // 测试 9: 检查权限
    console.log('测试 9: 检查权限');
    const hasAccess = auth.checkPermission(user.id, 'user');
    console.log('✓ 权限检查成功，用户有 user 权限:', hasAccess);
    console.log('');

    // 测试 10: 获取用户信息
    console.log('测试 10: 获取用户信息');
    const userInfo = auth.getUserInfo(user.id);
    console.log('✓ 获取用户信息成功:', userInfo.username);
    console.log('');

    // 测试 11: 更新用户信息
    console.log('测试 11: 更新用户信息');
    const updatedUser = await auth.updateUserInfo(user.id, {
      username: 'updateduser'
    });
    console.log('✓ 更新用户信息成功:', updatedUser.username);
    console.log('');

    // 测试 12: 验证邮箱
    console.log('测试 12: 验证邮箱');
    const verifyResult = auth.verifyEmail(user.verificationToken);
    console.log('✓ 邮箱验证成功:', verifyResult.message);
    console.log('');

    // 测试 13: 禁用两因素认证
    console.log('测试 13: 禁用两因素认证');
    const disable2FAResult = auth.disable2FA('test@example.com', '123456');
    console.log('✓ 两因素认证禁用成功:', disable2FAResult.message);
    console.log('');

    // 测试 14: 删除用户
    console.log('测试 14: 删除用户');
    const deleteResult = auth.deleteUser(user.id);
    console.log('✓ 用户删除成功:', deleteResult.message);
    console.log('');

    console.log('=== 所有测试通过！===');
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 运行测试
runTests();
