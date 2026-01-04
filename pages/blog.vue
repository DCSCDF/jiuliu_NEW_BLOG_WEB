<template>
    <div class="min-h-screen bg-white/50 md:mx-10 xl:mx-40">
        <div class="flex flex-col min-h-screen">
            <appheader></appheader>

            <div class="w-full h-20"></div>

            <div class="mx-4 md:mx-20">
                <!-- 面包屑导航 -->
                <div class="flex items-center py-4 overflow-x-auto whitespace-nowrap">
                    <router-link to="/"
                        class="text-blue-500 hover:text-blue-700 flex items-center transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1 transform transition-transform "
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="group-hover:underline">返回主页</span>
                    </router-link>
                </div>

                <!-- 文章标题区域 -->
                <div class="max-w-4xl mx-auto">
                    <div class="mb-8" v-if="loading">
                        <div class="h-12 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div class="flex items-center space-x-4">
                            <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div class="h-4 w-4 bg-gray-200 rounded-full"></div>
                            <div class="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <div class="mb-8" v-else>
                        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            {{ blogDetail.title || "null" }}
                        </h1>

                        <div class="mt-6 flex items-center text-sm text-gray-500">
                            <span>{{ formatDate(blogDetail.create_time) || "null" }}</span>
                            <span class="mx-2">•</span>
                            <span class="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                                {{ getCategoryName(blogDetail.category_id) }}
                            </span>
                        </div>
                    </div>

                    <!-- 文章内容区域 -->
                    <div v-if="loading" class="space-y-4">
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    </div>

                    <div v-else>
                        <article class="prose prose-lg max-w-none 
                                prose-headings:font-serif prose-headings:font-bold
                                prose-h1:text-3xl prose-h1:mb-6 prose-h1:border-b prose-h1:pb-4
                                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4
                                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 
                                prose-blockquote:pl-4 
                                prose-blockquote:italic
                                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                                prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                                prose-li:my-1
                                break-words hyphenate  
                                prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
                                prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-8
                                prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                                prose-pre:rounded-xl prose-pre:p-4 
                                prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap prose-pre:word-break-break-word 
                                prose-table:border-collapse prose-table:w-full prose-table:my-6
                                prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-gray-300
                                prose-td:p-3 prose-td:border prose-td:border-gray-300
                                line-numbers
                                " v-html="blogDetail.content">
                        </article>
                    </div>
                    <div class="my-5 border-b border-gray-300"></div>

                    <!-- 修改评论区域结构 -->
                    <div class="my-10">
                        <!-- 始终渲染容器，但控制可见性 -->
                        <div id="tcomment" class="border rounded-lg p-4 bg-gray-50" v-show="shouldShowComments">
                            <!-- 加载状态 -->
                            <div v-if="commentLoading" class="comment-loading">
                                <p class="mt-2 text-gray-600">评论系统加载中...</p>
                            </div>
                        </div>

                        <!-- 错误提示 -->
                        <p v-if="commentError" class="comment-error">
                            {{ commentError }}
                        </p>

                        <!-- 内容加载失败提示 -->
                        <div v-if="contentLoadError" class="text-center py-8 text-gray-500">
                            评论功能暂不可用（内容加载失败）
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, watchEffect, nextTick } from 'vue'
import { useRoute, useHead, useAsyncData } from '#imports'
import BlogApi from '../utils/blogapi'
import CategoryService from '../utils/category'

const route = useRoute()
const blogDetail = ref({
    title: '',
    content: '',
    create_time: Date.now(),
    category: ''
})

const loading = ref(true)
const contentLoadError = ref(false)
const categories = ref([])
const commentLoading = ref(false)
const commentError = ref(null)
const shouldShowComments = ref(true)

// 创建API实例
const blogApi = new BlogApi()
const categoryService = new CategoryService()

// 获取博客详情数据
const fetchBlogDetail = async (blogId) => {
    try {
        loading.value = true
        contentLoadError.value = false

        const result = await blogApi.getBlogDetail(blogId)

        if (result.data) {
            blogDetail.value = {
                ...result.data,
                category_id: result.data.category_id // 确保使用正确的字段名
            }
        }
        return result.data || null
    } catch (err) {
        console.error('获取博客详情失败:', err)
        contentLoadError.value = true
        throw err
    } finally {
        loading.value = false
    }
}
// 获取分类数据
const fetchCategories = async () => {
    try {
        const result = await categoryService.getCategoryList()
        categories.value = result.data || []

        return result.data
    } catch (error) {
        console.error('获取分类列表失败:', error)
    }
}
const getCategoryName = (categoryId) => {
    if (!categoryId) return '未分类'
    const category = categories.value.find(c => c.id === categoryId)
    return category ? category.name : '未分类'
}


