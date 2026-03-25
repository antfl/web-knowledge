// TypeScript 泛型示例
// 泛型是 TypeScript 中一种强大的类型系统特性，允许我们编写可重用的组件
// 泛型让我们能够在定义函数、接口或类时使用类型参数，而不是具体的类型

// 1. 泛型简介

/**
 * 泛型恒等函数
 * @param arg 任意类型的参数
 * @returns 与输入参数相同类型的值
 * @description 这是一个最简单的泛型函数，它接受一个参数并返回相同的参数
 * 类型参数 T 允许我们捕获用户提供的类型，然后在函数体内使用这个类型
 */
function identity<T>(arg: T): T {
  return arg;
}

// 显式指定类型参数
const output1 = identity<string>("myString"); // 类型参数为 string
const output2 = identity<number>(100); // 类型参数为 number

// 类型推断 - TypeScript 会自动推断类型参数
const output3 = identity("hello"); // 推断为 string 类型
const output4 = identity(42); // 推断为 number 类型

// 2. 泛型函数

/**
 * 泛型函数 - 创建一个包含两个不同类型值的元组
 * @param first 第一个值，类型为 T
 * @param second 第二个值，类型为 U
 * @returns 包含两个值的元组 [T, U]
 * @description 这个函数使用了两个类型参数 T 和 U，允许我们传入不同类型的值
 */
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// 使用泛型函数创建不同类型的元组
const pair1 = pair<string, number>("hello", 42); // [string, number] 类型
const pair2 = pair<boolean, string>(true, "world"); // [boolean, string] 类型

/**
 * 长度接口 - 用于泛型约束
 * @description 定义了一个具有 length 属性的接口，用于约束泛型类型
 */
interface Lengthwise {
  length: number;
}

/**
 * 泛型函数 - 带约束的泛型
 * @param arg 具有 length 属性的任意类型参数
 * @returns 与输入参数相同类型的值
 * @description 这个函数使用了泛型约束，要求传入的参数必须具有 length 属性
 * 通过 T extends Lengthwise 约束，我们可以在函数体内安全地访问 arg.length
 */
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // 因为有约束，所以可以安全访问 length 属性
  return arg;
}

// 调用带约束的泛型函数
loggingIdentity({ length: 10, value: "hello" }); // 符合约束，有 length 属性
loggingIdentity([1, 2, 3]); // 符合约束，数组有 length 属性

/**
 * 泛型函数 - 使用 keyof 操作符
 * @param obj 任意类型的对象
 * @param key 对象的键，类型为 K
 * @returns 对象对应键的值，类型为 T[K]
 * @description 这个函数使用了 keyof 操作符，确保传入的 key 是对象的有效键
 * K extends keyof T 约束确保 K 是 T 的键的子类型
 */
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 使用 keyof 泛型函数
const user = { name: "John", age: 30 };
const name = getProperty(user, "name"); // 类型为 string
const age = getProperty(user, "age"); // 类型为 number

// 3. 泛型接口

/**
 * 泛型接口 - 盒子
 * @description 定义了一个泛型接口 Box，它可以包含任意类型的内容
 * 类型参数 T 表示盒子内容的类型
 */
interface Box<T> {
  contents: T; // 盒子的内容，类型为 T
}

// 使用泛型接口
let box1: Box<string> = { contents: "hello" }; // 字符串盒子
let box2: Box<number> = { contents: 42 }; // 数字盒子

/**
 * 泛型接口 - 恒等函数类型
 * @description 定义了一个表示恒等函数的泛型接口
 * 接口中的方法是一个泛型函数，接受任意类型的参数并返回相同类型的值
 */
interface GenericIdentityFn {
  <T>(arg: T): T; // 泛型方法
}

/**
 * 泛型函数 - 用于赋值给 GenericIdentityFn 接口
 * @param arg 任意类型的参数
 * @returns 与输入参数相同类型的值
 */
function identityFunction<T>(arg: T): T {
  return arg;
}

