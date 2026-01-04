<template>
    <ClientOnly>
        <div class="relative">
            <button @click="toggleDropdown"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Toggle theme">
                <div class="relative w-5 h-5">
                    <svg v-show="effectiveTheme === 'light'"
                        class="absolute inset-0 w-5 h-5 text-yellow-500 transition-opacity duration-300" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>

                    <svg v-show="effectiveTheme === 'dark'"
                        class="absolute inset-0 w-5 h-5 text-indigo-400 transition-opacity duration-300" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>

                    <svg v-show="effectiveTheme === 'system'"
                        class="absolute inset-0 w-5 h-5 text-purple-500 transition-opacity duration-300" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M9.663 17h4.673M12 3v1m8 8h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>

                <svg class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-200"
                    :class="{ 'rotate-180': showDropdown }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <transition enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <div v-show="showDropdown"
                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <button @click="setTheme('light')"
                        class="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span class="text-gray-700 dark:text-gray-200">浅色模式</span>
                    </button>

                    <button @click="setTheme('dark')"
                        class="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <svg class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span class="text-gray-700 dark:text-gray-200">深色模式</span>
                    </button>

                    <button @click="setTheme('system')"
                        class="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <svg class="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9.663 17h4.673M12 3v1m8 8h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span class="text-gray-700 dark:text-gray-200">系统自动</span>
                    </button>
                </div>
            </transition>
        </div>
    </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const colorMode = useColorMode()
const showDropdown = ref(false)

// 获取当前有效主题
const effectiveTheme = computed(() => {
    if (import.meta.client) {
        // 当选择系统模式时，显示系统图标而不是当前实际主题
        if (colorMode.preference === 'system') {
            return 'system'
        }
        return colorMode.value
    }
    return 'light' // 服务器端返回默认值
})

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}

const setTheme = (theme) => {
    // 添加主题切换动画
    document.documentElement.classList.add('theme-transition')

    // 更新主题
    colorMode.preference = theme

    // 手动设置data-theme属性以确保Twikoo样式正确应用
    if (theme === 'system') {
        document.documentElement.removeAttribute('data-theme')
        document.documentElement.classList.toggle('dark', colorMode.value === 'dark')
    } else {
        document.documentElement.setAttribute('data-theme', theme)
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }

    showDropdown.value = false

    // 动画结束后移除类
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition')
    }, 300)
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
        showDropdown.value = false
    }
}

onMounted(() => {
    if (import.meta.client) {
        document.addEventListener('click', handleClickOutside)

        // 初始化时确保data-theme属性正确设置
        if (colorMode.preference !== 'system') {
            document.documentElement.setAttribute('data-theme', colorMode.preference)
        }
    }
})

onBeforeUnmount(() => {
    if (import.meta.client) {
        document.removeEventListener('click', handleClickOutside)
    }
})
</script>