<template>
    <div class="w-full mx-auto max-w-2xl">
        <!-- 分类标签 -->
        <div class="flex flex-col">
            <!-- 骨架屏只在客户端显示 -->
            <ClientOnly>
                <div v-if="initialLoading" class="pb-10 pt-2 flex flex-row">
                    <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mr-2 w-20 animate-pulse"></div>
                    <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mr-2 w-24 animate-pulse"></div>
                    <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mr-2 w-16 animate-pulse"></div>
                </div>
            </ClientOnly>

            <!-- 实际分类按钮 -->
            <div v-if="!initialLoading" class="pb-10 pt-2 flex flex-row">
                <button @click="clearCategoryFilter"
                    class="transition-all duration-300 px-3 mr-2 shadow-md py-1.5 border dark:border-gray-700 text-sm font-medium leading-5 text-center capitalize rounded-lg focus:outline-none"
                    :class="{
                        'text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600': activeCategory === null,
                        'text-gray-600 bg-white hover:bg-gray-100 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700': activeCategory !== null
                    }">
                    ✨ 全部
                </button>
                <button v-for="category in categories" :key="category.id" @click="toggleCategoryFilter(category.id)"
                    class="transition-all duration-300 px-3 mr-2 shadow-md py-1.5 border dark:border-gray-700 text-sm font-medium leading-5 text-center capitalize rounded-lg focus:outline-none"
                    :class="{
                        'text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600': activeCategory === category.id,
                        'text-gray-600 bg-white hover:bg-gray-100 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700': activeCategory !== category.id
                    }">
                    {{ category.emoji || '📄' }} {{ category.name }}
                </button>
            </div>
        </div>

        <!-- 内容区域 -->
        <div class="w-full relative min-h-[400px]">
            <!-- 博客列表 -->
            <div v-if="!loading && blogs.length > 0" class="relative">
                <div v-for="blog in blogs" :key="blog.id" class="card-item max-w-2xl px-4">
                    <div class="px-4 flex items-center border-l-2 border-blue-400 dark:border-blue-500">
                        <h2
                            class="text-2xl font-bold text-gray-900 dark:text-gray-100 w-auto hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                            <NuxtLink :to="`/blog/${blog.id}`" class="block">
                                {{ blog.title }}
                            </NuxtLink>
                        </h2>
                    </div>

                    <div class="px-4 border-l border-gray-200 dark:border-gray-700">
                        <div class="flex pt-2 items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                            <span class="flex items-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3M9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {{ formatDate(blog.create_time) }}
                            </span>
                        </div>
                    </div>

                    <div class="px-4 border-l pt-2 border-gray-200 dark:border-gray-700">
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                            {{ blog.summary || blog.content.substring(0, 180) + '...' }}
                        </p>
                    </div>

                    <div class="px-4 pt-2 border-l border-gray-200 dark:border-gray-700 pb-6">
                        <div class="group inline-flex items-center cursor-pointer">
                            <NuxtLink :to="`/blog/${blog.id}`"
                                class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300 relative pb-1">
                                <span class="relative flex">
                                    阅读更多
                                    <span
                                        class="absolute bottom-0 left-0 w-0 h-px bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                                    <span
                                        class="mt-1 text-blue-500 group-hover:text-blue-600 dark:text-blue-400 dark:group-hover:text-blue-300 transition-all duration-300 group-hover:translate-x-1">
                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 空状态 -->
            <div v-else-if="!loading && blogs.length === 0" class="w-full max-w-2xl px-4 text-center py-10">
                <div class="mb-4 text-6xl">😢</div>
                <p class="text-gray-600 dark:text-gray-400 text-lg font-medium">暂时没有找到相关内容哦～</p>
            </div>

            <!-- 加载状态 -->

            <div v-else class="px-4">
                <div v-for="n in PAGE_SIZE" :key="`loading-${n}`"
                    class="border-l-2 border-gray-200 dark:border-gray-700 pl-8 pb-6 card-item">
                    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 mb-4 animate-pulse"></div>
                    <div class="flex space-x-6 mb-4">
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-32 animate-pulse"></div>
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div>
                    </div>
                    <div class="space-y-2">
                        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full animate-pulse"></div>
                        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5 animate-pulse"></div>
                        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3 animate-pulse"></div>
                    </div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-24 mt-4 animate-pulse"></div>
                </div>
            </div>


            <!-- 分页组件 -->
            <div v-if="totalPages > 1 && blogs.length > 0" class="flex justify-center pb-10">
                <div class="flex">
                    <!-- 上一页按钮 -->
                    <NuxtLink :to="currentPage > 1 ? getPageLink(currentPage - 1) : ''" custom
                        v-slot="{ href, navigate }">
                        <a :href="href" @click="(e) => { e.preventDefault(); navigate() }" :class="[
                            'px-3 py-1 mx-1 transition-colors duration-300 transform rounded-md flex items-center',
                            currentPage === 1
                                ? 'text-gray-500 dark:text-gray-400 cursor-not-allowed bg-white dark:bg-gray-800'
                                : 'text-gray-700 dark:text-gray-300 cursor-pointer bg-white hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:hover:bg-blue-600'
                        ]" :disabled="currentPage === 1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-1" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                        </a>
                    </NuxtLink>

                    <!-- 第一页 -->
                    <NuxtLink v-if="currentPage > 3" :to="getPageLink(1)" custom v-slot="{ href, navigate }">
                        <a :href="href" @click="(e) => { e.preventDefault(); navigate() }" :class="[
                            'hidden px-3 py-1 mx-1 transition-colors duration-300 transform rounded-md sm:inline',
                            1 === currentPage
                                ? 'bg-blue-500 text-white darkhttps://tailwindcss.com/:bg-blue-600'
                                : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-600'
                        ]">
                            1
                        </a>
                    </NuxtLink>

                    <!-- 省略号 -->
                    <span v-if="currentPage > 4" class="px-4 py-2 mx-1 text-gray-700 dark:text-gray-300">...</span>

                    <!-- 中间页码 -->
                    <template v-for="page in visiblePages" :key="page">
                        <NuxtLink :to="getPageLink(page)" custom v-slot="{ href, navigate }">
                            <a :href="href" @click="(e) => { e.preventDefault(); navigate() }" :class="[
                                'hidden px-3 py-1 mx-1 transition-colors duration-300 transform rounded-md sm:inline',
                                page === currentPage
                                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                                    : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-600'
                            ]">
                                {{ page }}
                            </a>
                        </NuxtLink>
                    </template>

                    <!-- 省略号 -->
                    <span v-if="currentPage < totalPages - 3"
                        class="px-4 py-2 mx-1 text-gray-700 dark:text-gray-300">...</span>

                    <!-- 下一页按钮 -->
                    <NuxtLink :to="currentPage < totalPages ? getPageLink(currentPage + 1) : ''" custom
                        v-slot="{ href, navigate }">
                        <a :href="href" @click="(e) => { e.preventDefault(); navigate() }" :class="[
                            'px-3 py-1 mx-1 transition-colors duration-300 transform rounded-md flex items-center',
                            currentPage === totalPages
                                ? 'text-gray-500 dark:text-gray-400 cursor-not-allowed bg-white dark:bg-gray-800'
                                : 'text-gray-700 dark:text-gray-300 cursor-pointer bg-white hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:hover:bg-blue-600'
                        ]" :disabled="currentPage === totalPages">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-1" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import BlogApi from '../utils/blogapi'
