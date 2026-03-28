# Monorepo 工程化实践

## 概述

Monorepo（单一代码仓库）是一种将多个项目代码存储在同一个仓库中的开发模式。它适用于大型项目、组件库、工具链等场景，能够提高代码复用性、简化依赖管理和统一构建流程。

## 为什么选择 Monorepo

### 优势

- **代码共享**：不同项目之间可以轻松共享代码
- **统一依赖**：统一管理依赖版本，避免版本冲突
- **原子提交**：跨项目的修改可以在一个提交中完成
- **统一构建**：统一的构建流程和工具链
- **简化协作**：团队成员可以在一个仓库中协作

### 适用场景

- 大型前端项目
- 组件库开发
- 工具链项目
- 微前端架构
- 全栈项目

### 不适用场景

- 小型项目
- 独立性很强的项目
- 需要严格权限隔离的项目

## Monorepo 工具对比

| 工具 | 特点 | 适用场景 | 学习成本 |
|------|------|----------|----------|
| pnpm workspace | 轻量、高效、磁盘空间优化 | 中小型项目 | 低 |
| Yarn workspace | 成熟、生态丰富 | 中大型项目 | 中 |
| Nx | 功能强大、智能构建 | 大型项目 | 高 |
| Turborepo | 高性能构建、远程缓存 | 超大型项目 | 中 |
| Rush | 微软出品、企业级 | 企业级项目 | 高 |
| Lerna | 老牌工具、版本管理 | 传统项目 | 中 |

## pnpm Workspace

### 基本概念

pnpm workspace 是 pnpm 内置的 monorepo 解决方案，通过符号链接和硬链接优化磁盘空间使用。

### 目录结构

```
my-monorepo/
├── packages/
│   ├── ui/                 # UI 组件库
│   ├── utils/              # 工具函数
│   └── core/               # 核心逻辑
├── apps/
│   ├── web/                # Web 应用
│   └── admin/              # 管理后台
├── package.json            # 根 package.json
├── pnpm-workspace.yaml     # pnpm workspace 配置
└── pnpm-lock.yaml          # 锁定文件
```

### 快速开始

#### 1. 初始化项目

```bash
# 创建项目目录
mkdir my-monorepo && cd my-monorepo

# 初始化 package.json
pnpm init

# 创建 pnpm-workspace.yaml
echo "packages:\n  - 'packages/*'\n  - 'apps/*'" > pnpm-workspace.yaml
```

#### 2. 配置 package.json

```json
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "pnpm -r run build",
    "dev": "pnpm --filter web dev",
    "test": "pnpm -r run test",
    "lint": "pnpm -r run lint",
    "clean": "pnpm -r exec rm -rf node_modules dist"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### 3. 创建子包

```bash
# 创建 packages/ui
mkdir -p packages/ui
cd packages/ui
pnpm init

# 配置 packages/ui/package.json
{
  "name": "@my-monorepo/ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

#### 4. 包之间依赖

```bash
# 在 apps/web 中依赖 packages/ui
cd apps/web
pnpm add @my-monorepo/ui --workspace
```

### 常用命令

```bash
# 安装所有依赖
pnpm install

# 在特定包中运行命令
pnpm --filter @my-monorepo/ui build

# 在所有包中运行命令
pnpm -r run build

# 并行运行命令
pnpm --parallel run dev

# 按依赖顺序运行命令
pnpm -r --workspace-concurrency=1 run build

# 添加依赖到根目录
pnpm add -D typescript -w

# 添加依赖到特定包
pnpm --filter @my-monorepo/ui add lodash

# 更新依赖
pnpm update

# 清理 node_modules
pnpm -r exec rm -rf node_modules
```

### 高级配置

#### 过滤配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'  # 排除 test 目录
```

#### 共享配置

```json
// package.json
{
  "pnpm": {
    "overrides": {
      "typescript": "^5.0.0"
    },
    "peerDependencyRules": {
      "ignoreMissing": ["@types/node"]
    }
  }
}
```

## Yarn Workspace

### 基本概念

Yarn workspace 是 Yarn 提供的 monorepo 解决方案，支持 Yarn 1.x 和 Yarn 2.x/3.x (Berry)。

### 快速开始

#### 1. 初始化项目

```bash
# 创建项目目录
mkdir my-monorepo && cd my-monorepo

# 初始化 package.json
yarn init -y

# 启用 workspace
yarn config set workspaces-experimental true  # Yarn 1.x
```

#### 2. 配置 package.json

```json
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "build": "yarn workspaces run build",
    "test": "yarn workspaces run test"
  }
}
```

#### 3. 常用命令

```bash
# 安装所有依赖
yarn install

