// TypeScript 基础知识示例

// 1. 基本类型

/**
 * 用户名变量
 * @description 使用 string 类型定义字符串变量
 * string 类型用于表示文本数据
 * 
 * @example
 * const name: string = "John Doe";
 * const greeting: string = `Hello, ${name}!`;
 */
let username: string = "John Doe";

/**
 * 年龄变量
 * @description 使用 number 类型定义数字变量
 * number 类型用于表示数值，包括整数和浮点数
 * 
 * @example
 * const age: number = 30;
 * const price: number = 19.99;
 * const pi: number = 3.14159;
 */
let age: number = 30;

/**
 * 活跃状态变量
 * @description 使用 boolean 类型定义布尔变量
 * boolean 类型只有两个值：true 和 false
 * 
 * @example
 * const isActive: boolean = true;
 * const isCompleted: boolean = false;
 */
let isActive: boolean = true;

/**
 * 空值变量
 * @description 使用 null 类型定义空值变量
 * null 表示"没有值"或"空值"
 * 
 * @example
 * const nothing: null = null;
 * const empty: null = null;
 */
let nothing: null = null;

/**
 * 未定义变量
 * @description 使用 undefined 类型定义未定义变量
 * undefined 表示变量已声明但未赋值
 * 
 * @example
 * let notDefined: undefined = undefined;
 * let emptyVar: string | undefined; // 可能是 string 或 undefined
 */
let notDefined: undefined = undefined;

/**
 * 唯一标识符
 * @description 使用 symbol 类型定义唯一标识符
 * symbol 类型用于创建唯一的标识符，常用于对象属性键
 * 
 * @example
 * const id: symbol = Symbol("id");
 * const key: symbol = Symbol("key");
 * console.log(id === key); // false，每个 symbol 都是唯一的
 */
let uniqueId: symbol = Symbol("id");

/**
 * 大整数变量
 * @description 使用 bigint 类型定义大整数变量
 * bigint 类型用于表示超出 number 类型安全范围的大整数
 * 
 * @example
 * const bigNumber: bigint = 9007199254740991n;
 * const hugeNumber: bigint = 123456789012345678901234567890n;
 */
let bigNumber: bigint = 9007199254740991n;

// 数组类型

/**
 * 数字数组
 * @description 使用 number[] 语法定义数字数组
 * 这种语法表示一个包含数字元素的数组
 * 
 * @example
 * const numbers: number[] = [1, 2, 3, 4, 5];
 * numbers.push(6); // ✅ 可以添加数字
 * numbers.push("hello"); // ❌ 错误：不能添加字符串
 */
let numbers: number[] = [1, 2, 3, 4, 5];

/**
 * 字符串数组
 * @description 使用 Array<string> 泛型语法定义字符串数组
 * 这种语法与 string[] 等价，是另一种数组类型定义方式
 * 
 * @example
 * const strings: Array<string> = ["hello", "world"];
 * strings.push("test"); // ✅ 可以添加字符串
 * strings.push(123); // ❌ 错误：不能添加数字
 */
let strings: Array<string> = ["hello", "world"];

/**
 * 只读数字数组
 * @description 使用 ReadonlyArray<number> 定义只读数组
 * 只读数组不能被修改，提供了额外的类型安全
 * 
 * @example
 * const readonlyNumbers: ReadonlyArray<number> = [1, 2, 3];
 * readonlyNumbers[0] = 10; // ❌ 错误：不能修改只读数组
 * readonlyNumbers.push(4); // ❌ 错误：不能修改只读数组
 * console.log(readonlyNumbers[0]); // ✅ 可以读取
 */
let readonlyNumbers: ReadonlyArray<number> = [1, 2, 3];

// 元组类型

/**
 * 字符串数字元组
 * @description 使用元组类型定义固定长度和类型的数组
 * 元组是数组的子类型，具有固定数量的元素，每个元素都有特定的类型
 * 
 * @example
 * const tuple: [string, number] = ["hello", 42]; // ✅ 正确
 * const invalidTuple: [string, number] = [42, "hello"]; // ❌ 错误：类型不匹配
 * const invalidLength: [string, number] = ["hello", 42, true]; // ❌ 错误：长度不匹配
 */
let tuple: [string, number] = ["hello", 42];

/**
 * 可选元素元组
 * @description 使用 ? 修饰符定义可选的元组元素
 * 可选元素可以存在也可以不存在
 * 
 * @example
 * const optionalTuple1: [string, number, boolean?] = ["hello", 42]; // ✅ 可选元素不存在
 * const optionalTuple2: [string, number, boolean?] = ["hello", 42, true]; // ✅ 可选元素存在
 */
let optionalTuple: [string, number, boolean?] = ["hello", 42];

/**
 * 剩余元素元组
 * @description 使用 ... 语法定义剩余元素
 * 剩余元素表示元组可以有任意数量的后续元素
 * 
 * @example
 * const restTuple1: [string, ...number[]] = ["hello", 1, 2, 3]; // ✅ 有效
 * const restTuple2: [string, ...number[]] = ["hello"]; // ✅ 有效，剩余元素为空
 * const restTuple3: [string, ...number[]] = [1, 2, 3]; // ❌ 错误：第一个元素必须是字符串
 */
let restTuple: [string, ...number[]] = ["hello", 1, 2, 3];

// 对象类型

/**
 * 用户对象类型
 * @description 定义一个用户对象，包含多个属性
 * 
 * @property name - 用户名，必需属性
 * @property age - 年龄，必需属性
 * @property email - 邮箱，可选属性（使用 ? 修饰符）
 * @property id - 用户 ID，只读属性（使用 readonly 修饰符）
 * 
 * @example
 * const userObj = {
 *   name: "John",
 *   age: 30,
 *   id: 1
 * }; // ✅ 有效，email 是可选的
 * 
 * const invalidUser = {
 *   name: "John"
 * }; // ❌ 错误：缺少必需属性 age 和 id
 */
let userObj: {
  name: string;
  age: number;
  email?: string;
  readonly id: number;
} = {
  name: "John",
  age: 30,
  id: 1
};

// 联合类型

/**
 * 联合类型变量
 * @description 使用 | 操作符定义联合类型
 * 联合类型表示值可以是多种类型之一
 * 
 * @example
 * let value: string | number = "hello"; // ✅ 可以是字符串
 * value = 42; // ✅ 也可以是数字
 * value = true; // ❌ 错误：不能是布尔值
 */
