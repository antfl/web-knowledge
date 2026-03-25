// TypeScript 高级类型示例
// 高级类型是 TypeScript 中强大的类型系统特性，允许我们创建复杂和灵活的类型定义

// 1. 类型别名

/**
 * 用户 ID 类型别名
 * @description 定义了一个用户 ID 类型，可以是字符串或数字
 * 类型别名让我们可以为复杂的类型定义一个简洁的名称
 */
type UserId = string | number;

/**
 * 用户类型别名
 * @description 定义了一个用户类型，包含 id、name 和 email 属性
 * 使用了 UserId 类型别名作为 id 属性的类型
 */
type User = {
  id: UserId; // 用户 ID，类型为 UserId
  name: string; // 用户名
  email: string; // 用户邮箱
};

/**
 * 回调函数类型别名
 * @description 定义了一个回调函数类型，接受错误和结果参数
 * 用于异步操作的结果处理
 */
type Callback = (error: Error | null, result: any) => void;

/**
 * 容器类型别名
 * @description 定义了一个泛型容器类型，包含一个值属性
 * 类型参数 T 表示容器中值的类型
 */
type Container<T> = {
  value: T; // 容器中的值，类型为 T
};

// 2. 接口继承

/**
 * 人员接口
 * @description 定义了一个基础的人员接口，包含姓名和年龄
 * 接口继承允许我们创建接口层次结构，重用类型定义
 */
interface Person {
  name: string; // 姓名
  age: number; // 年龄
}

/**
 * 员工接口
 * @description 继承自 Person 接口，添加了员工特有的属性
 * 接口继承使用 extends 关键字，可以继承多个接口
 */
interface Employee extends Person {
  employeeId: string; // 员工 ID
  position: string; // 职位
}

/**
 * 经理接口
 * @description 继承自 Employee 接口，添加了管理特有的属性
 * 接口继承可以多层嵌套，形成继承链
 */
interface Manager extends Employee {
  department: string; // 部门
  subordinates: Employee[]; // 下属员工列表
}

// 3. 交叉类型

/**
 * 类型 A 接口
 * @description 定义了一个包含字符串属性 a 的接口
 */
interface TypeA {
  a: string; // 字符串属性 a
}

/**
 * 类型 B 接口
 * @description 定义了一个包含数字属性 b 的接口
 */
interface TypeB {
  b: number; // 数字属性 b
}

/**
 * 类型 C 交叉类型
 * @description 通过交叉类型操作符 &，将 TypeA 和 TypeB 合并为一个新类型
 * 交叉类型要求对象同时满足所有类型的属性
 */
type TypeC = TypeA & TypeB;

/**
 * 类型 C 实例
 * @description 创建一个同时包含 TypeA 和 TypeB 属性的对象
 * 必须提供所有接口定义的属性
 */
const typeC: TypeC = {
  a: "hello", // TypeA 的属性
  b: 42 // TypeB 的属性
};

// 4. 联合类型

/**
 * 状态类型
 * @description 定义了一个状态类型，可以是三种状态之一
 * 联合类型使用 | 操作符，表示值可以是多种类型之一
 */
type Status = "active" | "inactive" | "pending";

/**
 * 结果类型
 * @description 定义了一个结果类型，可以是成功或失败两种情况
 * 使用了可辨识联合类型，通过 success 属性区分不同的情况
 */
type Result = {
  success: true; // 成功标志
  data: any; // 成功时的数据
} | {
  success: false; // 失败标志
  error: string; // 失败时的错误信息
};

/**
 * 处理值函数
 * @param value 可以是字符串、数字或布尔类型的值
 * @description 演示了如何处理联合类型
 * 使用 typeof 进行类型守卫，确定具体的类型
 */
function processValue(value: string | number | boolean) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // 字符串类型处理
  } else if (typeof value === "number") {
    console.log(value.toFixed(2)); // 数字类型处理
  } else {
    console.log(value ? "true" : "false"); // 布尔类型处理
  }
}

// 5. 字面量类型

/**
 * 方向类型
 * @description 定义了一个方向类型，只能是四个方向之一
 * 字面量类型限制值为特定的字符串字面量
 */
type Direction = "up" | "down" | "left" | "right";

