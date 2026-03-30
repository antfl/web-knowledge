import React, { useState, useEffect, useContext, createContext, useReducer, useRef, useMemo, useCallback, memo, useLayoutEffect, useId, useDebugValue, useImperativeHandle, forwardRef } from 'react';

// 创建 Context
const ThemeContext = createContext();
const UserContext = createContext();

// 自定义 Hooks
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
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

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useDebugValue(isOnline ? '在线' : '离线');

  return isOnline;
}

// 基础 Hooks 示例
function StateDemo() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: '', email: '' });

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>useState 示例</h3>
      <div>
        <p>计数: {count}</p>
        <button onClick={() => setCount(count + 1)}>增加</button>
        <button onClick={() => setCount(count - 1)}>减少</button>
        <button onClick={() => setCount(0)}>重置</button>
      </div>
      <div style={{ marginTop: '12px' }}>
        <input
          value={user.name}
          onChange={(e) => setUser({...user, name: e.target.value})}
          placeholder="姓名"
        />
        <input
          value={user.email}
          onChange={(e) => setUser({...user, email: e.target.value})}
          placeholder="邮箱"
        />
        <p>用户: {user.name} ({user.email})</p>
      </div>
    </div>
  );
}

function EffectDemo() {
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    document.title = `计数: ${count}`;
  }, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>useEffect 示例</h3>
      <p>计数: {count}</p>
      <p>已运行: {seconds} 秒</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}

function ContextDemo() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <ContextConsumer />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

function ContextConsumer() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);

  return (
    <div style={{ 
      padding: '16px', 
      border: '1px solid #ddd', 
      borderRadius: '4px', 
      margin: '8px 0',
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff'
    }}>
      <h3>useContext 示例</h3>
      <p>当前主题: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
      <div style={{ marginTop: '12px' }}>
        {user ? (
          <div>
            <p>欢迎, {user.name}</p>
            <button onClick={() => setUser(null)}>退出</button>
          </div>
        ) : (
          <button onClick={() => setUser({ name: '张三' })}>登录</button>
        )}
      </div>
    </div>
  );
}

// useReducer 示例
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}

function ReducerDemo() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>useReducer 示例</h3>
      <p>计数: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>增加</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>减少</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>重置</button>
    </div>
  );
}

// useRef 示例
function RefDemo() {
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const prevCount = usePrevious(count);

  const focusInput = () => {
    inputRef.current.focus();
  };

  const startTimer = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>useRef 示例</h3>
      <div>
        <input ref={inputRef} type="text" placeholder="聚焦到这里" />
        <button onClick={focusInput}>聚焦</button>
      </div>
      <div style={{ marginTop: '12px' }}>
        <p>计时: {count} 秒</p>
        <p>上一次的值: {prevCount}</p>
        <button onClick={startTimer}>开始</button>
        <button onClick={stopTimer}>停止</button>
      </div>
    </div>
  );
}

// useMemo 和 useCallback 示例
const ExpensiveChild = memo(function ExpensiveChild({ onClick }) {
  console.log('ExpensiveChild 渲染');
  return <button onClick={onClick}>子组件按钮</button>;
});

function MemoCallbackDemo() {
  const [count, setCount] = useState(0);
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);

  const expensiveValue = useMemo(() => {
    console.log('计算中...');
    return numbers.reduce((acc, num) => acc + num, 0);
  }, [numbers]);

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>useMemo 和 useCallback 示例</h3>
      <p>计数: {count}</p>
      <p>计算结果: {expensiveValue}</p>
      <button onClick={() => setCount(count + 1)}>增加计数</button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
}

// useImperativeHandle 示例
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    blur: () => inputRef.current.blur(),
    getValue: () => inputRef.current.value
  }));

  return <input ref={inputRef} type="text" {...props} />;
});

function ImperativeHandleDemo() {
  const fancyInputRef = useRef();

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>useImperativeHandle 示例</h3>
      <FancyInput ref={fancyInputRef} placeholder="输入一些内容" />
      <button onClick={() => fancyInputRef.current?.focus()}>聚焦</button>
      <button onClick={() => alert(fancyInputRef.current?.getValue())}>获取值</button>
    </div>
  );
}

// useLayoutEffect 示例
function LayoutEffectDemo() {
  const [height, setHeight] = useState(0);
  const elementRef = useRef();

  useLayoutEffect(() => {
    setHeight(elementRef.current.offsetHeight);
  }, []);

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>useLayoutEffect 示例</h3>
      <div ref={elementRef} style={{ height: '100px', backgroundColor: 'lightblue', padding: '8px' }}>
        这个元素的高度是 {height}px
      </div>
    </div>
  );
}

// useId 示例
function IdDemo() {
  const id = useId();

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>useId 示例</h3>
      <form>
        <div>
          <label htmlFor={`${id}-email`}>邮箱:</label>
          <input id={`${id}-email`} type="email" />
        </div>
        <div>
          <label htmlFor={`${id}-password`}>密码:</label>
          <input id={`${id}-password`} type="password" />
        </div>
      </form>
    </div>
  );
}

// 自定义 Hooks 示例
function CustomHooksDemo() {
  const { count, increment, decrement, reset } = useCounter(0);
  const { value: isDark, toggle } = useToggle(false);
  const [name, setName] = useLocalStorage('username', '');
  const { width, height } = useWindowSize();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isOnline = useOnlineStatus();

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>自定义 Hooks 示例</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <h4>useCounter</h4>
        <p>计数: {count}</p>
        <button onClick={increment}>增加</button>
        <button onClick={decrement}>减少</button>
        <button onClick={reset}>重置</button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4>useToggle</h4>
        <div style={{ 
          backgroundColor: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
          padding: '8px',
          borderRadius: '4px'
        }}>
          <p>状态: {isDark ? '深色' : '浅色'}</p>
          <button onClick={toggle}>切换</button>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4>useLocalStorage</h4>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="用户名"
        />
        <p>保存的用户名: {name}</p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4>useWindowSize</h4>
        <p>窗口大小: {width} x {height}</p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4>useDebounce</h4>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索..."
        />
        <p>防抖后的搜索词: {debouncedSearchTerm}</p>
      </div>

      <div>
        <h4>useOnlineStatus</h4>
        <p>网络状态: {isOnline ? '在线' : '离线'}</p>
      </div>
    </div>
  );
}

// 主应用组件
function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>React Hooks 示例</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <StateDemo />
        <EffectDemo />
        <ContextDemo />
        <ReducerDemo />
        <RefDemo />
        <MemoCallbackDemo />
        <ImperativeHandleDemo />
        <LayoutEffectDemo />
        <IdDemo />
        <CustomHooksDemo />
      </div>
    </div>
  );
}

export default App;