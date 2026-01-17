<template>
    <div class="flex flex-col min-h-screen h-full bg-white/50 dark:bg-gray-800/60 md:mx-10 xl:mx-40">


        <!-- 添加通知容器 -->
        <Notification v-model:show="notification.show" :type="notification.type" :title="notification.title"
            :message="notification.message" :duration="notification.duration" @close="clearNotification" />

        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <Header></Header>



            <div class="w-full max-w-sm p-6 m-auto mx-auto rounded-lg my-20">
                <div class="flex justify-center mx-auto">
                    <h2 class="text-gray-800 dark:text-gray-100 font-semibold text-xl">用户登陆</h2>
                </div>

                <form class="mt-6" @submit="submitForm">
                    <div class="mb-6">
                        <label for="username"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                            用户名:
                        </label>
                        <div class="relative group">
                            <div
                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-md group-hover:blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
                            </div>
                            <div class="relative">
                                <input id="username" type="text" required v-model="username" class="w-full px-4 py-3 text-gray-800 dark:text-gray-200 
                        bg-white/70 dark:bg-gray-800/60 backdrop-blur-md
                        border border-gray-900/5 dark:border-gray-700/50 
                        rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 
                        transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400
                        shadow-[0_8px_20px_-12px_rgba(0,0,0,0.1)] hover:shadow-lg dark:hover:shadow-gray-700/20
                        group-hover:border-gray-900/10 dark:group-hover:border-gray-600/50" placeholder="username" />
                                <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label for="password"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                            密码:
                        </label>
                        <div class="relative group">
                            <div v-if="!hasSavedCredentials"
                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-md group-hover:blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
                            </div>
                            <div class="relative">
                                <input id="password" type="password" required v-model="password"
                                    :readonly="hasSavedCredentials" :class="[
                                        'w-full px-4 py-3 border rounded-xl backdrop-blur-md transition-all duration-300 placeholder-gray-500 focus:outline-none',
                                        'shadow-[0_8px_20px_-12px_rgba(0,0,0,0.1)]',
                                        hasSavedCredentials
                                            ? 'bg-gray-100/80 dark:bg-gray-700/60 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-700/50 cursor-not-allowed'
                                            : 'text-gray-800 dark:text-gray-200 bg-white/70 dark:bg-gray-800/60 border-gray-900/5 dark:border-gray-700/50 hover:shadow-lg dark:hover:shadow-gray-700/20 group-hover:border-gray-900/10 dark:group-hover:border-gray-600/50 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50'
                                    ]" :placeholder="hasSavedCredentials ? '已保存密码' : 'password'" />
                                <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg v-if="!hasSavedCredentials"
                                        class="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    <svg v-else class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex mt-5 items-center justify-between">
                        <!-- 左侧标签区域 -->
                        <div class="flex-1">
                            <div class="flex items-start cursor-pointer" @click="toggleRememberMe">

                                <div>
                                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200 
                            hover:text-gray-900 dark:hover:text-gray-100
                            transition-colors duration-200">
                                        记住账号密码
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- 右侧拨动开关 -->
                        <div class="flex-shrink-0 ml-4">
                            <div class="relative inline-flex items-center cursor-pointer group"
                                @click="toggleRememberMe" :title="rememberMe ? '已开启记住密码' : '已关闭记住密码'">
                                <!-- 隐藏的checkbox -->
                                <input :checked="rememberMe" type="checkbox" class="sr-only peer"
                                    @change="rememberMe = !rememberMe" @click.stop>

                                <!-- 开关轨道 -->
                                <div class="relative w-16 h-8 rounded-full transition-all duration-500 ease-out
                    shadow-lg dark:shadow-gray-900/50
                    before:absolute before:inset-0 before:rounded-full
                    before:bg-gradient-to-b before:from-white/30 before:to-transparent
                    dark:before:from-black/20
                    after:absolute after:inset-0 after:rounded-full
                    after:bg-gradient-to-t after:from-white/10 after:to-transparent
                    overflow-hidden
                    hover:shadow-xl dark:hover:shadow-gray-900/60
                    hover:scale-105 active:scale-95
                    transition-all duration-300" :class="[
                        rememberMe
                            ? 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 dark:from-blue-600 dark:via-blue-500 dark:to-blue-700 shadow-blue-500/20'
                            : 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-400 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800 shadow-gray-500/10'
                    ]">

                                    <!-- 背景光效 -->
                                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        :class="rememberMe ? 'bg-blue-400/20' : 'bg-gray-400/20'">
                                    </div>

                                    <!-- 开关圆点 -->
                                    <div class="absolute left-1 top-1 w-6 h-6 bg-white rounded-full
                        shadow-2xl transition-all duration-500 ease-out
                        flex items-center justify-center
                        before:absolute before:inset-0 before:rounded-full
                        before:bg-gradient-to-br before:from-white before:to-gray-100
                        after:absolute after:inset-0 after:rounded-full
                        after:bg-gradient-to-tr after:from-white/50 after:to-transparent
                        group-hover:shadow-3xl" :class="[
                            rememberMe
                                ? 'translate-x-8 rotate-[360deg] shadow-blue-500/30'
                                : 'translate-x-0 rotate-0 shadow-gray-500/20'
                        ]">

                                        <!-- 开关状态图标 -->
                                        <svg v-if="rememberMe" class="w-4 h-4 text-blue-600 relative z-10
                            transition-all duration-500 ease-out
                            group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>

                                        <svg v-else class="w-4 h-4 text-gray-500 relative z-10
                            transition-all duration-500 ease-out
                            group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="2.5"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>

                                    <!-- 开关内部文本 -->
                                    <div class="absolute inset-0 flex items-center justify-between px-2">
                                        <span class="text-xs font-bold transition-all duration-500 ease-out
                            drop-shadow-sm relative z-10" :class="[
                                rememberMe
                                    ? 'opacity-100 translate-x-0 text-white/90'
                                    : 'opacity-0 -translate-x-2 text-white/60'
                            ]">
                                            <span class="inline-block animate-pulse mt-[2px]">ON</span>
                                        </span>
                                        <span class="text-xs font-bold transition-all duration-500 ease-out
                            drop-shadow-sm relative z-10" :class="[
                                rememberMe
                                    ? 'opacity-0 translate-x-2 text-white/60'
                                    : 'opacity-100 translate-x-0 text-white/90'
                            ]">
                                            <span class="inline-block mt-[2px]">OFF</span>
                                        </span>
                                    </div>

                                    <!-- 粒子动画效果（开启时） -->
                                    <div v-if="rememberMe" class="absolute inset-0 overflow-hidden rounded-full">
                                        <div class="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
                                            style="animation-delay: 0.1s; top: 30%; left: 20%;"></div>
                                        <div class="absolute w-0.5 h-0.5 bg-white/30 rounded-full animate-ping"
                                            style="animation-delay: 0.3s; top: 60%; left: 15%;"></div>
                                    </div>

                                    <!-- 光泽效果 -->
                                    <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent 
                        rounded-t-full pointer-events-none">
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div class="mt-3">

                        <button type="submit" :disabled="cooldown || loading" class="group relative w-full flex justify-center py-3.5 px-4 border rounded-xl shadow-sm text-sm font-medium transition-all duration-300 overflow-hidden
           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_8px_20px_-12px_rgba(0,0,0,0.1)]"
                            :class="[
                                cooldown || loading
                                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                                    : hasSavedCredentials
                                        ? 'text-white bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-500/20 dark:border-emerald-400/20 hover:from-emerald-600 hover:to-green-600 dark:hover:from-emerald-400 dark:hover:to-green-400'
                                        : 'text-white bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500/20 dark:border-blue-400/20 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700'
                            ]">

                            <!-- 背景光效 - 普通登录 -->
                            <div v-if="!(cooldown || loading) && !hasSavedCredentials"
                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-full group-hover:translate-x-full dark:from-blue-300/20">
                            </div>

                            <!-- 背景光效 - 已保存账户 -->
                            <div v-if="!(cooldown || loading) && hasSavedCredentials"
                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-full group-hover:translate-x-full dark:from-emerald-300/20">
                            </div>

                            <!-- 玻璃拟态效果 -->
                            <div class="absolute inset-0 rounded-xl backdrop-blur-md bg-white/5 dark:bg-black/5"></div>

                            <!-- 阴影效果 - 普通登录 -->
                            <div v-if="!(cooldown || loading) && !hasSavedCredentials" class="absolute inset-0 rounded-xl shadow-[0_8px_20px_-12px_rgba(59,130,246,0.3)] 
                group-hover:shadow-[0_12px_25px_-8px_rgba(59,130,246,0.5)]
                dark:shadow-[0_8px_20px_-12px_rgba(96,165,250,0.3)]
                dark:group-hover:shadow-[0_12px_25px_-8px_rgba(96,165,250,0.4)]
                transition-all duration-300"></div>

                            <!-- 阴影效果 - 已保存账户 -->
                            <div v-if="!(cooldown || loading) && hasSavedCredentials" class="absolute inset-0 rounded-xl shadow-[0_8px_20px_-12px_rgba(5,150,105,0.3)] 
                group-hover:shadow-[0_12px_25px_-8px_rgba(5,150,105,0.5)]
                dark:shadow-[0_8px_20px_-12px_rgba(52,211,153,0.3)]
                dark:group-hover:shadow-[0_12px_25px_-8px_rgba(52,211,153,0.4)]
                transition-all duration-300"></div>

                            <!-- 内容容器 -->
                            <div class="relative flex items-center justify-center">
                                <!-- 加载状态 -->
                                <span v-if="loading" class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none"
                                        viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    登录中...
                                </span>

                                <!-- 已保存账户状态 -->
                                <span v-else-if="hasSavedCredentials" class="flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    使用保存的账户密码
                                </span>

                                <!-- 正常登录状态 -->
                                <span v-else>
                                    登录
                                </span>
                            </div>
                        </button>

                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminService from '../../utils/api/user/userApi'