/**
 * 骰子点数类型
 * @description 定义了一个骰子点数类型，只能是 1-6 的整数
 * 字面量类型可以用于数字字面量
 */
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 布尔字面量类型
 * @description 定义了一个布尔字面量类型，只能是 true 或 false
 * 虽然与 boolean 类型类似，但字面量类型更精确
 */
type BooleanLiteral = true | false;

/**
 * 应用配置类型
 * @description 定义了一个应用配置类型，使用了字面量类型限制配置值
 * 字面量类型可以用于创建严格的配置类型
 */
type AppConfig = {
  mode: "development" | "production"; // 运行模式，只能是开发或生产环境
  port: 3000 | 4000 | 5000; // 端口号，只能是这三个值之一
  debug: true | false; // 调试模式，只能是 true 或 false
};

// 6. 类型守卫

/**
 * 判断是否为字符串的类型守卫
 * @param value 任意值
 * @returns 是否为字符串类型
 * @description 类型守卫是一个返回布尔值的函数，用于在运行时检查类型
 * 使用 value is string 语法告诉 TypeScript 在守卫为真时，value 的类型是 string
 */
function isString(value: any): value is string {
  return typeof value === "string";
}

/**
 * 判断是否为数字的类型守卫
 * @param value 任意值
 * @returns 是否为数字类型
 * @description 类型守卫可以在条件语句中缩小类型范围
 */
function isNumber(value: any): value is number {
  return typeof value === "number";
}

/**
 * 使用类型守卫处理值
 * @param value 可以是字符串或数字类型的值
 * @description 演示了如何使用类型守卫来处理联合类型
 * 类型守卫让我们可以在运行时确定具体的类型
 */
function processValueWithGuard(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // TypeScript 知道 value 是 string
  } else if (isNumber(value)) {
    console.log(value.toFixed(2)); // TypeScript 知道 value 是 number
  }
}

/**
 * 动物类
 * @description 定义了一个基础动物类
 */
class Animal {
  move() {
    console.log("Moving...");
  }
}

/**
 * 狗类
 * @description 继承自 Animal 类，添加了狗特有的方法
 */
class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}

/**
 * 处理动物函数
 * @param animal 动物对象
 * @description 使用 instanceof 类型守卫来检查对象类型
 * instanceof 是另一种类型守卫，用于检查对象是否是某个类的实例
 */
function processAnimal(animal: Animal) {
  if (animal instanceof Dog) {
    animal.bark(); // TypeScript 知道 animal 是 Dog
  }
  animal.move();
}

// 7. 类型断言

/**
 * someValue 变量
 * @description 一个 any 类型的变量，包含一个字符串
 * 类型断言让我们可以手动指定值的类型
 */
let someValue: any = "this is a string";

/**
 * 角括号语法类型断言
 * @description 使用 <Type> 语法进行类型断言
 * 告诉 TypeScript 编译器 someValue 是字符串类型
 */
let strLength: number = (<string>someValue).length;

/**
 * as 语法类型断言
 * @description 使用 as 关键字进行类型断言
 * 这是推荐的类型断言方式，特别是在 JSX 中
 */
let anotherValue: any = "this is also a string";
let anotherStrLength: number = (anotherValue as string).length;

/**
 * 处理可空值函数
 * @param value 可以是字符串、null 或 undefined 的值
 * @description 演示了如何使用非空断言操作符 !
 * ! 操作符告诉 TypeScript 值不为 null 或 undefined
 */
function processNullableValue(value: string | null | undefined) {
  console.log(value!.length); // 使用 ! 断言 value 不为 null 或 undefined
}

// 8. 映射类型

/**
 * 只读人员类型
 * @description 将 Person 类型的所有属性变为只读
 * 映射类型使用 [K in keyof T] 语法遍历类型的所有键
 * readonly 修饰符使所有属性变为只读
 */
type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K];
};

/**
 * 可选人员类型
 * @description 将 Person 类型的所有属性变为可选
 * 使用 ? 修饰符使所有属性变为可选
 */
type PartialPerson = {
  [K in keyof Person]?: Person[K];
};

/**
 * 可空类型
 * @description 将类型 T 的所有属性变为可空（可以为 null）
 * 这是一个泛型映射类型，可以应用于任何类型
 */
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

/**
 * 可空人员类型
 * @description 应用 Nullable 映射类型到 Person 类型
 * 结果是所有属性都可以为 null 的人员类型
 */
type NullablePersonType = Nullable<Person>;

// 9. 条件类型

