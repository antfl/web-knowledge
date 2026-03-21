/**
 * ============================================
 * JavaScript 设计模式实现与演示
 * ============================================
 * 
 * 设计模式是在软件设计中解决特定问题的标准化方案，
 * 本文件涵盖了常见的设计模式及其 JavaScript 实现。
 */

// ============================================
// 第一部分：单例模式 (Singleton)
// ============================================

console.log('========== 单例模式 ==========');

// 方法 1：使用闭包
const Singleton1 = (function() {
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

const instance1 = Singleton1.getInstance();
const instance2 = Singleton1.getInstance();
console.log('单例模式 - 闭包:', instance1 === instance2);

// 方法 2：使用类
class Singleton2 {
  static #instance;
  
  constructor() {
    if (Singleton2.#instance) {
      return Singleton2.#instance;
    }
    this.name = '单例实例';
    Singleton2.#instance = this;
  }
  
  static getInstance() {
    if (!Singleton2.#instance) {
      Singleton2.#instance = new Singleton2();
    }
    return Singleton2.#instance;
  }
}

const instance3 = new Singleton2();
const instance4 = new Singleton2();
console.log('单例模式 - 类:', instance3 === instance4);

// 应用场景：全局配置
const Config = (function() {
  let instance;
  
  return {
    getInstance: function() {
      if (!instance) {
        instance = {
          apiUrl: 'https://api.example.com',
          timeout: 5000,
          debug: true
        };
      }
      return instance;
    }
  };
})();

const config = Config.getInstance();
console.log('配置单例:', config.apiUrl);


// ============================================
// 第二部分：工厂模式 (Factory)
// ============================================

console.log('\n========== 工厂模式 ==========');

// 简单工厂
class ProductA {
  constructor() {
    this.type = 'A';
  }
  
  operation() {
    return `产品${this.type}的操作`;
  }
}

class ProductB {
  constructor() {
    this.type = 'B';
  }
  
  operation() {
    return `产品${this.type}的操作`;
  }
}

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

const productA = ProductFactory.createProduct('A');
const productB = ProductFactory.createProduct('B');
console.log('工厂模式 - 产品A:', productA.operation());
console.log('工厂模式 - 产品B:', productB.operation());

// 抽象工厂
class AbstractFactory {
  createProductA() {}
  createProductB() {}
}

class ConcreteFactory1 extends AbstractFactory {
  createProductA() {
    return new ProductA1();
  }
  
  createProductB() {
    return new ProductB1();
  }
}

class ConcreteFactory2 extends AbstractFactory {
  createProductA() {
    return new ProductA2();
  }
  
  createProductB() {
    return new ProductB2();
  }
}

class ProductA1 { operation() { return '产品A1的操作'; } }
class ProductB1 { operation() { return '产品B1的操作'; } }
class ProductA2 { operation() { return '产品A2的操作'; } }
class ProductB2 { operation() { return '产品B2的操作'; } }

const factory1 = new ConcreteFactory1();
const factory2 = new ConcreteFactory2();
console.log('抽象工厂 - 工厂1产品A:', factory1.createProductA().operation());
console.log('抽象工厂 - 工厂2产品B:', factory2.createProductB().operation());


// ============================================
// 第三部分：观察者模式 (Observer)
// ============================================

console.log('\n========== 观察者模式 ==========');

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
  constructor(name) {
    this.name = name;
  }
  
  update(data) {
    console.log(`${this.name} 接收到数据:`, data);
  }
}

const subject = new Subject();
const observer1 = new Observer('观察者1');
const observer2 = new Observer('观察者2');

subject.addObserver(observer1);
subject.addObserver(observer2);
subject.notify('Hello');

subject.removeObserver(observer1);
subject.notify('World');

// 应用场景：事件系统
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

const emitter = new EventEmitter();
emitter.on('click', data => console.log('点击事件:', data));
emitter.on('hover', data => console.log('悬停事件:', data));
emitter.emit('click', { x: 100, y: 200 });
emitter.emit('hover', { element: 'button' });


// ============================================
// 第四部分：发布订阅模式 (Publish-Subscribe)
// ============================================

console.log('\n========== 发布订阅模式 ==========');

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
  
  unsubscribe(topic, callback) {
    if (this.topics[topic]) {
      this.topics[topic] = this.topics[topic].filter(cb => cb !== callback);
    }
  }
  
  publish(topic, data) {
    if (this.topics[topic]) {
      this.topics[topic].forEach(callback => callback(data));
    }
  }
}

