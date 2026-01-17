<template>
    <div class="flex flex-col min-h-screen h-full bg-white/40">
        <!-- 移动端顶部导航栏 -->
        <div
            class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300">
            <div class="flex items-center justify-between p-4">
                <h1 class="text-xl font-semibold transform transition-transform duration-300 hover:scale-105">
                    后台管理
                </h1>
                <!-- 移动端菜单按钮 -->
                <button @click="toggleMobileMenu"
                    class="p-2 rounded-md hover:bg-gray-100 focus:outline-none transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 text-gray-600 transform transition-transform duration-300"
                        :class="{ 'rotate-90': showMobileMenu }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <!-- 移动端下拉菜单 -->
            <transition enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-screen" leave-from-class="opacity-100 max-h-screen"
                leave-to-class="opacity-0 max-h-0">
                <div v-if="showMobileMenu" class="px-4 pb-4 bg-white/95 overflow-hidden">
                    <nav>
                        <ul class="space-y-1">
                            <li v-for="(item, index) in allMenuItems" :key="index">
                                <template v-if="item.type === 'divider'">
                                    <div class="border-t border-gray-200 my-4"></div>
                                </template>
                                <template v-else>
                                    <a v-if="item.route" href="#"
                                        class="flex items-center p-3 rounded-lg transition-all duration-300 transform hover:translate-x-1"
                                        :class="{
                                            'bg-blue-50 text-blue-600': activeRoute === item.route,
                                            'text-gray-700 hover:bg-blue-50 hover:text-blue-600': activeRoute !== item.route
                                        }" @click="handleMenuItemClick(item)">
                                        <!-- 外部组件调用注释 -->
                                        <!-- <component :is="item.icon" v-if="item.icon" class="h-5 w-5 mr-3" /> -->
                                        <span>{{ item.name }}</span>
                                        <span v-if="item.badge"
                                            class="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {{ item.badge }}
                                        </span>
                                    </a>
                                    <button v-else-if="item.action"
                                        class="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-1"
                                        @click="handleMenuItemClick(item)">
                                        <!-- 外部组件调用注释 -->
                                        <!-- <component :is="item.icon" v-if="item.icon" class="h-5 w-5 mr-3" /> -->
                                        <span>{{ item.name }}</span>
                                    </button>
                                </template>
                            </li>
                        </ul>
                    </nav>
                </div>
            </transition>
        </div>

        <div class="flex-1 pt-16 lg:pt-0">
            <!-- 背景渐变 -->
            <div
                class="fixed inset-0 -z-50 bg-[length:200%_200%] animate-gradient mask-gradient bg-gradient-to-tr from-[rgba(59,130,246,0.4)] via-[rgba(255,255,255,0.7)] to-[rgba(59,130,246,0.7)]">
            </div>

            <!-- 桌面端侧边栏导航 -->
            <aside
                class="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-white/60 shadow-lg backdrop-blur-sm transition-all duration-500 ease-in-out"
                :class="{ 'translate-x-0': sidebarVisible, '-translate-x-full': !sidebarVisible }">
                <!-- 侧边栏头部 -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-800 transform transition-transform duration-300">
                        后台管理</h2>
                    <button @click="toggleSidebar"
                        class="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-gray-500 transform transition-transform duration-300"
                            :class="{ 'rotate-180': !sidebarVisible }" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>

                <!-- 导航菜单 -->
                <nav class="p-4">
                    <ul class="space-y-2">
                        <li v-for="(item, index) in allMenuItems" :key="index">
                            <template v-if="item.type === 'divider'">
                                <div class="border-t border-gray-200 my-4"></div>
                            </template>
                            <template v-else>
                                <a v-if="item.route" href="#"
                                    class="flex items-center p-3 rounded-lg transition-all duration-300 transform hover:translate-x-2"
                                    :class="{
                                        'bg-blue-50 text-blue-600': activeRoute === item.route,
                                        'text-gray-700 hover:bg-blue-50 hover:text-blue-600': activeRoute !== item.route
                                    }" @click="handleMenuItemClick(item)">
                                    <!-- 外部组件调用注释 -->
                                    <!-- <component :is="item.icon" v-if="item.icon" 
                                        class="h-5 w-5 mr-3 transition-transform duration-300"
                                        :class="{ 'scale-125': activeRoute === item.route }" /> -->
                                    <span>{{ item.name }}</span>
                                    <span v-if="item.badge"
                                        class="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {{ item.badge }}
                                    </span>
                                </a>
                                <button v-else-if="item.action"
                                    class="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2"
                                    @click="handleMenuItemClick(item)">
                                    <!-- 外部组件调用注释 -->
                                    <!-- <component :is="item.icon" v-if="item.icon"
                                        class="h-5 w-5 mr-3 transition-transform duration-300" /> -->
                                    <span>{{ item.name }}</span>
                                </button>
                            </template>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- 主内容区域 -->
            <main class="transition-all duration-500 ease-in-out"
                :class="{ 'lg:ml-64': sidebarVisible, 'lg:ml-20': !sidebarVisible }">
                <!-- 侧边栏切换按钮 (当侧边栏隐藏时显示) -->
                <button v-if="!sidebarVisible" @click="toggleSidebar"
                    class="fixed lg:block hidden left-4 top-4 z-30 p-2 rounded-md bg-white/80 shadow-sm hover:bg-gray-100 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                </button>

                <!-- 动态内容区域 -->
                <div class="px-2 py-6 md:p-6">
                    <transition enter-active-class="transition-all duration-500 ease-out"
                        leave-active-class="transition-all duration-300 ease-in"
                        enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
                        <!-- 主页内容 -->
                        <div>
                            <div v-if="activeRoute === 'home' && contentLoaded"
                                class="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
                                <!-- 外部组件调用注释 -->
                                <!-- <dashboard></dashboard> -->
                                <h2 class="text-2xl font-semibold mb-4">仪表盘</h2>
                                <p class="text-gray-600">这里是仪表盘内容</p>
                            </div>

                            <div v-if="activeRoute === 'posts' && contentLoaded"
                                class="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
                                <!-- 外部组件调用注释 -->
                                <!-- <posts></posts> -->
                                <h2 class="text-2xl font-semibold mb-4">文章管理</h2>
                                <p class="text-gray-600">这里是文章管理内容</p>
                            </div>

                            <!-- 分类管理内容 -->
                            <div v-if="activeRoute === 'categories' && contentLoaded"
                                class="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
                                <!-- 外部组件调用注释 -->
                                <!-- <category></category> -->
                                <h2 class="text-2xl font-semibold mb-4">分类管理</h2>
                                <p class="text-gray-600">这里是分类管理内容</p>
                            </div>

                            <!-- 链接管理内容 -->
                            <div v-if="activeRoute === 'links' && contentLoaded"
                                class="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
                                <!-- 外部组件调用注释 -->
                                <!-- <links></links> -->
                                <h2 class="text-2xl font-semibold mb-4">链接管理</h2>
                                <p class="text-gray-600">这里是链接管理内容</p>
                            </div>

                            <div v-if="activeRoute === 'settings' && contentLoaded"
                                class="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
                                <!-- 外部组件调用注释 -->
                                <!-- <settings></settings> -->
                                <h2 class="text-2xl font-semibold mb-4">设置</h2>
                                <p class="text-gray-600">这里是设置内容</p>
                            </div>
                        </div>
                    </transition>
                </div>
            </main>
        </div>

        <!-- 外部组件调用注释 -->
        <!-- <n-modal v-model:show="showLogoutConfirm" preset="dialog" content="您确定要退出登录吗？" positive-text="确认"
            negative-text="取消" @positive-click="confirmLogout" @negative-click="cancelLogout" /> -->

        <!-- 替代确认对话框 -->
        <div v-if="showLogoutConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                <h3 class="text-lg font-semibold mb-4">确认登出</h3>
                <p class="text-gray-600 mb-6">您确定要退出登录吗？</p>
                <div class="flex justify-end space-x-3">
                    <button @click="cancelLogout"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                        取消
                    </button>
                    <button @click="confirmLogout"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                        确认
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminService from '../../../utils/api/user/userApi' // 注意：导入的是类，不是单例


