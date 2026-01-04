<template>
    <div class="min-h-screen bg-gray-50/50">
        <div class="flex flex-col min-h-screen">
            <appheader></appheader>

            <main class="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                <!-- 本站信息卡片 -->
                <div
                    class="max-w-4xl mx-auto mb-12 p-6 rounded-2xl backdrop-blur-sm bg-white/30 transition-all duration-300 hover:bg-white/40">
                    <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div class="flex-shrink-0">
                            <div
                                class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center transition-transform duration-300 hover:scale-105">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:h-12 md:w-12 text-blue-500"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                        </div>
                        <div class="text-center md:text-left">
                            <h2 class="text-2xl font-bold text-gray-800 mb-2">关于本站</h2>
                            <p class="text-gray-600 mb-4">这是一个专注于分享优质内容的技术博客，致力于提供有价值的信息和资源。互换友链前往留言界面。</p>

                            <!-- 信息表格 -->
                            <div class="mt-6">
                                <div class="p-4 rounded-xl">
                                    <div class="grid grid-cols-1 gap-3">
                                        <div class="pb-2 border-b border-gray-200/50">
                                            <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">名称
                                            </div>
                                            <div class="text-sm font-medium text-gray-800 mt-1">久流的个人小站</div>
                                        </div>

                                        <div class="pb-2 border-b border-gray-200/50">
                                            <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">网址
                                            </div>
                                            <a href="https://jiuliu.top/" target="_blank"
                                                class="text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200 inline-block mt-1">https://jiuliu.top/</a>
                                        </div>

                                        <div class="pb-2 border-b border-gray-200/50">
                                            <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">简介
                                            </div>
                                            <div class="text-sm text-gray-700 mt-1">借由他人,寻找自我</div>
                                        </div>

                                        <div>
                                            <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">头像
                                            </div>
                                            <div class="text-sm text-gray-700 mt-1">
                                                https://www.jiuliu.top/assets/JiuLiu-WQACzpL9.jpg</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 分类标签 -->
                            <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
                                <span v-for="category in categories"
                                    class="px-3 py-1 bg-white/50 text-blue-600 rounded-full text-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/70 hover:shadow-sm">
                                    {{ category.name }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 友情链接列表 -->
                <div class="max-w-4xl mx-auto">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center md:justify-start">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        友情链接
                    </h2>

                    <!-- 加载状态 -->
                    <div v-if="loading" class="flex justify-center py-12">
                        <div
                            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 border-opacity-50">
                        </div>
                    </div>

                    <!-- 错误状态 -->
                    <div v-else-if="error"
                        class="bg-red-50/50 backdrop-blur-sm rounded-xl p-4 mb-6 border-l-4 border-red-400">
                        <div class="flex items-start">
                            <svg class="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd" />
                            </svg>
                            <div class="ml-3">
                                <p class="text-sm text-red-700">{{ error }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- 空状态 -->
                    <div v-else-if="links.length === 0"
                        class="text-center py-12 bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:bg-white/40">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="mt-3 text-sm font-medium text-gray-800">暂无友情链接</h3>
                        <p class="mt-1 text-sm text-gray-500">当前没有可显示的友情链接</p>
                    </div>

                    <!-- 正常状态 -->
                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- 友情链接卡片 -->
                        <a v-for="(link, index) in links" :key="index" :href="link.url" target="_blank"
                            class="group p-4 rounded-xl bg-white/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/40 hover:-translate-y-1">
                            <div class="flex items-start">
                                <div class="flex-shrink-0 mr-3">
                                    <div
                                        class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100/50 flex items-center justify-center">
                                        <img :src="link.img_url || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOCA8aDFhNCA0IDAgMDE0IDR2MW0tNSA0SDVhNCA0IDAgMDEtNC00VjVhNCA0IDAgMDE0LTRoMTZhNCA0IDAgMDE0IDR2OGMwIC43Ni0uMjMgMS40Ny0uNjIgMi4wNi0uMjUuMzktLjU1LjczLS45IDEuMDEtLjM1LjI4LS43NS41LTEuMTkuNjYtLjQ0LjE2LS45LjI0LTEuMzkuMjQtLjQ5IDAtLjk1LS4wOC0xLjM5LS4yNC0uNDQtLjE2LS44NC0uMzgtMS4xOS0uNjYtLjM1LS4yOC0uNjUtLjYyLS45LTEuMDEtLjM5LS41OS0uNjItMS4zLS42Mi0yLjA2VjgiPjwvcGF0aD48L3N2Zz4='"
                                            :alt="link.title"
                                            class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                                            @error="handleImageError">
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3
                                        class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 truncate transition-colors duration-200">
                                        {{ link.title }}
                                    </h3>
                                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ link.content }}</p>
                                    <div
                                        class="text-xs text-blue-400 truncate mt-1 transition-colors duration-200 group-hover:text-blue-500">
                                        {{ link.url }}
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getLinks } from '../utils/linksapi';
import CategoryService from '../utils/category';