# 在特定 workspace 中运行命令
yarn workspace @my-monorepo/ui build

# 在所有 workspaces 中运行命令
yarn workspaces run build

# 添加依赖到根目录
yarn add -D typescript -W

# 添加依赖到特定 workspace
yarn workspace @my-monorepo/ui add lodash

# 更新依赖
yarn upgrade-interactive
```

### Yarn 2.x/3.x (Berry)

#### 特点

- Plug'n'Play (PnP)：零安装，更快的启动速度
- 约束：可以定义 workspace 之间的依赖规则
- 更好的缓存机制

#### 配置

```bash
# 启用 Yarn Berry
yarn set version stable

# 配置 .yarnrc.yml
nodeLinker: node-modules  # 或 pnp

plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-workspace-tools.cjs
    spec: "@yarnpkg/plugin-workspace-tools"
```

## Nx

### 基本概念

Nx 是一个功能强大的 monorepo 工具，提供智能构建、代码生成、项目图分析等功能。

### 快速开始

#### 1. 安装 Nx

```bash
# 全局安装
npm install -g nx

# 或使用 npx
npx create-nx-workspace@latest
```

#### 2. 创建 workspace

```bash
npx create-nx-workspace@latest my-workspace --preset=ts
```

#### 3. 添加项目

```bash
# 生成库
nx g @nx/js:lib utils

# 生成应用
nx g @nx/react:app web

# 生成组件
nx g @nx/react:component button --project=ui
```

#### 4. 常用命令

```bash
# 构建项目
nx build web

# 运行测试
nx test utils

# 运行 lint
nx lint web

# 运行 affected 项目
nx affected:build

# 查看项目图
nx graph

# 运行多个目标
nx run-many -t build -p web admin
```

### 核心概念

#### 项目图

Nx 会自动分析项目之间的依赖关系，构建项目图。

```bash
# 查看项目图
nx graph

# 查看 affected 项目
nx affected:graph
```

#### 缓存

Nx 支持构建缓存，可以大幅提升构建速度。

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint"]
      }
    }
  }
}
```

#### 代码生成

Nx 提供丰富的代码生成器。

```bash
# 查看所有生成器
nx list

# 生成 React 组件
nx g @nx/react:component my-component --project=my-app

# 生成 Vue 组件
nx g @nx/vue:component my-component --project=my-app
```

## Turborepo

### 基本概念

Turborepo 是 Vercel 推出的高性能 monorepo 工具，专注于构建优化。

### 快速开始

#### 1. 创建项目

```bash
npx create-turbo@latest
```

#### 2. 配置 turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

#### 3. 常用命令

```bash
# 构建所有项目
turbo run build

# 并行运行
turbo run lint test build

# 过滤项目
turbo run build --filter=web

# 查看依赖图
turbo run build --graph

# 远程缓存
turbo run build --team=my-team --token=my-token
```

### 核心特性

#### 管道配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "deploy": {
      "dependsOn": ["build", "test", "lint"]
    }
  }
}
```

#### 远程缓存

```bash
# 登录 Vercel
turbo login

# 链接到团队
turbo link

# 使用远程缓存
turbo run build
```

## Changesets 版本管理

### 基本概念

Changesets 是一个用于管理 monorepo 版本和变更日志的工具。

### 快速开始

#### 1. 安装

```bash
pnpm add -D @changesets/cli
```

#### 2. 初始化

```bash
npx changeset init
```

#### 3. 添加变更

```bash
# 添加 changeset
npx changeset

# 选择受影响的包
# 选择版本类型 (major/minor/patch)
# 编写变更描述
```

#### 4. 版本发布

```bash
# 更新版本号
npx changeset version

# 发布
npx changeset publish
```

### 配置

```json
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

