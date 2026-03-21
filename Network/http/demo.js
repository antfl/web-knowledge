/**
 * HTTP 示例代码
 * 演示 HTTP 请求方法、状态码、头部、缓存等概念
 */

// ==================== HTTP 请求工具类 ====================

class HTTPClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // 设置默认请求头
  setHeader(key, value) {
    this.defaultHeaders[key] = value;
  }

  // 构建完整 URL
  buildURL(path, params = {}) {
    const url = new URL(path, this.baseURL);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }

  // 发送 HTTP 请求
  async request(method, path, options = {}) {
    const url = this.buildURL(path, options.params);
    
    const config = {
      method,
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options.config
    };

    if (options.body) {
      config.body = typeof options.body === 'string' 
        ? options.body 
        : JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      // 处理不同状态码
      if (!response.ok) {
        throw new HTTPError(response.status, response.statusText, response);
      }

      // 解析响应
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data
      };
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      throw new HTTPError(0, error.message, null);
    }
  }

  // GET 请求
  get(path, params, options = {}) {
    return this.request('GET', path, { ...options, params });
  }

  // POST 请求
  post(path, body, options = {}) {
    return this.request('POST', path, { ...options, body });
  }

  // PUT 请求
  put(path, body, options = {}) {
    return this.request('PUT', path, { ...options, body });
  }

  // PATCH 请求
  patch(path, body, options = {}) {
    return this.request('PATCH', path, { ...options, body });
  }

  // DELETE 请求
  delete(path, options = {}) {
    return this.request('DELETE', path, options);
  }
}

// HTTP 错误类
class HTTPError extends Error {
  constructor(status, message, response) {
    super(message);
    this.name = 'HTTPError';
    this.status = status;
    this.response = response;
  }
}

// ==================== HTTP 状态码处理 ====================

const HTTPStatus = {
  // 2xx 成功
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 3xx 重定向
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // 4xx 客户端错误
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 5xx 服务器错误
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,

  // 获取状态码描述
  getDescription(statusCode) {
    const descriptions = {
      200: '请求成功',
      201: '资源创建成功',
      204: '请求成功，无返回内容',
      301: '永久重定向',
      302: '临时重定向',
      304: '资源未修改',
      400: '请求参数错误',
      401: '未认证',
      403: '无权限',
      404: '资源不存在',
      405: '请求方法不允许',
      409: '资源冲突',
      422: '请求格式正确但语义错误',
      429: '请求过于频繁',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    };
    return descriptions[statusCode] || '未知状态码';
  },

  // 判断状态码类别
  isSuccess(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  },

  isRedirect(statusCode) {
    return statusCode >= 300 && statusCode < 400;
  },

  isClientError(statusCode) {
    return statusCode >= 400 && statusCode < 500;
  },

  isServerError(statusCode) {
    return statusCode >= 500 && statusCode < 600;
  }
};

// ==================== Cookie 操作 ====================

const CookieUtil = {
  // 设置 Cookie
  set(name, value, options = {}) {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      if (typeof options.expires === 'number') {
        // 天数
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        cookieString += `; Expires=${date.toUTCString()}`;
      } else {
        cookieString += `; Expires=${options.expires.toUTCString()}`;
      }
    }

    if (options.maxAge) {
      cookieString += `; Max-Age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; Path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; Domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; Secure';
    }

    if (options.httpOnly) {
      cookieString += '; HttpOnly';
    }

    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  },

  // 获取 Cookie
  get(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (decodeURIComponent(cookieName) === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  },

  // 删除 Cookie
  remove(name, options = {}) {
    this.set(name, '', {
      ...options,
      expires: new Date(0)
    });
  },

  // 获取所有 Cookie
  getAll() {
    const cookies = {};
    if (document.cookie) {
      document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      });
    }
    return cookies;
  }
};

// ==================== 缓存控制 ====================

const CacheControl = {
  // 强制缓存策略
  strategies: {
    // 不缓存
    noStore: 'no-store',
    // 缓存但重新验证
    noCache: 'no-cache',
    // 私有缓存
    private: 'private',
    // 公共缓存
    public: 'public'
  },

  // 构建 Cache-Control 头部
  build(maxAge, options = {}) {
    const directives = [];

    if (options.noStore) {
      directives.push('no-store');
      return directives.join(', ');
    }

    if (options.noCache) {
      directives.push('no-cache');
    }

    if (options.isPublic) {
      directives.push('public');
    } else if (options.isPrivate) {
      directives.push('private');
    }

    if (maxAge !== undefined) {
      directives.push(`max-age=${maxAge}`);
    }

    if (options.sMaxAge !== undefined) {
      directives.push(`s-maxage=${options.sMaxAge}`);
    }

    if (options.mustRevalidate) {
      directives.push('must-revalidate');
    }

    if (options.immutable) {
      directives.push('immutable');
    }

    return directives.join(', ');
  },

  // 解析 Cache-Control 头部
  parse(headerValue) {
    const directives = {};
    
    if (!headerValue) return directives;

    headerValue.split(',').forEach(directive => {
      const [key, value] = directive.trim().split('=');
      const normalizedKey = key.trim().toLowerCase();
      
      if (value !== undefined) {
        directives[normalizedKey] = parseInt(value, 10) || value;
      } else {
        directives[normalizedKey] = true;
      }
    });

    return directives;
  }
};

// ==================== URL 处理工具 ====================

const URLUtil = {
  // 解析 URL
  parse(url) {
    try {
      const parsed = new URL(url);
      return {
        href: parsed.href,
        protocol: parsed.protocol,
        host: parsed.host,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        username: parsed.username,
        password: parsed.password,
        origin: parsed.origin,
        // 解析查询参数
        query: this.parseQuery(parsed.search)
      };
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  },

  // 解析查询字符串
  parseQuery(search) {
    const params = {};
    const queryString = search.startsWith('?') ? search.slice(1) : search;
    
    if (!queryString) return params;

    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      const decodedKey = decodeURIComponent(key);
      const decodedValue = value !== undefined ? decodeURIComponent(value) : '';
      
      // 处理数组参数（如 key[]=value1&key[]=value2）
      if (decodedKey.endsWith('[]')) {
        const arrayKey = decodedKey.slice(0, -2);
        if (!params[arrayKey]) {
          params[arrayKey] = [];
        }
        params[arrayKey].push(decodedValue);
      } else {
        params[decodedKey] = decodedValue;
      }
    });

    return params;
  },

  // 构建查询字符串
  buildQuery(params) {
    const pairs = [];
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      
      if (Array.isArray(value)) {
        value.forEach(item => {
          pairs.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`);
        });
      } else {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    });

    return pairs.length > 0 ? `?${pairs.join('&')}` : '';
  },

  // 合并 URL
  resolve(base, relative) {
    return new URL(relative, base).href;
  }
};