// 将泛型函数赋值给接口类型
let myIdentity: GenericIdentityFn = identityFunction;

// 4. 泛型类

/**
 * 泛型类 - 通用数字类型
 * @description 定义了一个泛型类 GenericNumber，它可以处理不同类型的数字
 * 类型参数 T 表示数字的类型（如 number、string 等）
 */
class GenericNumber<T> {
  zeroValue: T; // 零值，类型为 T
  add: (x: T, y: T) => T; // 加法函数，接受两个 T 类型参数并返回 T 类型

  /**
   * 构造函数
   * @param zeroValue 零值
   * @param addFn 加法函数
   */
  constructor(zeroValue: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = addFn;
  }
}

// 使用泛型类
let myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y); // 数字类型
let myGenericString = new GenericNumber<string>("", (x, y) => x + y); // 字符串类型

/**
 * 泛型类 - 栈
 * @description 定义了一个泛型栈类，可以存储任意类型的元素
 * 类型参数 T 表示栈中元素的类型
 */
class Stack<T> {
  private items: T[] = []; // 存储栈元素的数组

  /**
   * 向栈中添加元素
   * @param item 要添加的元素
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * 从栈中移除并返回顶部元素
   * @returns 顶部元素，如果栈为空则返回 undefined
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * 查看栈顶部元素但不移除
   * @returns 顶部元素，如果栈为空则返回 undefined
   */
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /**
   * 检查栈是否为空
   * @returns 如果栈为空则返回 true，否则返回 false
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 获取栈的大小
   * @returns 栈中元素的数量
   * @protected 保护方法，仅子类可访问
   */
  protected size(): number {
    return this.items.length;
  }
}

/**
 * 泛型类 - 有限容量栈
 * @description 继承自 Stack 类，添加了容量限制
 * 类型参数 T 表示栈中元素的类型
 */
class LimitedStack<T> extends Stack<T> {
  private maxSize: number; // 栈的最大容量

  /**
   * 构造函数
   * @param maxSize 栈的最大容量
   */
  constructor(maxSize: number) {
    super(); // 调用父类构造函数
    this.maxSize = maxSize;
  }

  /**
   * 重写 push 方法，添加容量检查
   * @param item 要添加的元素
   * @throws 如果栈已满则抛出错误
   */
  push(item: T): void {
    if (this.size() >= this.maxSize) {
      throw new Error("Stack is full");
    }
    super.push(item); // 调用父类的 push 方法
  }
}

/**
 * 泛型接口 - 集合
 * @description 定义了一个泛型集合接口，用于表示一组元素
 * 类型参数 T 表示集合中元素的类型
 */
interface Collection<T> {
  /**
   * 向集合添加元素
   * @param item 要添加的元素
   */
  add(item: T): void;
  
  /**
   * 从集合中移除元素
   * @param item 要移除的元素
   * @returns 如果元素被成功移除则返回 true，否则返回 false
   */
  remove(item: T): boolean;
  
  /**
   * 检查集合是否包含指定元素
   * @param item 要检查的元素
   * @returns 如果集合包含该元素则返回 true，否则返回 false
   */
  contains(item: T): boolean;
  
  /**
   * 获取集合的大小
   * @returns 集合中元素的数量
   */
  size(): number;
}

/**
 * 泛型类 - 数组集合
 * @description 实现了 Collection 接口，使用数组存储元素
 * 类型参数 T 表示集合中元素的类型
 */
class ArrayCollection<T> implements Collection<T> {
  private items: T[] = []; // 存储元素的数组

  /**
   * 向集合添加元素
   * @param item 要添加的元素
   */
  add(item: T): void {
    this.items.push(item);
  }

