# TypeScript tsconfig 配置指南

## 什么是 tsconfig.json

`tsconfig.json` 是 TypeScript 项目的配置文件，用于指定 TypeScript 编译器的编译选项和项目范围。当在项目目录中存在 `tsconfig.json` 文件时，TypeScript 编译器会使用该文件中的配置来编译项目。

## 基本结构

```json
{
  "compilerOptions": {
    // 编译选项
  },
  "include": [
    // 包含的文件
  ],
  "exclude": [
    // 排除的文件
  ],
  "files": [
    // 特定文件列表
  ],
  "references": [
    // 项目引用
  ]
}
```

## 常用编译选项

### 目标与模块

| 选项 | 描述 | 默认值 | 示例 |
|------|------|--------|------|
| `target` | 指定 ECMAScript 目标版本 | `ES3` | `"ES2020"` |
| `module` | 指定模块系统 | `CommonJS` (当 target 为 ES3 或 ES5 时) | `"ES2020"` |
| `moduleResolution` | 指定模块解析策略 | `node` | `"node"` |
| `lib` | 指定要包含的库文件 | 基于 target 自动确定 | `["ES2020", "DOM"]` |
| `allowJs` | 允许编译 JavaScript 文件 | `false` | `true` |
| `checkJs` | 检查 JavaScript 文件中的类型错误 | `false` | `true` |

### 严格模式

| 选项 | 描述 | 默认值 | 示例 |
|------|------|--------|------|
| `strict` | 启用所有严格类型检查选项 | `false` | `true` |
| `noImplicitAny` | 禁止隐式 any 类型 | `false` | `true` |
| `strictNullChecks` | 启用严格的 null 检查 | `false` | `true` |
| `strictFunctionTypes` | 启用严格的函数类型检查 | `false` | `true` |
| `strictBindCallApply` | 启用严格的 bind/call/apply 检查 | `false` | `true` |
| `strictPropertyInitialization` | 启用严格的属性初始化检查 | `false` | `true` |
| `noImplicitThis` | 禁止隐式 this 类型 | `false` | `true` |
| `useUnknownInCatchVariables` | 在 catch 子句中使用 unknown 类型 | `false` | `true` |

### 额外检查

| 选项 | 描述 | 默认值 | 示例 |
|------|------|--------|------|
| `noUnusedLocals` | 报告未使用的局部变量 | `false` | `true` |
| `noUnusedParameters` | 报告未使用的参数 | `false` | `true` |
| `noImplicitReturns` | 报告函数中所有代码路径是否都有返回值 | `false` | `true` |
| `noFallthroughCasesInSwitch` | 报告 switch 语句中的 fallthrough 情况 | `false` | `true` |
| `noUncheckedIndexedAccess` | 为索引访问添加 undefined 类型 | `false` | `true` |
| `noImplicitOverride` | 要求显式声明 override 关键字 | `false` | `true` |

### 模块解析

| 选项 | 描述 | 默认值 | 示例 |
|------|------|--------|------|
| `baseUrl` | 解析非相对模块名的基目录 | `""` | `"./src"` |
| `paths` | 模块名到基于 baseUrl 的路径映射 | `{}` | `{ "@/*": ["./src/*"] }` |
| `rootDirs` | 根目录列表，用于解析非相对模块名 | `[]` | `["./src", "./generated"]` |
| `typeRoots` | 类型声明文件的根目录列表 | `["node_modules/@types"]` | `["./types", "node_modules/@types"]` |
| `types` | 要包含的类型声明文件包 | `[]` | `["node", "jest"]` |

### 输出与源映射

| 选项 | 描述 | 默认值 | 示例 |
|------|------|--------|------|
| `outDir` | 编译输出目录 | `""` | `"./dist"` |
| `rootDir` | 源文件根目录 | 包含所有非声明输入文件的最长公共路径 | `"./src"` |
| `declaration` | 生成声明文件 (.d.ts) | `false` | `true` |
| `declarationMap` | 为声明文件生成源映射 | `false` | `true` |
| `sourceMap` | 生成源映射文件 | `false` | `true` |
| `inlineSourceMap` | 生成内联源映射 | `false` | `true` |
| `outFile` | 将所有输出文件合并为一个文件 | `""` | `"./dist/bundle.js"` |
| `removeComments` | 删除注释 | `false` | `true` |
| `noEmit` | 不生成输出文件 | `false` | `true` |
| `noEmitOnError` | 发生错误时不生成输出 | `false` | `true` |

