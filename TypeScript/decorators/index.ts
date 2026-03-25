// TypeScript 装饰器示例
import 'reflect-metadata';

// 注意：要在 tsconfig.json 中启用装饰器：
// {
//   "compilerOptions": {
//     "target": "ES5",
//     "experimentalDecorators": true,
//     "emitDecoratorMetadata": true
//   }
// }

// 1. 类装饰器

/**
 * 密封装饰器
 * @description 一个类装饰器，用于密封类及其原型
 * 密封后不能向类添加新属性或方法
 * 
 * @param constructor - 类的构造函数
 * 
 * @example
 * @sealed
 * class Greeter {
 *   greeting: string;
 *   constructor(message: string) {
 *     this.greeting = message;
 *   }
 *   greet() {
 *     return "Hello, " + this.greeting;
 *   }
 * }
 * 
 * Object.isSealed(Greeter); // true
 * Object.isSealed(Greeter.prototype); // true
 */
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

/**
 * 问候类
 * @description 使用 @sealed 装饰器的类
 * 
 * @property greeting - 问候语
 * @method greet - 问候方法
 * 
 * @example
 * const greeter = new Greeter("World");
 * greeter.greet(); // "Hello, World"
 */
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

/**
 * 日志装饰器工厂
 * @description 一个类装饰器工厂，用于记录类的实例化
 * 装饰器工厂是一个返回装饰器的函数，可以接受参数
 * 
 * @template T - 类的类型
 * @param constructor - 类的构造函数
 * @returns 一个新的类，继承自原类，在构造时记录日志
 * 
 * @example
 * @logged
 * class User {
 *   constructor(public name: string, public age: number) {}
 * }
 * 
 * const user = new User("John", 30);
 * // 输出: Creating instance of User with args: ["John", 30]
 */
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

/**
 * 用户类
 * @description 使用 @logged 装饰器的类
 * 
 * @property name - 用户名
 * @property age - 用户年龄
 * 
 * @example
 * const user = new User("John", 30);
 * // 输出: Creating instance of User with args: ["John", 30]
 */
@logged
class User {
  constructor(public name: string, public age: number) {}
}

// 2. 方法装饰器

/**
 * 可枚举装饰器工厂
 * @description 一个方法装饰器工厂，用于控制方法是否可枚举
 * 
 * @param value - 是否可枚举，true 或 false
 * @returns 方法装饰器
 * 
 * @example
 * class MyClass {
 *   @enumerable(false)
 *   myMethod() {}
 * }
 * 
 * const obj = new MyClass();
 * for (let key in obj) {
 *   console.log(key); // 不会输出 myMethod
 * }
 */
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

/**
 * 日志装饰器
 * @description 一个方法装饰器，用于记录方法的调用
 * 在方法调用前后记录参数和返回值
 * 
 * @param target - 类的原型对象
 * @param propertyKey - 方法的名称
 * @param descriptor - 方法的属性描述符
 * 
 * @example
 * class Calculator {
 *   @log
 *   add(a: number, b: number): number {
 *     return a + b;
 *   }
 * }
 * 
 * const calc = new Calculator();
 * calc.add(5, 3);
 * // 输出:
 * // Calling add with args: [5, 3]
 * // add returned: 8
 */
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

/**
 * 性能测量装饰器
 * @description 一个方法装饰器，用于测量方法的执行时间
 * 
 * @param target - 类的原型对象
 * @param propertyKey - 方法的名称
 * @param descriptor - 方法的属性描述符
 * 
 * @example
 * class Calculator {
 *   @measure
 *   processLargeData(data: any[]): any[] {
 *     return data.map(item => item * 2);
 *   }
 * }
 * 
 * const calc = new Calculator();
 * calc.processLargeData([1, 2, 3, 4, 5]);
 * // 输出: processLargeData took 0.12ms
 */
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

