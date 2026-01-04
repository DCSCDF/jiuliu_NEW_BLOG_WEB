<template>
    <ReusableSidebar :headings="headings" :default-active-id="defaultActiveId"
        @scroll-to-heading="handleScrollToHeading" @toggle="handleSidebarToggle">
        <!-- 图标插槽 -->
        <template #icon>
            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="26"
                height="26">
                <path
                    d="M713.2405 353.93916L277.986702 549.976229l182.384676 27.869225 93.767596 307.9373 101.458091-301.481517z"
                    fill="#25B195"></path>
                <path
                    d="M500.129121 929.032969c-4.762463-4.762463-7.937438-11.041858-8.784097-18.026802l-37.958591-318.732215-317.003617-36.335825c-13.54656-1.55221-24.517863-12.029628-26.705068-25.470356-2.187205-13.440728 4.868295-26.881455 17.21542-32.666965l719.661006-337.782065c11.641575-5.468013 25.54091-3.033865 34.642505 6.06773 9.101595 9.101595 11.535743 23.00093 6.06773 34.642505l-337.782065 719.661006c-5.78551 12.311848-19.19096 19.367348-32.59641 17.21542-6.526338-1.023048-12.311848-4.127468-16.756813-8.572433z m1.234713-384.912805c4.727185 4.727185 7.866883 10.971303 8.713542 17.991525l28.610053 240.169222L798.541496 248.706377l-552.798429 259.466014 237.452854 27.23423c7.090778 0.811383 13.40545 3.986358 18.167913 8.713543z m-24.976471 50.7996h-0.035277c0-0.035278 0.035278 0 0.035277 0zM871.953974 214.240259l-0.070555 0.035278c0.035278-0.035278 0.070555-0.035278 0.070555-0.035278z"
                    fill="currentColor"></path>
            </svg>
        </template>

        <!-- 内容插槽 -->
        <template #default>
            <h3 class="text-lg mb-4 mt-10 lg:mt-0 font-semibold text-gray-700 dark:text-gray-300 px-6 pt-12 pt-3 px-0">
                本页内容
            </h3>
            <nav v-if="headings.length > 0">
                <ul>
                    <li v-for="(item, index) in headings" :key="index"
                        :class="['relative transition-all duration-200 ease-in-out border-l',
                            isActive(item.id) ? 'border-blue-500 border-l-2' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400']"
                        :style="{ paddingLeft: `${item.indentLevel * 1}rem` }">
                        <a :href="`#${item.id}`" class="block py-1 flex items-center"
                            @click.prevent="() => scrollToHeading(item.id, true)"
                            :class="isActive(item.id) ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'">
                            <!-- 代码块图标（保持原样） -->
                            <span v-if="item.level === 'code'" class="mr-2 w-4 h-4"
                                :class="isActive(item.id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'">
                                <svg t="1747147233387" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="12275">
                                    <path
                                        d="M742.72 888.912H281.28a112.672 112.672 0 0 1-112.672-112.656V247.728a112.672 112.672 0 0 1 112.656-112.672h399.904L855.264 307.12v469.12a112.672 112.672 0 0 1-112.528 112.672z"
                                        fill="#42B4FA" p-id="12276"></path>
                                    <path d="M681.296 135.056v137.456a38 38 0 0 0 38 38h136.096v-3.392l-174.08-172.08z"
                                        fill="#92DBFF" p-id="12277"></path>
                                    <path
                                        d="M307.856 742.768c13.6 13.184 35.2 13.184 48.784 0l135.664-134.336a38.56 38.56 0 0 0 10.64-26.592 30.608 30.608 0 0 0-8.864-25.712L358.4 419.568a35.024 35.024 0 0 0-48.768 0 36.038 36.038 0 0 0-9.76 25.28 33.264 33.264 0 0 0 9.76 24.384l110.848 111.28L307.856 693.12a33.264 33.264 0 0 0-9.744 24.384 35.967 35.967 0 0 0 9.76 25.28z m229.232 27.504h106.848a35.472 35.472 0 0 0 0-70.944H537.088a35.472 35.472 0 0 0 0 70.944z"
                                        fill="#FFFFFF" p-id="12278"></path>
                                </svg>
                            </span>
                            <!-- 表格图标（使用您提供的样式） -->
                            <span v-if="item.level === 'table'" class="mr-2 w-4 h-4"
                                :class="isActive(item.id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'">
                                <svg t="1747148208337" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="2544">
                                    <path
                                        d="M730.4 96c64 0 116.8 52.8 116.8 118.4l-3.2 315.2c-48-44.8-110.4-70.4-176-70.4-142.4 0-257.6 116.8-257.6 259.2 0 40 9.6 80 27.2 116.8s43.2 67.2 76.8 91.2l-248 1.6c-64 0-116.8-52.8-116.8-118.4V214.4c0-65.6 51.2-118.4 116.8-118.4h464z m-313.6 336h-123.2c-8 0-16 3.2-20.8 8-3.2 3.2-4.8 6.4-6.4 9.6-1.6 3.2-1.6 8-1.6 11.2 0 3.2 0 8 1.6 11.2 1.6 3.2 3.2 6.4 6.4 9.6 4.8 8 12.8 11.2 20.8 11.2h123.2c16 0 30.4-12.8 30.4-30.4 0-16-14.4-30.4-30.4-30.4z m294.4-158.4h-417.6c-16 0-30.4 12.8-30.4 30.4 0 17.6 14.4 30.4 30.4 30.4h417.6c16 0 30.4-12.8 30.4-30.4 0-17.6-14.4-30.4-30.4-30.4z"
                                        fill="#3DD5BB" p-id="2545"></path>
                                    <path
                                        d="M670.4 512C556.8 512 464 604.8 464 720s92.8 208 206.4 208c113.6 0 206.4-92.8 206.4-208S784 512 670.4 512z m-62.592 178.528l58.224-72.384a5.536 5.536 0 0 1 8.736 0l58.24 72.384c3.2 4 0.56 10.144-4.384 10.144h-27.488v110.208c0 7.232-5.504 13.12-12.288 13.12h-36.88c-6.784 0-12.288-5.888-12.288-13.12v-110.176h-27.52c-4.912 0-7.552-6.176-4.352-10.176z"
                                        fill="#ADF0EA" p-id="2546"></path>
                                </svg>
                            </span>
                            <span class="truncate flex-1">{{ item.text }}</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <div v-else class="text-sm text-gray-500 dark:text-gray-500">
                暂无导航
            </div>
        </template>
    </ReusableSidebar>
