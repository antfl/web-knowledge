<template>
  <div class="app-container">
    <h1>Vue 性能优化示例</h1>

    <!-- 1. v-if 和 v-show 的对比 -->
    <section class="section">
      <h2>1. v-if 和 v-show 的对比</h2>
      <div class="demo-box">
        <div class="demo-item">
          <h3>v-if 示例（条件很少改变）</h3>
          <button @click="showIfModal = !showIfModal" class="btn">切换弹窗</button>
          <div v-if="showIfModal" class="modal">
            <p>这个弹窗使用 v-if，元素会被完全销毁和重建</p>
            <p>适用于条件很少改变的场景</p>
          </div>
        </div>
        <div class="demo-item">
          <h3>v-show 示例（频繁切换）</h3>
          <button @click="showShowTab = !showShowTab" class="btn">切换标签</button>
          <div v-show="showShowTab" class="tab">
            <p>这个标签使用 v-show，元素始终存在于 DOM 中</p>
            <p>适用于频繁切换的场景</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. v-for 的 key 使用 -->
    <section class="section">
      <h2>2. v-for 的 key 使用</h2>
      <div class="demo-box">
        <h3>使用唯一的 key</h3>
        <ul class="list">
          <li v-for="item in items" :key="item.id" class="list-item">
            {{ item.name }}
          </li>
        </ul>
        <button @click="addItem" class="btn">添加项目</button>
        <button @click="shuffleItems" class="btn">随机排序</button>
        <p class="tip">提示：使用唯一的 key 可以帮助 Vue 高效地更新 DOM</p>
      </div>
    </section>

    <!-- 3. 计算属性 vs 方法 -->
    <section class="section">
      <h2>3. 计算属性 vs 方法</h2>
      <div class="demo-box">
        <div class="demo-item">
          <h3>计算属性（有缓存）</h3>
          <input v-model="firstName" placeholder="名字" class="input">
          <input v-model="lastName" placeholder="姓氏" class="input">
          <p>全名（计算属性）: {{ computedFullName }}</p>
          <p class="tip">计算属性基于依赖进行缓存，只在依赖变化时重新计算</p>
        </div>
        <div class="demo-item">
          <h3>方法（无缓存）</h3>
          <input v-model="methodFirstName" placeholder="名字" class="input">
          <input v-model="methodLastName" placeholder="姓氏" class="input">
          <p>全名（方法）: {{ methodFullName() }}</p>
          <p class="tip">方法每次渲染都会调用，没有缓存机制</p>
        </div>
      </div>
    </section>

    <!-- 4. 防抖和节流 -->
    <section class="section">
      <h2>4. 防抖和节流</h2>
      <div class="demo-box">
        <div class="demo-item">
          <h3>防抖（延迟执行）</h3>
          <input 
            type="text" 
            @input="handleDebounceInput" 
            placeholder="输入内容（防抖 300ms）"
            class="input"
          >
          <p>防抖触发次数: {{ debounceCount }}</p>
          <p class="tip">防抖：在指定时间内多次触发只执行最后一次</p>
        </div>
        <div class="demo-item">
          <h3>节流（限制频率）</h3>
          <button @click="handleThrottleClick" class="btn">点击我（节流 1000ms）</button>
          <p>节流触发次数: {{ throttleCount }}</p>
          <p class="tip">节流：在指定时间内只执行一次</p>
        </div>
      </div>
    </section>

    <!-- 5. 虚拟滚动 -->
    <section class="section">
      <h2>5. 虚拟滚动</h2>
      <div class="demo-box">
        <h3>长列表虚拟滚动（10000 条数据）</h3>
        <div class="virtual-scroll" @scroll="handleVirtualScroll" ref="scrollContainer">
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
        <p class="tip">虚拟滚动只渲染可见区域的元素，大幅提升长列表性能</p>
      </div>
    </section>

    <!-- 6. 分页加载 -->
    <section class="section">
      <h2>6. 分页加载</h2>
      <div class="demo-box">
        <h3>分页加载（100 条数据）</h3>
        <ul class="list">
          <li v-for="item in currentPageItems" :key="item.id" class="list-item">
            {{ item.name }}
          </li>
        </ul>
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1" class="btn">上一页</button>
          <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="btn">下一页</button>
        </div>
        <p class="tip">分页加载减少一次性渲染的数据量</p>
      </div>
    </section>

    <!-- 7. v-once -->
    <section class="section">
      <h2>7. v-once</h2>
      <div class="demo-box">
        <h3>静态内容渲染</h3>
        <input v-model="staticTitle" placeholder="修改标题" class="input">
        <h1 v-once>{{ staticTitle }}</h1>
        <p>{{ staticContent }}</p>
        <p class="tip">v-once 只渲染元素一次，之后的更新将被跳过</p>
      </div>
    </section>

    <!-- 8. keep-alive -->
    <section class="section">
      <h2>8. keep-alive</h2>
      <div class="demo-box">
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab" 
            @click="currentTab = tab"
            :class="{ active: currentTab === tab }"
            class="btn"
          >
            {{ tab }}
          </button>
        </div>
        <keep-alive>
          <component :is="currentTab" class="tab-content"></component>
        </keep-alive>
        <p class="tip">keep-alive 缓存不活动的组件实例，避免重复渲染</p>
      </div>
    </section>

    <!-- 9. v-memo -->
    <section class="section">
      <h2>9. v-memo（Vue 3）</h2>
      <div class="demo-box">
        <h3>条件缓存</h3>
        <button @click="toggleSelection" class="btn">切换选中状态</button>
        <div v-for="item in memoItems" :key="item.id" v-memo="[item.id, item.selected]" class="memo-item">
          <span>{{ item.name }}</span>
          <span v-if="item.selected" class="selected-tag">已选中</span>
        </div>
        <p class="tip">v-memo 缓存子树，只在依赖变化时重新渲染</p>
      </div>
    </section>

    <!-- 10. 性能监控 -->
    <section class="section">
      <h2>10. 性能监控</h2>
      <div class="demo-box">
        <h3>性能指标</h3>
        <div class="metrics">
          <div class="metric">
            <span class="metric-label">页面加载时间:</span>
            <span class="metric-value">{{ pageLoadTime }} ms</span>
          </div>
          <div class="metric">
            <span class="metric-label">DOM 内容加载:</span>
            <span class="metric-value">{{ domContentLoadedTime }} ms</span>
          </div>
          <div class="metric">
            <span class="metric-label">首次绘制:</span>
            <span class="metric-value">{{ firstPaintTime }} ms</span>
          </div>
        </div>
        <button @click="refreshMetrics" class="btn">刷新指标</button>
        <p class="tip">使用 Performance API 监控页面性能</p>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// Tab 组件
