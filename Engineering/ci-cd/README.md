# CI/CD 持续集成与持续部署

## 什么是 CI/CD？

CI/CD 是 **持续集成**（Continuous Integration）和 **持续部署**（Continuous Deployment）的缩写，是现代软件开发中的重要实践。

- **持续集成（CI）**：开发人员频繁地将代码集成到共享仓库中，每次集成都会自动运行构建和测试，确保代码质量。
- **持续部署（CD）**：通过自动化流程，将通过测试的代码自动部署到生产环境或预生产环境。

## 为什么需要 CI/CD？

1. **提高代码质量**：自动化测试可以及时发现问题
2. **减少人工错误**：自动化流程减少了手动操作的风险
3. **加快交付速度**：代码变更可以快速部署到生产环境
4. **增强团队协作**：团队成员可以更频繁地集成代码
5. **降低部署风险**：小批次部署比大批量部署更安全

## 配置模板使用说明

本目录提供了多种 CI/CD 工具的配置模板，位于 `templates/` 目录下：

### GitHub Actions 配置模板

- `github-actions-basic.yml` - 基础前端项目配置
- `github-actions-code-quality.yml` - 包含代码质量检查的配置
- `github-actions-multi-env.yml` - 多环境部署配置

### GitLab CI 配置模板

- `gitlab-ci-basic.yml` - 基础前端项目配置
- `gitlab-ci-code-quality.yml` - 包含代码质量检查的配置
- `gitlab-ci-multi-env.yml` - 多环境部署配置

### Jenkins 配置模板

- `jenkins-basic.groovy` - 基础 Jenkins 流水线配置

### 如何使用配置模板

1. **GitHub Actions**：
   - 在项目根目录创建 `.github/workflows/` 目录
   - 复制 `templates/github-actions-*.yml` 文件到该目录
   - 根据项目需求修改配置（如分支名称、构建命令等）
   - 提交到 GitHub 仓库

2. **GitLab CI**：
   - 复制 `templates/gitlab-ci-*.yml` 文件到项目根目录
   - 重命名为 `.gitlab-ci.yml`
   - 根据项目需求修改配置
   - 提交到 GitLab 仓库

3. **Jenkins**：
   - 复制 `templates/jenkins-basic.groovy` 文件
   - 在 Jenkins 中创建新的 Pipeline 任务
   - 将配置内容粘贴到 Pipeline 脚本中
   - 根据项目需求修改配置

### 配置文件说明

所有配置模板都包含详细的注释说明，帮助你理解每个配置项的作用。配置文件中的敏感信息（如 FTP 密码）需要通过环境变量或密钥管理工具进行配置。

## 常用 CI/CD 工具

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| GitHub Actions | 与 GitHub 无缝集成，免费额度充足 | GitHub 仓库 |
| GitLab CI/CD | 与 GitLab 集成，功能强大 | GitLab 仓库 |
| Jenkins | 开源、可扩展，高度自定义 | 大型项目，需要复杂流程 |
| CircleCI | 速度快，配置简单 | 中小型项目 |
| Travis CI | 配置简单，社区活跃 | 开源项目 |

## GitHub Actions 详解

### 基本概念

- **Workflow**：工作流，一个完整的 CI/CD 流程
- **Job**：任务，工作流中的一个步骤
- **Step**：步骤，任务中的具体操作
- **Action**：动作，可复用的步骤

### 配置文件结构

GitHub Actions 的配置文件位于 `.github/workflows/` 目录下，使用 YAML 格式。

### 示例：前端项目 CI/CD 配置

```yaml
name: CI/CD

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 关键配置项

1. **触发条件**：通过 `on` 配置何时触发工作流
2. **运行环境**：通过 `runs-on` 指定运行环境
3. **步骤**：通过 `steps` 定义具体操作
4. **环境变量**：通过 `env` 或 `secrets` 管理敏感信息
5. **条件执行**：通过 `if` 条件控制步骤执行

## GitLab CI/CD 详解

### 基本概念

- **Pipeline**：流水线，一个完整的 CI/CD 流程
- **Job**：任务，流水线中的一个步骤
- **Stage**：阶段，多个相关任务的集合

### 配置文件结构

GitLab CI/CD 的配置文件是项目根目录下的 `.gitlab-ci.yml` 文件。

### 示例：前端项目 CI/CD 配置

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:16
  script:
    - npm install
    - npm test
  only:
    - main
    - merge_requests

build:
  stage: build
  image: node:16
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache lftp
    - lftp -u $FTP_USER,$FTP_PASS -e "mirror -R dist/ /public_html/; quit" $FTP_HOST
  only:
    - main
```

### 关键配置项

1. **阶段**：通过 `stages` 定义流水线阶段
2. **任务**：定义每个阶段的具体任务
3. **镜像**：通过 `image` 指定运行环境
4. **脚本**：通过 `script` 定义执行命令
5. **制品**：通过 `artifacts` 保存构建结果
6. **触发条件**：通过 `only` 或 `rules` 控制执行条件

## CI/CD 最佳实践

### 1. 保持构建快速

- 缓存依赖项
- 并行执行任务
- 只构建必要的内容

### 2. 确保测试覆盖率

- 集成单元测试
- 集成端到端测试
- 集成代码质量检查

### 3. 安全配置

- 使用 secrets 管理敏感信息
- 定期更新依赖项
- 扫描代码漏洞

### 4. 环境管理

- 分离开发、测试、生产环境
- 环境配置标准化
- 自动化环境部署

### 5. 监控与反馈

- 集成日志监控
- 集成性能监控
- 配置构建通知

## 常见问题与解决方案

### 1. 构建失败

**问题**：依赖安装失败
**解决方案**：检查网络连接，使用缓存，指定固定版本

**问题**：测试失败
**解决方案**：修复测试用例，检查代码逻辑

### 2. 部署问题

**问题**：部署权限不足
**解决方案**：检查部署凭证，确保权限正确

**问题**：部署超时
**解决方案**：优化部署脚本，增加超时时间

### 3. 性能问题

**问题**：构建时间过长
**解决方案**：优化构建过程，使用并行构建

**问题**：资源占用过高
**解决方案**：合理配置构建资源，使用缓存

## 实际项目案例

### 前端项目 CI/CD 流程

1. **代码提交**：开发人员提交代码到 Git 仓库
2. **CI 触发**：自动运行构建和测试
3. **质量检查**：代码质量分析，测试覆盖率检查
4. **构建产物**：生成生产环境构建产物
5. **CD 部署**：自动部署到测试环境或生产环境
6. **监控反馈**：部署后监控应用状态

### 集成第三方服务

- **代码质量**：SonarQube, Codecov
- **安全扫描**：Snyk, Dependabot
- **部署平台**：Vercel, Netlify, AWS

## 学习资源

- [GitHub Actions 官方文档](https://docs.github.com/cn/actions)
- [GitLab CI/CD 官方文档](https://docs.gitlab.cn/jh/ci/README.html)
- [Jenkins 官方文档](https://www.jenkins.io/zh/doc/)
- [CI/CD 实践指南](https://www.redhat.com/zh/topics/devops/what-is-ci-cd)

## 总结

CI/CD 是现代软件开发的重要实践，通过自动化构建、测试和部署流程，可以提高代码质量、加快交付速度、减少人工错误。选择适合的 CI/CD 工具，并根据项目特点进行配置，可以显著提升开发效率和产品质量。

对于初学者来说，建议从 GitHub Actions 或 GitLab CI/CD 开始，它们与代码仓库集成紧密，配置相对简单，适合快速上手。随着经验的积累，可以逐步探索更复杂的 CI/CD 场景和工具。