/**
 * 计算器类
 * @description 演示方法装饰器的使用
 * 
 * @method add - 使用 @log 装饰器的加法方法
 * @method multiply - 使用 @log 装饰器的乘法方法
 * @method processLargeData - 使用 @measure 装饰器的数据处理方法
 * 
 * @example
 * const calc = new Calculator();
 * calc.add(5, 3); // 输出日志
 * calc.multiply(4, 3); // 输出日志
 * calc.processLargeData([1, 2, 3, 4, 5]); // 输出执行时间
 */
class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }

  @log
  multiply(a: number, b: number): number {
    return a * b;
  }

  @measure
  processLargeData(data: any[]): any[] {
    return data.map(item => item * 2);
  }
}

// 3. 访问器装饰器

/**
 * 可配置装饰器工厂
 * @description 一个访问器装饰器工厂，用于控制访问器是否可配置
 * 
 * @param value - 是否可配置，true 或 false
 * @returns 访问器装饰器
 * 
 * @example
 * class MyClass {
 *   private _value: number;
 *   
 *   @configurable(false)
 *   get value(): number {
 *     return this._value;
 *   }
 * }
 */
function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}

/**
 * 验证范围装饰器工厂
 * @description 一个访问器装饰器工厂，用于验证 setter 的值是否在指定范围内
 * 
 * @param min - 最小值
 * @param max - 最大值
 * @returns 访问器装饰器
 * 
 * @example
 * class Temperature {
 *   private _celsius: number;
 *   
 *   @validateRange(-273.15, 1000)
 *   set celsius(value: number) {
 *     this._celsius = value;
 *   }
 * }
 * 
 * const temp = new Temperature();
 * temp.celsius = 25; // ✅ 有效
 * temp.celsius = -300; // ❌ 抛出错误：celsius must be between -273.15 and 1000
 */
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

/**
 * 温度类
 * @description 演示访问器装饰器的使用
 * 
 * @property _celsius - 私有属性，存储摄氏度温度
 * @property celsius - getter 和 setter，使用 @validateRange 装饰器
 * 
 * @example
 * const temp = new Temperature(25);
 * temp.celsius = 30; // ✅ 有效
 * temp.celsius = -300; // ❌ 抛出错误
 */
class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  get celsius(): number {
    return this._celsius;
  }

  @validateRange(-273.15, 1000)
  set celsius(value: number) {
    this._celsius = value;
  }
}

// 4. 属性装饰器

/**
 * 只读装饰器
 * @description 一个属性装饰器，用于将属性设置为只读
 * 
 * @param target - 类的原型对象
 * @param propertyKey - 属性的名称
 * @param descriptor - 属性的描述符（对于属性装饰器，这个参数通常是 undefined）
 * 
 * @example
 * class Product {
 *   @readonly
 *   id: string = "123";
 * }
 * 
 * const product = new Product();
 * product.id = "456"; // ❌ 错误：不能修改只读属性
 */
function readonly(
  target: any,
  propertyKey: string,
  descriptor?: PropertyDescriptor
) {
  descriptor!.writable = false;
}

/**
 * 类型验证装饰器工厂
 * @description 一个属性装饰器工厂，用于验证属性值的类型
 * 
 * @param expectedType - 期望的类型名称（如 "string", "number" 等）
 * @returns 属性装饰器
 * 
 * @example
 * class Product {
 *   @typeValidator("string")
 *   name: string = "";
 *   
 *   @typeValidator("number")
 *   price: number = 0;
 * }
 * 
 * const product = new Product();
 * product.name = "Laptop"; // ✅ 有效
 * product.price = 999.99; // ✅ 有效
 * product.price = "expensive"; // ❌ 抛出错误：price must be of type number
 */
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

/**
 * 产品类
 * @description 演示属性装饰器的使用
 * 
 * @property id - 只读属性，使用 @readonly 装饰器
 * @property name - 字符串属性，使用 @typeValidator 装饰器
 * @property price - 数字属性，使用 @typeValidator 装饰器
 * 
 * @example
 * const product = new Product();
 * product.id = "456"; // ❌ 错误：不能修改只读属性
 * product.name = "Laptop"; // ✅ 有效
 * product.price = 999.99; // ✅ 有效
 * product.price = "expensive"; // ❌ 抛出错误
 */
class Product {
  @readonly
  id: string = "123";

