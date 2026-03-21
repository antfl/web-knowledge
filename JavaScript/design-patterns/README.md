# 设计模式 (Design Patterns)

## 1. 什么是设计模式

设计模式是在软件设计中解决特定问题的标准化方案，是经过验证的、可重用的解决方案。它们是对常见软件设计问题的最佳实践总结，帮助开发者编写更可维护、更可扩展的代码。

### 设计模式的分类

| 类型 | 描述 | 包含模式 |
|------|------|----------|
| 创建型模式 | 处理对象的创建过程 | 单例、工厂、抽象工厂、建造者、原型 |
| 结构型模式 | 处理类和对象的组合 | 代理、装饰器、适配器、外观、桥接、组合、享元 |
| 行为型模式 | 处理对象之间的通信 | 观察者、发布订阅、策略、责任链、命令、模板方法、状态、访问者、迭代器、中介者、备忘录 |

## 2. 创建型模式

### 2.1 单例模式 (Singleton)

**概念**：确保一个类只有一个实例，并提供一个全局访问点。

**核心要点**：
- 私有构造函数
- 静态实例变量
- 静态获取实例的方法

**实现方式**：
- 使用闭包
- 使用类的静态属性
- 使用 ES6 的私有字段

**应用场景**：
- 全局配置对象
- 数据库连接池
- 日志记录器
- 缓存

**代码示例**：
```javascript
// 使用闭包实现单例
const Singleton = (function() {
  let instance;
  
  function createInstance() {
    return {
      name: '单例实例',
      getInstance: function() {
        return this;
      }
    };
  }
  
  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// 使用类实现单例
class SingletonClass {
  static #instance;
  
  constructor() {
    if (SingletonClass.#instance) {
      return SingletonClass.#instance;
    }
    this.name = '单例实例';
    SingletonClass.#instance = this;
  }
  
  static getInstance() {
    if (!SingletonClass.#instance) {
      SingletonClass.#instance = new SingletonClass();
    }
    return SingletonClass.#instance;
  }
}
```

**优缺点**：
- ✅ 优点：节省内存，避免重复创建对象
- ❌ 缺点：违反单一职责原则，可能导致代码耦合

### 2.2 工厂模式 (Factory)

**概念**：封装对象的创建过程，根据不同的参数返回不同类型的对象。

**核心要点**：
- 工厂方法：创建对象的接口
- 具体产品：实现产品接口
- 客户端：使用工厂创建对象

**类型**：
- 简单工厂：一个工厂类创建所有产品
- 工厂方法：每个产品有对应的工厂
- 抽象工厂：创建相关或相互依赖的对象家族

**应用场景**：
- 创建复杂对象
- 依赖注入
- 框架和库的设计

**代码示例**：
```javascript
// 简单工厂
class ProductFactory {
  static createProduct(type) {
    switch (type) {
      case 'A':
        return new ProductA();
      case 'B':
        return new ProductB();
      default:
        throw new Error('未知产品类型');
    }
  }
}

// 抽象工厂
class AbstractFactory {
  createProductA() {}
  createProductB() {}
}

class ConcreteFactory1 extends AbstractFactory {
  createProductA() { return new ProductA1(); }
  createProductB() { return new ProductB1(); }
}
```

**优缺点**：
- ✅ 优点：解耦对象创建和使用，提高代码灵活性
- ❌ 缺点：增加代码复杂度，需要更多的类

## 3. 结构型模式

### 3.1 代理模式 (Proxy)

**概念**：为其他对象提供一个代理，以控制对原对象的访问。

**核心要点**：
- 代理对象：控制对原对象的访问
- 真实对象：被代理的对象
- 接口：代理和真实对象实现相同的接口

**类型**：
- 虚拟代理：延迟加载
- 保护代理：控制访问权限
- 远程代理：远程对象的本地代表
- 缓存代理：缓存结果

**应用场景**：
- 图片懒加载
- 权限控制
- 缓存
- 日志记录