  /**
   * 从集合中移除元素
   * @param item 要移除的元素
   * @returns 如果元素被成功移除则返回 true，否则返回 false
   */
  remove(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 检查集合是否包含指定元素
   * @param item 要检查的元素
   * @returns 如果集合包含该元素则返回 true，否则返回 false
   */
  contains(item: T): boolean {
    return this.items.includes(item);
  }

  /**
   * 获取集合的大小
   * @returns 集合中元素的数量
   */
  size(): number {
    return this.items.length;
  }
}

// 5. 泛型约束

/**
 * 泛型函数 - 获取长度
 * @param arg 具有 length 属性的任意类型参数
 * @returns 参数的长度
 * @description 这个函数使用了泛型约束，要求传入的参数必须实现 Lengthwise 接口
 * 通过 T extends Lengthwise 约束，我们可以安全地访问 arg.length 属性
 */
function getLength<T extends Lengthwise>(arg: T): number {
  return arg.length;
}

// 调用获取长度函数
getLength("hello"); // 字符串有 length 属性
getLength([1, 2, 3]); // 数组有 length 属性
getLength({ length: 10 }); // 自定义对象有 length 属性

/**
 * 泛型函数 - 设置对象属性
 * @param obj 任意类型的对象
 * @param key 对象的键，类型为 K
 * @param value 要设置的值，类型为 T[K]
 * @description 这个函数使用了 keyof 操作符和泛型约束，确保传入的 key 是对象的有效键
 * 并且 value 的类型与对象中对应键的类型一致
 */
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

// 使用设置属性函数
const user2 = { name: "John", age: 30, email: "john@example.com" };
setProperty(user2, "age", 31); // 类型安全，age 是 user2 的有效键，31 是 number 类型

/**
 * 可序列化接口
 * @description 定义了一个可序列化的接口，要求实现 serialize 方法
 */
interface Serializable {
  /**
   * 序列化方法
   * @returns 序列化后的字符串
   */
  serialize(): string;
}

/**
 * 可反序列化接口
 * @description 定义了一个可反序列化的接口，要求实现 deserialize 方法
 * 类型参数 T 表示反序列化后的数据类型
 */
interface Deserializable<T> {
  /**
   * 反序列化方法
   * @param data 序列化的字符串
   * @returns 反序列化后的对象
   */
  deserialize(data: string): T;
}

/**
 * 泛型函数 - 处理可序列化和反序列化的对象
 * @param item 同时实现了 Serializable 和 Deserializable 接口的对象
 * @returns 处理后的对象
 * @description 这个函数使用了交叉类型约束，要求传入的参数同时实现两个接口
 * 这样我们可以在函数体内安全地调用 serialize 和 deserialize 方法
 */
function process<T extends Serializable & Deserializable<T>>(item: T): T {
  const serialized = item.serialize(); // 序列化对象
  return item.deserialize(serialized); // 反序列化对象
}

// 6. 泛型默认类型

/**
 * 泛型接口 - 带默认类型的盒子
 * @description 定义了一个带默认类型参数的泛型接口
 * 类型参数 T 的默认值为 string
 */
interface BoxWithDefault<T = string> {
  contents: T; // 盒子的内容，类型为 T
}

// 使用带默认类型的泛型接口
let box3: BoxWithDefault = { contents: "hello" }; // 未指定类型参数，使用默认类型 string
let box4: BoxWithDefault<number> = { contents: 42 }; // 指定类型参数为 number

/**
 * 泛型函数 - 创建数组
 * @param length 数组长度
 * @param value 填充值，默认为空字符串
 * @returns 填充后的数组
 * @description 这个函数使用了默认类型参数，当未指定类型时使用 string 类型
 */
function createArray<T = string>(length: number, value: T = "" as T): T[] {
  return Array(length).fill(value);
}

// 使用带默认类型的泛型函数
const arr1 = createArray(3, "hello"); // 类型参数为 string
const arr2 = createArray(3, 42); // 类型参数为 number
const arr3 = createArray(3); // 未指定类型参数，使用默认类型 string

/**
 * 泛型类 - 存储
 * @description 定义了一个带默认类型参数的泛型类
 * 类型参数 T 的默认值为 any
 */
class Storage<T = any> {
  private data: Map<string, T> = new Map(); // 存储数据的 Map

