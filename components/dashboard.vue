<template>
    <h2 class="text-2xl font-semibold mb-4">欢迎回来</h2>
    <p class="text-gray-600 mb-6">这里是你的仪表盘内容区域。</p>

    <!-- 卡片网格 - 修改为自适应布局 -->
    <div class="dashboard-grid">
        <transition-group enter-active-class="transition-all duration-500 ease-out"
            leave-active-class="transition-all duration-300 ease-in" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95">
            <!-- 文章统计卡片 -->
            <div key="posts" class="dashboard-card bg-gradient-to-br from-blue-50 to-white border border-blue-100"
                @mouseenter="hoverCard(0)" @mouseleave="unhoverCard(0)">
                <div class="flex items-center mb-4">
                    <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 transform transition-transform duration-300"
                        :class="{ 'scale-110': cardHover === 0 }">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium">文章统计</h3>
                </div>
                <div v-if="stats.posts">
                    <p class="text-gray-600">总文章数: {{ stats.posts.total }}</p>
                    <p class="text-gray-600">今日新增: {{ stats.posts.todayAdded }}</p>
                    <p class="text-gray-600">本周新增: {{ stats.posts.weekAdded }}</p>
                </div>
                <p v-else class="text-gray-600">加载中...</p>
            </div>

            <!-- 分类统计卡片 -->
            <div key="categories"
                class="dashboard-card bg-gradient-to-br from-green-50 to-white border border-green-100"
                @mouseenter="hoverCard(1)" @mouseleave="unhoverCard(1)">
                <div class="flex items-center mb-4">
                    <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4 transform transition-transform duration-300"
                        :class="{ 'scale-110': cardHover === 1 }">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium">分类统计</h3>
                </div>
                <div v-if="stats.categories">
                    <p class="text-gray-600">总分类数: {{ stats.categories.total }}</p>
                    <p class="text-gray-600">最多文章的分类: {{ stats.categories.mostPopular?.name || '无' }}</p>
                    <p class="text-gray-600">未分类文章: {{ stats.categories.uncategorizedPosts }}</p>
                </div>
                <p v-else class="text-gray-600">加载中...</p>
            </div>

            <!-- 评论统计卡片
            <div key="comments"
                class="dashboard-card bg-gradient-to-br from-purple-50 to-white border border-purple-100"
                @mouseenter="hoverCard(2)" @mouseleave="unhoverCard(2)">
                <div class="flex items-center mb-4">
                    <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4 transform transition-transform duration-300"
                        :class="{ 'scale-110': cardHover === 2 }">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5. 2.25 6.741v6.018z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium">评论统计</h3>
                </div>
                <div v-if="stats.comments">
                    <p class="text-gray-600">总评论数: {{ stats.comments.total }}</p>
                    <p class="text-gray-600">今日新增: {{ stats.comments.todayAdded }}</p>
                    <p class="text-gray-600">待审核: {{ stats.comments.pendingReview }}</p>
                </div>
                <p v-else class="text-gray-600">加载中...</p>
            </div> -->
        </transition-group>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BlogApi from '../utils/blogapi';
import CategoryService from '../utils/category';

const blogApi = new BlogApi();
const categoryService = new CategoryService();

const cardHover = ref(null);
const stats = ref({
    posts: null,
    categories: null,
    comments: null
});

const hoverCard = (index) => {
    cardHover.value = index;
};

const unhoverCard = () => {
    cardHover.value = null;
};

// 获取文章统计数据
const fetchPostStats = async () => {
    try {
        const postStats = await blogApi.getPostStats();
        stats.value.posts = {
            total: postStats.total || 0,
            todayAdded: postStats.todayAdded || 0,
            weekAdded: postStats.weekAdded || 0
        };
    } catch (error) {
        console.error('获取文章统计失败:', error);
        stats.value.posts = {
            total: 'N/A',
            todayAdded: 'N/A',
            weekAdded: 'N/A'
        };
    }
};

// 获取分类统计数据
const fetchCategoryStats = async () => {
    try {
        // 获取分类列表
        const result = await categoryService.getCategoryList();
        const categories = result.data || [];

        // 找出文章最多的分类
        let mostPopular = null;
        if (categories.length > 0) {
            mostPopular = categories.reduce((prev, current) =>
                (prev.blog_count > current.blog_count) ? prev : current
            );
        }

        // 计算已分类文章总数
        const categorizedPosts = categories.reduce((sum, category) =>
            sum + (category.blog_count || 0), 0
        );

        // 获取总文章数
        const postStats = await blogApi.getPostStats();
        const totalPosts = postStats.total || 0;

        // 计算未分类文章数 = 总文章数 - 已分类文章数
        const uncategorizedPosts = Math.max(0, totalPosts - categorizedPosts);

        stats.value.categories = {
            total: categories.length,
            mostPopular: mostPopular ? {
                name: mostPopular.name,
                count: mostPopular.blog_count
            } : null,
            uncategorizedPosts
        };
    } catch (error) {
        console.error('获取分类统计失败:', error);
        stats.value.categories = {
            total: 'N/A',
            mostPopular: null,
            uncategorizedPosts: 'N/A'
        };
    }
};

// 获取评论统计数据
const fetchCommentStats = async () => {
    try {
        // 这里假设有评论API服务，暂时保留模拟数据
        stats.value.comments = {
            total: 'N/A',
            todayAdded: 'N/A',
            pendingReview: 'N/A'
        };
    } catch (error) {
        console.error('获取评论统计失败:', error);
        stats.value.comments = {
            total: 'N/A',
            todayAdded: 'N/A',
            pendingReview: 'N/A'
        };
    }
};

onMounted(async () => {
    await Promise.all([
        fetchPostStats(),
        fetchCategoryStats(),
        fetchCommentStats()
    ]);
});
</script>

<style scoped>
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    width: 100%;
}

.dashboard-card {
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    height: 100%;
}

.dashboard-card:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@media (max-width: 640px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
}
</style>