<template>
   <section class="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div class="container mx-auto px-6 py-8">
            <!-- 通知组件 -->
            <Notification v-model:show="notification.show" :type="notification.type" :title="notification.title"
                :message="notification.message" :duration="notification.duration" @close="clearNotification" />

          <div class="w-full max-w-md mx-auto">
                <!-- Logo/标题区域 -->
                <div class="flex justify-center mx-auto mb-8">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">系统登录</h1>
                    </div>
                </div>

              <!-- 登录/注册切换 -->
                <div class="flex items-center justify-center mb-8">
                    <div class="w-full flex border-b dark:border-gray-700">
                        <button
                           class="w-1/2 pb-4 font-medium text-center text-blue-600 capitalize border-b-2 border-blue-500 dark:border-blue-400 dark:text-white transition-colors duration-300">
                            用户登录
                        </button>
                       <button
                            class="w-1/2 pb-4 font-medium text-center text-gray-500 capitalize dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300">
                            注册账号
                        </button>
                   </div>
                </div>

              <!-- 登录表单 -->
               <form class="mt-16 space-y-8" @submit="submitForm">
                    <!-- 用户名输入框 -->
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                       <input id="username" type="text" required v-model="username"
                            class="block w-full pl-10 pr-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                            placeholder="请输入用户名"
                            :class="{ 'cursor-not-allowed bg-gray-100 dark:bg-gray-700': hasSavedCredentials }"
                            :readonly="hasSavedCredentials" />
                   </div>
                    <!-- 密码输入框 -->
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                       </div>
                        <input id="password" :type="passwordType" required v-model="password"
                            class="block w-full pl-10 pr-12 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                            :placeholder="hasSavedCredentials ? '已保存密码' : '请输入密码'"
                            :class="{ 'cursor-not-allowed bg-gray-100 dark:bg-gray-700': hasSavedCredentials }"
                            :readonly="hasSavedCredentials" />
                        <!-- 密码显示切换按钮 -->
                        <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center"
                            @click="togglePasswordVisibility" v-if="!hasSavedCredentials">
                            <svg class="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    :d="passwordType === 'password' ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' : 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'" />
                            </svg>
                        </button>
                   </div>
                    <!-- 记住密码选项 -->
                    <div class="flex items-center justify-between mt-4">
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" v-model="rememberMe"
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">记住密码</span>
                        </label>

                        <a href="#"
                            class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300">
                            忘记密码？
                        </a>
                   </div>

                  <!-- 登录按钮 -->
                   <button type="submit" :disabled="loading"
                        class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        :class="{
                            'bg-green-600 hover:bg-green-500 focus:ring-green-300': hasSavedCredentials
                        }">
                        <svg v-if="loading" class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <svg v-else-if="hasSavedCredentials" class="w-4 h-4" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{{ getButtonText() }}</span>
                    </button>

                    <!-- 注册提示 -->
                    <div class="mt-6 text-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            还没有账号？
                            <a href="#"
                                class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300">
                                立即注册
                            </a>
                        </span>
                   </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AdminService from '../utils/api/user/auth/authApi'
import { useRuntimeConfig } from '#app'
// 导入 RSA 加密工具
import { encryptWithRSA, isEncryptionEnabled } from '../utils/api/rsa'

// 初始化
const runtimeConfig = useRuntimeConfig()
const API_BASE_URL = runtimeConfig.public.apiBaseUrl
const adminService = new AdminService(API_BASE_URL)
const router = useRouter()

// 表单数据
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const passwordType = ref('password')

// 控制 UI 状态
const hasSavedCredentials = ref(false)
const usingSavedCredentials = ref(false)

// 密码显示切换
const togglePasswordVisibility = () => {
    passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

// 按钮文字
const getButtonText = () => {
    if (loading.value) return '登录中...'
    if (hasSavedCredentials.value) return '使用保存的账户登录'
    return '立即登录'
}

const STORAGE_KEYS = {
    USERNAME: 'savedUsername',
    ENCRYPTED_PASSWORD: 'savedEncryptedPassword'
}

const saveCredentials = (user, encryptedPass) => {
    localStorage.setItem(STORAGE_KEYS.USERNAME, user)
    localStorage.setItem(STORAGE_KEYS.ENCRYPTED_PASSWORD, encryptedPass)
}

const loadSavedCredentials = () => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USERNAME)
    const savedPass = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_PASSWORD)

    if (savedUser && savedPass) {
        username.value = savedUser
        password.value = '••••••••'
        hasSavedCredentials.value = true
        rememberMe.value = true
        usingSavedCredentials.value = true
    } else {
        hasSavedCredentials.value = false
        usingSavedCredentials.value = false
    }
}

