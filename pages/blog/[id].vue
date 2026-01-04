<template>
    <div class="flex flex-col min-h-screen h-full bg-white/50 dark:bg-gray-800/60 md:mx-10 xl:mx-40">
        <div class="flex flex-col min-h-screen h-full">
            <appheader></appheader>

            <div class="w-full h-10"></div>

            <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-18">
                <!-- 面包屑导航 -->
                <div class="flex flex-col lg:flex-row gap-20 py-8">
                    <router-link to="/"
                        class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mb-1 transform transition-transform"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="group-hover:underline">返回主页</span>
                    </router-link>
                </div>

                <!-- 主内容区域 -->

                <div class="flex flex-col lg:flex-row lg:gap-8">
                    <!-- 文章内容区域 -->
                    <div class="w-full lg:w-3/4">
                        <!-- 文章标题区域 -->
                        <div class="mb-8" v-if="!blogDetail">
                            <div class="h-12 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                            <div class="flex items-center space-x-4">
                                <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                <div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <div class="mb-8" v-else>
                            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                {{ blogDetail.title || "null" }}
                            </h1>
                            <div class="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <span>{{ formatDate(blogDetail.create_time) || "null" }}</span>
                                <span class="mx-2 dark:text-gray-600">•</span>
                                <span
                                    class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                                    {{ getCategoryName(blogDetail.category_id) }}
                                </span>
                            </div>
                        </div>
                        <div class="my-1 border-b border-gray-300 dark:border-gray-700"></div>
                        <!-- 文章内容 -->
                        <div v-if="!blogDetail" class="space-y-4">
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                        </div>
                        <div v-else>
                            <article class="prose prose-lg max-w-none dark:prose-invert
                prose-headings:font-serif prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:border-b prose-h1:pb-4 prose-h1:border-gray-200 dark:prose-h1:border-gray-700
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-4
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
                prose-blockquote:pl-4
                prose-blockquote:italic
                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                prose-li:text-gray-700 dark:prose-li:text-gray-300
                prose-li:my-1
                break-words hyphenate  
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300
                prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-8
                prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-gray-700 dark:prose-code:text-gray-300
                prose-pre:rounded-xl prose-pre:p-4 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-700 dark:prose-pre:text-gray-300
                prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap prose-pre:word-break-break-word 
                prose-table:rounded-lg prose-table:shadow-sm prose-table:overflow-hidden
                prose-table:border-collapse prose-table:w-full prose-table:my-6
                prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-700
                prose-th:p-3 prose-th:text-left prose-th:border-b prose-th:border-gray-200 dark:prose-th:border-gray-700 
                prose-th:bg-gray-900/5 dark:prose-th:bg-gray-800/30 prose-th:text-gray-700 dark:prose-th:text-gray-300
                prose-td:p-3 prose-td:border-b prose-td:border-gray-200 dark:prose-td:border-gray-700 
                prose-td:bg-gray-50/60 dark:prose-td:bg-gray-800/20 prose-td:text-gray-700 dark:prose-td:text-gray-300
                line-numbers" v-html="blogDetail.content" ref="articleContent">
                            </article>
                        </div>
                    </div>

                    <!-- 右侧目录区域 -->
                    <div class="mb-0 lg:mb-10 lg:w-1/4 lg:sticky lg:top-24 lg:self-start lg:overflow-y-auto">
                        <ArticleToc :headings="headings" @scroll-to-heading="handleScrollToHeading" />
                    </div>
                </div>
                <div class="my-5 border-b border-gray-300 dark:border-gray-700"></div>

                <!-- 评论区域 -->
                <div class="my-10 max-w-4xl mx-auto">
                    <div id="tcomment" class="" v-show="shouldShowComments">
                        <div v-if="commentLoading" class="comment-loading">
                            <p class="mt-2 text-gray-600 dark:text-gray-400">评论系统加载中...</p>
                        </div>
                    </div>
                    <p v-if="commentError" class="comment-error text-gray-600 dark:text-gray-400">
                        {{ commentError }}
                    </p>
                    <div v-if="error" class="text-center py-8 text-gray-500 dark:text-gray-400">
                        评论功能暂不可用（内容加载失败）
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import BlogApi from '../utils/blogapi'
import CategoryService from '../utils/category'
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";

const route = useRoute()
const articleContent = ref(null)
const headings = ref([])
const blogId = route.params.id // 现在从路径参数获取

const { data: blogDetail, error } = await useAsyncData('blog', async () => {
    if (!blogId) {
        throw createError({ statusCode: 404, statusMessage: '文章不存在' })
    }

    try {
        const blogApi = new BlogApi()
        const result = await blogApi.getBlogDetail(blogId)
        return result.data || null
    } catch (err) {
        console.error('获取博客详情失败:', err)
        throw createError({ statusCode: 500, statusMessage: '获取文章内容失败' })
    }
})


// 分类数据
const { data: categories } = await useAsyncData('categories', async () => {
    try {
        const categoryService = new CategoryService()
        const result = await categoryService.getCategoryList()
        return result.data || []
    } catch (error) {
        console.error('获取分类列表失败:', error)
        return []
    }
})