let value: string | number = "hello";
value = 42;

// 交叉类型

/**
 * 人员类型
 * @description 定义一个人员类型，包含姓名属性
 */
type Person = {
  name: string;
};

/**
 * 员工类型
 * @description 定义一个员工类型，包含 ID 属性
 */
type Employee = {
  id: number;
};

/**
 * 人员员工类型
 * @description 使用 & 操作符定义交叉类型
 * 交叉类型将多个类型合并为一个新类型，新类型包含所有类型的属性
 * 
 * @example
 * const personEmployee: PersonEmployee = {
 *   name: "John",
 *   id: 1
 * }; // ✅ 必须包含 Person 和 Employee 的所有属性
 * 
 * const invalid: PersonEmployee = {
 *   name: "John"
 * }; // ❌ 错误：缺少 id 属性
 */
type PersonEmployee = Person & Employee;

/**
 * 人员员工实例
 * @description 创建一个 PersonEmployee 类型的对象
 */
const personEmployee: PersonEmployee = {
  name: "John",
  id: 1
};

// 字面量类型

/**
 * 方向变量
 * @description 使用字面量类型限制值为特定的字符串
 * 字面量类型比 string 类型更精确，只能是指定的几个值之一
 * 
 * @example
 * let direction: "up" | "down" | "left" | "right" = "up"; // ✅ 有效
 * direction = "down"; // ✅ 有效
 * direction = "forward"; // ❌ 错误：不是允许的值
 */
let direction: "up" | "down" | "left" | "right" = "up";

/**
 * 骰子点数变量
 * @description 使用数字字面量类型限制值为 1-6 的整数
 * 
 * @example
 * let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 6; // ✅ 有效
 * diceRoll = 3; // ✅ 有效
 * diceRoll = 7; // ❌ 错误：不是允许的值
 */
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 6;

/**
 * 成功标志变量
 * @description 使用布尔字面量类型限制值为 true 或 false
 * 虽然与 boolean 类型类似，但字面量类型更精确
 * 
 * @example
 * let success: true | false = true; // ✅ 有效
 * success = false; // ✅ 有效
 */
let success: true | false = true;

// any 和 unknown

/**
 * 任意类型变量
 * @description 使用 any 类型表示可以是任何类型
 * any 类型会跳过类型检查，应该谨慎使用
 * 
 * @example
 * let anything: any = 42;
 * anything = "hello"; // ✅ 可以赋值为任何类型
 * anything = { name: "John" }; // ✅ 可以赋值为任何类型
 * anything.nonExistentMethod(); // ✅ 不会报错，但运行时可能出错
 */
let anything: any = 42;
anything = "hello";
anything = { name: "John" };

/**
 * 未知类型变量
 * @description 使用 unknown 类型表示未知的类型
 * unknown 类型比 any 更安全，使用前必须进行类型检查
 * 
 * @example
 * let unknownValue: unknown = 42;
 * if (typeof unknownValue === "number") {
 *   console.log(unknownValue.toFixed(2)); // ✅ 类型检查后可以安全使用
 * }
 * console.log(unknownValue.toFixed(2)); // ❌ 错误：必须先进行类型检查
 */
let unknownValue: unknown = 42;
if (typeof unknownValue === "number") {
  console.log(unknownValue.toFixed(2));
}

// void 和 never

/**
 * 记录消息函数
 * @description 使用 void 类型表示函数没有返回值
 * void 类型用于不返回值的函数
 * 
 * @param message - 要记录的消息
 * @returns 无返回值
 * 
 * @example
 * logMessage("Hello, World!"); // 输出: Hello, World!
 */
function logMessage(message: string): void {
  console.log(message);
}

/**
 * 抛出错误函数
 * @description 使用 never 类型表示函数永远不会正常返回
 * never 类型用于总是抛出错误或无限循环的函数
 * 
 * @param message - 错误消息
 * @returns 永远不会返回
 * 
 * @example
 * throwError("Something went wrong!"); // 抛出错误，永远不会返回
 */
function throwError(message: string): never {
  throw new Error(message);
}

// 2. 变量声明

/**
 * var 声明的变量
 * @description 使用 var 声明变量（不推荐使用）
 * var 具有函数作用域，存在变量提升问题，现代 JavaScript/TypeScript 推荐使用 let 和 const
 * 
 * @example
 * var x = 10;
 * if (true) {
 *   var x = 20; // 修改的是外层的 x
 * }
 * console.log(x); // 20
 */
var x = 10;

/**
 * let 声明的变量
 * @description 使用 let 声明变量（推荐使用）
 * let 具有块级作用域，不存在变量提升，可以重新赋值
 * 
 * @example
 * let y = 20;
 * if (true) {
 *   let y = 30; // 创建新的块级作用域变量
 *   console.log(y); // 30
 * }
 * console.log(y); // 20
 * y = 40; // ✅ 可以重新赋值
 */
let y = 20;

/**
 * const 声明的常量
 * @description 使用 const 声明常量（推荐使用）
 * const 具有块级作用域，必须初始化，不能重新赋值
 * 
 * @example
 * const z = 30;
 * z = 40; // ❌ 错误：不能重新赋值常量
 * 
 * const obj = { a: 1 };
 * obj.a = 2; // ✅ 可以修改对象的属性
 * obj = { a: 2 }; // ❌ 错误：不能重新赋值常量
 */
const z = 30;

// 解构赋值

/**
 * 数组解构赋值
 * @description 使用解构赋值从数组中提取值
 * 解构赋值是一种简洁的语法，用于从数组或对象中提取值
 * 
 * @example
 * const [first, second, ...rest] = [1, 2, 3, 4, 5];
 * console.log(first); // 1
 * console.log(second); // 2
 * console.log(rest); // [3, 4, 5]
 */
let [first, second, ...rest] = [1, 2, 3, 4, 5];

/**
 * 对象解构赋值
 * @description 使用解构赋值从对象中提取属性
 * 可以使用 : 语法重命名属性
 * 
 * @example
 * const { name: userName, age: userAge, ...otherProps } = {
 *   name: "John",
 *   age: 30,
 *   email: "john@example.com",
 *   city: "New York"
 * };
 * console.log(userName); // "John"
 * console.log(userAge); // 30
 * console.log(otherProps); // { email: "john@example.com", city: "New York" }
 */
