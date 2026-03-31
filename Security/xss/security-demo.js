// XSS 防护模块

// 1. 输入验证
function validateInput(input) {
  if (typeof input !== 'string') {
    return true;
  }
  
  // 检测常见的 XSS 攻击模式
  const xssPatterns = [
    // 脚本标签
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    // JavaScript 伪协议
    /javascript:/gi,
    // 事件处理器
    /on\w+\s*=/gi,
    // iframe 标签
    /<iframe/gi,
    // object 标签
    /<object/gi,
    // embed 标签
    /<embed/gi,
    // form action
    /<form\s+action=/gi,
    // 内联样式中的表达式
    /expression\(/gi,
    // SVG 中的脚本
    /<svg[^>]*>.*<script/gi,
    // VBScript
    /vbscript:/gi,
    // 数据 URI 中的脚本
    /data:text\/html[^,]*,<script/gi
  ];
  
  return !xssPatterns.some(pattern => pattern.test(input));
}

// 2. 输出编码

// HTML 编码
function encodeHTML(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// JavaScript 编码
function encodeJavaScript(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input.replace(/[\\"'<>]/g, (char) => {
    return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
  });
}

// CSS 编码
function encodeCSS(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input.replace(/[\\"'<>()]/g, (char) => {
    return '\\' + char;
  });
}

// URL 编码
function encodeURL(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return encodeURIComponent(input);
}

// 3. 内容安全策略 (CSP) 配置
function setCSP(options = {}) {
  const defaultOptions = {
    defaultSrc: "'self'",
    scriptSrc: "'self'",
    styleSrc: "'self'",
    imgSrc: "'self' data: https:",
    fontSrc: "'self'",
    connectSrc: "'self'",
    mediaSrc: "'self'",
    objectSrc: "'none'",
    frameAncestors: "'none'",
    baseUri: "'self'",
    formAction: "'self'",
    upgradeInsecureRequests: true
  };
  
  const config = { ...defaultOptions, ...options };
  
  let cspString = '';
  
  if (config.defaultSrc) cspString += `default-src ${config.defaultSrc}; `;
  if (config.scriptSrc) cspString += `script-src ${config.scriptSrc}; `;
  if (config.styleSrc) cspString += `style-src ${config.styleSrc}; `;
  if (config.imgSrc) cspString += `img-src ${config.imgSrc}; `;
  if (config.fontSrc) cspString += `font-src ${config.fontSrc}; `;
  if (config.connectSrc) cspString += `connect-src ${config.connectSrc}; `;
  if (config.mediaSrc) cspString += `media-src ${config.mediaSrc}; `;
  if (config.objectSrc) cspString += `object-src ${config.objectSrc}; `;
  if (config.frameAncestors) cspString += `frame-ancestors ${config.frameAncestors}; `;
  if (config.baseUri) cspString += `base-uri ${config.baseUri}; `;
  if (config.formAction) cspString += `form-action ${config.formAction}; `;
  if (config.upgradeInsecureRequests) cspString += `upgrade-insecure-requests; `;
  
  // 在浏览器环境中设置 CSP
  if (typeof document !== 'undefined') {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = cspString.trim();
    document.head.appendChild(meta);
  }
  
  return cspString.trim();
}

// 4. DOM-based XSS 防护

// 安全的 DOM 元素创建
function createSafeElement(tagName, content) {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const element = document.createElement(tagName);
  setSafeContent(element, content);
  return element;
}

// 安全的内容设置
function setSafeContent(element, content) {
  if (!element || typeof document === 'undefined') {
    return;
  }
  
  // 清空元素内容
  element.textContent = '';
  
  // 设置安全内容
  const textNode = document.createTextNode(content);
  element.appendChild(textNode);
}

// 安全的属性设置
function setSafeAttribute(element, attribute, value) {
  if (!element || !attribute) {
    return;
  }
  
  // 验证属性名，防止事件处理器注入
  if (attribute.toLowerCase().startsWith('on')) {
    console.warn('Event attributes are not allowed for security reasons');
    return;
  }
  
  // 验证属性值，特别是 href, src 等
  if (['href', 'src', 'action'].includes(attribute.toLowerCase())) {
    if (value.toLowerCase().startsWith('javascript:')) {
      console.warn('JavaScript URLs are not allowed for security reasons');
      return;
    }
  }
  
  element.setAttribute(attribute, value);
}

// 5. 存储型 XSS 防护
function sanitizeStoredData(data) {
  if (typeof data === 'string') {
    return encodeHTML(data);
  } else if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        data[key] = sanitizeStoredData(data[key]);
      }
    }
  }
  return data;
}