// 响应式状态
const commentLoading = ref(false)
const commentError = ref(null)
const shouldShowComments = ref(true)


/**
 * 提取文章标题并自动计算缩进
 */
const extractHeadings = () => {
    if (!articleContent.value || !blogDetail.value?.content) return;

    // 可配置参数
    const config = {
        baseIndent: 0.25,
        minIndentLevel: 1,
        globalOffset: 0,
        debug: false,            // 调试模式
        elementText: {
            'code': '代码块',
            'table': '表格'
        }
    };

    // 获取所有需要显示在导航中的元素
    const elements = Array.from(articleContent.value.querySelectorAll('h1, h2, h3, h4, h5, h6, pre, table'));

    // 处理每个元素
    const processedElements = [];
    const stack = [];
    let lastProcessedLevel = 0;

    elements.forEach((el, index) => {
        const tagName = el.tagName.toLowerCase();
        const isHeading = tagName.startsWith('h');
        const type = isHeading ? tagName : (tagName === 'pre' ? 'code' : 'table');

        // 确保id存在
        if (!el.id) {
            el.id = `${type}-${index}`;
        }

        // 处理文本内容
        let text = el.textContent.trim();
        if (!isHeading) {
            text = config.elementText[type] || type;
            text = text.substring(0, 30) + (text.length > 30 ? '...' : '');
        }

        // 自动计算缩进级别
        let indentLevel = config.minIndentLevel;

        if (isHeading) {
            const currentLevel = parseInt(tagName.substring(1));

            // 根据标题级别自动计算缩进
            if (currentLevel > lastProcessedLevel) {
                // 子级标题：缩进+1
                indentLevel = stack.length > 0 ? stack[stack.length - 1].indentLevel + 1 : config.minIndentLevel;
            } else if (currentLevel === lastProcessedLevel) {
                // 同级标题：保持相同缩进
                indentLevel = stack.length > 0 ? stack[stack.length - 1].indentLevel : config.minIndentLevel;
            } else {
                // 回退到更高级别标题
                while (stack.length > 0 && stack[stack.length - 1].hierarchyLevel >= currentLevel) {
                    stack.pop();
                }
                indentLevel = stack.length > 0 ? stack[stack.length - 1].indentLevel + 1 : config.minIndentLevel;
            }

            // 创建标题对象
            const heading = {
                id: el.id,
                text: text,
                level: type,
                element: el,
                hierarchyLevel: currentLevel,
                // 保留原始缩进级别
                indentLevel: Math.max(indentLevel, config.minIndentLevel),
                // 添加整体偏移计算
                styleIndent: `${(Math.max(indentLevel, config.minIndentLevel) + config.globalOffset) * config.baseIndent}rem`,
                debug: config.debug ? {
                    originalIndent: indentLevel,
                    calculatedIndent: Math.max(indentLevel, config.minIndentLevel),
                    globalOffset: config.globalOffset,
                    finalIndent: (Math.max(indentLevel, config.minIndentLevel) + config.globalOffset) * config.baseIndent,
                    stackDepth: stack.length
                } : undefined
            };

            processedElements.push(heading);
            stack.push(heading);
            lastProcessedLevel = currentLevel;
        } else {
            // 处理代码块和表格 - 缩进级别跟随最近的标题
            let indentLevel = stack.length > 0 ? stack[stack.length - 1].indentLevel + 1 : config.minIndentLevel;

            processedElements.push({
                id: el.id,
                text: text,
                level: type,
                element: el,
                hierarchyLevel: stack.length > 0 ? stack[stack.length - 1].hierarchyLevel : 1,
                // 保留原始缩进级别
                indentLevel: Math.max(indentLevel, config.minIndentLevel),
                // 添加整体偏移计算
                styleIndent: `${(Math.max(indentLevel, config.minIndentLevel) + config.globalOffset) * config.baseIndent}rem`,
                debug: config.debug ? {
                    originalIndent: indentLevel,
                    calculatedIndent: Math.max(indentLevel, config.minIndentLevel),
                    globalOffset: config.globalOffset,
                    finalIndent: (Math.max(indentLevel, config.minIndentLevel) + config.globalOffset) * config.baseIndent,
                    stackDepth: stack.length,
                    parentTitle: stack.length > 0 ? stack[stack.length - 1].text : '无'
                } : undefined
            });
        }
    });

    if (config.debug) {
        console.groupCollapsed('目录结构调试信息');
        console.log('配置参数:', config);
        console.log('处理后的目录项:', processedElements);
        console.groupEnd();

        // 打印缩进预览
        console.log('缩进预览:');
        processedElements.forEach(item => {
            const indent = '  '.repeat(item.indentLevel);
            console.log(`${indent}${item.text} (${item.level}, 逻辑缩进:${item.indentLevel}, 实际缩进:${item.styleIndent})`);
        });
    }

    headings.value = processedElements;
};

// 组件卸载时恢复页面滚动
onUnmounted(() => {
    if (import.meta.client) {
        document.body.style.overflow = ''
    }
})

