<script setup>
import Index from '~/pages/index.vue';

const route = useRoute();
const page = computed(() => parseInt(route.params.page) || 1);

// 提供默认值
const defaultData = {
    blogs: [],
    categories: [],
    totalCount: 0
};

// SSR数据获取
const { data } = await useAsyncData(`blog-page-${page.value}`, async () => {
    try {
        const blogApi = new (await import('../utils/blogapi')).default();
        const categoryService = new (await import('../utils/category')).default();

        const [blogsResult, categoriesResult] = await Promise.all([
            blogApi.searchBlogs({
                page: page.value,
                pageSize: 6
            }),
            categoryService.getCategoryList()
        ]);

        return {
            blogs: blogsResult?.code === 200 ? blogsResult.data?.rows || [] : [],
            categories: categoriesResult?.data || [],
            totalCount: blogsResult?.code === 200 ? blogsResult.data?.count || 0 : 0
        };
    } catch (err) {
        console.error('SSR数据获取失败:', err);
        return defaultData; // 返回默认值
    }
});

// 确保data不为undefined
const pageData = computed(() => data.value || defaultData);
</script>

<template>
    <Index :page="page" :initial-data="pageData" />
</template>