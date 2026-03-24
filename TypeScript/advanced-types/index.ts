// TypeScript 高级类型示例

// 1. 类型别名
type UserId = string | number;

type User = {
  id: UserId;
  name: string;
  email: string;
};

type Callback = (error: Error | null, result: any) => void;

type Container<T> = {
  value: T;
};

// 2. 接口继承
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
  position: string;
}

interface Manager extends Employee {
  department: string;
  subordinates: Employee[];
}

// 3. 交叉类型
interface TypeA {
  a: string;
}

interface TypeB {
  b: number;
}

type TypeC = TypeA & TypeB;

const typeC: TypeC = {
  a: "hello",
  b: 42
};

// 4. 联合类型
type Status = "active" | "inactive" | "pending";

type Result = {
  success: true;
  data: any;
} | {
  success: false;
  error: string;
};

function processValue(value: string | number | boolean) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else if (typeof value === "number") {
    console.log(value.toFixed(2));
  } else {
    console.log(value ? "true" : "false");
  }
}

// 5. 字面量类型
type Direction = "up" | "down" | "left" | "right";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type BooleanLiteral = true | false;

type AppConfig = {
  mode: "development" | "production";
  port: 3000 | 4000 | 5000;
  debug: true | false;
};

// 6. 类型守卫
function isString(value: any): value is string {
  return typeof value === "string";
}

function isNumber(value: any): value is number {
  return typeof value === "number";
}

function processValueWithGuard(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase());
  } else if (isNumber(value)) {
    console.log(value.toFixed(2));
  }
}

class Animal {
  move() {
    console.log("Moving...");
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}

function processAnimal(animal: Animal) {
  if (animal instanceof Dog) {
    animal.bark();
  }
  animal.move();
}

// 7. 类型断言
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

let anotherValue: any = "this is also a string";
let anotherStrLength: number = (anotherValue as string).length;

function processNullableValue(value: string | null | undefined) {
  console.log(value!.length);
}

// 8. 映射类型
type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K];
};

type PartialPerson = {
  [K in keyof Person]?: Person[K];
};

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullablePersonType = Nullable<Person>;

// 9. 条件类型
type IsString<T> = T extends string ? true : false;

type TestA = IsString<string>; // true
type TestB = IsString<number>; // false

type ExtractType<T, U> = T extends U ? T : never;

type TestC = ExtractType<string | number | boolean, number | boolean>; // number | boolean

type Flatten<T> = T extends Array<infer U> ? U : T;

type TestD = Flatten<string[]>; // string
type TestE = Flatten<number>; // number

// 10. 推断类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function add(a: number, b: number): number {
  return a + b;
}

type AddReturnType = ReturnType<typeof add>; // number

type ElementType<T> = T extends Array<infer E> ? E : never;

type ArrayElement = ElementType<string[]>; // string

type Parameters<T> = T extends (...args: infer P) => any ? P : never;

type AddParameters = Parameters<typeof add>; // [number, number]

// 11. 模板字面量类型
type Greeting = `Hello, ${string}!`;
type Position = `${Direction}-position`;
type EventName<T extends string> = `${T}Event`;
type ClickEvent = EventName<"click">; // "clickEvent"
type PathParam<T extends string> = `:${T}`;
type ApiPath = `/api/users/${PathParam<"id">}`; // "/api/users/:id"

// 12. 递归类型
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

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
type PartialUser = Partial<User>;
type RequiredUser = Required<PartialUser>;
type ReadonlyUser = Readonly<User>;
type UserInfo = Pick<User, "name" | "email">;
type UserWithoutAge = Omit<User, "age">;
type UserMap = Record<string, User>;

type Primitive = string | number | boolean | null | undefined;
type NonNullPrimitive = Exclude<Primitive, null | undefined>;
type StringOrNumber = Extract<Primitive, string | number>;
type NotNullUser = NonNullable<User | null | undefined>;

// 14. 高级泛型
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

class Cat extends Animal {
  meow(): void {
    console.log("Meow!");
  }
}

type AnimalType<T> = T extends Dog ? "dog" : T extends Cat ? "cat" : "animal";

type DogType = AnimalType<Dog>; // "dog"
type CatType = AnimalType<Cat>; // "cat"
type AnimalType2 = AnimalType<Animal>; // "animal"

type NestedArray = Flatten<number[][]>; // number

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
