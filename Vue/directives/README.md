# Vue 自定义指令

## 什么是自定义指令

Vue 除了内置的指令（如 `v-if`、`v-for`、`v-model` 等）外，还允许开发者注册自定义指令。自定义指令提供了一种机制，用于将低级 DOM 操作封装为可重用的指令。

## 指令的钩子函数

一个指令定义对象可以提供以下几个钩子函数（可选）：

- `created`：在绑定元素的 attribute 或事件监听器被应用之前调用
- `beforeMount`：在元素被插入到 DOM 之前调用
- `mounted`：在绑定元素的父组件及他自己的所有子节点都挂载完成后调用
- `beforeUpdate`：在绑定元素的父组件更新他自己的 DOM 之前调用
- `updated`：在绑定元素的父组件及他自己的所有子节点都更新后调用
- `beforeUnmount`：在绑定元素的父组件卸载他之前调用
- `unmounted`：在绑定元素的父组件卸载后调用

### 钩子函数参数

指令钩子函数会被传入以下参数：

- `el`：指令所绑定的元素，可以用来直接操作 DOM
- `binding`：一个对象，包含以下属性：
  - `instance`：使用指令的组件实例
  - `value`：传递给指令的值
  - `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用
  - `arg`：传递给指令的参数
  - `modifiers`：一个包含修饰符的对象
  - `dir`：指令定义的对象
- `vnode`：绑定元素的底层 VNode
- `prevVnode`：之前的渲染中指令所绑定的 VNode，仅在 `beforeUpdate` 和 `updated` 中可用

## 注册自定义指令

### 全局注册

```javascript
import { createApp } from 'vue'

const app = createApp({})

app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

### 局部注册

```javascript
export default {
  directives: {
    focus: {
      mounted(el) {
        el.focus()
      }
    }
  }
}
```

## 常用指令示例

### 1. 自动聚焦指令

```javascript
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

使用：
```html
<input v-focus />
```

### 2. 复制到剪贴板指令

```javascript
app.directive('copy', {
  mounted(el, binding) {
    el.style.cursor = 'pointer'
    el.addEventListener('click', () => {
      const text = binding.value || el.textContent
      navigator.clipboard.writeText(text).then(() => {
        alert('复制成功！')
      })
    })
  }
})
```

使用：
```html
<button v-copy="'要复制的文本'">复制文本</button>
<p v-copy>点击复制这段文字</p>
```

### 3. 防抖指令

```javascript
app.directive('debounce', {
  mounted(el, binding) {
    let timeout
    const delay = Number(binding.arg) || 300

    el.addEventListener('click', () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        binding.value()
      }, delay)
    })
  }
})
```

使用：
```html
<button v-debounce:300="handleClick">点击我（防抖）</button>
```

### 4. 节流指令

```javascript
app.directive('throttle', {
  mounted(el, binding) {
    let lastTime = 0
    const delay = Number(binding.arg) || 300

    el.addEventListener('click', () => {
      const now = Date.now()
      if (now - lastTime >= delay) {
        binding.value()
        lastTime = now
      }
    })
  }
})
```

使用：
```html
<button v-throttle:300="handleClick">点击我（节流）</button>
```

### 5. 无限滚动指令

```javascript
app.directive('infinite-scroll', {
  mounted(el, binding) {
    const callback = binding.value
    const options = binding.arg || 100

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollHeight - (scrollTop + clientHeight) < options) {
        callback()
      }
    }

    el.addEventListener('scroll', handleScroll)
    el._scrollHandler = handleScroll
  },
  unmounted(el) {
    el.removeEventListener('scroll', el._scrollHandler)
  }
})
```

使用：
```html
<div v-infinite-scroll:100="loadMore" style="height: 400px; overflow-y: auto;">
  <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</div>
