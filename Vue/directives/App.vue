<template>
  <div class="app-container">
    <h1>Vue 自定义指令示例</h1>

    <section class="section">
      <h2>1. 自动聚焦指令 (v-focus)</h2>
      <p>页面加载时自动聚焦到输入框</p>
      <input v-focus type="text" placeholder="这个输入框会自动聚焦">
    </section>

    <section class="section">
      <h2>2. 复制到剪贴板指令 (v-copy)</h2>
      <p>点击按钮或文本复制内容到剪贴板</p>
      <button v-copy="'这是要复制的文本'">复制文本</button>
      <p v-copy class="copy-text">点击复制这段文字</p>
    </section>

    <section class="section">
      <h2>3. 防抖指令 (v-debounce)</h2>
      <p>点击按钮时防抖，延迟执行</p>
      <button v-debounce:300="handleDebounceClick">点击我（防抖 300ms）</button>
      <p>防抖点击次数：{{ debounceCount }}</p>
    </section>

    <section class="section">
      <h2>4. 节流指令 (v-throttle)</h2>
      <p>点击按钮时节流，限制执行频率</p>
      <button v-throttle:1000="handleThrottleClick">点击我（节流 1000ms）</button>
      <p>节流点击次数：{{ throttleCount }}</p>
    </section>

    <section class="section">
      <h2>5. 无限滚动指令 (v-infinite-scroll)</h2>
      <p>滚动到底部时自动加载更多数据</p>
      <div v-infinite-scroll:100="loadMore" class="scroll-container">
        <div v-for="item in scrollItems" :key="item.id" class="scroll-item">
          {{ item.name }}
        </div>
        <div v-if="loading" class="loading">加载中...</div>
      </div>
    </section>

    <section class="section">
      <h2>6. 权限指令 (v-permission)</h2>
      <p>根据权限显示或隐藏元素</p>
      <p>当前权限：{{ currentPermission }}</p>
      <div class="permission-buttons">
        <button @click="currentPermission = 'admin'">设置为管理员</button>
        <button @click="currentPermission = 'editor'">设置为编辑者</button>
        <button @click="currentPermission = 'viewer'">设置为查看者</button>
        <button @click="currentPermission = 'guest'">设置为访客</button>
      </div>
      <div class="permission-demo">
        <button v-permission="'admin'">管理员按钮</button>
        <button v-permission="'editor'">编辑按钮</button>
        <button v-permission="'viewer'">查看按钮</button>
        <button v-permission="'guest'">访客按钮（会被隐藏）</button>
      </div>
    </section>

    <section class="section">
      <h2>7. 长按指令 (v-longpress)</h2>
      <p>长按按钮触发事件</p>
      <button v-longpress:1000="handleLongPress">长按 1 秒</button>
      <p>长按触发次数：{{ longPressCount }}</p>
    </section>

    <section class="section">
      <h2>8. 懒加载指令 (v-lazy)</h2>
      <p>图片懒加载，滚动到可视区域时加载</p>
      <div class="lazy-images">
        <img v-lazy="imageUrl1" alt="懒加载图片 1" class="lazy-image">
        <img v-lazy="imageUrl2" alt="懒加载图片 2" class="lazy-image">
      </div>
    </section>

    <section class="section">
      <h2>9. 点击外部指令 (v-click-outside)</h2>
      <p>点击元素外部时触发事件</p>
      <div v-click-outside="handleClickOutside" class="click-outside-box">
        <p>点击这个盒子外部会触发事件</p>
        <p>点击次数：{{ outsideClickCount }}</p>
      </div>
    </section>

    <section class="section">
      <h2>10. 拖拽指令 (v-draggable)</h2>
      <p>拖拽元素移动位置</p>
      <div v-draggable class="draggable-box">
        拖拽我
      </div>
    </section>

    <section class="section">
      <h2>11. 修饰符示例</h2>
      <p>使用修饰符改变指令行为</p>
      <button v-debounce.immediate="handleImmediateClick">立即执行（.immediate 修饰符）</button>
      <p>立即执行次数：{{ immediateCount }}</p>
    </section>

    <section class="section">
      <h2>12. 动态值示例</h2>
      <p>指令值动态变化</p>
      <input v-model="dynamicPermission" placeholder="输入权限（admin/editor/viewer）">
      <button v-permission="dynamicPermission">动态权限按钮</button>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'

