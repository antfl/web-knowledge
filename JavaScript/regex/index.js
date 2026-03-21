// JavaScript 正则表达式示例

console.log('========== 基础语法 ==========');

// 创建正则表达式
const regex1 = /hello/i;
const regex2 = new RegExp('world', 'i');

console.log('字面量方式:', regex1);
console.log('构造函数方式:', regex2);
console.log('测试匹配:', regex1.test('Hello World'));

console.log('\n========== 字符类 ==========');

// 基本字符类
const str = 'a1b2c3';
console.log('匹配数字:', str.match(/\d/g));
console.log('匹配非数字:', str.match(/\D/g));
console.log('匹配字母数字:', str.match(/\w/g));
console.log('匹配空白:', 'hello world'.match(/\s/g));

// 自定义字符类
console.log('匹配 a,b,c:', 'abc123'.match(/[abc]/g));
console.log('匹配小写字母:', 'Hello World'.match(/[a-z]/g));
console.log('匹配大写字母:', 'Hello World'.match(/[A-Z]/g));
console.log('匹配数字:', 'abc123'.match(/[0-9]/g));

console.log('\n========== 量词 ==========');

const text = 'aaabbbccc';
console.log('匹配 a+ (1次或多次):', text.match(/a+/g));
console.log('匹配 a* (0次或多次):', text.match(/a*/g));
console.log('匹配 a? (0次或1次):', text.match(/a?/g));
console.log('匹配 a{3} (恰好3次):', text.match(/a{3}/g));
console.log('匹配 a{2,} (至少2次):', text.match(/a{2,}/g));
console.log('匹配 a{1,3} (1-3次):', text.match(/a{1,3}/g));

console.log('\n========== 边界 ==========');

const boundaryText = 'hello world hello';
console.log('匹配开头 hello:', boundaryText.match(/^hello/g));
console.log('匹配结尾 hello:', boundaryText.match(/hello$/g));
console.log('匹配单词边界:', 'hello world'.match(/\bhello\b/g));

console.log('\n========== 分组 ==========');

// 捕获分组
const groupText = '2024-01-15';
const dateMatch = groupText.match(/(\d{4})-(\d{2})-(\d{2})/);
console.log('日期分组匹配:', dateMatch);
console.log('年份:', dateMatch[1]);
console.log('月份:', dateMatch[2]);
console.log('日期:', dateMatch[3]);

// 非捕获分组
const nonCapture = 'abc123def456';
console.log('非捕获分组:', nonCapture.match(/(?:abc)(\d+)/g));

// 命名捕获分组
const namedGroup = 'John:25';
const namedMatch = namedGroup.match(/(?<name>\w+):(?<age>\d+)/);
console.log('命名分组:', namedMatch);
console.log('姓名:', namedMatch.groups.name);
console.log('年龄:', namedMatch.groups.age);

console.log('\n========== 反向引用 ==========');

// 查找重复单词
const repeatText = 'hello hello world';
console.log('重复单词:', repeatText.match(/(\w+)\s+\1/g));

// HTML 标签匹配
const html = '<div>content</div>';
console.log('HTML 标签:', html.match(/<(\w+)>(.*?)<\/\1>/));

console.log('\n========== 前瞻断言 ==========');

// 正向先行断言
const lookaheadText = 'JavaScript Python Java';
console.log('匹配 Java 后面是 Script:', lookaheadText.match(/Java(?=Script)/g));

// 负向先行断言
console.log('匹配 Java 后面不是 Script:', lookaheadText.match(/Java(?!Script)/g));

// 正向后行断言
const lookbehindText = '$100 $200';
console.log('匹配 $ 后面的数字:', lookbehindText.match(/(?<=\$)\d+/g));

// 负向后行断言
console.log('匹配不在 $ 后面的数字:', '100 200 $300'.match(/(?<!\$)\d+/g));

console.log('\n========== String 方法 ==========');

// match()
const matchText = 'hello world hello';
console.log('match():', matchText.match(/hello/g));

// matchAll()
const matchAllText = 'test1 test2 test3';
const matches = [...matchAllText.matchAll(/test(\d)/g)];
console.log('matchAll():', matches);

// replace()
const replaceText = 'hello world';
console.log('replace():', replaceText.replace(/world/, 'JavaScript'));

// replaceAll()
const replaceAllText = 'hello world hello';
console.log('replaceAll():', replaceAllText.replaceAll(/hello/g, 'hi'));

// search()
const searchText = 'hello world';
console.log('search():', searchText.search(/world/));

// split()
const splitText = 'a,b,c,d';
console.log('split():', splitText.split(/,/));

console.log('\n========== RegExp 方法 ==========');

// test()
const testRegex = /hello/;
console.log('test():', testRegex.test('hello world'));

// exec()
const execRegex = /hello/g;
console.log('exec() 第一次:', execRegex.exec('hello hello'));
console.log('exec() 第二次:', execRegex.exec('hello hello'));

console.log('\n========== 实际应用 - 验证 ==========');

// 邮箱验证
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log('邮箱验证 test@example.com:', emailRegex.test('test@example.com'));
console.log('邮箱验证 invalid:', emailRegex.test('invalid'));