const runtimeconfig = useRuntimeConfig()

const API_BASE_URL = runtimeconfig.public.apiBaseUrl
console.log("传入的API_BASE_URL:", API_BASE_URL)


const adminService = new AdminService(API_BASE_URL)

// 状态管理
const showMobileMenu = ref(false)
const sidebarVisible = ref(true)
const activeRoute = ref('home')
const contentLoaded = ref(false)
const showLogoutConfirm = ref(false)
const logoutPending = ref(false)

// 菜单项配置
const menuItems = ref([
    { name: '仪表盘', route: 'home', mobileShow: true },
    { name: '文章管理', route: 'posts', mobileShow: true },
    { name: '分类管理', route: 'categories', mobileShow: true },
    { name: '友链管理', route: 'links', mobileShow: true },
    { name: '设置', route: 'settings', mobileShow: true },
    { type: 'divider' },
    { name: '返回主页', action: 'goHome', mobileShow: true },
    { name: '登出', action: 'logout', mobileShow: true }
])

const allMenuItems = computed(() => {
    if (import.meta.server) return menuItems.value
    if (typeof window !== 'undefined') {
        return menuItems.value.filter(item => {
            if (window.innerWidth < 1024) {
                return item.mobileShow !== false
            }
            return true
        })
    }
    return menuItems.value
})

const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value
}

const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value
}

const navigateTo = (route) => {
    activeRoute.value = route
    showMobileMenu.value = false
}

const handleMenuItemClick = (item) => {
    if (item.route) {
        navigateTo(item.route)
    } else if (item.action === 'logout') {
        handleLogout()
    } else if (item.action === 'goHome') {
        window.location.href = '/'
    }
}

const handleLogout = () => {
    showLogoutConfirm.value = true
}

const confirmLogout = async () => {
    try {
        logoutPending.value = true
        await adminService.logout()
    } catch (error) {
        console.error('登出过程中发生错误:', error)
        adminService.clearUserData()
        if (typeof window !== 'undefined') {
            window.location.href = '/user'
        }
    } finally {
        logoutPending.value = false
        showLogoutConfirm.value = false
    }
}

const cancelLogout = () => {
    showLogoutConfirm.value = false
}

// 检查登录状态
onMounted(async () => {
    if (import.meta.server) return

    try {
        const status = await adminService.checkLoginStatus()

        if (!status.isLoggedIn) {

            showError({
                statusCode: 403,
                statusMessage: '登录已失效，请重新登录',
                message: '您没有权限访问管理后台，请先登录。',
                fatal: false
            })
            return
        }

        setTimeout(() => {
            contentLoaded.value = true
        }, 300)

    } catch (error) {
        console.error('初始化认证失败:', error)

        // 也可以统一走 showError
        showError({
            statusCode: error?.response?.status || 500,
            statusMessage: '认证失败',
            message: error?.response?.data?.message,
            fatal: false
        })
    }
})
</script>


<style>
/* 自定义动画 */
.animate-gradient {
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

/* 点击涟漪效果 */
.ripple {
    position: relative;
    overflow: hidden;
}

.ripple:after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, #3b82f6 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform .5s, opacity 1s;
}

.ripple:active:after {
    transform: scale(0, 0);
    opacity: .3;
    transition: 0s;
}
</style>