<template>
    <!-- 添加深色模式背景色过渡 -->
    <div>
        <transition name="fade" mode="out-in">
            <div v-if="loading" key="loading" class="container mx-auto flex w-full mt-20">
                <div class="items-center w-full 2xl:w-2/3 px-6">
                    <div class="mx-auto max-w-2xl flex flex-col">

                        <!-- <div class="h-12 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                        <div class="h-12 w-1/2 bg-blue-200 dark:bg-blue-800 rounded animate-pulse mb-6"></div>

                        <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                        <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div> -->

                    </div>
                </div>
            </div>

            <div v-else key="content" class="mt-20">
                <!-- 动态hero内容-->
                <div v-html="homepageContent"></div>
            </div>
        </transition>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getFixedData } from '../utils/fixedDataApi'

const loading = ref(true)
const homepageContent = ref('')

const fetchHomepageContent = async () => {
    try {
        loading.value = true
        const response = await getFixedData('welcome_message')
        if (response.code === 200 && response.data?.content) {
            homepageContent.value = response.data.content
        }
    } catch (err) {
        console.error('获取welcome_message失败:', err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchHomepageContent()
})
</script>

<style>
/* 添加缓入缓出动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>