  /**
   * 设置数据
   * @param key 键
   * @param value 值
   */
  set(key: string, value: T): void {
    this.data.set(key, value);
  }

  /**
   * 获取数据
   * @param key 键
   * @returns 对应的值，如果不存在则返回 undefined
   */
  get(key: string): T | undefined {
    return this.data.get(key);
  }
}

// 使用带默认类型的泛型类
const storage1 = new Storage(); // 未指定类型参数，使用默认类型 any
const storage2 = new Storage<string>(); // 指定类型参数为 string

// 7. 条件类型

/**
 * 条件类型 - 检查是否为字符串类型
 * @description 定义了一个条件类型 IsString，检查类型 T 是否为 string 类型
 * 如果 T 是 string 类型，则返回 true 类型，否则返回 false 类型
 */
type IsString<T> = T extends string ? true : false;

// 测试条件类型
type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

/**
 * 条件类型 - 非空类型
 * @description 定义了一个条件类型 CustomNonNullable，移除类型 T 中的 null 和 undefined
 * 如果 T 是 null 或 undefined，则返回 never 类型，否则返回 T 类型
 */
type CustomNonNullable<T> = T extends null | undefined ? never : T;

// 测试非空类型
type Test3 = CustomNonNullable<string | null>; // string
type Test4 = CustomNonNullable<number | undefined>; // number

/**
 * 条件类型 - 转换为数组类型
 * @description 定义了一个条件类型 ToArray，将类型 T 转换为数组类型
 * 使用分布式条件类型，对联合类型的每个成员都应用条件
 */
type ToArray<T> = T extends any ? T[] : never;

// 测试数组类型转换
type Test5 = ToArray<string | number>; // string[] | number[]

/**
 * 条件类型 - 展平数组类型
 * @description 定义了一个条件类型 Flatten，展平数组类型
 * 使用 infer 关键字推断数组元素的类型
 */
type Flatten<T> = T extends Array<infer U> ? U : T;

// 测试展平数组类型
type Test6 = Flatten<string[]>; // string
type Test7 = Flatten<number>; // number

// 8. 映射类型

/**
 * 映射类型 - 只读类型
 * @description 定义了一个映射类型 ReadonlyType，将类型 T 的所有属性变为只读
 * 使用 keyof T 获取 T 的所有键，然后为每个键添加 readonly 修饰符
 */
type ReadonlyType<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * 映射类型 - 可选类型
 * @description 定义了一个映射类型 PartialType，将类型 T 的所有属性变为可选
 * 使用 keyof T 获取 T 的所有键，然后为每个键添加 ? 修饰符
 */
type PartialType<T> = {
  [P in keyof T]?: T[P];
};

/**
 * 用户接口
 * @description 定义了一个用户接口，包含 id、name、age 和 email 属性
 */
interface User {
  id: string;
  name: string;
  age: number;
  email: string;
}

// 测试映射类型
type ReadonlyUser = ReadonlyType<User>; // 所有属性变为只读
type PartialUser = PartialType<User>; // 所有属性变为可选

/**
 * 映射类型 - Getters 类型
 * @description 定义了一个映射类型 Getters，为类型 T 的每个属性创建一个 getter 方法
 * 使用模板字面量类型和 Capitalize 工具类型创建方法名
 */
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

// 测试 Getters 类型
type UserGetters = Getters<User>; // { getName: () => string; getAge: () => number; getEmail: () => string; }

/**
 * 映射类型 - 事件处理器类型
 * @description 定义了一个映射类型 EventHandlers，为类型 T 的每个事件创建一个事件处理器方法
 * 使用模板字面量类型和 Capitalize 工具类型创建方法名
 */
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => void;
};

/**
 * 事件接口
 * @description 定义了一个事件接口，包含 click、keydown 和 submit 事件
 */
