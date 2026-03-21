
const typeDefs = `
  type Query {
    user(id: ID!): User
    users(limit: Int = 10, offset: Int = 0): [User]
    book(id: ID!): Book
    books: [Book]
    search(query: String!): [SearchResult]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
    createBook(input: CreateBookInput!): Book
  }

  type Subscription {
    userCreated: User
    bookCreated: Book
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    books: [Book]
    createdAt: String
    updatedAt: String
  }

  type Book {
    id: ID!
    title: String!
    author: User!
    publishedYear: Int
    genre: String
    isAvailable: Boolean
  }

  union SearchResult = User | Book

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input UpdateUserInput {
    name: String
    email: String
    age: Int
  }

  input CreateBookInput {
    title: String!
    authorId: ID!
    publishedYear: Int
    genre: String
  }
`;

const mockUsers = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', age: 25, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '李四', email: 'lisi@example.com', age: 30, createdAt: '2024-01-02', updatedAt: '2024-01-02' },
  { id: '3', name: '王五', email: 'wangwu@example.com', age: 28, createdAt: '2024-01-03', updatedAt: '2024-01-03' }
];

const mockBooks = [
  { id: '1', title: 'JavaScript 高级程序设计', authorId: '1', publishedYear: 2020, genre: '技术', isAvailable: true },
  { id: '2', title: 'React 进阶', authorId: '2', publishedYear: 2021, genre: '技术', isAvailable: true },
  { id: '3', title: 'Node.js 实战', authorId: '1', publishedYear: 2022, genre: '技术', isAvailable: false }
];

const resolvers = {
  Query: {
    user: (_, { id }) => {
      return mockUsers.find(user => user.id === id);
    },
    
    users: (_, { limit = 10, offset = 0 }) => {
      return mockUsers.slice(offset, offset + limit);
    },
    
    book: (_, { id }) => {
      const book = mockBooks.find(book => book.id === id);
      if (book) {
        return {
          ...book,
          author: mockUsers.find(user => user.id === book.authorId)
        };
      }
      return null;
    },
    
    books: () => {
      return mockBooks.map(book => ({
        ...book,
        author: mockUsers.find(user => user.id === book.authorId)
      }));
    },
    
    search: (_, { query }) => {
      const users = mockUsers.filter(user => 
        user.name.includes(query) || user.email.includes(query)
      );
      const books = mockBooks.filter(book => 
        book.title.includes(query)
      ).map(book => ({
        ...book,
        author: mockUsers.find(user => user.id === book.authorId)
      }));
      
      return [...users, ...books];
    }
  },
  
  Mutation: {
    createUser: (_, { input }) => {
      const newUser = {
        id: String(mockUsers.length + 1),
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockUsers.push(newUser);
      return newUser;
    },
    
    updateUser: (_, { id, input }) => {
      const userIndex = mockUsers.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...input,
        updatedAt: new Date().toISOString()
      };
      
      return mockUsers[userIndex];
    },
    
    deleteUser: (_, { id }) => {
      const userIndex = mockUsers.findIndex(user => user.id === id);
      if (userIndex === -1) {
        return false;
      }
      
      mockUsers.splice(userIndex, 1);
      return true;
    },
    
    createBook: (_, { input }) => {
      const newBook = {
        id: String(mockBooks.length + 1),
        ...input,
        isAvailable: true
      };
      mockBooks.push(newBook);
      
      return {
        ...newBook,
        author: mockUsers.find(user => user.id === input.authorId)
      };
    }
  },
  
  User: {
    books: (user) => {
      return mockBooks
        .filter(book => book.authorId === user.id)
        .map(book => ({
          ...book,
          author: user
        }));
    }
  },
  
  SearchResult: {
    __resolveType(obj) {
      if (obj.email) {
        return 'User';
      }
      if (obj.title) {
        return 'Book';
      }
      return null;
    }
  }
};