let { name: userName, age: userAge, ...otherProps } = {
  name: "John",
  age: 30,
  email: "john@example.com",
  city: "New York"
};

/**
 * 函数参数解构
 * @description 在函数参数中使用解构赋值
 * 这样可以直接从传入的对象中提取需要的属性
 * 
 * @param name - 从参数对象中提取的 name 属性
 * @param age - 从参数对象中提取的 age 属性
 * 
 * @example
 * greet({ name: "John", age: 30 }); // 输出: Hello John, you are 30 years old
 * greet({ name: "Jane", age: 25, city: "London" }); // 输出: Hello Jane, you are 25 years old
 */
function greet({ name, age }: { name: string; age: number }) {
  console.log(`Hello ${name}, you are ${age} years old`);
}

// 展开运算符

/**
 * 数组展开
 * @description 使用展开运算符 ... 展开数组
 * 展开运算符可以将数组展开为独立的元素
 * 
 * @example
 * const arr1 = [1, 2, 3];
 * const arr2 = [...arr1, 4, 5, 6];
 * console.log(arr2); // [1, 2, 3, 4, 5, 6]
 * 
 * // 也可以用于复制数组
 * const arr3 = [...arr1];
 * console.log(arr3); // [1, 2, 3]
 */
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5, 6];

/**
 * 对象展开
 * @description 使用展开运算符 ... 展开对象
 * 展开运算符可以将对象的属性展开到另一个对象中
 * 
 * @example
 * const obj1 = { a: 1, b: 2 };
 * const obj2 = { ...obj1, c: 3 };
 * console.log(obj2); // { a: 1, b: 2, c: 3 }
 * 
 * // 后面的属性会覆盖前面的属性
 * const obj3 = { ...obj1, a: 10 };
 * console.log(obj3); // { a: 10, b: 2 }
 */
let obj1 = { a: 1, b: 2 };
let obj2 = { ...obj1, c: 3 };

// 3. 函数

/**
 * 加法函数
 * @description 一个简单的加法函数，接受两个数字参数，返回它们的和
 * 
 * @param a - 第一个加数
 * @param b - 第二个加数
 * @returns 两个数字的和
 * 
 * @example
 * add(5, 3); // 返回 8
 * add(10, -5); // 返回 5
 */
function add(a: number, b: number): number {
  return a + b;
}

/**
 * 乘法函数表达式
 * @description 使用函数表达式定义的乘法函数
 * 函数表达式是将函数赋值给变量的一种方式
 * 
 * @param a - 第一个乘数
 * @param b - 第二个乘数
 * @returns 两个数字的乘积
 * 
 * @example
 * multiply(4, 3); // 返回 12
 * multiply(-2, 5); // 返回 -10
 */
const multiply = function(a: number, b: number): number {
  return a * b;
};

/**
 * 除法箭头函数
 * @description 使用箭头函数语法定义的除法函数
 * 箭头函数是 ES6 引入的更简洁的函数语法
 * 
 * @param a - 被除数
 * @param b - 除数
 * @returns 两个数字的商
 * 
 * @example
 * divide(10, 2); // 返回 5
 * divide(7, 2); // 返回 3.5
 */
const divide = (a: number, b: number): number => a / b;

// 函数类型

/**
 * 数学运算类型
 * @description 定义一个函数类型，表示接受两个数字参数并返回一个数字的函数
 * 函数类型使用 (参数列表) => 返回值类型 的语法
 * 
 * @example
 * const subtract: MathOperation = (a, b) => a - b;
 * subtract(10, 3); // 返回 7
 */
type MathOperation = (a: number, b: number) => number;

/**
 * 减法函数
 * @description 使用 MathOperation 类型定义的减法函数
 * 这展示了如何使用自定义的函数类型
 * 
 * @param a - 被减数
 * @param b - 减数
 * @returns 两个数字的差
 * 
 * @example
 * subtract(10, 3); // 返回 7
 * subtract(5, 8); // 返回 -3
 */
const subtract: MathOperation = (a, b) => a - b;

/**
 * 字符串运算接口
 * @description 使用接口定义函数类型
 * 接口可以定义可调用对象，即可以像函数一样调用的对象
 * 
 * @example
 * const toUpperCase: StringOperation = (input) => input.toUpperCase();
 * toUpperCase("hello"); // 返回 "HELLO"
 */
interface StringOperation {
  (input: string): string;
}

/**
 * 转大写函数
 * @description 使用 StringOperation 接口定义的转大写函数
 * 
 * @param input - 要转换的字符串
 * @returns 转换为大写的字符串
 * 
 * @example
 * toUpperCase("hello"); // 返回 "HELLO"
 * toUpperCase("TypeScript"); // 返回 "TYPESCRIPT"
 */
const toUpperCase: StringOperation = (input) => input.toUpperCase();

// 可选参数和默认参数

/**
 * 问候人员函数
 * @description 演示可选参数的使用
 * 可选参数使用 ? 修饰符，调用时可以不提供该参数
 * 
 * @param name - 人员姓名
 * @param greeting - 可选的问候语，如果不提供则使用默认值
 * @returns 问候字符串
 * 
 * @example
 * greetPerson("John"); // 返回 "Hello, John!"
 * greetPerson("Jane", "Hi"); // 返回 "Hi, Jane!"
 * greetPerson("Bob", "Good morning"); // 返回 "Good morning, Bob!"
 */