  @typeValidator("string")
  name: string = "";

  @typeValidator("number")
  price: number = 0;
}

// 5. 参数装饰器

/**
 * 必需参数装饰器
 * @description 一个参数装饰器，用于标记参数为必需
 * 使用 reflect-metadata 库存储必需参数的索引
 * 
 * @param target - 类的原型对象
 * @param propertyKey - 方法或构造函数的名称
 * @param parameterIndex - 参数的索引
 * 
 * @example
 * class UserService {
 *   @validate
 *   greet(@required name: string, @required greeting: string) {
 *     return `${greeting}, ${name}!`;
 *   }
 * }
 * 
 * const service = new UserService();
 * service.greet("John"); // ❌ 抛出错误：Parameter at position 1 is required
 * service.greet("John", "Hello"); // ✅ 有效
 */
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

/**
 * 验证装饰器
 * @description 一个方法装饰器，用于验证必需参数
 * 在方法调用前检查所有必需参数是否已提供
 * 
 * @param target - 类的原型对象
 * @param propertyKey - 方法的名称
 * @param descriptor - 方法的属性描述符
 * 
 * @example
 * class UserService {
 *   @validate
 *   greet(@required name: string, @required greeting: string) {
 *     return `${greeting}, ${name}!`;
 *   }
 * }
 * 
 * const service = new UserService();
 * service.greet("John", "Hello"); // ✅ 有效
 */
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

/**
 * 类型检查装饰器工厂
 * @description 一个参数装饰器工厂，用于验证参数的类型
 * 使用 reflect-metadata 库存储参数的期望类型
 * 
 * @param expectedType - 期望的类型名称（如 "number", "string" 等）
 * @returns 参数装饰器
 * 
 * @example
 * class UserService {
 *   @validateTypes
 *   add(
 *     @typeCheck("number") a: number,
 *     @typeCheck("number") b: number
 *   ): number {
 *     return a + b;
 *   }
 * }
 * 
 * const service = new UserService();
 * service.add(5, 3); // ✅ 有效
 * service.add("5", 3); // ❌ 抛出错误：Parameter 0 must be of type number, got string
 */
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

/**
 * 验证类型装饰器
 * @description 一个方法装饰器，用于验证参数的类型
 * 在方法调用前检查所有参数的类型是否正确
 * 
 * @param target - 类的原型对象
 * @param propertyKey - 方法的名称
 * @param descriptor - 方法的属性描述符
 * 
 * @example
 * class UserService {
 *   @validateTypes
 *   add(
 *     @typeCheck("number") a: number,
 *     @typeCheck("number") b: number
 *   ): number {
 *     return a + b;
 *   }
 * }
 * 
 * const service = new UserService();
 * service.add(5, 3); // ✅ 有效
 */
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

/**
 * 用户服务类
 * @description 演示参数装饰器的使用
 * 
 * @method greet - 使用 @validate 和 @required 装饰器的方法
 * @method add - 使用 @validateTypes 和 @typeCheck 装饰器的方法
 * 
 * @example
 * const userService = new UserService();
 * userService.greet("John", "Hello"); // ✅ 有效
 * userService.add(5, 3); // ✅ 有效
 * userService.add("5", 3); // ❌ 抛出错误
 */
class UserService {
  @validate
  greet(@required name: string, @required greeting: string) {
    return `${greeting}, ${name}!`;
  }

  @validateTypes
  add(
    @typeCheck("number") a: number,
    @typeCheck("number") b: number
  ): number {
    return a + b;
  }
}

// 6. 装饰器工厂

/**
 * 日志方法装饰器工厂
 * @description 一个方法装饰器工厂，用于记录方法的调用
 * 装饰器工厂允许我们传递参数给装饰器
 * 
 * @param prefix - 日志前缀，默认值为 "LOG"
 * @returns 方法装饰器
 * 
 * @example
 * class ApiService {
 *   @logMethod("API")
 *   fetchData(url: string) {
 *     return `Data from ${url}`;
 *   }
 * }
 * 
 * const api = new ApiService();
 * api.fetchData("https://api.example.com");
 * // 输出:
 * // [API] Calling fetchData
 * // [API] fetchData returned: Data from https://api.example.com
 */
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