## 实战案例

### 案例一：组件库 Monorepo

#### 项目结构

```
ui-monorepo/
├── packages/
│   ├── core/               # 核心组件
│   ├── icons/              # 图标库
│   ├── theme/              # 主题系统
│   └── docs/               # 文档站点
├── apps/
│   ├── playground/         # 组件 playground
│   └── storybook/          # Storybook 文档
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── .changeset/
```

#### 配置示例

```json
// package.json
{
  "name": "ui-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.26.0",
    "turbo": "^1.10.0"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "!.next/cache/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 案例二：全栈项目 Monorepo

#### 项目结构

```
fullstack-monorepo/
├── packages/
│   ├── shared-types/       # 共享类型定义
│   ├── shared-utils/       # 共享工具函数
│   └── database/           # 数据库模型
├── apps/
│   ├── web/                # 前端应用 (Next.js)
│   ├── api/                # 后端 API (NestJS)
│   └── mobile/             # 移动端 (React Native)
├── package.json
├── pnpm-workspace.yaml
└── docker-compose.yml
```

#### Docker 配置

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "4000:4000"
  database:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
```

### 案例三：微前端 Monorepo

#### 项目结构

```
micro-frontend-monorepo/
├── packages/
│   ├── shared-components/  # 共享组件
│   ├── shared-utils/       # 共享工具
│   └── shell/              # 主应用 shell
├── apps/
│   ├── app-main/           # 主应用
│   ├── app-dashboard/      # 仪表盘应用
│   └── app-settings/       # 设置应用
├── package.json
└── pnpm-workspace.yaml
```

#### Module Federation 配置

```javascript
// apps/app-main/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'main',
      remotes: {
        dashboard: 'dashboard@http://localhost:3001/remoteEntry.js',
        settings: 'settings@http://localhost:3002/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
```

## 最佳实践

### 1. 目录结构规范

```
my-monorepo/
├── apps/                   # 应用项目
│   ├── web/
│   ├── admin/
│   └── api/
├── packages/               # 共享包
│   ├── ui/                 # UI 组件库
│   ├── utils/              # 工具函数
│   ├── types/              # 类型定义
│   └── config/             # 共享配置
├── tools/                  # 工具脚本
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── .changeset/
```

### 2. 命名规范

- 包名使用 `@组织名/包名` 格式
- 应用使用短横线连接：`my-app`
- 库使用短横线连接：`my-utils`

### 3. 依赖管理

```json
// 根 package.json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}

// 子包 package.json
{
  "dependencies": {
    "@my-monorepo/utils": "workspace:*"
  }
}
```

### 4. 脚本规范

```json
{
  "scripts": {
    "build": "构建项目",
    "dev": "开发模式",
    "test": "运行测试",
    "lint": "代码检查",
    "type-check": "类型检查",
    "clean": "清理构建产物"
  }
}
```

### 5. CI/CD 配置

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm run test
      - run: pnpm run lint
```

## 常见问题

### Q1: 如何解决依赖冲突？

**答案**：使用 pnpm overrides 或 Yarn resolutions

```json
{
  "pnpm": {
    "overrides": {
      "typescript": "^5.0.0"
    }
  }
}
```

### Q2: 如何管理私有包？

**答案**：配置 .npmrc 或使用私有 registry

```ini
# .npmrc
@mycompany:registry=https://npm.mycompany.com
```

### Q3: 如何优化构建速度？

**答案**：
1. 使用 Turborepo 或 Nx 的缓存功能
2. 配置远程缓存
3. 并行构建
4. 增量构建

### Q4: 如何处理循环依赖？

**答案**：
1. 重构代码，提取公共部分
2. 使用依赖注入
3. 延迟加载

### Q5: 如何管理环境变量？

**答案**：使用 dotenv 或框架内置的环境变量管理

```javascript
// apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 总结

Monorepo 是现代前端工程化的重要组成部分，选择合适的工具可以大幅提升开发效率：

- **小型项目**：pnpm workspace
- **中型项目**：Yarn workspace + Turborepo
- **大型项目**：Nx
- **超大型项目**：Turborepo + 远程缓存

掌握 Monorepo 的开发模式，对于构建大型前端项目和组件库至关重要。
