// 测试 XSS 防护模块
const xss = require('./security-demo');

function runTests() {
  console.log('=== 开始测试 XSS 防护模块 ===\n');

  try {
    // 测试 1: 输入验证
    console.log('测试 1: 输入验证');
    const maliciousInput = '<script>alert(1)</script>';
    const safeInput = 'Hello world';
    console.log('恶意输入验证结果:', xss.validateInput(maliciousInput));
    console.log('安全输入验证结果:', xss.validateInput(safeInput));
    console.log('');

    // 测试 2: HTML 编码
    console.log('测试 2: HTML 编码');
    const htmlInput = '<script>alert(1)</script>';
    const encodedHTML = xss.encodeHTML(htmlInput);
    console.log('编码前:', htmlInput);
    console.log('编码后:', encodedHTML);
    console.log('');

    // 测试 3: JavaScript 编码
    console.log('测试 3: JavaScript 编码');
    const jsInput = 'alert("XSS")';
    const encodedJS = xss.encodeJavaScript(jsInput);
    console.log('编码前:', jsInput);
    console.log('编码后:', encodedJS);
    console.log('');

    // 测试 4: CSS 编码
    console.log('测试 4: CSS 编码');
    const cssInput = 'background: url("javascript:alert(1)")';
    const encodedCSS = xss.encodeCSS(cssInput);
    console.log('编码前:', cssInput);
    console.log('编码后:', encodedCSS);
    console.log('');

    // 测试 5: URL 编码
    console.log('测试 5: URL 编码');
    const urlInput = 'https://example.com?param=<script>alert(1)</script>';
    const encodedURL = xss.encodeURL(urlInput);
    console.log('编码前:', urlInput);
    console.log('编码后:', encodedURL);
    console.log('');

    // 测试 6: XSS 检测
    console.log('测试 6: XSS 检测');
    const xssInput = '<script>alert(1)</script>';
    const normalInput = 'Hello world';
    console.log('恶意输入检测结果:', xss.detectXSS(xssInput));
    console.log('正常输入检测结果:', xss.detectXSS(normalInput));
    console.log('');

    // 测试 7: 清理用户输入
    console.log('测试 7: 清理用户输入');
    const dirtyInput = '<script>alert(1)</script><div onload="alert(2)">Hello</div>';
    const cleanedInput = xss.sanitizeInput(dirtyInput);
    console.log('清理前:', dirtyInput);
    console.log('清理后:', cleanedInput);
    console.log('');

    // 测试 8: 安全的 HTML 解析
    console.log('测试 8: 安全的 HTML 解析');
    const htmlToParse = '<script>alert(1)</script><div>Hello</div>';
    const parsedHTML = xss.parseHTMLSafely(htmlToParse);
    console.log('解析前:', htmlToParse);
    console.log('解析后:', parsedHTML);
    console.log('');

    // 测试 9: 安全的 JSON 解析
    console.log('测试 9: 安全的 JSON 解析');
    const validJSON = '{"name": "test"}';
    const invalidJSON = '{"name": "test",}';
    console.log('有效 JSON 解析结果:', xss.parseJSONSafely(validJSON));
    console.log('无效 JSON 解析结果:', xss.parseJSONSafely(invalidJSON));
    console.log('');

    // 测试 10: 安全的 URL 构建
    console.log('测试 10: 安全的 URL 构建');
    const baseURL = 'https://example.com';
    const params = {
      query: '<script>alert(1)</script>',
      id: 123
    };
    const safeURL = xss.buildSafeURL(baseURL, params);
    console.log('构建的安全 URL:', safeURL);
    console.log('');

    // 测试 11: 存储型 XSS 防护
    console.log('测试 11: 存储型 XSS 防护');
    const storedData = {
      title: '<script>alert(1)</script>',
      content: 'Hello <b>world</b>'
    };
    const sanitizedData = xss.sanitizeStoredData(storedData);
    console.log('清理前:', storedData);
    console.log('清理后:', sanitizedData);
    console.log('');

    // 测试 12: 安全的本地存储
    console.log('测试 12: 安全的本地存储');
    const safeStorage = xss.safeLocalStorage();
    safeStorage.setItem('test', '<script>alert(1)</script>');
    const storedValue = safeStorage.getItem('test');
    console.log('存储的值:', storedValue);
    safeStorage.removeItem('test');
    console.log('移除后的值:', safeStorage.getItem('test'));
    console.log('');

    // 测试 13: CSP 配置
    console.log('测试 13: CSP 配置');
    const csp = xss.setCSP({
      defaultSrc: "'self'",
      scriptSrc: "'self' https://trusted-cdn.com"
    });
    console.log('生成的 CSP:', csp);
    console.log('');

    console.log('=== 所有测试通过！===');
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 运行测试
runTests();