import CategoryService from '../utils/category'

const route = useRoute()

// 常量
const PAGE_SIZE = 6
const MIN_LOADING_TIME = 300 // 最小加载时间300ms

// 响应式状态https://tailwindcss.com/
const blogs = ref([])
const categories = ref([])
const totalCount = ref(0)
const loading = ref(true)
const initialLoading = ref(true)
const activeCategory = ref(null)

// 计算属性
const currentPage = computed(() => {
    const pageMatch = route.path.match(/\/page\/(\d+)/)
    return pageMatch ? parseInt(pageMatch[1]) : 1
})

const totalPages = computed(() => Math.ceil(totalCount.value / PAGE_SIZE))

const visiblePages = computed(() => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }
    return pages
})

// 工具函数
const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

const getPageLink = (page) => {
    const query = { ...route.query }

    if (page === 1) {
        delete query.page
        return { path: '/', query }
    }

    return {
        path: `/page/${page}`,
        query: {
            ...query,
            page
        }
    }
}

// 数据获取函数
const fetchData = async () => {
    const startTime = Date.now()

    try {
        loading.value = true

        const categoryId = route.query.category ? parseInt(route.query.category) : null
        const searchKeyword = route.query.search || ''
        activeCategory.value = categoryId

        const blogApi = new BlogApi()
        const categoryService = new CategoryService()

        const [blogsResult, categoriesResult] = await Promise.all([
            blogApi.searchBlogs({
                keyword: searchKeyword,
                categoryId: categoryId || 0,
                page: currentPage.value,
                pageSize: PAGE_SIZE
            }),
            categoryService.getCategoryList()
        ])

        const elapsed = Date.now() - startTime
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed)
        if (remainingTime > 0) {
            await new Promise(resolve => setTimeout(resolve, remainingTime))
        }

        if (blogsResult.code === 200) {
            blogs.value = blogsResult.data?.rows || []
            totalCount.value = blogsResult.data?.count || 0
        }

        if (categoriesResult.data) {
            categories.value = categoriesResult.data
        }
    } catch (error) {
        console.error('数据获取失败:', error)
        blogs.value = []
        totalCount.value = 0
    } finally {
        loading.value = false
        initialLoading.value = false
    }
}


// 客户端路由变化监听
onMounted(() => {
    watch(
        () => [route.path, route.query],
        async () => {
            await fetchData()
        },
        { immediate: true }
    )
})

// 分类操作
const toggleCategoryFilter = async (categoryId) => {
    if (activeCategory.value === categoryId) {
        await clearCategoryFilter()
        return
    }

    await navigateTo({
        path: '/',
        query: {
            ...route.query,
            category: categoryId
        }
    })
}

const clearCategoryFilter = async () => {
    const query = { ...route.query }
    delete query.category

    await navigateTo({
        path: '/',
        query
    })
}
</script>

<style scoped>
.card-item {
    width: 100%;
    max-width: 42rem;
    margin-left: auto;
    margin-right: auto;
}

.card-item h2 {
    word-break: break-word;
    overflow-wrap: break-word;
}

.animate-pulse {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.6;
    }

    50% {
        opacity: 0.3;
    }
}
</style>