const Tab1 = {
  name: 'Tab1',
  template: '<div class="tab-panel"><h3>Tab 1 内容</h3><p>这是第一个标签页的内容</p></div>',
  mounted() {
    console.log('Tab1 mounted')
  },
  unmounted() {
    console.log('Tab1 unmounted')
  }
}

const Tab2 = {
  name: 'Tab2',
  template: '<div class="tab-panel"><h3>Tab 2 内容</h3><p>这是第二个标签页的内容</p></div>',
  mounted() {
    console.log('Tab2 mounted')
  },
  unmounted() {
    console.log('Tab2 unmounted')
  }
}

const Tab3 = {
  name: 'Tab3',
  template: '<div class="tab-panel"><h3>Tab 3 内容</h3><p>这是第三个标签页的内容</p></div>',
  mounted() {
    console.log('Tab3 mounted')
  },
  unmounted() {
    console.log('Tab3 unmounted')
  }
}

export default {
  name: 'App',
  components: {
    Tab1,
    Tab2,
    Tab3
  },
  setup() {
    // 1. v-if 和 v-show
    const showIfModal = ref(false)
    const showShowTab = ref(false)

    // 2. v-for 的 key
    const items = ref([
      { id: 1, name: '项目 1' },
      { id: 2, name: '项目 2' },
      { id: 3, name: '项目 3' }
    ])

    function addItem() {
      const newId = items.value.length + 1
      items.value.push({ id: newId, name: `项目 ${newId}` })
    }

    function shuffleItems() {
      items.value = items.value.sort(() => Math.random() - 0.5)
    }

    // 3. 计算属性 vs 方法
    const firstName = ref('John')
    const lastName = ref('Doe')
    const methodFirstName = ref('Jane')
    const methodLastName = ref('Smith')

    const computedFullName = computed(() => {
      return `${firstName.value} ${lastName.value}`
    })

    function methodFullName() {
      return `${methodFirstName.value} ${methodLastName.value}`
    }

    // 4. 防抖和节流
    const debounceCount = ref(0)
    const throttleCount = ref(0)
    let debounceTimer = null
    let lastThrottleTime = 0

    function handleDebounceInput() {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        debounceCount.value++
      }, 300)
    }

    function handleThrottleClick() {
      const now = Date.now()
      if (now - lastThrottleTime >= 1000) {
        throttleCount.value++
        lastThrottleTime = now
      }
    }

    // 5. 虚拟滚动
    const scrollContainer = ref(null)
    const virtualItems = ref([])
    const itemHeight = 50
    const visibleItems = ref([])
    const scrollTop = ref(0)

    const totalHeight = computed(() => {
      return virtualItems.value.length * itemHeight
    })

    function handleVirtualScroll() {
      if (scrollContainer.value) {
        scrollTop.value = scrollContainer.value.scrollTop
        updateVisibleItems()
      }
    }

    function updateVisibleItems() {
      if (!scrollContainer.value) return
      
      const containerHeight = scrollContainer.value.clientHeight
      const startIndex = Math.floor(scrollTop.value / itemHeight)
      const endIndex = Math.ceil((scrollTop.value + containerHeight) / itemHeight)
      
      visibleItems.value = virtualItems.value.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        offset: (startIndex + index) * itemHeight
      }))
    }

    // 6. 分页加载
    const paginationItems = ref([])
    const currentPage = ref(1)
    const pageSize = 10

    const totalPages = computed(() => {
      return Math.ceil(paginationItems.value.length / pageSize)
    })

    const currentPageItems = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      const end = start + pageSize
      return paginationItems.value.slice(start, end)
    })

    function prevPage() {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    function nextPage() {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    // 7. v-once
    const staticTitle = ref('静态标题')
    const staticContent = ref('动态内容')

    // 8. keep-alive
    const tabs = ['Tab1', 'Tab2', 'Tab3']
    const currentTab = ref('Tab1')

    // 9. v-memo
    const memoItems = ref([
      { id: 1, name: '项目 1', selected: false },
      { id: 2, name: '项目 2', selected: false },
      { id: 3, name: '项目 3', selected: false }
    ])

    function toggleSelection() {
      memoItems.value.forEach(item => {
        item.selected = !item.selected
      })
    }

    // 10. 性能监控
    const pageLoadTime = ref(0)
    const domContentLoadedTime = ref(0)
    const firstPaintTime = ref(0)

    function refreshMetrics() {
      if (performance.timing) {
        const timing = performance.timing
        pageLoadTime.value = timing.loadEventEnd - timing.navigationStart
        domContentLoadedTime.value = timing.domContentLoadedEventEnd - timing.navigationStart
        firstPaintTime.value = timing.responseStart - timing.navigationStart
      }
    }

    // 初始化数据
    onMounted(() => {
      // 生成虚拟滚动数据
      virtualItems.value = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `虚拟滚动项目 ${i}`
      }))
      updateVisibleItems()

      // 生成分页数据
      paginationItems.value = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `分页项目 ${i}`
      }))

      // 初始化性能指标
      refreshMetrics()

      // 监听页面加载完成
      window.addEventListener('load', refreshMetrics)
    })

    onUnmounted(() => {
      clearTimeout(debounceTimer)
      window.removeEventListener('load', refreshMetrics)
    })

    return {
      // 1. v-if 和 v-show
      showIfModal,
      showShowTab,
      
      // 2. v-for 的 key
      items,
      addItem,
      shuffleItems,
      
      // 3. 计算属性 vs 方法
      firstName,
      lastName,
      computedFullName,
      methodFirstName,
      methodLastName,
      methodFullName,
      
      // 4. 防抖和节流
      debounceCount,
      throttleCount,
      handleDebounceInput,
      handleThrottleClick,
      
      // 5. 虚拟滚动
      scrollContainer,
      visibleItems,
      totalHeight,
      handleVirtualScroll,
      
      // 6. 分页加载
      currentPageItems,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      
      // 7. v-once
      staticTitle,
      staticContent,
      
      // 8. keep-alive
      tabs,
      currentTab,
      
      // 9. v-memo
      memoItems,
      toggleSelection,
      
      // 10. 性能监控
      pageLoadTime,
      domContentLoadedTime,
      firstPaintTime,
      refreshMetrics
    }
  }
}
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h1 {
  color: #42b983;
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #333;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

h3 {
  color: #555;
  margin-bottom: 15px;
}

.demo-box {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
}

.demo-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 3px;
}

.btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
}

.btn:hover {
  background-color: #3aa876;
}

.btn:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.btn.active {
  background-color: #3aa876;
}

.input {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 14px;
}

.modal {
  margin-top: 15px;
  padding: 20px;
  background-color: #e8f5e9;
  border-radius: 3px;
  border-left: 4px solid #42b983;
}

.tab {
  margin-top: 15px;
  padding: 20px;
  background-color: #e3f2fd;
  border-radius: 3px;
  border-left: 4px solid #2196f3;
}

.list {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}

.list-item {
  padding: 10px;
  margin: 5px 0;
  background-color: #f5f5f5;
  border-radius: 3px;
  border-left: 3px solid #42b983;
}

.tip {
  color: #666;
  font-size: 13px;
  font-style: italic;
  margin-top: 10px;
}

.virtual-scroll {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 3px;
  position: relative;
  background-color: white;
}

.scroll-content {
  position: relative;
}

.scroll-item {
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-content {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 3px;
  min-height: 100px;
}

.tab-panel {
  background-color: white;
  padding: 20px;
  border-radius: 3px;
}

.memo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background-color: #f5f5f5;
  border-radius: 3px;
  border-left: 3px solid #42b983;
}

.selected-tag {
  background-color: #42b983;
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 3px;
  border-left: 4px solid #42b983;
}

.metric-label {
  color: #666;
  font-size: 14px;
}

.metric-value {
  color: #42b983;
  font-weight: bold;
  font-size: 16px;
}
</style>
