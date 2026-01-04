<template>
    <div class="flex flex-col min-h-screen h-full bg-white/50 dark:bg-gray-800/60 md:mx-10 xl:mx-40">
        <div class="flex-1">
            <appheader></appheader>
            <Heros></Heros>
            <div class="container md:px-6 py-5 mx-auto">
                <div class="flex 2xl:flex-row flex-col-reverse gap-6">
                    <!-- 主内容区域 -->
                    <div class="2xl:w-3/5">
                        <div class="m-4">
                            <Blogcard :search-keyword="searchKeyword"></Blogcard>
                        </div>
                    </div>

                    <!-- 侧边栏区域 -->
                    <div class="2xl:w-2/5 2xl:my-20">
                        <!-- 移动端悬浮按钮 -->
                        <button
                            class="fixed bottom-12 right-10 2xl:hidden z-50 p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            @click="toggleSidebar">
                            <svg width="26" height="26" t="1746976275842" class="icon" viewBox="0 0 1028 1024"
                                version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9831">
                                <path
                                    d="M7.856789 602.079857c158.044987 2.617399 316.007318 3.788341 473.882404 3.512825A56865.980269 56865.980269 0 0 1 482.519821 2.805668 3854.340592 3854.340592 0 0 0 15.975318 25.710206a3762.015283 3762.015283 0 0 0-8.118529 576.369651zM54.308735 1002.280179a3557.0913 3557.0913 0 0 0 430.653991 21.141238c-1.322475-115.702816-2.291372-231.506655-2.897506-347.406924-156.378117 0.518888-312.834296-1.653094-469.377722-6.520538a3835.297865 3835.297865 0 0 0 41.621237 332.786224zM543.62461 1022.250475c143.557453-4.059265 287.105722-16.843193 430.658583-38.360968 30.269991-177.17496 47.498906-354.267265 51.686744-531.276915a27595.367318 27595.367318 0 0 0-479.314654-6.088897c-0.298475 192.167605-1.304108 384.078063-3.030673 575.72678zM546.072108 4.07304c0.514296 124.147372 0.734709 248.18913 0.656645 372.120682 160.152682 1.235229 320.213525 5.115408 480.191713 11.649722a3611.202583 3611.202583 0 0 0-14.303856-342.218045C857.097184 22.316771 701.58235 8.467516 546.072108 4.07304z"
                                    fill="#84ADDD" p-id="9832" class="dark:fill-blue-400"></path>
                            </svg>
                        </button>

                        <!-- 侧边栏内容 -->
                        <div :class="[
                            '2xl:sticky 2xl:top-20 2xl:self-start',
                            'fixed inset-0 z-40 2xl:z-0 bg-white/80 dark:bg-gray-800/80 2xl:bg-white/0 2xl:dark:bg-gray-900/0 backdrop-blur-md 2xl:backdrop-blur-none transition-transform duration-300 ease-in-out 2xl:transform-none',
                            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        ]">
                            <!-- 关闭按钮 (移动端) -->
                            <button class="absolute top-4 right-4 p-2 2xl:hidden text-gray-800 dark:text-gray-200"
                                @click="toggleSidebar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                </svg>
                            </button>

                            <div
                                class="mx-3 h-full overflow-y-auto p-6 2xl:p-0 2xl:max-h-[calc(100vh-5rem)] 2xl:overflow-y-auto">
                                <Sidebar @search="handleSearch"></Sidebar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const searchKeyword = ref('');
const mobileSidebarOpen = ref(false);

const handleSearch = (keyword) => {
    searchKeyword.value = keyword;
};

const toggleSidebar = () => {
    mobileSidebarOpen.value = !mobileSidebarOpen.value;
    updateBodyOverflow();
};

// 统一处理滚动状态
const updateBodyOverflow = () => {
    // 如果是移动端且侧边栏打开，则禁止滚动
    const isMobile = window.innerWidth < 1280; // 2xl断点
    if (isMobile && mobileSidebarOpen.value) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
};

// 处理窗口大小变化
const handleResize = () => {
    // 如果切换到桌面端(>=1280px)，自动关闭侧边栏
    if (window.innerWidth >= 1280) {
        mobileSidebarOpen.value = false;
    }
    updateBodyOverflow();
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    document.body.style.overflow = ''; // 确保卸载时恢复滚动
});



const SEO = await getSeoConfig();
useHead(() => ({
    title: `${SEO.title} - 博客主页`,
    meta: [
        {
            name: 'description',
            content: `${SEO.title}博客主页，这里展示最新的博客文章。`
        },
        {
            name: 'keywords',
            content: SEO.keywords.join(', ')
        },
        { name: 'robots', content: 'index, follow' },
        // Open Graph 元数据
        { property: 'og:title', content: `${SEO.title}博客主页` },

        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `${SEO.url}` },
    ],
    link: [
        { rel: 'canonical', href: `${SEO.url}` }
    ]
}))
</script>

<style scoped>
/* 改进悬浮按钮样式 */
.floating-button {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
}

.floating-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* 调整移动端侧边栏样式 */
@media (max-width: 1279px) {
    .sidebar-content {
        width: 80%;
        max-width: 300px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }
}
</style>

