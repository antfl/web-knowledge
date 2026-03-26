<template>
  <div class="app-container">
    <h1>Vue 组件示例</h1>

    <section class="section">
      <h2>1. Props 示例</h2>
      <PropsComponent
        :title="propsData.title"
        :count="propsData.count"
        :is-active="propsData.isActive"
        :items="propsData.items"
        @update="handlePropsUpdate"
      />
    </section>

    <section class="section">
      <h2>2. 事件示例</h2>
      <EventComponent @custom-event="handleCustomEvent" />
      <p>接收到的事件数据：{{ eventData }}</p>
    </section>

    <section class="section">
      <h2>3. 插槽示例</h2>
      <SlotComponent>
        <template v-slot:header>
          <h3>自定义头部</h3>
        </template>
        <p>这是默认插槽的内容</p>
        <template v-slot:footer>
          <p>自定义底部</p>
        </template>
      </SlotComponent>
    </section>

    <section class="section">
      <h2>4. 作用域插槽示例</h2>
      <ScopedSlotComponent>
        <template v-slot:default="slotProps">
          <div class="item">
            <strong>{{ slotProps.item.name }}</strong> - {{ slotProps.item.value }}
          </div>
        </template>
      </ScopedSlotComponent>
    </section>

    <section class="section">
      <h2>5. 动态组件示例</h2>
      <button @click="currentComponent = 'ComponentA'">组件 A</button>
      <button @click="currentComponent = 'ComponentB'">组件 B</button>
      <button @click="currentComponent = 'ComponentC'">组件 C</button>
      <component :is="currentComponent" :key="currentComponent"></component>
    </section>

    <section class="section">
      <h2>6. Ref 示例</h2>
      <RefComponent ref="refComponent" />
      <button @click="callRefMethod">调用子组件方法</button>
    </section>

    <section class="section">
      <h2>7. Provide/Inject 示例</h2>
      <InjectComponent />
    </section>

    <section class="section">
      <h2>8. 自定义指令示例</h2>
      <input v-focus placeholder="这个输入框会自动聚焦" />
      <input v-highlight="'yellow'" placeholder="这个输入框有黄色背景" />
    </section>

    <section class="section">
      <h2>9. 混入示例</h2>
      <MixinComponent />
    </section>

    <section class="section">
      <h2>10. 生命周期示例</h2>
      <LifecycleComponent />
    </section>
  </div>
</template>

<script>
/**
 * Props 组件
 * 演示 props 的使用和验证
 */
const PropsComponent = {
  name: 'PropsComponent',
  props: {
    title: {
      type: String,
      required: true,
      validator(value) {
        return value.length > 0
      }
    },
    count: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0
      }
    },
    isActive: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default() {
        return []
      }
    }
  },
  emits: ['update'],
  template: `
    <div class="props-component">
      <h3>Props 组件</h3>
      <p>标题：{{ title }}</p>
      <p>计数：{{ count }}</p>
      <p>状态：{{ isActive ? '激活' : '未激活' }}</p>
      <ul>
        <li v-for="(item, index) in items" :key="index">
          {{ item }}
        </li>
      </ul>
      <button @click="increment">增加计数</button>
    </div>
  `,
  methods: {
    increment() {
      this.$emit('update', this.count + 1)
    }
  }
}

/**
 * 事件组件
 * 演示事件的触发和监听
 */
const EventComponent = {
  name: 'EventComponent',
  template: `
    <div class="event-component">
      <h3>事件组件</h3>
      <button @click="handleClick">触发自定义事件</button>
    </div>
  `,
  methods: {
    handleClick() {
      this.$emit('custom-event', {
        message: 'Hello from EventComponent',
        timestamp: new Date().toISOString()
      })
    }
  }
}

/**
 * 插槽组件
 * 演示基础插槽和具名插槽
 */
const SlotComponent = {
  name: 'SlotComponent',
  template: `
    <div class="slot-component">
      <div class="slot-header">
        <slot name="header">
          <h3>默认头部</h3>
        </slot>
      </div>
      <div class="slot-body">
        <slot>
          <p>默认内容</p>
        </slot>
      </div>
      <div class="slot-footer">
        <slot name="footer">
          <p>默认底部</p>
        </slot>
      </div>
    </div>
  `
}

/**
 * 作用域插槽组件
 * 演示作用域插槽的使用
 */
const ScopedSlotComponent = {
  name: 'ScopedSlotComponent',
  data() {
    return {
      items: [
        { id: 1, name: '项目 1', value: 100 },
        { id: 2, name: '项目 2', value: 200 },
        { id: 3, name: '项目 3', value: 300 }
      ]
    }
  },
  template: `
    <div class="scoped-slot-component">
      <h3>作用域插槽组件</h3>
      <div v-for="item in items" :key="item.id">
        <slot :item="item"></slot>
      </div>
    </div>
  `
}

/**
 * 组件 A
 */
const ComponentA = {
  name: 'ComponentA',
  template: `
    <div class="component-a">
      <h3>组件 A</h3>
      <p>这是组件 A 的内容</p>
    </div>
  `
}

/**
 * 组件 B
 */
const ComponentB = {
  name: 'ComponentB',
  template: `
    <div class="component-b">
      <h3>组件 B</h3>
      <p>这是组件 B 的内容</p>
    </div>
  `
}

/**
 * 组件 C
 */
const ComponentC = {
  name: 'ComponentC',
  template: `
    <div class="component-c">
      <h3>组件 C</h3>
      <p>这是组件 C 的内容</p>
    </div>
  `
}

/**
 * Ref 组件
 * 演示通过 ref 访问子组件实例
 */
