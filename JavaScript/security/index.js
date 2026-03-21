
function escapeHtml(text) {
  if (typeof text !== 'string') {
    return '';
  }
  // 在浏览器环境中使用 DOM 方法
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  // 在 Node.js 环境中使用正则替换
  return encodeOutput(text);
}

function encodeOutput(data) {
  if (typeof data !== 'string') {
    return '';
  }
  return data
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function sanitizeUrl(url) {
  if (typeof url !== 'string') {
    return '';
  }
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  const urlObj = new URL(url, window.location.href);
  
  if (!allowedProtocols.includes(urlObj.protocol)) {
    return '';
  }
  
  return urlObj.href;
}

function validateInput(input, type) {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\d{11}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    url: /^https?:\/\/.+/,
    alphanumeric: /^[a-zA-Z0-9]+$/
  };
  
  return patterns[type]?.test(input) ?? false;
}

function checkPasswordStrength(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  let strength = 0;
  if (password.length >= minLength) strength++;
  if (hasUpperCase) strength++;
  if (hasLowerCase) strength++;
  if (hasNumbers) strength++;
  if (hasSpecialChar) strength++;
  
  const levels = ['极弱', '弱', '中等', '强', '极强'];
  return {
    score: strength,
    level: levels[strength] || '极弱',
    isStrong: strength >= 4
  };
}

function generateCSRFToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function setCSRFToken() {
  const token = generateCSRFToken();
  const meta = document.createElement('meta');
  meta.name = 'csrf-token';
  meta.content = token;
  document.head.appendChild(meta);
  return token;
}

function getCSRFToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta?.content || '';
}

function createSecureRequest(url, options = {}) {
  const csrfToken = getCSRFToken();
  
  return {
    url,
    options: {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': csrfToken,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'same-origin'
    }
  };
}

function setSecureCookie(name, value, options = {}) {
  const defaults = {
    secure: true,
    sameSite: 'Strict',
    httpOnly: false,
    maxAge: 3600
  };
  
  const config = { ...defaults, ...options };
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (config.secure) cookieString += '; Secure';
  if (config.httpOnly) cookieString += '; HttpOnly';
  if (config.sameSite) cookieString += `; SameSite=${config.sameSite}`;
  if (config.maxAge) cookieString += `; Max-Age=${config.maxAge}`;
  if (config.path) cookieString += `; Path=${config.path}`;
  
  document.cookie = cookieString;
}

function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/`;
}

function isHTTPS() {
  return window.location.protocol === 'https:';
}

function enforceHTTPS() {
  if (!isHTTPS() && window.location.hostname !== 'localhost') {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
}

function generateNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, array));
}

function setCSP(nonce) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'nonce-" + nonce + "'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = csp;
  document.head.appendChild(meta);
  
  return nonce;
}

function preventClickjacking() {
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }
}

function sanitizeObject(obj, allowedKeys) {
  if (typeof obj !== 'object' || obj === null) {
    return {};
  }
  
  const sanitized = {};
  for (const key of allowedKeys) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
}

function rateLimiter(fn, limit, windowMs) {
  const calls = [];
  
  return function(...args) {
    const now = Date.now();
    
    while (calls.length > 0 && calls[0] <= now - windowMs) {
      calls.shift();
    }
    
    if (calls.length >= limit) {
      throw new Error('Rate limit exceeded');
    }
    
    calls.push(now);
    return fn.apply(this, args);
  };
}

function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function hashString(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return hash;
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function detectXSS(input) {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

function detectSQLInjection(input) {
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/gi,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/gi,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
    /((\%27)|(\'))union/gi,
    /exec(\s|\+)+(s|x)p\w+/gi,
    /UNION\s+SELECT/gi,
    /INSERT\s+INTO/gi,
    /DELETE\s+FROM/gi,
    /DROP\s+TABLE/gi
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

function setSecurityHeaders() {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  };
  
  Object.entries(headers).forEach(([name, value]) => {
    const meta = document.createElement('meta');
    meta.httpEquiv = name;
    meta.content = value;
    document.head.appendChild(meta);
  });
}

function createSecureStorage() {
  const storage = new Map();
  
  return {
    set: function(key, value, ttlMs) {
      const item = {
        value,
        expiry: ttlMs ? Date.now() + ttlMs : null
      };
      storage.set(key, item);
    },
    get: function(key) {
      const item = storage.get(key);
      if (!item) return null;
      
      if (item.expiry && Date.now() > item.expiry) {
        storage.delete(key);
        return null;
      }
      
      return item.value;
    },
    delete: function(key) {
      storage.delete(key);
    },
    clear: function() {
      storage.clear();
    }
  };
}

function validateFileUpload(file, options = {}) {
  const defaults = {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  };
  
  const config = { ...defaults, ...options };
  
  if (file.size > config.maxSize) {
    return { valid: false, error: 'File size exceeds limit' };
  }
  
  if (!config.allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!config.allowedExtensions.includes(extension)) {
    return { valid: false, error: 'File extension not allowed' };
  }
  
  return { valid: true };
}

function createSessionManager() {
  let sessionTimeout;
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  
  return {
    start: function() {
      clearTimeout(sessionTimeout);
      sessionTimeout = setTimeout(() => {
        this.logout();
      }, SESSION_TIMEOUT);
    },
    
    refresh: function() {
      this.start();
    },
    
    logout: function() {
      clearTimeout(sessionTimeout);
      deleteCookie('sessionId');
      window.location.href = '/login';
    },
    
    isActive: function() {
      return !!getCookie('sessionId');
    }
  };
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
}

function initSecurity() {
  enforceHTTPS();
  preventClickjacking();
  setSecurityHeaders();
  setCSRFToken();
  
  const sessionManager = createSessionManager();
  sessionManager.start();
  
  document.addEventListener('click', () => sessionManager.refresh());
  document.addEventListener('keypress', () => sessionManager.refresh());
  
  console.log('Security initialized');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    escapeHtml,
    encodeOutput,
    sanitizeUrl,
    validateInput,
    checkPasswordStrength,
    generateCSRFToken,
    setCSRFToken,
    getCSRFToken,
    createSecureRequest,
    setSecureCookie,
    deleteCookie,
    isHTTPS,
    enforceHTTPS,
    generateNonce,
    setCSP,
    preventClickjacking,
    sanitizeObject,
    rateLimiter,
    debounce,
    throttle,
    hashString,
    hashPassword,
    generateSalt,
    detectXSS,
    detectSQLInjection,
    setSecurityHeaders,
    createSecureStorage,
    validateFileUpload,
    createSessionManager,
    getCookie,
    initSecurity
  };
}
