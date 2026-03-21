
const fp = require('./index.js');

console.log('=== 测试函数式编程 ===\n');

console.log('1. 测试纯函数:');
console.log('  pureAdd 是纯函数:', fp.isPureFunction(fp.pureAdd, [2, 3], 5));
console.log('  impureAdd 是纯函数:', fp.isPureFunction(fp.impureAdd, [2, 3], 6));

console.log('\n2. 测试不可变操作:');
const arr = [1, 2, 3];
const newArr = fp.immutablePush(arr, 4);
console.log('  原数组:', arr);
console.log('  新数组:', newArr);
console.log('  原数组未改变:', arr !== newArr);

const obj = { a: 1, b: 2 };
const newObj = fp.immutableObjectUpdate(obj, 'c', 3);
console.log('  原对象:', obj);
console.log('  新对象:', newObj);

console.log('\n3. 测试一等公民和高阶函数:');
console.log('  greet:', fp.greet('World'));
console.log('  applyFn:', fp.applyFn(x => x * 2, 5));
const multiplyBy3 = fp.createMultiplier(3);
console.log('  multiplyBy3:', multiplyBy3(5));

console.log('\n4. 测试 map, filter, reduce:');
const numbers = [1, 2, 3, 4, 5];
console.log('  map (加倍:', fp.map(x => x * 2, numbers));
console.log('  filter (偶数:', fp.filter(x => x % 2 === 0, numbers));
console.log('  reduce (求和:', fp.reduce((acc, x) => acc + x, 0, numbers));

console.log('\n5. 测试闭包:');
const counter = fp.createCounter();
console.log('  counter.increment():', counter.increment());
console.log('  counter.increment():', counter.increment());
console.log('  counter.decrement():', counter.decrement());
console.log('  counter.getCount():', counter.getCount());

const calc = fp.createCalculator(10);
console.log('  calc.add(5).subtract(3).multiply(2).getValue():', calc.add(5).subtract(3).multiply(2).getValue());

console.log('\n6. 测试柯里化:');
console.log('  curriedAdd(1)(2)(3):', fp.curriedAdd(1)(2)(3));
console.log('  curriedAdd(1, 2)(3):', fp.curriedAdd(1, 2)(3));

const add3 = (a, b, c) => a + b + c;
const add1 = fp.partial(add3, 1, 2);
console.log('  partial:', add1(3));

console.log('\n7. 测试函数组合:');
console.log('  doubleThenIncrement(5):', fp.doubleThenIncrement(5));
console.log('  incrementThenDouble(5):', fp.incrementThenDouble(5));

console.log('\n8. 测试记忆化:');
console.log('  slowFunction(5):', fp.slowFunction(5));
console.log('  slowFunction(5) (缓存):', fp.slowFunction(5));
console.log('  slowFunction(10):', fp.slowFunction(10));

console.log('\n9. 测试工具函数:');
console.log('  identity(42):', fp.identity(42));
const getValue = fp.always('Hello');
console.log('  always:', getValue());

console.log('\n10. 测试 Maybe 函子:');
const maybeValue = fp.Maybe.just(5).map(x => x * 2);
console.log('  Maybe.just(5).map(x => x * 2):', maybeValue.getOrElse(0));
const nothing = fp.Maybe.nothing().map(x => x * 2);
console.log('  Maybe.nothing().map(x => x * 2):', nothing.getOrElse(0));

const safeDivResult = fp.safeDivide(10, 2);
console.log('  safeDivide(10, 2):', safeDivResult.getOrElse(0));
const safeDivZero = fp.safeDivide(10, 0);
console.log('  safeDivide(10, 0):', safeDivZero.getOrElse('错误'));

console.log('\n11. 测试 Either 函子:');
const divResult = fp.divide(10, 2);
console.log('  divide(10, 2):', divResult.fold(
  err => '错误: ' + err,
  val => '结果: ' + val
));
const divZero = fp.divide(10, 0);
console.log('  divide(10, 0):', divZero.fold(
  err => '错误: ' + err,
  val => '结果: ' + val
));

console.log('\n12. 测试生成器:');
const fib = fp.fibonacci();
console.log('  斐波那契数列前10项:', fp.take(10, fib));

console.log('\n13. 测试实际应用:');
const sumOfSquaresOfEvenNumbers = fp.compose(
  arr => fp.reduce((acc, x) => acc + x, 0, arr),
  arr => fp.map(x => x * x, arr),
  arr => fp.filter(x => x % 2 === 0, arr)
);
console.log('  偶数平方和:', sumOfSquaresOfEvenNumbers(fp.numbers));

const getActiveUserNames = fp.compose(
  arr => fp.map(user => user.name, arr),
  arr => fp.filter(user => user.active, arr)
);
console.log('  活跃用户:', getActiveUserNames(fp.users));

const getAverageAge = fp.compose(
  arr => arr.reduce((acc, age) => acc + age, 0) / arr.length,
  arr => fp.map(user => user.age, arr)
);
console.log('  平均年龄:', getAverageAge(fp.users));

console.log('\n=== 所有测试完成 ===');
