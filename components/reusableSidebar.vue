<template>
    <div>
        <!-- 移动端悬浮按钮 -->
        <button v-if="showMobileButton"
            class="fixed bottom-12 right-10 lg:hidden z-50 p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="toggleSidebar">
            <slot name="icon">
                <!-- 默认图标 -->
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="26"
                    height="26">
                    <path
                        d="M713.2405 353.93916L277.986702 549.976229l182.384676 27.869225 93.767596 307.9373 101.458091-301.481517z"
                        fill="#25B195"></path>
                    <path
                        d="M500.129121 929.032969c-4.762463-4.762463-7.937438-11.041858-8.784097-18.026802l-37.958591-318.732215-317.003617-36.335825c-13.54656-1.55221-24.517863-12.029628-26.705068-25.470356-2.187205-13.440728 4.868295-26.881455 17.21542-32.666965l719.661006-337.782065c11.641575-5.468013 25.54091-3.033865 34.642505 6.06773 9.101595 9.101595 11.535743 23.00093 6.06773 34.642505l-337.782065 719.661006c-5.78551 12.311848-19.19096 19.367348-32.59641 17.21542-6.526338-1.023048-12.311848-4.127468-16.756813-8.572433z m1.234713-384.912805c4.727185 4.727185 7.866883 10.971303 8.713542 17.991525l28.610053 240.169222L798.541496 248.706377l-552.798429 259.466014 237.452854 27.23423c7.090778 0.811383 13.40545 3.986358 18.167913 8.713543z m-24.976471 50.7996h-0.035277c0-0.035278 0.035278 0 0.035277 0zM871.953974 214.240259l-0.070555 0.035278c0.035278-0.035278 0.070555-0.035278 0.070555-0.035278z"
                        fill="currentColor"></path>
                </svg>
            </slot>
        </button>

        <!-- 外层容器 - 处理吸顶 -->
        <div class="lg:sticky lg:top-24 lg:overflow-y-auto">
            <!-- 侧边栏内容 -->
            <div :class="[
                'fixed inset-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-transform duration-300 ease-in-out',
                'lg:static lg:z-auto lg:bg-transparent lg:dark:bg-transparent lg:backdrop-blur-none lg:transform-none',
                mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            ]">
                <div class="max-w-xl mx-auto md:mx-12 lg:mx-0">
                    <div class="h-full overflow-y-auto px-6 lg:px-0">
                        <!-- 内容插槽 -->
                        <slot>

                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted, watch } from 'vue'

const props = defineProps({
    headings: {
        type: Array,
        default: () => [],
    },
    showMobileButton: {
        type: Boolean,
        default: true,
    },
    defaultActiveId: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['scroll-to-heading', 'toggle'])

// 组件状态
const mobileSidebarOpen = ref(false)
const activeHeadingId = ref(props.defaultActiveId)
const observer = ref(null)
const headingElements = ref(new Map())

// 滚动控制
const isScrolling = ref(false)
let scrollTimeout = null


watch(
    () => props.headings,
    (newHeadings) => {
        if (newHeadings.length > 0) {
            setTimeout(() => {
                setupObserver()
            }, 300)
        }
    },
    { immediate: true }
)

watch(
    () => props.defaultActiveId,
    (newId) => {
        if (newId) {
            activeHeadingId.value = newId
        }
    }
)

const toggleSidebar = () => {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
    if (mobileSidebarOpen.value) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
    emit('toggle', mobileSidebarOpen.value)
}



const setupObserver = () => {
    if (observer.value) {
        observer.value.disconnect()
        headingElements.value.clear()
    }

    const options = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1,
    }

    observer.value = new IntersectionObserver((entries) => {
        if (isScrolling.value) return

        let bestMatch = null
        let bestVisibility = 0
        let bestPosition = Infinity

        entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            const rect = entry.boundingClientRect
            const visibility = entry.intersectionRatio
            const position = rect.top

            if (
                visibility > bestVisibility ||
                (visibility === bestVisibility && Math.abs(position) < Math.abs(bestPosition))
            ) {
                bestVisibility = visibility
                bestPosition = position
                bestMatch = entry.target.id
            }
        })

        if (bestMatch && bestMatch !== activeHeadingId.value) {
            activeHeadingId.value = bestMatch
        }
    }, options)

    props.headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
            headingElements.value.set(heading.id, element)
            observer.value.observe(element)
        }
    })
}


onMounted(() => {
    window.addEventListener(
        'scroll',
        () => {
            lastScrollPosition = window.scrollY
        },
        { passive: true }
    )

    setTimeout(() => {
        setupObserver()
        if (props.headings.length > 0 && !activeHeadingId.value) {
            activeHeadingId.value = props.headings[0].id
        }
    }, 500)
})

onUnmounted(() => {
    document.body.style.overflow = ''
    window.removeEventListener('scroll', () => { })
    if (observer.value) {
        observer.value.disconnect()
    }
    clearTimeout(scrollTimeout)
})
</script>