/**
 * 自动聚焦指令
 * 在元素挂载时自动聚焦
 */
const focusDirective = {
  mounted(el) {
    el.focus()
  }
}

/**
 * 复制到剪贴板指令
 * 点击元素时复制指定文本或元素内容到剪贴板
 */
const copyDirective = {
  mounted(el, binding) {
    el.style.cursor = 'pointer'
    el.addEventListener('click', () => {
      const text = binding.value || el.textContent
      navigator.clipboard.writeText(text).then(() => {
        alert('复制成功！')
      }).catch(err => {
        console.error('复制失败：', err)
        alert('复制失败，请手动复制')
      })
    })
  }
}

/**
 * 防抖指令
 * 延迟执行函数，在指定时间内多次触发只执行最后一次
 */
const debounceDirective = {
  mounted(el, binding) {
    let timeout
    const delay = Number(binding.arg) || 300

    el.addEventListener('click', () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (typeof binding.value === 'function') {
          binding.value()
        }
      }, delay)
    })
  }
}

/**
 * 节流指令
 * 限制函数执行频率，在指定时间内只执行一次
 */
const throttleDirective = {
  mounted(el, binding) {
    let lastTime = 0
    const delay = Number(binding.arg) || 300

    el.addEventListener('click', () => {
      const now = Date.now()
      if (now - lastTime >= delay) {
        if (typeof binding.value === 'function') {
          binding.value()
        }
        lastTime = now
      }
    })
  }
}

/**
 * 无限滚动指令
 * 滚动到底部时触发回调函数
 */
const infiniteScrollDirective = {
  mounted(el, binding) {
    const callback = binding.value
    const threshold = Number(binding.arg) || 100

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollHeight - (scrollTop + clientHeight) < threshold) {
        if (typeof callback === 'function') {
          callback()
        }
      }
    }

    el.addEventListener('scroll', handleScroll)
    el._scrollHandler = handleScroll
  },
  unmounted(el) {
    el.removeEventListener('scroll', el._scrollHandler)
  }
}

/**
 * 权限指令
 * 根据权限显示或隐藏元素
 */
const permissionDirective = {
  mounted(el, binding) {
    updatePermission(el, binding.value)
  },
  updated(el, binding) {
    updatePermission(el, binding.value)
  }
}

function updatePermission(el, permission) {
  const permissions = ['admin', 'editor', 'viewer']
  if (permission && !permissions.includes(permission)) {
    el.style.display = 'none'
  } else {
    el.style.display = ''
  }
}

/**
 * 长按指令
 * 长按指定时间后触发回调函数
 */
const longpressDirective = {
  mounted(el, binding) {
    if (typeof binding.value !== 'function') return

    let pressTimer = null
    const duration = Number(binding.arg) || 500

    const start = () => {
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          binding.value()
        }, duration)
      }
    }

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('mouseleave', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)

    el._longpressHandlers = { start, cancel }
  },
  unmounted(el) {
    const { start, cancel } = el._longpressHandlers
    el.removeEventListener('mousedown', start)
    el.removeEventListener('touchstart', start)
    el.removeEventListener('mouseup', cancel)
    el.removeEventListener('mouseleave', cancel)
    el.removeEventListener('touchend', cancel)
    el.removeEventListener('touchcancel', cancel)
  }
}

/**
 * 懒加载指令
 * 元素进入可视区域时加载内容
 */
const lazyDirective = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = binding.value
          observer.unobserve(img)
        }
      })
    })

    observer.observe(el)
    el._lazyObserver = observer
  },
  unmounted(el) {
    el._lazyObserver && el._lazyObserver.unobserve(el)
  }
}

/**
 * 点击外部指令
 * 点击元素外部时触发回调函数
 */
const clickOutsideDirective = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        if (typeof binding.value === 'function') {
          binding.value(event)
        }
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}

/**
 * 拖拽指令
 * 使元素可以拖拽移动
 */