/**
 * 判断是否为字符串的条件类型
 * @description 使用条件类型 T extends U ? X : Y 语法
 * 如果 T 是 string 类型，则返回 true，否则返回 false
 */
type IsString<T> = T extends string ? true : false;

/**
 * 测试 A 类型
 * @description IsString<string> 的结果是 true
 */
type TestA = IsString<string>; // true

/**
 * 测试 B 类型
 * @description IsString<number> 的结果是 false
 */
type TestB = IsString<number>; // false

/**
 * 提取类型
 * @description 从类型 T 中提取可以赋值给类型 U 的类型
 * 使用条件类型和 extends 关键字进行类型提取
 */
type ExtractType<T, U> = T extends U ? T : never;

/**
 * 测试 C 类型
 * @description 从 string | number | boolean 中提取 number | boolean
 */
type TestC = ExtractType<string | number | boolean, number | boolean>; // number | boolean

/**
 * 展平类型
 * @description 展平数组类型，提取数组元素的类型
 * 使用 infer 关键字推断数组元素的类型
 */
type Flatten<T> = T extends Array<infer U> ? U : T;

/**
 * 测试 D 类型
 * @description Flatten<string[]> 的结果是 string
 */
type TestD = Flatten<string[]>; // string

/**
 * 测试 E 类型
 * @description Flatten<number> 的结果是 number（不是数组）
 */
type TestE = Flatten<number>; // number

// 10. 推断类型

/**
 * 自定义返回值类型
 * @description 推断函数类型 T 的返回值类型
 * 使用 infer 关键字推断返回值类型 R
 */
type CustomReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

/**
 * 加法函数
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两个数字的和
 */
function add(a: number, b: number): number {
  return a + b;
}

/**
 * 加法函数返回值类型
 * @description CustomReturnType<typeof add> 的结果是 number
 */
type AddReturnType = CustomReturnType<typeof add>; // number

/**
 * 元素类型
 * @description 推断数组类型 T 的元素类型
 * 使用 infer 关键字推断数组元素类型 E
 */
type ElementType<T> = T extends Array<infer E> ? E : never;

/**
 * 数组元素类型
 * @description ElementType<string[]> 的结果是 string
 */
type ArrayElement = ElementType<string[]>; // string

/**
 * 参数类型
 * @description 推断函数类型 T 的参数类型
 * 使用 infer 关键字推断参数类型 P
 */
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

/**
 * 加法函数参数类型
 * @description Parameters<typeof add> 的结果是 [number, number]
 */
type AddParameters = Parameters<typeof add>; // [number, number]

// 11. 模板字面量类型

/**
 * 问候语类型
 * @description 使用模板字面量类型定义问候语格式
 * ${string} 表示这里可以是任何字符串，类似于 JavaScript 模板字符串
 * 这种类型必须是 "Hello, " 开头，"!" 结尾的字符串
 * 
 * @example
 * const greeting1: Greeting = "Hello, World!"; // ✅ 有效
 * const greeting2: Greeting = "Hello, John!";   // ✅ 有效
 * const greeting3: Greeting = "Hi, World!";     // ❌ 错误：必须以 "Hello, " 开头
 */
type Greeting = `Hello, ${string}!`;

/**
 * 位置类型
 * @description 使用模板字面量类型结合 Direction 类型创建位置类型
 * ${Direction} 表示这里必须是 Direction 类型中的一个值
 * 这种类型必须是 "up-position", "down-position", "left-position", "right-position" 之一
 * 
 * @example
 * const pos1: Position = "up-position";    // ✅ 有效
 * const pos2: Position = "down-position";  // ✅ 有效
 * const pos3: Position = "forward-position"; // ❌ 错误：forward 不是 Direction 的值
 */
type Position = `${Direction}-position`;

/**
 * 事件名称类型
 * @description 泛型模板字面量类型，用于生成事件名称
 * 类型参数 T 必须是字符串类型，生成的类型是 T 加上 "Event" 后缀
 * 
 * @template T - 事件的基础名称，必须是字符串类型
 * @example
 * type ClickEvent = EventName<"click">;   // "clickEvent"
 * type SubmitEvent = EventName<"submit">; // "submitEvent"
 * type LoadEvent = EventName<"load">;     // "loadEvent"
 */
type EventName<T extends string> = `${T}Event`;

