# TypeScript 高级类型

TypeScript 提供了丰富的高级类型特性，这些特性可以帮助开发者创建更安全、更灵活的类型系统。本文档详细介绍 TypeScript 中的高级类型及其使用方法。

## 目录

1. [类型别名](#类型别名)
2. [接口继承](#接口继承)
3. [交叉类型](#交叉类型)
4. [联合类型](#联合类型)
5. [字面量类型](#字面量类型)
6. [类型守卫](#类型守卫)
7. [类型断言](#类型断言)
8. [映射类型](#映射类型)
9. [条件类型](#条件类型)
10. [推断类型](#推断类型)
11. [模板字面量类型](#模板字面量类型)
12. [递归类型](#递归类型)
13. [实用类型](#实用类型)
14. [高级泛型](#高级泛型)
15. [示例](#示例)

## 类型别名

类型别名允许为类型创建新名称，使复杂类型更易于理解和使用。

```typescript
// 基本类型别名
type UserId = string | number;

// 复杂类型别名
type User = {
  id: UserId;
  name: string;
  email: string;
};

// 函数类型别名
type Callback = (error: Error | null, result: any) => void;

// 泛型类型别名
type Container<T> = {
  value: T;
};
```

## 接口继承

接口可以继承其他接口，从而复用和扩展类型定义。

```typescript
// 基本接口
interface Person {
  name: string;
  age: number;
}

// 继承接口
interface Employee extends Person {
  employeeId: string;
  position: string;
}

// 多继承
interface Manager extends Employee {
  department: string;
  subordinates: Employee[];
}
```

## 交叉类型

交叉类型将多个类型合并为一个新类型，包含所有类型的属性。

```typescript
// 交叉类型
interface A {
  a: string;
}

interface B {
  b: number;
}

// 交叉类型 C 包含 A 和 B 的所有属性
type C = A & B;

const c: C = {
  a: "hello",
  b: 42
};
```

## 联合类型

联合类型表示一个值可以是多种类型之一。

```typescript
// 联合类型
type Status = "active" | "inactive" | "pending";

// 复杂联合类型
type Result = {
  success: true;
  data: any;
} | {
  success: false;
  error: string;
};

// 函数参数联合类型
function processValue(value: string | number | boolean) {
  // 处理不同类型的值
}
```

## 字面量类型

字面量类型允许指定具体的字符串、数字或布尔值作为类型。

```typescript
// 字符串字面量类型
type Direction = "up" | "down" | "left" | "right";

// 数字字面量类型
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// 布尔字面量类型
type BooleanLiteral = true | false;

// 组合字面量类型
type Config = {
  mode: "development" | "production";
  port: 3000 | 4000 | 5000;
  debug: true | false;
};
```

## 类型守卫

类型守卫用于在运行时检查变量的类型，使类型系统更加安全。

```typescript
// 类型守卫函数
function isString(value: any): value is string {
  return typeof value === "string";
}

function isNumber(value: any): value is number {
  return typeof value === "number";
}

// 使用类型守卫
function processValue(value: string | number) {
  if (isString(value)) {
    // 此时 value 被推断为 string 类型
    console.log(value.toUpperCase());
  } else if (isNumber(value)) {
    // 此时 value 被推断为 number 类型
    console.log(value.toFixed(2));
  }
}

//  instanceof 类型守卫
class Animal {
  move() {}
}

class Dog extends Animal {
  bark() {}
}

function processAnimal(animal: Animal) {
  if (animal instanceof Dog) {
    // 此时 animal 被推断为 Dog 类型
    animal.bark();
  }
  animal.move();
}
```

## 类型断言

类型断言允许开发者覆盖 TypeScript 的类型推断，告诉编译器某个值的具体类型。

```typescript
// 尖括号语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// as 语法
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;

// 非空断言
function processValue(value: string | null | undefined) {
  // 告诉编译器 value 不为 null 或 undefined
  console.log(value!.length);
}
```

## 映射类型

映射类型允许基于现有类型创建新类型，通过映射其属性。

```typescript
// 基本映射类型
interface Person {
  name: string;
  age: number;
  email: string;
}

// 只读映射类型
type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K];
};

// 可选映射类型
type PartialPerson = {
  [K in keyof Person]?: Person[K];
};

// 自定义映射类型
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullablePerson = Nullable<Person>;
```

## 条件类型

条件类型允许根据类型条件选择不同的类型。

```typescript
// 基本条件类型
type IsString<T> = T extends string ? true : false;

// 测试条件类型
type A = IsString<string>; // true
type B = IsString<number>; // false

// 复杂条件类型
type Extract<T, U> = T extends U ? T : never;

// 测试 Extract
type C = Extract<string | number | boolean, number | boolean>; // number | boolean

// 条件类型与泛型结合
type Flatten<T> = T extends Array<infer U> ? U : T;

type D = Flatten<string[]>; // string
type E = Flatten<number>; // number
```

## 推断类型

`infer` 关键字用于在条件类型中推断类型变量。

```typescript
// 推断函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function add(a: number, b: number): number {
  return a + b;
}

type AddReturnType = ReturnType<typeof add>; // number

// 推断数组元素类型
type ElementType<T> = T extends Array<infer E> ? E : never;

type ArrayElement = ElementType<string[]>; // string

// 推断函数参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

type AddParameters = Parameters<typeof add>; // [number, number]
```

## 模板字面量类型

模板字面量类型允许使用模板字符串语法创建类型。

```typescript
// 基本模板字面量类型
type Greeting = `Hello, ${string}!`;

// 组合模板字面量类型
type Direction = "up" | "down" | "left" | "right";
type Position = `${Direction}-position`;

// 类型推断与模板字面量
type EventName<T extends string> = `${T}Event`;
type ClickEvent = EventName<"click">; // "clickEvent"

// 复杂模板字面量类型
type PathParam<T extends string> = `:${T}`;
type ApiPath = `/api/users/${PathParam<"id">}`; // "/api/users/:id"
```

## 递归类型

递归类型允许类型引用自身，用于表示嵌套结构。

```typescript
// 递归类型 - 树结构
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

// 使用递归类型
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

// 递归类型 - JSON
interface JsonValue {
  string: string;
  number: number;
  boolean: boolean;
  null: null;
  array: JsonValue[];
  object: { [key: string]: JsonValue };
}
```

## 实用类型

TypeScript 提供了多种内置的实用类型，用于常见的类型转换。

### 常用实用类型

1. **Partial<T>**：将类型的所有属性变为可选
2. **Required<T>**：将类型的所有属性变为必需
3. **Readonly<T>**：将类型的所有属性变为只读
4. **Record<K, T>**：创建键为 K 类型、值为 T 类型的对象类型
5. **Pick<T, K>**：从类型 T 中选择指定的属性 K
6. **Omit<T, K>**：从类型 T 中排除指定的属性 K
7. **Exclude<T, U>**：从类型 T 中排除可以赋值给 U 的类型
8. **Extract<T, U>**：从类型 T 中提取可以赋值给 U 的类型
9. **NonNullable<T>**：从类型 T 中排除 null 和 undefined
10. **ReturnType<T>**：获取函数类型 T 的返回类型
11. **Parameters<T>**：获取函数类型 T 的参数类型数组
12. **ConstructorParameters<T>**：获取构造函数类型 T 的参数类型数组
13. **InstanceType<T>**：获取构造函数类型 T 的实例类型

```typescript
// 使用实用类型
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Partial - 所有属性变为可选
type PartialUser = Partial<User>;

// Required - 所有属性变为必需
type RequiredUser = Required<PartialUser>;

// Readonly - 所有属性变为只读
type ReadonlyUser = Readonly<User>;

// Pick - 选择指定属性
type UserInfo = Pick<User, "name" | "email">;

// Omit - 排除指定属性
type UserWithoutAge = Omit<User, "age">;

// Record - 创建对象类型
type UserMap = Record<string, User>;

// Exclude - 排除类型
type Primitive = string | number | boolean | null | undefined;
type NonNullPrimitive = Exclude<Primitive, null | undefined>;

// Extract - 提取类型
type StringOrNumber = Extract<Primitive, string | number>;

// NonNullable - 排除 null 和 undefined
type NotNullUser = NonNullable<User | null | undefined>;
```

## 高级泛型

高级泛型技术包括泛型约束、默认类型参数和条件类型等。

```typescript
// 泛型约束
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 默认类型参数
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

// 条件类型与泛型
class Animal {
  name: string;
}

class Dog extends Animal {
  bark(): void {}
}

class Cat extends Animal {
  meow(): void {}
}

// 条件类型分发
type AnimalType<T> = T extends Dog ? "dog" : T extends Cat ? "cat" : "animal";

type DogType = AnimalType<Dog>; // "dog"
type CatType = AnimalType<Cat>; // "cat"
type AnimalType2 = AnimalType<Animal>; // "animal"

// 分布式条件类型
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type NestedArray = Flatten<number[][]>; // number
```

## 示例

### 完整示例

```typescript
// 类型别名
type UserId = string | number;

// 接口定义
interface Person {
  id: UserId;
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
  position: string;
  department: string;
}

// 联合类型
type EmploymentStatus = "full-time" | "part-time" | "contract";

// 交叉类型
interface Payroll {
  salary: number;
  benefits: string[];
}

type EmployeeWithPayroll = Employee & Payroll;

// 映射类型
type ReadonlyEmployee = Readonly<Employee>;
type PartialEmployee = Partial<Employee>;

// 条件类型
type IsEmployee<T> = T extends Employee ? true : false;

// 类型守卫
function isEmployee(person: Person | Employee): person is Employee {
  return 'employeeId' in person;
}

// 模板字面量类型
type EmployeeEvent = `${EmploymentStatus}Event`;

// 递归类型
type Organization = {
  name: string;
  employees: Employee[];
  departments: {
    name: string;
    manager: Employee;
    employees: Employee[];
  }[];
};

// 使用示例
const employee: EmployeeWithPayroll = {
  id: 1,
  name: "John Doe",
  age: 30,
  employeeId: "EMP001",
  position: "Software Engineer",
  department: "Engineering",
  salary: 100000,
  benefits: ["Health Insurance", "401k"]
};

function processPerson(person: Person | Employee) {
  if (isEmployee(person)) {
    // 处理员工
    console.log(`Employee: ${person.name}, Position: ${person.position}`);
  } else {
    // 处理普通人
    console.log(`Person: ${person.name}, Age: ${person.age}`);
  }
}

processPerson(employee);
```

### 高级类型应用

```typescript
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

// 使用事件系统
const emitter = new EventEmitter();

emitter.on('click', (event) => {
  console.log('Click event:', event.clientX, event.clientY);
});

emitter.on('keydown', (event) => {
  console.log('Key pressed:', event.key);
});

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
    // 类型安全地访问 data
    console.log('User:', response.data.name);
  } else {
    // 类型安全地访问 error
    console.error('Error:', response.error);
  }
}

processUser();
```

## 总结

TypeScript 的高级类型系统提供了强大的工具，使开发者能够创建更安全、更灵活的类型定义。通过掌握这些高级类型特性，你可以：

1. **创建更精确的类型定义**：使用字面量类型、联合类型和交叉类型
2. **提高代码可维护性**：使用类型别名和接口继承
3. **增强类型安全性**：使用类型守卫和类型断言
4. **创建可重用的类型**：使用泛型和条件类型
5. **简化复杂类型操作**：使用映射类型和实用类型

这些高级类型特性不仅可以帮助你编写更安全的代码，还可以提高代码的可读性和可维护性。通过结合使用这些特性，你可以构建出更加健壮和类型安全的 TypeScript 应用。