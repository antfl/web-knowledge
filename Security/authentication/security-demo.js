// 模拟数据库存储
const users = new Map();
const resetTokens = new Map();
const socialAccounts = new Map();

// 配置
const config = {
  jwtSecret: 'your-secret-key', // 生产环境中应使用环境变量
  jwtExpiration: 3600, // 1小时
  jwtRefreshExpiration: 86400, // 24小时
  resetTokenExpiration: 3600, // 1小时
  maxLoginAttempts: 5,
  lockoutDuration: 300, // 5分钟
  bcryptRounds: 10
};

// 导入必要的库（实际使用时需要安装）
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const speakeasy = require('speakeasy');
// const nodemailer = require('nodemailer');

// 模拟 bcrypt 函数
function bcryptHash(password, rounds) {
  // 实际使用时应使用 bcryptjs
  return Promise.resolve(`hashed-${password}`);
}

function bcryptCompare(password, hash) {
  // 实际使用时应使用 bcryptjs
  return Promise.resolve(hash === `hashed-${password}`);
}

// 模拟 JWT 函数
function jwtSign(payload, secret, options) {
  // 实际使用时应使用 jsonwebtoken
  return JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + options.expiresIn });
}

function jwtVerify(token, secret) {
  // 实际使用时应使用 jsonwebtoken
  try {
    const payload = JSON.parse(token);
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// 模拟 speakeasy 函数
function speakeasyGenerateSecret() {
  // 实际使用时应使用 speakeasy
  return {
    base32: 'JBSWY3DPEHPK3PXP',
    otpauth_url: 'otpauth://totp/Example:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example'
  };
}

function speakeasyTOTPVerify(options) {
  // 实际使用时应使用 speakeasy
  return options.token === '123456'; // 模拟验证
}

// 模拟 nodemailer 函数
function nodemailerCreateTransport() {
  // 实际使用时应使用 nodemailer
  return {
    sendMail: async (options) => {
      console.log('Email sent:', options);
      return { messageId: 'mock-message-id' };
    }
  };
}

// 生成随机字符串
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 生成唯一用户 ID
function generateUserId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 验证邮箱格式
function validateEmail(email) {
  const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  return emailRegex.test(email);
}

// 验证密码强度
function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// 检查用户是否存在
function getUserByEmail(email) {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

// 检查用户是否存在（通过用户名）
function getUserByUsername(username) {
  for (const user of users.values()) {
    if (user.username === username) {
      return user;
    }
  }
  return null;
}

// 用户注册
async function register(userData) {
  const { username, email, password } = userData;

  // 验证输入
  if (!username || !email || !password) {
    throw new Error('All fields are required');
  }

  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!validatePassword(password)) {
    throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  }

  // 检查用户是否已存在
  if (getUserByEmail(email)) {
    throw new Error('Email already in use');
  }

  if (getUserByUsername(username)) {
    throw new Error('Username already in use');
  }

  // 哈希密码
  const hashedPassword = await bcryptHash(password, config.bcryptRounds);

  // 创建用户
  const userId = generateUserId();
  const user = {
    id: userId,
    username,
    email,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date().toISOString(),
    lastLogin: null,
    loginAttempts: 0,
    lockoutUntil: null,
    twoFactorEnabled: false,
    twoFactorSecret: null,
    emailVerified: false,
    verificationToken: generateRandomString(32)
  };

  users.set(userId, user);

  // 发送验证邮件（实际使用时）
  // const transporter = nodemailerCreateTransport();
  // await transporter.sendMail({
  //   to: email,
  //   subject: 'Verify your email',
  //   html: `<p>Please verify your email by clicking <a href="/verify-email?token=${user.verificationToken}">here</a></p>`
  // });

  console.log('User registered:', user);
  return user;
}

// 用户登录
async function login(email, password) {
  // 检查用户是否存在
  const user = getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 检查账户是否被锁定
  if (user.lockoutUntil && Date.now() < user.lockoutUntil) {
    const remainingTime = Math.ceil((user.lockoutUntil - Date.now()) / 1000 / 60);
    throw new Error(`Account is locked. Try again in ${remainingTime} minutes`);
  }

  // 验证密码
  const isPasswordValid = await bcryptCompare(password, user.password);
  if (!isPasswordValid) {
    // 增加登录尝试次数
    user.loginAttempts += 1;

    // 检查是否需要锁定账户
    if (user.loginAttempts >= config.maxLoginAttempts) {
      user.lockoutUntil = Date.now() + config.lockoutDuration * 1000;
      throw new Error('Account locked due to too many failed login attempts');
    }

    throw new Error('Invalid email or password');
  }

  // 重置登录尝试次数
  user.loginAttempts = 0;
  user.lockoutUntil = null;
  user.lastLogin = new Date().toISOString();

  // 检查是否需要两因素认证
  if (user.twoFactorEnabled) {
    // 生成临时令牌，用于两因素认证验证
    const tempToken = generateRandomString(32);
    return {
      requires2FA: true,
      tempToken
    };
  }

  // 生成 JWT 令牌
  const token = generateToken(user);
  return { token, user };
}

// 验证两因素认证
function verify2FA(email, token) {
  const user = getUserByEmail(email);
  if (!user || !user.twoFactorEnabled) {
    throw new Error('Two-factor authentication is not enabled');
  }

  // 验证 TOTP 令牌
  const isValid = speakeasyTOTPVerify({
    secret: user.twoFactorSecret,
    token,
    window: 1 // 允许 1 分钟的时间误差
  });

  if (!isValid) {
    throw new Error('Invalid two-factor token');
  }

  // 生成 JWT 令牌
  const jwtToken = generateToken(user);
  return { token: jwtToken, user };
}

// 生成 JWT 令牌
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  return jwtSign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });
}