interface Events {
  click: MouseEvent;
  keydown: KeyboardEvent;
  submit: Event;
}

// 测试事件处理器类型
type Handlers = EventHandlers<Events>; // { onClick: (event: MouseEvent) => void; onKeydown: (event: KeyboardEvent) => void; onSubmit: (event: Event) => void; }

// 9. 工具类型

/**
 * 完整用户接口
 * @description 定义了一个完整的用户接口，包含 id、name、age、email 和 password 属性
 */
interface FullUser {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
}

// TypeScript 内置工具类型

/**
 * 工具类型 - Partial
 * @description 将类型 T 的所有属性变为可选
 */
type PartialFullUser = Partial<FullUser>; // 所有属性变为可选

/**
 * 工具类型 - Required
 * @description 将类型 T 的所有属性变为必需
 */
type RequiredUser = Required<PartialUser>; // 所有属性变为必需

/**
 * 工具类型 - Readonly
 * @description 将类型 T 的所有属性变为只读
 */
type ReadonlyFullUser = Readonly<FullUser>; // 所有属性变为只读

/**
 * 工具类型 - Pick
 * @description 从类型 T 中选择指定的属性
 */
type UserBasicInfo = Pick<FullUser, "id" | "name" | "email">; // 只包含 id、name 和 email 属性

/**
 * 工具类型 - Omit
 * @description 从类型 T 中排除指定的属性
 */
type PublicUser = Omit<FullUser, "password">; // 排除 password 属性

/**
 * 工具类型 - Record
 * @description 创建一个键为 K 类型，值为 T 类型的对象类型
 */
type UserMap = Record<string, FullUser>; // 键为 string，值为 FullUser 的映射

/**
 * 工具类型 - Exclude
 * @description 从类型 T 中排除可以赋值给 U 的类型
 */
type StringOrNumber = Exclude<string | number | boolean, number>; // 排除 number 类型，结果为 string | boolean

/**
 * 工具类型 - Extract
 * @description 从类型 T 中提取可以赋值给 U 的类型
 */
type StringAndNumber = Extract<string | number | boolean, number | string>; // 提取 number | string 类型

/**
 * 工具类型 - NonNullable
 * @description 从类型 T 中排除 null 和 undefined
 */
type NonNullString = NonNullable<string | null | undefined>; // 排除 null 和 undefined，结果为 string

/**
 * 获取用户函数
 * @returns 完整的用户对象
 */
function getUser(): FullUser {
  return { id: "123", name: "John", age: 30, email: "john@example.com", password: "secret" };
}

/**
 * 工具类型 - ReturnType
 * @description 获取函数类型 T 的返回值类型
 */
type UserReturnType = ReturnType<typeof getUser>; // FullUser 类型

/**
 * 用户类
 * @description 定义了一个用户类，包含 name 和 age 属性
 */
class UserClass {
  /**
   * 构造函数
   * @param name 用户名
   * @param age 用户年龄
   */
  constructor(public name: string, public age: number) {}
}

/**
 * 工具类型 - InstanceType
 * @description 获取构造函数类型 T 的实例类型
 */
type UserInstance = InstanceType<typeof UserClass>; // UserClass 实例类型

// 10. 实际应用场景

// API 响应处理

/**
 * API 响应接口
 * @description 定义了一个通用的 API 响应接口，用于处理 API 请求的返回数据
 * 类型参数 T 表示响应数据的类型
 */
interface ApiResponse<T> {
  success: boolean; // 请求是否成功
  data: T; // 响应数据，类型为 T
  error?: string; // 错误信息，可选
}

/**
 * 文章接口
 * @description 定义了一个文章接口，包含 id、title 和 content 属性
 */
interface Post {
  id: string;
  title: string;
  content: string;
}

/**
 * 获取用户函数
 * @param id 用户 ID
 * @returns 包含用户数据的 API 响应
 */
