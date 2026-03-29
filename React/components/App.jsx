import React, { useState, useEffect, useContext, createContext, useCallback, useMemo, memo } from 'react';

// 创建 Context
const ThemeContext = createContext();
const UserContext = createContext();

// 自定义 Hooks
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(count + 1), [count]);
  const decrement = useCallback(() => setCount(count - 1), [count]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(!value), [value]);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
}

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

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// 基础组件
function Button({ children, variant = 'primary', size = 'medium', disabled = false, onClick }) {
  const baseStyles = {
    padding: size === 'small' ? '8px 16px' : 
              size === 'large' ? '16px 32px' : '12px 24px',
    borderRadius: '4px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    margin: '4px'
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

function Card({ children, title }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        style={{ 
          padding: '8px', 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}

// 组件通信示例
function ParentComponent() {
  const [message, setMessage] = useState('来自父组件的消息');
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount(count + 1);

  return (
    <Card title="组件通信示例">
      <div>
        <h3>父组件</h3>
        <p>消息: {message}</p>
        <p>计数: {count}</p>
        <ChildComponent message={message} onIncrement={handleIncrement} />
      </div>
    </Card>
  );
}

function ChildComponent({ message, onIncrement }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '12px', margin: '12px 0', borderRadius: '4px' }}>
      <h4>子组件</h4>
      <p>接收到的消息: {message}</p>
      <Button onClick={onIncrement}>增加父组件计数</Button>
    </div>
  );
}

// Context API 示例
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: '张三', role: 'admin' });

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

function ThemeDemo() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  return (
    <Card title="Context API 示例">
      <div style={{ 
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
        padding: '16px',
        borderRadius: '4px'
      }}>
        <h3>主题演示</h3>
        <p>欢迎, {user.name}</p>
        <p>角色: {user.role}</p>
        <p>当前主题: {theme}</p>
        <Button onClick={toggleTheme}>切换主题</Button>
      </div>
    </Card>
  );
}

// 自定义 Hooks 示例
function CounterDemo() {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <Card title="useCounter 示例">
      <div>
        <h3>计数器: {count}</h3>
        <Button onClick={increment}>增加</Button>
        <Button onClick={decrement}>减少</Button>
        <Button onClick={reset}>重置</Button>
      </div>
    </Card>
  );
}

function ToggleDemo() {
  const { value: isDark, toggle } = useToggle(false);
  
  return (
    <Card title="useToggle 示例">
      <div style={{ 
        backgroundColor: isDark ? '#333' : '#fff',
        color: isDark ? '#fff' : '#333',
        padding: '16px',
        borderRadius: '4px'
      }}>
        <h3>状态切换</h3>
        <p>当前状态: {isDark ? '开启' : '关闭'}</p>
        <Button onClick={toggle}>切换状态</Button>
      </div>
    </Card>
  );
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('username', '');
  
  return (
    <Card title="useLocalStorage 示例">
      <div>
        <h3>本地存储</h3>
        <Input 
          label="用户名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>保存的用户名: {name}</p>
      </div>
    </Card>
  );
}

// 高阶组件示例
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

function UserProfile({ user }) {
  return (
    <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
      <h3>{user.name}</h3>
      <p>邮箱: {user.email}</p>
      <p>角色: {user.role}</p>
    </div>
  );
}

const UserProfileWithLoading = withLoading(UserProfile);

function HOCDemo() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({ name: '张三', email: 'zhangsan@example.com', role: '管理员' });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <Card title="高阶组件示例">
      <div>
        <h3>用户资料（带加载状态）</h3>
        <UserProfileWithLoading isLoading={isLoading} user={user} />
      </div>
    </Card>
  );
}

// Render Props 示例
function DataFetcher({ url, render, loading, error }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);
    
    setTimeout(() => {
      setData([
        { id: 1, name: '张三', email: 'zhangsan@example.com' },
        { id: 2, name: '李四', email: 'lisi@example.com' },
        { id: 3, name: '王五', email: 'wangwu@example.com' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [url]);

  if (isLoading) {
    return loading ? loading : <div>加载中...</div>;
  }

  if (fetchError) {
    return error ? error : <div>加载失败</div>;
  }

  return render(data);
}

function RenderPropsDemo() {
  return (
    <Card title="Render Props 示例">
      <DataFetcher 
        url="/api/users"
        loading={<div>正在加载用户数据...</div>}
        error={<div>加载用户数据失败</div>}
        render={(users) => (
          <div>
            <h3>用户列表</h3>
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  {user.name} - {user.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      />
    </Card>
  );
}

// 性能优化示例
const MemoizedExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  console.log('MemoizedExpensiveComponent 渲染');
  const result = useMemo(() => {
    return data.reduce((acc, item) => acc + item, 0);
  }, [data]);
  
  return (
    <div style={{ padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '4px', margin: '8px 0' }}>
      <h4>优化后的组件</h4>
      <p>计算结果: {result}</p>
    </div>
  );
});

function PerformanceDemo() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([1, 2, 3, 4, 5]);

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  const expensiveValue = useMemo(() => {
    console.log('计算中...');
    return data.reduce((acc, item) => acc + item, 0);
  }, [data]);

  return (
    <Card title="性能优化示例">
      <div>
        <h3>父组件计数: {count}</h3>
        <p>计算结果: {expensiveValue}</p>
        <Button onClick={handleClick}>增加计数</Button>
        <MemoizedExpensiveComponent data={data} />
      </div>
    </Card>
  );
}

// 错误边界示例
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
        <div style={{ padding: '20px', backgroundColor: '#fee', borderRadius: '4px', margin: '16px 0' }}>
          <h3>出错了</h3>
          <p>{this.state.error?.message || '未知错误'}</p>
          <Button onClick={() => this.setState({ hasError: false, error: null })}>重试</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

function ProblematicComponent() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('这是一个故意抛出的错误');
  }

  return (
    <div>
      <h3>可能出错的组件</h3>
      <Button onClick={() => setShouldThrow(true)}>抛出错误</Button>
    </div>
  );
}

function ErrorBoundaryDemo() {
  return (
    <Card title="错误边界示例">
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    </Card>
  );
}

// 组件组合示例
function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('登录:', formData);
    alert(`登录信息: 用户名=${formData.username}, 密码=${formData.password}`);
  };

  return (
    <Card title="组件组合示例 - 登录表单">
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

// 主应用组件
function App() {
  return (
    <ThemeProvider>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>React 组件示例</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <ParentComponent />
          <ThemeDemo />
          <CounterDemo />
          <ToggleDemo />
          <LocalStorageDemo />
          <HOCDemo />
          <RenderPropsDemo />
          <PerformanceDemo />
          <ErrorBoundaryDemo />
          <LoginForm />
        </div>

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h2>可复用按钮组件示例</h2>
          <div>
            <Button variant="primary" size="small">主要按钮（小）</Button>
            <Button variant="primary" size="medium">主要按钮（中）</Button>
            <Button variant="primary" size="large">主要按钮（大）</Button>
          </div>
          <div>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="danger">危险按钮</Button>
            <Button variant="outline">轮廓按钮</Button>
          </div>
          <div>
            <Button disabled>禁用按钮</Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;