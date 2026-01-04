<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
            <label for="api_url" class="block text-sm font-medium text-gray-700 mb-1">API URL</label>
            <input id="api_url" v-model="formData.api_url" type="url" placeholder="https://example.com/api/v1" required
                class="block py-1.5 text-gray-700 bg-white border border-gray-200 rounded-lg w-full md:w-1/2 md:max-w-96 placeholder-gray-400/70 pl-3 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>

        <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input id="email" v-model="formData.email" type="email" placeholder="your@email.com" required
                class="block py-1.5 text-gray-700 bg-white border border-gray-200 rounded-lg w-full md:w-1/2 md:max-w-96 placeholder-gray-400/70 pl-3 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>

        <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input id="password" v-model="formData.password" type="password" placeholder="********" required
                class="block py-1.5 text-gray-700 bg-white border border-gray-200 rounded-lg w-full md:w-1/2 md:max-w-96 placeholder-gray-400/70 pl-3 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>

        <button type="submit" :disabled="loading"
            class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed">
            <span v-if="loading">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                保存中...
            </span>
            <span v-else>保存配置</span>
        </button>

        <div v-if="message.text"
            :class="['p-3 rounded-md text-sm', message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
            {{ message.text }}
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const formData = ref({
    api_url: '',
    email: '',
    password: ''
})

const loading = ref(false)
const message = ref({
    text: '',
    type: '' // 'success' or 'error'
})

// 加载当前配置
const loadCurrentConfig = async () => {
    try {
        await initLskyConfig()
        formData.value = {
            api_url: LSKY_CONFIG.baseUrl,
            email: LSKY_CONFIG.email,
            password: LSKY_CONFIG.password
        }
    } catch (error) {
        message.value = {
            text: '加载当前配置失败: ' + error.message,
            type: 'error'
        }
    }
}

// 提交表单
const handleSubmit = async () => {
    loading.value = true
    message.value = { text: '', type: '' }

    try {
        const configData = {
            content: JSON.stringify({
                api_url: formData.value.api_url,
                email: formData.value.email,
                password: formData.value.password
            }),
            format: 'json'
        }
        const token = localStorage.getItem('admin_token')
        const result = await updateFixedData(token, 'lsky_account', configData)

        message.value = {
            text: result.msg || '配置更新成功',
            type: 'success'
        }

        // 重新初始化配置
        await initLskyConfig()
    } catch (error) {
        message.value = {
            text: '更新配置失败: ' + (error.message || '未知错误'),
            type: 'error'
        }
        console.error('更新配置错误:', error)
    } finally {
        loading.value = false
    }
}

// 组件挂载时加载当前配置
onMounted(() => {
    loadCurrentConfig()
})
</script>