async function fetchUser(id: string): Promise<ApiResponse<User>> {
  return {
    success: true,
    data: { id, name: "John", age: 30, email: "john@example.com" }
  };
}

/**
 * 获取文章函数
 * @param id 文章 ID
 * @returns 包含文章数据的 API 响应
 */
async function fetchPost(id: string): Promise<ApiResponse<Post>> {
  return {
    success: true,
    data: { id, title: "Hello", content: "World" }
  };
}

// 数据存储

/**
 * 数据存储类
 * @description 定义了一个泛型数据存储类，用于存储任意类型的数据
 * 类型参数 T 表示存储数据的类型
 */
class DataStore<T> {
  private data: Map<string, T> = new Map(); // 存储数据的 Map

  /**
   * 设置数据
   * @param key 键
   * @param value 值
   */
  set(key: string, value: T): void {
    this.data.set(key, value);
  }

  /**
   * 获取数据
   * @param key 键
   * @returns 对应的值，如果不存在则返回 undefined
   */
  get(key: string): T | undefined {
    return this.data.get(key);
  }

  /**
   * 检查键是否存在
   * @param key 键
   * @returns 是否存在
   */
  has(key: string): boolean {
    return this.data.has(key);
  }

  /**
   * 删除数据
   * @param key 键
   * @returns 是否删除成功
   */
  delete(key: string): boolean {
    return this.data.delete(key);
  }

  /**
   * 清空数据
   */
  clear(): void {
    this.data.clear();
  }

  /**
   * 获取所有数据
   * @returns 所有数据的数组
   */
  getAll(): T[] {
    return Array.from(this.data.values());
  }
}

// 使用数据存储
const userStore = new DataStore<User>(); // 用户数据存储
const postStore = new DataStore<Post>(); // 文章数据存储

// 表单验证

/**
 * 验证规则接口
 * @description 定义了一个验证规则接口，用于验证表单字段
 * 类型参数 T 表示要验证的值的类型
 */
interface ValidationRule<T> {
  validate: (value: T) => boolean; // 验证函数，返回是否验证通过
  message: string; // 验证失败时的错误信息
}

/**
 * 表单字段接口
 * @description 定义了一个表单字段接口，包含字段值、验证规则和错误信息
 * 类型参数 T 表示字段值的类型
 */
interface FormField<T> {
  value: T; // 字段值
  rules: ValidationRule<T>[]; // 验证规则数组
  errors: string[]; // 错误信息数组
}

/**
 * 表单类
 * @description 定义了一个泛型表单类，用于管理表单字段和验证
 * 类型参数 T 表示表单数据的类型，必须是一个记录类型
 */
class Form<T extends Record<string, any>> {
  private fields: Map<keyof T, FormField<any>> = new Map(); // 存储表单字段的 Map

  /**
   * 添加字段
   * @param name 字段名
   * @param value 字段初始值
   * @param rules 验证规则数组
   */
  addField<K extends keyof T>(
    name: K,
    value: T[K],
    rules: ValidationRule<T[K]>[]
  ): void {
    this.fields.set(name, { value, rules, errors: [] });
  }

  /**
   * 验证表单
   * @returns 是否验证通过
   */
  validate(): boolean {
    let isValid = true;
    this.fields.forEach((field, name) => {
      field.errors = []; // 清空错误信息
      field.rules.forEach(rule => {
        if (!rule.validate(field.value)) {
          field.errors.push(rule.message); // 添加错误信息
          isValid = false;
        }
      });
    });
    return isValid;
  }

  /**
   * 获取字段值
   * @param name 字段名
   * @returns 字段值
   */
  getValue<K extends keyof T>(name: K): T[K] {
    return this.fields.get(name)!.value;
  }

  /**
   * 获取字段错误信息
   * @param name 字段名
   * @returns 错误信息数组
   */
  getErrors<K extends keyof T>(name: K): string[] {
    return this.fields.get(name)!.errors;
  }
}

// 事件系统

