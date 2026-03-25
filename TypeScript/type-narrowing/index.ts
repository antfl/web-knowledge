/**
 * TypeScript 类型收窄示例
 * 本文件展示了各种类型收窄技术的实际应用
 */

// 1. typeof 类型守卫示例
/**
 * 处理字符串或数字类型的值
 * @param value 输入值，可以是字符串或数字
 * @returns 处理后的值
 */
function processValue(value: string | number): string | number {
  if (typeof value === 'string') {
    // 这里 value 被收窄为 string 类型
    return value.toUpperCase();
  } else {
    // 这里 value 被收窄为 number 类型
    return value.toFixed(2);
  }
}

// 2. instanceof 类型守卫示例
class Dog {
  /**
   * 狗的叫声方法
   * @returns 狗的叫声
   */
  bark(): string {
    return 'Woof!';
  }
}

class Cat {
  /**
   * 猫的叫声方法
   * @returns 猫的叫声
   */
  meow(): string {
    return 'Meow!';
  }
}

/**
 * 让动物发出叫声
 * @param animal 动物对象，可以是 Dog 或 Cat 实例
 * @returns 动物的叫声
 */
function makeSound(animal: Dog | Cat): string {
  if (animal instanceof Dog) {
    // 这里 animal 被收窄为 Dog 类型
    return animal.bark();
  } else {
    // 这里 animal 被收窄为 Cat 类型
    return animal.meow();
  }
}

// 3. 字面量类型收窄示例
type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * 根据方向移动
 * @param direction 移动方向
 */
function move(direction: Direction): void {
  if (direction === 'up') {
    // 这里 direction 被收窄为 'up' 类型
    console.log('Moving up');
  } else if (direction === 'down') {
    // 这里 direction 被收窄为 'down' 类型
    console.log('Moving down');
  } else if (direction === 'left') {
    // 这里 direction 被收窄为 'left' 类型
    console.log('Moving left');
  } else {
    // 这里 direction 被收窄为 'right' 类型
    console.log('Moving right');
  }
}

// 4. 真值检查示例
/**
 * 打印字符串长度
 * @param str 输入字符串，可以是 null 或 undefined
 */
function printLength(str: string | null | undefined): void {
  if (str) {
    // 这里 str 被收窄为 string 类型（排除了 null 和 undefined）
    console.log(str.length);
  } else {
    console.log('Empty string or null/undefined');
  }
}

// 5. 严格相等检查示例
/**
 * 处理可能为 null 的值
 * @param value 输入值，可以是字符串、数字或 null
 * @returns 处理后的结果
 */
function processValueWithNull(value: string | number | null): string {
  if (value === null) {
    // 这里 value 被收窄为 null 类型
    return 'Value is null';
  } else if (typeof value === 'string') {
    // 这里 value 被收窄为 string 类型
    return `String: ${value}`;
  } else {
    // 这里 value 被收窄为 number 类型
    return `Number: ${value}`;
  }
}

// 6. in 操作符类型守卫示例
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

/**
 * 让动物移动
 * @param animal 动物对象，可以是 Bird 或 Fish
 */
function moveAnimal(animal: Bird | Fish): void {
  if ('fly' in animal) {
    // 这里 animal 被收窄为 Bird 类型
    animal.fly();
  } else {
    // 这里 animal 被收窄为 Fish 类型
    animal.swim();
  }
}

// 7. 自定义类型守卫函数示例
interface DogType {
  type: 'dog';
  bark(): void;
}

interface CatType {
  type: 'cat';
  meow(): void;
}

type AnimalType = DogType | CatType;

/**
 * 检查动物是否为狗
 * @param animal 动物对象
 * @returns 是否为狗
 */
function isDog(animal: AnimalType): animal is DogType {
  return animal.type === 'dog';
}

/**
 * 让动物发出叫声（使用自定义类型守卫）
 * @param animal 动物对象
 */
function makeSoundWithGuard(animal: AnimalType): void {
  if (isDog(animal)) {
    // 这里 animal 被收窄为 DogType 类型
    animal.bark();
  } else {
    // 这里 animal 被收窄为 CatType 类型
    animal.meow();
  }
}