// 使用 useAsyncData 进行服务端数据获取
const { data: blogData, error, refresh } = useAsyncData(
    'blogDetail',
    async () => {
        // 优先使用查询参数，没有则使用路由参数
        const blogId = route.query.id || route.params.id
        if (!blogId) {
            throw createError({ statusCode: 404, message: '文章ID不存在' })
        }
        return await fetchBlogDetail(blogId)
    },
    {
        // 明确监听查询参数变化
        watch: [() => route.query.id]
    }
)

// 响应数据变化
watchEffect(() => {
    if (blogData.value) {
        blogDetail.value = {
            ...blogData.value,
            category: blogData.value.category || '未分类'
        }
        loading.value = false
    } else if (error.value) {
        contentLoadError.value = true
        loading.value = false
    }
})

const formatDate = (timestamp) => {
    if (!timestamp) return '未知日期'
    const date = new Date(timestamp)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}



// 安全的高亮函数
const safeHighlight = async () => {
    try {
        // 确保只在客户端执行
        if (import.meta.client) {
            const Prism = await import('prismjs')
            await import('prismjs/themes/prism-tomorrow.min.css')
            await import('prismjs/plugins/line-numbers/prism-line-numbers.min.js')
            await import('prismjs/plugins/line-numbers/prism-line-numbers.min.css')

            // 确保DOM已更新
            await nextTick()

            // 检查目标元素是否存在
            const preElements = document.querySelectorAll('pre[class*="language-"]')
            if (preElements.length > 0) {
                Prism.highlightAll()
            }
        }
    } catch (err) {
        console.error('代码高亮失败:', err)
    }
}

// 初始化评论系统
const initComments = async () => {
    try {
        commentLoading.value = true
        commentError.value = null

        if (import.meta.client) {
            const { setupCommentSystem } = await import('../utils/commentapi')
            await nextTick()
            await setupCommentSystem('tcomment', route.params.id || route.query.id)
        }
    } catch (err) {
        console.error('评论系统初始化失败:', err)
        commentError.value = '评论系统初始化失败，请稍后再试'
    } finally {
        commentLoading.value = false
    }
}

// 组合初始化函数
const initFeatures = async () => {
    if (loading.value || contentLoadError.value) return

    await safeHighlight()
    await initComments()
}

// SEO 设置
useHead(() => ({
    title: blogDetail.value.title || '博客详情',
    meta: [
        { name: 'description', content: blogDetail.value.description || '博客文章详情页' }
    ]
}))
onMounted(async () => {
    // 如果初始没有数据，强制刷新
    if (!blogData.value && (route.query.id || route.params.id)) {
        await refresh()
    }
    await fetchCategories()
    await initFeatures()
})


// 监听数据变化重新初始化
watch([() => blogDetail.value.content, () => loading.value], () => {
    initFeatures()
}, { deep: true })

// 监听路由变化
watch([() => route.query.id], ([newQueryId]) => {
    if (newQueryId) {
        refresh().then(initFeatures)
    }
})

// 添加页面可见性变化监听，当页面重新获得焦点时刷新数据
onMounted(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                refresh().then(initFeatures)
            }
        })
    }
})

// 添加截取描述文本的辅助函数
const truncateDescription = (content, maxLength) => {
    if (!content) return '技术博客文章详情页'
    const plainText = content.replace(/<[^>]*>/g, '')
    return plainText.length > maxLength
        ? plainText.substring(0, maxLength) + '...'
        : plainText
}


// 改进的SEO设置
useHead(() => {
    // 确保blogDetail.value已加载
    const title = blogDetail.value?.title ? `${blogDetail.value.title} - ${SEO.title}` : SEO.title
    const description = blogDetail.value?.description ||
        (blogDetail.value?.content ? truncateDescription(blogDetail.value.content, 160) : '技术博客文章详情页')
    const keywords = blogDetail.value?.keywords || SEO.keywords.join(', ')
    const url = `${SEO.url}${route.fullPath}`

    return {
        title,
        meta: [
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },
            { name: 'author', content: '久流' },
            { name: 'robots', content: 'index, follow' },
            // Open Graph 元数据
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:type', content: 'article' },
            { property: 'og:url', content: url },
        ],
        link: [
            { rel: 'canonical', href: url }
        ],
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": title,
                    "description": description,
                    "datePublished": blogDetail.value?.create_time ? new Date(blogDetail.value.create_time).toISOString() : new Date().toISOString(),
                    "author": {
                        "@type": "Person",
                        "name": "久流"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": SEO.title,
                        "logo": {
                            "@type": "ImageObject",
                            "url": `${SEO.url}/logo.png`
                        }
                    },
                    "image": blogDetail.value?.cover_image || `${SEO.url}/default-blog-cover.jpg`,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": url
                    }
                })
            }
        ]
    }
})


</script>

<style>
/* 添加这段样式确保代码块在加载时有最小高度 */
pre[class*="language-"] {
    min-height: 1.5em;
    background: #1f2937 !important;
}

:not(pre)>code[class*=language-] {
    background: #1f2937;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>