/**
 * API 服务类
 * @description 演示装饰器工厂的使用
 * 
 * @method fetchData - 使用 @logMethod("API") 装饰器的方法
 * @method queryDatabase - 使用 @logMethod("DB") 装饰器的方法
 * 
 * @example
 * const apiService = new ApiService();
 * apiService.fetchData("https://api.example.com");
 * // 输出: [API] Calling fetchData
 * // 输出: [API] fetchData returned: Data from https://api.example.com
 * 
 * apiService.queryDatabase("SELECT * FROM users");
 * // 输出: [DB] Calling queryDatabase
 * // 输出: [DB] queryDatabase returned: Results for SELECT * FROM users
 */
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

// 7. 装饰器组合

/**
 * 缓存装饰器
 * @description 一个方法装饰器，用于缓存方法的结果
 * 避免重复计算相同的参数
 * 
 * @param target - 类的原型对象
 * @param propertyKey - 方法的名称
 * @param descriptor - 方法的属性描述符
 * 
 * @example
 * class DataProcessor {
 *   @cache
 *   expensiveOperation(n: number): number {
 *     console.log("Computing expensive operation...");
 *     return n * n;
 *   }
 * }
 * 
 * const processor = new DataProcessor();
 * processor.expensiveOperation(5); // 输出: Computing expensive operation...
 * processor.expensiveOperation(5); // 输出: Cache hit for expensiveOperation
 */
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

/**
 * 数据处理器类
 * @description 演示装饰器组合的使用
 * 多个装饰器可以叠加使用，从下到上执行
 * 
 * @method expensiveOperation - 使用 @log、@measure 和 @cache 装饰器的方法
 * 
 * @example
 * const processor = new DataProcessor();
 * processor.expensiveOperation(5);
 * // 第一次调用会执行计算
 * processor.expensiveOperation(5);
 * // 第二次调用会从缓存中读取
 */
class DataProcessor {
  @log
  @measure
  @cache
  expensiveOperation(n: number): number {
    console.log("Computing expensive operation...");
    return n * n;
  }
}

// 8. 实际应用场景

// 日志记录装饰器

/**
 * 带时间戳的日志装饰器
 * @description 一个方法装饰器，用于记录方法调用的时间和参数
 * 在日志中包含时间戳，便于调试和追踪
 * 
 * @param target - 类的原型对象
 * @param propertyKey - 方法的名称
 * @param descriptor - 方法的属性描述符
 * 
 * @example
 * class LoggingService {
 *   @logWithTimestamp
 *   getUser(id: string) {
 *     return { id, name: "John Doe" };
 *   }
 * }
 * 
 * const service = new LoggingService();
 * service.getUser("123");
 * // 输出: [2024-01-01T12:00:00.000Z] getUser called with: ["123"]
 * // 输出: [2024-01-01T12:00:00.001Z] getUser returned: { id: "123", name: "John Doe" }
 */
