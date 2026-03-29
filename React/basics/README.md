# React 基础

## 什么是 React？

React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发并维护。它采用组件化的开发方式，让开发者可以构建可复用的 UI 组件，并通过虚拟 DOM 提高性能的渲染。

## React 的核心特点

1. **组件化**：将 UI 拆分为独立的、可复用的组件
2. **声明式**：通过描述 UI 应该是什么样子来构建界面
3. **虚拟 DOM**：通过虚拟 DOM 提高渲染性能
4. **单向数据流**：数据从父组件流向子组件
5. **生态丰富**：拥有大量的第三方库和工具

## React 核心概念

### 1. JSX 语法

JSX 是 JavaScript 的扩展语法，允许在 JavaScript 中编写类似 HTML 的代码。

```jsx
// JSX 语法
const element = <h1>Hello, React!</h1>;

// 编译后
const element = React.createElement('h1', null, 'Hello, React!');
```

**JSX 特点**：
- 可以在 JSX 中使用 JavaScript 表达式
- 可以使用任意有效的 JavaScript 表达式
- 属性名使用驼峰命名法
- 可以使用大括号 `{}` 嵌入 JavaScript 表达式

### 2. 组件

组件是 React 的核心概念，是 UI 的构建块。组件可以是函数组件或类组件。

#### 函数组件

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 使用
<Welcome name="React" />
```

#### 类组件

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 使用
<Welcome name="React" />
```

### 3. Props

Props（属性）是组件的输入，用于从父组件向子组件传递数据。

```jsx
// 父组件
function App() {
  return <UserCard name="张三" age={25} />;
}

// 子组件
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>年龄: {props.age}</p>
    </div>
  );
}
```

**Props 特点**：
- 只读，不能在子组件中修改
- 从父组件传递到子组件
- 可以传递任何 JavaScript 值

### 4. State

State（状态）是组件内部的数据，可以在组件内部修改。

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>计数: {this.state.count}</p>
        <button onClick={this.increment}>增加</button>
      </div>
    );
  }
}
```

**State 特点**：
- 组件内部的数据
- 可以通过 `setState` 修改
- 修改 State 会触发重新渲染

### 5. 生命周期

生命周期方法允许在组件的不同阶段执行代码。

#### 类组件生命周期

```jsx
class LifecycleComponent extends React.Component {
  // 挂载阶段
  componentDidMount() {
    console.log('组件已挂载');
    // 发起 API 请求
    // 订阅事件
  }

  // 更新阶段
  componentDidUpdate(prevProps, prevState) {
    console.log('组件已更新');
    // 根据更新执行操作
  }

  // 卸载阶段
  componentWillUnmount() {
    console.log('组件即将卸载');
    // 清理定时器
    // 取消订阅
  }

  render() {
    return <div>生命周期示例</div>;
  }
}
```

#### Hooks 生命周期

```jsx
import { useEffect } from 'react';

function LifecycleComponent() {
  useEffect(() => {
    console.log('组件已挂载');
    
    // 发起 API 请求
    // 订阅事件
    
    return () => {
      console.log('组件即将卸载');
      // 清理定时器
      // 取消订阅
    };
  }, []);

  return <div>生命周期示例</div>;
}
```

### 6. 事件处理

React 使用驼峰命名法来处理事件。

```jsx
function Button() {
  const handleClick = (e) => {
    e.preventDefault();
    console.log('按钮被点击');
  };

  return (
    <div>
      <button onClick={handleClick}>点击我</button>
      <input onChange={(e) => console.log(e.target.value)} />
    </div>
  );
}
```

**常见事件**：
- `onClick` - 点击事件
- `onChange` - 值变化事件
- `onSubmit` - 表单提交事件
- `onFocus` - 获得焦点事件
- `onBlur` - 失去焦点事件

### 7. 条件渲染

根据条件渲染不同的 UI。

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>欢迎回来！</h1>;
  }
  return <h1>请登录</h1>;
}

// 使用三元运算符
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <h1>欢迎回来！</h1> : <h1>请登录</h1>}
    </div>
  );
}

// 使用逻辑与运算符
function UserList({ users }) {
  return (
    <div>
      {users.length > 0 && <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>}
    </div>
  );
}
```