### 实验性选项

| 选项 | 描述 | 默认值 | 示例 |
|------|------|--------|------|
| `experimentalDecorators` | 启用装饰器 | `false` | `true` |
| `emitDecoratorMetadata` | 为装饰器生成元数据 | `false` | `true` |
| `useDefineForClassFields` | 使用 ES 标准的类字段定义 | `false` (target >= ES2022 时为 true) | `true` |

## 配置示例

### 基础配置

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "lib": ["ES2018", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### React 项目配置

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "lib": ["ES2018", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### Node.js 项目配置

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "lib": ["ES2018"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
```

## 配置选项详解

### compilerOptions

`compilerOptions` 是 tsconfig.json 中最核心的部分，用于配置 TypeScript 编译器的行为。

#### target

指定编译后 JavaScript 的 ECMAScript 目标版本。不同的目标版本对应不同的 JavaScript 特性支持。

**常用值：**
- `ES3` (默认) - 兼容最旧的浏览器
- `ES5` - 兼容大多数现代浏览器
- `ES2015`/`ES6` - 支持 ES6 特性
- `ES2016` - 支持 ES2016 特性
- `ES2017` - 支持 ES2017 特性
- `ES2018` - 支持 ES2018 特性
- `ES2019` - 支持 ES2019 特性
- `ES2020` - 支持 ES2020 特性
- `ES2021` - 支持 ES2021 特性
- `ES2022` - 支持 ES2022 特性
- `ESNext` - 支持最新的 ECMAScript 特性

#### module

指定生成的模块系统。

**常用值：**
- `CommonJS` - Node.js 模块系统
- `ES2015`/`ES6` - ES6 模块系统
- `ESNext` - 最新的模块系统
- `UMD` - 通用模块定义
- `AMD` - Asynchronous Module Definition
- `System` - SystemJS 模块系统

#### strict

启用所有严格类型检查选项，等价于同时设置：
- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictFunctionTypes: true`
- `strictBindCallApply: true`
- `strictPropertyInitialization: true`
- `noImplicitThis: true`
- `useUnknownInCatchVariables: true`

#### esModuleInterop

启用 ES 模块互操作性，允许使用 `import` 语法导入 CommonJS 模块。

#### skipLibCheck

跳过对声明文件 (.d.ts) 的类型检查，提高编译速度。

#### forceConsistentCasingInFileNames

强制文件名大小写一致，防止在大小写不敏感的文件系统上出现问题。

### include 和 exclude

- `include`：指定要包含在编译中的文件模式
- `exclude`：指定要排除在编译外的文件模式

**示例：**
```json
"include": ["src/**/*"],
"exclude": ["node_modules", "dist", "**/*.test.ts"]
```

### references

用于项目引用，允许将大型项目分解为多个较小的项目。

**示例：**
```json
"references": [
  { "path": "./../shared" },
  { "path": "./../utils" }
]
```

## 命令行编译

使用 `tsc` 命令编译 TypeScript 文件：

```bash
# 使用 tsconfig.json 配置编译
npx tsc

# 编译特定文件
npx tsc index.ts

# 监视文件变化并自动编译
npx tsc --watch
```

## 常见问题

### 类型声明文件找不到

如果遇到类型声明文件找不到的问题，可以尝试：

1. 安装相应的类型声明包：`npm install --save-dev @types/package-name`
2. 检查 `typeRoots` 和 `types` 配置
3. 确保 `tsconfig.json` 位于项目根目录

### 编译速度慢

提高编译速度的方法：

1. 使用 `skipLibCheck: true` 跳过声明文件检查
2. 使用项目引用拆分大型项目
3. 减少 `include` 范围，只包含必要的文件
4. 启用增量编译：`incremental: true`

### 模块解析错误

解决模块解析错误：

1. 检查 `baseUrl` 和 `paths` 配置
2. 确保模块路径正确
3. 检查 `moduleResolution` 设置

## 总结

`tsconfig.json` 是 TypeScript 项目的重要配置文件，通过合理配置可以提高代码质量、编译速度和开发体验。根据项目类型和需求选择合适的配置选项，是 TypeScript 开发中的重要环节。

## 参考资料

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [tsconfig.json 配置参考](https://www.typescriptlang.org/tsconfig)
- [TypeScript 编译选项](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
