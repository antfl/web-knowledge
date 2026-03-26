# Vue 组件

## 什么是组件

组件是 Vue.js 最强大的功能之一。组件可以扩展 HTML 元素，封装可重用的代码。在较高层面上，组件是自定义元素，Vue.js 的编译器为它添加特殊功能。在有些情况下，组件也可以是原生 HTML 元素的形式，以 `is` 特性扩展。

## 组件的基本概念

### 组件的组成

一个 Vue 组件通常包含三个部分：
- **模板**：定义组件的 HTML 结构
- **脚本**：定义组件的逻辑和数据
- **样式**：定义组件的样式

```vue
<template>
  <div class="my-component">
    <h1>{{ title }}</h1>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      title: 'Hello Component'
    }
  },
  methods: {
    handleClick() {
      console.log('Button clicked')
    }
  }
}
</script>

<style scoped>
.my-component {
  padding: 20px;
}
</style>
```

## 组件的注册

### 全局注册

全局注册的组件可以在任何地方使用，不需要在每个使用它的组件中导入。

```javascript
import { createApp } from 'vue'
import MyComponent from './MyComponent.vue'

const app = createApp({})

app.component('MyComponent', MyComponent)

app.mount('#app')
```

### 局部注册

局部注册的组件只能在注册它的组件中使用。

```javascript
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

## 组件的 Props

### 基本用法

Props 是父组件向子组件传递数据的方式。

```javascript
// 子组件
export default {
  props: {
    title: String,
    count: Number,
    isActive: Boolean,
    user: Object,
    items: Array
  }
}
```

### Props 验证

Vue 提供了多种方式来验证 props。

```javascript
export default {
  props: {
    propA: Number,
    propB: [String, Number],
    propC: {
      type: String,
      required: true
    },
    propD: {
      type: Number,
      default: 100
    },
    propE: {
      type: Object,
      default() {
        return { message: 'hello' }
      }
    },
    propF: {
      validator(value) {
        return ['success', 'warning', 'danger'].includes(value)
      }
    }
  }
}
```

### 单向数据流

Props 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是不会反过来。这样是为了防止子组件无意修改父组件的状态。

```javascript
// 子组件不应该直接修改 props
export default {
  props: ['initialCounter'],
  data() {
    return {
      counter: this.initialCounter
    }
  }
}
```

## 组件的事件

### 基本用法

子组件可以通过 `$emit` 触发事件，向父组件传递数据。

```javascript
// 子组件
export default {
  methods: {
    handleClick() {
      this.$emit('update', 'new value')
    }
  }
}

// 父组件
<template>
  <ChildComponent @update="handleUpdate" />
</template>

<script>
export default {
  methods: {
    handleUpdate(value) {
      console.log('Received:', value)
    }
  }
}
</script>
```

### 事件参数

可以向事件传递多个参数。

```javascript
// 子组件
this.$emit('submit', { username: 'john', password: '123' })

// 父组件
<ChildComponent @submit="handleSubmit" />

<script>
export default {
  methods: {
    handleSubmit(data) {
      console.log(data.username, data.password)
    }
  }
}
</script>
```

### 事件修饰符

- `.native`：监听组件根元素的原生事件
- `.once`：事件只触发一次

```html
<ChildComponent @click.native="handleNativeClick" />
<ChildComponent @update.once="handleUpdateOnce" />
```

## 组件的插槽

### 基础插槽

插槽允许组件接收和分发内容。

```vue
<!-- 子组件 -->
<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<!-- 父组件 -->
<template>
  <MyComponent>
    <p>这是插槽内容</p>
  </MyComponent>
</template>
```

### 具名插槽

具名插槽允许组件有多个插槽。

```vue
<!-- 子组件 -->
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<!-- 父组件 -->
<template>
  <MyComponent>
    <template v-slot:header>
      <h1>标题</h1>
    </template>
    <p>主要内容</p>
    <template v-slot:footer>
      <p>页脚</p>
    </template>
  </MyComponent>
</template>
```

### 作用域插槽

作用域插槽允许插槽内容访问子组件的数据。

```vue
<!-- 子组件 -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' }
      ]
    }
  }
}
</script>

<!-- 父组件 -->
<template>
  <MyComponent>
    <template v-slot:default="slotProps">
      <span>{{ slotProps.item.text }} ({{ slotProps.index }})</span>
    </template>
  </MyComponent>
</template>
```

## 动态组件

使用 `<component>` 元素和 `is` 特性实现动态组件切换。

```vue
<template>
  <button @click="currentTab = 'TabA'">Tab A</button>
  <button @click="currentTab = 'TabB'">Tab B</button>
  <component :is="currentTab"></component>
</template>

<script>
import TabA from './TabA.vue'
import TabB from './TabB.vue'

