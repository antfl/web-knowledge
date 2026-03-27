# Vue Composition API

## 什么是 Composition API

Composition API 是 Vue 3 中引入的一套新的 API，它提供了一种更灵活的方式来组织组件逻辑。与 Options API 相比，Composition API 允许开发者将相关的逻辑组织在一起，而不是按照选项（data、methods、computed 等）分散在组件中。

## Composition API 的优势

1. **更好的逻辑复用**：通过组合函数（Composables）实现逻辑的复用
2. **更灵活的代码组织**：可以将相关的逻辑组织在一起
3. **更好的 TypeScript 支持**：提供更好的类型推断
4. **更小的包体积**：支持 tree-shaking，减少最终打包体积

## setup 函数

`setup` 函数是 Composition API 的入口点，它在组件实例创建之前执行。

### 基本用法

```javascript
import { ref, reactive } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: 'John',
      age: 30
    })

    function increment() {
      count.value++
    }

    return {
      count,
      state,
      increment
    }
  }
}
```

### setup 的参数

`setup` 函数接收两个参数：`props` 和 `context`。

```javascript
export default {
  props: {
    title: String
  },
  setup(props, context) {
    console.log(props.title)
    console.log(context.attrs)
    console.log(context.slots)
    console.log(context.emit)
    console.log(context.expose)
  }
}
```

## 响应式 API

### ref

`ref` 用于创建响应式的原始值或对象。

```javascript
import { ref } from 'vue'

const count = ref(0)
const message = ref('Hello')
const user = ref({ name: 'John' })

console.log(count.value)
count.value++
```

### reactive

`reactive` 用于创建响应式的对象。

```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'John',
  user: {
    age: 30
  }
})

console.log(state.count)
state.count++
```

### readonly

`readonly` 用于创建只读的响应式对象。

```javascript
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })
const copy = readonly(original)

copy.count++ // 警告：不能修改只读对象
```

### computed

`computed` 用于创建计算属性。

```javascript
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

const fullNameWithSetter = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(value) {
    [firstName.value, lastName.value] = value.split(' ')
  }
})
```

### watch

`watch` 用于监听响应式数据的变化。

```javascript
import { ref, watch } from 'vue'

const count = ref(0)
const message = ref('Hello')

watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`)
})

watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('Multiple values changed')
})

watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log('State count changed')
  }
)

watch(
  () => state.user,
  (newVal, oldVal) => {
    console.log('User changed')
  },
  { deep: true, immediate: true }
)
```

### watchEffect

`watchEffect` 立即执行一个函数，并响应式地追踪其依赖。

```javascript
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  console.log(`Count is: ${count.value}`)
})

count.value++
```

## 生命周期钩子

Composition API 中的生命周期钩子以 `on` 开头。

```javascript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured
} from 'vue'

export default {
  setup() {
    onBeforeMount(() => {
      console.log('beforeMount')
    })

    onMounted(() => {
      console.log('mounted')
    })

    onBeforeUpdate(() => {
      console.log('beforeUpdate')
    })

    onUpdated(() => {
      console.log('updated')
    })

    onBeforeUnmount(() => {
      console.log('beforeUnmount')
    })

    onUnmounted(() => {
      console.log('unmounted')
    })

    onErrorCaptured((err, instance, info) => {
      console.log('Error captured:', err)
    })
  }
}
```

## 依赖注入

### provide 和 inject

```javascript
// 祖先组件
import { provide, ref } from 'vue'

export default {
  setup() {
    const theme = ref('light')

    provide('theme', theme)
    provide('updateTheme', () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    })
  }
}

// 后代组件
import { inject } from 'vue'

export default {
  setup() {
    const theme = inject('theme')
    const updateTheme = inject('updateTheme')

    return {
      theme,
      updateTheme
    }
  }
}
```

## 模板引用

### ref 和模板引用

```javascript
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const inputRef = ref(null)

    onMounted(() => {
      inputRef.value.focus()
    })

    return {
      inputRef
    }
  }
}
```

```html
<template>
  <input ref="inputRef" />
