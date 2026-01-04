<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 编辑器 -->
        <div>
            <label for="homepageContent" class="block text-sm font-medium text-gray-700 mb-2">
                HTML
            </label>
            <textarea v-model="homepage.content" id="homepageContent" rows="15"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm"
                placeholder="输入HTML内容..."></textarea>
            <button @click="updateHomepage"
                class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                :disabled="isSaving">
                <span v-if="isSaving">保存中...</span>
                <span v-else>保存更改</span>
            </button>
            <div v-if="saveMessage" class="mt-2 text-sm"
                :class="saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'">
                {{ saveMessage.text }}
            </div>
        </div>

        <!-- 预览 -->
        <div>
            <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium text-gray-700">实时预览</label>
                <button @click="refreshPreview"
                    class="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    刷新
                </button>
            </div>
            <div class="border border-gray-200 rounded-lg p-4 bg-white overflow-auto">
                <div v-if="isLoading" class="text-center text-gray-500 mt-20">
                    加载中...
                </div>
                <div v-else>
                    <div v-html="homepage.content" class="prose max-w-none"></div>
                    <div v-if="!homepage.content" class="text-gray-400 italic text-center mt-20">
                        输入HTML内容将在此处显示预览
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFixedData, updateFixedData } from '@/utils/fixedDataApi'

// 主页内容数据
const homepage = ref({
    content: ''
})

const isLoading = ref(true)
const isSaving = ref(false)
const saveMessage = ref(null)

// 获取主页内容
const fetchHomepageContent = async () => {
    try {
        isLoading.value = true
        const response = await getFixedData('welcome_message')
        homepage.value.content = response.data?.content || ''
    } catch (error) {
        console.error('获取主页内容失败:', error)
        saveMessage.value = {
            type: 'error',
            text: '获取主页内容失败: ' + error.message
        }
    } finally {
        isLoading.value = false
    }
}

// 更新主页内容
const updateHomepage = async () => {
    try {
        isSaving.value = true
        saveMessage.value = null

        const token = localStorage.getItem('admin_token')
        if (!token) {
            throw new Error('未登录或token无效')
        }

        const response = await updateFixedData(token, 'welcome_message', {
            content: homepage.value.content,
            format: 'html'
        })

        saveMessage.value = {
            type: 'success',
            text: response.msg || '主页内容更新成功'
        }
        setTimeout(() => {
            window.location.reload()
        }, 500)
    } catch (error) {
        console.error('更新主页内容失败:', error)
        saveMessage.value = {
            type: 'error',
            text: '更新失败: ' + error.message
        }
    } finally {
        isSaving.value = false
    }
}

// 刷新预览
const refreshPreview = () => {
    fetchHomepageContent()
}

// 组件挂载时获取初始数据
onMounted(() => {
    fetchHomepageContent()
})
</script>