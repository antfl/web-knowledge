# React Router 示例

## 模块概述

本模块展示了如何在 React 应用中使用 React Router 实现客户端路由。React Router 是 React 生态系统中最流行的路由库，它允许你在单页应用中创建多个页面，并在它们之间进行导航，而无需重新加载整个页面。

## 功能列表

- **基本路由**：实现首页、关于页、联系页等基本页面的路由
- **嵌套路由**：实现具有子路由的复杂页面结构
- **动态路由**：支持带有参数的路由，如 `/users/:id`
- **路由参数**：获取和处理 URL 中的参数
- **查询参数**：处理 URL 中的查询参数，如 `?sort=asc&page=1`
- **路由守卫**：实现路由的权限控制和导航保护
- **导航功能**：使用 Link、NavLink 和编程式导航
- **路由动画**：添加页面切换的过渡效果
- **路由懒加载**：实现代码分割，提高应用性能
- **404 页面**：处理不存在的路由
- **重定向**：实现路由的重定向功能

## 安装和配置

### 安装依赖

```bash
npm install react-router-dom
```

### 基本配置

1. 在应用的入口文件中设置路由配置
2. 使用 `BrowserRouter` 包裹整个应用
3. 定义路由规则和对应的组件

## 示例代码结构

```
React/router/
├── App.jsx          # 主应用组件，包含路由配置
├── components/      # 路由组件
│   ├── Home.jsx     # 首页组件
│   ├── About.jsx    # 关于页组件
│   ├── Contact.jsx  # 联系页组件
│   ├── Users.jsx    # 用户列表页组件
│   ├── User.jsx     # 用户详情页组件
│   ├── Dashboard.jsx # 仪表盘组件（带嵌套路由）
│   ├── Profile.jsx  # 个人资料组件
│   ├── Settings.jsx # 设置组件
│   ├── NotFound.jsx # 404页面组件
│   └── ProtectedRoute.jsx # 路由守卫组件
├── layouts/         # 布局组件
│   └── Layout.jsx   # 主布局组件
└── README.md        # 路由文档
```

## 基本路由示例

### 主应用组件 (App.jsx)

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Users from './components/Users';
import User from './components/User';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<User />} />
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
```

### 布局组件 (Layout.jsx)

```jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

function Layout() {
  return (
    <div className="app">
      <header>
        <nav>
          <NavLink to="/" end>首页</NavLink>
          <NavLink to="/about">关于</NavLink>
          <NavLink to="/contact">联系</NavLink>
          <NavLink to="/users">用户</NavLink>
          <NavLink to="/dashboard">仪表盘</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>© 2024 React Router 示例</p>
      </footer>
    </div>
  );
}

export default Layout;
```

## 嵌套路由示例

### 仪表盘组件 (Dashboard.jsx)

```jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>仪表盘</h1>
      <nav>
        <NavLink to="profile">个人资料</NavLink>
        <NavLink to="settings">设置</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

export default Dashboard;
```

### 个人资料组件 (Profile.jsx)

```jsx
import React from 'react';

function Profile() {
  return (
    <div className="profile">
      <h2>个人资料</h2>
      <p>这是个人资料页面</p>
    </div>
  );
}

export default Profile;
```

### 设置组件 (Settings.jsx)

```jsx
import React from 'react';

function Settings() {
  return (
    <div className="settings">
      <h2>设置</h2>
      <p>这是设置页面</p>
    </div>
  );
}

export default Settings;
```

## 动态路由和参数传递

### 用户详情组件 (User.jsx)

```jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function User() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="user">
      <h1>用户详情</h1>
      <p>用户 ID: {id}</p>
      <button onClick={handleGoBack}>返回</button>
    </div>
  );
}

export default User;
```

## 路由守卫

### 路由守卫组件 (ProtectedRoute.jsx)

```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // 模拟登录状态
  const isLoggedIn = true; // 实际应用中应从状态管理或 localStorage 中获取

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

## 路由动画

可以使用 React Transition Group 或 Framer Motion 实现路由动画。以下是使用 React Transition Group 的示例：

```bash
npm install react-transition-group
```

```jsx
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Outlet, useLocation } from 'react-router-dom';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={300}
        classNames="fade"
      >
        <Outlet />
      </CSSTransition>
    </TransitionGroup>
  );
}

export default AnimatedRoutes;
```

## 路由懒加载

使用 React 的 `lazy` 和 `Suspense` 实现路由懒加载：

```jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>加载中...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
```

## 404 页面

### 404 页面组件 (NotFound.jsx)

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>您访问的页面不存在</p>
      <Link to="/">返回首页</Link>
    </div>
  );
}

export default NotFound;
```

## 最佳实践

1. **使用 `BrowserRouter`**：对于生产环境，使用 `BrowserRouter` 提供更美观的 URL
2. **使用布局组件**：将导航和页脚等公共部分提取到布局组件中
3. **使用嵌套路由**：对于复杂的页面结构，使用嵌套路由提高代码组织性
4. **实现路由守卫**：保护需要认证的路由
5. **使用路由懒加载**：提高应用的初始加载速度
6. **处理 404 页面**：为不存在的路由提供友好的错误页面
7. **使用 `NavLink`**：为活动链接提供样式
8. **合理使用 `useNavigate`**：实现编程式导航
9. **注意路由顺序**：将更具体的路由放在前面
10. **使用 `replace` 属性**：对于重定向，使用 `replace` 属性避免在历史记录中创建新条目

## 测试路由功能

1. 启动开发服务器：`npm start`
2. 访问不同的路由路径，验证页面是否正确显示
3. 测试嵌套路由和动态路由
4. 测试路由守卫和重定向功能
5. 测试 404 页面
6. 测试导航功能和链接

## 总结

React Router 是构建单页应用的强大工具，它提供了丰富的功能来处理客户端路由。通过本示例，你可以了解如何实现基本路由、嵌套路由、动态路由、路由守卫等功能，以及如何优化路由性能和用户体验。

在实际应用中，你可以根据具体需求扩展和定制路由功能，例如集成状态管理、实现更复杂的权限控制、添加更多的路由动画效果等。