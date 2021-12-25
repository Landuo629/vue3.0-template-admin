<template>
  <div class="form-container">
    <el-form ref="loginFormRef" :model="loginForm" status-icon :hide-required-asterisk="true" :rules="rules" label-width="100px" class="login-form">
      <el-form-item label="账号" prop="email">
        <el-input v-model="loginForm.email" autocomplete="off" placeholder="请输入登录邮箱(super@outlook.com)"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" autocomplete="off" placeholder="请输入密码(123456)"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="btn-container">
          <el-button :loading="loading" type="primary" style="width: 100%" @click="submitForm()">登录</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template> 

<script lang="ts">
import { defineComponent, ref, toRefs, reactive } from 'vue'
// defineComponent 在 TypeScript 下，给予了组件 正确的参数类型推断
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus/lib/components/message'
import { encrypt } from '@/utils/aes' // aes 密码加密
import { useStore } from '@/store'
import Service from './api/index'

export default defineComponent({
  name: 'LoginForm',
  setup(_props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const loginFormRef = ref()
    const store = useStore()
    const state = reactive({
      loading: false,
      loginForm: {
        email: '',
        password: ''
      },
    })

    // 校验
    const rules = {
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ],
      email: [
        { required: true, message: '请输入注册邮箱', trigger: 'change' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ],
    }


    /** 用户登录接口
     * @description  用户登录接口
     *
     */
    const submitForm = () => {
      loginFormRef.value.validate(async (valid: any) => {
        if (valid) {
          try {
            const { email, password } = state.loginForm
            state.loading = true
            const res = await Service.postLogin({
              email,
              // password
              password: encrypt(password)
            })
            const userInfo = await Service.postAuthUserInfo({ email })

            const accessToken = res?.data?.accessToken ?? null
            
            if (accessToken) {
              // 将角色存储到全局vuex roles
              if (userInfo.status === 0) {
                store.dispatch('permissionModule/getPermissonRoles', userInfo.data)
              }
              // 先进行异步路由处理
              store.dispatch('permissionModule/getPermissonRoutes', userInfo.data)
              store.dispatch('permissionModule/getPermissions')
              sessionStorage.setItem('auth', 'true')
              sessionStorage.setItem('accessToken', accessToken)
              if (route.query.redirect) {
                const path = route.query.redirect
                router.push({ path: path as string })
              } else {
                router.push('/')
              }
            } else {
              ElMessage.warning('账号或者密码有误')
            }
            state.loading = true
          } catch (err : any) {
            ElMessage.warning(err.message)
          }
        }
        return false
      })
    }


    return {
      ...toRefs(state),
      loginFormRef,
      rules,
      submitForm,
    }
  }
})
</script>
<style lang="scss">
.login-form {
  width: 50%;
  height: 200px;
  margin: auto;  
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
