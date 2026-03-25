# TypeScript 基础知识

TypeScript 是 JavaScript 的超集，添加了静态类型检查和其他特性。本模块介绍 TypeScript 的基础概念和语法。

## 目录

1. [基本类型](#基本类型)
2. [变量声明](#变量声明)
3. [函数](#函数)
4. [接口](#接口)
5. [类](#类)
6. [枚举](#枚举)
7. [类型推断](#类型推断)
8. [类型断言](#类型断言)
9. [模块](#模块)
10. [命名空间](#命名空间)

## 基本类型

### 原始类型

TypeScript 支持以下原始类型：

- `string` - 字符串
- `number` - 数字（整数和浮点数）
- `boolean` - 布尔值
- `null` - 空值
- `undefined` - 未定义
- `symbol` - 符号
- `bigint` - 大整数

```typescript
let username: string = "John Doe";
let age: number = 30;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;
let uniqueId: symbol = Symbol("id");
let bigNumber: bigint = 9007199254740991n;
```

### 数组类型

```typescript
// 类型后接 []
let numbers: number[] = [1, 2, 3, 4, 5];

// 使用数组泛型
let strings: Array<string> = ["hello", "world"];

// 只读数组
let readonlyNumbers: ReadonlyArray<number> = [1, 2, 3];
```

### 元组类型

元组允许表示一个已知元素数量和类型的数组：

```typescript
let tuple: [string, number] = ["hello", 42];

// 可选元素
let optionalTuple: [string, number, boolean?] = ["hello", 42];

// 剩余元素
let restTuple: [string, ...number[]] = ["hello", 1, 2, 3];
```

### 对象类型

```typescript
let user: {
  name: string;
  age: number;
  email?: string; // 可选属性
  readonly id: number; // 只读属性
} = {
  name: "John",
  age: 30,
  id: 1
};
```

### 联合类型

```typescript
let value: string | number = "hello";
value = 42; // 可以重新赋值为数字
```

### 交叉类型

```typescript
type Person = {
  name: string;
};

type Employee = {
  id: number;
};

type PersonEmployee = Person & Employee;

const personEmployee: PersonEmployee = {
  name: "John",
  id: 1
};
```

### 字面量类型

```typescript
let direction: "up" | "down" | "left" | "right" = "up";
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 6;
let success: true | false = true;
```

### any 和 unknown

```typescript
// any - 可以赋值给任何类型，绕过类型检查
let anything: any = 42;
anything = "hello";
anything = { name: "John" };

// unknown - 类型安全的 any
let unknownValue: unknown = 42;
if (typeof unknownValue === "number") {
  console.log(unknownValue.toFixed(2));
}

// void - 表示没有返回值
function logMessage(message: string): void {
  console.log(message);
}

// never - 表示永不存在的值
function throwError(message: string): never {
  throw new Error(message);
}
```

## 变量声明

### var、let、const

```typescript
// var - 函数作用域，可重复声明
var x = 10;

// let - 块作用域，不可重复声明
let y = 20;

// const - 块作用域，不可重新赋值
const z = 30;
```

### 解构赋值

```typescript
// 数组解构
let [first, second, ...rest] = [1, 2, 3, 4, 5];

// 对象解构
let { name, age, ...otherProps } = {
  name: "John",
  age: 30,
  email: "john@example.com",
  city: "New York"
};

// 函数参数解构
function greet({ name, age }: { name: string; age: number }) {
  console.log(`Hello ${name}, you are ${age} years old`);
}
```

### 展开运算符

```typescript
// 数组展开
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5, 6];

// 对象展开
let obj1 = { a: 1, b: 2 };
let obj2 = { ...obj1, c: 3 };
```

## 函数

### 函数声明

```typescript
// 命名函数
function add(a: number, b: number): number {
  return a + b;
}

// 匿名函数
const multiply = function(a: number, b: number): number {
  return a * b;
};

// 箭头函数
const divide = (a: number, b: number): number => a / b;
```

### 函数类型

```typescript
// 定义函数类型
type MathOperation = (a: number, b: number) => number;

const subtract: MathOperation = (a, b) => a - b;

// 使用接口定义函数类型
interface StringOperation {
  (input: string): string;
}

const toUpperCase: StringOperation = (input) => input.toUpperCase();
```

### 可选参数和默认参数

```typescript
// 可选参数
function greet(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}!` : `Hello, ${name}!`;
}

// 默认参数
function createPerson(name: string, age: number = 30): { name: string; age: number } {
  return { name, age };
}
```

### 剩余参数

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15
```

### 函数重载

```typescript
function processInput(input: string): string;
function processInput(input: number): number;
function processInput(input: string | number): string | number {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input * 2;
}
```

### 泛型函数

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let result1 = identity<string>("hello");
let result2 = identity(42); // 类型推断
```

## 接口

### 基本接口

```typescript
interface Person {
  name: string;
  age: number;
}

function greetPerson(person: Person): void {
  console.log(`Hello ${person.name}, you are ${person.age} years old`);
}
```

### 可选属性

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // 可选属性
}
```

### 只读属性

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
// point.x = 20; // 错误：无法分配到 "x"，因为它是只读属性
```

### 函数类型接口

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = (source, subString) => {
  return source.indexOf(subString) > -1;
};
```

### 可索引类型

```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray = ["hello", "world"];

interface StringMap {
  [key: string]: string;
}

let myMap: StringMap = {
  name: "John",
  email: "john@example.com"
};
```

### 类类型接口

```typescript
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
}
```

### 接口继承

```typescript
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square: Square = {
  color: "red",
  sideLength: 10
};
```

### 混合类型接口

```typescript
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

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
```

## 类

### 基本类

```typescript
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hello, my name is ${this.name}`;
  }
}

const person = new Person("John", 30);
console.log(person.greet());
```

### 访问修饰符

```typescript
class Employee {
  public name: string; // 默认，可以在任何地方访问
  private salary: number; // 只能在类内部访问
  protected department: string; // 可以在类和子类中访问
  readonly id: number; // 只读属性

  constructor(name: string, salary: number, department: string, id: number) {
    this.name = name;
    this.salary = salary;
    this.department = department;
    this.id = id;
  }

  getSalary(): number {
    return this.salary;
  }
}
```

### 参数属性

```typescript
class Product {
  constructor(
    public name: string,
    private price: number,
    protected category: string
  ) {
    // TypeScript 自动创建属性并赋值
  }
}

const product = new Product("Laptop", 999.99, "Electronics");
console.log(product.name); // "Laptop"
```

### 只读属性

```typescript
class Circle {
  readonly radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}
```

### 存取器

```typescript
class Temperature {
  private _celsius: number = 0;

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    this._celsius = value;
  }

  get fahrenheit(): number {
    return (this._celsius * 9 / 5) + 32;
  }

  set fahrenheit(value: number) {
    this._celsius = (value - 32) * 5 / 9;
  }
}

const temp = new Temperature();
temp.celsius = 25;
console.log(temp.fahrenheit); // 77
```

### 静态属性和方法

```typescript
class Calculator {
  static PI = 3.14159;

  static add(a: number, b: number): number {
    return a + b;
  }

  static multiply(a: number, b: number): number {
    return a * b;
  }
}

console.log(Calculator.PI); // 3.14159
console.log(Calculator.add(5, 3)); // 8
```

### 抽象类

```typescript
abstract class Animal {
  abstract makeSound(): void;

  move(): void {
    console.log("Moving...");
  }
}

class Dog extends Animal {
  makeSound(): void {
    console.log("Woof!");
  }
}

const dog = new Dog();
dog.makeSound(); // "Woof!"
dog.move(); // "Moving..."
```

### 类继承

```typescript
class Vehicle {
  constructor(protected brand: string) {}

  start(): void {
    console.log(`${this.brand} vehicle started`);
  }
}

class Car extends Vehicle {
  constructor(brand: string, private model: string) {
    super(brand);
  }

  start(): void {
    console.log(`${this.brand} ${this.model} car started`);
  }

  drive(): void {
    console.log("Driving the car");
  }
}

const car = new Car("Toyota", "Camry");
car.start(); // "Toyota Camry car started"
car.drive(); // "Driving the car"
```

### 实现接口

```typescript
interface Printable {
  print(): void;
}

class Document implements Printable {
  constructor(private content: string) {}

  print(): void {
    console.log(this.content);
  }
}

const doc = new Document("Hello, World!");
doc.print(); // "Hello, World!"
```

## 枚举

### 数字枚举

```typescript
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

let dir: Direction = Direction.Up;

// 自定义初始值
enum StatusCode {
  Success = 200,
  NotFound = 404,
  ServerError = 500
}
```

### 字符串枚举

```typescript
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue"
}

let color: Color = Color.Red;
```

### 异构枚举

```typescript
enum MixedEnum {
  No = 0,
  Yes = "YES"
}
```

### 常量枚举

```typescript
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

let directions = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right
];
```

### 计算和常量成员

```typescript
enum FileAccess {
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  G = "123".length
}
```

## 类型推断

TypeScript 能够根据值的类型自动推断变量的类型：

```typescript
// 变量类型推断
let x = 3; // 推断为 number
let y = "hello"; // 推断为 string

// 数组类型推断
let numbers = [1, 2, 3]; // 推断为 number[]
let mixed = [1, "hello", true]; // 推断为 (string | number | boolean)[]

// 函数返回类型推断
function add(a: number, b: number) {
  return a + b; // 推断返回类型为 number
}

// 最佳通用类型推断
let zoo = [new Rhino(), new Elephant(), new Snake()];
// 推断为 (Rhino | Elephant | Snake)[]
```

## 类型断言

类型断言允许你覆盖 TypeScript 的类型推断：

```typescript
// 尖括号语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// as 语法（在 JSX 中更常用）
let anotherValue: any = "this is also a string";
let anotherStrLength: number = (anotherValue as string).length;

// 非空断言
function processValue(value: string | null | undefined) {
  console.log(value!.length); // 告诉 TypeScript value 不是 null 或 undefined
}
```

## 模块

TypeScript 支持 ES6 模块语法：

### 导出

```typescript
// utils.ts
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export class Calculator {
  multiply(a: number, b: number): number {
    return a * b;
  }
}

// 默认导出
export default function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

### 导入

```typescript
// main.ts
import greet, { PI, add, Calculator } from './utils';

console.log(PI); // 3.14159
console.log(add(5, 3)); // 8

const calc = new Calculator();
console.log(calc.multiply(4, 3)); // 12

console.log(greet("John")); // "Hello, John!"
```

### 重命名导入

```typescript
import { add as sum } from './utils';
console.log(sum(5, 3)); // 8
```

### 命名空间导入

```typescript
import * as Utils from './utils';
console.log(Utils.PI); // 3.14159
```

## 命名空间

命名空间是 TypeScript 中组织代码的一种方式：

```typescript
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

// 使用命名空间
console.log(MyNamespace.PI); // 3.14159
console.log(MyNamespace.add(5, 3)); // 8

const calc = new MyNamespace.Calculator();
console.log(calc.multiply(4, 3)); // 12
```

### 嵌套命名空间

```typescript
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
```

## 最佳实践

1. **使用类型注解**：在函数参数和返回值上使用类型注解
2. **避免使用 any**：使用 unknown 替代 any，或者使用更具体的类型
3. **使用接口定义对象结构**：接口提供更好的类型检查和文档
4. **使用枚举代替魔法数字**：提高代码可读性
5. **利用类型推断**：让 TypeScript 自动推断类型，减少冗余
6. **使用模块而不是命名空间**：现代 TypeScript 项目推荐使用模块
7. **启用严格模式**：在 tsconfig.json 中启用 strict 选项
8. **使用 readonly 修饰符**：防止意外修改
9. **使用泛型提高代码复用性**：编写更通用的代码
10. **保持代码简洁**：避免过度使用高级特性

## 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript 深入理解](https://basarat.gitbook.io/typescript/)
- [TypeScript 类型体操](https://github.com/type-challenges/type-challenges)