**代码示例**：
```javascript
class RealSubject {
  request() {
    return '真实主题的请求';
  }
}

class ProxySubject {
  constructor(realSubject) {
    this.realSubject = realSubject;
  }
  
  request() {
    console.log('代理处理前');
    const result = this.realSubject.request();
    console.log('代理处理后');
    return result;
  }
}
```

**优缺点**：
- ✅ 优点：控制访问，增加额外功能，延迟加载
- ❌ 缺点：增加系统复杂度，可能影响性能

### 3.2 装饰器模式 (Decorator)

**概念**：动态地给对象添加额外的职责，而不修改原对象的结构。

**核心要点**：
- 组件：被装饰的对象
- 装饰器：包装组件并添加新功能
- 透明性：装饰后的对象与原对象具有相同的接口

**应用场景**：
- 扩展功能
- 权限管理
- 日志记录
- 性能监控

**代码示例**：
```javascript
class Component {
  operation() {
    return '基础组件操作';
  }
}

class Decorator extends Component {
  constructor(component) {
    super();
    this.component = component;
  }
  
  operation() {
    return this.component.operation();
  }
}

class ConcreteDecoratorA extends Decorator {
  operation() {
    return `装饰器A(${super.operation()})`;
  }
}
```

**优缺点**：
- ✅ 优点：动态添加功能，遵循开闭原则
- ❌ 缺点：可能导致装饰器链过长，增加代码复杂度

### 3.3 适配器模式 (Adapter)

**概念**：将一个类的接口转换为客户端期望的另一个接口，使不兼容的类可以一起工作。

**核心要点**：
- 目标接口：客户端期望的接口
- 适配器：转换接口的类
- 被适配者：需要被转换的类

**应用场景**：
- API 兼容
- 第三方库集成
- 旧系统集成

**代码示例**：
```javascript
class Adaptee {
  specificRequest() {
    return '特殊请求';
  }
}

class Target {
  request() {
    return '标准请求';
  }
}

class Adapter extends Target {
  constructor(adaptee) {
    super();
    this.adaptee = adaptee;
  }
  
  request() {
    const result = this.adaptee.specificRequest();
    return `适配器转换: ${result}`;
  }
}
```

**优缺点**：
- ✅ 优点：使不兼容的接口可以一起工作
- ❌ 缺点：增加系统复杂度，可能引入性能开销

### 3.4 外观模式 (Facade)

**概念**：为子系统提供一个统一的接口，简化对子系统的使用。

**核心要点**：
- 外观：提供统一接口的类
- 子系统：被外观包装的多个类
- 简化：隐藏子系统的复杂性

**应用场景**：
- API 封装
- 库的使用
- 复杂系统的简化

**代码示例**：
```javascript
class Facade {
  constructor() {
    this.subsystemA = new SubsystemA();
    this.subsystemB = new SubsystemB();
    this.subsystemC = new SubsystemC();
  }
  
  operation1() {
    return `${this.subsystemA.operationA()} -> ${this.subsystemB.operationB()}`;
  }
  
  operation2() {
    return `${this.subsystemB.operationB()} -> ${this.subsystemC.operationC()}`;
  }
}
```

**优缺点**：
- ✅ 优点：简化接口，降低耦合
- ❌ 缺点：可能成为系统的瓶颈，限制了对子系统的直接访问

## 4. 行为型模式

### 4.1 观察者模式 (Observer)

**概念**：定义对象之间的一对多依赖关系，当一个对象状态改变时，所有依赖它的对象都会收到通知。

**核心要点**：
- 主题：被观察的对象
- 观察者：观察主题的对象
- 通知机制：主题状态改变时通知观察者

**应用场景**：
- 事件系统
- 数据绑定
- 消息通知

**代码示例**：
```javascript
class Subject {
  constructor() {
    this.observers = [];
  }
  
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notify(data) {
    this.observers.forEach(observer => {
      observer.update(data);
    });
  }
}

class Observer {
  update(data) {
    console.log('接收到数据:', data);
  }
}
```

**优缺点**：
- ✅ 优点：解耦主题和观察者，支持广播通信
- ❌ 缺点：可能导致通知链过长，性能问题

### 4.2 发布订阅模式 (Publish-Subscribe)

