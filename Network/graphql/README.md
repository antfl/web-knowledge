
# GraphQL

GraphQL 是一种用于 API 的查询语言，它提供了一种更高效、强大和灵活的方式来替代 REST API。

## 核心概念

### Schema（模式）

Schema 定义了 API 的类型系统，包括查询、变更和订阅。

```graphql
type Query {
  user(id: ID!): User
  users: [User]
}

type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}
```

### Query（查询）

客户端可以精确地请求所需的数据。

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
```

### Mutation（变更）

用于修改服务器端数据的操作。

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
```

### Subscription（订阅）

用于实时数据更新的订阅机制。

```graphql
subscription OnUserCreated {
  userCreated {
    id
    name
  }
}
```

## 基本类型

### 标量类型

- **String** - 字符串
- **Int** - 整数
- **Float** - 浮点数
- **Boolean** - 布尔值
- **ID** - 唯一标识符

### 对象类型

```graphql
type Book {
  id: ID!
  title: String!
  author: Author!
  publishedYear: Int
}

type Author {
  id: ID!
  name: String!
  books: [Book]
}
```

### 枚举类型

```graphql
enum Status {
  ACTIVE
  INACTIVE
  PENDING
}
```

### 接口和联合类型

```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}

union SearchResult = User | Book | Author
```

## 查询语法

### 字段选择

```graphql
query {
  user {
    name
    email
  }
}
```

### 参数传递

```graphql
query {
  user(id: "123") {
    name
  }
}
```

### 别名

```graphql
query {
  firstUser: user(id: "1") {
    name
  }
  secondUser: user(id: "2") {
    name
  }
}
```

### 片段

```graphql
fragment UserFields on User {
  id
  name
  email
}

query {
  user(id: "1") {
    ...UserFields
  }
}
```

### 变量

```graphql
query GetUser($id: ID!, $includeEmail: Boolean = true) {
  user(id: $id) {
    name
    email @include(if: $includeEmail)
  }
}
```

## 指令

### @include

根据条件包含字段。

```graphql
query {
  user {
    name
    email @include(if: $showEmail)
  }
}
```

### @skip

根据条件跳过字段。

```graphql
query {
  user {
    name
    phone @skip(if: $hidePhone)
  }
}
```

### @deprecated

标记已弃用的字段。

```graphql
type User {
  name: String!
  oldField: String @deprecated(reason: "Use newField instead")
  newField: String
}
```

## 客户端实现

### 使用 fetch

```javascript
const query = `
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`;

fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query,
    variables: { id: '123' }
  })
});
```

### 使用 Apollo Client

```javascript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`;

client.query({
  query: GET_USER,
  variables: { id: '123' }
}).then(result => console.log(result));
```

## 服务端实现

### 使用 Apollo Server

```javascript
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World!'
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
```

## 与 REST 的比较

| 特性 | GraphQL | REST |
|------|---------|------|
| 数据获取 | 精确获取所需数据 | 可能过度获取或获取不足 |
| 请求次数 | 单次请求获取多个资源 | 可能需要多次请求 |
| 版本控制 | 无需版本控制 | 通常需要版本控制 |
| 类型系统 | 强类型 | 无内置类型系统 |
| 学习曲线 | 较陡 | 较平缓 |

## 最佳实践

1. **设计面向领域的 Schema** - 根据业务领域设计类型
2. **使用 DataLoader 解决 N+1 问题** - 批量加载数据
3. **实现分页** - 使用连接模式进行分页
4. **错误处理** - 统一错误格式
5. **性能优化** - 使用查询复杂度和深度限制

## 学习建议

1. 理解 GraphQL 的核心概念和类型系统
2. 学习 Schema 定义和 Resolver 实现
3. 掌握查询、变更和订阅的使用
4. 了解 Apollo Client 和 Apollo Server
5. 学习性能优化和最佳实践
