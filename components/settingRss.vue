<template>
    <!-- RSS 信息编辑表格 -->
    <div class="mt-6">
        <div class="p-4 rounded-xl">
            <div v-if="loading" class="space-y-4">
                <div v-for="i in 6" :key="i" class="pb-2 border-b border-gray-200/50">
                    <div class="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-4 w-3/4 bg-gray-100 rounded animate-pulse mt-2"></div>
                </div>
            </div>

            <div v-else-if="error" class="text-red-500 text-sm p-4 bg-red-50 rounded">
                {{ error }}
            </div>

            <div v-else class="grid grid-cols-1 gap-3">
                <!-- 标题编辑 -->
                <div class="pb-2 border-b border-gray-200/50">
                    <div class="flex justify-between items-center">
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">RSS 标题</div>
                        <button @click="toggleEdit('title')" class="text-xs text-blue-500 hover:text-blue-700">
                            {{ editingField === 'title' ? '取消' : '编辑' }}
                        </button>
                    </div>

                    <div v-if="editingField !== 'title'" class="text-sm font-medium text-gray-800 mt-1">
                        {{ rssData.title || '暂无数据' }}
                    </div>

                    <div v-else class="mt-2">
                        <input v-model="editData.title" type="text"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <div class="flex justify-end space-x-2 mt-2">
                            <button @click="cancelEdit"
                                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                取消
                            </button>
                            <button @click="saveField('title')"
                                class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                :disabled="isSaving">
                                <span v-if="isSaving">保存中...</span>
                                <span v-else>保存</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 描述编辑 -->
                <div class="pb-2 border-b border-gray-200/50">
                    <div class="flex justify-between items-center">
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">RSS 描述</div>
                        <button @click="toggleEdit('description')" class="text-xs text-blue-500 hover:text-blue-700">
                            {{ editingField === 'description' ? '取消' : '编辑' }}
                        </button>
                    </div>

                    <div v-if="editingField !== 'description'" class="text-sm text-gray-700 mt-1">
                        {{ rssData.description || '暂无数据' }}
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

                <!-- 站点链接编辑 -->
                <div class="pb-2 border-b border-gray-200/50">
                    <div class="flex justify-between items-center">
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">站点链接</div>
                        <button @click="toggleEdit('link')" class="text-xs text-blue-500 hover:text-blue-700">
                            {{ editingField === 'link' ? '取消' : '编辑' }}
                        </button>
                    </div>

                    <div v-if="editingField !== 'link'">
                        <a v-if="rssData.link" :href="rssData.link" target="_blank"
                            class="text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200 inline-block mt-1">
                            {{ rssData.link }}
                        </a>
                        <div v-else class="text-sm text-gray-700 mt-1">暂无数据</div>
                    </div>

                    <div v-else class="mt-2">
                        <input v-model="editData.link" type="text"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <div class="flex justify-end space-x-2 mt-2">
                            <button @click="cancelEdit"
                                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                取消
                            </button>
                            <button @click="saveField('link')"
                                class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                :disabled="isSaving">
                                <span v-if="isSaving">保存中...</span>
                                <span v-else>保存</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 语言编辑 -->
                <div class="pb-2 border-b border-gray-200/50">
                    <div class="flex justify-between items-center">
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">语言</div>
                        <button @click="toggleEdit('language')" class="text-xs text-blue-500 hover:text-blue-700">
                            {{ editingField === 'language' ? '取消' : '编辑' }}
                        </button>
                    </div>

                    <div v-if="editingField !== 'language'" class="text-sm text-gray-700 mt-1">
                        {{ rssData.language || '暂无数据' }}
                    </div>

                    <div v-else class="mt-2">
                        <select v-model="editData.language"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="zh-CN">中文 (简体)</option>
                            <option value="en-US">English</option>
                            <option value="ja-JP">日本語</option>
                            <option value="ko-KR">한국어</option>
                        </select>
                        <div class="flex justify-end space-x-2 mt-2">
                            <button @click="cancelEdit"
                                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                取消
                            </button>
                            <button @click="saveField('language')"
                                class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                :disabled="isSaving">
                                <span v-if="isSaving">保存中...</span>
                                <span v-else>保存</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 图片编辑 -->
                <div class="pb-2 border-b border-gray-200/50">
                    <div class="flex justify-between items-center">
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">RSS 图片</div>
                        <button @click="toggleEdit('image')" class="text-xs text-blue-500 hover:text-blue-700">
                            {{ editingField === 'image' ? '取消' : '编辑' }}
                        </button>
                    </div>

                    <div v-if="editingField !== 'image'">
                        <div v-if="rssData.image" class="mt-2 flex items-center space-x-3">
                            <img :src="rssData.image" alt="RSS 图片" class="w-12 h-12 rounded-md object-cover">
                            <a :href="rssData.image" target="_blank" class="text-sm text-blue-500 hover:text-blue-600">
                                {{ rssData.image }}
                            </a>
                        </div>
                        <div v-else class="text-sm text-gray-700 mt-1">暂无数据</div>
                    </div>

                    <div v-else class="mt-2">
                        <input v-model="editData.image" type="text"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <div class="flex justify-end space-x-2 mt-2">
                            <button @click="cancelEdit"
                                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                取消
                            </button>
                            <button @click="saveField('image')"
                                class="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                :disabled="isSaving">
                                <span v-if="isSaving">保存中...</span>
                                <span v-else>保存</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Favicon 编辑 -->
                <div>
                    <div class="flex justify-between items-center">
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Favicon</div>
                        <button @click="toggleEdit('favicon')" class="text-xs text-blue-500 hover:text-blue-700">
                            {{ editingField === 'favicon' ? '取消' : '编辑' }}
                        </button>
                    </div>

                    <div v-if="editingField !== 'favicon'">
                        <div v-if="rssData.favicon" class="mt-2 flex items-center space-x-3">
                            <img :src="rssData.favicon" alt="Favicon" class="w-6 h-6 rounded-sm object-cover">
                            <a :href="rssData.favicon" target="_blank"
                                class="text-sm text-blue-500 hover:text-blue-600">
                                {{ rssData.favicon }}
                            </a>
                        </div>
                        <div v-else class="text-sm text-gray-700 mt-1">暂无数据</div>
                    </div>

                    <div v-else class="mt-2">
                        <input v-model="editData.favicon" type="text"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <div class="flex justify-end space-x-2 mt-2">
                            <button @click="cancelEdit"
                                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                取消
                            </button>
                            <button @click="saveField('favicon')"
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
const rssData = ref({
    title: '',
    description: '',
    id: '',
    link: '',
    language: 'zh-CN',
    image: '',
    favicon: ''
})
const editData = ref({
    title: '',
    description: '',
    id: '',
    link: '',
    language: 'zh-CN',
    image: '',
    favicon: ''
})

// 获取 RSS 信息
const fetchRssInfo = async () => {
    try {
        loading.value = true
        const response = await getFixedData('rss_feed')

        if (response.code === 200 && response.data) {
            const content = JSON.parse(response.data.content)
            rssData.value = {
                title: content.title || '',
                description: content.description || '',
                id: content.id || content.link || '',
                link: content.link || '',
                language: content.language || 'zh-CN',
                image: content.image || '',
                favicon: content.favicon || ''
            }
            // 初始化编辑数据
            editData.value = { ...rssData.value }
        }
    } catch (err) {
        console.error('获取 RSS 信息失败:', err)
        error.value = err.message || '获取 RSS 信息失败，请稍后重试'
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
        editData.value[field] = rssData.value[field]
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
        rssData.value[field] = editData.value[field]

        // 构建更新数据
        const updatedContent = {
            ...rssData.value
        }

        // 确保 id 和 link 一致
        if (field === 'link') {
            updatedContent.id = updatedContent.link
        }

        const response = await updateFixedData(token, 'rss_feed', {
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
        editData.value[field] = rssData.value[field]
    } finally {
        isSaving.value = false
    }
}

onMounted(() => {
    fetchRssInfo()
})
</script>