const pubsub = new PubSub();

const sub1 = (data) => console.log('订阅者1:', data);
const sub2 = (data) => console.log('订阅者2:', data);

pubsub.subscribe('news', sub1);
pubsub.subscribe('news', sub2);
pubsub.publish('news', '今日头条');

pubsub.unsubscribe('news', sub1);
pubsub.publish('news', '最新消息');

// 应用场景：消息总线
const EventBus = new PubSub();
EventBus.subscribe('userLoggedIn', user => console.log('用户登录:', user));
EventBus.subscribe('userLoggedOut', () => console.log('用户登出'));
EventBus.publish('userLoggedIn', { id: 1, name: '张三' });
EventBus.publish('userLoggedOut');


// ============================================
// 第五部分：代理模式 (Proxy)
// ============================================

console.log('\n========== 代理模式 ==========');

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

const realSubject = new RealSubject();
const proxy = new ProxySubject(realSubject);
console.log('代理模式:', proxy.request());

// 应用场景：图片懒加载
class ImageLoader {
  load(url) {
    console.log(`加载图片: ${url}`);
    return `图片 ${url}`;
  }
}

class ImageProxy {
  constructor(loader) {
    this.loader = loader;
    this.cache = {};
  }
  
  load(url) {
    if (this.cache[url]) {
      console.log('从缓存加载');
      return this.cache[url];
    }
    const result = this.loader.load(url);
    this.cache[url] = result;
    return result;
  }
}

const imageLoader = new ImageLoader();
const imageProxy = new ImageProxy(imageLoader);
imageProxy.load('image1.jpg');
imageProxy.load('image1.jpg'); // 从缓存加载


// ============================================
// 第六部分：装饰器模式 (Decorator)
// ============================================

console.log('\n========== 装饰器模式 ==========');

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

class ConcreteDecoratorB extends Decorator {
  operation() {
    return `装饰器B(${super.operation()})`;
  }
}

const component = new Component();
const decoratorA = new ConcreteDecoratorA(component);
const decoratorB = new ConcreteDecoratorB(decoratorA);
console.log('装饰器模式:', decoratorB.operation());

// 应用场景：添加功能
class User {
  constructor(name) {
    this.name = name;
  }
  
  getInfo() {
    return `用户: ${this.name}`;
  }
}

class PremiumUserDecorator {
  constructor(user) {
    this.user = user;
  }
  
  getInfo() {
    return `${this.user.getInfo()} (高级用户)`;
  }
  
  getPremiumFeatures() {
    return ['高级功能1', '高级功能2'];
  }
}

const user = new User('张三');
const premiumUser = new PremiumUserDecorator(user);
console.log('装饰器 - 普通用户:', user.getInfo());
console.log('装饰器 - 高级用户:', premiumUser.getInfo());
console.log('装饰器 - 高级功能:', premiumUser.getPremiumFeatures());


// ============================================
// 第七部分：策略模式 (Strategy)
// ============================================

console.log('\n========== 策略模式 ==========');

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

class StrategyC {
  execute() {
    return '策略C执行';
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

const context = new Context(new StrategyA());
console.log('策略模式 - 策略A:', context.executeStrategy());

context.setStrategy(new StrategyB());
console.log('策略模式 - 策略B:', context.executeStrategy());

context.setStrategy(new StrategyC());
console.log('策略模式 - 策略C:', context.executeStrategy());

// 应用场景：支付方式
class PaymentStrategy {
  pay(amount) {}
}

class AlipayStrategy extends PaymentStrategy {
  pay(amount) {
    return `支付宝支付 ${amount} 元`;
  }
}

class WechatStrategy extends PaymentStrategy {
  pay(amount) {
    return `微信支付 ${amount} 元`;
  }
}

class CreditCardStrategy extends PaymentStrategy {
  pay(amount) {
    return `信用卡支付 ${amount} 元`;
  }
}

class PaymentContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  pay(amount) {
    return this.strategy.pay(amount);
  }
}

const payment = new PaymentContext(new AlipayStrategy());
console.log('策略模式 - 支付宝:', payment.pay(100));

payment.setStrategy(new WechatStrategy());
console.log('策略模式 - 微信:', payment.pay(200));


// ============================================
// 第八部分：适配器模式 (Adapter)
// ============================================

console.log('\n========== 适配器模式 ==========');

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

const adaptee = new Adaptee();
const adapter = new Adapter(adaptee);
console.log('适配器模式:', adapter.request());

// 应用场景：接口转换
class OldAPI {
  getUsers(callback) {
    setTimeout(() => {
      callback([{ id: 1, name: '张三' }]);
    }, 1000);
  }
}

class NewAPI {
  async getUsers() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([{ id: 1, name: '张三' }]);
      }, 1000);
    });
  }
}

