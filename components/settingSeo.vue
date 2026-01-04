<template>
    <form @submit.prevent="updateSeo" class="space-y-4">
        <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">网站标题</label>
            <input v-model="seoData.title" type="text" id="title"
                class="block py-1.5 text-gray-700 bg-white border border-gray-200 rounded-lg w-full md:w-1/2 md:max-w-96 placeholder-gray-400/70 pl-3 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="输入网站标题" />
        </div>

        <div>
            <label for="url" class="block text-sm font-medium text-gray-700 mb-1">网站URL</label>
            <input v-model="seoData.url" type="url" id="url"
                class="block py-1.5 text-gray-700 bg-white border border-gray-200 rounded-lg w-full md:w-1/2 md:max-w-96 placeholder-gray-400/70 pl-3 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="https://example.com" />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">关键词</label>
            <div class="flex flex-wrap gap-2 mb-2">
                <span v-for="(keyword, index) in seoData.keywords" :key="index"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ keyword }}
                    <button type="button" @click="removeKeyword(index)" class="ml-1 text-blue-500 hover:text-blue-700">
                        &times;
                    </button>
                </span>
            </div>
            <div class="flex">
                <input v-model="newKeyword" type="text" @keydown.enter.prevent="addKeyword"
                    class="block py-1.5 text-gray-700 bg-white border border-gray-200 rounded-l-lg w-full md:w-1/2 md:max-w-96 placeholder-gray-400/70 pl-3 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="输入关键词名称" />
                <button type="button" @click="addKeyword"
                    class="text-nowrap px-3 py-1.5 bg-blue-100 text-blue-800 rounded-r-lg hover:bg-blue-200">
                    添加
                </button>
            </div>
        </div>

        <button type="submit" :disabled="isSubmitting"
            class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {{ isSubmitting ? '保存中...' : '保存SEO设置' }}
        </button>

        <div v-if="message" class="p-3 rounded-lg"
            :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ message }}
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const token = localStorage.getItem('admin_token');

const seoData = ref({
    title: '',
    keywords: [],
    url: ''
})
const newKeyword = ref('')
const isSubmitting = ref(false)
const message = ref('')
const messageType = ref('')

onMounted(async () => {
    try {
        const config = await getSeoConfig()
        seoData.value = {
            title: config.title,
            keywords: [...config.keywords],
            url: config.url
        }
    } catch (error) {
        console.error('Failed to load SEO config:', error)
        message.value = '加载SEO配置失败'
        messageType.value = 'error'
    }
})

const addKeyword = () => {
    if (newKeyword.value.trim() && !seoData.value.keywords.includes(newKeyword.value.trim())) {
        seoData.value.keywords.push(newKeyword.value.trim())
        newKeyword.value = ''
    }
}

const removeKeyword = (index) => {
    seoData.value.keywords.splice(index, 1)
}

const updateSeo = async () => {
    if (!token) {
        message.value = '请先登录'
        messageType.value = 'error'
        return
    }

    isSubmitting.value = true
    message.value = ''

    try {
        const content = JSON.stringify({
            title: seoData.value.title,
            keywords: seoData.value.keywords,
            url: seoData.value.url
        })

        await updateFixedData(token, 'seo_message', { content })

        message.value = 'SEO设置更新成功'
        messageType.value = 'success'
        setTimeout(() => {
            window.location.reload()
        }, 500)
    } catch (error) {
        console.error('Failed to update SEO:', error)
        message.value = '更新SEO设置失败: ' + (error.message || '服务器错误')
        messageType.value = 'error'
    } finally {
        isSubmitting.value = false
    }
}
</script>