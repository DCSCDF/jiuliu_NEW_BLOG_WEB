<template>
    <section class="2xl:max-w-md max-w-2xl mx-auto transition-all duration-300">
        <!-- 搜索部分 -->
        <div class="flex">
            <div class="p-5 w-full">
                <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">搜索文章</h3>
                <div class="space-y-3">
                    <div class="flex flex-col mb-1">
                        <div class="relative flex flex-row group">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-all duration-300"
                                :class="{ 'text-blue-500': isFocused }">
                                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-400 transition-colors duration-300"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input v-model="searchQuery" type="text" placeholder="输入关键词" @input="handleSearchInput"
                                @focus="isFocused = true" @blur="isFocused = false"
                                class="block w-full py-1.5 pr-5 text-gray-700 dark:text-gray-200 bg-white/10 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400/70 dark:placeholder-gray-500/70 pl-11 focus:pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 transition-all duration-300 group-hover:border-blue-300">
                        </div>
                        <span
                            class="text-left mt-2 text-gray-600 dark:text-gray-400 line-clamp-3 transition-opacity duration-300">
                            实时检索网页内容
                        </span>
                        <!-- <span v-if="!searchQuery"
                            class="text-left mt-2 text-gray-600 dark:text-gray-400 line-clamp-3 transition-opacity duration-300">
                            实时检索网页内容
                        </span>
                        <span v-else class="text-left mt-2 text-gray-600 dark:text-gray-400 line-clamp-3">
                            搜索中...
                        </span> -->
                    </div>
                </div>
            </div>
        </div>

        <!-- RSS订阅卡片 -->
        <div class="max-w-md w-full">
            <div class="p-6 transition-shadow duration-300 ">
                <!-- 卡片标题 -->
                <div class="flex items-center mb-6">
                    <div class="bg-blue-500 dark:bg-blue-600 p-3 rounded-lg shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <h2 class="text-gray-800 dark:text-gray-100 font-semibold text-xl">RSS本站内容订阅</h2>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">实时获取最新内容更新</p>
                    </div>
                </div>

                <transition name="fade" mode="out-in">
                    <div v-if="loading" key="loading" class="space-y-4">
                        <div class="flex items-start mb-3">
                            <div class="flex-shrink-0 mt-1">
                                <div class="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                            </div>
                            <div class="ml-2 space-y-2 w-full">
                                <div class="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                                <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="flex-shrink-0 mt-1">
                                <div class="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                            </div>
                            <div class="ml-2 space-y-2 w-full">
                                <div class="h-5 bg-gray-200 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
                                <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3 animate-pulse"></div>
                            </div>
                        </div>

                    </div>

                    <!-- 订阅信息 -->
                    <div v-else class="mt-4">

                        <!-- 最新文章 -->
                        <div class="flex items-start mb-3" v-if="rssStats.latestPost">
                            <div class="flex-shrink-0 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </div>
                            <div class="ml-2">
                                <p class="text-gray-700 dark:text-gray-300">
                                    最新文章:{{ rssStats.latestPost.title }}
                                </p>
                                <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                    将会显示最近10篇文章
                                </p>
                            </div>
                        </div>

                        <!-- 更新频率 -->
                        <div class="flex items-start">
                            <div class="flex-shrink-0 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="ml-2">
                                <p class="text-gray-700 dark:text-gray-300">更新频率:
                                    <span class="font-medium">{{ rssStats.updateFrequency }}</span>
                                </p>
                                <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                    上次更新: {{ formatDate(rssStats.lastUpdated) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </transition>
                <!-- 订阅按钮 -->
                <div class="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button @click="showRssModal = true" class="inline-flex items-center py-2 text-sm font-medium rounded-lg transition-all duration-200
            text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        立即订阅
                    </button>
                </div>

                <!-- 将通知组件使用 teleport 挂载到 body -->
                <teleport to="body">
                    <Notification v-model:show="showCopyNotification" type="success" title="复制成功" message="RSS链接已复制到剪贴板"
                        :duration="2000" />
                </teleport>

                <!-- RSS订阅模态窗口 -->
                <teleport to="body">
                    <transition name="modal-fade">
                        <div v-if="showRssModal" class="fixed inset-0 z-50 overflow-y-auto">
                            <!-- 背景遮罩 -->
                            <div class="fixed inset-0 bg-black bg-opacity-50" @click="showRssModal = false"></div>

                            <!-- 模态框容器 - 确保滚动时居中 -->
                            <div class="flex items-center justify-center min-h-screen p-4">
                                <!-- 模态框内容 -->
                                <div
                                    class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
                                    <!-- 模态框头部 -->
                                    <div
                                        class="flex justify-between items-center px-6 pt-5 pb-4 border-b dark:border-gray-700">
                                        <h3 class="text-lg font-semibold dark:text-gray-100">订阅本站内容</h3>
                                        <button @click="showRssModal = false"
                                            class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <!-- 模态框主体内容 -->
                                    <div class="px-6 mb-10 py-4 space-y-4">
                                        <div>
                                            <p class="text-gray-600 dark:text-gray-300 mb-2">复制以下RSS链接到阅读器:</p>
                                            <div class="flex">
                                                <input :value="rssFeedUrl" ref="rssInput" readonly
                                                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                                                <button @click="copyRssUrl"
                                                    class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-r-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                                                    复制
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </teleport>

            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { format } from 'date-fns';
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')


// 使用防抖处理搜索输入
let searchTimeout = null

const handleSearchInput = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        performSearch()
    }, 500) // 500ms防抖
}