class APIAdapter {
  constructor(oldAPI) {
    this.oldAPI = oldAPI;
  }
  
  async getUsers() {
    return new Promise((resolve, reject) => {
      this.oldAPI.getUsers((users) => {
        resolve(users);
      });
    });
  }
}

const oldAPI = new OldAPI();
const adapter2 = new APIAdapter(oldAPI);
adapter2.getUsers().then(users => {
  console.log('适配器模式 - 转换后:', users);
});


// ============================================
// 第九部分：模板方法模式 (Template Method)
// ============================================

console.log('\n========== 模板方法模式 ==========');

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

class ConcreteClassA extends AbstractClass {
  step2() {
    console.log('具体类A - 步骤2');
  }
}

class ConcreteClassB extends AbstractClass {
  step2() {
    console.log('具体类B - 步骤2');
  }
  
  step3() {
    console.log('具体类B - 步骤3（重写）');
  }
}

const classA = new ConcreteClassA();
console.log('模板方法 - 类A:');
classA.templateMethod();

const classB = new ConcreteClassB();
console.log('\n模板方法 - 类B:');
classB.templateMethod();

// 应用场景：数据处理流程
class DataProcessor {
  process(data) {
    this.validate(data);
    this.transform(data);
    this.save(data);
  }
  
  validate(data) {
    console.log('验证数据:', data);
  }
  
  transform(data) {}
  
  save(data) {
    console.log('保存数据:', data);
  }
}

class JSONProcessor extends DataProcessor {
  transform(data) {
    console.log('转换为JSON:', JSON.stringify(data));
  }
}

class CSVProcessor extends DataProcessor {
  transform(data) {
    console.log('转换为CSV:', Object.values(data).join(','));
  }
}

const jsonProcessor = new JSONProcessor();
console.log('模板方法 - JSON处理:');
jsonProcessor.process({ id: 1, name: '张三' });


// ============================================
// 第十部分：责任链模式 (Chain of Responsibility)
// ============================================

console.log('\n========== 责任链模式 ==========');

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

class ConcreteHandlerB extends Handler {
  handle(request) {
    if (request.type === 'B') {
      return `处理类型B的请求: ${request.data}`;
    }
    return super.handle(request);
  }
}

class ConcreteHandlerC extends Handler {
  handle(request) {
    if (request.type === 'C') {
      return `处理类型C的请求: ${request.data}`;
    }
    return super.handle(request);
  }
}

const handlerA = new ConcreteHandlerA();
const handlerB = new ConcreteHandlerB();
const handlerC = new ConcreteHandlerC();

handlerA.setNext(handlerB).setNext(handlerC);

console.log('责任链 - 类型A:', handlerA.handle({ type: 'A', data: '测试A' }));
console.log('责任链 - 类型B:', handlerA.handle({ type: 'B', data: '测试B' }));
console.log('责任链 - 类型C:', handlerA.handle({ type: 'C', data: '测试C' }));
console.log('责任链 - 类型D:', handlerA.handle({ type: 'D', data: '测试D' }));

// 应用场景：表单验证
class Validator {
  setNext(validator) {
    this.next = validator;
    return validator;
  }
  
  validate(data) {
    if (this.next) {
      return this.next.validate(data);
    }
    return { valid: true };
  }
}

class RequiredValidator extends Validator {
  validate(data) {
    if (!data.name) {
      return { valid: false, message: '姓名不能为空' };
    }
    return super.validate(data);
  }
}

class LengthValidator extends Validator {
  validate(data) {
    if (data.name.length < 2) {
      return { valid: false, message: '姓名长度至少2个字符' };
    }
    return super.validate(data);
  }
}