useHead(() => ({
    title: `${SEO.title} - 友情链接`,
    meta: [
        {
            name: 'description',
            content: '友情链接页面，这里展示与本站互相联系的博主们。'
        },
        {
            name: 'keywords',
            content: SEO.keywords.join(', ')
        },
        { name: 'author', content: '久流' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph 元数据
        { property: 'og:title', content: `${SEO.title}友情链接` },
        {
            property: 'og:description',
            content: '友情链接页面，这里展示与本站互相联系的博主们。'
        },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `${SEO.url}/links` },
    ],
    link: [
        { rel: 'canonical', href: `${SEO.url}/links` }
    ]
}))


const categoryService = new CategoryService();
const categories = ref([]);
const links = ref([]);
const loading = ref(true);
const error = ref(null);

// 获取友情链接列表
const fetchLinks = async () => {
    try {
        loading.value = true;
        error.value = null;
        const result = await getLinks({});
        links.value = result.data || [];
    } catch (err) {
        console.error('获取友情链接失败:', err);
        error.value = '获取友情链接失败，请稍后重试';
        links.value = [];
    } finally {
        loading.value = false;
    }
};

// 获取分类列表
const fetchCategories = async () => {
    try {
        const result = await categoryService.getCategoryList();
        categories.value = result.data || [];
    } catch (err) {
        console.error('获取分类列表失败:', err);
        categories.value = [];
    }
};

// 图片加载错误处理
const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOCA8aDFhNCA4IDAgMDE0IDR2MW0tNSA0SDVhNCA0IDAgMDEtNC00VjVhNCA0IDAgMDE0LTRoMTZhNCA0IDAgMDE0IDR2OGMwIC43Ni0uMjMgMS40Ny0uNjIgMi4wNi0uMjUuMzktLjU1LjczLS45IDEuMDEtLjM1LjI4LS43NS41LTEuMTkuNjYtLjQ0LjE2LS45LjI0LTEuMzkuMjQtLjQ5IDAtLjk1LS4wOC0xLjM5LS4yNC0uNDQtLjE2LS44NC0uMzgtMS4xOS0uNjYtLjM1LS4yOC0uNjUtLjYyLS45LTEuMDEtLjM5LS41OS0uNjItMS4zLS62Mi0yLjA2VjgiPjwvcGF0aD48L3N2Zz4=';
};

onMounted(async () => {
    try {
        await Promise.all([fetchCategories(), fetchLinks()]);
    } catch (err) {
        console.error('初始化数据失败:', err);
        error.value = '初始化数据失败';
    }
});
</script>

<style>
/* 平滑滚动 */
html {
    scroll-behavior: smooth;
}

/* 自定义动画 */
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

.fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

/* 卡片悬停效果 */
.card-hover {
    transition: all 0.3s ease;
}

.card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

/* 图片加载失败时的备用样式 */
img {
    background-color: #f8fafc;
    transition: opacity 0.3s ease;
}
</style>