/**
 * 事件处理器接口
 * @description 定义了一个事件处理器接口，用于处理事件
 * 类型参数 T 表示事件数据的类型
 */
interface EventHandler<T> {
  (event: T): void; // 事件处理函数
}

/**
 * 事件发射器类
 * @description 定义了一个泛型事件发射器类，用于管理事件的订阅和触发
 * 类型参数 T 表示事件映射类型，其中键是事件名，值是事件数据类型
 */
class EventEmitter<T extends Record<string, any>> {
  private listeners: Map<keyof T, EventHandler<any>[]> = new Map(); // 存储事件监听器的 Map

  /**
   * 订阅事件
   * @param event 事件名
   * @param handler 事件处理器
   */
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const handlers = this.listeners.get(event) || []; // 获取已有的事件处理器
    handlers.push(handler); // 添加新的事件处理器
    this.listeners.set(event, handlers); // 更新事件处理器列表
  }

  /**
   * 取消订阅事件
   * @param event 事件名
   * @param handler 事件处理器
   */
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1); // 移除事件处理器
      }
    }
  }

  /**
   * 触发事件
   * @param event 事件名
   * @param data 事件数据
   */
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data)); // 调用所有事件处理器
    }
  }
}

/**
 * 应用事件接口
 * @description 定义了应用中可能发生的事件及其数据类型
 */
interface AppEvents {
  userLoggedIn: { userId: string; timestamp: number }; // 用户登录事件
  userLoggedOut: { userId: string }; // 用户登出事件
  dataUpdated: { id: string; data: any }; // 数据更新事件
}

// 使用事件发射器
const emitter = new EventEmitter<AppEvents>();

// 订阅用户登录事件
emitter.on("userLoggedIn", (event) => {
  console.log(`User ${event.userId} logged in at ${event.timestamp}`);
});

// 触发用户登录事件
emitter.emit("userLoggedIn", { userId: "123", timestamp: Date.now() });

// 状态管理

/**
 * 状态接口
 * @description 定义了一个状态接口，用于管理状态的获取、设置和订阅
 * 类型参数 T 表示状态值的类型
 */
interface State<T> {
  /**
   * 获取状态
   * @returns 状态值
   */
  get(): T;
  /**
   * 设置状态
   * @param value 新的状态值
   */
  set(value: T): void;
  /**
   * 订阅状态变化
   * @param listener 状态变化监听器
   * @returns 取消订阅的函数
   */
  subscribe(listener: (value: T) => void): () => void;
}

/**
 * 状态存储类
 * @description 定义了一个泛型状态存储类，实现了 State 接口
 * 类型参数 T 表示状态值的类型
 */
class Store<T> implements State<T> {
  private state: T; // 状态值
  private listeners: ((value: T) => void)[] = []; // 状态监听器数组

  /**
   * 构造函数
   * @param initialState 初始状态值
   */
  constructor(initialState: T) {
    this.state = initialState;
  }

  /**
   * 获取状态
   * @returns 状态值
   */
  get(): T {
    return this.state;
  }

  /**
   * 设置状态
   * @param value 新的状态值
   */
  set(value: T): void {
    this.state = value;
    this.notify(); // 通知所有监听器
  }

  /**
   * 订阅状态变化
   * @param listener 状态变化监听器
   * @returns 取消订阅的函数
   */
  subscribe(listener: (value: T) => void): () => void {
    this.listeners.push(listener); // 添加监听器
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1); // 移除监听器
      }
    };
  }

  /**
   * 通知所有监听器
   * @private
   */
  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

/**
 * 应用状态接口
 * @description 定义了应用状态的结构
 */
interface AppState {
  user: User | null; // 用户信息
  posts: Post[]; // 文章列表
  isLoading: boolean; // 是否正在加载
}

// 创建应用状态存储
const appStore = new Store<AppState>({
  user: null,
  posts: [],
  isLoading: false
});

// 订阅应用状态变化
appStore.subscribe((state) => {
  console.log("State changed:", state);
});

