<template>
    <div class="min-h-screen bg-white/50 md:mx-10 xl:mx-40">
        <div class="flex flex-col min-h-screen">
            <appheader></appheader>
            <div class=" mx-4 lg:mx-10">
                <section class=" max-w-4xl mx-auto  rounded-2xl md:px-5 px-1 py-10">
                    <div class="mx-auto">
                        <div class="flex  justify-center">
                            <div class="flex flex-col">
                                <h1
                                    class="flex justify-center text-2xl mx-2 mt-10 font-semibold text-gray-800 capitalize lg:text-3xl ">
                                    留言
                                </h1>
                                <!-- <div class="mt-2 mx-2 flex justify-center">
                                <span class="inline-block w-30 h-1 bg-blue-500 rounded-full"></span>
                                <span class="inline-block w-3 h-1 ml-1 bg-blue-500 rounded-full"></span>
                                <span class="inline-block w-1 h-1 ml-1 bg-blue-500 rounded-full"></span>
                            </div> -->
                                <p class="flex justify-center mt-2 mx-2 text-sm text-gray-700 ">
                                    良言一句三冬暖，恶语伤人六月寒。</p>
                            </div>
                        </div>
                        <div class="my-10 border-b border-gray-200"></div>
                        <div class="md:mx-10 mx-3 mt-10">
                            <div id="tcomment"></div>
                        </div>
                    </div>
                </section>
            </div>


        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, watch, computed } from 'vue'


useHead(() => ({
    title: `${SEO.title} - 留言`,
    meta: [
        {
            name: 'description',
            content: '留言页面，这里展示网站的留言板。'
        },
        {
            name: 'keywords',
            content: SEO.keywords.join(', ')
        },
        { name: 'author', content: '久流' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph 元数据
        { property: 'og:title', content: `${SEO.title}博客留言` },
        {
            property: 'og:description',
            content: `${SEO.title}博客网站留言页面`
        },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `${SEO.url}/guestbook` },
    ],
    link: [
        { rel: 'canonical', href: `${SEO.url}/guestbook` }
    ]
}))


onMounted(async () => {
    // 动态加载twikoo CDN
    const loadTwikoo = () => new Promise((resolve, reject) => {
        if (window.twikoo) return resolve();

        const script = document.createElement('script');
        script.src = commentConfig.scriptUrl;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    // 初始化评论
    const init = async () => {
        try {
            await loadTwikoo();
            twikoo.init({
                envId: commentConfig.apiEndpoint,
                el: `#tcomment`,
                path: "comments",
            });
        } catch (err) {
            console.error('评论初始化失败:', err);
        }
    };

    init();
});
</script>