const performSearch = () => {
    // 更新路由参数来触发博客列表更新
    router.push({
        path: '/',
        query: {
            ...router.currentRoute.value.query,
            search: searchQuery.value,
            page: undefined // 重置页码
        }
    })
}


import BlogApi from '../utils/blogapi';

const blogApi = new BlogApi();
const showRssModal = ref(false);
const rssFeedUrl = `${API_BASE_URL}/feed.xml`;


// 添加复制成功通知状态
const showCopyNotification = ref(false)

const copyRssUrl = async () => {
    try {
        await navigator.clipboard.writeText(rssFeedUrl)
        showCopyNotification.value = true // 显示通知

        // 2秒后自动关闭模态框
        setTimeout(() => {
            showRssModal.value = false
        }, 2000)

    } catch (err) {
        console.error('复制失败:', err)
        // 可以添加错误通知
    }
}

// RSS统计信息
const rssStats = ref({
    latestPost: null,
    lastUpdated: null,
    updateFrequency: '每周3-5篇'
});

const loading = ref(true);

const fetchRssStats = async () => {
    try {
        // 获取最新文章
        const latestPosts = await blogApi.searchBlogs({
            pageSize: 1,
            page: 1
        });

        // 获取文章统计数据
        const postStats = latestPosts.data?.stats || { todayAdded: 0, weekAdded: 0 };

        if (latestPosts.data?.rows?.length > 0) {
            const latestPost = latestPosts.data.rows[0];
            rssStats.value.latestPost = {
                title: latestPost.title,
                link: `/blog/${latestPost.id}`,
                pubDate: latestPost.create_time // 使用API返回的create_time
            };
        } else {
            rssStats.value.latestPost = {
                title: '暂无最新文章',
                link: '#',
                pubDate: new Date().toISOString()
            };
        }

        // 设置最后更新时间（使用最新文章的创建时间）
        rssStats.value.lastUpdated = rssStats.value.latestPost.pubDate;

        // 计算每月平均文章数（使用API返回的weekAdded）
        const monthlyAverage = postStats.weekAdded;

        // 设置更新频率为"每月X篇"
        if (monthlyAverage > 0) {
            // rssStats.value.updateFrequency = `每月${monthlyAverage}-${monthlyAverage - monthlyAverage / 2}篇`;
            rssStats.value.updateFrequency = `本周更新了${monthlyAverage}篇`;
        } else {
            rssStats.value.updateFrequency = '咕咕咕了';
        }

    } catch (error) {
        console.error('获取RSS统计失败:', error);
        rssStats.value = {
            latestPost: {
                title: '加载失败',
                link: '#',
                pubDate: new Date().toISOString()
            },
            lastUpdated: new Date().toISOString(),
            updateFrequency: '更新频率未知'
        };
    } finally {
        loading.value = false;
    }
};

// 修改格式化日期函数以处理时间戳
const formatDate = (timestamp) => {
    if (!timestamp) return '未知时间';
    try {
        // 如果timestamp是字符串格式的日期，直接使用
        if (typeof timestamp === 'string') {
            return format(new Date(timestamp), 'yyyy年M月d日');
        }
        // 如果timestamp是数字时间戳
        return format(new Date(Number(timestamp)), 'yyyy年M月d日');
    } catch {
        return '未知时间';
    }
};

onMounted(() => {
    fetchRssStats();
});


const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    debounceTime: {
        type: Number,
        default: 500
    }
});

const emit = defineEmits(['update:modelValue', 'search']);

const searchKeyword = ref(props.modelValue);
const isFocused = ref(false);

watch(() => props.modelValue, (newVal) => {
    searchKeyword.value = newVal;
});
// 监听路由变化来初始化搜索词
watch(() => router.currentRoute.value.query.search, (newVal) => {
    if (newVal !== searchQuery.value) {
        searchQuery.value = newVal || ''
    }
}, { immediate: true })


</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 背景淡入淡出动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

/* 模态框内容动画 */
.modal-fade-enter-active .transform,
.modal-fade-leave-active .transform {
    transition: all 0.3s ease;
}

.modal-fade-enter-from .transform,
.modal-fade-leave-to .transform {
    opacity: 0;
    transform: translateY(-20px);
}
</style>