/**
 * 点击事件类型
 * @description 使用 EventName 泛型类型创建具体的事件类型
 * 结果是 "clickEvent" 字面量类型
 * 
 * @example
 * const clickEvent: ClickEvent = "clickEvent"; // ✅ 有效
 * const invalidEvent: ClickEvent = "click";    // ❌ 错误：缺少 "Event" 后缀
 */
type ClickEvent = EventName<"click">; // "clickEvent"

/**
 * 路径参数类型
 * @description 用于定义 API 路径中的参数占位符
 * 类型参数 T 必须是字符串类型，生成的类型是 ":" 加上 T
 * 这种类型常用于定义 RESTful API 的路径参数
 * 
 * @template T - 参数名称，必须是字符串类型
 * @example
 * type UserIdParam = PathParam<"id">;     // ":id"
 * type UserSlugParam = PathParam<"slug">; // ":slug"
 * type PageParam = PathParam<"page">;     // ":page"
 */
type PathParam<T extends string> = `:${T}`;

/**
 * API 路径类型
 * @description 使用模板字面量类型和 PathParam 类型定义完整的 API 路径
 * 嵌套使用模板字面量类型，可以创建复杂的路径类型
 * 这种类型确保 API 路径格式正确，并且参数名称类型安全
 * 
 * @example
 * const userPath: ApiPath = "/api/users/:id";          // ✅ 有效
 * const invalidPath: ApiPath = "/api/users/id";       // ❌ 错误：缺少冒号
 * const invalidPath2: ApiPath = "/api/users/:123";    // ❌ 错误：参数名不能是数字
 */
type ApiPath = `/api/users/${PathParam<"id">}`; // "/api/users/:id"

// 12. 递归类型

/**
 * 树节点类型
 * @description 定义了一个泛型树节点类型，用于表示树形数据结构
 * 
 * @template T - 节点中存储的值的类型
 * @property value - 节点存储的值，类型为 T
 * @property children - 可选的子节点数组，每个子节点也是 TreeNode<T> 类型
 * 
 * 递归类型是指类型定义中引用了自身，这对于表示树形结构、链表等数据结构非常有用
 * children 属性的类型是 TreeNode<T>[]，即 TreeNode 类型的数组，这就是递归引用
 * 
 * @example
 * // 创建一个简单的树结构
 * const simpleTree: TreeNode<string> = {
 *   value: "root",
 *   children: [
 *     { value: "child1" },
 *     { value: "child2" }
 *   ]
 * };
 * 
 * // 创建一个多层嵌套的树结构
 * const complexTree: TreeNode<number> = {
 *   value: 1,
 *   children: [
 *     {
 *       value: 2,
 *       children: [
 *         { value: 4 },
 *         { value: 5 }
 *       ]
 *     },
 *     {
 *       value: 3,
 *       children: [
 *         { value: 6 }
 *       ]
 *     }
 *   ]
 * };
 * 
 * // 使用递归函数遍历树
 * function traverseTree<T>(node: TreeNode<T>, callback: (value: T) => void): void {
 *   callback(node.value);
 *   if (node.children) {
 *     node.children.forEach(child => traverseTree(child, callback));
 *   }
 * }
 */
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

/**
 * 树结构实例
 * @description 创建一个实际的树结构对象，演示递归类型的使用
 * 
 * 这个树结构包含：
 * - 根节点：value 为 "root"
 * - 第一层子节点：
 *   - "child1" 节点，有一个子节点 "grandchild1"
 *   - "child2" 节点，没有子节点
 * 
 * 这种结构在表示文件系统、组织架构、分类目录等场景中非常常见
 */
const tree: TreeNode<string> = {
  value: "root",
  children: [
    {
      value: "child1",
      children: [
        { value: "grandchild1" }
      ]
    },
    { value: "child2" }
  ]
};

// 13. 实用类型

/**
 * 部分用户类型
 * @description 使用 Partial<T> 实用类型将 User 类型的所有属性变为可选
 * Partial<T> 会将 T 类型的所有属性都加上 ? 修饰符，使它们变为可选
 * 
 * @example
 * const partialUser: PartialUser = {
 *   name: "John"  // ✅ 只提供部分属性
 * };
 * 
 * const emptyUser: PartialUser = {};  // ✅ 可以不提供任何属性
 */
type PartialUser = Partial<User>;