const RefComponent = {
  name: 'RefComponent',
  data() {
    return {
      message: 'Hello from RefComponent'
    }
  },
  template: `
    <div class="ref-component">
      <h3>Ref 组件</h3>
      <p>{{ message }}</p>
    </div>
  `,
  methods: {
    publicMethod() {
      alert('这是子组件的公共方法')
      return 'Method called'
    }
  }
}

/**
 * Inject 组件
 * 演示使用 inject 接收祖先组件提供的数据
 */
const InjectComponent = {
  name: 'InjectComponent',
  inject: ['theme', 'updateTheme'],
  template: `
    <div class="inject-component" :style="{ backgroundColor: theme.backgroundColor, color: theme.color }">
      <h3>Inject 组件</h3>
      <p>当前主题：{{ theme.name }}</p>
      <button @click="updateTheme">切换主题</button>
    </div>
  `
}

/**
 * 混入
 * 定义可复用的组件选项
 */
const myMixin = {
  data() {
    return {
      mixinMessage: 'Hello from mixin',
      mixinCount: 0
    }
  },
  methods: {
    mixinMethod() {
      console.log('Mixin method called')
      this.mixinCount++
    }
  },
  mounted() {
    console.log('Mixin mounted hook')
  }
}

/**
 * Mixin 组件
 * 演示混入的使用
 */
const MixinComponent = {
  name: 'MixinComponent',
  mixins: [myMixin],
  data() {
    return {
      componentMessage: 'Hello from component'
    }
  },
  template: `
    <div class="mixin-component">
      <h3>Mixin 组件</h3>
      <p>混入消息：{{ mixinMessage }}</p>
      <p>组件消息：{{ componentMessage }}</p>
      <p>混入计数：{{ mixinCount }}</p>
      <button @click="mixinMethod">调用混入方法</button>
    </div>
  `
}

/**
 * 生命周期组件
 * 演示组件的生命周期钩子
 */
const LifecycleComponent = {
  name: 'LifecycleComponent',
  data() {
    return {
      lifecycleLogs: [],
      count: 0
    }
  },
  template: `
    <div class="lifecycle-component">
      <h3>生命周期组件</h3>
      <button @click="count++">增加计数（{{ count }}）</button>
      <div class="logs">
        <h4>生命周期日志：</h4>
        <ul>
          <li v-for="(log, index) in lifecycleLogs" :key="index">
            {{ log }}
          </li>
        </ul>
      </div>
    </div>
  `,
  beforeCreate() {
    console.log('LifecycleComponent: beforeCreate')
    this.lifecycleLogs.push('beforeCreate')
  },
  created() {
    console.log('LifecycleComponent: created')
    this.lifecycleLogs.push('created')
  },
  beforeMount() {
    console.log('LifecycleComponent: beforeMount')
    this.lifecycleLogs.push('beforeMount')
  },
  mounted() {
    console.log('LifecycleComponent: mounted')
    this.lifecycleLogs.push('mounted')
  },
  beforeUpdate() {
    console.log('LifecycleComponent: beforeUpdate')
    this.lifecycleLogs.push('beforeUpdate')
  },
  updated() {
    console.log('LifecycleComponent: updated')
    this.lifecycleLogs.push('updated')
  },
  beforeUnmount() {
    console.log('LifecycleComponent: beforeUnmount')
    this.lifecycleLogs.push('beforeUnmount')
  },
  unmounted() {
    console.log('LifecycleComponent: unmounted')
    this.lifecycleLogs.push('unmounted')
  }
}

export default {
  name: 'App',
  components: {
    PropsComponent,
    EventComponent,
    SlotComponent,
    ScopedSlotComponent,
    ComponentA,
    ComponentB,
    ComponentC,
    RefComponent,
    InjectComponent,
    MixinComponent,
    LifecycleComponent
  },
  directives: {
    focus: {
      mounted(el) {
        el.focus()
      }
    },
    highlight: {
      mounted(el, binding) {
        el.style.backgroundColor = binding.value
      },
      updated(el, binding) {
        el.style.backgroundColor = binding.value
      }
    }
  },
  provide() {
    return {
      theme: this.theme,
      updateTheme: this.updateTheme
    }
  },
  data() {
    return {
      propsData: {
        title: 'Props 示例',
        count: 0,
        isActive: true,
        items: ['项目 1', '项目 2', '项目 3']
      },
      eventData: null,
      currentComponent: 'ComponentA',
      theme: {
        name: 'light',
        backgroundColor: '#ffffff',
        color: '#000000'
      }
    }
  },
  methods: {
    handlePropsUpdate(newCount) {
      this.propsData.count = newCount
      console.log('Props updated:', newCount)
    },
    handleCustomEvent(data) {
      this.eventData = data
      console.log('Custom event received:', data)
    },
    callRefMethod() {
      if (this.$refs.refComponent) {
        this.$refs.refComponent.publicMethod()
      }
    },
    updateTheme() {
      if (this.theme.name === 'light') {
        this.theme = {
          name: 'dark',
          backgroundColor: '#333333',
          color: '#ffffff'
        }
      } else {
        this.theme = {
          name: 'light',
          backgroundColor: '#ffffff',
          color: '#000000'
        }
      }
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

h3 {
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

.props-component,
.event-component,
.slot-component,
.scoped-slot-component,
.ref-component,
.inject-component,
.mixin-component,
.lifecycle-component {
  padding: 15px;
  background-color: white;
  border-radius: 5px;
  margin-top: 10px;
}

.component-a,
.component-b,
.component-c {
  padding: 15px;
  background-color: white;
  border-radius: 5px;
  margin-top: 10px;
  border-left: 4px solid #42b983;
}

.slot-header,
.slot-body,
.slot-footer {
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  border-radius: 3px;
}

.item {
  padding: 8px;
  margin: 5px 0;
  background-color: #e8f5e9;
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
</style>