// ==================== 演示函数 ====================

function demonstrateHTTP() {
  console.log('=== HTTP 工具演示 ===\n');

  // 1. URL 解析
  console.log('1. URL 解析:');
  const urlInfo = URLUtil.parse('https://user:pass@api.example.com:8080/users?id=123&name=张三#section');
  console.log('  完整 URL:', urlInfo.href);
  console.log('  协议:', urlInfo.protocol);
  console.log('  主机:', urlInfo.host);
  console.log('  路径:', urlInfo.pathname);
  console.log('  查询参数:', JSON.stringify(urlInfo.query));
  console.log('  锚点:', urlInfo.hash);

  // 2. 查询字符串操作
  console.log('\n2. 查询字符串操作:');
  const params = { name: '张三', age: 25, tags: ['js', 'node'] };
  const queryString = URLUtil.buildQuery(params);
  console.log('  构建查询字符串:', queryString);
  
  const parsedParams = URLUtil.parseQuery('?name=%E5%BC%A0%E4%B8%89&age=25');
  console.log('  解析查询字符串:', JSON.stringify(parsedParams));

  // 3. HTTP 状态码
  console.log('\n3. HTTP 状态码:');
  console.log('  200:', HTTPStatus.getDescription(200));
  console.log('  404:', HTTPStatus.getDescription(404));
  console.log('  500:', HTTPStatus.getDescription(500));
  console.log('  200 是成功?', HTTPStatus.isSuccess(200));
  console.log('  404 是客户端错误?', HTTPStatus.isClientError(404));

  // 4. 缓存控制
  console.log('\n4. 缓存控制:');
  const cacheHeader1 = CacheControl.build(3600, { isPublic: true });
  console.log('  公共缓存1小时:', cacheHeader1);
  
  const cacheHeader2 = CacheControl.build(0, { noStore: true });
  console.log('  不缓存:', cacheHeader2);
  
  const parsedCache = CacheControl.parse('public, max-age=3600, must-revalidate');
  console.log('  解析缓存头部:', JSON.stringify(parsedCache));

  // 5. Cookie 操作（仅在浏览器环境）
  if (typeof document !== 'undefined') {
    console.log('\n5. Cookie 操作:');
    CookieUtil.set('username', '张三', { maxAge: 3600, path: '/' });
    console.log('  设置 Cookie: username=张三');
    
    const username = CookieUtil.get('username');
    console.log('  获取 Cookie:', username);
    
    const allCookies = CookieUtil.getAll();
    console.log('  所有 Cookie:', JSON.stringify(allCookies));
  } else {
    console.log('\n5. Cookie 操作: (Node.js 环境不支持)');
  }

  console.log('\n=== 演示完成 ===');
}

// 运行演示
demonstrateHTTP();

// 导出模块（Node.js 环境）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HTTPClient,
    HTTPError,
    HTTPStatus,
    CookieUtil,
    CacheControl,
    URLUtil
  };
}
