<template>
    <div>
        <!-- 移动端悬浮按钮 -->
        <button v-if="showMobileButton"
            class="fixed bottom-12 right-10 lg:hidden z-50 px-5 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-xl flex items-center space-x-1"
            @click="toggleSidebar">
            <svg width="20" height="20" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                class="flex-shrink-0">
                <path
                    d="M7.856789 602.079857c158.044987 2.617399 316.007318 3.788341 473.882404 3.512825A56865.980269 56865.980269 0 0 1 482.519821 2.805668 3854.340592 3854.340592 0 0 0 15.975318 25.710206a3762.015283 3762.015283 0 0 0-8.118529 576.369651zM54.308735 1002.280179a3557.0913 3557.0913 0 0 0 430.653991 21.141238c-1.322475-115.702816-2.291372-231.506655-2.897506-347.406924-156.378117 0.518888-312.834296-1.653094-469.377722-6.520538a3835.297865 3835.297865 0 0 0 41.621237 332.786224zM543.62461 1022.250475c143.557453-4.059265 287.105722-16.843193 430.658583-38.360968 30.269991-177.17496 47.498906-354.267265 51.686744-531.276915a27595.367318 27595.367318 0 0 0-479.314654-6.088897c-0.298475 192.167605-1.304108 384.078063-3.030673 575.72678zM546.072108 4.07304c0.514296 124.147372 0.734709 248.18913 0.656645 372.120682 160.152682 1.235229 320.213525 5.115408 480.191713 11.649722a3611.202583 3611.202583 0 0 0-14.303856-342.218045C857.097184 22.316771 701.58235 8.467516 546.072108 4.07304z"
                    fill="#84ADDD" class="dark:fill-blue-400">
                </path>
            </svg>
            <span
                class="text-sm pt-1 font-bold text-gray-500 dark:text-gray-300 whitespace-nowrap tracking-wide leading-tight">索引</span>
        </button>
        <h3 class="text-xl mb-4 mt-10 lg:mt-0 font-semibold text-gray-700 dark:text-gray-300 pt-12 pt-3">
            本页内容
        </h3>
        <!-- 外层容器 - 处理吸顶 -->
        <div class="lg:sticky lg:top-24 lg:overflow-y-auto max-h-[calc(100vh-11rem)]">
            <!-- 侧边栏内容 -->
            <div :class="[
                'fixed inset-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-transform duration-300 ease-in-out',
                'lg:static lg:z-auto lg:bg-transparent lg:dark:bg-transparent lg:backdrop-blur-none lg:transform-none',
                mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            ]">

                <div class="h-screen lg:py-0 lg:h-auto overflow-y-auto lg:overflow-visible">
                    <h3
                        class="text-xl px-6 lg:hidden mb-4 mt-5 lg:mt-0 font-semibold text-gray-700 dark:text-gray-300 pt-12 pt-3">
                        本页内容
                    </h3>
                    <div class="mx-auto">
                        <div class="overflow-y-auto px-6 pb-20 lg:px-0 lg:pb-0">
                            <!-- 内容插槽 -->

                            <slot></slot>
                        </div>
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