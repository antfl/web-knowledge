# TypeScript 装饰器

装饰器（Decorators）是一种特殊的声明，可以附加到类声明、方法、访问器、属性或参数上。装饰器使用 `@expression` 形式，expression 必须求值为一个函数，它会在运行时被调用，被装饰的声明信息作为参数传入。

## 目录

1. [装饰器简介](#装饰器简介)
2. [启用装饰器](#启用装饰器)
3. [类装饰器](#类装饰器)
4. [方法装饰器](#方法装饰器)
5. [访问器装饰器](#访问器装饰器)
6. [属性装饰器](#属性装饰器)
7. [参数装饰器](#参数装饰器)
8. [装饰器工厂](#装饰器工厂)
9. [装饰器组合](#装饰器组合)
10. [装饰器元数据](#装饰器元数据)
11. [实际应用场景](#实际应用场景)
12. [最佳实践](#最佳实践)

## 装饰器简介

装饰器是一种为类和类成员添加注解和元编程语法的方法。装饰器在 JavaScript 中目前还处于提案阶段，但在 TypeScript 中已经可以使用。

### 装饰器的特点

- **声明式**：使用 `@` 符号声明，代码更简洁
- **可组合**：多个装饰器可以叠加使用
- **元编程**：可以在运行时修改类的行为
- **AOP 支持**：支持面向切面编程

## 启用装饰器

在使用装饰器之前，需要在 `tsconfig.json` 中启用装饰器支持：

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 类装饰器

类装饰器应用于类构造函数，可以用来监视、修改或替换类定义。

### 基本语法

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 装饰器工厂

```typescript
function classDecorator<T extends { new(...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}

@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}
```

### 修改类构造函数

```typescript
function logged<T extends { new(...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    constructor(...args: any[]) {
      console.log(`Creating instance of ${constructor.name} with args:`, args);
      super(...args);
    }
  };
}

@logged
class User {
  constructor(public name: string, public age: number) {}
}

const user = new User("John", 30);
// 输出: Creating instance of User with args: ["John", 30]
```

## 方法装饰器

方法装饰器应用于方法的属性描述符，可以用来监视、修改或替换方法定义。

### 基本语法

```typescript
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 方法日志装饰器

```typescript
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} returned:`, result);
    return result;
  };
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }

  @log
  multiply(a: number, b: number): number {
    return a * b;
  }
}

const calc = new Calculator();
calc.add(5, 3);
// 输出: Calling add with args: [5, 3]
// 输出: add returned: 8
```

### 方法性能监控装饰器

```typescript
function measure(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

class DataProcessor {
  @measure
  processLargeData(data: any[]): any[] {
    return data.map(item => item * 2);
  }
}

const processor = new DataProcessor();
processor.processLargeData([1, 2, 3, 4, 5]);
```

## 访问器装饰器

访问器装饰器应用于访问器的属性描述符，可以用来监视、修改或替换访问器定义。

### 基本语法

```typescript
function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}

class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}
```

### 访问器验证装饰器

```typescript
function validateRange(min: number, max: number) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalSetter = descriptor.set;

    descriptor.set = function(value: number) {
      if (value < min || value > max) {
        throw new Error(`${propertyKey} must be between ${min} and ${max}`);
      }
      originalSetter?.call(this, value);
    };
  };
}

class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  @validateRange(-273.15, 1000)
  set celsius(value: number) {
    this._celsius = value;
  }

  get celsius(): number {
    return this._celsius;
  }
}

const temp = new Temperature(25);
temp.celsius = 30; // 正常
temp.celsius = -300; // 抛出错误
```

## 属性装饰器

属性装饰器应用于类的属性，可以用来监视、修改或替换属性定义。

### 基本语法

```typescript
function format(formatString: string) {
  return function(target: any, propertyKey: string): any {
    let value: string;

    const getter = function() {
      return `${formatString} ${value}`;
    };

    const setter = function(newVal: string) {
      value = newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

class Greeter {
  @format("Hello,")
  greeting: string;
}
```

### 只读属性装饰器

```typescript
function readonly(
  target: any,
  propertyKey: string,
  descriptor?: PropertyDescriptor
) {
  descriptor!.writable = false;
}

class User {
  constructor(public name: string) {}

  @readonly
  id: string = "123";
}

const user = new User("John");
user.id = "456"; // 报错：Cannot assign to 'id' because it is read-only
```

### 属性类型验证装饰器

```typescript
function typeValidator(expectedType: string) {
  return function(target: any, propertyKey: string) {
    let value: any;

    const getter = function() {
      return value;
    };

    const setter = function(newVal: any) {
      if (typeof newVal !== expectedType) {
        throw new Error(`${propertyKey} must be of type ${expectedType}`);
      }
      value = newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

class Product {
  @typeValidator("string")
  name: string;

  @typeValidator("number")
  price: number;
}

const product = new Product();
product.name = "Laptop"; // 正常
product.price = 999.99; // 正常
product.price = "expensive"; // 抛出错误
```

## 参数装饰器

参数装饰器应用于函数参数，可以用来监视、修改或替换参数定义。

### 基本语法

```typescript
function required(
  target: any,
  propertyKey: string | symbol | undefined,
  parameterIndex: number
) {
  const existingRequiredParameters: number[] = Reflect.getOwnMetadata(
    "required",
    target,
    propertyKey!
  ) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    "required",
    existingRequiredParameters,
    target,
    propertyKey!
  );
}

function validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;
  descriptor.value = function() {
    const requiredParameters: number[] = Reflect.getOwnMetadata(
      "required",
      target,
      propertyKey
    ) || [];
    requiredParameters.forEach((parameterIndex) => {
      if (
        parameterIndex >= arguments.length ||
        arguments[parameterIndex] === undefined
      ) {
        throw new Error(`Parameter at position ${parameterIndex} is required`);
      }
    });
    return method.apply(this, arguments);
  };
}

class User {
  @validate
  greet(@required name: string, @required greeting: string) {
    return `${greeting}, ${name}!`;
  }
}

const user = new User();
user.greet("John", "Hello"); // 正常
user.greet("John"); // 抛出错误
```

### 参数类型检查装饰器

```typescript
function typeCheck(expectedType: string) {
  return function(
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) {
    Reflect.defineMetadata(
      `param_${parameterIndex}_type`,
      expectedType,
      target,
      propertyKey!
    );
  };
}

function validateTypes(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;
  descriptor.value = function(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const expectedType = Reflect.getMetadata(
        `param_${i}_type`,
        target,
        propertyKey
      );
      if (expectedType && typeof args[i] !== expectedType) {
        throw new Error(
          `Parameter ${i} must be of type ${expectedType}, got ${typeof args[i]}`
        );
      }
    }
    return method.apply(this, args);
  };
}

class Calculator {
  @validateTypes
  add(
    @typeCheck("number") a: number,
    @typeCheck("number") b: number
  ): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(5, 3); // 正常
calc.add("5", 3); // 抛出错误
```

## 装饰器工厂

装饰器工厂是一个返回装饰器函数的函数，允许你向装饰器传递参数。

### 基本用法

```typescript
function decoratorFactory(value: string) {
  return function(target: any) {
    console.log(`Decorator value: ${value}`);
  };
}

@decoratorFactory("Hello")
class MyClass {}
```

### 可配置装饰器

```typescript
function logMethod(prefix: string = "LOG") {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      console.log(`[${prefix}] Calling ${propertyKey}`);
      const result = originalMethod.apply(this, args);
      console.log(`[${prefix}] ${propertyKey} returned:`, result);
      return result;
    };
  };
}

class ApiService {
  @logMethod("API")
  fetchData(url: string) {
    return `Data from ${url}`;
  }

  @logMethod("DB")
  queryDatabase(query: string) {
    return `Results for ${query}`;
  }
}
```

## 装饰器组合

多个装饰器可以应用于同一个声明，它们会按照特定的顺序执行。

### 装饰器执行顺序

```typescript
function first() {
  console.log("first(): factory evaluated");
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("second(): called");
  };
}

class Example {
  @first()
  @second()
  method() {}
}

// 输出顺序:
// first(): factory evaluated
// second(): factory evaluated
// second(): called
// first(): called
```

### 实际应用示例

```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey}`);
    return originalMethod.apply(this, args);
  };
}

function measure(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

function cache(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const cache = new Map();

  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`Cache hit for ${propertyKey}`);
      return cache.get(key);
    }
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

class DataProcessor {
  @log
  @measure
  @cache
  expensiveOperation(n: number): number {
    console.log("Computing expensive operation...");
    return n * n;
  }
}

const processor = new DataProcessor();
processor.expensiveOperation(5); // 计算并缓存
processor.expensiveOperation(5); // 从缓存返回
```

## 装饰器元数据

装饰器可以使用 `reflect-metadata` 库来存储和检索元数据。

### 安装 reflect-metadata

```bash
npm install reflect-metadata
```

### 使用元数据

```typescript
import "reflect-metadata";

function setMetadata(metadataKey: string, metadataValue: any) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  };
}

function getMetadata(metadataKey: string) {
  return function(target: any, propertyKey: string) {
    const metadata = Reflect.getMetadata(metadataKey, target, propertyKey);
    console.log(`${propertyKey} metadata:`, metadata);
  };
}

class Example {
  @setMetadata("description", "This is a sample method")
  @getMetadata("description")
  sampleMethod() {
    return "Hello";
  }
}

const example = new Example();
example.sampleMethod();
// 输出: sampleMethod metadata: This is a sample method
```

### 路由元数据示例

```typescript
import "reflect-metadata";

const ROUTE_METADATA_KEY = Symbol("route");

interface RouteMetadata {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
}

function Route(path: string, method: "GET" | "POST" | "PUT" | "DELETE") {
  return function(target: any, propertyKey: string) {
    const metadata: RouteMetadata = { path, method };
    Reflect.defineMetadata(ROUTE_METADATA_KEY, metadata, target, propertyKey);
  };
}

function getRoutes(target: any) {
  const routes: { [key: string]: RouteMetadata } = {};
  const prototype = target.prototype;

  for (const propertyKey of Object.getOwnPropertyNames(prototype)) {
    const metadata = Reflect.getMetadata(
      ROUTE_METADATA_KEY,
      prototype,
      propertyKey
    );
    if (metadata) {
      routes[propertyKey] = metadata;
    }
  }

  return routes;
}

class UserController {
  @Route("/users", "GET")
  getUsers() {
    return [];
  }

  @Route("/users/:id", "GET")
  getUser(id: string) {
    return { id };
  }

  @Route("/users", "POST")
  createUser(user: any) {
    return user;
  }
}

console.log(getRoutes(UserController));
// 输出: {
//   getUsers: { path: '/users', method: 'GET' },
//   getUser: { path: '/users/:id', method: 'GET' },
//   createUser: { path: '/users', method: 'POST' }
// }
```

## 实际应用场景

### 1. 日志记录

```typescript
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`[${new Date().toISOString()}] ${propertyKey} called with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`[${new Date().toISOString()}] ${propertyKey} returned:`, result);
    return result;
  };
}

class UserService {
  @log
  getUser(id: string) {
    return { id, name: "John Doe" };
  }
}
```

### 2. 权限验证

```typescript
function requirePermission(permission: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const userPermissions = (this as any).getUserPermissions();
      if (!userPermissions.includes(permission)) {
        throw new Error(`Permission ${permission} required`);
      }
      return originalMethod.apply(this, args);
    };
  };
}

class AdminService {
  private permissions: string[] = ["read", "write"];

  getUserPermissions() {
    return this.permissions;
  }

  @requirePermission("admin")
  deleteUser(id: string) {
    console.log(`User ${id} deleted`);
  }
}
```

### 3. 缓存

```typescript
function cache(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const cache = new Map();

  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

class DataService {
  @cache
  fetchData(id: string) {
    console.log(`Fetching data for ${id}`);
    return { id, data: `Data for ${id}` };
  }
}
```

### 4. 防抖和节流

```typescript
function debounce(delay: number) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    let timeoutId: any;

    descriptor.value = function(...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };
  };
}

function throttle(delay: number) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    let lastCall = 0;

    descriptor.value = function(...args: any[]) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return originalMethod.apply(this, args);
      }
    };
  };
}

class SearchComponent {
  @debounce(300)
  search(query: string) {
    console.log(`Searching for: ${query}`);
  }

  @throttle(1000)
  handleScroll() {
    console.log("Scroll handled");
  }
}
```

### 5. 依赖注入

```typescript
const ServiceMetadata = Symbol("Service");

function Injectable(serviceIdentifier: string) {
  return function(target: any) {
    Reflect.defineMetadata(ServiceMetadata, serviceIdentifier, target);
  };
}

class Container {
  private services: Map<string, any> = new Map();

  register<T>(identifier: string, implementation: new () => T): void {
    this.services.set(identifier, new implementation());
  }

  resolve<T>(identifier: string): T {
    return this.services.get(identifier);
  }
}

@Injectable("Logger")
class Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
}

@Injectable("Database")
class Database {
  constructor(private logger: Logger) {}

  query(sql: string) {
    this.logger.log(`Executing: ${sql}`);
    return [];
  }
}

const container = new Container();
container.register("Logger", Logger);
container.register("Database", Database);

const db = container.resolve<Database>("Database");
db.query("SELECT * FROM users");
```

## 最佳实践

1. **保持装饰器简单**：每个装饰器应该只做一件事
2. **使用装饰器工厂**：通过工厂函数传递参数，提高灵活性
3. **文档化装饰器**：为装饰器添加清晰的文档说明
4. **考虑性能影响**：装饰器会增加运行时开销，谨慎使用
5. **组合装饰器**：通过组合多个简单装饰器实现复杂功能
6. **错误处理**：在装饰器中添加适当的错误处理
7. **类型安全**：使用 TypeScript 类型系统确保装饰器的类型安全
8. **避免过度使用**：不要为了装饰器而使用装饰器
9. **测试装饰器**：为装饰器编写单元测试
10. **遵循约定**：遵循社区和框架的装饰器使用约定

## 相关资源

- [TypeScript 装饰器文档](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [ECMAScript 装饰器提案](https://github.com/tc39/proposal-decorators)
- [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
- [NestJS 装饰器](https://docs.nestjs.com/custom-decorators)