// 手机号验证（中国大陆）
const phoneRegex = /^1[3-9]\d{9}$/;
console.log('手机号验证 13812345678:', phoneRegex.test('13812345678'));
console.log('手机号验证 12345678901:', phoneRegex.test('12345678901'));

// 身份证验证（简化版）
const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
console.log('身份证验证:', idCardRegex.test('11010519900307234X'));

// URL 验证
const urlRegex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
console.log('URL 验证:', urlRegex.test('https://www.example.com/path'));

// 密码强度验证（至少8位，包含大小写字母和数字）
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
console.log('密码强度 Password123:', passwordRegex.test('Password123'));
console.log('密码强度 weak:', passwordRegex.test('weak'));

console.log('\n========== 实际应用 - 提取 ==========');

// 提取数字
const extractNum = '价格：100元，数量：5个';
console.log('提取数字:', extractNum.match(/\d+/g));

// 提取邮箱
const extractEmail = '联系邮箱：test@example.com 和 admin@test.com';
console.log('提取邮箱:', extractEmail.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g));

// 提取 URL
const extractUrl = '访问 https://www.example.com 和 http://test.com';
console.log('提取 URL:', extractUrl.match(/https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*/g));

// 提取 HTML 标签内容
const extractHtml = '<div>内容</div><p>段落</p>';
console.log('提取标签内容:', extractHtml.match(/<(\w+)>(.*?)<\/\1>/g));

console.log('\n========== 实际应用 - 替换 ==========');

// 格式化电话号码
const formatPhone = '13812345678';
const formattedPhone = formatPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
console.log('格式化电话号码:', formattedPhone);

// 隐藏手机号中间四位
const hidePhone = '13812345678';
const hiddenPhone = hidePhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
console.log('隐藏手机号:', hiddenPhone);

// 替换敏感词
const sensitiveText = '这是一个敏感词测试';
const censoredText = sensitiveText.replace(/敏感词/g, '***');
console.log('替换敏感词:', censoredText);

// HTML 转义
const htmlText = '<script>alert("test")</script>';
const escapedHtml = htmlText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
console.log('HTML 转义:', escapedHtml);

console.log('\n========== 高级技巧 ==========');

// 贪婪 vs 非贪婪
const greedyText = '<div>内容1</div><div>内容2</div>';
console.log('贪婪匹配:', greedyText.match(/<div>.*<\/div>/));
console.log('非贪婪匹配:', greedyText.match(/<div>.*?<\/div>/g));

// 排除特定字符
const excludeText = 'abc123def456';
console.log('排除数字:', excludeText.match(/[^0-9]+/g));

// 匹配中文
const chineseText = '你好世界 Hello World';
console.log('匹配中文:', chineseText.match(/[\u4e00-\u9fa5]+/g));

// 匹配十六进制颜色
const hexColor = '#FF5733 #123ABC #fff';
console.log('匹配十六进制颜色:', hexColor.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g));

// 匹配 IP 地址
const ipText = '192.168.1.1 10.0.0.1 256.256.256.256';
console.log('匹配 IP 地址:', ipText.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g));

// 匹配日期（YYYY-MM-DD）
const dateText = '2024-01-15 2023-12-31 2024-13-01';
console.log('匹配日期:', dateText.match(/\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/g));

console.log('\n========== 性能优化 ==========');

// 预编译正则表达式
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log('预编译正则测试:', emailPattern.test('test@example.com'));

// 使用非捕获分组
const nonCapturePerformance = /(?:abc)+/g;
console.log('非捕获分组:', 'abcabcabc'.match(nonCapturePerformance));

// 避免回溯
const noBacktrack = /a+b+c+/;
console.log('避免回溯:', 'aaabbbccc'.match(noBacktrack));

console.log('\n========== 总结 ==========');

console.log(`
正则表达式核心要点：

1. 基础语法：
   - 字面量：/pattern/flags
   - 构造函数：new RegExp('pattern', 'flags')
   - 标志：g, i, m, s, u, y

2. 字符类：
   - 基本字符类：. \\d \\D \\w \\W \\s \\S
   - 自定义字符类：[abc] [^abc] [a-z] [A-Z] [0-9]

3. 量词：
   - * + ? {n} {n,} {n,m}
   - 贪婪 vs 非贪婪：*? +? ?? {n,m}?

4. 边界：
   - ^ $ \\b \\B

5. 分组：
   - 捕获分组：()
   - 非捕获分组：(?:)
   - 命名捕获分组：(?<name>)

6. 反向引用：
   - \\1 \\2 \\k<name>

7. 前瞻断言：
   - 正向先行断言：(?=...)
   - 负向先行断言：(?!...)
   - 正向后行断言：(?<=...)
   - 负向后行断言：(?<!...)

8. String 方法：
   - match() matchAll() replace() replaceAll() search() split()

9. RegExp 方法：
   - test() exec()

10. 实际应用：
    - 验证：邮箱、手机号、身份证、URL、密码
    - 提取：数字、邮箱、URL、标签内容
    - 替换：格式化、隐藏信息、敏感词过滤

11. 性能优化：
    - 预编译正则表达式
    - 使用非捕获分组
    - 避免贪婪匹配
    - 避免回溯

掌握正则表达式，是处理字符串操作的必备技能！
`);