// 6. 反射型 XSS 防护
function sanitizeURLParams() {
  if (typeof window === 'undefined' || !window.location) {
    return;
  }
  
  const params = new URLSearchParams(window.location.search);
  const sanitizedParams = new URLSearchParams();
  
  for (const [key, value] of params.entries()) {
    sanitizedParams.set(key, encodeHTML(value));
  }
  
  // 注意：这里只是演示，实际应用中需要根据具体情况处理
  console.log('Sanitized URL params:', sanitizedParams.toString());
  return sanitizedParams;
}

// 7. XSS 检测
function detectXSS(input) {
  if (typeof input !== 'string') {
    return false;
  }
  
  // 检测常见的 XSS 攻击模式
  const xssPatterns = [
    // 脚本标签
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    // JavaScript 伪协议
    /javascript:/gi,
    // 事件处理器
    /on\w+\s*=/gi,
    // iframe 标签
    /<iframe/gi,
    // object 标签
    /<object/gi,
    // embed 标签
    /<embed/gi,
    // form action
    /<form\s+action=/gi,
    // 内联样式中的表达式
    /expression\(/gi,
    // SVG 中的脚本
    /<svg[^>]*>.*<script/gi,
    // VBScript
    /vbscript:/gi,
    // 数据 URI 中的脚本
    /data:text\/html[^,]*,<script/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

// 8. 清理用户输入
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  // 移除脚本标签
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 移除事件处理器
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // 移除 JavaScript 伪协议
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // 移除 iframe、object、embed 标签
  sanitized = sanitized.replace(/<iframe[^>]*>.*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object[^>]*>.*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed[^>]*>/gi, '');
  
  return sanitized;
}

// 9. 安全的 HTML 解析
function parseHTMLSafely(html) {
  if (typeof html !== 'string') {
    return '';
  }
  
  if (typeof DOMParser === 'undefined') {
    return encodeHTML(html);
  }
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // 移除所有脚本标签
  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // 移除所有事件处理器
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(element => {
    const attributes = Array.from(element.attributes);
    attributes.forEach(attr => {
      if (attr.name.toLowerCase().startsWith('on')) {
        element.removeAttribute(attr.name);
      }
    });
  });
  
  return doc.body.innerHTML;
}

// 10. 安全的 JSON 解析
function parseJSONSafely(jsonString) {
  try {
    // 使用 JSON.parse 而不是 eval
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Invalid JSON:', error);
    return null;
  }
}

// 11. 安全的 URL 构建
function buildSafeURL(base, params) {
  if (typeof base !== 'string') {
    return '';
  }
  
  const url = new URL(base);
  
  if (typeof params === 'object' && params !== null) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, encodeURIComponent(value));
    }
  }
  
  return url.toString();
}

// 12. 安全的本地存储
function safeLocalStorage() {
  if (typeof localStorage === 'undefined') {
    return {
      setItem: () => {},
      getItem: () => null,
      removeItem: () => {},
      clear: () => {}
    };
  }
  
  return {
    setItem: (key, value) => {
      try {
        const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
        localStorage.setItem(key, JSON.stringify(sanitizedValue));
      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
    },
    getItem: (key) => {
      try {
        const value = localStorage.getItem(key);
        return value ? parseJSONSafely(value) : null;
      } catch (error) {
        console.error('Error getting localStorage:', error);
        return null;
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing localStorage:', error);
      }
    },
    clear: () => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  };
}

// 13. 初始化 XSS 防护
function initXSSProtection() {
  // 设置 CSP
  setCSP();
  
  // 清理 URL 参数
  sanitizeURLParams();
  
  // 监听 DOM 变化，防止动态注入
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查并清理新添加的元素
            sanitizeElement(node);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  console.log('XSS protection initialized');
}

// 清理元素
function sanitizeElement(element) {
  // 移除脚本标签
  const scripts = element.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // 移除事件处理器
  const allElements = element.querySelectorAll('*');
  allElements.forEach(el => {
    const attributes = Array.from(el.attributes);
    attributes.forEach(attr => {
      if (attr.name.toLowerCase().startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // 输入验证
    validateInput,
    
    // 输出编码
    encodeHTML,
    encodeJavaScript,
    encodeCSS,
    encodeURL,
    
    // CSP 配置
    setCSP,
    
    // DOM 操作
    createSafeElement,
    setSafeContent,
    setSafeAttribute,
    
    // XSS 防护
    sanitizeStoredData,
    sanitizeURLParams,
    detectXSS,
    sanitizeInput,
    parseHTMLSafely,
    parseJSONSafely,
    
    // 安全工具
    buildSafeURL,
    safeLocalStorage,
    
    // 初始化
    initXSSProtection
  };
}
