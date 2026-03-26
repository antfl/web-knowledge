# Vue 性能优化

## 1. 性能优化概述

### 1.1 为什么需要性能优化

Vue 应用在规模扩大时可能会遇到性能问题，包括：
- 首屏加载慢
- 页面渲染卡顿
- 内存占用过高
- 交互响应延迟

### 1.2 性能优化的目标

- **首屏加载时间**：减少初始加载时间，提升用户体验
- **运行时性能**：减少不必要的渲染和计算，提升响应速度
- **内存占用**：优化内存使用，防止内存泄漏
- **包体积**：减少最终打包体积，加快加载速度

## 2. 代码优化

### 2.1 合理使用 v-if 和 v-show

#### v-if
- 条件性地渲染元素
- 元素会被完全销毁和重建
- 适用于条件很少改变的场景

```vue
<template>
  <div>
    <button @click="showModal = !showModal">切换弹窗</button>
    <div v-if="showModal" class="modal">
      弹窗内容
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false
    }
  }
}
</script>
```

#### v-show
- 通过 CSS display 属性控制显示/隐藏
- 元素始终存在于 DOM 中
- 适用于频繁切换的场景

```vue
<template>
  <div>
    <button @click="showTab = !showTab">切换标签</button>
    <div v-show="showTab" class="tab">
      标签内容
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTab: false
    }
  }
}
</script>
```

### 2.2 使用 v-for 的 key

为 v-for 提供唯一的 key，帮助 Vue 高效地更新 DOM。

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]
    }
  }
}
</script>
```

**注意事项**：
- 不要使用 index 作为 key（除非列表是静态的）
- key 必须是唯一的
- key 应该是稳定的，不要使用随机值

### 2.3 避免在模板中使用复杂表达式

将复杂表达式提取到计算属性或方法中。

```vue
<template>
  <div>
    <p>总价: {{ totalPrice }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { price: 10, quantity: 2 },
        { price: 20, quantity: 3 }
      ]
    }
  },
  computed: {
    totalPrice() {
      return this.items.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0)
    }
  }
}
</script>
```

### 2.4 合理使用 computed 和 watch

#### computed
- 基于响应式依赖进行缓存
- 适用于计算属性的场景

```vue
<script>
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    }
  }
}
</script>
```

#### watch
- 执行异步或开销较大的操作
- 适用于需要执行副作用的场景

```vue
<script>
export default {
  data() {
    return {
      query: '',
      results: []
    }
  },
  watch: {
    query(newQuery) {
      this.debounceSearch(newQuery)
    }
  },
  methods: {
    debounceSearch: _.debounce(function(query) {
      fetch(`/api/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
          this.results = data
        })
    }, 300)
  }
}
</script>
```

## 3. 组件优化

### 3.1 组件懒加载

使用动态导入实现组件懒加载，减少初始加载体积。

```vue
<script>
export default {
  components: {
    // 静态导入
    // StaticComponent: () => import('./StaticComponent.vue')
    
    // 懒加载
    LazyComponent: () => import('./LazyComponent.vue')
  }
}
</script>
```

### 3.2 使用 v-once

只渲染元素和组件一次，之后的更新将被跳过。

```vue
<template>
  <div>
    <h1 v-once>{{ title }}</h1>
    <p>{{ content }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '静态标题',
      content: '动态内容'
    }
  }
}
</script>
```

### 3.3 函数式组件

无状态、无实例的组件，渲染性能更好。

```vue
<template functional>
  <div class="functional-component">
    <slot></slot>
  </div>
</template>
```

### 3.4 使用 keep-alive

缓存不活动的组件实例，避免重复渲染。

```vue
<template>
  <div>
    <button @click="currentTab = 'tab1'">Tab 1</button>
    <button @click="currentTab = 'tab2'">Tab 2</button>
    
    <keep-alive>
      <component :is="currentTab"></component>
    </keep-alive>
  </div>
</template>

<script>
export default {
  components: {
    tab1: () => import('./Tab1.vue'),
    tab2: () => import('./Tab2.vue')
  },
  data() {
    return {
      currentTab: 'tab1'
    }
  }
}
</script>
```

## 4. 列表优化

### 4.1 虚拟滚动

对于长列表，使用虚拟滚动只渲染可见区域的元素。

```vue
<template>
  <div class="virtual-scroll" @scroll="handleScroll" ref="scrollContainer">
    <div class="scroll-content" :style="{ height: totalHeight + 'px' }">
      <div 
        v-for="item in visibleItems" 
        :key="item.id" 
        class="scroll-item"
        :style="{ transform: `translateY(${item.offset}px)` }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [], // 所有数据
      itemHeight: 50,
      visibleItems: [],
      scrollTop: 0
    }
  },
  computed: {
    totalHeight() {
      return this.items.length * this.itemHeight
    }
  },
  methods: {
    handleScroll() {
      this.scrollTop = this.$refs.scrollContainer.scrollTop
      this.updateVisibleItems()
    },
    updateVisibleItems() {
      const containerHeight = this.$refs.scrollContainer.clientHeight
      const startIndex = Math.floor(this.scrollTop / this.itemHeight)
      const endIndex = Math.ceil((this.scrollTop + containerHeight) / this.itemHeight)
      
      this.visibleItems = this.items.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        offset: (startIndex + index) * this.itemHeight
      }))
    }
  },
  mounted() {
    // 生成测试数据
    this.items = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`
    }))
    this.updateVisibleItems()
  }
}
</script>

