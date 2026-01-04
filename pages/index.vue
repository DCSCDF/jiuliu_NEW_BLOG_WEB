<template>
    <div class="flex flex-col min-h-screen h-full bg-white/50 md:mx-10 xl:mx-40">
        <div class="flex-1">
            <appheader></appheader>
            <Heros></Heros>
            <div class="container md:px-6 py-5 mx-auto">
                <div class="flex 2xl:flex-row flex-col-reverse">
                    <div class="2xl:w-4/5">
                        <div class="m-4">
                            <Blogcard :search-keyword="searchKeyword"></Blogcard>
                        </div>
                    </div>
                    <div class="2xl:w-1/2 flex flex-col">
                        <div class="mx-3 2xl:mr-20">
                            <Sidebar @search="handleSearch"></Sidebar>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

useHead(() => ({
    title: `${SEO.title} - 博客主页`,
    meta: [
        {
            name: 'description',
            content: '久流的个人博客网站主页，这是一个专注于分享优质内容的技术博客，致力于提供有价值的信息和资源。'
        },
        {
            name: 'keywords',
            content: SEO.keywords.join(', ')
        },
        { name: 'author', content: '久流' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph 元数据
        { property: 'og:title', content: `${SEO.title}博客主页` },
        {
            property: 'og:description',
            content: '久流的个人博客网站主页，这是一个专注于分享优质内容的技术博客，致力于提供有价值的信息和资源。'
        },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `${SEO.url}` },
    ],
    link: [
        { rel: 'canonical', href: `${SEO.url}` }
    ]
}))


// 搜索关键词状态
const searchKeyword = ref('');

// 处理搜索事件
const handleSearch = (keyword) => {
    searchKeyword.value = keyword;
};
</script>