class EmailValidator extends Validator {
  validate(data) {
    if (!data.email || !data.email.includes('@')) {
      return { valid: false, message: '邮箱格式不正确' };
    }
    return super.validate(data);
  }
}

const requiredValidator = new RequiredValidator();
const lengthValidator = new LengthValidator();
const emailValidator = new EmailValidator();

requiredValidator.setNext(lengthValidator).setNext(emailValidator);

console.log('责任链 - 验证1:', requiredValidator.validate({}));
console.log('责任链 - 验证2:', requiredValidator.validate({ name: '张' }));
console.log('责任链 - 验证3:', requiredValidator.validate({ name: '张三', email: 'zhangsan' }));
console.log('责任链 - 验证4:', requiredValidator.validate({ name: '张三', email: 'zhangsan@example.com' }));


// ============================================
// 第十一部分：外观模式 (Facade)
// ============================================

console.log('\n========== 外观模式 ==========');

class SubsystemA {
  operationA() {
    return '子系统A操作';
  }
}

class SubsystemB {
  operationB() {
    return '子系统B操作';
  }
}

class SubsystemC {
  operationC() {
    return '子系统C操作';
  }
}

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

const facade = new Facade();
console.log('外观模式 - 操作1:', facade.operation1());
console.log('外观模式 - 操作2:', facade.operation2());

// 应用场景：API 封装
class APIFacade {
  constructor() {
    this.userAPI = new UserAPI();
    this.orderAPI = new OrderAPI();
    this.productAPI = new ProductAPI();
  }
  
  async getUserWithOrders(userId) {
    const user = await this.userAPI.getUser(userId);
    const orders = await this.orderAPI.getOrders(userId);
    return { ...user, orders };
  }
  
  async getOrderWithProducts(orderId) {
    const order = await this.orderAPI.getOrder(orderId);
    const products = await Promise.all(
      order.productIds.map(id => this.productAPI.getProduct(id))
    );
    return { ...order, products };
  }
}

class UserAPI {
  async getUser(id) {
    return { id, name: '张三' };
  }
}

class OrderAPI {
  async getOrders(userId) {
    return [{ id: 1, userId, productIds: [1, 2] }];
  }
  
  async getOrder(id) {
    return { id, userId: 1, productIds: [1, 2] };
  }
}

class ProductAPI {
  async getProduct(id) {
    return { id, name: `产品${id}` };
  }
}

const apiFacade = new APIFacade();
apiFacade.getUserWithOrders(1).then(data => {
  console.log('外观模式 - 用户订单:', data);
});


// ============================================
// 总结
// ============================================

console.log('\n========== 总结 ==========');
console.log(`
设计模式核心要点：

1. 单例模式：
   - 确保一个类只有一个实例
   - 提供全局访问点
   - 应用场景：全局配置、缓存、日志

2. 工厂模式：
   - 封装对象的创建过程
   - 解耦对象的创建和使用
   - 应用场景：创建复杂对象、依赖注入

3. 观察者模式：
   - 一对多依赖关系
   - 当一个对象状态改变时，通知所有观察者
   - 应用场景：事件系统、数据绑定

4. 发布订阅模式：
   - 发布者和订阅者解耦
   - 通过消息中心传递消息
   - 应用场景：消息总线、事件总线

5. 代理模式：
   - 为其他对象提供代理
   - 控制对原对象的访问
   - 应用场景：缓存、权限控制、图片懒加载

6. 装饰器模式：
   - 动态添加功能
   - 不修改原有代码
   - 应用场景：扩展功能、权限管理

7. 策略模式：
   - 定义算法族，封装起来
   - 可以互相替换
   - 应用场景：支付方式、排序算法

8. 适配器模式：
   - 转换接口，使不兼容的类一起工作
   - 应用场景：API 兼容、第三方库集成

9. 模板方法模式：
   - 定义算法骨架，子类实现具体步骤
   - 应用场景：数据处理流程、生命周期管理

10. 责任链模式：
    - 请求沿着链传递，直到被处理
    - 应用场景：表单验证、日志处理

11. 外观模式：
    - 为子系统提供统一接口
    - 简化复杂系统的使用
    - 应用场景：API 封装、库的使用

掌握设计模式，是成为高级前端工程师的必备技能！
`);