// 验证 JWT 令牌
function verifyToken(token) {
  try {
    return jwtVerify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// 刷新 JWT 令牌
function refreshToken(token) {
  try {
    const decoded = jwtVerify(token, config.jwtSecret);
    const user = users.get(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    return generateToken(user);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// 请求密码重置
async function requestPasswordReset(email) {
  const user = getUserByEmail(email);
  if (!user) {
    // 不泄露用户是否存在
    return { message: 'If an account with that email exists, a reset link will be sent' };
  }

  // 生成重置令牌
  const resetToken = generateRandomString(32);
  const expiresAt = Date.now() + config.resetTokenExpiration * 1000;

  resetTokens.set(resetToken, {
    userId: user.id,
    expiresAt
  });

  // 发送密码重置邮件（实际使用时）
  // const transporter = nodemailerCreateTransport();
  // await transporter.sendMail({
  //   to: email,
  //   subject: 'Reset your password',
  //   html: `<p>Please reset your password by clicking <a href="/reset-password?token=${resetToken}">here</a></p>`
  // });

  console.log('Password reset requested for:', email);
  return { message: 'If an account with that email exists, a reset link will be sent' };
}

// 重置密码
async function resetPassword(token, newPassword) {
  // 验证重置令牌
  const resetData = resetTokens.get(token);
  if (!resetData) {
    throw new Error('Invalid or expired reset token');
  }

  if (Date.now() > resetData.expiresAt) {
    resetTokens.delete(token);
    throw new Error('Reset token has expired');
  }

  // 验证新密码
  if (!validatePassword(newPassword)) {
    throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  }

  // 更新密码
  const user = users.get(resetData.userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.password = await bcryptHash(newPassword, config.bcryptRounds);
  resetTokens.delete(token);

  console.log('Password reset for user:', user.email);
  return { message: 'Password reset successfully' };
}

// 启用两因素认证
function enable2FA(email) {
  const user = getUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  // 生成 TOTP 密钥
  const secret = speakeasyGenerateSecret();
  user.twoFactorSecret = secret.base32;
  user.twoFactorEnabled = true;

  console.log('Two-factor authentication enabled for:', email);
  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url
  };
}

// 禁用两因素认证
function disable2FA(email, token) {
  const user = getUserByEmail(email);
  if (!user || !user.twoFactorEnabled) {
    throw new Error('Two-factor authentication is not enabled');
  }

  // 验证 TOTP 令牌
  const isValid = speakeasyTOTPVerify({
    secret: user.twoFactorSecret,
    token,
    window: 1
  });

  if (!isValid) {
    throw new Error('Invalid two-factor token');
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = null;

  console.log('Two-factor authentication disabled for:', email);
  return { message: 'Two-factor authentication disabled successfully' };
}

// 社交登录
async function socialLogin(provider, token) {
  // 验证第三方令牌（实际使用时）
  // 这里模拟验证
  let userData;

  switch (provider) {
    case 'google':
      userData = {
        id: 'google-' + generateRandomString(10),
        email: 'user@example.com',
        name: 'Test User'
      };
      break;
    case 'facebook':
      userData = {
        id: 'facebook-' + generateRandomString(10),
        email: 'user@example.com',
        name: 'Test User'
      };
      break;
    case 'github':
      userData = {
        id: 'github-' + generateRandomString(10),
        email: 'user@example.com',
        name: 'Test User'
      };
      break;
    default:
      throw new Error('Unsupported provider');
  }

  // 检查用户是否已存在
  let user = getUserByEmail(userData.email);

  if (!user) {
    // 创建新用户
    const userId = generateUserId();
    user = {
      id: userId,
      username: userData.name.toLowerCase().replace(/\s+/g, ''),
      email: userData.email,
      password: null, // 社交登录用户没有密码
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      loginAttempts: 0,
      lockoutUntil: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      emailVerified: true, // 社交登录用户邮箱已验证
      verificationToken: null
    };
    users.set(userId, user);
  }

  // 关联社交账号
  socialAccounts.set(`${provider}-${userData.id}`, {
    userId: user.id,
    provider,
    providerId: userData.id
  });

  // 生成 JWT 令牌
  const jwtToken = generateToken(user);
  return { token: jwtToken, user };
}

// 检查权限
function checkPermission(userId, requiredRole) {
  const user = users.get(userId);
  if (!user) {
    return false;
  }

  // 角色层次结构
  const roles = {
    admin: ['admin'],
    moderator: ['moderator', 'admin'],
    user: ['user', 'moderator', 'admin']
  };

  return roles[requiredRole]?.includes(user.role) || false;
}

// 验证邮箱
function verifyEmail(token) {
  for (const user of users.values()) {
    if (user.verificationToken === token) {
      user.emailVerified = true;
      user.verificationToken = null;
      console.log('Email verified for:', user.email);
      return { message: 'Email verified successfully' };
    }
  }
  throw new Error('Invalid or expired verification token');
}

// 获取用户信息
function getUserInfo(userId) {
  const user = users.get(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 返回用户信息（不包含敏感数据）
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    emailVerified: user.emailVerified,
    twoFactorEnabled: user.twoFactorEnabled
  };
}

// 更新用户信息
async function updateUserInfo(userId, updates) {
  const user = users.get(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 验证更新
  if (updates.email && updates.email !== user.email) {
    if (!validateEmail(updates.email)) {
      throw new Error('Invalid email format');
    }
    if (getUserByEmail(updates.email)) {
      throw new Error('Email already in use');
    }
    user.email = updates.email;
    user.emailVerified = false;
    user.verificationToken = generateRandomString(32);
  }

  if (updates.username && updates.username !== user.username) {
    if (getUserByUsername(updates.username)) {
      throw new Error('Username already in use');
    }
    user.username = updates.username;
  }

  if (updates.password) {
    if (!validatePassword(updates.password)) {
      throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }
    user.password = await bcryptHash(updates.password, config.bcryptRounds);
  }

  console.log('User updated:', user);
  return user;
}

// 删除用户
function deleteUser(userId) {
  if (!users.has(userId)) {
    throw new Error('User not found');
  }

  users.delete(userId);
  console.log('User deleted:', userId);
  return { message: 'User deleted successfully' };
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    register,
    login,
    verify2FA,
    generateToken,
    verifyToken,
    refreshToken,
    requestPasswordReset,
    resetPassword,
    enable2FA,
    disable2FA,
    socialLogin,
    checkPermission,
    verifyEmail,
    getUserInfo,
    updateUserInfo,
    deleteUser
  };
}
