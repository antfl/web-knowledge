# React Hooks

## Hooks 概述

React Hooks 是 React 16.8 引入的新特性，它允许你在函数组件中使用状态和其他 React 特性，而不需要编写类组件。

### Hooks 的优势

1. **简化组件逻辑**：避免复杂的类组件和生命周期方法
2. **逻辑复用**：通过自定义 Hooks 实现逻辑复用
3. **代码组织**：将相关逻辑组织在一起，而不是分散在生命周期方法中
4. **更小的包体积**：函数组件通常比类组件更小

## 基础 Hooks

### 1. useState

useState 用于在函数组件中添加状态。

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  );
}

// 使用函数式更新
function CounterWithFunctionalUpdate() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={increment}>增加两次</button>
    </div>
  );
}

// 处理对象状态
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <form>
      <input
        name="name"
        value={user.name}
        onChange={handleChange}
        placeholder="姓名"
      />
      <input
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="邮箱"
      />
      <input
        name="age"
        type="number"
        value={user.age}
        onChange={handleChange}
        placeholder="年龄"
      />
    </form>
  );
}

// 惰性初始化
function ExpensiveComponent() {
  const [data, setData] = useState(() => {
    console.log('只执行一次');
    return Array.from({ length: 10000 }, (_, i) => i);
  });

  return <div>数据长度: {data.length}</div>;
}
```

### 2. useEffect

useEffect 用于处理副作用，如数据获取、订阅、DOM 操作等。

```jsx
import { useState, useEffect } from 'react';

// 基本用法 - 每次渲染后执行
function BasicEffect() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `计数: ${count}`;
  });

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}

// 依赖数组 - 只在依赖变化时执行
function EffectWithDeps() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    console.log('count 变化了:', count);
  }, [count]);

  useEffect(() => {
    console.log('name 变化了:', name);
  }, [name]);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="输入名字"
      />
    </div>
  );
}

// 清理函数 - 组件卸载或依赖变化时执行
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>已运行: {seconds} 秒</div>;
}

// 数据获取
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### 3. useContext

useContext 用于在组件树中传递数据，避免 props 传递。

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();
const UserContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

function ThemedComponent() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div style={{ 
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff',
      padding: '20px'
    }}>
      <h3>当前主题: {theme}</h3>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </div>
  );
}

function UserInfo() {
  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <div>
          <h3>欢迎, {user.name}</h3>
          <button onClick={() => setUser(null)}>退出</button>
        </div>
      ) : (
        <button onClick={() => setUser({ name: '张三' })}>登录</button>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ThemedComponent />
        <UserInfo />
      </UserProvider>
    </ThemeProvider>
  );
}
```

## 额外的 Hooks

### 1. useReducer

useReducer 是 useState 的替代方案，适用于复杂的状态逻辑。

```jsx
import { useReducer } from 'react';

// 定义 reducer 函数
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'SET_VALUE':
      return { count: action.payload };
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
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>减少</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>重置</button>
      <button onClick={() => dispatch({ type: 'SET_VALUE', payload: 100 })}>
        设置为 100
      </button>
    </div>
  );
}

// 复杂状态管理示例
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          completed: false
        }]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'ALL'
  });
  const [inputValue, setInputValue] = useState('');

  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'ACTIVE') return !todo.completed;
    if (state.filter === 'COMPLETED') return todo.completed;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputValue });
      setInputValue('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="添加待办事项"
        />
        <button type="submit">添加</button>
      </form>

      <div>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'ALL' })}>
          全部
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'ACTIVE' })}>
          未完成
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'COMPLETED' })}>
          已完成
        </button>
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. useRef

useRef 用于在组件中存储可变值，访问 DOM 元素。

```jsx
import { useRef, useEffect } from 'react';

// 访问 DOM 元素
function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="自动聚焦" />
      <button onClick={() => inputRef.current.focus()}>
        聚焦输入框
      </button>
    </div>
  );
}

// 存储可变值
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setCount(0);
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  return (
    <div>
      <p>计时: {count} 秒</p>
      <button onClick={startTimer}>开始</button>
      <button onClick={stopTimer}>停止</button>
      <button onClick={resetTimer}>重置</button>
    </div>
  );
}

// 保存上一次的值
function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>当前值: {count}</p>
      <p>上一次的值: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

### 3. useMemo

useMemo 用于缓存计算结果，避免不必要的重新计算。

```jsx
import { useMemo, useState } from 'react';