// 测试函数
function testGenerics() {
  console.log("Testing TypeScript generics...");

  console.log("\n1. Generic functions:");
  console.log("Identity string:", output1);
  console.log("Identity number:", output2);
  console.log("Identity inferred:", output3, output4);
  console.log("Pair:", pair1);
  console.log("Pair 2:", pair2);

  console.log("\n2. Generic interfaces:");
  console.log("Box 1:", box1);
  console.log("Box 2:", box2);
  console.log("Identity function:", myIdentity("test"));

  console.log("\n3. Generic classes:");
  console.log("Generic number:", myGenericNumber.add(5, 3));
  console.log("Generic string:", myGenericString.add("hello", " world"));

  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  console.log("Stack peek:", stack.peek());
  console.log("Stack pop:", stack.pop());

  const collection = new ArrayCollection<string>();
  collection.add("hello");
  collection.add("world");
  console.log("Collection contains:", collection.contains("hello"));
  console.log("Collection size:", collection.size());

  console.log("\n4. Generic constraints:");
  console.log("Length:", getLength("hello"));
  console.log("Length:", getLength([1, 2, 3]));
  console.log("User after setProperty:", user2);

  console.log("\n5. Generic default types:");
  console.log("Box with default:", box3);
  console.log("Box with number:", box4);
  console.log("Array 1:", arr1);
  console.log("Array 2:", arr2);
  console.log("Array 3:", arr3);

  console.log("\n6. Conditional types:");
  console.log("Conditional types example completed");

  console.log("\n7. Mapped types:");
  console.log("Mapped types example completed");

  console.log("\n8. Utility types:");
  console.log("Utility types example completed");

  console.log("\n9. Real-world scenarios:");

  console.log("\n- API response:");
  fetchUser("123").then(response => {
    console.log("User response:", response);
  });

  console.log("- Data store:");
  userStore.set("123", { id: "123", name: "John", age: 30, email: "john@example.com" });
  console.log("User from store:", userStore.get("123"));

  console.log("\n- Form validation:");
  const form = new Form<{ name: string; age: number }>();
  form.addField("name", "John", [
    { validate: (value) => value.length > 0, message: "Name is required" },
    { validate: (value) => value.length >= 2, message: "Name must be at least 2 characters" }
  ]);
  form.addField("age", 30, [
    { validate: (value) => value >= 18, message: "Age must be at least 18" },
    { validate: (value) => value <= 120, message: "Age must be less than 120" }
  ]);
  console.log("Form valid:", form.validate());
  console.log("Form errors:", form.getErrors("name"));

  console.log("\n- Event system:");
  emitter.emit("userLoggedIn", { userId: "456", timestamp: Date.now() });

  console.log("- State management:");
  appStore.set({ user: { id: "123", name: "John", age: 30, email: "john@example.com" }, posts: [], isLoading: false });

  console.log("TypeScript generics test completed!");
}

// 导出测试函数
export { testGenerics };

// 导出类型
export type {
  Box,
  GenericIdentityFn,
  Lengthwise,
  Serializable,
  Deserializable,
  BoxWithDefault,
  IsString,
  CustomNonNullable,
  ToArray,
  Flatten,
  ReadonlyType,
  PartialType,
  Getters,
  EventHandlers,
  ApiResponse,
  ValidationRule,
  FormField,
  EventHandler,
  State
};

// 导出接口
export {
  User,
  Post,
  Collection,
  Events,
  AppEvents,
  AppState,
  FullUser
};

// 导出类
export {
  GenericNumber,
  Stack,
  LimitedStack,
  ArrayCollection,
  Storage,
  DataStore,
  Form,
  EventEmitter,
  Store,
  UserClass
};

// 导出函数
export {
  identity,
  pair,
  loggingIdentity,
  getProperty,
  setProperty,
  getLength,
  process,
  createArray,
  fetchUser,
  fetchPost
};
