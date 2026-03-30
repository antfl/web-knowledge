# React 性能优化

## 性能优化概述

React 应用的性能优化是一个系统性的工程，需要从多个层面进行考虑。合理的性能优化可以显著提升应用的响应速度和用户体验。

### 性能优化的重要性

1. **提升用户体验**：减少页面加载时间和交互延迟
2. **降低资源消耗**：减少 CPU 和内存使用
3. **改善 SEO**：更快的加载速度有利于搜索引擎优化
4. **支持更多设备**：在低端设备上也能流畅运行

## 组件级优化

### 1. React.memo

React.memo 是一个高阶组件，用于记忆组件的渲染结果。

```jsx
import React, { memo } from 'react';

// 普通组件 - 每次父组件更新都会重新渲染
function ExpensiveComponent({ data }) {
  console.log('ExpensiveComponent 渲染');
  const result = data.reduce((acc, item) => acc + item.value, 0);
  return <div>计算结果: {result}</div>;
}

// 优化后的组件 - 只有 props 变化时才重新渲染
const MemoizedExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  console.log('MemoizedExpensiveComponent 渲染');
  const result = data.reduce((acc, item) => acc + item.value, 0);
  return <div>计算结果: {result}</div>;
});

// 自定义比较函数
const CustomMemoizedComponent = memo(function Component({ user }) {
  return <div>{user.name}</div>;
}, (prevProps, nextProps) => {
  return prevProps.user.id === nextProps.user.id;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([{ value: 1 }, { value: 2 }]);

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

### 2. useMemo

useMemo 用于缓存计算结果，避免在每次渲染时重新计算。

```jsx
import { useMemo, useState } from 'react';

function ExpensiveCalculation({ numbers }) {
  // 不使用 useMemo - 每次渲染都会重新计算
  const resultWithoutMemo = numbers.reduce((acc, num) => acc + num, 0);

  // 使用 useMemo - 只有 numbers 变化时才重新计算
  const resultWithMemo = useMemo(() => {
    console.log('计算中...');
    return numbers.reduce((acc, num) => acc + num, 0);
  }, [numbers]);

  return (
    <div>
      <p>数组: [{numbers.join(', ')}]</p>
      <p>总和: {resultWithMemo}</p>
    </div>
  );
}

// 复杂对象计算
function UserCard({ user }) {
  const formattedUser = useMemo(() => {
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      initials: `${user.firstName[0]}${user.lastName[0]}`,
      displayName: user.firstName + ' ' + user.lastName
    };
  }, [user.firstName, user.lastName]);

  return (
    <div>
      <h3>{formattedUser.fullName}</h3>
      <p>缩写: {formattedUser.initials}</p>
    </div>
  );
}

// 列表过滤和排序
function FilteredList({ items, filter }) {
  const filteredAndSortedItems = useMemo(() => {
    console.log('过滤和排序中...');
    return items
      .filter(item => item.name.includes(filter))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, filter]);

  return (
    <ul>
      {filteredAndSortedItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 3. useCallback

useCallback 用于缓存函数，避免子组件不必要的重新渲染。

```jsx
import { useState, useCallback, memo } from 'react';

const ExpensiveChild = memo(function ExpensiveChild({ onClick }) {
  console.log('ExpensiveChild 渲染');
  return <button onClick={onClick}>子组件按钮</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // 不使用 useCallback - 每次渲染都会创建新函数
  const handleClickWithoutCallback = () => {
    setCount(count + 1);
  };

  // 使用 useCallback - 只有 count 变化时才创建新函数
  const handleClickWithCallback = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  // 稳定的函数 - 依赖数组为空
  const handleLog = useCallback(() => {
    console.log('日志');
  }, []);

  return (
    <div>
      <p>计数: {count}</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="输入名字"
      />
      <button onClick={() => setCount(count + 1)}>增加</button>
      
      <h4>不使用 useCallback</h4>
      <ExpensiveChild onClick={handleClickWithoutCallback} />
      
      <h4>使用 useCallback</h4>
      <ExpensiveChild onClick={handleClickWithCallback} />
    </div>
  );
}

// 实际应用示例 - Todo 列表
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

## 列表渲染优化

### 1. 使用 key 属性

为列表项提供稳定的 key 属性，帮助 React 识别哪些元素发生了变化。

```jsx
// 好的做法 - 使用稳定的 ID
function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// 不好的做法 - 使用索引作为 key
function BadList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>
      ))}
    </ul>
  );
}

// 不好的做法 - 使用随机值
function WorseList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={Math.random()}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 2. 虚拟滚动

