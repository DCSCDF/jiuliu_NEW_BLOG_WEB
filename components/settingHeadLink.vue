<template>
    <div class="space-y-4">

        <!-- 链接表格 -->
        <div class="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">序号
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">链接名称
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">链接地址
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(link, index) in linksData" :key="index">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <input v-model="link.name" type="text"
                                class="block w-full py-1.5 text-gray-700 bg-white border border-gray-200 rounded-md placeholder-gray-400/70 pl-3 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <input v-model="link.path" type="url"
                                class="block w-full py-1.5 text-gray-700 bg-white border border-gray-200 rounded-md placeholder-gray-400/70 pl-3 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button @click="removeLink(index)" class="text-red-600 hover:text-red-900 mr-4">删除</button>
                            <button @click="moveUp(index)" :disabled="index === 0"
                                class="text-gray-600 hover:text-gray-900 mr-4 disabled:opacity-50">上移</button>
                            <button @click="moveDown(index)" :disabled="index === linksData.length - 1"
                                class="text-gray-600 hover:text-gray-900 disabled:opacity-50">下移</button>
                        </td>
                    </tr>
                    <tr v-if="linksData.length === 0">
                        <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">暂无链接数据</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Naive UI 模态框 -->
        <n-modal style="max-width: 400px;" v-model:show="showAddModal" preset="card" title="添加新链接" size="medium"
            :bordered="false">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">链接名称</label>
                    <n-input v-model:value="newLink.name" placeholder="例如：开往" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">链接地址</label>
                    <n-input v-model:value="newLink.path" placeholder="https://example.com" />
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end gap-3">
                    <n-button :theme-overrides="themeOverrides" @click="showAddModal = false">取消</n-button>
                    <n-button :theme-overrides="themeOverrides" type="primary" @click="confirmAddLink">确认添加</n-button>
                </div>
            </template>
        </n-modal>

        <!-- 操作按钮和消息提示 -->
        <div class="flex gap-3">
            <!-- <button @click="resetForm" :disabled="isSubmitting"
                class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all disabled:bg-gray-200 disabled:cursor-not-allowed">
                重置
            </button> -->
            <button @click="updateLinks" :disabled="isSubmitting || linksData.length === 0"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                {{ isSubmitting ? '保存中...' : '保存设置' }}
            </button>
            <button @click="showAddModal = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                添加链接
            </button>
        </div>

        <div v-if="message" class="p-3 rounded-lg"
            :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ message }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { NModal, NInput, NButton } from 'naive-ui'
import { getFixedData, updateFixedData } from '../utils/fixedDataApi'
import themeOverrides from "../themeOverrides";

const token = localStorage.getItem('admin_token')
const showAddModal = ref(false)

const linksData = ref([])
const newLink = ref({ name: '', path: '' })
const isSubmitting = ref(false)
const message = ref('')
const messageType = ref('')

// 加载现有链接
onMounted(async () => {
    try {
        // 使用新的getFixedData API
        const response = await getFixedData('custom_links')
        linksData.value = response.data?.content ? JSON.parse(response.data.content) : []
    } catch (error) {
        console.error('加载链接配置失败:', error)
        showMessage('加载链接配置失败: ' + error.message, 'error')
    }
})

// 添加新链接
const confirmAddLink = () => {
    if (!newLink.value.name.trim() || !newLink.value.path.trim()) {
        showMessage('请填写完整的链接名称和URL', 'error')
        return
    }

    if (!isValidUrl(newLink.value.path)) {
        showMessage('请输入有效的URL (需包含http://或https://)', 'error')
        return
    }

    linksData.value.push({ ...newLink.value })
    newLink.value = { name: '', path: '' }
    showAddModal.value = false
}

// 删除链接
const removeLink = (index) => {
    linksData.value.splice(index, 1)
}

// 移动链接位置
const moveUp = (index) => {
    if (index > 0) {
        [linksData.value[index], linksData.value[index - 1]] = [linksData.value[index - 1], linksData.value[index]]
    }
}

const moveDown = (index) => {
    if (index < linksData.value.length - 1) {
        [linksData.value[index], linksData.value[index + 1]] = [linksData.value[index + 1], linksData.value[index]]
    }
}

// 更新链接配置
const updateLinks = async () => {
    if (!token) {
        showMessage('请先登录', 'error')
        return
    }

    isSubmitting.value = true
    message.value = ''

    try {
        // 使用新的updateFixedData API
        await updateFixedData(token, 'custom_links', {
            content: JSON.stringify(linksData.value)
        })

        showMessage('链接设置更新成功', 'success')
    } catch (error) {
        console.error('更新链接失败:', error)
        showMessage('更新链接失败: ' + error.message, 'error')
    } finally {
        isSubmitting.value = false
    }
}

// 显示消息
const showMessage = (msg, type) => {
    message.value = msg
    messageType.value = type
}

// 简单URL验证
const isValidUrl = (url) => {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}
</script>

<style scoped>
tbody tr:hover {
    background-color: rgba(59, 130, 246, 0.05);
}

td input {
    min-width: 150px;
}
</style>