const clearSavedCredentials = () => {
    localStorage.removeItem(STORAGE_KEYS.USERNAME)
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_PASSWORD)
    hasSavedCredentials.value = false
    usingSavedCredentials.value = false
}

// 页面加载：检查已保存凭据
onMounted(async () => {
    if (import.meta.server) return
    loadSavedCredentials()
})

// 监听 rememberMe 变化
watch(rememberMe, (newVal) => {
    if (!newVal && hasSavedCredentials.value) {
        clearSavedCredentials()
    }
})

// 登录逻辑
const handleLogin = async () => {
    let finalUsername = username.value.trim()
    let finalPassword = password.value
    let tempToken = null

    if (usingSavedCredentials.value) {
        const savedPass = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_PASSWORD)
        if (!savedPass) {
            showNotification('保存的密码已丢失，请重新登录')
            clearSavedCredentials()
            return
        }
        finalPassword = savedPass

        if (isEncryptionEnabled()) {
            try {
                const { publicKey, tempToken: token } = await adminService.getPublicKey()
                tempToken = token
                console.log('获取临时令牌:', tempToken ? '成功' : '无令牌')
            } catch (encryptError) {
                console.warn('获取临时令牌失败，但尝试使用保存的密码继续:', encryptError.message)
            }
        }
    } else {
        if (!finalUsername || !finalPassword) {
            showNotification('请输入用户名和密码')
            return
        }

        if (isEncryptionEnabled()) {
            try {
                const { publicKey, tempToken: token } = await adminService.getPublicKey()
                tempToken = token
                console.log('获取临时令牌:', tempToken ? '成功' : '无令牌')
                finalPassword = await encryptWithRSA(finalPassword, publicKey)
                console.log('密码加密成功，密文长度:', finalPassword.length)
            } catch (encryptError) {
                loading.value = false
                console.error('密码加密失败:', encryptError)
                showNotification(encryptError.message)
                return
            }
        }
    }

    try {
        loading.value = true

        // 修复：调用实际的登录接口
        if (tempToken) {
            console.log('使用临时令牌进行登录')
            await adminService.login(finalUsername, finalPassword, tempToken)
        } else {
            console.log('不使用临时令牌进行登录')
            await adminService.login(finalUsername, finalPassword)
        }

        showNotification('登录成功！', 'success')

        if (rememberMe.value) {
            saveCredentials(finalUsername, finalPassword)
        } else {
            clearSavedCredentials()
        }


        router.push('/dashboard')
    } catch (error) {
        loading.value = false
        clearSavedCredentials()

        // 修复：改进错误处理逻辑
        let message = '网络异常，请检查连接'

        if (error.response) {
            const { status, data } = error.response
            console.error('登录错误详情:', { status, data })

            if (status === 429 || data?.code === 429) {
                message = data?.msg
            } else if (data?.code === 401) {
                message = data?.msg
            } else if (data?.code === 400) {
                message = data?.msg
            } else if (data?.msg) {
                message = data.msg
            } else {
                message = data?.message
            }
        } else if (error.request) {
            message = '服务器无响应，请稍后再试'
        } else {
            message = error.message
        }

        showNotification(message)
    }
}

// 表单提交
const submitForm = (e) => {
    e.preventDefault()
    handleLogin()
}

// 响应式通知状态
const notification = reactive({
    show: false,
    type: '',
    title: '',
    message: '',
    duration: 3000
})

// 显示通知的方法
const showNotification = (message, type = 'error') => {
    notification.type = type
    notification.title = type === 'error' ? '错误' : '成功'
    notification.message = message
    notification.show = true
}

// 清除通知
const clearNotification = () => {
    notification.show = false
    notification.message = ''
    notification.title = ''
}
</script>