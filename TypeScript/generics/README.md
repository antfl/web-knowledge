# TypeScript 泛型

泛型（Generics）是 TypeScript 中一种强大的工具，它允许我们在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型。泛型提供了类型安全的同时，也保持了代码的灵活性和复用性。

## 目录

1. [泛型简介](#泛型简介)
2. [泛型函数](#泛型函数)
3. [泛型接口](#泛型接口)
4. [泛型类](#泛型类)
5. [泛型约束](#泛型约束)
6. [泛型默认类型](#泛型默认类型)
7. [条件类型](#条件类型)
8. [映射类型](#映射类型)
9. [工具类型](#工具类型)
10. [实际应用场景](#实际应用场景)
11. [最佳实践](#最佳实践)

## 泛型简介

### 为什么需要泛型

泛型解决了以下问题：

1. **代码复用**：避免为不同类型编写重复的代码
2. **类型安全**：在编译时捕获类型错误
3. **灵活性**：保持代码的通用性和可扩展性
4. **可读性**：代码更清晰，意图更明确

### 泛型的基本语法

```typescript
// 泛型使用尖括号 <> 声明
function identity<T>(arg: T): T {
  return arg;
}

// 使用时指定类型
const result1 = identity<string>("hello");
const result2 = identity<number>(42);

// 类型推断
const result3 = identity("hello");
const result4 = identity(42);
```

## 泛型函数

### 基本泛型函数

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const output1 = identity<string>("myString");
const output2 = identity<number>(100);
```

### 多个类型参数

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const pair1 = pair<string, number>("hello", 42);
const pair2 = pair<boolean, string>(true, "world");
```

### 泛型约束

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

loggingIdentity({ length: 10, value: "hello" });
loggingIdentity([1, 2, 3]);
```

### 在泛型约束中使用类型参数

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "John", age: 30 };
const name = getProperty(user, "name");
const age = getProperty(user, "age");
```

## 泛型接口

### 基本泛型接口

```typescript
interface Box<T> {
  contents: T;
}

let box1: Box<string> = { contents: "hello" };
let box2: Box<number> = { contents: 42 };
```

### 泛型接口作为函数类型

```typescript
interface GenericIdentityFn {
  <T>(arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

### 泛型接口与实现

```typescript
interface Repository<T> {
  findById(id: string): Promise<T>;
  findAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string, entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User> {
    return { id, name: "John" };
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async create(entity: User): Promise<User> {
    return entity;
  }

  async update(id: string, entity: User): Promise<User> {
    return entity;
  }

  async delete(id: string): Promise<void> {
    console.log(`Deleted user ${id}`);
  }
}
```

## 泛型类

### 基本泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;

  constructor(zeroValue: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = addFn;
  }
}

let myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y);
let myGenericString = new GenericNumber<string>("", (x, y) => x + y);
```

### 泛型类继承

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

class LimitedStack<T> extends Stack<T> {
  private maxSize: number;

  constructor(maxSize: number) {
    super();
    this.maxSize = maxSize;
  }

  push(item: T): void {
    if (this.items.length >= this.maxSize) {
      throw new Error("Stack is full");
    }
    super.push(item);
  }
}
```

### 泛型类实现接口

```typescript
interface Collection<T> {
  add(item: T): void;
  remove(item: T): boolean;
  contains(item: T): boolean;
  size(): number;
}

class ArrayCollection<T> implements Collection<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  contains(item: T): boolean {
    return this.items.includes(item);
  }

  size(): number {
    return this.items.length;
  }
}
```

## 泛型约束

### 基本约束

```typescript
interface HasLength {
  length: number;
}

function getLength<T extends HasLength>(arg: T): number {
  return arg.length;
}

getLength("hello"); // 5
getLength([1, 2, 3]); // 3
getLength({ length: 10 }); // 10
```

### 使用 keyof 约束

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

const user = { name: "John", age: 30, email: "john@example.com" };
const name = getProperty(user, "name");
setProperty(user, "age", 31);
```

### 多重约束

```typescript
interface Serializable {
  serialize(): string;
}

interface Deserializable<T> {
  deserialize(data: string): T;
}

function process<T extends Serializable & Deserializable<T>>(item: T): T {
  const serialized = item.serialize();
  return item.deserialize(serialized);
}
```

### 条件约束

```typescript
interface WithId {
  id: string;
}

function ensureId<T extends WithId | undefined>(item: T): T extends undefined ? never : T {
  if (!item) {
    throw new Error("Item must have an id");
  }
  return item as any;
}
```

## 泛型默认类型

### 基本默认类型

```typescript
interface Box<T = string> {
  contents: T;
}

let box1: Box = { contents: "hello" }; // T 默认为 string
let box2: Box<number> = { contents: 42 };
```

### 函数默认类型

```typescript
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

const arr1 = createArray(3, "hello"); // string[]
const arr2 = createArray(3, 42); // number[]
const arr3 = createArray(3); // string[] (使用默认类型)
```

### 类默认类型

```typescript
class Storage<T = any> {
  private data: Map<string, T> = new Map();

  set(key: string, value: T): void {
    this.data.set(key, value);
  }

  get(key: string): T | undefined {
    return this.data.get(key);
  }
}

const storage1 = new Storage(); // T 默认为 any
const storage2 = new Storage<string>(); // T 为 string
```

## 条件类型

### 基本条件类型

```typescript
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false
```

### 条件类型与泛型

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type Test1 = NonNullable<string | null>; // string
type Test2 = NonNullable<number | undefined>; // number
```

### 分布式条件类型

```typescript
type ToArray<T> = T extends any ? T[] : never;

type Test = ToArray<string | number>; // string[] | number[]
```

### 条件类型推断

```typescript
type Flatten<T> = T extends Array<infer U> ? U : T;

type Test1 = Flatten<string[]>; // string
type Test2 = Flatten<number>; // number
```

## 映射类型

### 基本映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
```

### 映射类型与条件类型

```typescript
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// {
//   getName: () => string;
//   getAge: () => number;
// }
```

### 映射类型与模板字面量类型

```typescript
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => void;
};

interface Events {
  click: MouseEvent;
  keydown: KeyboardEvent;
  submit: Event;
}

type Handlers = EventHandlers<Events>;
// {
//   onClick: (event: MouseEvent) => void;
//   onKeydown: (event: KeyboardEvent) => void;
//   onSubmit: (event: Event) => void;
// }
```

## 工具类型

### Partial<T>

将类型 T 的所有属性变为可选：

```typescript
interface User {
  id: string;
  name: string;
  age: number;
  email: string;
}

type PartialUser = Partial<User>;

function updateUser(id: string, updates: Partial<User>): void {
  console.log(`Updating user ${id} with:`, updates);
}

updateUser("123", { name: "John" });
updateUser("123", { age: 30, email: "john@example.com" });
```

### Required<T>

将类型 T 的所有属性变为必需：

```typescript
interface User {
  name?: string;
  age?: number;
  email?: string;
}

type RequiredUser = Required<User>;

const user: RequiredUser = {
  name: "John",
  age: 30,
  email: "john@example.com"
};
```

### Readonly<T>

将类型 T 的所有属性变为只读：

```typescript
interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = {
  name: "John",
  age: 30
};

// user.name = "Jane"; // 错误：Cannot assign to 'name' because it is read-only
```

### Pick<T, K>

从类型 T 中选择一组属性 K：

```typescript
interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  address: string;
}

type UserBasicInfo = Pick<User, "id" | "name" | "email">;

const basicInfo: UserBasicInfo = {
  id: "123",
  name: "John",
  email: "john@example.com"
};
```

### Omit<T, K>

从类型 T 中排除一组属性 K：

```typescript
interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
}

type PublicUser = Omit<User, "password">;

const publicUser: PublicUser = {
  id: "123",
  name: "John",
  age: 30,
  email: "john@example.com"
};
```

### Record<K, T>

创建一个对象类型，其属性键为 K，属性值为 T：

```typescript
type UserMap = Record<string, User>;

const users: UserMap = {
  "123": { id: "123", name: "John", age: 30 },
  "456": { id: "456", name: "Jane", age: 25 }
};
```

### Exclude<T, U>

从类型 T 中排除可以赋值给 U 的类型：

```typescript
type T = Exclude<string | number | boolean, number>;

// T = string | boolean
```

### Extract<T, U>

从类型 T 中提取可以赋值给 U 的类型：

```typescript
type T = Extract<string | number | boolean, number | string>;

// T = string | number
```

### NonNullable<T>

从类型 T 中排除 null 和 undefined：

```typescript
type T = NonNullable<string | null | undefined>;

// T = string
```

### ReturnType<T>

获取函数类型 T 的返回值类型：

```typescript
function getUser(): User {
  return { id: "123", name: "John", age: 30 };
}

type UserReturnType = ReturnType<typeof getUser>;
// UserReturnType = User
```

### InstanceType<T>

获取类类型 T 的实例类型：

```typescript
class User {
  constructor(public name: string, public age: number) {}
}

type UserInstance = InstanceType<typeof User>;
// UserInstance = User
```

## 实际应用场景

### 1. API 响应处理

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
}

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

async function fetchPost(id: string): Promise<ApiResponse<Post>> {
  const response = await fetch(`/api/posts/${id}`);
  return response.json();
}
```

### 2. 数据存储

```typescript
class DataStore<T> {
  private data: Map<string, T> = new Map();

  set(key: string, value: T): void {
    this.data.set(key, value);
  }

  get(key: string): T | undefined {
    return this.data.get(key);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  delete(key: string): boolean {
    return this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }

  getAll(): T[] {
    return Array.from(this.data.values());
  }
}

const userStore = new DataStore<User>();
const postStore = new DataStore<Post>();
```

### 3. 表单验证

```typescript
interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

interface FormField<T> {
  value: T;
  rules: ValidationRule<T>[];
  errors: string[];
}

class Form<T extends Record<string, any>> {
  private fields: Map<keyof T, FormField<any>> = new Map();

  addField<K extends keyof T>(
    name: K,
    value: T[K],
    rules: ValidationRule<T[K]>[]
  ): void {
    this.fields.set(name, { value, rules, errors: [] });
  }

  validate(): boolean {
    let isValid = true;
    this.fields.forEach((field, name) => {
      field.errors = [];
      field.rules.forEach(rule => {
        if (!rule.validate(field.value)) {
          field.errors.push(rule.message);
          isValid = false;
        }
      });
    });
    return isValid;
  }

  getValue<K extends keyof T>(name: K): T[K] {
    return this.fields.get(name)!.value;
  }

  getErrors<K extends keyof T>(name: K): string[] {
    return this.fields.get(name)!.errors;
  }
}
```

### 4. 事件系统

```typescript
interface EventHandler<T> {
  (event: T): void;
}

class EventEmitter<T extends Record<string, any>> {
  private listeners: Map<keyof T, EventHandler<any>[]> = new Map();

  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const handlers = this.listeners.get(event) || [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
  }

  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

interface AppEvents {
  userLoggedIn: { userId: string; timestamp: number };
  userLoggedOut: { userId: string };
  dataUpdated: { id: string; data: any };
}

const emitter = new EventEmitter<AppEvents>();

emitter.on("userLoggedIn", (event) => {
  console.log(`User ${event.userId} logged in at ${event.timestamp}`);
});

emitter.emit("userLoggedIn", { userId: "123", timestamp: Date.now() });
```

### 5. 状态管理

```typescript
interface State<T> {
  get(): T;
  set(value: T): void;
  subscribe(listener: (value: T) => void): () => void;
}

class Store<T> implements State<T> {
  private state: T;
  private listeners: ((value: T) => void)[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  get(): T {
    return this.state;
  }

  set(value: T): void {
    this.state = value;
    this.notify();
  }

  subscribe(listener: (value: T) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

interface AppState {
  user: User | null;
  posts: Post[];
  isLoading: boolean;
}

const appStore = new Store<AppState>({
  user: null,
  posts: [],
  isLoading: false
});

appStore.subscribe((state) => {
  console.log("State changed:", state);
});
```

## 最佳实践

1. **使用有意义的泛型名称**：使用 T、U、V 等单字母名称或更具描述性的名称
2. **提供默认类型**：为泛型参数提供合理的默认类型
3. **使用泛型约束**：限制泛型的范围，提高类型安全性
4. **避免过度使用**：不要为了泛型而使用泛型
5. **文档化泛型**：为泛型参数添加清晰的文档注释
6. **使用工具类型**：充分利用 TypeScript 内置的工具类型
7. **保持简单**：复杂的泛型类型可能难以理解和维护
8. **测试泛型代码**：为泛型代码编写全面的测试
9. **考虑性能**：泛型可能会增加编译时间和运行时开销
10. **遵循约定**：遵循社区和框架的泛型使用约定

## 相关资源

- [TypeScript 泛型文档](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript 工具类型](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript 类型体操](https://github.com/type-challenges/type-challenges)
- [TypeScript 高级类型](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