</template>
```

## 组件通信

### defineProps 和 defineEmits

在 `<script setup>` 中使用 `defineProps` 和 `defineEmits`。

```vue
<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update', 'delete'])

function handleClick() {
  emit('update', props.count + 1)
}
</script>
```

### defineExpose

使用 `defineExpose` 暴露组件的公共方法。

```vue
<script setup>
import { ref, defineExpose } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

defineExpose({
  count,
  increment
})
</script>
```

## 工具函数

### toRef 和 toRefs

```javascript
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({
  name: 'John',
  age: 30
})

const nameRef = toRef(state, 'name')
const { name, age } = toRefs(state)
```

### isRef 和 unref

```javascript
import { ref, isRef, unref } from 'vue'

const count = ref(0)

console.log(isRef(count)) // true
console.log(unref(count)) // 0
```

### toRaw

```javascript
import { reactive, toRaw } from 'vue'

const state = reactive({ count: 0 })
const raw = toRaw(state)

console.log(raw === state) // false
```

### markRaw

```javascript
import { reactive, markRaw } from 'vue'

const obj = markRaw({ count: 0 })
const state = reactive({
  obj
})

state.obj.count++ // 不会触发响应式更新
```

## 组合函数（Composables）

### 创建组合函数

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
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
```

### 使用组合函数

```javascript
import { useCounter } from './useCounter'

export default {
  setup() {
    const { count, double, increment, decrement, reset } = useCounter(10)

    return {
      count,
      double,
      increment,
      decrement,
      reset
    }
  }
}
```

## 响应式转换

### shallowRef 和 shallowReactive

```javascript
import { shallowRef, shallowReactive } from 'vue'

const shallowState = shallowReactive({
  nested: { value: 1 }
})

shallowState.nested.value = 2 // 不会触发响应式更新

const shallowCount = shallowRef({ value: 1 })
shallowCount.value.value = 2 // 不会触发响应式更新
```

### triggerRef

```javascript
import { shallowRef, triggerRef } from 'vue'

const state = shallowRef({ value: 1 })

state.value.value = 2
triggerRef(state) // 手动触发更新
```

## 响应式工具

### customRef

```javascript
import { customRef } from 'vue'

function useDebouncedRef(value, delay = 200) {
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
```

### shallowReadonly

```javascript
import { reactive, shallowReadonly } from 'vue'

const state = reactive({
  nested: { value: 1 }
})

const copy = shallowReadonly(state)

copy.nested.value = 2 // 可以修改嵌套属性
copy.value = 2 // 不能修改顶层属性
```

## 响应式系统调试

### onTrack 和 onTrigger

```javascript
import { reactive, onTrack, onTrigger } from 'vue'

const state = reactive({ count: 0 })

onTrack((event) => {
  console.log('Tracking:', event)
})

onTrigger((event) => {
  console.log('Triggered:', event)
})
```

## 最佳实践

### 1. 使用组合函数组织逻辑

将相关的逻辑组织到组合函数中，提高代码的可复用性。

```javascript
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
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
```

### 2. 合理使用 ref 和 reactive

- 对于原始值（string、number、boolean），使用 `ref`
- 对于对象，使用 `reactive`
- 需要替换整个对象时，使用 `ref`

### 3. 避免在 setup 中使用 this

在 Composition API 中，不应该使用 `this`。所有的数据和方法都应该通过返回值暴露给模板。

### 4. 使用 TypeScript 提高代码质量

Composition API 与 TypeScript 的集成非常好，应该充分利用类型系统。

```typescript
import { ref, Ref } from 'vue'

interface User {
  name: string
  age: number
}

const user: Ref<User> = ref({
  name: 'John',
  age: 30
})
```

### 5. 合理使用 computed 和 watch

- 对于派生数据，使用 `computed`
- 对于副作用（如 API 调用），使用 `watch`

## 总结

Composition API 是 Vue 3 中引入的一套强大的 API，它提供了更灵活的代码组织方式和更好的逻辑复用能力。通过掌握 Composition API 的各种特性和最佳实践，可以构建出更易维护、更易测试的 Vue 应用程序。