/**
 * 必需用户类型
 * @description 使用 Required<T> 实用类型将 PartialUser 类型的所有属性变为必需
 * Required<T> 会移除 T 类型所有属性的 ? 修饰符，使它们变为必需
 * 
 * @example
 * const requiredUser: RequiredUser = {
 *   id: 1,
 *   name: "John",
 *   email: "john@example.com"  // ✅ 必须提供所有属性
 * };
 */
type RequiredUser = Required<PartialUser>;

/**
 * 只读用户类型
 * @description 使用 Readonly<T> 实用类型将 User 类型的所有属性变为只读
 * Readonly<T> 会给 T 类型的所有属性加上 readonly 修饰符，使它们不可修改
 * 
 * @example
 * const readonlyUser: ReadonlyUser = {
 *   id: 1,
 *   name: "John",
 *   email: "john@example.com"
 * };
 * readonlyUser.name = "Jane";  // ❌ 错误：不能修改只读属性
 */
type ReadonlyUser = Readonly<User>;

/**
 * 用户信息类型
 * @description 使用 Pick<T, K> 实用类型从 User 类型中选择指定的属性
 * Pick<T, K> 从 T 类型中选择属性名集合 K 对应的属性，创建一个新类型
 * 
 * @example
 * const userInfo: UserInfo = {
 *   name: "John",
 *   email: "john@example.com"  // ✅ 只包含 name 和 email 属性
 * };
 */
type UserInfo = Pick<User, "name" | "email">;

/**
 * 无年龄用户类型
 * @description 使用 Omit<T, K> 实用类型从 User 类型中排除指定的属性
 * Omit<T, K> 从 T 类型中排除属性名集合 K 对应的属性，创建一个新类型
 * 
 * @example
 * const userWithoutAge: UserWithoutAge = {
 *   id: 1,
 *   name: "John",
 *   email: "john@example.com"  // ✅ 不包含 age 属性
 * };
 */
type UserWithoutAge = Omit<User, "age">;

/**
 * 用户映射类型
 * @description 使用 Record<K, T> 实用类型创建一个键为字符串、值为 User 的对象类型
 * Record<K, T> 创建一个对象类型，其属性名为 K 类型，属性值为 T 类型
 * 
 * @example
 * const userMap: UserMap = {
 *   "user1": { id: 1, name: "John", email: "john@example.com" },
 *   "user2": { id: 2, name: "Jane", email: "jane@example.com" }
 * };
 */
type UserMap = Record<string, User>;

/**
 * 原始类型
 * @description 定义了 TypeScript 中的所有原始类型
 * 原始类型是最基本的数据类型，不是对象，没有方法
 */
type Primitive = string | number | boolean | null | undefined;

/**
 * 非空原始类型
 * @description 使用 Exclude<T, U> 实用类型从 Primitive 类型中排除 null 和 undefined
 * Exclude<T, U> 从 T 类型中排除可以赋值给 U 的类型
 * 
 * @example
 * const value1: NonNullPrimitive = "hello";  // ✅ 字符串
 * const value2: NonNullPrimitive = 42;      // ✅ 数字
 * const value3: NonNullPrimitive = true;     // ✅ 布尔值
 * const value4: NonNullPrimitive = null;     // ❌ 错误：不能为 null
 * const value5: NonNullPrimitive = undefined; // ❌ 错误：不能为 undefined
 */
type NonNullPrimitive = Exclude<Primitive, null | undefined>;

/**
 * 字符串或数字类型
 * @description 使用 Extract<T, U> 实用类型从 Primitive 类型中提取 string 和 number
 * Extract<T, U> 从 T 类型中提取可以赋值给 U 的类型
 * 
 * @example
 * const value1: StringOrNumber = "hello";  // ✅ 字符串
 * const value2: StringOrNumber = 42;      // ✅ 数字
 * const value3: StringOrNumber = true;     // ❌ 错误：不能为布尔值
 */
type StringOrNumber = Extract<Primitive, string | number>;

/**
 * 非空用户类型
 * @description 使用 NonNullable<T> 实用类型从联合类型中排除 null 和 undefined
 * NonNullable<T> 是 Exclude<T, null | undefined> 的简写形式
 * 
 * @example
 * const user1: NotNullUser = { id: 1, name: "John", email: "john@example.com" }; // ✅ 有效用户
 * const user2: NotNullUser = null;     // ❌ 错误：不能为 null
 * const user3: NotNullUser = undefined; // ❌ 错误：不能为 undefined
 */
