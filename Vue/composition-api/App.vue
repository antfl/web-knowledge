<template>
  <div class="app-container">
    <h1>Vue Composition API 示例</h1>

    <section class="section">
      <h2>1. ref 和 reactive 示例</h2>
      <p>计数器（ref）：{{ count }}</p>
      <button @click="increment">增加</button>
      <button @click="decrement">减少</button>
      <p>状态（reactive）：{{ state.name }} - {{ state.age }}</p>
      <button @click="updateState">更新状态</button>
    </section>

    <section class="section">
      <h2>2. computed 示例</h2>
      <p>名字：{{ firstName }} {{ lastName }}</p>
      <p>全名（computed）：{{ fullName }}</p>
      <p>双倍计数：{{ doubleCount }}</p>
    </section>

    <section class="section">
      <h2>3. watch 和 watchEffect 示例</h2>
      <p>监听计数：{{ watchCount }}</p>
      <button @click="watchCount++">增加监听计数</button>
      <p>监听消息：{{ watchMessage }}</p>
      <input v-model="watchMessage" placeholder="输入消息">
      <div class="logs">
        <h4>Watch 日志：</h4>
        <ul>
          <li v-for="(log, index) in watchLogs" :key="index">
            {{ log }}
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <h2>4. 生命周期钩子示例</h2>
      <p>生命周期日志：{{ lifecycleLogs.join(', ') }}</p>
    </section>

    <section class="section">
      <h2>5. provide/inject 示例</h2>
      <InjectChild />
    </section>

    <section class="section">
      <h2>6. 模板引用示例</h2>
      <input ref="inputRef" placeholder="点击按钮聚焦">
      <button @click="focusInput">聚焦输入框</button>
    </section>

    <section class="section">
      <h2>7. 组合函数示例</h2>
      <p>计数：{{ counter.count }}</p>
      <p>双倍：{{ counter.double }}</p>
      <button @click="counter.increment">增加</button>
      <button @click="counter.decrement">减少</button>
      <button @click="counter.reset">重置</button>
    </section>

    <section class="section">
      <h2>8. 鼠标位置示例</h2>
      <p>鼠标位置：X: {{ mouse.x }}, Y: {{ mouse.y }}</p>
    </section>

    <section class="section">
      <h2>9. 防抖输入示例</h2>
      <input v-model="debouncedInput" placeholder="输入内容（防抖）">
      <p>防抖后的值：{{ debouncedInput }}</p>
    </section>

    <section class="section">
      <h2>10. 工具函数示例</h2>
      <p>原始对象：{{ rawObject }}</p>
      <p>isRef(count): {{ isRef(count) }}</p>
      <p>unref(count): {{ unref(count) }}</p>
    </section>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  watch,
  watchEffect,
  onMounted,
  onUnmounted,
  onBeforeUpdate,
  onUpdated,
  provide,
  inject,
  toRefs,
  isRef,
  unref,
  toRaw,
  markRaw,
  customRef
} from 'vue'

/**
 * 注入子组件
 * 演示 provide/inject 的使用
 */
const InjectChild = {
  name: 'InjectChild',
  setup() {
    const theme = inject('theme')
    const updateTheme = inject('updateTheme')

    return {
      theme,
      updateTheme
    }
  },
  template: `
    <div class="inject-child" :style="{ backgroundColor: theme.backgroundColor, color: theme.color }">
      <p>当前主题：{{ theme.name }}</p>
      <button @click="updateTheme">切换主题</button>
    </div>
  `
}

/**
 * 计数器组合函数
 * 演示组合函数的创建和使用
 */
function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  return {
    count,
    double,
    increment,
    decrement,
    reset
  }
}

/**
 * 鼠标位置组合函数
 * 演示如何创建可复用的组合函数
 */
function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}

/**
 * 防抖 Ref 组合函数
 * 演示 customRef 的使用
 */
function useDebouncedRef(value, delay = 300) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

export default {
  name: 'App',
  components: {
    InjectChild
  },
  setup() {
    // 1. ref 和 reactive 示例
    const count = ref(0)
    const state = reactive({
      name: 'John',
      age: 30
    })

    function increment() {
      count.value++
    }

    function decrement() {
      count.value--
    }

    function updateState() {
      state.name = 'Jane'
      state.age = 25
    }

    // 2. computed 示例
    const firstName = ref('John')
    const lastName = ref('Doe')

    const fullName = computed({
      get() {
        return `${firstName.value} ${lastName.value}`
      },
      set(value) {
        [firstName.value, lastName.value] = value.split(' ')
      }
    })

    const doubleCount = computed(() => count.value * 2)

    // 3. watch 和 watchEffect 示例
    const watchCount = ref(0)
    const watchMessage = ref('')
    const watchLogs = ref([])

    watch(watchCount, (newVal, oldVal) => {
      watchLogs.value.push(`Count changed from ${oldVal} to ${newVal}`)
    })

    watch(watchMessage, (newVal, oldVal) => {
      watchLogs.value.push(`Message changed from "${oldVal}" to "${newVal}"`)
    })

    watchEffect(() => {
      console.log(`Watch effect: count is ${count.value}`)
    })

    // 4. 生命周期钩子示例
    const lifecycleLogs = ref([])

    onMounted(() => {
      console.log('App mounted')
      lifecycleLogs.value.push('mounted')
    })

    onBeforeUpdate(() => {
      console.log('App beforeUpdate')
      lifecycleLogs.value.push('beforeUpdate')
    })

    onUpdated(() => {
      console.log('App updated')
      lifecycleLogs.value.push('updated')
    })

    onUnmounted(() => {
      console.log('App unmounted')
      lifecycleLogs.value.push('unmounted')
    })

    // 5. provide/inject 示例
    const theme = ref({
      name: 'light',
      backgroundColor: '#ffffff',
      color: '#000000'
    })

    provide('theme', theme)
    provide('updateTheme', () => {
      if (theme.value.name === 'light') {
        theme.value = {
          name: 'dark',
          backgroundColor: '#333333',
          color: '#ffffff'
        }
      } else {
        theme.value = {
          name: 'light',
          backgroundColor: '#ffffff',
          color: '#000000'
        }
      }
    })

    // 6. 模板引用示例
    const inputRef = ref(null)

    function focusInput() {
      inputRef.value.focus()
    }

    // 7. 组合函数示例
    const counter = useCounter(0)

    // 8. 鼠标位置示例
    const mouse = useMouse()

    // 9. 防抖输入示例
    const debouncedInput = useDebouncedRef('')

    // 10. 工具函数示例
    const rawObject = reactive({ count: 0 })
    const raw = toRaw(rawObject)

    const markedObject = markRaw({ count: 0 })
    const markedReactive = reactive({ obj: markedObject })

    return {
      count,
      state,
      increment,
      decrement,
      updateState,
      firstName,
      lastName,
      fullName,
      doubleCount,
      watchCount,
      watchMessage,
      watchLogs,
      lifecycleLogs,
      inputRef,
      focusInput,
      counter,
      mouse,
      debouncedInput,
      rawObject,
      raw,
      isRef,
      unref
    }
  }
}
</script>

<style scoped>
.app-container {
  max-width: 900px;
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

h3,
h4 {
  color: #42b983;
  margin-top: 0;
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

.logs {
  margin-top: 15px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 3px;
}

.logs ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.logs li {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

.inject-child {
  padding: 15px;
  background-color: white;
  border-radius: 5px;
  margin-top: 10px;
}
</style>
