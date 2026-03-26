# Vue.js 基础知识

## 什么是 Vue.js

Vue.js 是一个用于构建用户界面的渐进式 JavaScript 框架。与其他大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。

## Vue 的核心特性

### 1. 响应式数据绑定

Vue 的核心是一个响应式系统，它允许开发者以声明式的方式将数据绑定到 DOM。当数据发生变化时，视图会自动更新。

**示例：**
```javascript
const app = Vue.createApp({
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
})
```

### 2. 组件化应用构建

Vue 应用由组件树构成。组件是可复用的 Vue 实例，每个组件都有自己的模板、逻辑和样式。

**示例：**
```javascript
const MyComponent = {
  template: '<div>My Component</div>'
}
```

### 3. 指令系统

Vue 提供了一套丰富的指令，用于在模板中声明式地应用特殊的行为。

**常用指令：**
- `v-bind`：绑定属性
- `v-on`：绑定事件
- `v-if`、`v-else`、`v-else-if`：条件渲染
- `v-for`：列表渲染
- `v-model`：双向数据绑定
- `v-show`：条件显示

## Vue 实例

### 创建 Vue 实例

Vue 3 使用 `createApp` 函数创建应用实例：

```javascript
const app = Vue.createApp({
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
})

app.mount('#app')
```

### 实例选项

#### data

`data` 选项用于声明组件的响应式数据。它必须是一个函数，返回一个对象。

```javascript
data() {
  return {
    message: 'Hello Vue!',
    count: 0,
    user: {
      name: 'John',
      age: 30
    }
  }
}
```

#### methods

`methods` 选项用于定义组件的方法。方法可以在模板中通过事件绑定调用。

```javascript
methods: {
  increment() {
    this.count++
  },
  greet(name) {
    return `Hello, ${name}!`
  }
}
```

#### computed

`computed` 选项用于定义计算属性。计算属性基于它们的响应式依赖进行缓存，只有在相关依赖发生改变时才会重新求值。

```javascript
computed: {
  fullName() {
    return `${this.firstName} ${this.lastName}`
  },
  reversedMessage() {
    return this.message.split('').reverse().join('')
  }
}
```

#### watch

`watch` 选项用于监听数据的变化并执行相应的操作。

```javascript
watch: {
  message(newVal, oldVal) {
    console.log(`Message changed from ${oldVal} to ${newVal}`)
  },
  count: {
    handler(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`)
    },
    immediate: true,
    deep: true
  }
}
```

#### props

`props` 选项用于接收父组件传递的数据。

```javascript
props: {
  title: String,
  count: {
    type: Number,
    required: true,
    default: 0,
    validator(value) {
      return value >= 0
    }
  }
}
```

#### emits

`emits` 选项用于声明组件可以触发的事件。

```javascript
emits: ['update', 'delete'],
methods: {
  handleUpdate() {
    this.$emit('update', this.value)
  }
}
```

## 模板语法

### 插值

使用 `{{ }}` 语法进行文本插值：

```html
<span>Message: {{ message }}</span>
```

### 指令

#### v-bind

`v-bind` 用于绑定 HTML 属性：

```html
<img v-bind:src="imageSrc" alt="Image">
<!-- 简写形式 -->
<img :src="imageSrc" alt="Image">
```

#### v-on

`v-on` 用于绑定事件监听器：

```html
<button v-on:click="doSomething">Click me</button>
<!-- 简写形式 -->
<button @click="doSomething">Click me</button>
```

#### v-if、v-else、v-else-if

条件渲染指令：

```html
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else-if="type === 'C'">C</div>
<div v-else>Not A/B/C</div>
```

#### v-for

列表渲染指令：

```html
<ul>
  <li v-for="(item, index) in items" :key="item.id">
    {{ index }} - {{ item.name }}
  </li>
</ul>
```

#### v-model

双向数据绑定指令：

```html
<input v-model="message" placeholder="Edit me">
<textarea v-model="message"></textarea>
<select v-model="selected">
  <option v-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>
