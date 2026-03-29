# React 组件

## 组件设计原则

### 1. 单一职责原则

每个组件应该只负责一个功能或一个 UI 部分。

```jsx
// 好的组件设计 - 单一职责
function UserAvatar({ src, alt }) {
  return <img src={src} alt={alt} />;
}

function UserName({ name }) {
  return <h2>{name}</h2>;
}

function UserCard({ user }) {
  return (
    <div>
      <UserAvatar src={user.avatar} alt={user.name} />
      <UserName name={user.name} />
    </div>
  );
}

// 不好的组件设计 - 职责过多
function UserCard({ user }) {
  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => deleteUser(user.id)}>删除</button>
      <button onClick={() => editUser(user.id)}>编辑</button>
      <button onClick={() => sendMessage(user.id)}>发送消息</button>
    </div>
  );
}
```

### 2. 组件复用性

设计可复用的组件，通过 props 控制行为和外观。

```jsx
// 可复用的按钮组件
function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick 
}) {
  const baseStyles = {
    padding: size === 'small' ? '8px 16px' : 
              size === 'large' ? '16px 32px' : '12px 24px',
    borderRadius: '4px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1
  };

  const variantStyles = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' },
    danger: { backgroundColor: '#dc3545', color: 'white' },
    outline: { backgroundColor: 'transparent', border: '1px solid #007bff', color: '#007bff' }
  };

  return (
    <button 
      style={{ ...baseStyles, ...variantStyles[variant] }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// 使用
<Button variant="primary" size="large">提交</Button>
<Button variant="danger" size="small">删除</Button>
```

### 3. 组件组合

通过组合简单组件构建复杂组件。

```jsx
// 简单组件
function Card({ children, title }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        padding: '8px 16px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px' 
      }}
    >
      {children}
    </button>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
      <input 
        type="text"
        value={value}
        onChange={onChange}
        style={{ 
          padding: '8px', 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          width: '100%'
        }}
      />
    </div>
  );
}

// 组合组件
function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('登录:', formData);
  };

  return (
    <Card title="用户登录">
      <form onSubmit={handleSubmit}>
        <Input 
          label="用户名"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        <Input 
          label="密码"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <Button onClick={handleSubmit}>登录</Button>
      </form>
    </Card>
  );
}
```

## 组件通信

### 1. Props 传递

父组件通过 props 向子组件传递数据。

```jsx
// 父组件
function ParentComponent() {
  const [message, setMessage] = useState('来自父组件的消息');

  return (
    <div>
      <h2>父组件</h2>
      <p>消息: {message}</p>
      <ChildComponent message={message} />
    </div>
  );
}

// 子组件
function ChildComponent({ message }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '16px' }}>
      <h3>子组件</h3>
      <p>接收到的消息: {message}</p>
    </div>
  );
}
```

### 2. 回调函数

子组件通过回调函数向父组件传递数据。

```jsx
// 父组件
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h2>父组件计数: {count}</h2>
      <ChildComponent onIncrement={handleIncrement} />
    </div>
  );
}

// 子组件
function ChildComponent({ onIncrement }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '16px' }}>
      <h3>子组件</h3>
      <button onClick={onIncrement}>增加父组件计数</button>
    </div>
  );
}
```

### 3. Context API

使用 Context API 在组件树中传递数据，避免 props 传递。

```jsx
import { createContext, useContext } from 'react';

// 创建 Context
const ThemeContext = createContext('light');
const UserContext = createContext(null);

// 提供者组件
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: '张三', role: 'admin' });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Dashboard />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// 消费者组件
function Dashboard() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  return (
    <div style={{ 
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h1>欢迎, {user.name}</h1>
      <p>角色: {user.role}</p>
      <button onClick={toggleTheme}>
        切换主题（当前: {theme}）
      </button>
    </div>
  );
}
```

### 4. 自定义 Hooks

将组件逻辑提取到自定义 Hooks 中，实现逻辑复用。

```jsx
// 自定义 Hook - useCounter
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// 自定义 Hook - useToggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(!value);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  
  return { value, toggle, setTrue, setFalse };
}

// 自定义 Hook - useLocalStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// 使用自定义 Hooks
function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <div>
      <h3>计数器: {count}</h3>
      <button onClick={increment}>增加</button>
      <button onClick={decrement}>减少</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}

function ThemeToggle() {
  const { value: isDark, toggle } = useToggle(false);
  
  return (
    <div style={{ 
      backgroundColor: isDark ? '#333' : '#fff',
      color: isDark ? '#fff' : '#333',
      padding: '20px'
    }}>
      <h3>主题切换</h3>
      <button onClick={toggle}>
        切换到{isDark ? '浅色' : '深色'}主题
      </button>
    </div>
  );
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('username', '');
  
  return (
    <div>
      <h3>本地存储示例</h3>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="输入用户名"
      />
      <p>保存的用户名: {name}</p>
    </div>
  );
}
```

## 高阶组件（HOC）

高阶组件是参数为组件，返回值为新组件的函数。

```jsx
// 高阶组件 - withLoading
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>加载中...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// 高阶组件 - withAuth
function withAuth(WrappedComponent) {
  return function WithAuthComponent({ isAuthenticated, ...props }) {
    if (!isAuthenticated) {
      return <div>请先登录</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// 使用高阶组件
function UserProfile({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

const UserProfileWithLoading = withLoading(UserProfile);
const UserProfileWithAuth = withAuth(UserProfile);

// 在应用中使用
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({ name: '张三', email: 'zhangsan@example.com' });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <div>
      <UserProfileWithLoading 
        isLoading={isLoading} 
        user={user} 
      />
      <UserProfileWithAuth 
        isAuthenticated={isAuthenticated} 
        user={user} 
      />
    </div>
  );
}
```