**概念**：发布者和订阅者通过消息中心进行通信，发布者不需要知道订阅者的存在。

**核心要点**：
- 发布者：发布消息的对象
- 订阅者：订阅消息的对象
- 消息中心：管理消息的分发

**应用场景**：
- 消息总线
- 事件总线
- 跨组件通信

**代码示例**：
```javascript
class PubSub {
  constructor() {
    this.topics = {};
  }
  
  subscribe(topic, callback) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(callback);
  }
  
  publish(topic, data) {
    if (this.topics[topic]) {
      this.topics[topic].forEach(callback => callback(data));
    }
  }
}
```

**与观察者模式的区别**：
- 观察者模式：主题直接通知观察者
- 发布订阅模式：通过消息中心间接通信

### 4.3 策略模式 (Strategy)

**概念**：定义一系列算法，封装每个算法，并使它们可以互相替换。

**核心要点**：
- 策略接口：定义算法的接口
- 具体策略：实现具体的算法
- 上下文：使用策略的对象

**应用场景**：
- 支付方式
- 排序算法
- 验证规则

**代码示例**：
```javascript
class StrategyA {
  execute() {
    return '策略A执行';
  }
}

class StrategyB {
  execute() {
    return '策略B执行';
  }
}

class Context {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  executeStrategy() {
    return this.strategy.execute();
  }
}
```

**优缺点**：
- ✅ 优点：算法可以互相替换，避免条件判断
- ❌ 缺点：增加了类的数量，客户端需要知道所有策略

### 4.4 责任链模式 (Chain of Responsibility)

**概念**：将请求沿着处理链传递，直到有一个处理者处理它。

**核心要点**：
- 处理者：处理请求的对象
- 链：处理者组成的链条
- 传递：请求在链中传递

**应用场景**：
- 表单验证
- 日志处理
- 权限检查

**代码示例**：
```javascript
class Handler {
  setNext(handler) {
    this.next = handler;
    return handler;
  }
  
  handle(request) {
    if (this.next) {
      return this.next.handle(request);
    }
    return null;
  }
}

class ConcreteHandlerA extends Handler {
  handle(request) {
    if (request.type === 'A') {
      return `处理类型A的请求: ${request.data}`;
    }
    return super.handle(request);
  }
}
```

**优缺点**：
- ✅ 优点：解耦发送者和接收者，灵活添加处理者
- ❌ 缺点：可能导致请求无法被处理，性能问题

### 4.5 模板方法模式 (Template Method)

**概念**：定义算法的骨架，将一些步骤延迟到子类实现。

**核心要点**：
- 抽象类：定义算法骨架
- 具体子类：实现具体步骤
- 模板方法：调用步骤的方法

**应用场景**：
- 数据处理流程
- 生命周期管理
- 框架设计

**代码示例**：
```javascript
class AbstractClass {
  templateMethod() {
    this.step1();
    this.step2();
    this.step3();
  }
  
  step1() {
    console.log('抽象类 - 步骤1');
  }
  
  step2() {}
  
  step3() {
    console.log('抽象类 - 步骤3');
  }
}

class ConcreteClass extends AbstractClass {
  step2() {
    console.log('具体类 - 步骤2');
  }
}
```

**优缺点**：
- ✅ 优点：封装算法骨架，子类可以自定义步骤
- ❌ 缺点：可能导致类的数量增加

## 5. 设计模式的应用原则

### 5.1 SOLID 原则

| 原则 | 描述 | 应用 |
|------|------|------|
| 单一职责原则 (SRP) | 一个类只负责一个功能领域 | 每个类只做一件事 |
| 开放封闭原则 (OCP) | 对扩展开放，对修改封闭 | 使用继承和多态 |
| 里氏替换原则 (LSP) | 子类可以替换父类 | 保持继承的正确性 |
| 接口隔离原则 (ISP) | 客户端不应该依赖它不使用的接口 | 接口要小而专 |
| 依赖倒置原则 (DIP) | 依赖抽象，不依赖具体实现 | 使用依赖注入 |

### 5.2 设计模式的选择