export default {
  components: {
    TabA,
    TabB
  },
  data() {
    return {
      currentTab: 'TabA'
    }
  }
}
</script>
```

## 组件的生命周期

### 生命周期钩子

Vue 组件有一系列生命周期钩子，允许开发者在组件的不同阶段添加代码。

```javascript
export default {
  beforeCreate() {
    console.log('beforeCreate')
  },
  created() {
    console.log('created')
  },
  beforeMount() {
    console.log('beforeMount')
  },
  mounted() {
    console.log('mounted')
  },
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  updated() {
    console.log('updated')
  },
  beforeUnmount() {
    console.log('beforeUnmount')
  },
  unmounted() {
    console.log('unmounted')
  }
}
```

## 组件的通信

### 父子组件通信

#### 父传子（Props）

```javascript
// 父组件
<ChildComponent :message="parentMessage" />

// 子组件
export default {
  props: ['message']
}
```

#### 子传父（Events）

```javascript
// 子组件
this.$emit('update', value)

// 父组件
<ChildComponent @update="handleUpdate" />
```

### 兄弟组件通信

#### 事件总线

```javascript
// event-bus.js
import { createApp } from 'vue'

export const EventBus = createApp()

// 组件 A
EventBus.emit('event-name', data)

// 组件 B
EventBus.on('event-name', (data) => {
  console.log(data)
})
```

#### 状态管理（Vuex/Pinia）

使用 Vuex 或 Pinia 进行跨组件状态管理。

### 跨层级组件通信

#### Provide / Inject

```javascript
// 祖先组件
export default {
  provide() {
    return {
      theme: this.theme,
      updateTheme: this.updateTheme
    }
  }
}

// 后代组件
export default {
  inject: ['theme', 'updateTheme']
}
```

## 组件的 Ref

### 访问子组件实例

通过 ref 访问子组件实例或 DOM 元素。

```vue
<template>
  <ChildComponent ref="child" />
  <button @click="callChildMethod">调用子组件方法</button>
</template>

<script>
export default {
  methods: {
    callChildMethod() {
      this.$refs.child.childMethod()
    }
  }
}
</script>
```

### 访问 DOM 元素

```vue
<template>
  <input ref="input" />
  <button @click="focusInput">聚焦输入框</button>
</template>

<script>
export default {
  methods: {
    focusInput() {
      this.$refs.input.focus()
    }
  }
}
</script>
```

## 组件的混入

### 基本用法

混入（mixin）是一种分发 Vue 组件中可复用功能的非常灵活的方式。

```javascript
// myMixin.js
export default {
  data() {
    return {
      mixinData: 'Hello from mixin'
    }
  },
  methods: {
    mixinMethod() {
      console.log('Mixin method called')
    }
  }
}

// 组件
import myMixin from './myMixin'

export default {
  mixins: [myMixin]
}
```

### 选项合并

当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行合并。

- `data` 对象在内部会进行递归合并，并在发生冲突时以组件数据优先
- 同名钩子函数将合并为一个数组，因此都将被调用
- 值为对象的选项，例如 `methods`、`components` 和 `directives`，将被合并为同一个对象

## 组件的自定义指令

### 指令注册

```javascript
// 全局注册
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// 局部注册
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

### 指令钩子

- `created`：在绑定元素的 attribute 或事件监听器被应用之前调用
- `beforeMount`：在元素被插入到 DOM 之前调用
- `mounted`：在绑定元素的父组件及他自己的所有子节点都挂载完成后调用
- `beforeUpdate`：在绑定元素的父组件更新他自己的 DOM 之前调用
- `updated`：在绑定元素的父组件及他自己的所有子节点都更新后调用
- `beforeUnmount`：在绑定元素的父组件卸载他之前调用
- `unmounted`：在绑定元素的父组件卸载后调用

```javascript
app.directive('highlight', {
  beforeMount(el, binding) {
    el.style.background = binding.value
  },
  updated(el, binding) {
    el.style.background = binding.value
  }
})
```

## 组件的最佳实践

### 组件命名

- 使用 PascalCase 命名组件文件（如 `MyComponent.vue`）
- 在模板中使用 kebab-case 引用组件（如 `<my-component>`）
- 组件名应该具有描述性，能够清楚地表达组件的功能

### 组件设计原则

1. **单一职责**：每个组件应该只做一件事
2. **可复用性**：设计组件时考虑其复用性，避免过度耦合
3. **可测试性**：组件应该易于测试，避免复杂的依赖关系
4. **性能优化**：合理使用 `v-if` 和 `v-show`，避免不必要的渲染

### Props 设计

- 为 props 提供默认值
- 使用类型验证
- 避免直接修改 props
- 使用 prop 验证器确保数据的有效性

### 事件命名

- 使用 kebab-case 命名事件
- 事件名应该具有描述性
- 避免使用 Vue 内置的事件名

### 组件通信

- 优先使用 props 和 events 进行父子组件通信
- 对于跨层级通信，考虑使用 provide/inject
- 对于复杂的状态管理，使用 Vuex 或 Pinia

## 总结

Vue 组件是构建 Vue 应用的基本单元。通过合理地设计和使用组件，可以构建出可维护、可复用、可测试的应用程序。掌握组件的各种特性和最佳实践，是成为一名优秀 Vue 开发者的关键。
