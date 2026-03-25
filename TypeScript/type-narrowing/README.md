# TypeScript 类型收窄 (Type Narrowing)

## 什么是类型收窄

类型收窄是 TypeScript 中一种重要的类型处理技术，用于在运行时根据条件判断缩小变量的类型范围。通过类型收窄，TypeScript 编译器可以更准确地推断变量的类型，从而提供更严格的类型检查和更好的代码提示。

## 常用的类型收窄技术

### 1. typeof 类型守卫

使用 `typeof` 操作符检查变量的类型，适用于基本类型（string、number、boolean、symbol）。

**示例：**
```typescript
function processValue(value: string | number) {
  if (typeof value === 'string') {
    // 这里 value 被收窄为 string 类型
    return value.toUpperCase();
  } else {
    // 这里 value 被收窄为 number 类型
    return value.toFixed(2);
  }
}
```

### 2. instanceof 类型守卫

使用 `instanceof` 操作符检查对象是否是某个类的实例，适用于类和构造函数。

**示例：**
```typescript
class Dog {
  bark() { return 'Woof!'; }
}

class Cat {
  meow() { return 'Meow!'; }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    // 这里 animal 被收窄为 Dog 类型
    return animal.bark();
  } else {
    // 这里 animal 被收窄为 Cat 类型
    return animal.meow();
  }
}
```

### 3. 字面量类型收窄

使用常量或字面量值进行类型收窄，适用于字面量类型和联合类型。

**示例：**
```typescript
type Direction = 'up' | 'down' | 'left' | 'right';

function move(direction: Direction) {
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
```

### 4. 真值检查

使用条件语句检查变量是否为真值（truthy），适用于可能为 null 或 undefined 的变量。

**示例：**
```typescript
function printLength(str: string | null | undefined) {
  if (str) {
    // 这里 str 被收窄为 string 类型（排除了 null 和 undefined）
    console.log(str.length);
  } else {
    console.log('Empty string or null/undefined');
  }
}
```

### 5. 严格相等检查

使用 `===` 或 `!==` 进行严格相等检查，适用于任何类型。

**示例：**
```typescript
function processValue(value: string | number | null) {
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
```

### 6. in 操作符类型守卫

使用 `in` 操作符检查对象是否包含某个属性，适用于对象类型。

**示例：**
```typescript
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function move(animal: Bird | Fish) {
  if ('fly' in animal) {
    // 这里 animal 被收窄为 Bird 类型
    animal.fly();
  } else {
    // 这里 animal 被收窄为 Fish 类型
    animal.swim();
  }
}
```

### 7. 自定义类型守卫函数

创建自定义的类型守卫函数，适用于复杂的类型判断场景。

**示例：**
```typescript
interface Dog {
  type: 'dog';
  bark(): void;
}

interface Cat {
  type: 'cat';
  meow(): void;
}

type Animal = Dog | Cat;

// 自定义类型守卫函数
function isDog(animal: Animal): animal is Dog {
  return animal.type === 'dog';
}

function makeSound(animal: Animal) {
  if (isDog(animal)) {
    // 这里 animal 被收窄为 Dog 类型
    animal.bark();
  } else {
    // 这里 animal 被收窄为 Cat 类型
    animal.meow();
  }
}
```

### 8. 类型断言

使用类型断言（as 关键字）强制指定变量的类型，适用于开发者确定类型但 TypeScript 无法推断的情况。

**示例：**
```typescript
function getLength(value: string | number): number {
  if (typeof value === 'string') {
    return value.length;
  } else {
    // 这里 value 已经被收窄为 number 类型
    return value.toString().length;
  }
}

// 类型断言示例
function processValue(value: unknown) {
  // 使用类型断言将 unknown 类型断言为 string
  const str = value as string;
  console.log(str.length);
}
```

### 9. 可辨识联合类型

使用具有共同属性（判别式）的联合类型，适用于复杂的对象类型联合。