function greetPerson(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}!` : `Hello, ${name}!`;
}

/**
 * 创建人员函数
 * @description 演示默认参数的使用
 * 默认参数使用 = 语法，调用时不提供该参数时使用默认值
 * 
 * @param name - 人员姓名
 * @param age - 人员年龄，默认值为 30
 * @returns 包含姓名和年龄的对象
 * 
 * @example
 * createPerson("Alice"); // 返回 { name: "Alice", age: 30 }
 * createPerson("Bob", 25); // 返回 { name: "Bob", age: 25 }
 */
function createPerson(name: string, age: number = 30): { name: string; age: number } {
  return { name, age };
}

// 剩余参数

/**
 * 求和函数
 * @description 演示剩余参数的使用
 * 剩余参数使用 ... 语法，可以接受任意数量的参数
 * 
 * @param numbers - 任意数量的数字参数
 * @returns 所有数字的总和
 * 
 * @example
 * sum(1, 2, 3); // 返回 6
 * sum(10, 20, 30, 40, 50); // 返回 150
 * sum(); // 返回 0
 */
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// 函数重载

/**
 * 处理输入函数重载声明
 * @description 函数重载允许为同一个函数定义多个函数签名
 * TypeScript 会根据参数类型选择正确的重载
 * 
 * @param input - 字符串输入
 * @returns 转换为大写的字符串
 * 
 * @example
 * processInput("hello"); // 返回 "HELLO"
 */
function processInput(input: string): string;

/**
 * 处理输入函数重载声明
 * @description 函数重载的第二个签名
 * 
 * @param input - 数字输入
 * @returns 乘以 2 的数字
 * 
 * @example
 * processInput(5); // 返回 10
 */
function processInput(input: number): number;

/**
 * 处理输入函数实现
 * @description 函数重载的实际实现
 * 实现必须兼容所有重载签名
 * 
 * @param input - 可以是字符串或数字
 * @returns 根据输入类型返回相应的结果
 */
function processInput(input: string | number): string | number {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input * 2;
}

// 泛型函数

/**
 * 标识函数
 * @description 一个简单的泛型函数，返回传入的参数
 * 泛型函数使用 <T> 语法，T 是类型参数，表示任意类型
 * 
 * @template T - 泛型类型参数
 * @param arg - 任意类型的参数
 * @returns 返回传入的参数，类型与参数相同
 * 
 * @example
 * identity<string>("hello"); // 返回 "hello"，类型为 string
 * identity(42); // 返回 42，类型被推断为 number
 * identity({ name: "John" }); // 返回 { name: "John" }，类型被推断为 { name: string }
 */
function identity<T>(arg: T): T {
  return arg;
}

/**
 * 标识函数调用示例 1
 * @description 明确指定类型参数
 * 
 * @example
 * result1 的类型是 string，值为 "hello"
 */
let result1 = identity<string>("hello");

/**
 * 标识函数调用示例 2
 * @description 类型推断，TypeScript 自动推断类型参数
 * 
 * @example
 * result2 的类型被推断为 number，值为 42
 */
let result2 = identity(42);

// 4. 接口

/**
 * 人员接口
 * @description 定义一个人员接口，包含姓名和年龄属性
 * 接口用于定义对象的结构，提供类型检查和代码提示
 * 
 * @property name - 人员姓名
 * @property age - 人员年龄
 * 
 * @example
 * const person: PersonInterface = {
 *   name: "John",
 *   age: 30
 * };
 */
interface PersonInterface {
  name: string;
  age: number;
}

/**
 * 问候人员接口函数
 * @description 使用 PersonInterface 接口作为参数类型的函数
 * 
 * @param person - 人员对象，必须符合 PersonInterface 接口
 * 
 * @example
 * greetPersonInterface({ name: "John", age: 30 }); // 输出: Hello John, you are 30 years old
 */
function greetPersonInterface(person: PersonInterface): void {
  console.log(`Hello ${person.name}, you are ${person.age} years old`);
}

/**
 * 用户接口
 * @description 定义一个用户接口，包含可选属性
 * 
 * @property id - 用户 ID，必需属性
 * @property name - 用户名，必需属性
 * @property email - 用户邮箱，可选属性（使用 ? 修饰符）
 * 
 * @example
 * const user1: UserInterface = {
 *   id: 1,
 *   name: "John"
 * }; // ✅ 有效，email 是可选的
 * 
 * const user2: UserInterface = {
 *   id: 2,
 *   name: "Jane",
 *   email: "jane@example.com"
 * }; // ✅ 有效，提供了 email
 */
interface UserInterface {
  id: number;
  name: string;
  email?: string;
}

/**
 * 点接口
 * @description 定义一个点接口，包含只读属性
 * 
 * @property x - x 坐标，只读属性（使用 readonly 修饰符）
 * @property y - y 坐标，只读属性
 * 
 * @example
 * const point: Point = { x: 10, y: 20 };
 * point.x = 15; // ❌ 错误：不能修改只读属性
 * console.log(point.x); // ✅ 可以读取
 */
interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * 点实例
 * @description 创建一个 Point 接口的实例
 */
const point: Point = { x: 10, y: 20 };

/**
 * 搜索函数接口
 * @description 定义一个函数接口，用于搜索字符串
 * 函数接口可以定义可调用对象的类型
 * 
 * @param source - 要搜索的源字符串
 * @param subString - 要查找的子字符串
 * @returns 如果找到子字符串返回 true，否则返回 false
 * 
 * @example
 * const mySearch: SearchFunc = (source, subString) => {
 *   return source.indexOf(subString) > -1;
 * };
 * mySearch("hello world", "world"); // 返回 true
 */
interface SearchFunc {
  (source: string, subString: string): boolean;
}

/**
 * 搜索函数实例
 * @description 实现 SearchFunc 接口的函数
 */
let mySearch: SearchFunc = (source, subString) => {
  return source.indexOf(subString) > -1;
};

/**
 * 字符串数组接口
 * @description 定义一个字符串数组接口
 * 使用索引签名定义数组的类型
 * 
 * @property [index: number] - 数字索引，返回字符串
 * 
 * @example
 * const myArray: StringArray = ["hello", "world"];
 * myArray[0]; // "hello"
 * myArray[1]; // "world"
 */
interface StringArray {
  [index: number]: string;
}

/**
 * 字符串数组实例
 * @description 创建一个 StringArray 接口的实例
 */
let myArray: StringArray = ["hello", "world"];

/**
 * 字符串映射接口
 * @description 定义一个字符串映射接口
 * 使用索引签名定义对象的键值对类型
 * 
 * @property [key: string] - 字符串键，返回字符串
 * 
 * @example
 * const myMap: StringMap = {
 *   name: "John",
 *   email: "john@example.com"
 * };
 * myMap["name"]; // "John"
 * myMap["email"]; // "john@example.com"
 */
interface StringMap {
  [key: string]: string;
}

/**
 * 字符串映射实例
 * @description 创建一个 StringMap 接口的实例
 */
let myMap: StringMap = {
  name: "John",
  email: "john@example.com"
};

/**
 * 时钟接口
 * @description 定义一个时钟接口，包含属性和方法
 * 
 * @property currentTime - 当前时间，Date 类型
 * @method setTime - 设置时间的方法
 * @param d - 要设置的时间
 * 
 * @example
 * class Clock implements ClockInterface {
 *   currentTime: Date = new Date();
 *   setTime(d: Date) {
 *     this.currentTime = d;
 *   }
 * }
 */
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

/**
 * 时钟类
 * @description 实现 ClockInterface 接口的类
 * 使用 implements 关键字实现接口
 */
class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
}

/**
 * 形状接口
 * @description 定义一个形状接口，作为基础接口
 * 
 * @property color - 形状的颜色
 * 
 * @example
 * interface Square extends Shape {
 *   sideLength: number;
 * }
 */
interface Shape {
  color: string;
}

/**
 * 正方形接口
 * @description 继承自 Shape 接口，添加了正方形特有的属性
 * 接口继承使用 extends 关键字，可以继承多个接口
 * 
 * @property color - 继承自 Shape 的颜色属性
 * @property sideLength - 正方形的边长
 * 
 * @example
 * const square: Square = {
 *   color: "red",
 *   sideLength: 10
 * };
 */
interface Square extends Shape {
  sideLength: number;
}

/**
 * 正方形实例
 * @description 创建一个 Square 接口的实例
 */
let square: Square = {
  color: "red",
  sideLength: 10
};

/**
 * 计数器接口
 * @description 定义一个混合接口，既可调用又有属性和方法
 * 这种接口可以定义复杂的对象类型
 * 
 * @property (start: number) => string - 可调用签名，接受一个数字参数，返回字符串
 * @property interval - 间隔属性
 * @method reset - 重置方法
 * 
 * @example
 * function getCounter(): Counter {
 *   let counter = <Counter>function(start: number) {
 *     return `Counting from ${start}`;
 *   };
 *   counter.interval = 123;
 *   counter.reset = function() {
 *     console.log("Reset");
 *   };
 *   return counter;
 * }
 */
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

/**
 * 获取计数器函数
 * @description 返回一个 Counter 类型的对象
 * 演示了如何创建混合接口的实例
 * 
 * @returns Counter 类型的对象
 * 
 * @example
 * const counter = getCounter();
 * counter(10); // "Counting from 10"
 * counter.interval; // 123
 * counter.reset(); // "Reset"
 */
function getCounter(): Counter {
  let counter = <Counter>function(start: number) {
    return `Counting from ${start}`;
  };
  counter.interval = 123;
  counter.reset = function() {
    console.log("Reset");
  };
  return counter;
}

// 5. 类

/**
 * 人员类
 * @description 定义一个简单的人员类
 * 类是创建对象的模板，包含属性和方法
 * 
 * @property name - 人员姓名
 * @property age - 人员年龄
 * @method greet - 问候方法
 * 
 * @example
 * const person = new PersonClass("John", 30);
 * person.greet(); // "Hello, my name is John"
 */
class PersonClass {
  name: string;
  age: number;

  /**
   * 构造函数
   * @description 初始化类的实例
   * @param name - 人员姓名
   * @param age - 人员年龄
   */
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  /**
   * 问候方法
   * @description 返回问候字符串
   * @returns 包含姓名的问候字符串
   */
  greet(): string {
    return `Hello, my name is ${this.name}`;
  }
}

/**
 * 人员实例
 * @description 创建 PersonClass 的实例
 */
const person = new PersonClass("John", 30);
console.log(person.greet());

/**
 * 员工类
 * @description 演示访问修饰符的使用
 * 
 * @property name - 公共属性，可以在任何地方访问
 * @property salary - 私有属性，只能在类内部访问
 * @property department - 受保护属性，只能在类及其子类中访问
 * @property id - 只读属性，初始化后不能修改
 * @method getSalary - 获取薪水的方法
 * 
 * @example
 * const employee = new EmployeeClass("John", 50000, "Engineering", 1);
 * employee.name; // "John" - 可以访问公共属性
 * employee.salary; // ❌ 错误：不能访问私有属性
 * employee.getSalary(); // 50000 - 可以通过公共方法访问私有属性
 */
class EmployeeClass {
  public name: string;
  private salary: number;
  protected department: string;
  readonly id: number;

  /**
   * 构造函数
   * @description 初始化员工实例
   * @param name - 员工姓名
   * @param salary - 员工薪水
   * @param department - 员工部门
   * @param id - 员工 ID
   */
  constructor(name: string, salary: number, department: string, id: number) {
    this.name = name;
    this.salary = salary;
    this.department = department;
    this.id = id;
  }

  /**
   * 获取薪水
   * @description 返回员工薪水
   * @returns 员工薪水
   */
  getSalary(): number {
    return this.salary;
  }
}

/**
 * 产品类
 * @description 演示参数属性的使用
 * 参数属性是在构造函数参数中直接定义属性的方式
 * 
 * @property name - 公共属性
 * @property price - 私有属性
 * @property category - 受保护属性
 * 
 * @example
 * const product = new Product("Laptop", 999.99, "Electronics");
 * product.name; // "Laptop" - 可以访问公共属性
 * product.price; // ❌ 错误：不能访问私有属性
 * product.category; // ❌ 错误：不能访问受保护属性
 */
class Product {
  constructor(
    public name: string,
    private price: number,
    protected category: string
  ) {}
}

/**
 * 产品实例
 * @description 创建 Product 类的实例
 */
const product = new Product("Laptop", 999.99, "Electronics");

/**
 * 圆形类
 * @description 演示只读属性的使用
 * 
 * @property radius - 圆的半径，只读属性
 * @method getArea - 计算圆的面积
 * 
 * @example
 * const circle = new CircleClass(5);
 * circle.radius; // 5
 * circle.radius = 10; // ❌ 错误：不能修改只读属性
 * circle.getArea(); // 78.53981633974483
 */
class CircleClass {
  readonly radius: number;

  /**
   * 构造函数
   * @description 初始化圆形实例
   * @param radius - 圆的半径
   */
  constructor(radius: number) {
    this.radius = radius;
  }

  /**
   * 计算面积
   * @description 计算圆的面积
   * @returns 圆的面积
   */
  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

/**
 * 温度类
 * @description 演示 getter 和 setter 的使用
 * getter 和 setter 用于控制对属性的访问和修改
 * 
 * @property _celsius - 私有属性，存储摄氏度温度
 * @property celsius - getter 和 setter，用于访问和设置摄氏度
 * @property fahrenheit - getter 和 setter，用于访问和设置华氏度
 * 
 * @example
 * const temp = new Temperature();
 * temp.celsius = 25;
 * console.log(temp.celsius); // 25
 * console.log(temp.fahrenheit); // 77
 * temp.fahrenheit = 100;
 * console.log(temp.celsius); // 37.77777777777778
 */
class Temperature {
  private _celsius: number = 0;

  /**
   * 摄氏度 getter
   * @description 获取摄氏度温度
   * @returns 摄氏度温度
   */
  get celsius(): number {
    return this._celsius;
  }

  /**
   * 摄氏度 setter
   * @description 设置摄氏度温度
   * @param value - 摄氏度温度值
   */
  set celsius(value: number) {
    this._celsius = value;
  }

  /**
   * 华氏度 getter
   * @description 获取华氏度温度
   * @returns 华氏度温度
   */
  get fahrenheit(): number {
    return (this._celsius * 9 / 5) + 32;
  }

  /**
   * 华氏度 setter
   * @description 设置华氏度温度
   * @param value - 华氏度温度值
   */
  set fahrenheit(value: number) {
    this._celsius = (value - 32) * 5 / 9;
  }
}

/**
 * 温度实例
 * @description 创建 Temperature 类的实例
 */
const temp = new Temperature();
temp.celsius = 25;
console.log(temp.fahrenheit);

/**
 * 计算器类
 * @description 演示静态属性和静态方法的使用
 * 静态成员属于类本身，而不是类的实例
 * 
 * @static PI - 静态属性，圆周率
 * @static add - 静态方法，加法运算
 * @static multiply - 静态方法，乘法运算
 * 
 * @example
 * CalculatorClass.PI; // 3.14159
 * CalculatorClass.add(5, 3); // 8
 * CalculatorClass.multiply(4, 3); // 12
 */
class CalculatorClass {
  static PI = 3.14159;

  /**
   * 静态加法方法
   * @description 执行加法运算
   * @param a - 第一个加数
   * @param b - 第二个加数
   * @returns 两个数的和
   */
  static add(a: number, b: number): number {
    return a + b;
  }

  /**
   * 静态乘法方法
   * @description 执行乘法运算
   * @param a - 第一个乘数
   * @param b - 第二个乘数
   * @returns 两个数的乘积
   */
  static multiply(a: number, b: number): number {
    return a * b;
  }
}

/**
 * 调用静态方法
 * @description 演示如何调用静态方法
 */
console.log(CalculatorClass.PI);
console.log(CalculatorClass.add(5, 3));

/**
 * 抽象动物类
 * @description 演示抽象类的使用
 * 抽象类不能被实例化，只能被继承
 * 抽象方法必须在子类中实现
 * 
 * @abstract makeSound - 抽象方法，子类必须实现
 * @method move - 普通方法，子类可以继承或重写
 * 
 * @example
 * const animal = new Animal(); // ❌ 错误：不能实例化抽象类
 * class Dog extends Animal {
 *   makeSound() {
 *     console.log("Woof!");
 *   }
 * }
 * const dog = new Dog();
 * dog.makeSound(); // "Woof!"
 */
abstract class Animal {
  /**
   * 抽象发声方法
   * @description 子类必须实现此方法
   */
  abstract makeSound(): void;

  /**
   * 移动方法
   * @description 普通方法，子类可以继承
   */
  move(): void {
    console.log("Moving...");
  }
}

/**
 * 狗类
 * @description 继承自 Animal 抽象类
 * 
 * @method makeSound - 实现抽象方法
 * 
 * @example
 * const dog = new Dog();
 * dog.makeSound(); // "Woof!"
 * dog.move(); // "Moving..."
 */
class Dog extends Animal {
  /**
   * 实现发声方法
   * @description 狗的叫声
   */
  makeSound(): void {
    console.log("Woof!");
  }
}

/**
 * 狗实例
 * @description 创建 Dog 类的实例
 */
const dog = new Dog();
dog.makeSound();
dog.move();

/**
 * 车辆类
 * @description 演示类继承和方法重写
 * 
 * @property brand - 车辆品牌
 * @method start - 启动车辆
 * 
 * @example
 * const vehicle = new Vehicle("Toyota");
 * vehicle.start(); // "Toyota vehicle started"
 */
class Vehicle {
  constructor(protected brand: string) {}

  /**
   * 启动方法
   * @description 启动车辆
   */
  start(): void {
    console.log(`${this.brand} vehicle started`);
  }
}

/**
 * 汽车类
 * @description 继承自 Vehicle 类，重写启动方法
 * 
 * @property model - 汽车型号
 * @method start - 重写启动方法
 * @method drive - 汽车特有的驾驶方法
 * 
 * @example
 * const car = new Car("Toyota", "Camry");
 * car.start(); // "Toyota Camry car started"
 * car.drive(); // "Driving the car"
 */
class Car extends Vehicle {
  constructor(brand: string, private model: string) {
    super(brand);
  }

  /**
   * 重写启动方法
   * @description 启动汽车，显示品牌和型号
   */
  start(): void {
    console.log(`${this.brand} ${this.model} car started`);
  }

  /**
   * 驾驶方法
   * @description 驾驶汽车
   */
  drive(): void {
    console.log("Driving the car");
  }
}

/**
 * 汽车实例
 * @description 创建 Car 类的实例
 */
const car = new Car("Toyota", "Camry");
car.start();
car.drive();

/**
 * 可打印接口
 * @description 定义一个可打印接口
 * 
 * @method print - 打印方法
 * 
 * @example
 * class Document implements Printable {
 *   print() {
 *     console.log("Printing document...");
 *   }
 * }
 */
interface Printable {
  print(): void;
}

/**
 * 文档类
 * @description 实现 Printable 接口
 * 
 * @property content - 文档内容
 * @method print - 实现打印方法
 * 
 * @example
 * const doc = new Document("Hello, World!");
 * doc.print(); // "Hello, World!"
 */
class Document implements Printable {
  constructor(private content: string) {}

  /**
   * 实现打印方法
   * @description 打印文档内容
   */
  print(): void {
    console.log(this.content);
  }
}

/**
 * 文档实例
 * @description 创建 Document 类的实例
 */
const doc = new Document("Hello, World!");
doc.print();

// 6. 枚举

/**
 * 方向枚举
 * @description 定义一个方向枚举，表示四个基本方向
 * 枚举是一组命名常量的集合，默认从 0 开始递增
 * 
 * @enum Direction
 * @property Up - 上，值为 0
 * @property Down - 下，值为 1
 * @property Left - 左，值为 2
 * @property Right - 右，值为 3
 * 
 * @example
 * let dir: Direction = Direction.Up; // 0
 * dir = Direction.Right; // 3
 * console.log(Direction[0]); // "Up"
 * console.log(Direction.Up); // 0
 */
enum Direction {
  Up,
  Down,
  Left,
  Right
}

/**
 * 方向变量
 * @description 使用 Direction 枚举的变量
 */
let dir: Direction = Direction.Up;

/**
 * 状态码枚举
 * @description 定义一个状态码枚举，使用自定义数值
 * 枚举成员可以指定具体的数值
 * 
 * @enum StatusCode
 * @property Success - 成功，值为 200
 * @property NotFound - 未找到，值为 404
 * @property ServerError - 服务器错误，值为 500
 * 
 * @example
 * let status: StatusCode = StatusCode.Success; // 200
 * status = StatusCode.NotFound; // 404
 * console.log(StatusCode[200]); // "Success"
 */
enum StatusCode {
  Success = 200,
  NotFound = 404,
  ServerError = 500
}

/**
 * 颜色枚举
 * @description 定义一个字符串枚举
 * 字符串枚举的成员值都是字符串
 * 
 * @enum Color
 * @property Red - 红色，值为 "red"
 * @property Green - 绿色，值为 "green"
 * @property Blue - 蓝色，值为 "blue"
 * 
 * @example
 * let color: Color = Color.Red; // "red"
 * color = Color.Blue; // "blue"
 * console.log(Color.Red); // "red"
 */
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue"
}

/**
 * 颜色变量
 * @description 使用 Color 枚举的变量
 */
let color: Color = Color.Red;

/**
 * 混合枚举
 * @description 定义一个混合类型的枚举
 * 枚举成员可以是数字或字符串
 * 
 * @enum MixedEnum
 * @property No - 否，值为 0
 * @property Yes - 是，值为 "YES"
 * 
 * @example
 * let answer: MixedEnum = MixedEnum.No; // 0
 * answer = MixedEnum.Yes; // "YES"
 */
enum MixedEnum {
  No = 0,
  Yes = "YES"
}

/**
 * 常量枚举
 * @description 定义一个常量枚举
 * 常量枚举在编译时会被内联，不会生成运行时代码
 * 
 * @enum ConstDirection
 * @property Up - 上
 * @property Down - 下
 * @property Left - 左
 * @property Right - 右
 * 
 * @example
 * let dir = ConstDirection.Up; // 编译后变成 let dir = 0
 */
const enum ConstDirection {
  Up,
  Down,
  Left,
  Right
}

/**
 * 方向数组
 * @description 使用常量枚举创建方向数组
 */
let directions = [
  ConstDirection.Up,
  ConstDirection.Down,
  ConstDirection.Left,
  ConstDirection.Right
];

/**
 * 文件访问枚举
 * @description 定义一个使用位运算的枚举
 * 位运算枚举可以组合多个标志位
 * 
 * @enum FileAccess
 * @property None - 无权限，值为 0
 * @property Read - 读权限，值为 2 (1 << 1)
 * @property Write - 写权限，值为 4 (1 << 2)
 * @property ReadWrite - 读写权限，值为 6 (Read | Write)
 * @property G - 计算属性，值为 "123".length = 3
 * 
 * @example
 * let permissions: FileAccess = FileAccess.Read | FileAccess.Write; // 6
 * console.log(permissions & FileAccess.Read); // 2 (有读权限)
 * console.log(permissions & FileAccess.Write); // 4 (有写权限)
 * console.log(FileAccess.G); // 3
 */
enum FileAccess {
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  G = "123".length
}

// 7. 类型推断

/**
 * 推断的数字变量
 * @description TypeScript 自动推断变量的类型
 * 当没有显式指定类型时，TypeScript 会根据初始值推断类型
 * 
 * @example
 * let inferredX = 3; // 类型被推断为 number
 * inferredX = 5; // ✅ 可以赋值为数字
 * inferredX = "hello"; // ❌ 错误：不能赋值为字符串
 */
let inferredX = 3;

/**
 * 推断的字符串变量
 * @description TypeScript 根据初始值推断为 string 类型
 * 
 * @example
 * let inferredY = "hello"; // 类型被推断为 string
 * inferredY = "world"; // ✅ 可以赋值为字符串
 * inferredY = 42; // ❌ 错误：不能赋值为数字
 */
let inferredY = "hello";

/**
 * 推断的数字数组
 * @description TypeScript 根据数组元素推断为 number[] 类型
 * 
 * @example
 * let inferredNumbers = [1, 2, 3]; // 类型被推断为 number[]
 * inferredNumbers.push(4); // ✅ 可以添加数字
 * inferredNumbers.push("hello"); // ❌ 错误：不能添加字符串
 */
let inferredNumbers = [1, 2, 3];

/**
 * 推断的混合数组
 * @description TypeScript 根据数组元素推断为 (number | string | boolean)[] 类型
 * 
 * @example
 * let inferredMixed = [1, "hello", true]; // 类型被推断为 (number | string | boolean)[]
 * inferredMixed.push(42); // ✅ 可以添加数字
 * inferredMixed.push("world"); // ✅ 可以添加字符串
 * inferredMixed.push(false); // ✅ 可以添加布尔值
 */
let inferredMixed = [1, "hello", true];

/**
 * 推断的加法函数
 * @description TypeScript 根据函数体推断返回值类型
 * 
 * @param a - 第一个数字
 * @param b - 第二个数字
 * @returns 返回值类型被推断为 number
 * 
 * @example
 * inferredAdd(5, 3); // 返回 8
 * inferredAdd(10, -5); // 返回 5
 */
function inferredAdd(a: number, b: number) {
  return a + b;
}

// 8. 类型断言

/**
 * 某个值变量
 * @description 一个 any 类型的变量，包含一个字符串
 * any 类型会跳过类型检查，但我们可以使用类型断言来告诉 TypeScript 实际的类型
 */
let someValue: any = "this is a string";

/**
 * 角括号语法类型断言
 * @description 使用 <Type> 语法进行类型断言
 * 告诉 TypeScript 编译器 someValue 是字符串类型
 * 
 * @example
 * let strLength: number = (<string>someValue).length; // 16
 * // TypeScript 现在知道 someValue 是 string，所以可以访问 length 属性
 */
let strLength: number = (<string>someValue).length;

/**
 * 另一个值变量
 * @description 另一个 any 类型的变量，包含一个字符串
 */
let anotherValue: any = "this is also a string";

/**
 * as 语法类型断言
 * @description 使用 as 关键字进行类型断言
 * 这是推荐的类型断言方式，特别是在 JSX 中
 * 
 * @example
 * let anotherStrLength: number = (anotherValue as string).length; // 19
 * // TypeScript 现在知道 anotherValue 是 string，所以可以访问 length 属性
 */
let anotherStrLength: number = (anotherValue as string).length;

/**
 * 处理可空值函数
 * @description 演示了如何使用非空断言操作符 !
 * ! 操作符告诉 TypeScript 值不为 null 或 undefined
 * 
 * @param value - 可以是字符串、null 或 undefined 的值
 * 
 * @example
 * processValue("hello"); // 输出: 5
 * processValue(null); // 运行时错误：Cannot read property 'length' of null
 * processValue(undefined); // 运行时错误：Cannot read property 'length' of undefined
 * 
 * 注意：! 操作符只是告诉 TypeScript 编译器值不为空，但不会在运行时检查
 * 如果值实际上为 null 或 undefined，会导致运行时错误
 */
function processValue(value: string | null | undefined) {
  console.log(value!.length); // 使用 ! 断言 value 不为 null 或 undefined
}

// 9. 模块

// utils.ts (示例)
/*
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export class Calculator {
  multiply(a: number, b: number): number {
    return a * b;
  }
}

export default function greet(name: string): string {
  return `Hello, ${name}!`;
}
*/

// main.ts (示例)
/*
import greet, { PI, add, Calculator } from './utils';

console.log(PI);
console.log(add(5, 3));

const calc = new Calculator();
console.log(calc.multiply(4, 3));

console.log(greet("John"));
*/

// 10. 命名空间

namespace MyNamespace {
  export const PI = 3.14159;

  export function add(a: number, b: number): number {
    return a + b;
  }

  export class Calculator {
    multiply(a: number, b: number): number {
      return a * b;
    }
  }
}

console.log(MyNamespace.PI);
console.log(MyNamespace.add(5, 3));

const calc = new MyNamespace.Calculator();
console.log(calc.multiply(4, 3));

namespace App {
  export namespace Utils {
    export function formatDate(date: Date): string {
      return date.toISOString();
    }
  }

  export namespace Models {
    export interface User {
      id: number;
      name: string;
    }
  }
}

console.log(App.Utils.formatDate(new Date()));
const user: App.Models.User = { id: 1, name: "John" };

// 测试函数
function testBasics() {
  console.log("Testing TypeScript basics...");

  console.log("Basic types:");
  console.log("Username:", username);
  console.log("Age:", age);
  console.log("Active:", isActive);
  console.log("Numbers:", numbers);
  console.log("Tuple:", tuple);
  console.log("User:", user);
  console.log("Person employee:", personEmployee);
  console.log("Direction:", direction);
  console.log("Dice roll:", diceRoll);
  console.log("Success:", success);

  console.log("\nVariable declarations:");
  console.log("x:", x, "y:", y, "z:", z);
  console.log("First:", first, "Second:", second, "Rest:", rest);
  console.log("User name:", userName, "User age:", userAge);
  console.log("Array spread:", arr2);
  console.log("Object spread:", obj2);

  console.log("\nFunctions:");
  console.log("Add:", add(5, 3));
  console.log("Multiply:", multiply(4, 3));
  console.log("Divide:", divide(10, 2));
  console.log("Subtract:", subtract(10, 3));
  console.log("Greet person:", greetPerson("John", "Hi"));
  console.log("Create person:", createPerson("Alice", 25));
  console.log("Sum:", sum(1, 2, 3, 4, 5));
  console.log("Process input string:", processInput("hello"));
  console.log("Process input number:", processInput(5));
  console.log("Identity string:", identity<string>("test"));
  console.log("Identity number:", identity(42));

  console.log("\nInterfaces:");
  console.log("Point:", point);
  console.log("My array:", myArray);
  console.log("My map:", myMap);
  console.log("Square:", square);

  console.log("\nClasses:");
  console.log("Person greet:", person.greet());
  console.log("Product name:", product.name);
  console.log("Circle area:", new CircleClass(5).getArea());
  console.log("Temperature fahrenheit:", temp.fahrenheit);
  console.log("Calculator PI:", CalculatorClass.PI);
  console.log("Calculator add:", CalculatorClass.add(5, 3));
  console.log("Dog sound:", dog.makeSound());
  console.log("Car start:", car.start());
  console.log("Document print:", doc.print());

  console.log("\nEnums:");
  console.log("Direction:", dir);
  console.log("Status code:", StatusCode.Success);
  console.log("Color:", color);
  console.log("Mixed enum:", MixedEnum.Yes);
  console.log("Directions:", directions);
  console.log("File access:", FileAccess.ReadWrite);

  console.log("\nType inference:");
  console.log("Inferred x:", inferredX);
  console.log("Inferred y:", inferredY);
  console.log("Inferred numbers:", inferredNumbers);
  console.log("Inferred mixed:", inferredMixed);
  console.log("Inferred add:", inferredAdd(5, 3));

  console.log("\nType assertion:");
  console.log("String length:", strLength);
  console.log("Another string length:", anotherStrLength);

  console.log("\nNamespaces:");
  console.log("MyNamespace PI:", MyNamespace.PI);
  console.log("MyNamespace add:", MyNamespace.add(5, 3));
  console.log("MyNamespace multiply:", calc.multiply(4, 3));
  console.log("App Utils formatDate:", App.Utils.formatDate(new Date()));
  console.log("App Models User:", user);

  console.log("TypeScript basics test completed!");
}

// 导出测试函数
export { testBasics };

// 导出类型
export type {
  Person,
  Employee,
  PersonEmployee,
  MathOperation,
  StringOperation,
  PersonInterface,
  UserInterface,
  Point,
  SearchFunc,
  StringArray,
  StringMap,
  ClockInterface,
  Shape,
  Square,
  Counter
};

// 导出枚举
export {
  Direction,
  StatusCode,
  Color,
  MixedEnum,
  ConstDirection,
  FileAccess
};

// 导出类
export {
  PersonClass,
  EmployeeClass,
  Product,
  CircleClass,
  Temperature,
  CalculatorClass,
  Animal,
  Dog,
  Vehicle,
  Car,
  Document,
  Clock
};