对于大量数据的列表，使用虚拟滚动只渲染可见区域的元素。

```jsx
import { useState, useRef, useEffect, useMemo } from 'react';

function VirtualList({ items, itemHeight = 50, containerHeight = 400 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 2,
    items.length
  );

  const visibleItems = useMemo(() => {
    return items.slice(visibleStart, visibleEnd);
  }, [items, visibleStart, visibleEnd]);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        border: '1px solid #ccc'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight }}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: (visibleStart + index) * itemHeight,
              height: itemHeight,
              padding: '10px',
              borderBottom: '1px solid #eee'
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// 使用示例
function App() {
  const [items] = useState(() => 
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `项目 ${i + 1}`
    }))
  );

  return (
    <div>
      <h2>虚拟滚动列表（10000 项）</h2>
      <VirtualList items={items} />
    </div>
  );
}
```

## 状态管理优化

### 1. 避免不必要的状态更新

```jsx
// 不好的做法 - 不必要的状态更新
function BadComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(result => {
      setData(result); // 每次都更新状态
    });
  }, []);

  return <div>{data?.name}</div>;
}

// 好的做法 - 检查数据是否真的变化了
function GoodComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(result => {
      setData(prev => {
        if (prev && prev.id === result.id) {
          return prev; // 数据没有变化，不更新
        }
        return result;
      });
    });
  }, []);

  return <div>{data?.name}</div>;
}
```

### 2. 合理使用 Context

避免将频繁变化的数据放在 Context 中。

```jsx
// 不好的做法 - 将频繁变化的数据放在 Context
const DataContext = createContext();

function BadApp() {
  const [count, setCount] = useState(0);

  return (
    <DataContext.Provider value={{ count, setCount }}>
      <ExpensiveChild />
    </DataContext.Provider>
  );
}

// 好的做法 - 将频繁变化的数据和静态数据分开
const StaticDataContext = createContext();
const CountContext = createContext();

function GoodApp() {
  const [count, setCount] = useState(0);
  const staticData = useMemo(() => ({ theme: 'light' }), []);

  return (
    <StaticDataContext.Provider value={staticData}>
      <CountContext.Provider value={{ count, setCount }}>
        <ExpensiveChild />
      </CountContext.Provider>
    </StaticDataContext.Provider>
  );
}
```

### 3. 使用 useReducer 替代多个 useState

```jsx
// 不好的做法 - 多个独立的状态
function BadForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    // 验证逻辑
    const newErrors = {};
    if (!name) newErrors.name = '姓名不能为空';
    if (!email) newErrors.email = '邮箱不能为空';
    setErrors(newErrors);
  };

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={age} onChange={e => setAge(e.target.value)} />
      <button onClick={handleSubmit}>提交</button>
    </form>
  );
}

// 好的做法 - 使用 useReducer
function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'RESET':
      return { name: '', email: '', age: '', errors: {} };
    default:
      return state;
  }
}

function GoodForm() {
  const [state, dispatch] = useReducer(formReducer, {
    name: '',
    email: '',
    age: '',
    errors: {}
  });

  const handleChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!state.name) newErrors.name = '姓名不能为空';
    if (!state.email) newErrors.email = '邮箱不能为空';
    dispatch({ type: 'SET_ERRORS', errors: newErrors });
  };

  return (
    <form>
      <input 
        value={state.name} 
        onChange={e => handleChange('name', e.target.value)} 
      />
      <input 
        value={state.email} 
        onChange={e => handleChange('email', e.target.value)} 
      />
      <input 
        value={state.age} 
        onChange={e => handleChange('age', e.target.value)} 
      />
      <button onClick={handleSubmit}>提交</button>
    </form>
  );
}
```

## 代码分割和懒加载

### 1. React.lazy 和 Suspense

使用 React.lazy 进行组件懒加载，减少初始加载体积。

```jsx
import { lazy, Suspense } from 'react';

// 懒加载组件
const HeavyComponent = lazy(() => import('./HeavyComponent'));
const AnotherComponent = lazy(() => import('./AnotherComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>加载中...</div>}>
        <HeavyComponent />
        <AnotherComponent />
      </Suspense>
    </div>
  );
}

// 条件懒加载
function ConditionalLoading() {
  const [showHeavy, setShowHeavy] = useState(false);

  const HeavyComponent = lazy(() => import('./HeavyComponent'));

  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>
        加载重组件
      </button>
      {showHeavy && (
        <Suspense fallback={<div>加载中...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

### 2. 路由级别的代码分割

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>页面加载中...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## 网络请求优化

### 1. 请求去重和缓存

```jsx
function useFetch(url) {
  const cache = useRef(new Map());

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 检查缓存
    if (cache.current.has(url)) {
      setData(cache.current.get(url));
      return;
    }

    setLoading(true);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        cache.current.set(url, data);
        setData(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
```

### 2. 请求取消

```jsx
function useFetchWithCancel(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    fetch(url, { signal: abortControllerRef.current.signal })
      .then(response => response.json())
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url]);

  return { data, loading, error };
}
```

### 3. 防抖和节流

```jsx
// 防抖 Hook
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

