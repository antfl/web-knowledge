
class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

class ValidationError extends CustomError {
  constructor(message, field) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends CustomError {
  constructor(message, url) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
    this.url = url;
  }
}

function safeDivide(a, b) {
  try {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('参数必须是数字');
    }
    if (b === 0) {
      throw new RangeError('除数不能为零');
    }
    return a / b;
  } catch (error) {
    console.error('错误类型:', error.name);
    console.error('错误信息:', error.message);
    throw error;
  }
}

function safeParseJSON(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('JSON 解析失败:', error.message);
    return fallback;
  }
}

function validateUser(user) {
  if (!user) {
    throw new ValidationError('用户数据不能为空', 'user');
  }
  if (!user.name || user.name.trim() === '') {
    throw new ValidationError('用户名不能为空', 'name');
  }
  if (!user.email || !user.email.includes('@')) {
    throw new ValidationError('邮箱格式不正确', 'email');
  }
  if (!user.age || user.age < 18) {
    throw new ValidationError('年龄必须大于等于18岁', 'age');
  }
  return true;
}

async function safeFetch(url, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new NetworkError('HTTP ' + response.status + ': ' + response.statusText, url);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new NetworkError('请求超时', url);
    }
    if (error instanceof NetworkError) {
      throw error;
    }
    throw new NetworkError('请求失败: ' + error.message, url);
  }
}

function withErrorHandler(fn, errorHandler) {
  return function(...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      if (errorHandler) {
        return errorHandler(error);
      }
      console.error('未处理的错误:', error);
      throw error;
    }
  };
}

function asyncErrorHandler(fn) {
  return function(...args) {
    return fn.apply(this, args).catch(error => {
      console.error('异步错误:', error);
      throw error;
    });
  };
}

function errorLogger(error, context = {}) {
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    context
  };
  
  console.error('错误日志:', JSON.stringify(logData, null, 2));
  return logData;
}

function retryOperation(fn, maxRetries = 3, delay = 1000) {
  return async function(...args) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        lastError = error;
        console.warn('操作失败，' + (i + 1) + '/' + maxRetries + '次重试...');
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  };
}

function circuitBreaker(fn, options = {}) {
  const {
    failureThreshold = 5,
    resetTimeout = 30000,
    onOpen,
    onClose
  } = options;
  
  let failures = 0;
  let state = 'closed';
  let lastFailureTime = 0;
  
  return async function(...args) {
    if (state === 'open') {
      if (Date.now() - lastFailureTime > resetTimeout) {
        state = 'half-open';
        if (onClose) onClose();
      } else {
        throw new Error('熔断器已打开，请求被拒绝');
      }
    }
    
    try {
      const result = await fn.apply(this, args);
      failures = 0;
      state = 'closed';
      return result;
    } catch (error) {
      failures++;
      lastFailureTime = Date.now();
      
      if (failures >= failureThreshold) {
        state = 'open';
        if (onOpen) onOpen();
      }
      
      throw error;
    }
  };
}

if (typeof window !== 'undefined') {
  window.onerror = function(message, source, lineno, colno, error) {
    errorLogger(error || new Error(message), {
      source,
      lineno,
      colno
    });
    return false;
  };
  
  window.addEventListener('unhandledrejection', function(event) {
    errorLogger(event.reason, { type: 'unhandledrejection' });
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CustomError,
    ValidationError,
    NetworkError,
    safeDivide,
    safeParseJSON,
    validateUser,
    safeFetch,
    withErrorHandler,
    asyncErrorHandler,
    errorLogger,
    retryOperation,
    circuitBreaker
  };
}