const queries = {
  getUser: `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
        age
        books {
          id
          title
        }
      }
    }
  `,
  
  getUsers: `
    query GetUsers($limit: Int, $offset: Int) {
      users(limit: $limit, offset: $offset) {
        id
        name
        email
      }
    }
  `,
  
  getBook: `
    query GetBook($id: ID!) {
      book(id: $id) {
        id
        title
        author {
          id
          name
        }
        publishedYear
        genre
      }
    }
  `,
  
  search: `
    query Search($query: String!) {
      search(query: $query) {
        ... on User {
          id
          name
          email
        }
        ... on Book {
          id
          title
          genre
        }
      }
    }
  `,
  
  createUser: `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
        age
        createdAt
      }
    }
  `,
  
  updateUser: `
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
      updateUser(id: $id, input: $input) {
        id
        name
        email
        age
        updatedAt
      }
    }
  `,
  
  deleteUser: `
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `,
  
  createBook: `
    mutation CreateBook($input: CreateBookInput!) {
      createBook(input: $input) {
        id
        title
        author {
          id
          name
        }
        publishedYear
        genre
      }
    }
  `
};

function executeQuery(query, variables = {}) {
  const queryStr = query.trim();
  
  // 按照特定性排序，先匹配更具体的查询
  if (queryStr.includes('query GetUsers')) {
    return resolvers.Query.users(null, variables);
  }
  
  if (queryStr.includes('query GetUser')) {
    return resolvers.Query.user(null, variables);
  }
  
  if (queryStr.includes('query GetBook')) {
    return resolvers.Query.book(null, variables);
  }
  
  if (queryStr.includes('query Search')) {
    return resolvers.Query.search(null, variables);
  }
  
  if (queryStr.includes('mutation CreateUser')) {
    return resolvers.Mutation.createUser(null, variables);
  }
  
  if (queryStr.includes('mutation UpdateUser')) {
    return resolvers.Mutation.updateUser(null, variables);
  }
  
  if (queryStr.includes('mutation DeleteUser')) {
    return resolvers.Mutation.deleteUser(null, variables);
  }
  
  if (queryStr.includes('mutation CreateBook')) {
    return resolvers.Mutation.createBook(null, variables);
  }
  
  return null;
}

function demonstrateGraphQL() {
  console.log('=== GraphQL 演示 ===\n');
  
  console.log('1. 查询单个用户:');
  const user = executeQuery(queries.getUser, { id: '1' });
  console.log('  结果:', JSON.stringify(user, null, 2));
  
  console.log('\n2. 查询用户列表:');
  const users = executeQuery(queries.getUsers, { limit: 2, offset: 0 });
  console.log('  结果:', JSON.stringify(users, null, 2));
  
  console.log('\n3. 查询单本书籍:');
  const book = executeQuery(queries.getBook, { id: '1' });
  console.log('  结果:', JSON.stringify(book, null, 2));
  
  console.log('\n4. 搜索功能:');
  const searchResults = executeQuery(queries.search, { query: 'JavaScript' });
  console.log('  结果:', JSON.stringify(searchResults, null, 2));
  
  console.log('\n5. 创建用户:');
  const newUser = executeQuery(queries.createUser, {
    input: {
      name: '赵六',
      email: 'zhaoliu@example.com',
      age: 35
    }
  });
  console.log('  结果:', JSON.stringify(newUser, null, 2));
  
  console.log('\n6. 更新用户:');
  const updatedUser = executeQuery(queries.updateUser, {
    id: '1',
    input: {
      age: 26
    }
  });
  console.log('  结果:', JSON.stringify(updatedUser, null, 2));
  
  console.log('\n7. 创建书籍:');
  const newBook = executeQuery(queries.createBook, {
    input: {
      title: 'Vue.js 实战',
      authorId: '3',
      publishedYear: 2023,
      genre: '技术'
    }
  });
  console.log('  结果:', JSON.stringify(newBook, null, 2));
  
  console.log('\n8. 删除用户:');
  const deleted = executeQuery(queries.deleteUser, { id: '2' });
  console.log('  结果:', deleted);
  
  console.log('\n9. 查询更新后的用户列表:');
  const updatedUsers = executeQuery(queries.getUsers, { limit: 10, offset: 0 });
  console.log('  结果:', JSON.stringify(updatedUsers, null, 2));
  
  console.log('\n=== 演示完成 ===');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    typeDefs,
    resolvers,
    queries,
    executeQuery,
    demonstrateGraphQL
  };
  
  if (require.main === module) {
    demonstrateGraphQL();
  }
}