```

#### v-show

条件显示指令：

```html
<div v-show="isVisible">This will be shown/hidden</div>
```

### 修饰符

#### 事件修饰符

- `.stop`：阻止事件冒泡
- `.prevent`：阻止默认行为
- `.capture`：使用事件捕获模式
- `.self`：只在事件从元素本身触发时才触发回调
- `.once`：事件只触发一次
- `.passive`：滚动事件的默认行为将会立即触发

```html
<button @click.stop="doThis">Stop propagation</button>
<form @submit.prevent="onSubmit">Prevent submit</form>
```

#### 按键修饰符

```html
<input @keyup.enter="onEnter">
<input @keyup.page-down="onPageDown">
```

#### 系统修饰符

- `.ctrl`、`.alt`、`.shift`、`.meta`

```html
<input @keyup.ctrl.enter="onCtrlEnter">
```

## 生命周期钩子

Vue 组件有一系列生命周期钩子，允许开发者在组件的不同阶段添加代码。

### 选项式 API 生命周期钩子

- `beforeCreate`：实例初始化之后，数据观测和事件配置之前
- `created`：实例创建完成，数据观测、属性和方法的运算、事件回调已配置
- `beforeMount`：挂载开始之前
- `mounted`：实例挂载完成
- `beforeUpdate`：数据更新时
- `updated`：数据更新导致的 DOM 重新渲染完成
- `beforeUnmount`：卸载之前
- `unmounted`：实例卸载完成

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

## 组件通信

### Props Down

父组件通过 props 向子组件传递数据：

```javascript
// 父组件
<template>
  <ChildComponent :message="parentMessage" />
</template>

// 子组件
export default {
  props: {
    message: String
  }
}
```

### Events Up

子组件通过事件向父组件传递数据：

```javascript
// 子组件
export default {
  methods: {
    handleClick() {
      this.$emit('update', this.value)
    }
  }
}

// 父组件
<template>
  <ChildComponent @update="handleUpdate" />
</template>
```

### Provide / Inject

跨层级组件通信：

```javascript
// 祖先组件
export default {
  provide() {
    return {
      message: this.message
    }
  }
}

// 后代组件
export default {
  inject: ['message']
}
```

### Ref

通过 ref 访问子组件实例或 DOM 元素：

```javascript
// 父组件
<template>
  <ChildComponent ref="child" />
</template>

export default {
  methods: {
    callChildMethod() {
      this.$refs.child.childMethod()
    }
  }
}
```

## 插槽

插槽允许组件接收和分发内容。

### 基础插槽

```javascript
// 父组件
<template>
  <MyComponent>
    <p>This is some content</p>
  </MyComponent>
</template>

// 子组件
<template>
  <div class="container">
    <slot></slot>
  </div>
</template>
```

### 具名插槽

```javascript
// 父组件
<template>
  <MyComponent>
    <template v-slot:header>
      <h1>Header</h1>
    </template>
    <template v-slot:default>
      <p>Content</p>
    </template>
    <template v-slot:footer>
      <p>Footer</p>
    </template>
  </MyComponent>
</template>

// 子组件
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
```

### 作用域插槽

```javascript
// 父组件
<template>
  <MyComponent>
    <template v-slot:default="slotProps">
      <p>{{ slotProps.item.text }}</p>
    </template>
  </MyComponent>
</template>

// 子组件
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item"></slot>
    </li>
  </ul>
</template>
```

## 动态组件

使用 `<component>` 元素和 `is` 特性实现动态组件：

```html
<template>
  <button @click="currentComponent = 'ComponentA'">Show A</button>
  <button @click="currentComponent = 'ComponentB'">Show B</button>
  <component :is="currentComponent"></component>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: 'ComponentA'
    }
  },
  components: {
    ComponentA,
    ComponentB
  }
}
</script>
```

## 过渡动画

Vue 提供了内置的过渡系统，可以在元素插入、更新或移除时应用过渡效果。

```html
<template>
  <transition name="fade">
    <p v-if="show">Hello</p>
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## 最佳实践

1. **组件命名**：使用 PascalCase 命名组件文件，使用 kebab-case 在模板中引用组件
2. **Props 验证**：始终为 props 定义类型和验证规则
3. **事件命名**：使用 kebab-case 命名事件
4. **单一职责**：每个组件应该只做一件事
5. **避免直接修改 props**：props 应该被视为只读的
6. **使用计算属性**：对于复杂的数据处理，使用计算属性而不是方法
7. **合理使用 v-if 和 v-show**：v-if 有更高的切换开销，v-show 有更高的初始渲染开销
8. **为 v-for 设置 key**：为列表渲染提供唯一的 key 值

## 总结

Vue.js 是一个功能强大且易于学习的框架，通过掌握这些基础知识，你可以开始构建复杂的单页应用。建议在实际项目中不断练习和应用这些概念，以加深理解。