import { useRuntimeConfig } from '#app'
// 导入 RSA 加密工具
import { encryptWithRSA, isEncryptionEnabled } from '../../utils/api/rsa'

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
const cooldown = ref(false)
const cooldownTime = ref(0)

// 控制 UI 状态
const hasSavedCredentials = ref(false) // 是否有保存的凭据
const usingSavedCredentials = ref(false) // 当前是否使用保存的凭据（用于按钮文案）

const remainingMinutes = computed(() => Math.ceil(cooldownTime.value / 60))

// 工具函数：保存/读取/清除凭据

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
        password.value = '••••••••' // 显示占位符，实际值由 savedPass 提供
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

    // 先加载保存的凭据（如果有）
    loadSavedCredentials()

    // 再检查登录状态
    try {
        const status = await adminService.checkLoginStatus()
        if (status.isLoggedIn) {
            router.push('/user/dashboard')
        }
    } catch (error) {
        console.warn('检查登录状态时出错，继续显示登录页:', error.message)
    }
})


// 监听 rememberMe 变化：关闭时清除保存
watch(rememberMe, (newVal) => {
    if (!newVal && hasSavedCredentials.value) {
        // 用户手动关闭“记住我”，清除保存
        clearSavedCredentials()
    }
})


// 登录逻辑
const handleLogin = async () => {
    // 如果使用保存的凭据，直接用 savedEncryptedPassword
    let finalUsername = username.value.trim()
    let finalPassword = password.value

    if (usingSavedCredentials.value) {
        // 从 localStorage 获取真实加密密码
        const savedPass = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_PASSWORD)
        if (!savedPass) {
            showNotification('保存的密码已丢失，请重新登录')
            clearSavedCredentials()
            return
        }
        finalPassword = savedPass
    } else {
        // 手动输入，需要加密（如果启用）
        if (!finalUsername || !finalPassword) {
            showNotification('请输入用户名和密码')
            return
        }

        if (isEncryptionEnabled()) {
            try {
                const publicKey = await adminService.getPublicKey()
                finalPassword = await encryptWithRSA(finalPassword, publicKey)
                console.log('密码加密成功，密文长度:', finalPassword.length)
            } catch (encryptError) {
                loading.value = false
                console.error('密码加密失败:', encryptError)
                showNotification(encryptError)
                return
            }
        }
    }

    // 执行登录
    try {
        loading.value = true
        await adminService.login(finalUsername, finalPassword)

        // 登录成功
        showNotification('登录成功！', 'success')

        // 根据 rememberMe 决定是否保存
        if (rememberMe.value) {
            // 保存加密后的密码（finalPassword 已是密文或明文）
            saveCredentials(finalUsername, finalPassword)
        } else {
            // 即使之前有，现在也不记住 → 清除
            clearSavedCredentials()
        }

        router.push('/user/dashboard')
    } catch (error) {
        loading.value = false

        //登录失败：无论是否勾选，都清除保存的凭据
        clearSavedCredentials()

        let message = '网络异常，请检查连接'
        let isCooldown = false

        if (error.response) {
            const { status, data } = error.response
            if (status === 429) {
                message = '登录尝试次数过多，请稍后再试'
                isCooldown = true
            } else {
                message = data?.message
            }
        } else if (error.request) {
            message = '服务器无响应，请稍后再试'
        }
        showNotification(message)
    }
}


// 记住密码切换
const toggleRememberMe = () => {
    rememberMe.value = !rememberMe.value
}


// 表单提交
const submitForm = (e) => {
    e.preventDefault()
    handleLogin()
}


// 响应式通知状态
const notification = reactive({
    show: false,
    type: '',     // 可选值如 'success', 'error', 'warning', 'info' 等
    title: '',
    message: '',
    duration: 3000     // 默认显示3秒
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