<style scoped>
.virtual-scroll {
  height: 400px;
  overflow-y: auto;
  position: relative;
}

.scroll-content {
  position: relative;
}

.scroll-item {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
  position: absolute;
  width: 100%;
}
</style>
```

### 4.2 分页加载

对于大数据集，使用分页加载减少一次性渲染的数据量。

```vue
<template>
  <div>
    <ul>
      <li v-for="item in currentPageItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>第 {{ currentPage }} 页</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.items.length / this.pageSize)
    },
    currentPageItems() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.items.slice(start, end)
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    }
  },
  mounted() {
    // 生成测试数据
    this.items = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i}`
    }))
  }
}
</script>
```

## 5. 数据优化

### 5.1 避免深层响应式

对于不需要响应式的大型数据，使用 Object.freeze 冻结对象。

```vue
<script>
export default {
  data() {
    return {
      // 冻结大型配置对象
      config: Object.freeze({
        // 大量配置数据
      })
    }
  }
}
</script>
```

### 5.2 使用 shallowRef 和 shallowReactive

对于大型对象，使用浅层响应式减少性能开销。

```vue
<script setup>
import { shallowRef, shallowReactive } from 'vue'

// 浅层 ref
const largeData = shallowRef({
  // 大量数据
})

// 浅层 reactive
const largeObject = shallowReactive({
  // 大量数据
})

// 更新时需要手动触发响应式更新
function updateData() {
  largeData.value = { ...largeData.value, newField: 'value' }
}
</script>
```

### 5.3 防抖和节流

对于频繁触发的事件，使用防抖和节流优化性能。

```vue
<template>
  <div>
    <input 
      type="text" 
      @input="handleInput" 
      placeholder="输入内容（防抖）"
    >
    <button @click="handleClick">点击（节流）</button>
  </div>
</template>

<script>
import { debounce, throttle } from 'lodash-es'

export default {
  methods: {
    handleInput: debounce(function(e) {
      console.log('输入内容:', e.target.value)
    }, 300),
    
    handleClick: throttle(function() {
      console.log('按钮被点击')
    }, 1000)
  }
}
</script>
```

## 6. 渲染优化

### 6.1 使用 v-memo

Vue 3 提供的指令，用于缓存子树。

```vue
<template>
  <div v-for="item in items" :key="item.id" v-memo="[item.id, item.selected]">
    <div>{{ item.name }}</div>
    <div v-if="item.selected">已选中</div>
  </div>
</template>
```

### 6.2 手动控制更新

使用 $forceUpdate 或 nextTick 手动控制更新时机。