const handleScrollToHeading = ({ id, closeOnMobile }) => {
    const maxAttempts = 3;
    const attempt = (currentAttempt = 1) => {
        const element = document.getElementById(id);
        if (element) {
            const header = document.querySelector('appheader');
            const offset = (header?.offsetHeight || 100) + 20;
            const targetPos = element.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });

            if (closeOnMobile && window.innerWidth < 1024) {
                // 处理移动端关闭侧边栏
            }
        } else if (currentAttempt < maxAttempts) {
            setTimeout(() => attempt(currentAttempt + 1), 300 * currentAttempt);
        }
    };
    attempt();
};


/**
 * 根据分类ID获取分类名称
 */
const getCategoryName = (categoryId) => {
    if (!categoryId) return '未分类'
    const category = categories.value?.find(c => c.id === categoryId)
    return category ? category.name : '未分类'
}

/**
 * 格式化日期
 */
const formatDate = (timestamp) => {
    if (!timestamp) return '未知日期'
    const date = new Date(timestamp)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

/**
 * 安全的高亮函数
 */
const safeHighlight = async () => {
    if (import.meta.client) {
        try {
            await nextTick()

            // 确保所有代码块都有正确的类
            document.querySelectorAll('pre code').forEach((code) => {
                if (!code.className.includes('language-')) {
                    code.classList.add('language-none')
                }
            })

            // 应用Prism高亮
            Prism.highlightAll()

            // 强制设置代码块样式
            document.querySelectorAll('pre[class*="language-"]').forEach((el) => {
                el.style.whiteSpace = 'pre';
                el.style.overflowX = 'auto';
                // 确保滚动条始终可见
                el.style.scrollbarWidth = 'thin';
                el.style.paddingBottom = '12px';

                const code = el.querySelector('code');
                if (code) {
                    code.style.whiteSpace = 'pre';
                    code.style.minWidth = '100%';
                }
            });
        } catch (err) {
            console.error('代码高亮失败:', err)
        }
    }
}
/**
 * 初始化评论系统
 */
const initComments = async () => {
    if (!import.meta.client) return

    try {
        commentLoading.value = true
        commentError.value = null

        const { setupCommentSystem } = await import('../utils/commentapi')
        await nextTick()

        const blogId = route.query.id || route.params.id
        if (blogId) {
            nextTick(() => {
                setupCommentSystem('tcomment', blogId)
            })
        }
    } catch (err) {
        console.error('评论系统初始化失败:', err)
        commentError.value = '评论系统初始化失败，请稍后再试'
    } finally {
        commentLoading.value = false
    }
}

/**
 * 截取描述文本
 */
const truncateDescription = (content, maxLength = 160) => {
    if (!content) return '技术博客文章详情页'
    const plainText = content.replace(/<[^>]*>/g, '')
    return plainText.length > maxLength
        ? plainText.substring(0, maxLength) + '...'
        : plainText
}

// 客户端初始化
onMounted(() => {
    if (import.meta.client) {
        safeHighlight()
        initComments()

        // 等待内容渲染完成后再提取标题
        nextTick(() => {
            extractHeadings()

            // 添加MutationObserver来监听内容变化
            const observer = new MutationObserver(() => {
                extractHeadings()
            })

            if (articleContent.value) {
                observer.observe(articleContent.value, {
                    childList: true,
                    subtree: true
                })
            }
        })
    }
})

const SEO = await getSeoConfig();
// SEO 设置
useHead(() => {
    const title = blogDetail.value?.title
        ? `${blogDetail.value.title} - ${SEO.title}`
        : SEO.title

    const description = blogDetail.value?.description ||
        truncateDescription(blogDetail.value?.content)

    const keywords = blogDetail.value?.keywords || SEO.keywords.join(', ')
    const url = `${SEO.url}${route.fullPath}`
    const publishedTime = blogDetail.value?.create_time
        ? new Date(blogDetail.value.create_time).toISOString()
        : new Date().toISOString()

    return {
        title,
        meta: [
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },
            { name: 'robots', content: 'index, follow' },
            // Open Graph / Facebook
            { property: 'og:type', content: 'article' },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:url', content: url },
            { property: 'article:published_time', content: publishedTime },
        ],
        link: [
            { rel: 'canonical', href: url }
        ],
    }
})
</script>

<style scoped>
.highlight {
    animation: highlight-fade 2s ease-out;
}

@keyframes highlight-fade {
    0% {
        background-color: rgba(59, 130, 246, 0.2);
    }

    100% {
        background-color: transparent;
    }
}

.sidebar-transition {
    transition: transform 0.3s ease-in-out;
}

/* 调整移动端侧边栏样式 */
@media (max-width: 1023px) {
    .sidebar-content {
        width: 80%;
        max-width: 300px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }
}

/* 改进悬浮按钮样式 */
.floating-button {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
}

.floating-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}


/* 加载动画 */
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

/* 评论区域样式 */
#tcomment {
    min-height: 200px;
}

.prose .w-e-text-container * {
    all: revert !important;
}
</style>