## Render Props

使用 render props 模式，让父组件控制渲染逻辑。

```jsx
// 使用 render props 的组件
function DataFetcher({ url, render, loading, error }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(error => {
        setFetchError(error);
        setIsLoading(false);
      });
  }, [url]);

  if (isLoading) {
    return loading ? loading : <div>加载中...</div>;
  }

  if (fetchError) {
    return error ? error : <div>加载失败</div>;
  }

  return render(data);
}

// 使用 DataFetcher 组件
function App() {
  return (
    <div>
      <h2>用户列表</h2>
      <DataFetcher 
        url="https://api.example.com/users"
        loading={<div>正在加载用户数据...</div>}
        error={<div>加载用户数据失败</div>}
        render={(users) => (
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        )}
      />
    </div>
  );
}
```

## 组件性能优化

### 1. React.memo

使用 React.memo 避免不必要的重新渲染。

```jsx
// 普通组件 - 每次父组件更新都会重新渲染
function ExpensiveComponent({ data }) {
  console.log('ExpensiveComponent 渲染');
  const result = data.reduce((acc, item) => acc + item.value, 0);
  return <div>计算结果: {result}</div>;
}

// 优化后的组件 - 只有 props 变化时才重新渲染
const MemoizedExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  console.log('MemoizedExpensiveComponent 渄染');
  const result = data.reduce((acc, item) => acc + item.value, 0);
  return <div>计算结果: {result}</div>;
});

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([1, 2, 3, 4, 5]);

  return (
    <div>
      <h2>计数: {count}</h2>
      <button onClick={() => setCount(count + 1)}>增加计数</button>
      <ExpensiveComponent data={data} />
      <MemoizedExpensiveComponent data={data} />
    </div>
  );
}
```

### 2. useMemo 和 useCallback

使用 useMemo 和 useCallback 优化性能。

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([1, 2, 3, 4, 5]);

  // 使用 useCallback 缓存函数
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  // 使用 useMemo 缓存计算结果
  const expensiveValue = useMemo(() => {
    console.log('计算中...');
    return items.reduce((acc, item) => acc + item, 0);
  }, [items]);

  return (
    <div>
      <h2>父组件</h2>
      <p>计数: {count}</p>
      <p>计算结果: {expensiveValue}</p>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}

const MemoizedChildComponent = React.memo(function ChildComponent({ onClick }) {
  console.log('子组件渲染');
  return <button onClick={onClick}>子组件按钮</button>;
});
```

## 组件错误处理

### 1. 错误边界

使用错误边界捕获组件树中的错误。

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('错误边界捕获到错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fee' }}>
          <h2>出错了</h2>
          <p>{this.state.error?.message || '未知错误'}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 使用错误边界
function App() {
  return (
    <ErrorBoundary>
      <ProblematicComponent />
    </ErrorBoundary>
  );
}

function ProblematicComponent() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('这是一个故意抛出的错误');
  }

  return (
    <div>
      <h2>可能出错的组件</h2>
      <button onClick={() => setShouldThrow(true)}>
        抛出错误
      </button>
    </div>
  );
}
```

## 组件测试

### 1. 组件测试基础

使用 Jest 和 React Testing Library 测试组件。

```jsx
// Button.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button 组件', () => {
  test('应该渲染按钮文本', () => {
    render(<Button>点击我</Button>);
    const buttonElement = screen.getByText('点击我');
    expect(buttonElement).toBeInTheDocument();
  });

  test('应该调用 onClick 处理函数', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击我</Button>);
    
    const buttonElement = screen.getByText('点击我');
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('应该在 disabled 状态下不可点击', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>点击我</Button>);
    
    const buttonElement = screen.getByText('点击我');
    expect(buttonElement).toBeDisabled();
  });
});
```

## 组件最佳实践

### 1. 组件命名

- 使用大驼峰命名法（PascalCase）
- 名称应该描述组件的功能
- 避免使用通用的名称

### 2. Props 命名

- 使用小驼峰命名法（camelCase）
- Props 名称应该清晰描述其用途
- 为 Props 添加类型检查（PropTypes 或 TypeScript）

### 3. 组件结构

- 将相关组件放在同一目录
- 按功能组织组件
- 使用 index.js 导出组件

### 4. 样式处理

- 避免内联样式（简单样式除外）
- 使用 CSS Modules、Styled Components 或 Tailwind CSS
- 保持样式的一致性

### 5. 文档编写

- 为组件编写使用文档
- 提供 Props 说明
- 提供使用示例

## 学习资源

- [React 组件设计模式](https://reactpatterns.com/)
- [React 官方文档 - 组件](https://react.dev/learn/thinking-in-react)
- [React Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro)

## 总结

React 组件是构建用户界面的基础，通过合理设计组件结构、优化组件性能、处理组件错误，可以构建高质量、可维护的 React 应用。

对于初学者来说，建议从简单的组件开始，逐步学习组件通信、高阶组件、性能优化等高级概念。随着经验的积累，可以探索更复杂的组件设计模式和最佳实践。