**示例：**
```typescript
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

function area(shape: Shape): number {
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
```

### 10. 类型保护函数

使用返回类型为类型谓词的函数进行类型收窄，适用于复杂的类型检查逻辑。

**示例：**
```typescript
interface Person {
  name: string;
  age: number;
}

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

function processObject(obj: unknown) {
  if (isPerson(obj)) {
    // 这里 obj 被收窄为 Person 类型
    console.log(`Name: ${obj.name}, Age: ${obj.age}`);
  } else {
    console.log('Not a person');
  }
}
```

## 类型收窄的应用场景

### 1. 处理可选参数和属性

当函数参数或对象属性是可选的时，使用类型收窄确保在使用前进行检查。

**示例：**
```typescript
function greet(name?: string) {
  if (name) {
    // 这里 name 被收窄为 string 类型
    console.log(`Hello, ${name}!`);
  } else {
    console.log('Hello, stranger!');
  }
}
```

### 2. 处理联合类型

当变量可能是多种类型之一时，使用类型收窄根据具体类型执行不同的操作。

**示例：**
```typescript
function processInput(input: string | number | boolean) {
  if (typeof input === 'string') {
    console.log(`String input: ${input}`);
  } else if (typeof input === 'number') {
    console.log(`Number input: ${input}`);
  } else {
    console.log(`Boolean input: ${input}`);
  }
}
```

### 3. 处理 null 和 undefined

使用类型收窄确保在使用可能为 null 或 undefined 的变量前进行检查。

**示例：**
```typescript
function getFirstElement<T>(array: T[] | null | undefined): T | undefined {
  if (array && array.length > 0) {
    // 这里 array 被收窄为 T[] 类型
    return array[0];
  }
  return undefined;
}
```

### 4. 处理 unknown 类型

当变量类型为 unknown 时，使用类型收窄逐步确定其具体类型。

**示例：**
```typescript
function processUnknown(value: unknown) {
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
```

## 最佳实践

1. **优先使用类型守卫**：使用 `typeof`、`instanceof`、`in` 操作符等内置类型守卫，而不是依赖类型断言。

2. **使用可辨识联合类型**：为联合类型添加判别式属性，使类型收窄更清晰。

3. **编写自定义类型守卫**：对于复杂的类型检查逻辑，创建自定义类型守卫函数。

4. **处理所有情况**：在 switch 语句中使用 default 分支，确保覆盖所有可能的类型。

5. **使用 never 类型**：在 default 分支中使用 never 类型，确保类型检查的完整性。

6. **避免过度使用类型断言**：类型断言会绕过 TypeScript 的类型检查，应谨慎使用。

## 常见问题

### 1. 类型收窄不生效

**原因**：类型守卫条件不够精确，或者 TypeScript 无法推断类型。

**解决方法**：
- 使用更精确的类型守卫条件
- 编写自定义类型守卫函数
- 确保类型定义正确

### 2. 类型收窄范围过大

**原因**：类型守卫条件过于宽松，导致类型收窄不够精确。

**解决方法**：
- 使用更具体的类型守卫条件
- 结合多种类型守卫技术

### 3. 类型收窄后仍然报错

**原因**：TypeScript 编译器的类型推断有局限性，或者代码逻辑存在问题。

**解决方法**：
- 检查类型定义是否正确
- 使用类型断言（作为最后的手段）
- 重构代码结构，使类型推断更清晰

## 总结

类型收窄是 TypeScript 中一项强大的功能，通过在运行时根据条件判断缩小变量的类型范围，提高了代码的类型安全性和可读性。掌握各种类型收窄技术，并在合适的场景中应用它们，可以写出更健壮、更可维护的 TypeScript 代码。

## 参考资料

- [TypeScript 官方文档 - 类型收窄](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript 类型守卫](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)
- [TypeScript 可辨识联合类型](https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions)