function logWithTimestamp(
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

/**
 * 日志服务类
 * @description 演示日志记录装饰器的使用
 * 
 * @method getUser - 使用 @logWithTimestamp 装饰器的方法
 * 
 * @example
 * const loggingService = new LoggingService();
 * loggingService.getUser("123");
 * // 输出带有时间戳的日志
 */
class LoggingService {
  @logWithTimestamp
  getUser(id: string) {
    return { id, name: "John Doe" };
  }
}

// 权限验证装饰器

/**
 * 需要权限装饰器工厂
 * @description 一个方法装饰器工厂，用于验证用户权限
 * 在方法执行前检查用户是否具有所需的权限
 * 
 * @param permission - 所需的权限名称
 * @returns 方法装饰器
 * 
 * @example
 * class AdminService {
 *   private permissions: string[] = ["read", "write"];
 *   
 *   getUserPermissions() {
 *     return this.permissions;
 *   }
 *   
 *   @requirePermission("admin")
 *   deleteUser(id: string) {
 *     console.log(`User ${id} deleted`);
 *   }
 * }
 * 
 * const adminService = new AdminService();
 * adminService.deleteUser("123"); // ❌ 抛出错误：Permission admin required
 */
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

/**
 * 管理员服务类
 * @description 演示权限验证装饰器的使用
 * 
 * @property permissions - 用户权限列表
 * @method getUserPermissions - 获取用户权限的方法
 * @method deleteUser - 使用 @requirePermission 装饰器的方法
 * 
 * @example
 * const adminService = new AdminService();
 * try {
 *   adminService.deleteUser("123");
 * } catch (error) {
 *   console.log("Permission error:", (error as Error).message);
 * }
 */
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

// 缓存装饰器

/**
 * 记忆化装饰器
 * @description 一个方法装饰器，用于缓存方法的结果
 * 避免重复执行相同的计算或请求
 * 
 * @param target - 类的原型对象
 * @param propertyKey - 方法的名称
 * @param descriptor - 方法的属性描述符
 * 
 * @example
 * class DataService {
 *   @memoize
 *   fetchData(id: string) {
 *     console.log(`Fetching data for ${id}`);
 *     return { id, data: `Data for ${id}` };
 *   }
 * }
 * 
 * const dataService = new DataService();
 * dataService.fetchData("123"); // 输出: Fetching data for 123
 * dataService.fetchData("123"); // 输出: Cache hit for fetchData
 */
function memoize(
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

/**
 * 数据服务类
 * @description 演示缓存装饰器的使用
 * 
 * @method fetchData - 使用 @memoize 装饰器的方法
 * 
 * @example
 * const dataService = new DataService();
 * dataService.fetchData("123");
 * dataService.fetchData("123");
 * // 第二次调用会从缓存中读取
 */
class DataService {
  @memoize
  fetchData(id: string) {
    console.log(`Fetching data for ${id}`);
    return { id, data: `Data for ${id}` };
  }
}

// 防抖装饰器

/**
 * 防抖装饰器工厂
 * @description 一个方法装饰器工厂，用于防抖处理
 * 防抖可以减少函数的调用频率，提高性能
 * 
 * @param delay - 延迟时间（毫秒）
 * @returns 方法装饰器
 * 
 * @example
 * class SearchComponent {
 *   @debounce(300)
 *   search(query: string) {
 *     console.log(`Searching for: ${query}`);
 *   }
 * }
 * 
 * const searchComponent = new SearchComponent();
 * searchComponent.search("test");
 * searchComponent.search("testing");
 * // 只有最后一次调用会在 300ms 后执行
 */
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

// 节流装饰器

/**
 * 节流装饰器工厂
 * @description 一个方法装饰器工厂，用于节流处理
 * 节流可以限制函数的调用频率，确保函数在一定时间内只执行一次
 * 
 * @param delay - 延迟时间（毫秒）
 * @returns 方法装饰器
 * 
 * @example
 * class SearchComponent {
 *   @throttle(1000)
 *   handleScroll() {
 *     console.log("Scroll handled");
 *   }
 * }
 * 
 * const searchComponent = new SearchComponent();
 * searchComponent.handleScroll();
 * searchComponent.handleScroll();
 * // 只有第一次调用会执行，后续调用会被节流
 */
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

/**
 * 搜索组件类
 * @description 演示防抖和节流装饰器的使用
 * 
 * @method search - 使用 @debounce 装饰器的方法
 * @method handleScroll - 使用 @throttle 装饰器的方法
 * 
 * @example
 * const searchComponent = new SearchComponent();
 * searchComponent.search("test");
 * searchComponent.search("testing");
 * searchComponent.handleScroll();
 * searchComponent.handleScroll();
 */
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

// 依赖注入装饰器

/**
 * 服务元数据符号
 * @description 用于存储服务标识符的 Symbol
 */
const ServiceMetadata = Symbol("Service");

/**
 * 可注入装饰器工厂
 * @description 一个类装饰器工厂，用于标记类为可注入的服务
 * 使用 reflect-metadata 库存储服务的标识符
 * 
 * @param serviceIdentifier - 服务的唯一标识符
 * @returns 类装饰器
 * 
 * @example
 * @Injectable("Logger")
 * class Logger {
 *   log(message: string) {
 *     console.log(`[LOG] ${message}`);
 *   }
 * }
 * 
 * @Injectable("Database")
 * class Database {
 *   constructor(private logger: Logger) {}
 *   
 *   query(sql: string) {
 *     this.logger.log(`Executing: ${sql}`);
 *     return [];
 *   }
 * }
 */
function Injectable(serviceIdentifier: string) {
  return function(target: any) {
    Reflect.defineMetadata(ServiceMetadata, serviceIdentifier, target);
  };
}

/**
 * 容器类
 * @description 依赖注入容器，用于管理服务的注册和解析
 * 
 * @property services - 存储已注册服务的 Map
 * @method register - 注册服务
 * @method resolve - 解析服务
 * 
 * @example
 * const container = new Container();
 * container.register("Logger", Logger);
 * container.register("Database", Database);
 * const db = container.resolve<Database>("Database");
 * db.query("SELECT * FROM users");
 */
class Container {
  private services: Map<string, any> = new Map();

  /**
   * 注册服务
   * @description 注册一个服务到容器
   * 
   * @param identifier - 服务的唯一标识符
   * @param implementation - 服务的实现类
   * @param args - 服务构造函数的参数
   * 
   * @example
   * container.register("Logger", Logger);
   * container.register("Database", Database);
   */
  register<T>(identifier: string, implementation: any, ...args: any[]): void {
    this.services.set(identifier, new implementation(...args));
  }

  /**
   * 解析服务
   * @description 从容器中解析并返回服务实例
   * 
   * @param identifier - 服务的唯一标识符
   * @returns 服务实例
   * 
   * @example
   * const logger = container.resolve<Logger>("Logger");
   * logger.log("Hello, World!");
   */
  resolve<T>(identifier: string): T {
    return this.services.get(identifier);
  }
}

/**
 * 日志服务类
 * @description 使用 @Injectable 装饰器的日志服务
 * 
 * @method log - 记录日志的方法
 * 
 * @example
 * const logger = new Logger();
 * logger.log("Hello, World!"); // 输出: [LOG] Hello, World!
 */
@Injectable("Logger")
class Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
}

/**
 * 数据库服务类
 * @description 使用 @Injectable 装饰器的数据库服务
 * 依赖于 Logger 服务
 * 
 * @property logger - 日志服务实例
 * @method query - 执行 SQL 查询的方法
 * 
 * @example
 * const db = new Database(new Logger());
 * db.query("SELECT * FROM users"); // 输出: [LOG] Executing: SELECT * FROM users
 */
@Injectable("Database")
class Database {
  constructor(private logger: Logger) {}

  query(sql: string) {
    this.logger.log(`Executing: ${sql}`);
    return [];
  }
}

// 路由装饰器

/**
 * 路由元数据键
 * @description 用于存储路由元数据的 Symbol
 */
const ROUTE_METADATA_KEY = Symbol("route");

/**
 * 路由元数据接口
 * @description 定义路由的元数据结构
 * 
 * @property path - 路由路径
 * @property method - HTTP 方法（GET、POST、PUT、DELETE）
 */
interface RouteMetadata {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
}

/**
 * 路由装饰器工厂
 * @description 一个方法装饰器工厂，用于定义路由
 * 使用 reflect-metadata 库存储路由信息
 * 
 * @param path - 路由路径
 * @param method - HTTP 方法
 * @returns 方法装饰器
 * 
 * @example
 * class UserController {
 *   @Route("/users", "GET")
 *   getUsers() {
 *     return [];
 *   }
 *   
 *   @Route("/users/:id", "GET")
 *   getUser(id: string) {
 *     return { id };
 *   }
 *   
 *   @Route("/users", "POST")
 *   createUser(user: any) {
 *     return user;
 *   }
 * }
 */
function Route(path: string, method: "GET" | "POST" | "PUT" | "DELETE") {
  return function(target: any, propertyKey: string) {
    const metadata: RouteMetadata = { path, method };
    Reflect.defineMetadata(ROUTE_METADATA_KEY, metadata, target, propertyKey);
  };
}

/**
 * 获取路由函数
 * @description 从类中提取所有路由信息
 * 
 * @param target - 类的构造函数
 * @returns 路由信息的对象，键为方法名，值为路由元数据
 * 
 * @example
 * const routes = getRoutes(UserController);
 * console.log(routes);
 * // 输出:
 * // {
 * //   getUsers: { path: "/users", method: "GET" },
 * //   getUser: { path: "/users/:id", method: "GET" },
 * //   createUser: { path: "/users", method: "POST" }
 * // }
 */
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

/**
 * 用户控制器类
 * @description 演示路由装饰器的使用
 * 
 * @method getUsers - 获取所有用户的路由
 * @method getUser - 获取单个用户的路由
 * @method createUser - 创建用户的路由
 * 
 * @example
 * const routes = getRoutes(UserController);
 * console.log(routes);
 * // 输出所有路由信息
 */
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

// 测试函数
function testDecorators() {
  console.log("Testing TypeScript decorators...");

  console.log("\n1. Class decorators:");
  const user = new User("John", 30);

  console.log("\n2. Method decorators:");
  const calc = new Calculator();
  calc.add(5, 3);
  calc.multiply(4, 3);
  calc.processLargeData([1, 2, 3, 4, 5]);

  console.log("\n3. Accessor decorators:");
  const temp = new Temperature(25);
  temp.celsius = 30;
  console.log("Temperature:", temp.celsius);

  console.log("\n4. Property decorators:");
  const product = new Product();
  product.name = "Laptop";
  product.price = 999.99;

  console.log("\n5. Parameter decorators:");
  const userService = new UserService();
  console.log(userService.greet("John", "Hello"));
  console.log(userService.add(5, 3));

  console.log("\n6. Decorator factory:");
  const apiService = new ApiService();
  apiService.fetchData("https://api.example.com");
  apiService.queryDatabase("SELECT * FROM users");

  console.log("\n7. Decorator composition:");
  const processor = new DataProcessor();
  processor.expensiveOperation(5);
  processor.expensiveOperation(5);

  console.log("\n8. Real-world scenarios:");

  console.log("\n- Logging:");
  const loggingService = new LoggingService();
  loggingService.getUser("123");

  console.log("\n- Permission:");
  const adminService = new AdminService();
  try {
    adminService.deleteUser("123");
  } catch (error) {
    console.log("Permission error:", (error as Error).message);
  }

  console.log("\n- Caching:");
  const dataService = new DataService();
  dataService.fetchData("123");
  dataService.fetchData("123");

  console.log("\n- Debounce and Throttle:");
  const searchComponent = new SearchComponent();
  searchComponent.search("test");
  searchComponent.search("testing");
  searchComponent.handleScroll();
  searchComponent.handleScroll();

  console.log("\n- Dependency Injection:");
  const container = new Container();
  container.register("Logger", Logger);
  container.register("Database", Database);
  const db = container.resolve<Database>("Database");
  db.query("SELECT * FROM users");

  console.log("\n- Routing:");
  console.log("User Controller Routes:", getRoutes(UserController));

  console.log("TypeScript decorators test completed!");
}

// 导出测试函数
export { testDecorators };

// 导出装饰器
export {
  sealed,
  logged,
  enumerable,
  log,
  measure,
  configurable,
  validateRange,
  readonly,
  typeValidator,
  required,
  validate,
  typeCheck,
  validateTypes,
  logMethod,
  cache,
  logWithTimestamp,
  requirePermission,
  memoize,
  debounce,
  throttle,
  Injectable,
  Route,
  getRoutes
};

// 导出类
export {
  Greeter,
  User,
  Calculator,
  Temperature,
  Product,
  UserService,
  ApiService,
  DataProcessor,
  LoggingService,
  AdminService,
  DataService,
  SearchComponent,
  Logger,
  Database,
  Container,
  UserController
};

// 导出类型
export type { RouteMetadata };
