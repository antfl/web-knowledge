<template>
  <div class="app-container">
    <h1>Vue.js 基础示例</h1>

    <section class="section">
      <h2>1. 数据绑定</h2>
      <p>消息：{{ message }}</p>
      <p>计数器：{{ count }}</p>
      <button @click="increment">增加计数</button>
    </section>

    <section class="section">
      <h2>2. 双向数据绑定</h2>
      <input v-model="inputMessage" placeholder="输入消息">
      <p>你输入的消息：{{ inputMessage }}</p>
    </section>

    <section class="section">
      <h2>3. 条件渲染</h2>
      <button @click="toggleShow">切换显示</button>
      <p v-if="show">这段文字会显示和隐藏</p>
      <p v-show="show">这段文字使用 v-show</p>
    </section>

    <section class="section">
      <h2>4. 列表渲染</h2>
      <ul>
        <li v-for="(item, index) in items" :key="item.id">
          {{ index }} - {{ item.name }}
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>5. 计算属性</h2>
      <p>名字：{{ firstName }} {{ lastName }}</p>
      <p>全名（计算属性）：{{ fullName }}</p>
      <p>反转消息（计算属性）：{{ reversedMessage }}</p>
    </section>

    <section class="section">
      <h2>6. 事件处理</h2>
      <button @click="handleClick">点击我</button>
      <button @click="handleClickWithParams($event, '参数')">带参数点击</button>
      <button @click.stop="handleStopPropagation">阻止冒泡</button>
      <button @click.once="handleOnce">只触发一次</button>
    </section>

    <section class="section">
      <h2>7. 表单输入绑定</h2>
      <input v-model="formData.name" placeholder="姓名">
      <input v-model="formData.email" placeholder="邮箱">
      <textarea v-model="formData.message" placeholder="消息"></textarea>
      <select v-model="formData.selected">
        <option value="">请选择</option>
        <option value="option1">选项 1</option>
        <option value="option2">选项 2</option>
        <option value="option3">选项 3</option>
      </select>
      <input type="checkbox" v-model="formData.agree"> 同意条款
      <p>表单数据：{{ formData }}</p>
    </section>

    <section class="section">
      <h2>8. 动态组件</h2>
      <button @click="currentTab = 'tab1'">标签 1</button>
      <button @click="currentTab = 'tab2'">标签 2</button>
      <button @click="currentTab = 'tab3'">标签 3</button>
      <component :is="currentTab"></component>
    </section>

    <section class="section">
      <h2>9. 过渡动画</h2>
      <button @click="toggleTransition">切换过渡</button>
      <transition name="fade">
        <p v-if="showTransition">这是一个过渡动画示例</p>
      </transition>
    </section>

    <section class="section">
      <h2>10. 插槽示例</h2>
      <slot-example>
        <template v-slot:header>
          <h3>插槽头部</h3>
        </template>
        <p>这是插槽内容</p>
        <template v-slot:footer>
          <p>插槽底部</p>
        </template>
      </slot-example>
    </section>

    <section class="section">
      <h2>11. 生命周期</h2>
      <p>生命周期日志：{{ lifecycleLogs.join(', ') }}</p>
    </section>
  </div>
</template>

<script>
/**
 * 子组件：插槽示例
 */
const SlotExample = {
  template: `
    <div class="slot-example">
      <slot name="header"></slot>
      <slot></slot>
      <slot name="footer"></slot>
    </div>
  `
}

/**
 * 标签 1 组件
 */
const Tab1 = {
  template: '<div class="tab">标签 1 内容</div>'
}

/**
 * 标签 2 组件
 */
const Tab2 = {
  template: '<div class="tab">标签 2 内容</div>'
}

/**
 * 标签 3 组件
 */
const Tab3 = {
  template: '<div class="tab">标签 3 内容</div>'
}

export default {
  name: 'App',
  components: {
    SlotExample,
    Tab1,
    Tab2,
    Tab3
  },
  data() {
    return {
      message: 'Hello Vue!',
      count: 0,
      inputMessage: '',
      show: true,
      showTransition: true,
      firstName: 'John',
      lastName: 'Doe',
      currentTab: 'tab1',
      lifecycleLogs: [],
      items: [
        { id: 1, name: '项目 1' },
        { id: 2, name: '项目 2' },
        { id: 3, name: '项目 3' }
      ],
      formData: {
        name: '',
        email: '',
        message: '',
        selected: '',
        agree: false
      }
    }
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },
    reversedMessage() {
      return this.message.split('').reverse().join('')
    }
  },
  watch: {
    count(newVal, oldVal) {
      console.log(`计数从 ${oldVal} 变为 ${newVal}`)
    },
    message(newVal, oldVal) {
      console.log(`消息从 "${oldVal}" 变为 "${newVal}"`)
    }
  },
  beforeCreate() {
    console.log('beforeCreate: 实例初始化之后，数据观测和事件配置之前')
    this.lifecycleLogs.push('beforeCreate')
  },
  created() {
    console.log('created: 实例创建完成，数据观测、属性和方法的运算、事件回调已配置')
    this.lifecycleLogs.push('created')
  },
  beforeMount() {
    console.log('beforeMount: 挂载开始之前')
    this.lifecycleLogs.push('beforeMount')
  },
  mounted() {
    console.log('mounted: 实例挂载完成')
    this.lifecycleLogs.push('mounted')
  },
  beforeUpdate() {
    console.log('beforeUpdate: 数据更新时')
    this.lifecycleLogs.push('beforeUpdate')
  },
  updated() {
    console.log('updated: 数据更新导致的 DOM 重新渲染完成')
    this.lifecycleLogs.push('updated')
  },
  beforeUnmount() {
    console.log('beforeUnmount: 卸载之前')
    this.lifecycleLogs.push('beforeUnmount')
  },
  unmounted() {
    console.log('unmounted: 实例卸载完成')
    this.lifecycleLogs.push('unmounted')
  },
  methods: {
    increment() {
      this.count++
    },
    toggleShow() {
      this.show = !this.show
    },
    handleClick() {
      alert('你点击了按钮！')
    },
    handleClickWithParams(event, params) {
      console.log('事件对象：', event)
      console.log('参数：', params)
      alert(`参数：${params}`)
    },
    handleStopPropagation() {
      alert('这个事件不会冒泡')
    },
    handleOnce() {
      alert('这个事件只会触发一次')
    },
    toggleTransition() {
      this.showTransition = !this.showTransition
    }
  }
}
</script>

<style scoped>
.app-container {
  max-width: 800px;
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

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa876;
}

input,
textarea,
select {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-sizing: border-box;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.slot-example {
  border: 1px solid #42b983;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
}

.tab {
  padding: 15px;
  background-color: #e8f5e9;
  border-radius: 5px;
  margin-top: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