const draggableDirective = {
  mounted(el) {
    el.style.cursor = 'move'
    el.style.position = 'absolute'

    let isDragging = false
    let startX, startY, initialLeft, initialTop

    const startDrag = (e) => {
      isDragging = true
      startX = e.clientX
      startY = e.clientY
      initialLeft = el.offsetLeft
      initialTop = el.offsetTop
    }

    const drag = (e) => {
      if (!isDragging) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      el.style.left = `${initialLeft + dx}px`
      el.style.top = `${initialTop + dy}px`
    }

    const stopDrag = () => {
      isDragging = false
    }

    el.addEventListener('mousedown', startDrag)
    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', stopDrag)

    el._dragHandlers = { startDrag, drag, stopDrag }
  },
  unmounted(el) {
    const { startDrag, drag, stopDrag } = el._dragHandlers
    el.removeEventListener('mousedown', startDrag)
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', stopDrag)
  }
}

export default {
  name: 'App',
  directives: {
    focus: focusDirective,
    copy: copyDirective,
    debounce: debounceDirective,
    throttle: throttleDirective,
    'infinite-scroll': infiniteScrollDirective,
    permission: permissionDirective,
    longpress: longpressDirective,
    lazy: lazyDirective,
    'click-outside': clickOutsideDirective,
    draggable: draggableDirective
  },
  setup() {
    const debounceCount = ref(0)
    const throttleCount = ref(0)
    const scrollItems = ref([
      { id: 1, name: '项目 1' },
      { id: 2, name: '项目 2' },
      { id: 3, name: '项目 3' },
      { id: 4, name: '项目 4' },
      { id: 5, name: '项目 5' }
    ])
    const loading = ref(false)
    const currentPermission = ref('admin')
    const longPressCount = ref(0)
    const imageUrl1 = ref('https://via.placeholder.com/300x200?text=Image+1')
    const imageUrl2 = ref('https://via.placeholder.com/300x200?text=Image+2')
    const outsideClickCount = ref(0)
    const immediateCount = ref(0)
    const dynamicPermission = ref('admin')

    function handleDebounceClick() {
      debounceCount.value++
    }

    function handleThrottleClick() {
      throttleCount.value++
    }

    function loadMore() {
      if (loading.value) return
      loading.value = true
      setTimeout(() => {
        const newItems = Array.from({ length: 5 }, (_, i) => ({
          id: scrollItems.value.length + i + 1,
          name: `项目 ${scrollItems.value.length + i + 1}`
        }))
        scrollItems.value.push(...newItems)
        loading.value = false
      }, 1000)
    }

    function handleLongPress() {
      longPressCount.value++
    }

    function handleClickOutside() {
      outsideClickCount.value++
    }

    function handleImmediateClick() {
      immediateCount.value++
    }

    return {
      debounceCount,
      throttleCount,
      scrollItems,
      loading,
      currentPermission,
      longPressCount,
      imageUrl1,
      imageUrl2,
      outsideClickCount,
      immediateCount,
      dynamicPermission,
      handleDebounceClick,
      handleThrottleClick,
      loadMore,
      handleLongPress,
      handleClickOutside,
      handleImmediateClick
    }
  }
}
</script>

<style scoped>
.app-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h1 {
  color: #42b983;
  text-align: center;
}

h2 {
  color: #333;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}

p {
  margin: 10px 0;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa876;
}

input {
  padding: 8px;
  margin: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.copy-text {
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 3px;
  cursor: pointer;
  display: inline-block;
}

.scroll-container {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;
}

.scroll-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.loading {
  text-align: center;
  padding: 10px;
  color: #666;
}

.permission-buttons {
  margin-bottom: 15px;
}

.permission-demo button {
  margin: 5px;
}

.lazy-images {
  display: flex;
  gap: 20px;
}

.lazy-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  background-color: #f0f0f0;
}

.click-outside-box {
  padding: 20px;
  background-color: #e8f5e9;
  border-radius: 5px;
  text-align: center;
}

.draggable-box {
  width: 150px;
  height: 150px;
  background-color: #42b983;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-weight: bold;
  user-select: none;
}
</style>
