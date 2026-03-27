<template>
  <div class="app-container">
    <h1>Vue 表单处理示例</h1>

    <!-- 1. 基本表单绑定 -->
    <section class="section">
      <h2>1. 基本表单绑定</h2>
      <form @submit.prevent="submitBasicForm">
        <div class="form-group">
          <label>用户名:</label>
          <input type="text" v-model="basicForm.username" placeholder="请输入用户名">
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input type="password" v-model="basicForm.password" placeholder="请输入密码">
        </div>
        <button type="submit" class="btn">提交</button>
      </form>
      <div class="form-result">
        <p>表单数据: {{ basicForm }}</p>
      </div>
    </section>

    <!-- 2. 不同类型的表单元素 -->
    <section class="section">
      <h2>2. 不同类型的表单元素</h2>
      <form>
        <!-- 文本输入框 -->
        <div class="form-group">
          <label>文本输入:</label>
          <input type="text" v-model="formElements.text" placeholder="请输入文本">
        </div>

        <!-- 多行文本框 -->
        <div class="form-group">
          <label>多行文本:</label>
          <textarea v-model="formElements.message" placeholder="请输入多行文本"></textarea>
        </div>

        <!-- 单个复选框 -->
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="formElements.checked"> 同意条款
          </label>
        </div>

        <!-- 多个复选框 -->
        <div class="form-group">
          <label>爱好:</label>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" value="reading" v-model="formElements.hobbies"> 阅读
            </label>
            <label>
              <input type="checkbox" value="sports" v-model="formElements.hobbies"> 运动
            </label>
            <label>
              <input type="checkbox" value="music" v-model="formElements.hobbies"> 音乐
            </label>
          </div>
        </div>

        <!-- 单选按钮 -->
        <div class="form-group">
          <label>性别:</label>
          <div class="radio-group">
            <label>
              <input type="radio" value="male" v-model="formElements.gender"> 男
            </label>
            <label>
              <input type="radio" value="female" v-model="formElements.gender"> 女
            </label>
          </div>
        </div>

        <!-- 下拉选择框 -->
        <div class="form-group">
          <label>城市:</label>
          <select v-model="formElements.city">
            <option value="">请选择</option>
            <option value="beijing">北京</option>
            <option value="shanghai">上海</option>
            <option value="guangzhou">广州</option>
          </select>
        </div>

        <!-- 多选下拉框 -->
        <div class="form-group">
          <label>技能 (可多选):</label>
          <select v-model="formElements.skills" multiple>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="vue">Vue</option>
          </select>
        </div>
      </form>
      <div class="form-result">
        <p>表单元素数据: {{ formElements }}</p>
      </div>
    </section>

    <!-- 3. v-model 修饰符 -->
    <section class="section">
      <h2>3. v-model 修饰符</h2>
      <form>
        <!-- .lazy 修饰符 -->
        <div class="form-group">
          <label>.lazy 修饰符 (失去焦点时更新):</label>
          <input type="text" v-model.lazy="modifiers.lazyText" placeholder="请输入文本">
          <p>当前值: {{ modifiers.lazyText }}</p>
        </div>

        <!-- .number 修饰符 -->
        <div class="form-group">
          <label>.number 修饰符 (自动转换为数字):</label>
          <input type="text" v-model.number="modifiers.age" placeholder="请输入年龄">
          <p>当前值: {{ modifiers.age }}, 类型: {{ typeof modifiers.age }}</p>
        </div>

        <!-- .trim 修饰符 -->
        <div class="form-group">
          <label>.trim 修饰符 (自动去除首尾空格):</label>
          <input type="text" v-model.trim="modifiers.trimText" placeholder="请输入文本">
          <p>当前值: "{{ modifiers.trimText }}", 长度: {{ modifiers.trimText.length }}</p>
        </div>
      </form>
    </section>

    <!-- 4. 表单验证 -->
    <section class="section">
      <h2>4. 表单验证</h2>
      <form @submit.prevent="submitValidationForm">
        <div class="form-group">
          <label>用户名:</label>
          <input type="text" v-model="validationForm.username" @blur="validateField('username')">
          <span v-if="errors.username" class="error">{{ errors.username }}</span>
        </div>
        <div class="form-group">
          <label>邮箱:</label>
          <input type="email" v-model="validationForm.email" @blur="validateField('email')">
          <span v-if="errors.email" class="error">{{ errors.email }}</span>
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input type="password" v-model="validationForm.password" @blur="validateField('password')">
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>
        <div class="form-group">
          <label>确认密码:</label>
          <input type="password" v-model="validationForm.confirmPassword" @blur="validateField('confirmPassword')">
          <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
        </div>
        <button type="submit" class="btn">提交</button>
      </form>
      <div class="form-result" v-if="validationSuccess">
        <p class="success">表单验证通过！</p>
        <p>表单数据: {{ validationForm }}</p>
      </div>
    </section>

    <!-- 5. 异步表单提交 -->
    <section class="section">
      <h2>5. 异步表单提交</h2>
      <form @submit.prevent="submitAsyncForm">
        <div class="form-group">
          <label>姓名:</label>
          <input type="text" v-model="asyncForm.name" placeholder="请输入姓名">
        </div>
        <div class="form-group">
          <label>手机号:</label>
          <input type="tel" v-model="asyncForm.phone" placeholder="请输入手机号">
        </div>
        <button type="submit" class="btn" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交' }}
        </button>
      </form>
      <div class="form-result" v-if="submitResult">
        <p :class="submitResult.success ? 'success' : 'error'">{{ submitResult.message }}</p>
      </div>
    </section>

    <!-- 6. 动态表单 -->
    <section class="section">
      <h2>6. 动态表单</h2>
      <form @submit.prevent="submitDynamicForm">
        <div v-for="(field, index) in dynamicForm.fields" :key="index" class="form-group">
          <label>字段 {{ index + 1 }}:</label>
          <input type="text" v-model="field.value" :placeholder="`请输入字段 ${index + 1} 的值`">
          <button type="button" class="btn btn-danger" @click="removeField(index)" :disabled="dynamicForm.fields.length <= 1">删除</button>
        </div>
        <button type="button" class="btn btn-secondary" @click="addField">添加字段</button>
        <button type="submit" class="btn">提交</button>
      </form>
      <div class="form-result" v-if="dynamicFormSubmitted">
        <p class="success">动态表单提交成功！</p>
        <p>表单数据: {{ dynamicForm.fields }}</p>
      </div>
    </section>

    <!-- 7. 表单重置 -->
    <section class="section">
      <h2>7. 表单重置</h2>
      <form @submit.prevent="submitResetForm">
        <div class="form-group">
          <label>用户名:</label>
          <input type="text" v-model="resetForm.username" placeholder="请输入用户名">
        </div>
        <div class="form-group">
          <label>邮箱:</label>
          <input type="email" v-model="resetForm.email" placeholder="请输入邮箱">
        </div>
        <button type="button" class="btn btn-secondary" @click="resetFormData">重置</button>
        <button type="submit" class="btn">提交</button>
      </form>
      <div class="form-result" v-if="resetFormSubmitted">
        <p class="success">表单提交成功！</p>
        <p>表单数据: {{ resetForm }}</p>
      </div>
    </section>

    <!-- 8. Composition API 表单 -->
    <section class="section">
      <h2>8. Composition API 表单</h2>
      <form @submit.prevent="submitCompositionForm">
        <div class="form-group">
          <label>用户名:</label>
          <input type="text" v-model="compositionForm.username" placeholder="请输入用户名">
          <span v-if="compositionErrors.username" class="error">{{ compositionErrors.username }}</span>
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input type="password" v-model="compositionForm.password" placeholder="请输入密码">
          <span v-if="compositionErrors.password" class="error">{{ compositionErrors.password }}</span>
        </div>
        <button type="submit" class="btn">提交</button>
      </form>
      <div class="form-result" v-if="compositionSubmitted">
        <p class="success">Composition API 表单提交成功！</p>
        <p>表单数据: {{ compositionForm }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'App',
  setup() {
    // 1. 基本表单绑定
    const basicForm = reactive({
      username: '',
      password: ''
    })

    function submitBasicForm() {
      console.log('提交基本表单:', basicForm)
    }

    // 2. 不同类型的表单元素
    const formElements = reactive({
      text: '',
      message: '',
      checked: false,
      hobbies: [],
      gender: '',
      city: '',
      skills: []
    })

    // 3. v-model 修饰符
    const modifiers = reactive({
      lazyText: '',
      age: '',
      trimText: ''
    })

    // 4. 表单验证
    const validationForm = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const errors = reactive({})
    const validationSuccess = ref(false)

    function validateField(field) {
      switch (field) {
        case 'username':
          if (!validationForm.username) {
            errors.username = '用户名不能为空'
          } else if (validationForm.username.length < 3) {
            errors.username = '用户名长度至少为3位'
          } else {
            delete errors.username
          }
          break
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!validationForm.email) {
            errors.email = '邮箱不能为空'
          } else if (!emailRegex.test(validationForm.email)) {
            errors.email = '请输入有效的邮箱地址'
          } else {
            delete errors.email
          }
          break
        case 'password':
          if (!validationForm.password) {
            errors.password = '密码不能为空'
          } else if (validationForm.password.length < 6) {
            errors.password = '密码长度至少为6位'
          } else {
            delete errors.password
          }
          break
        case 'confirmPassword':
          if (!validationForm.confirmPassword) {
            errors.confirmPassword = '请确认密码'
          } else if (validationForm.confirmPassword !== validationForm.password) {
            errors.confirmPassword = '两次输入的密码不一致'
          } else {
            delete errors.confirmPassword
          }
          break
      }
    }

    function validateForm() {
      Object.keys(errors).forEach(key => delete errors[key])
      
      validateField('username')
      validateField('email')
      validateField('password')
      validateField('confirmPassword')
      
      return Object.keys(errors).length === 0
    }

    function submitValidationForm() {
      if (validateForm()) {
        validationSuccess.value = true
        console.log('提交验证表单:', validationForm)
      } else {
        validationSuccess.value = false
      }
    }

    // 5. 异步表单提交
    const asyncForm = reactive({
      name: '',
      phone: ''
    })

    const isSubmitting = ref(false)
    const submitResult = ref(null)

    async function submitAsyncForm() {
      isSubmitting.value = true
      submitResult.value = null
      
      try {
        // 模拟网络请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        submitResult.value = {
          success: true,
          message: '表单提交成功！'
        }
        
        console.log('提交异步表单:', asyncForm)
      } catch (error) {
        submitResult.value = {
          success: false,
          message: '表单提交失败，请重试'
        }
        console.error('提交失败:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    // 6. 动态表单
    const dynamicForm = reactive({
      fields: [
        { value: '' }
      ]
    })

    const dynamicFormSubmitted = ref(false)

    function addField() {
      dynamicForm.fields.push({ value: '' })
    }

    function removeField(index) {
      if (dynamicForm.fields.length > 1) {
        dynamicForm.fields.splice(index, 1)
      }
    }

    function submitDynamicForm() {
      dynamicFormSubmitted.value = true
      console.log('提交动态表单:', dynamicForm.fields)
    }

    // 7. 表单重置
    const initialResetForm = {
      username: '',
      email: ''
    }

    const resetForm = reactive({ ...initialResetForm })
    const resetFormSubmitted = ref(false)

    function resetFormData() {
      Object.assign(resetForm, initialResetForm)
      resetFormSubmitted.value = false
    }

    function submitResetForm() {
      resetFormSubmitted.value = true
      console.log('提交重置表单:', resetForm)
    }

    // 8. Composition API 表单
    const compositionForm = reactive({
      username: '',
      password: ''
    })

    const compositionErrors = reactive({})
    const compositionSubmitted = ref(false)

    function validateCompositionForm() {
      Object.keys(compositionErrors).forEach(key => delete compositionErrors[key])
      
      if (!compositionForm.username) {
        compositionErrors.username = '用户名不能为空'
      }
      
      if (!compositionForm.password) {
        compositionErrors.password = '密码不能为空'
      } else if (compositionForm.password.length < 6) {
        compositionErrors.password = '密码长度至少为6位'
      }
      
      return Object.keys(compositionErrors).length === 0
    }

    function submitCompositionForm() {
      if (validateCompositionForm()) {
        compositionSubmitted.value = true
        console.log('提交 Composition API 表单:', compositionForm)
      } else {
        compositionSubmitted.value = false
      }
    }

    return {
      // 1. 基本表单
      basicForm,
      submitBasicForm,
      
      // 2. 表单元素
      formElements,
      
      // 3. 修饰符
      modifiers,
      
      // 4. 表单验证
      validationForm,
      errors,
      validationSuccess,
      validateField,
      submitValidationForm,
      
      // 5. 异步提交
      asyncForm,
      isSubmitting,
      submitResult,
      submitAsyncForm,
      
      // 6. 动态表单
      dynamicForm,
      dynamicFormSubmitted,
      addField,
      removeField,
      submitDynamicForm,
      
      // 7. 表单重置
      resetForm,
      resetFormSubmitted,
      resetFormData,
      submitResetForm,
      
      // 8. Composition API
      compositionForm,
      compositionErrors,
      compositionSubmitted,
      submitCompositionForm
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

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input, textarea, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.checkbox-group, .radio-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.checkbox-group label, .radio-group label {
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 5px;
}

.checkbox-group input, .radio-group input {
  width: auto;
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

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.success {
  color: #28a745;
  font-size: 14px;
  margin-top: 10px;
}

.form-result {
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f5e9;
  border-radius: 3px;
  border-left: 4px solid #42b983;
}

.form-result p {
  margin: 5px 0;
}
</style>
