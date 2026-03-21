// JavaScript 数据结构与算法示例

console.log('========== 数据结构与算法 ==========\n');

console.log('========== 1. 数组 (Array) ==========');

// 数组基本操作
const arr = [1, 2, 3, 4, 5];
console.log('原始数组:', arr);

// 访问元素
console.log('访问索引 2:', arr[2]);

// 插入元素
arr.push(6);
console.log('末尾插入 6:', arr);

arr.unshift(0);
console.log('开头插入 0:', arr);

// 删除元素
arr.pop();
console.log('末尾删除:', arr);

arr.shift();
console.log('开头删除:', arr);

// 数组方法
console.log('map 平方:', arr.map(x => x * x));
console.log('filter 偶数:', arr.filter(x => x % 2 === 0));
console.log('reduce 求和:', arr.reduce((sum, x) => sum + x, 0));
console.log('find 大于 3:', arr.find(x => x > 3));
console.log('indexOf 3:', arr.indexOf(3));

console.log('\n========== 2. 链表 (Linked List) ==========');

class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  addAtTail(val) {
    const newNode = new ListNode(val);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }

  print() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.val);
      current = current.next;
    }
    console.log('链表:', result);
  }
}

const linkedList = new LinkedList();
linkedList.addAtTail(1);
linkedList.addAtTail(2);
linkedList.addAtTail(3);
linkedList.print();

console.log('\n========== 3. 栈 (Stack) ==========');

class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  print() {
    console.log('栈:', this.items);
  }
}

const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
stack.print();
console.log('栈顶:', stack.peek());
console.log('出栈:', stack.pop());
stack.print();

console.log('\n========== 4. 队列 (Queue) ==========');

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  print() {
    console.log('队列:', this.items);
  }
}

const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.print();
console.log('队首:', queue.front());
console.log('出队:', queue.dequeue());
queue.print();

console.log('\n========== 5. 哈希表 (Hash Table) ==========');

class HashTable {
  constructor() {
    this.table = {};
  }

  set(key, value) {
    this.table[key] = value;
  }

  get(key) {
    return this.table[key];
  }

  has(key) {
    return key in this.table;
  }

  delete(key) {
    delete this.table[key];
  }

  print() {
    console.log('哈希表:', this.table);
  }
}

const hashTable = new HashTable();
hashTable.set('name', '张三');
hashTable.set('age', 25);
hashTable.print();
console.log('获取 name:', hashTable.get('name'));
console.log('是否有 age:', hashTable.has('age'));

console.log('\n========== 6. 二叉搜索树 (Binary Search Tree) ==========');

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(val) {
    const newNode = new TreeNode(val);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let current = this.root;
    while (true) {
      if (val < current.val) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }

  inorder(node = this.root, result = []) {
    if (node) {
      this.inorder(node.left, result);
      result.push(node.val);
      this.inorder(node.right, result);
    }
    return result;
  }

  search(val) {
    let current = this.root;
    while (current) {
      if (val === current.val) return true;
      if (val < current.val) current = current.left;
      else current = current.right;
    }
    return false;
  }
}

const bst = new BST();
bst.insert(5);
bst.insert(3);
bst.insert(7);
bst.insert(2);
bst.insert(4);
bst.insert(6);
bst.insert(8);
console.log('中序遍历:', bst.inorder());
console.log('搜索 4:', bst.search(4));
console.log('搜索 9:', bst.search(9));

console.log('\n========== 7. 排序算法 ==========');

// 冒泡排序
function bubbleSort(arr) {
  const result = [...arr];
  for (let i = 0; i < result.length - 1; i++) {
    for (let j = 0; j < result.length - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  return result;
}

console.log('冒泡排序:', bubbleSort([3, 1, 4, 1, 5, 9, 2, 6]));

// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

console.log('快速排序:', quickSort([3, 1, 4, 1, 5, 9, 2, 6]));

// 归并排序
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

console.log('归并排序:', mergeSort([3, 1, 4, 1, 5, 9, 2, 6]));

console.log('\n========== 8. 搜索算法 ==========');

// 线性搜索
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

const searchArr = [1, 3, 5, 7, 9];
console.log('线性搜索 5:', linearSearch(searchArr, 5));
console.log('线性搜索 6:', linearSearch(searchArr, 6));

// 二分搜索
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const sortedArr = [1, 3, 5, 7, 9];
console.log('二分搜索 7:', binarySearch(sortedArr, 7));
console.log('二分搜索 6:', binarySearch(sortedArr, 6));

console.log('\n========== 9. 动态规划 (Dynamic Programming) ==========');

// 斐波那契数列
function fibonacci(n) {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

console.log('斐波那契 10:', fibonacci(10));

// 爬楼梯
function climbStairs(n) {
  if (n <= 2) return n;
  const dp = [0, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

console.log('爬楼梯 5:', climbStairs(5));

// 最大子数组和
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}

console.log('最大子数组和:', maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));

console.log('\n========== 10. 图的遍历 ==========');

// 邻接表表示的图
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

// 深度优先搜索 (DFS)
function dfs(graph, start, visited = new Set()) {
  if (visited.has(start)) return [];
  visited.add(start);
  const result = [start];
  for (const neighbor of graph[start]) {
    result.push(...dfs(graph, neighbor, visited));
  }
  return result;
}

console.log('DFS 遍历:', dfs(graph, 'A'));

// 广度优先搜索 (BFS)
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const result = [];
  while (queue.length) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}

console.log('BFS 遍历:', bfs(graph, 'A'));

console.log('\n========== 11. 贪心算法 ==========');

// 零钱兑换 - 贪心版本
function coinChangeGreedy(coins, amount) {
  coins.sort((a, b) => b - a);
  let count = 0;
  let remaining = amount;
  for (const coin of coins) {
    while (remaining >= coin) {
      remaining -= coin;
      count++;
    }
  }
  return remaining === 0 ? count : -1;
}

console.log('零钱兑换:', coinChangeGreedy([1, 5, 10, 25], 37));

console.log('\n========== 12. 回溯算法 ==========');

// 全排列
function permute(nums) {
  const result = [];
  function backtrack(current, remaining) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(current, [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
      current.pop();
    }
  }
  backtrack([], nums);
  return result;
}

console.log('全排列 [1,2,3]:', permute([1, 2, 3]));

console.log('\n========== 总结 ==========');

console.log(`
数据结构与算法核心要点：

1. 数据结构：
   - 数组：连续内存，随机访问 O(1)
   - 链表：非连续内存，插入删除 O(1)
   - 栈：LIFO，后进先出
   - 队列：FIFO，先进先出
   - 哈希表：平均查找 O(1)
   - 树：层次结构，BST 查找 O(log n)
   - 图：顶点和边，DFS/BFS 遍历

2. 排序算法：
   - 冒泡、选择、插入：O(n²)，简单
   - 快速、归并、堆：O(n log n)，高效
   - 计数、桶：线性时间，特定场景

3. 搜索算法：
   - 线性搜索：O(n)
   - 二分搜索：O(log n)，需要有序

4. 算法设计思想：
   - 动态规划：分解子问题，存储解
   - 贪心：每步局部最优
   - 回溯：尝试所有可能

5. 复杂度分析：
   - 时间复杂度：运行时间
   - 空间复杂度：占用内存

掌握数据结构与算法，是成为高级工程师的必经之路！
`);