```

### 6. 权限指令

```javascript
app.directive('permission', {
  mounted(el, binding) {
    const { value } = binding
    const permissions = ['admin', 'editor', 'viewer']

    if (value && !permissions.includes(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})
```

使用：
```html
<button v-permission="'admin'">管理员按钮</button>
<button v-permission="'editor'">编辑按钮</button>
```

### 7. 长按指令

```javascript
app.directive('longpress', {
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
})
```

使用：
```html
<button v-longpress:1000="handleLongPress">长按 1 秒</button>
```

### 8. 懒加载指令

```javascript
app.directive('lazy', {
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
})
```

使用：
```html
<img v-lazy="'https://example.com/image.jpg'" alt="懒加载图片">
```

### 9. 点击外部指令

```javascript
app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
})
```

使用：
```html
<div v-click-outside="handleClickOutside">
  <p>点击这个 div 外部会触发事件</p>
</div>
```

### 10. 拖拽指令

```javascript
app.directive('draggable', {
  mounted(el, binding) {
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
})
```

使用：
```html
<div v-draggable style="left: 100px; top: 100px;">
  拖拽我
</div>
```

## 指令的修饰符

修饰符是特殊的后缀，用于指定指令应该以特殊方式绑定。

### 示例：防抖指令的修饰符

```javascript
app.directive('debounce', {
  mounted(el, binding) {
    let timeout
    const { modifiers, value } = binding
    const delay = modifiers.immediate ? 0 : 300

    el.addEventListener('click', () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        value()
      }, delay)
    })
  }
})
```

使用：
```html
<button v-debounce.immediate="handleClick">立即执行</button>
<button v-debounce="handleClick">延迟执行</button>
```

## 指令的参数

指令可以接收参数，用于传递配置信息。

### 示例：带参数的防抖指令

```javascript
app.directive('debounce', {
  mounted(el, binding) {
    let timeout
    const { arg, value } = binding
    const delay = Number(arg) || 300

    el.addEventListener('click', () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        value()
      }, delay)
    })
  }
})
```

使用：
```html
<button v-debounce:500="handleClick">500ms 防抖</button>
<button v-debounce:1000="handleClick">1000ms 防抖</button>
```

## 指令的值

指令可以接收动态值，值的变化会触发指令的更新。

### 示例：动态权限指令

```javascript
app.directive('permission', {
  mounted(el, binding) {
    updatePermission(el, binding.value)
  },
  updated(el, binding) {
    updatePermission(el, binding.value)
  }
})

function updatePermission(el, permission) {
  const permissions = ['admin', 'editor', 'viewer']
  if (permission && !permissions.includes(permission)) {
    el.style.display = 'none'
  } else {
    el.style.display = ''
  }
}
```

使用：
```html
<button v-permission="userPermission">权限按钮</button>
```

## Composition API 中的指令

在 Composition API 中，可以使用 `v-` 前缀来注册局部指令。

```javascript
import { ref } from 'vue'

export default {
  directives: {
    focus: {
      mounted(el) {
        el.focus()
      }
    }
  },
  setup() {
    const isVisible = ref(true)

    return {
      isVisible
    }
  }
}
```

## 最佳实践

### 1. 命名规范

- 使用小写字母命名指令
- 使用连字符分隔多个单词（如 `v-click-outside`）
- 指令名应该具有描述性，能够清楚地表达指令的功能

### 2. 清理副作用

在 `unmounted` 钩子中清理事件监听器、定时器等副作用，避免内存泄漏。

```javascript
app.directive('example', {
  mounted(el) {
    el._handler = () => console.log('Handler')
    el.addEventListener('click', el._handler)
  },
  unmounted(el) {
    el.removeEventListener('click', el._handler)
  }
})
```

### 3. 处理值的变化

使用 `updated` 钩子来处理指令值的变化。

```javascript
app.directive('example', {
  mounted(el, binding) {
    updateElement(el, binding.value)
  },
  updated(el, binding) {
    updateElement(el, binding.value)
  }
})
```

### 4. 提供默认值

为指令提供合理的默认值，使指令更加灵活。

```javascript
app.directive('debounce', {
  mounted(el, binding) {
    const delay = binding.arg || 300
  }
})
```

### 5. 错误处理

在指令中添加适当的错误处理，提高代码的健壮性。

```javascript
app.directive('copy', {
  mounted(el, binding) {
    el.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(binding.value)
        alert('复制成功！')
      } catch (err) {
        console.error('复制失败：', err)
        alert('复制失败，请手动复制')
      }
    })
  }
})
```

## 总结

Vue 自定义指令提供了一种强大的机制，用于封装和重用 DOM 操作逻辑。通过合理地设计和使用自定义指令，可以简化代码、提高开发效率，并使代码更加模块化和可维护。掌握自定义指令的各种特性和最佳实践，是成为一名高级 Vue 开发者的重要技能。