// 搜索组件
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetch(`/api/search?q=${debouncedSearchTerm}`)
        .then(response => response.json())
        .then(data => console.log(data));
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  );
}

// 节流 Hook
function useThrottle(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, delay]);

  return throttledValue;
}
```

## 图片和资源优化

### 1. 图片懒加载

```jsx
function LazyImage({ src, alt, placeholder }) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setImageSrc(src);
    }
  }, [inView, src]);

  return (
    <img
      ref={imageRef}
      src={imageSrc}
      alt={alt}
      style={{ opacity: inView ? 1 : 0.5, transition: 'opacity 0.3s' }}
    />
  );
}

// 使用 Intersection Observer API
function useInView(options) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}
```

### 2. 响应式图片

```jsx
function ResponsiveImage({ src, alt, sizes }) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    const updateImage = () => {
      const width = window.innerWidth;
      let newSrc = src;

      if (width < 640 && sizes.small) {
        newSrc = sizes.small;
      } else if (width < 1024 && sizes.medium) {
        newSrc = sizes.medium;
      } else if (sizes.large) {
        newSrc = sizes.large;
      }

      setCurrentSrc(newSrc);
    };

    updateImage();
    window.addEventListener('resize', updateImage);
    return () => window.removeEventListener('resize', updateImage);
  }, [src, sizes]);

  return <img src={currentSrc} alt={alt} />;
}

// 使用
<ResponsiveImage
  src="/images/large.jpg"
  alt="响应式图片"
  sizes={{
    small: '/images/small.jpg',
    medium: '/images/medium.jpg',
    large: '/images/large.jpg'
  }}
/>
```

## 性能监控和分析

### 1. 使用 React DevTools Profiler

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  });
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Navigation />
      <MainContent />
      <Sidebar />
    </Profiler>
  );
}
```

### 2. 自定义性能监控

```jsx
function usePerformanceMonitor(componentName) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`${componentName} 渲染耗时: ${duration.toFixed(2)}ms`);
    };
  }, [componentName]);
}

function MonitoredComponent() {
  usePerformanceMonitor('MonitoredComponent');

  return <div>组件内容</div>;
}
```

## 性能优化最佳实践

### 1. 避免内联函数和对象

```jsx
// 不好的做法
function BadComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
      <div style={{ color: 'red', fontSize: '16px' }}>
        计数: {count}
      </div>
    </div>
  );
}

// 好的做法
function GoodComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  const containerStyle = useMemo(() => ({
    color: 'red',
    fontSize: '16px'
  }), []);

  return (
    <div>
      <button onClick={handleClick}>
        增加
      </button>
      <div style={containerStyle}>
        计数: {count}
      </div>
    </div>
  );
}
```

### 2. 合理使用 key

```jsx
// 好的做法 - 使用稳定的 ID
function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// 不好的做法 - 使用索引
function BadList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 3. 避免过度优化

```jsx
// 不必要的优化
function OverOptimizedComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  const style = useMemo(() => ({
    padding: '10px'
  }), []);

  return (
    <button onClick={handleClick} style={style}>
      点击
    </button>
  );
}

// 更好的做法
function BetterComponent() {
  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <button onClick={handleClick} style={{ padding: '10px' }}>
      点击
    </button>
  );
}
```

## 学习资源

- [React 性能优化官方文档](https://react.dev/learn/render-and-commit)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Web Performance Optimization](https://web.dev/performance/)

## 总结

React 性能优化是一个持续的过程，需要根据实际情况选择合适的优化策略。建议：

1. **先测量，后优化**：使用性能分析工具找出真正的瓶颈
2. **避免过早优化**：在代码运行良好之前不要过度优化
3. **关注用户体验**：优化应该以提升用户体验为目标
4. **保持代码可读性**：不要为了性能而牺牲代码的可维护性

通过合理应用这些优化技巧，可以构建出高性能、流畅的 React 应用。