type NotNullUser = NonNullable<User | null | undefined>;

// 14. 高级泛型

/**
 * 长度接口
 * @description 定义了一个包含 length 属性的接口
 * 这个接口用于泛型约束，确保类型参数具有 length 属性
 * 
 * @property length - 长度值，类型为 number
 * 
 * @example
 * const str: Lengthwise = "hello";  // ✅ 字符串有 length 属性
 * const arr: Lengthwise = [1, 2, 3]; // ✅ 数组有 length 属性
 * const obj: Lengthwise = { length: 10 }; // ✅ 对象有 length 属性
 */
interface Lengthwise {
  length: number;
}

/**
 * 带日志的标识函数
 * @description 一个泛型函数，使用泛型约束确保参数具有 length 属性
 * 
 * @template T - 泛型类型参数，必须满足 Lengthwise 约束（具有 length 属性）
 * @param arg - 类型为 T 的参数，必须具有 length 属性
 * @returns 返回传入的参数，类型为 T
 * 
 * 泛型约束使用 extends 关键字，限制类型参数 T 必须是 Lengthwise 或其子类型
 * 这样在函数体内就可以安全地访问 arg.length 属性，而不会出现类型错误
 * 
 * @example
 * loggingIdentity("hello");  // 输出: 5，返回 "hello"
 * loggingIdentity([1, 2, 3]); // 输出: 3，返回 [1, 2, 3]
 * loggingIdentity({ length: 10, value: "test" }); // 输出: 10，返回对象
 * loggingIdentity(42); // ❌ 错误：数字没有 length 属性
 */
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);  // 现在我们知道 arg 有 length 属性，所以不会报错
  return arg;
}

/**
 * 创建数组函数
 * @description 一个泛型函数，创建指定长度并填充相同值的数组
 * 
 * @template T - 泛型类型参数，默认值为 string
 * @param length - 数组的长度
 * @param value - 用于填充数组的值，类型为 T
 * @returns 返回一个类型为 T[] 的数组
 * 
 * 这个函数展示了默认类型参数的使用
 * 如果不指定类型参数，T 默认为 string 类型
 * 
 * @example
 * const strArray = createArray(3, "hello"); // 类型为 string[]，值为 ["hello", "hello", "hello"]
 * const numArray = createArray<number>(3, 42); // 类型为 number[]，值为 [42, 42, 42]
 * const boolArray = createArray<boolean>(2, true); // 类型为 boolean[]，值为 [true, true]
 */
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

/**
 * 猫类
 * @description 继承自 Animal 类的猫类，添加了猫特有的方法
 * 这个类用于演示条件类型中的类型判断
 */
class Cat extends Animal {
  /**
   * 喵喵叫方法
   * @description 猫特有的叫声方法
   */
  meow(): void {
    console.log("Meow!");
  }
}

/**
 * 动物类型判断
 * @description 使用条件类型根据不同的动物类型返回对应的字符串类型
 * 
 * @template T - 泛型类型参数，必须是 Animal 或其子类
 * @returns 如果 T 是 Dog 类型，返回 "dog"；如果 T 是 Cat 类型，返回 "cat"；否则返回 "animal"
 * 
 * 条件类型使用 extends 关键字进行类型检查
 * T extends Dog ? X : Y 表示：如果 T 可以赋值给 Dog 类型，则返回 X，否则返回 Y
 * 这种嵌套的条件类型可以实现复杂的类型判断逻辑
 * 
 * @example
 * type DogType = AnimalType<Dog>;    // "dog"
 * type CatType = AnimalType<Cat>;    // "cat"
 * type AnimalType2 = AnimalType<Animal>; // "animal"
 */
type AnimalType<T> = T extends Dog ? "dog" : T extends Cat ? "cat" : "animal";

/**
 * 狗类型
 * @description AnimalType<Dog> 的结果是 "dog"
 * 
 * @example
 * const dogType: DogType = "dog";  // ✅ 有效
 * const invalidDogType: DogType = "cat"; // ❌ 错误：不能为 "cat"
 */
type DogType = AnimalType<Dog>; // "dog"

/**
 * 猫类型
 * @description AnimalType<Cat> 的结果是 "cat"
 * 
 * @example
 * const catType: CatType = "cat";  // ✅ 有效
 * const invalidCatType: CatType = "dog"; // ❌ 错误：不能为 "dog"
 */
