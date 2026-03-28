/**
 * Monorepo 配置文件示例
 * 包含 pnpm workspace、Yarn workspace、Nx、Turborepo 的配置
 */

// ============================================
// pnpm Workspace 配置
// ============================================

const pnpmWorkspaceConfig = `
# pnpm-workspace.yaml
packages:
  # 包含所有 packages 目录下的包
  - 'packages/*'
  # 包含所有 apps 目录下的应用
  - 'apps/*'
  # 包含 tools 目录下的工具
  - 'tools/*'
  # 排除 test 目录
  - '!**/test/**'
  # 排除 node_modules
  - '!**/node_modules/**'
`;

// ============================================
// Yarn Workspace 配置
// ============================================

const yarnWorkspaceConfig = {
  name: "my-monorepo",
  version: "1.0.0",
  private: true,
  workspaces: [
    "packages/*",
    "apps/*",
    "tools/*"
  ],
  scripts: {
    build: "yarn workspaces run build",
    test: "yarn workspaces run test",
    lint: "yarn workspaces run lint",
    clean: "yarn workspaces run clean"
  },
  devDependencies: {
    typescript: "^5.0.0",
    eslint: "^8.0.0",
    prettier: "^3.0.0"
  }
};

// ============================================
// Nx 配置
// ============================================

const nxConfig = {
  // nx.json
  extends: "nx/presets/npm.json",
  npmScope: "my-monorepo",
  tasksRunnerOptions: {
    default: {
      runner: "nx/tasks-runners/default",
      options: {
        cacheableOperations: ["build", "test", "lint", "e2e"],
        parallel: 3
      }
    }
  },
  targetDefaults: {
    build: {
      dependsOn: ["^build"],
      inputs: ["production", "^production"]
    },
    test: {
      inputs: ["default", "^production", "{workspaceRoot}/jest.preset.js"]
    },
    lint: {
      inputs: [
        "default",
        "{workspaceRoot}/.eslintrc.json",
        "{workspaceRoot}/.eslintignore"
      ]
    }
  },
  namedInputs: {
    default: ["{projectRoot}/**/*", "sharedGlobals"],
    production: [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/jest.config.[jt]s",
      "!{projectRoot}/.eslintrc.json"
    ],
    sharedGlobals: []
  },
  workspaceLayout: {
    appsDir: "apps",
    libsDir: "packages"
  },
  pluginsConfig: {
    "@nx/js": {
      analyzeSourceFiles: true
    }
  }
};

// ============================================
// Turborepo 配置
// ============================================

const turboConfig = {
  $schema: "https://turbo.build/schema.json",
  globalDependencies: [
    "**/.env.*local",
    "tsconfig.json"
  ],
  globalEnv: [
    "NODE_ENV",
    "API_URL"
  ],
  pipeline: {
    build: {
      dependsOn: ["^build"],
      outputs: [
        ".next/**",
        "!.next/cache/**",
        "dist/**",
        "build/**"
      ]
    },
    test: {
      dependsOn: ["build"],
      outputs: ["coverage/**"],
      inputs: [
        "src/**/*.tsx",
        "src/**/*.ts",
        "test/**/*.ts",
        "test/**/*.tsx"
      ]
    },
    lint: {
      inputs: [
        "src/**/*.ts",
        "src/**/*.tsx",
        "*.config.js"
      ]
    },
    typecheck: {
      dependsOn: ["^build"]
    },
    dev: {
      cache: false,
      persistent: true
    },
    clean: {
      cache: false
    },
    deploy: {
      dependsOn: ["build", "test", "lint"]
    }
  }
};

// ============================================
// Changesets 配置
// ============================================

const changesetConfig = {
  $schema: "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  changelog: "@changesets/cli/changelog",
  commit: false,
  fixed: [],
  linked: [],
  access: "restricted",
  baseBranch: "main",
  updateInternalDependencies: "patch",
  ignore: [],
  privatePackages: {
    version: true,
    tag: true
  }
};

// ============================================
// 包配置模板
// ============================================

const packageTemplate = {
  name: "@my-monorepo/package-name",
  version: "1.0.0",
  description: "Package description",
  main: "dist/index.js",
  module: "dist/index.mjs",
  types: "dist/index.d.ts",
  files: [
    "dist",
    "README.md"
  ],
  scripts: {
    build: "tsup src/index.ts --format cjs,esm --dts",
    dev: "tsup src/index.ts --format cjs,esm --dts --watch",
    test: "vitest",
    lint: "eslint src/**/*.ts",
    typecheck: "tsc --noEmit",
    clean: "rm -rf dist"
  },
  dependencies: {},
  devDependencies: {
    typescript: "^5.0.0",
    tsup: "^7.0.0",
    vitest: "^0.34.0",
    eslint: "^8.0.0"
  },
  peerDependencies: {},
  publishConfig: {
    access: "public"
  }
};

// ============================================
// TypeScript 配置
// ============================================

const tsConfig = {
  compilerOptions: {
    target: "ES2020",
    lib: ["ES2020"],
    module: "ESNext",
    moduleResolution: "bundler",
    resolveJsonModule: true,
    allowJs: true,
    checkJs: true,
    declaration: true,
    declarationMap: true,
    sourceMap: true,
    outDir: "./dist",
    removeComments: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    noImplicitAny: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    strictBindCallApply: true,
    strictPropertyInitialization: true,
    noImplicitThis: true,
    alwaysStrict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    skipLibCheck: true
  },
  include: ["src/**/*"],
  exclude: ["node_modules", "dist", "**/*.test.ts"]
};

// ============================================
// ESLint 配置
// ============================================

const eslintConfig = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  },
  ignorePatterns: [
    "dist",
    "node_modules",
    "*.config.js"
  ]
};

// ============================================
// Prettier 配置
// ============================================

const prettierConfig = {
  semi: true,
  trailingComma: "es5",
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "lf"
};

// ============================================
// GitHub Actions CI/CD 配置
// ============================================

const ciConfig = `
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Type check
        run: pnpm run type-check
      
      - name: Lint
        run: pnpm run lint
      
      - name: Test
        run: pnpm run test
      
      - name: Build
        run: pnpm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: matrix.node-version == '18.x'
`;

// ============================================
// Docker 配置
// ============================================

const dockerConfig = `
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm && pnpm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
`;

// ============================================
// 导出所有配置
// ============================================

module.exports = {
  pnpmWorkspaceConfig,
  yarnWorkspaceConfig,
  nxConfig,
  turboConfig,
  changesetConfig,
  packageTemplate,
  tsConfig,
  eslintConfig,
  prettierConfig,
  ciConfig,
  dockerConfig
};

// ============================================
// 使用示例
// ============================================

console.log('Monorepo 配置示例已加载');
console.log('可用配置：');
console.log('- pnpmWorkspaceConfig: pnpm workspace 配置');
console.log('- yarnWorkspaceConfig: Yarn workspace 配置');
console.log('- nxConfig: Nx 配置');
console.log('- turboConfig: Turborepo 配置');
console.log('- changesetConfig: Changesets 配置');
console.log('- packageTemplate: 包模板');
console.log('- tsConfig: TypeScript 配置');
console.log('- eslintConfig: ESLint 配置');
console.log('- prettierConfig: Prettier 配置');
console.log('- ciConfig: CI/CD 配置');
console.log('- dockerConfig: Docker 配置');
