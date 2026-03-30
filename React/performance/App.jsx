import React, { useState, useEffect, useRef, useMemo, useCallback, memo, Profiler } from 'react';

// 自定义 Hooks
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

// React.memo 示例
const MemoizedChild = memo(function MemoizedChild({ onClick, data }) {
  console.log('MemoizedChild 渲染');
  return (
    <div style={{ padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '4px', margin: '8px 0' }}>
      <h4>优化后的子组件</h4>
      <p>数据: {data}</p>
      <button onClick={onClick}>点击</button>
    </div>
  );
});

// useMemo 示例
function ExpensiveCalculation({ numbers }) {
  const expensiveValue = useMemo(() => {
    console.log('计算中...');
    return numbers.reduce((acc, num) => acc + num, 0);
  }, [numbers]);

  return (
    <div style={{ padding: '12px', backgroundColor: '#fff3e0', borderRadius: '4px', margin: '8px 0' }}>
      <h4>useMemo 示例</h4>
      <p>数组: [{numbers.join(', ')}]</p>
      <p>总和: {expensiveValue}</p>
    </div>
  );
}

// useCallback 示例
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState('初始数据');

  const handleClick = useCallback(() => {
    console.log('点击事件');
  }, []);

  return (
    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>useCallback 示例</h3>
      <p>计数: {count}</p>
      <input
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="输入数据"
      />
      <button onClick={() => setCount(count + 1)}>增加计数</button>
      <MemoizedChild onClick={handleClick} data={data} />
    </div>
  );
}

// 虚拟滚动示例
function VirtualList({ items, itemHeight = 50, containerHeight = 300 }) {
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
    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>虚拟滚动示例（{items.length} 项）</h3>
      <div
        ref={containerRef}
        style={{
          height: containerHeight,
          overflow: 'auto',
          border: '1px solid #ccc',
          borderRadius: '4px'
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
                borderBottom: '1px solid #eee',
                backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff'
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 图片懒加载示例
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
    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>图片懒加载示例</h3>
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        style={{
          width: '200px',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '4px',
          opacity: inView ? 1 : 0.5,
          transition: 'opacity 0.3s'
        }}
      />
    </div>
  );
}

// 防抖搜索示例
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('搜索:', debouncedSearchTerm);
      setResults([
        { id: 1, name: `${debouncedSearchTerm} 结果 1` },
        { id: 2, name: `${debouncedSearchTerm} 结果 2` },
        { id: 3, name: `${debouncedSearchTerm} 结果 3` }
      ]);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>防抖搜索示例</h3>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索..."
        style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}
      />
      <p>防抖后的搜索词: {debouncedSearchTerm}</p>
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}

// 列表渲染优化示例
function ListOptimization() {
  const [items, setItems] = useState([
    { id: 1, name: '项目 1' },
    { id: 2, name: '项目 2' },
    { id: 3, name: '项目 3' }
  ]);

  return (
    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', margin: '8px 0' }}>
      <h3>列表渲染优化示例</h3>
      <button onClick={() => setItems([...items, { id: Date.now(), name: `项目 ${items.length + 1}` }])}>
        添加项目
      </button>
      <ul>
        {items.map(item => (
          <li key={item.id} style={{ padding: '4px 0' }}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 性能监控示例
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

  return (
    <div style={{ padding: '12px', backgroundColor: '#f3e5f5', borderRadius: '4px', margin: '8px 0' }}>
      <h4>性能监控组件</h4>
      <p>查看控制台了解渲染耗时</p>
    </div>
  );
}

// Profiler 示例
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

// 主应用组件
function App() {
  const [count, setCount] = useState(0);
  const [virtualListItems] = useState(() =>
    Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `项目 ${i + 1}`
    }))
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>React 性能优化示例</h1>

      <Profiler id="App" onRender={onRenderCallback}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <ParentComponent />
          <ExpensiveCalculation numbers={[1, 2, 3, 4, 5]} />
          <ListOptimization />
          <SearchComponent />
          <VirtualList items={virtualListItems} />
          <LazyImage
            src="https://via.placeholder.com/200"
            alt="懒加载图片"
            placeholder="https://via.placeholder.com/200?text=Loading"
          />
          <MonitoredComponent />
        </div>

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h2>性能优化说明</h2>
          <ul>
            <li><strong>React.memo</strong>：避免不必要的组件重新渲染</li>
            <li><strong>useMemo</strong>：缓存计算结果，避免重复计算</li>
            <li><strong>useCallback</strong>：缓存函数，避免子组件不必要的重新渲染</li>
            <li><strong>虚拟滚动</strong>：只渲染可见区域的列表项</li>
            <li><strong>图片懒加载</strong>：延迟加载不可见的图片</li>
            <li><strong>防抖</strong>：减少频繁的事件触发</li>
            <li><strong>性能监控</strong>：使用 Profiler 监控组件性能</li>
          </ul>
        </div>
      </Profiler>
    </div>
  );
}

export default App;