// 8. 类型断言示例
/**
 * 获取值的长度
 * @param value 输入值，可以是字符串或数字
 * @returns 值的长度
 */
function getLength(value: string | number): number {
  if (typeof value === 'string') {
    return value.length;
  } else {
    // 这里 value 已经被收窄为 number 类型
    return value.toString().length;
  }
}

/**
 * 处理未知类型的值
 * @param value 未知类型的值
 */
function processUnknownValue(value: unknown): void {
  // 使用类型断言将 unknown 类型断言为 string
  const str = value as string;
  console.log(str.length);
}

// 9. 可辨识联合类型示例
interface Square {
  kind: 'square';
  size: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

interface Circle {
  kind: 'circle';
  radius: number;
}

type Shape = Square | Rectangle | Circle;

/**
 * 计算形状的面积
 * @param shape 形状对象
 * @returns 面积
 */
function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case 'square':
      // 这里 shape 被收窄为 Square 类型
      return shape.size * shape.size;
    case 'rectangle':
      // 这里 shape 被收窄为 Rectangle 类型
      return shape.width * shape.height;
    case 'circle':
      // 这里 shape 被收窄为 Circle 类型
      return Math.PI * shape.radius * shape.radius;
    default:
      // 处理所有可能的情况，确保类型安全
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
  }
}

// 10. 类型保护函数示例
interface Person {
  name: string;
  age: number;
}

/**
 * 检查对象是否为 Person 类型
 * @param obj 要检查的对象
 * @returns 是否为 Person 类型
 */
function isPerson(obj: unknown): obj is Person {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'age' in obj &&
    typeof (obj as Person).name === 'string' &&
    typeof (obj as Person).age === 'number'
  );
}

/**
 * 处理对象
 * @param obj 要处理的对象
 */
function processObject(obj: unknown): void {
  if (isPerson(obj)) {
    // 这里 obj 被收窄为 Person 类型
    console.log(`Name: ${obj.name}, Age: ${obj.age}`);
  } else {
    console.log('Not a person');
  }
}

// 11. 处理可选参数示例
/**
 * 问候函数
 * @param name 名字（可选）
 */
function greet(name?: string): void {
  if (name) {
    // 这里 name 被收窄为 string 类型
    console.log(`Hello, ${name}!`);
  } else {
    console.log('Hello, stranger!');
  }
}

// 12. 处理联合类型示例
/**
 * 处理输入值
 * @param input 输入值，可以是字符串、数字或布尔值
 */
function processInput(input: string | number | boolean): void {
  if (typeof input === 'string') {
    console.log(`String input: ${input}`);
  } else if (typeof input === 'number') {
    console.log(`Number input: ${input}`);
  } else {
    console.log(`Boolean input: ${input}`);
  }
}

// 13. 处理 null 和 undefined 示例
/**
 * 获取数组的第一个元素
 * @param array 数组（可选）
 * @returns 第一个元素或 undefined
 */
function getFirstElement<T>(array: T[] | null | undefined): T | undefined {
  if (array && array.length > 0) {
    // 这里 array 被收窄为 T[] 类型
    return array[0];
  }
  return undefined;
}

// 14. 处理 unknown 类型示例
/**
 * 处理未知类型的值
 * @param value 未知类型的值
 */
function processUnknown(value: unknown): void {
  if (typeof value === 'string') {
    console.log(`String: ${value.toUpperCase()}`);
  } else if (typeof value === 'number') {
    console.log(`Number: ${value.toFixed(2)}`);
  } else if (Array.isArray(value)) {
    console.log(`Array length: ${value.length}`);
  } else {
    console.log('Other type');
  }
}

// 导出函数供其他模块使用
export {
  processValue,
  makeSound,
  move,
  printLength,
  processValueWithNull,
  moveAnimal,
  makeSoundWithGuard,
  getLength,
  processUnknownValue,
  calculateArea,
  processObject,
  greet,
  processInput,
  getFirstElement,
  processUnknown
};
