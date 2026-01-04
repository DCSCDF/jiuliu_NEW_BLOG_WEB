<template>
    <!-- 信息表格 -->
    <div class="mt-6">
        <div class="p-4 rounded-xl transition-colors duration-300">
            <transition name="fade" mode="out-in">
                <!-- 加载状态 -->
                <div v-if="loading" class="space-y-4">
                    <div v-for="i in 4" :key="i" class="pb-2 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div class="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div class="h-4 w-3/4 bg-gray-100 dark:bg-gray-600 rounded animate-pulse mt-2"></div>
                    </div>
                </div>

                <!-- 错误状态-->
                <div v-else-if="error"
                    class="text-sm p-4 rounded bg-red-50/80 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-l-4 border-red-400 dark:border-red-500">
                    {{ error }}
                </div>

                <!-- 正常状态-->
                <div v-else class="grid grid-cols-1 gap-3">
                    <!-- 名称 -->
                    <div class="pb-2 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">名称
                        </div>
                        <div class="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                            {{ siteData.name || '暂无数据' }}
                        </div>
                    </div>

                    <!-- 网址 -->
                    <div class="pb-2 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">网址
                        </div>
                        <a v-if="siteData.url" :href="siteData.url" target="_blank"
                            class="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 inline-block mt-1">
                            {{ siteData.url }}
                        </a>
                        <div v-else class="text-sm text-gray-700 dark:text-gray-300 mt-1">暂无数据</div>
                    </div>

                    <!-- 简介 -->
                    <div class="pb-2 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">简介
                        </div>
                        <div class="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {{ siteData.description || '暂无数据' }}
                        </div>
                    </div>

                    <!-- 头像 -->
                    <div>
                        <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">头像
                        </div>
                        <div v-if="siteData.avatar" class="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            <a :href="siteData.avatar" target="_blank"
                                class="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200">
                                {{ siteData.avatar }}
                            </a>
                        </div>
                        <div v-else class="text-sm text-gray-700 dark:text-gray-300 mt-1">暂无数据</div>
                    </div>
                </div>
            </transition>

        </div>
    </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { getFixedData } from '../utils/fixedDataApi'

const loading = ref(true)
const error = ref(null)
const siteData = ref({
    name: '',
    url: '',
    description: '',
    avatar: ''
})

const fetchSiteInfo = async () => {
    try {
        loading.value = true
        const response = await getFixedData('link_message')

        if (response.code === 200 && response.data) {
            // 解析 content 字段中的 JSON 字符串
            const content = JSON.parse(response.data.content)

            siteData.value = {
                name: content.name || content.title || '',
                url: content.url || content.website || '',
                description: content.description || content.bio || '',
                avatar: content.avatar || content.image || ''
            }
        }
    } catch (err) {
        console.error('获取站点信息失败:', err)
        error.value = err.message || '获取站点信息失败，请稍后重试'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchSiteInfo()
})
</script>