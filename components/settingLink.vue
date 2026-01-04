<template>
    <!-- 信息表格 -->
    <div class="mt-6">
        <div class="p-4 rounded-xl">

            <div v-if="loading" class="space-y-4">
                <div v-for="i in 4" :key="i" class="pb-2 border-b border-gray-200/50">
                    <div class="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-4 w-3/4 bg-gray-100 rounded animate-pulse mt-2"></div>
                </div>
            </div>

            <div v-else-if="error" class="text-red-500 text-sm p-4 bg-red-50 rounded">
                {{ error }}
            </div>

            <div v-else class="grid grid-cols-1 gap-3">
                <!-- 名称编辑 -->
                <div class="pb-2 border-b border-gray-200/50">
                    <div class="flex justify-between items-center">
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">友链名称</div>
                        <button @click="toggleEdit('name')" class="text-xs text-blue-500 hover:text-blue-700">
                            {{ editingField === 'name' ? '取消' : '编辑' }}
                        </button>
                    </div>

                    <div v-if="editingField !== 'name'" class="text-sm font-medium text-gray-800 mt-1">
                        {{ siteData.name || '暂无数据' }}
                    </div>

                    <div v-else class="mt-2">
                        <input v-model="editData.name" type="text"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <div class="flex justify-end space-x-2 mt-2">
                            <button @click="cancelEdit"
                                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                取消
                            </button>
                            <button @click="saveField('name')"
                                class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                :disabled="isSaving">
                                <span v-if="isSaving">保存中...</span>
                                <span v-else>保存</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 网址编辑 -->
                <div class="pb-2 border-b border-gray-200/50">
                    <div class="flex justify-between items-center">
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">友链网址</div>
                        <button @click="toggleEdit('url')" class="text-xs text-blue-500 hover:text-blue-700">
                            {{ editingField === 'url' ? '取消' : '编辑' }}
                        </button>
                    </div>

                    <div v-if="editingField !== 'url'">
                        <a v-if="siteData.url" :href="siteData.url" target="_blank"
                            class="text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200 inline-block mt-1">
                            {{ siteData.url }}
                        </a>
                        <div v-else class="text-sm text-gray-700 mt-1">暂无数据</div>
                    </div>

                    <div v-else class="mt-2">
                        <input v-model="editData.url" type="text"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <div class="flex justify-end space-x-2 mt-2">
                            <button @click="cancelEdit"
                                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                取消
                            </button>
                            <button @click="saveField('url')"
                                class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                :disabled="isSaving">
                                <span v-if="isSaving">保存中...</span>
                                <span v-else>保存</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 简介编辑 -->
                <div class="pb-2 border-b border-gray-200/50">
                    <div class="flex justify-between items-center">
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">友链简介</div>
                        <button @click="toggleEdit('description')" class="text-xs text-blue-500 hover:text-blue-700">
                            {{ editingField === 'description' ? '取消' : '编辑' }}
                        </button>
                    </div>

                    <div v-if="editingField !== 'description'" class="text-sm text-gray-700 mt-1">
                        {{ siteData.description || '暂无数据' }}
                    </div>

                    <div v-else class="mt-2">
                        <textarea v-model="editData.description" rows="3"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        <div class="flex justify-end space-x-2 mt-2">
                            <button @click="cancelEdit"
                                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                取消
                            </button>
                            <button @click="saveField('description')"
                                class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                :disabled="isSaving">
                                <span v-if="isSaving">保存中...</span>
                                <span v-else>保存</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 头像编辑 -->
                <div>
                    <div class="flex justify-between items-center">
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">友链头像</div>
                        <button @click="toggleEdit('avatar')" class="text-xs text-blue-500 hover:text-blue-700">
                            {{ editingField === 'avatar' ? '取消' : '编辑' }}
                        </button>
                    </div>

                    <div v-if="editingField !== 'avatar'">
                        <a v-if="siteData.avatar" :href="siteData.avatar" target="_blank"
                            class="text-sm text-blue-500 hover:text-blue-600">
                            {{ siteData.avatar }}
                        </a>
                        <div v-else class="text-sm text-gray-700 mt-1">暂无数据</div>
                    </div>

                    <div v-else class="mt-2">
                        <input v-model="editData.avatar" type="text"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <div class="flex justify-end space-x-2 mt-2">
                            <button @click="cancelEdit"
                                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                取消
                            </button>
                            <button @click="saveField('avatar')"
                                class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                :disabled="isSaving">
                                <span v-if="isSaving">保存中...</span>
                                <span v-else>保存</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFixedData, updateFixedData } from '../utils/fixedDataApi'

const loading = ref(true)
const error = ref(null)
const isSaving = ref(false)
const editingField = ref(null) // 当前正在编辑的字段
const siteData = ref({
    name: '',
    url: '',
    description: '',
    avatar: ''
})
const editData = ref({
    name: '',
    url: '',
    description: '',
    avatar: ''
})

// 获取站点信息
const fetchSiteInfo = async () => {
    try {
        loading.value = true
        const response = await getFixedData('link_message')

        if (response.code === 200 && response.data) {
            const content = JSON.parse(response.data.content)
            siteData.value = {
                name: content.name || '',
                url: content.url || '',
                description: content.description || '',
                avatar: content.avatar || ''
            }
            // 初始化编辑数据
            editData.value = { ...siteData.value }
        }
    } catch (err) {
        console.error('获取站点信息失败:', err)
        error.value = err.message || '获取站点信息失败，请稍后重试'
    } finally {
        loading.value = false
    }
}

// 切换编辑状态
const toggleEdit = (field) => {
    if (editingField.value === field) {
        editingField.value = null
    } else {
        editingField.value = field
        // 重置编辑数据为当前值
        editData.value[field] = siteData.value[field]
    }
}

// 取消编辑
const cancelEdit = () => {
    editingField.value = null
}

// 保存字段
const saveField = async (field) => {
    try {
        isSaving.value = true
        const token = localStorage.getItem('admin_token')

        if (!token) {
            throw new Error('未登录，请先登录')
        }

        // 更新本地数据
        siteData.value[field] = editData.value[field]

        // 构建更新数据
        const updatedContent = {
            ...siteData.value
        }

        const response = await updateFixedData(token, 'link_message', {
            content: JSON.stringify(updatedContent),
            format: 'json'
        })

        if (response.code === 200) {
            editingField.value = null
        }
    } catch (err) {
        console.error('保存失败:', err)
        error.value = err.message || '保存失败，请稍后重试'
        // 恢复原数据
        editData.value[field] = siteData.value[field]
    } finally {
        isSaving.value = false
    }
}

onMounted(() => {
    fetchSiteInfo()
})
</script>