# Git 基础操作指南

## Git 简介

Git 是一个分布式版本控制系统，用于跟踪文件的变化。它是由 Linus Torvalds 开发的，主要用于源代码管理，但也可以用于跟踪任何类型文件的变化。Git 的主要特点包括：

- **分布式**：每个开发者都拥有完整的代码库副本
- **高效**：Git 设计为处理大型项目，速度快且高效
- **灵活**：支持多种工作流和分支策略
- **安全**：使用 SHA-1 哈希算法确保数据完整性

## Git 安装

### Windows

1. 从 [Git 官方网站](https://git-scm.com/downloads) 下载 Git for Windows
2. 运行安装程序，按照默认选项进行安装
3. 安装完成后，打开 Git Bash 或 Command Prompt 验证安装

```bash
git --version
```

### macOS

1. 使用 Homebrew 安装：

```bash
brew install git
```

2. 或从 [Git 官方网站](https://git-scm.com/downloads) 下载安装包

### Linux

使用包管理器安装：

```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git
```

## Git 初始化和配置

### 初始化新仓库

```bash
# 创建新目录并初始化 Git 仓库
mkdir my-project
cd my-project
git init

# 或在现有目录中初始化
cd existing-project
git init
```

### 配置 Git

```bash
# 配置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 配置默认编辑器
git config --global core.editor "code --wait"  # 使用 VS Code

# 配置差异比较工具
git config --global diff.tool vscode
git config --global difftool.vscode.cmd "code --wait --diff $LOCAL $REMOTE"

# 查看配置
git config --list
```

## Git 基本操作

### 工作区、暂存区和版本库

- **工作区**：你当前正在编辑的文件
- **暂存区**：临时保存你的更改，准备提交
- **版本库**：Git 存储所有提交的地方

### 添加文件到暂存区

```bash
# 添加单个文件
git add file.txt

# 添加多个文件
git add file1.txt file2.txt

# 添加所有修改的文件
git add .

# 添加所有修改的文件（包括删除的文件）
git add -u

# 查看暂存区状态
git status
```

### 提交更改

```bash
# 提交暂存区的更改
git commit -m "Commit message"

# 提交所有修改的文件（跳过暂存区）
git commit -am "Commit message"

# 查看提交历史
git log

# 查看最近的提交
git log -n 5

# 查看简洁的提交历史
git log --oneline
```

### 撤销更改

```bash
# 撤销工作区的更改
git checkout -- file.txt

# 撤销暂存区的更改
git reset HEAD file.txt

# 撤销最近的提交（保留更改）
git reset --soft HEAD~1

# 撤销最近的提交（丢弃更改）
git reset --hard HEAD~1
```

### 查看更改

```bash
# 查看工作区和暂存区的差异
git diff

# 查看暂存区和版本库的差异
git diff --staged

# 查看两个提交之间的差异
git diff commit1 commit2
```

## Git 分支管理

### 创建和切换分支

```bash
# 列出所有分支
git branch

# 创建新分支
git branch feature-branch

# 切换到新分支
git checkout feature-branch

# 创建并切换到新分支
git checkout -b feature-branch

# 删除分支
git branch -d feature-branch

# 强制删除分支（未合并的分支）
git branch -D feature-branch
```

### 合并分支

```bash
# 切换到目标分支
git checkout main

# 合并其他分支到当前分支
git merge feature-branch
```

### 解决冲突

当合并分支时出现冲突，Git 会标记冲突的文件。你需要手动编辑这些文件，解决冲突，然后提交更改。

```bash
# 查看冲突文件
git status

# 编辑冲突文件，解决冲突

# 标记冲突已解决
git add conflicted-file.txt

# 完成合并
git commit -m "Resolve merge conflict"
```

## Git 远程仓库操作

### 克隆远程仓库

```bash
# 克隆远程仓库
git clone https://github.com/username/repository.git

# 克隆到指定目录
git clone https://github.com/username/repository.git my-directory
```

### 添加远程仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/username/repository.git

# 查看远程仓库
git remote -v

# 重命名远程仓库
git remote rename old-name new-name

# 删除远程仓库
git remote remove origin
```

### 推送和拉取

```bash
# 推送本地分支到远程仓库
git push origin main

# 推送并设置上游分支
git push -u origin feature-branch

# 拉取远程更改
git pull origin main

# 拉取远程分支并合并
git pull origin feature-branch

# 仅获取远程更改（不合并）
git fetch origin
```

### 分支同步

```bash
# 推送所有分支
git push --all origin

# 推送所有标签
git push --tags origin

# 删除远程分支
git push origin --delete feature-branch
```

## Git 标签和发布

### 创建标签

```bash
# 创建轻量标签
git tag v1.0.0

# 创建带注释的标签
git tag -a v1.0.0 -m "Version 1.0.0"

# 查看所有标签
git tag

# 查看标签信息
git show v1.0.0
```

### 推送标签

```bash
# 推送单个标签
git push origin v1.0.0

# 推送所有标签
git push --tags origin
```

### 检出标签

```bash
# 检出标签（分离 HEAD 状态）
git checkout v1.0.0

# 基于标签创建分支
git checkout -b release-v1.0.0 v1.0.0
```

## Git 日志和历史记录

### 查看日志

```bash
# 查看完整日志
git log

# 查看简洁日志
git log --oneline

# 查看最近的 N 条日志
git log -n 10

# 查看特定作者的日志
git log --author="Your Name"

# 查看特定日期范围的日志
git log --since="2024-01-01" --until="2024-01-31"

# 查看包含特定文件的日志
git log -- file.txt
```

### 查看文件历史

```bash
# 查看文件的修改历史
git log --follow file.txt

# 查看文件的具体修改
git blame file.txt
```

### 查看提交详情

```bash
# 查看提交的详细信息
git show commit-hash

# 查看提交的文件更改
git show commit-hash --name-only

# 查看提交的具体更改
git show commit-hash file.txt
```

## Git 最佳实践

### 提交消息规范

- **标题**：简短描述（不超过 50 个字符）
- **正文**：详细描述（每行不超过 72 个字符）
- **结尾**：可选的引用 issue 或 PR

示例：

```
Add user authentication feature

- Implement login and registration forms
- Add password hashing using bcrypt
- Integrate with OAuth providers

Closes #123
```

### 分支命名规范

- **feature/feature-name**：新功能
- **bugfix/bug-description**：bug 修复
- **hotfix/critical-issue**：紧急修复
- **release/version**：发布版本
- **docs/documentation-update**：文档更新

### 工作流建议

1. **主分支（main）**：保持稳定，只用于发布
2. **开发分支（develop）**：集成所有功能开发
3. **特性分支（feature/*）**：开发新功能
4. **修复分支（bugfix/*）**：修复 bug
5. **发布分支（release/*）**：准备发布
6. **热修复分支（hotfix/*）**：紧急修复生产问题

### 性能优化

```bash
# 清理未使用的对象
git gc

# 压缩仓库
git gc --aggressive

# 修剪远程跟踪分支
git remote prune origin
```

## 常见问题和解决方案

### 1. 忘记添加文件到提交

```bash
# 补充提交
git add forgotten-file.txt
git commit --amend --no-edit
```

### 2. 提交消息错误

```bash
# 修改最近的提交消息
git commit --amend -m "New commit message"
```

### 3. 误删除文件

```bash
# 恢复删除的文件
git checkout HEAD -- deleted-file.txt
```

### 4. 撤销合并

```bash
# 撤销合并（未推送到远程）
git reset --hard HEAD~1

# 撤销合并（已推送到远程）
git revert -m 1 commit-hash
```

### 5. 解决大型文件问题

```bash
# 查看大文件
git lfs track "*.zip"
git add .gitattributes
```

### 6. 配置 SSH 密钥

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your.email@example.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 添加到 GitHub/GitLab
# 复制公钥到相应平台的 SSH 密钥设置中
```

## 总结

Git 是一个强大的版本控制系统，掌握其基础操作对于任何开发者来说都是必要的。通过本指南，你应该已经了解了 Git 的基本概念和常用命令，包括：

- Git 初始化和配置
- 基本操作（add、commit、push、pull）
- 分支管理
- 合并和解决冲突
- 远程仓库操作
- 标签和发布
- 日志和历史记录
- 最佳实践和常见问题

随着你使用 Git 的经验增加，你会发现它是一个非常灵活和强大的工具，可以帮助你更好地管理代码和协作开发。