选择设计模式时需要考虑：
- 问题的本质
- 系统的规模和复杂度
- 团队的技术水平
- 性能要求
- 可维护性要求

## 6. 设计模式在前端开发中的应用

### 6.1 常见应用场景

| 设计模式 | 前端应用场景 | 示例 |
|----------|-------------|------|
| 单例模式 | 全局状态管理 | Redux store |
| 工厂模式 | 组件创建 | React 组件工厂 |
| 观察者模式 | 事件系统 | DOM 事件 |
| 发布订阅模式 | 跨组件通信 | EventBus |
| 代理模式 | 图片懒加载 | 图片加载器 |
| 装饰器模式 | HOC | React 高阶组件 |
| 策略模式 | 主题切换 | 不同主题策略 |
| 适配器模式 | API 兼容 | 旧 API 适配 |
| 外观模式 | 第三方库封装 | Axios 封装 |

### 6.2 框架中的设计模式

- **React**：
  - 组件模式
  - 高阶组件 (装饰器模式)
  - 状态管理 (观察者模式)

- **Vue**：
  - 响应式系统 (观察者模式)
  - 指令系统 (策略模式)
  - 插件系统 (装饰器模式)

- **Angular**：
  - 依赖注入 (工厂模式)
  - 组件模式
  - 服务模式 (单例模式)

## 7. 设计模式面试题

### 7.1 常见问题

1. **什么是设计模式？设计模式有哪些分类？**
   - 设计模式是解决特定问题的标准化方案，分为创建型、结构型、行为型三大类。

2. **单例模式的实现方式有哪些？**
   - 使用闭包
   - 使用类的静态属性
   - 使用 ES6 的私有字段

3. **观察者模式和发布订阅模式的区别？**
   - 观察者模式：主题直接通知观察者
   - 发布订阅模式：通过消息中心间接通信

4. **工厂模式的类型有哪些？**
   - 简单工厂
   - 工厂方法
   - 抽象工厂

5. **装饰器模式和适配器模式的区别？**
   - 装饰器模式：动态添加功能
   - 适配器模式：转换接口

6. **策略模式的优点是什么？**
   - 算法可以互相替换，避免条件判断，提高代码可维护性。

7. **责任链模式的应用场景有哪些？**
   - 表单验证、日志处理、权限检查等。

8. **模板方法模式的核心思想是什么？**
   - 定义算法骨架，将具体步骤延迟到子类实现。

### 7.2 代码实现题

1. **实现单例模式**
   - 要求：使用闭包和类两种方式实现

2. **实现观察者模式**
   - 要求：支持添加、移除观察者，以及通知观察者

3. **实现发布订阅模式**
   - 要求：支持订阅、取消订阅、发布消息

4. **实现策略模式**
   - 要求：实现不同的支付策略

5. **实现责任链模式**
   - 要求：实现表单验证的责任链

## 8. 总结

设计模式是软件设计的重要组成部分，掌握设计模式可以：

1. **提高代码质量**：使用经过验证的解决方案
2. **增强代码可维护性**：使代码结构更清晰
3. **提升开发效率**：避免重复造轮子
4. **促进团队协作**：使用共同的设计语言
5. **应对复杂问题**：提供标准化的解决方案

### 学习建议

1. **理解原理**：掌握每种设计模式的核心思想
2. **多做实践**：在实际项目中应用设计模式
3. **灵活运用**：根据具体情况选择合适的设计模式
4. **持续学习**：关注设计模式的新应用和变体

设计模式不是银弹，而是工具箱。合理使用设计模式，可以让我们的代码更加优雅、高效、可维护。

---

**相关资源**：
- 《设计模式：可复用面向对象软件的基础》
- 《Head First 设计模式》
- 《JavaScript 设计模式与开发实践》
- [Refactoring.Guru - 设计模式](https://refactoring.guru/design-patterns)

**实践项目**：
- 实现一个完整的事件系统
- 设计一个插件架构
- 构建一个状态管理库

通过不断学习和实践，你将能够熟练运用设计模式，成为一名优秀的前端工程师！