function ExpensiveCalculation({ numbers }) {
  const expensiveValue = useMemo(() => {
    console.log('计算中...');
    return numbers.reduce((acc, num) => acc + num, 0);
  }, [numbers]);

  return (
    <div>
      <p>数组: [{numbers.join(', ')}]</p>
      <p>总和: {expensiveValue}</p>
    </div>
  );
}

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加计数</button>
      <ExpensiveCalculation numbers={numbers} />
    </div>
  );
}

// 复杂对象缓存
function UserCard({ user }) {
  const formattedUser = useMemo(() => {
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      initials: `${user.firstName[0]}${user.lastName[0]}`
    };
  }, [user.firstName, user.lastName]);

  return (
    <div>
      <h3>{formattedUser.fullName}</h3>
      <p>缩写: {formattedUser.initials}</p>
    </div>
  );
}
```

### 4. useCallback

useCallback 用于缓存函数，避免子组件不必要的重新渲染。

```jsx
import { useState, useCallback, memo } from 'react';

const ExpensiveChild = memo(function ExpensiveChild({ onClick }) {
  console.log('子组件渲染');
  return <button onClick={onClick}>子组件按钮</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);

  // 不使用 useCallback - 每次渲染都会创建新函数
  const handleClickWithoutCallback = () => {
    setCount(count + 1);
  };

  // 使用 useCallback - 只有 count 变化时才创建新函数
  const handleClickWithCallback = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      
      <h4>不使用 useCallback</h4>
      <ExpensiveChild onClick={handleClickWithoutCallback} />
      
      <h4>使用 useCallback</h4>
      <ExpensiveChild onClick={handleClickWithCallback} />
    </div>
  );
}

// 实际应用示例
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', completed: false },
    { id: 2, text: '掌握 Hooks', completed: false }
  ]);

  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  return (
    <div>
      <TodoForm onAdd={addTodo} />
      <TodoItems 
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

const TodoForm = memo(function TodoForm({ onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="添加待办事项"
      />
      <button type="submit">添加</button>
    </form>
  );
});

const TodoItems = memo(function TodoItems({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span>{todo.text}</span>
          <button onClick={() => onDelete(todo.id)}>删除</button>
        </li>
      ))}
    </ul>
  );
});
```

### 5. useImperativeHandle

useImperativeHandle 用于自定义暴露给父组件的 ref。

```jsx
import { useRef, useImperativeHandle, forwardRef } from 'react';

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    blur: () => {
      inputRef.current.blur();
    },
    getValue: () => {
      return inputRef.current.value;
    }
  }));

  return <input ref={inputRef} type="text" {...props} />;
});

function ParentComponent() {
  const fancyInputRef = useRef();

  const handleFocus = () => {
    fancyInputRef.current.focus();
  };

  const handleGetValue = () => {
    const value = fancyInputRef.current.getValue();
    alert(`输入值: ${value}`);
  };

  return (
    <div>
      <FancyInput ref={fancyInputRef} placeholder="输入一些内容" />
      <button onClick={handleFocus}>聚焦</button>
      <button onClick={handleGetValue}>获取值</button>
    </div>
  );
}
```

### 6. useLayoutEffect

useLayoutEffect 与 useEffect 类似，但在 DOM 更新后同步执行。

```jsx
import { useState, useLayoutEffect, useRef } from 'react';

function MeasureElement() {
  const [height, setHeight] = useState(0);
  const elementRef = useRef();

  useLayoutEffect(() => {
    setHeight(elementRef.current.offsetHeight);
  }, []);

  return (
    <div>
      <div ref={elementRef} style={{ height: '100px', backgroundColor: 'lightblue' }}>
        这个元素的高度是 {height}px
      </div>
    </div>
  );
}
```

### 7. useDebugValue

useDebugValue 用于在 React DevTools 中显示自定义 Hook 的标签。

```jsx
import { useState, useEffect, useDebugValue } from 'react';

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

function StatusComponent() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      <p>网络状态: {isOnline ? '在线' : '离线'}</p>
    </div>
  );
}
```

### 8. useId

useId 用于生成唯一的 ID，主要用于可访问性。

```jsx
import { useId } from 'react';