type CatType = AnimalType<Cat>; // "cat"

/**
 * 动物类型 2
 * @description AnimalType<Animal> 的结果是 "animal"
 * 因为 Animal 不是 Dog 或 Cat 的子类，所以返回默认值 "animal"
 * 
 * @example
 * const animalType: AnimalType2 = "animal";  // ✅ 有效
 * const invalidAnimalType: AnimalType2 = "dog"; // ❌ 错误：不能为 "dog"
 */
type AnimalType2 = AnimalType<Animal>; // "animal"

/**
 * 嵌套数组类型
 * @description 使用 Flatten 类型展平二维数组
 * Flatten<number[][]> 的结果是 number
 * 
 * Flatten 类型在第 9 节"条件类型"中定义：
 * type Flatten<T> = T extends Array<infer U> ? U : T;
 * 
 * 对于 number[][]：
 * - T = number[][]
 * - T extends Array<infer U> ? number[][] extends Array<infer U> ? true
 * - U 被推断为 number[]
 * - 结果是 number[]
 * 
 * 但是这里有一个问题，Flatten 只展平一层
 * 如果要展平多层嵌套，需要使用递归类型
 * 
 * @example
 * const nestedArray: NestedArray = [[1, 2], [3, 4]]; // 类型为 number[]
 * // 注意：这里实际上 Flatten<number[][]> 返回的是 number[]，而不是 number
 * // 如果要展平到 number，需要递归的 Flatten 实现
 */
type NestedArray = Flatten<number[][]>; // number[]

// 15. 实际应用示例
// 类型安全的事件系统
interface EventMap {
  'click': MouseEvent;
  'keydown': KeyboardEvent;
  'submit': Event;
}

class EventEmitter {
  private listeners: {
    [K in keyof EventMap]?: ((event: EventMap[K]) => void)[];
  } = {};

  on<K extends keyof EventMap>(event: K, listener: (event: EventMap[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(listener);
  }

  emit<K extends keyof EventMap>(event: K, eventData: EventMap[K]): void {
    this.listeners[event]?.forEach(listener => listener(eventData));
  }
}

// 类型安全的 API 响应处理
type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

interface UserData {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<ApiResponse<UserData>> {
  // 模拟 API 请求
  return {
    success: true,
    data: {
      id,
      name: "John Doe",
      email: "john@example.com"
    }
  };
}

async function processUser() {
  const response = await fetchUser(1);
  if (response.success) {
    console.log('User:', response.data.name);
  } else {
    console.error('Error:', response.error);
  }
}

// 类型安全的配置系统
type ConfigKeys = "apiUrl" | "port" | "debug";
type ConfigValues = {
  apiUrl: string;
  port: number;
  debug: boolean;
};

class Config {
  private config: ConfigValues;

  constructor(initialConfig: ConfigValues) {
    this.config = initialConfig;
  }

  get<K extends ConfigKeys>(key: K): ConfigValues[K] {
    return this.config[key];
  }

  set<K extends ConfigKeys>(key: K, value: ConfigValues[K]): void {
    this.config[key] = value;
  }
}

// 测试代码
function testAdvancedTypes() {
  console.log("Testing advanced types...");
  
  // 测试联合类型
  processValue("hello");
  processValue(42);
  processValue(true);
  
  // 测试类型守卫
  processValueWithGuard("test");
  processValueWithGuard(123);
  
  // 测试事件系统
  const emitter = new EventEmitter();
  emitter.on('click', (event) => {
    console.log('Click event:', event.clientX, event.clientY);
  });
  
  // 测试 API 响应处理
  processUser();
  
  // 测试配置系统
  const config = new Config({
    apiUrl: "https://api.example.com",
    port: 3000,
    debug: true
  });
  console.log('API URL:', config.get('apiUrl'));
  console.log('Port:', config.get('port'));
  console.log('Debug:', config.get('debug'));
  
  config.set('port', 4000);
  console.log('Updated port:', config.get('port'));
  
  console.log("Advanced types test completed!");
}

// 导出测试函数
export { testAdvancedTypes };

// 导出类型
export type {
  UserId,
  User,
  Callback,
  Container,
  Person,
  Employee,
  Manager,
  Status,
  Result,
  Direction,
  DiceRoll,
  BooleanLiteral,
  AppConfig,
  TreeNode,
  ApiResponse,
  UserData
};