### 8. 列表渲染

使用 `map` 方法渲染列表。

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

**注意事项**：
- 必须为每个列表项提供唯一的 `key` 属性
- `key` 应该是稳定的、可预测的值

### 9. 表单处理

处理表单输入和提交。

```jsx
function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('表单提交:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">登录</button>
    </form>
  );
}
```

### 10. 受控组件

受控组件的值由 React 的 state 控制。

```jsx
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### 11. 非受控组件

非受控组件的值由 DOM 控制。

```jsx
function UncontrolledInput() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('输入值:', inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
      <button type="submit">提交</button>
    </form>
  );
}
```

## React Hooks

Hooks 是 React 16.8 引入的新特性，让你在不编写类组件的情况下使用 state 和其他 React 特性。

### useState

用于在函数组件中添加状态。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

### useEffect

用于处理副作用，如数据获取、订阅、手动修改 DOM 等。

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(data => setUser(data));
  }, [userId]);

  if (!user) return <div>加载中...</div>;

  return <div>{user.name}</div>;
}
```

### useContext

用于在组件树中传递数据，避免 props 传递。

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div style={{ background: theme }}>工具栏</div>;
}
```

### useReducer

用于管理复杂的状态逻辑。

```jsx
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>计数: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>增加</button>
    </div>
  );
}
```

### useRef

用于在函数组件中访问 DOM 或保持可变值。

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  const onButtonClick = () => {
    inputEl.current.focus();
  };

  return (
    <div>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>聚焦输入框</button>
    </div>
  );
}
```

### useMemo

用于性能优化，缓存计算结果。

```jsx
function ExpensiveComponent({ data }) {
  const expensiveValue = useMemo(() => {
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);

  return <div>计算结果: {expensiveValue}</div>;
}
```

### useCallback

用于性能优化，缓存函数引用。

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return <ChildComponent onClick={handleClick} />;
}
```

## React 最佳实践

### 1. 组件设计原则

- **单一职责**：每个组件只负责一个功能
- **可复用性**：设计可复用的组件
- **组件组合**：通过组合构建复杂 UI
- **Props 向下**：数据从父组件流向子组件

### 2. 性能优化

- **使用 React.memo**：避免不必要的重新渲染
- **使用 useMemo**：缓存计算结果
- **使用 useCallback**：缓存函数引用
- **代码分割**：使用 React.lazy 和 Suspense
- **虚拟列表**：处理大量数据渲染

### 3. 代码组织

- **按功能组织**：将相关组件放在同一目录
- **分离关注点**：将逻辑和 UI 分离
- **使用自定义 Hooks**：提取可复用的逻辑
- **保持组件简洁**：复杂逻辑提取到自定义 Hooks

### 4. 错误处理

- **错误边界**：捕获组件树中的错误
- **错误处理**：在 API 调用中处理错误
- **加载状态**：显示加载状态
- **空状态**：处理空数据情况

## 常见问题与解决方案

### 1. 组件不更新

**问题**：修改 State 后组件没有更新
**解决方案**：确保使用 `setState` 而不是直接修改 State

### 2. 无限循环

**问题**：`useEffect` 导致无限循环
**解决方案**：正确设置依赖数组

### 3. 性能问题

**问题**：组件频繁重新渲染
**解决方案**：使用 React.memo、useMemo、useCallback 优化

### 4. 内存泄漏

**问题**：组件卸载后仍有操作
**解决方案**：在 `useEffect` 清理函数中清理副作用

## 学习资源

- [React 官方文档](https://react.dev/)
- [React 中文文档](https://zh-hans.react.dev/)
- [React 教程](https://react.learnersbucket.io/)
- [React 实战](https://react.bootcss.com/)

## 总结

React 是一个强大的前端框架，通过组件化的开发方式和丰富的生态系统，让开发者可以高效地构建用户界面。掌握 React 的核心概念和最佳实践，对于前端开发者来说非常重要。

对于初学者来说，建议从基础概念开始，逐步学习组件、State、Props、生命周期等核心概念，然后深入学习 Hooks 和性能优化技巧。随着经验的积累，可以探索更高级的 React 特性和最佳实践。