function Form() {
  const id = useId();

  return (
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
  );
}
```

## 自定义 Hooks

自定义 Hooks 是复用逻辑的强大方式。

### 1. useCounter

```jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const setValue = useCallback((value) => setCount(value), []);

  return { count, increment, decrement, reset, setValue };
}

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={increment}>增加</button>
      <button onClick={decrement}>减少</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}
```

### 2. useToggle

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}

function ToggleComponent() {
  const { value: isDark, toggle } = useToggle(false);

  return (
    <div style={{ 
      backgroundColor: isDark ? '#333' : '#fff',
      color: isDark ? '#fff' : '#333',
      padding: '20px'
    }}>
      <p>当前状态: {isDark ? '深色' : '浅色'}</p>
      <button onClick={toggle}>切换主题</button>
    </div>
  );
}
```

### 3. useLocalStorage

```jsx
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

function LocalStorageComponent() {
  const [name, setName] = useLocalStorage('username', '');

  return (
    <div>
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

### 4. useFetch

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### 5. useWindowSize

```jsx
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

function WindowSizeComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <p>窗口宽度: {width}px</p>
      <p>窗口高度: {height}px</p>
    </div>
  );
}
```

### 6. useDebounce

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('搜索:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索..."
      />
      <p>防抖后的搜索词: {debouncedSearchTerm}</p>
    </div>
  );
}
```

### 7. usePrevious

```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function CounterWithPrevious() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>当前值: {count}</p>
      <p>上一次的值: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

## Hooks 规则

### 1. 只在最顶层使用 Hooks

```jsx
// 正确
function GoodComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    document.title = count;
  }, [count]);

  return <div>{count}</div>;
}

// 错误 - 在条件语句中使用
function BadComponent() {
  const [count, setCount] = useState(0);

  if (count > 0) {
    const [name, setName] = useState(''); // 错误！
  }

  return <div>{count}</div>;
}
```

### 2. 只在 React 函数中调用 Hooks

```jsx
// 正确
function GoodComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

function customHook() {
  const [count, setCount] = useState(0); // 正确！
  return count;
}

// 错误 - 在普通 JavaScript 函数中使用
function badFunction() {
  const [count, setCount] = useState(0); // 错误！
  return count;
}
```

### 3. 使用 ESLint 插件

安装 `eslint-plugin-react-hooks` 来强制执行这些规则：

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## Hooks 最佳实践

### 1. 合理使用依赖数组

```jsx
// 好的做法 - 明确指定依赖
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 避免 - 空依赖数组可能导致问题
useEffect(() => {
  fetchData(userId);
}, []); // 如果 userId 变化，不会重新获取数据
```

### 2. 使用自定义 Hooks 复用逻辑

```jsx
// 好的做法 - 提取逻辑到自定义 Hook
function useUserData(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(data => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);

  return { user, loading };
}

// 在组件中使用
function UserProfile({ userId }) {
  const { user, loading } = useUserData(userId);

  if (loading) return <div>加载中...</div>;
  return <div>{user.name}</div>;
}
```

### 3. 避免过早优化

```jsx
// 不必要的优化
function Component() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // 这个函数很简单，不需要 useCallback

  return <button onClick={handleClick}>点击</button>;
}

// 更好的做法
function Component() {
  const handleClick = () => {
    console.log('clicked');
  };

  return <button onClick={handleClick}>点击</button>;
}
```

### 4. 使用 TypeScript 增强 Hooks

```tsx
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

function useUser(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return { user, loading, error };
}
```

## 学习资源

- [React Hooks 官方文档](https://react.dev/reference/react)
- [Hooks FAQ](https://react.dev/reference/react/FAQ)
- [自定义 Hooks 最佳实践](https://react.dev/learn/reusing-logic-with-custom-hooks)

## 总结

React Hooks 为函数组件提供了强大的能力，使得组件逻辑更加清晰和可维护。通过合理使用基础 Hooks 和自定义 Hooks，可以构建出高质量、可复用的 React 应用。

对于初学者来说，建议从 useState 和 useEffect 开始，逐步学习其他 Hooks。随着经验的积累，可以探索更复杂的 Hooks 组合和自定义 Hooks 的创建。