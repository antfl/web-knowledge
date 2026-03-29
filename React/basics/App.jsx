import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// 基础函数组件
function Welcome() {
  return <h1>欢迎来到 React 基础示例</h1>;
}

// Props 示例
function UserCard({ name, age, avatar }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <img src={avatar} alt={name} style={{ width: '100px', height: '100px' }} />
      <h2>{name}</h2>
      <p>年龄: {age}</p>
    </div>
  );
}

// State 示例
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div style={{ margin: '20px 0' }}>
      <h3>计数器示例</h3>
      <p>当前计数: {count}</p>
      <button onClick={increment}>增加</button>
      <button onClick={decrement}>减少</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}

// 表单处理示例
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
    alert(`登录信息: 用户名=${formData.username}, 密码=${formData.password}`);
  };

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
      <h3>登录表单示例</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>用户名: </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>密码: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
  );
}

// 列表渲染示例
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React 基础' },
    { id: 2, text: '掌握 Hooks' },
    { id: 3, text: '构建实际项目' }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo }]);
      setNewTodo('');
    }
  };

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
      <h3>待办事项列表示例</h3>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="添加新的待办事项"
        />
        <button onClick={addTodo}>添加</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}

// 条件渲染示例
function ConditionalRendering({ isLoggedIn, user }) {
  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
      <h3>条件渲染示例</h3>
      {isLoggedIn ? (
        <div>
          <p>欢迎回来，{user?.name || '用户'}！</p>
          <button>退出登录</button>
        </div>
      ) : (
        <div>
          <p>请登录以继续</p>
          <button>登录</button>
        </div>
      )}
    </div>
  );
}

// useEffect 示例
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        id: userId,
        name: '张三',
        email: 'zhangsan@example.com',
        bio: 'React 开发者'
      });
      setLoading(false);
    }, 1000);
  }, [userId]);

  if (loading) return <div>加载中...</div>;

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
      <h3>用户资料示例</h3>
      <p>ID: {user.id}</p>
      <p>姓名: {user.name}</p>
      <p>邮箱: {user.email}</p>
      <p>简介: {user.bio}</p>
    </div>
  );
}

// useRef 示例
function FocusInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
      <h3>Ref 示例</h3>
      <input
        ref={inputRef}
        type="text"
        placeholder="点击按钮聚焦到这里"
        style={{ marginRight: '10px' }}
      />
      <button onClick={focusInput}>聚焦输入框</button>
    </div>
  );
}

// useMemo 示例
function ExpensiveCalculation({ numbers }) {
  const sum = useMemo(() => {
    console.log('计算中...');
    return numbers.reduce((acc, num) => acc + num, 0);
  }, [numbers]);

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
      <h3>useMemo 示例</h3>
      <p>数组: [{numbers.join(', ')}]</p>
      <p>总和: {sum}</p>
    </div>
  );
}

// useCallback 示例
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
      <h3>useCallback 示例</h3>
      <p>父组件计数: {count}</p>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}

function ChildComponent({ onClick }) {
  console.log('子组件渲染');
  return <button onClick={onClick}>子组件按钮</button>;
}

// 主应用组件
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentUser({ name: '张三' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Welcome />
      <hr />
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <UserCard 
          name="张三" 
          age={25} 
          avatar="https://via.placeholder.com/100" 
        />
        <UserCard 
          name="李四" 
          age={30} 
          avatar="https://via.placeholder.com/100" 
        />
      </div>
      
      <Counter />
      <hr />
      
      <LoginForm />
      <hr />
      
      <TodoList />
      <hr />
      
      <ConditionalRendering 
        isLoggedIn={isLoggedIn} 
        user={currentUser} 
      />
      <div style={{ margin: '20px 0' }}>
        <button onClick={handleLogin}>模拟登录</button>
        <button onClick={handleLogout}>模拟退出</button>
      </div>
      <hr />
      
      <UserProfile userId={1} />
      <hr />
      
      <FocusInput />
      <hr />
      
      <ExpensiveCalculation numbers={[1, 2, 3, 4, 5]} />
      <hr />
      
      <ParentComponent />
    </div>
  );
}

export default App;