```vue
<script>
export default {
  methods: {
    updateData() {
      this.someData = 'new value'
      
      // 等待 DOM 更新完成
      this.$nextTick(() => {
        console.log('DOM 已更新')
      })
    },
    
    forceUpdate() {
      // 强制更新组件
      this.$forceUpdate()
    }
  }
}
</script>
```

### 6.3 使用 requestAnimationFrame

对于动画和频繁的 DOM 操作，使用 requestAnimationFrame。

```vue
<script>
export default {
  methods: {
    animate() {
      let start = null
      
      const step = (timestamp) => {
        if (!start) start = timestamp
        const progress = timestamp - start
        
        // 更新动画
        this.animationProgress = Math.min(progress / 1000, 1)
        
        if (progress < 1000) {
          requestAnimationFrame(step)
        }
      }
      
      requestAnimationFrame(step)
    }
  }
}
</script>
```

## 7. 构建优化

### 7.1 代码分割

使用动态导入和路由懒加载实现代码分割。

```javascript
// 路由配置
const routes = [
  {
    path: '/home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
]
```

### 7.2 Tree Shaking

确保只打包使用的代码。

```javascript
// 好的做法：只导入需要的函数
import { debounce } from 'lodash-es'

// 不好的做法：导入整个库
import _ from 'lodash'
```

### 7.3 压缩和混淆

配置构建工具进行代码压缩和混淆。

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}
```

## 8. 资源优化

### 8.1 图片优化

- 使用合适的图片格式（WebP、AVIF）
- 压缩图片大小
- 使用懒加载

```vue
<template>
  <img 
    v-lazy="imageUrl" 
    alt="描述"
    loading="lazy"
  >
</template>
```

### 8.2 字体优化

- 使用字体子集化
- 使用 font-display: swap
- 预加载关键字体

```css
@font-face {
  font-family: 'CustomFont';
  src: url('./font.woff2') format('woff2');
  font-display: swap;
}
```

### 8.3 CDN 加速

将静态资源托管到 CDN。

```javascript
// vite.config.js
export default {
  base: 'https://cdn.example.com/'
}
```

## 9. 性能监控

### 9.1 使用 Performance API

```javascript
export default {
  mounted() {
    // 测量页面加载时间
    window.addEventListener('load', () => {
      const perfData = performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      console.log('页面加载时间:', pageLoadTime)
    })
  }
}
```

### 9.2 使用 Vue DevTools

- 组件性能分析
- 事件追踪
- Vuex 状态管理

### 9.3 使用 Lighthouse

```bash
# 安装 Lighthouse
npm install -g lighthouse

# 运行 Lighthouse
lighthouse https://example.com
```

## 10. 最佳实践

### 10.1 遵循单一职责原则

每个组件只负责一个功能，保持组件的简洁和高效。

### 10.2 避免过度优化

在优化之前，先使用性能分析工具找出真正的性能瓶颈。

### 10.3 持续监控

建立性能监控机制，持续关注应用性能指标。

### 10.4 渐进式优化

先实现功能，再根据实际性能问题进行针对性优化。

## 11. 常见性能问题与解决方案

### 11.1 大列表渲染卡顿

**解决方案**：使用虚拟滚动或分页加载。

### 11.2 频繁更新导致性能问题

**解决方案**：使用防抖、节流或 v-memo。

### 11.3 内存泄漏

**解决方案**：
- 及时清理定时器和事件监听器
- 在组件销毁时取消未完成的请求
- 避免在全局变量中存储组件数据

### 11.4 首屏加载慢

**解决方案**：
- 使用路由懒加载
- 优化资源加载顺序
- 使用骨架屏

## 12. 总结

Vue 性能优化是一个系统性的工程，需要从代码、组件、数据、渲染、构建、资源等多个维度进行优化。在实际开发中，应该：

1. 建立性能监控机制，及时发现性能问题
2. 使用性能分析工具，找出真正的性能瓶颈
3. 针对性地进行优化，避免过度优化
4. 持续关注性能指标，保持应用的高性能

记住，性能优化是一个持续的过程，需要不断地测试、分析和改进。