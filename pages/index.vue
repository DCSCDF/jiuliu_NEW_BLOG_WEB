<template>
    <div class="flex flex-col min-h-screen h-full bg-white/50 dark:bg-gray-800/60 md:mx-10 xl:mx-40">
        <div class="flex-1">

            <Header></Header>

            <div class="container md:px-6 py-5 mx-auto">
                <div class="flex 2xl:flex-row flex-col-reverse gap-6">
                    <!-- Main content area -->
                    <div class="2xl:w-3/5">
                        <div class="m-4">
                            <!-- Removed blog card component -->
                            <!-- <Blogcard :search-keyword="searchKeyword"></Blogcard> -->
                        </div>
                    </div>

                    <!-- Sidebar area -->
                    <div class="2xl:w-2/5 2xl:my-20">
                        <!-- Mobile floating button -->
                        <button
                            class="fixed bottom-12 right-10 2xl:hidden z-50 px-5 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-xl flex items-center space-x-1"
                            @click="toggleSidebar">
                            <svg width="20" height="20" viewBox="0 0 1028 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
                                <path
                                    d="M7.856789 602.079857c158.044987 2.617399 316.007318 3.788341 473.882404 3.512825A56865.980269 56865.980269 0 0 1 482.519821 2.805668 3854.340592 3854.340592 0 0 0 15.975318 25.710206a3762.015283 3762.015283 0 0 0-8.118529 576.369651zM54.308735 1002.280179a3557.0913 3557.0913 0 0 0 430.653991 21.141238c-1.322475-115.702816-2.291372-231.506655-2.897506-347.406924-156.378117 0.518888-312.834296-1.653094-469.377722-6.520538a3835.297865 3835.297865 0 0 0 41.621237 332.786224zM543.62461 1022.250475c143.557453-4.059265 287.105722-16.843193 430.658583-38.360968 30.269991-177.17496 47.498906-354.267265 51.686744-531.276915a27595.367318 27595.367318 0 0 0-479.314654-6.088897c-0.298475 192.167605-1.304108 384.078063-3.030673 575.72678zM546.072108 4.07304c0.514296 124.147372 0.734709 248.18913 0.656645 372.120682 160.152682 1.235229 320.213525 5.115408 480.191713 11.649722a3611.202583 3611.202583 0 0 0-14.303856-342.218045C857.097184 22.316771 701.58235 8.467516 546.072108 4.07304z"
                                    fill="#84ADDD" class="dark:fill-blue-400">
                                </path>
                            </svg>
                            <span
                                class="text-sm pt-1 font-bold text-gray-500 dark:text-gray-300 whitespace-nowrap tracking-wide leading-tight">侧边栏</span>
                        </button>

                        <!-- Sidebar content -->
                        <div :class="[
                            '2xl:sticky 2xl:top-20 2xl:self-start',
                            'fixed inset-0 z-40 2xl:z-0 bg-white/80 dark:bg-gray-800/80 2xl:bg-white/0 2xl:dark:bg-gray-900/0 backdrop-blur-md 2xl:backdrop-blur-none transition-transform duration-300 ease-in-out 2xl:transform-none',
                            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        ]">
                            <!-- Close button (mobile) -->
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
                                <!-- Removed sidebar component -->
                                <!-- <Sidebar @search="handleSearch"></Sidebar> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'


// 控制移动端侧边栏是否打开
const mobileSidebarOpen = ref(false)

// 切换侧边栏显示状态
const toggleSidebar = () => {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
}

// 可选：点击侧边栏外区域关闭（进阶体验）
// 如果需要该功能，可监听点击事件并判断是否在侧边栏内
</script>

<style scoped></style>