</template>



<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
    headings: {
        type: Array,
        default: () => [],
    },
    defaultActiveId: {
        type: String,
        default: '',
    },
    showMobileButton: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['scroll-to-heading', 'toggle'])

// 状态管理
const activeHeadingIds = ref([]) // 改为数组存储所有活动ID
const mobileSidebarOpen = ref(false)
const isScrolling = ref(false)
let scrollTimeout = null

// 存储所有标题元素的DOM引用和位置信息
const headingRefs = ref([])

// 初始化标题元素引用
const initHeadingRefs = () => {
    headingRefs.value = props.headings
        .map(heading => {
            const el = document.getElementById(heading.id)
            return el ? { id: heading.id, el } : null
        })
        .filter(Boolean)

    updateHeadingPositions()
}

// 更新所有标题的位置信息
const updateHeadingPositions = () => {
    headingRefs.value.forEach(ref => {
        const rect = ref.el.getBoundingClientRect()
        ref.top = rect.top + window.scrollY
        ref.height = rect.height
        ref.bottom = ref.top + ref.height
    })
}

// 计算当前所有可见的标题
const calculateVisibleHeadings = () => {
    if (isScrolling.value || !headingRefs.value.length) return

    const scrollY = window.scrollY
    const viewportHeight = window.innerHeight

    // 计算视口的顶部和底部边界（扩大一些范围）
    const viewportTop = scrollY + viewportHeight * 0.2 // 视口上方20%
    const viewportBottom = scrollY + viewportHeight * 0.8 // 视口下方80%

    // 找出所有在视口范围内的标题
    const newActiveIds = headingRefs.value
        .filter(ref => {
            // 标题中间位置在视口范围内
            const headingCenter = ref.top + ref.height / 2
            return headingCenter >= viewportTop && headingCenter <= viewportBottom
        })
        .map(ref => ref.id)

    // 如果有可见标题，更新状态
    if (newActiveIds.length > 0) {
        activeHeadingIds.value = newActiveIds
    } else {
        // 如果没有可见标题，选择最接近视口顶部的标题
        const closest = headingRefs.value.reduce((prev, curr) => {
            return (Math.abs(curr.top - scrollY) < Math.abs(prev.top - scrollY)) ? curr : prev
        })
        activeHeadingIds.value = [closest.id]
    }
}

// 滚动到指定标题
const scrollToHeading = (id, closeOnMobile = false) => {
    const element = document.getElementById(id)
    if (element) {
        isScrolling.value = true
        // 滚动时只高亮当前点击的标题
        activeHeadingIds.value = [id]

        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })

        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
            isScrolling.value = false
            updateHeadingPositions()
        }, 1000)
    }

    emit('scroll-to-heading', { id, closeOnMobile })
    if (closeOnMobile && window.innerWidth < 1024) {
        mobileSidebarOpen.value = false
        document.body.style.overflow = ''
    }
}

// 防抖的滚动处理
let scrollDebounce = null
const handleScroll = () => {
    clearTimeout(scrollDebounce)
    scrollDebounce = setTimeout(() => {
        calculateVisibleHeadings()
    }, 50)
}

// 处理侧边栏切换
const handleSidebarToggle = (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
}

// 处理滚动到标题事件
const handleScrollToHeading = ({ id }) => {
    scrollToHeading(id)
}

// 判断是否高亮
const isActive = (id) => {
    return activeHeadingIds.value.includes(id)
}

// 监听props变化
watch(() => props.headings, (newHeadings) => {
    if (newHeadings.length > 0) {
        nextTick(() => {
            initHeadingRefs()
        })
    }
}, { immediate: true })

watch(() => props.defaultActiveId, (newId) => {
    if (newId) {
        activeHeadingIds.value = [newId]
    }
})

// 生命周期钩子
onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateHeadingPositions)

    nextTick(() => {
        initHeadingRefs()
        if (props.headings.length > 0 && activeHeadingIds.value.length === 0) {
            activeHeadingIds.value = [props.headings[0].id]
        }
    })
})

onUnmounted(() => {
    document.body.style.overflow = ''
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', updateHeadingPositions)
    clearTimeout(scrollTimeout)
    clearTimeout(scrollDebounce)
})
</script>