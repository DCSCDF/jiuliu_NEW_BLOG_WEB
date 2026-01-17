<template>
    <ClientOnly>
        <div class="relative">
            <!-- 主题切换按钮 -->
            <button @click="toggleDropdown" class="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl 
                        active:scale-95
                        transition-all duration-300 ease-out" aria-label="切换主题" aria-haspopup="true"
                :aria-expanded="showDropdown">

                <!-- 当前主题图标 -->
                <div class="relative w-6 h-6">
                    <!-- 浅色模式太阳图标 -->
                    <svg v-show="effectiveTheme === 'light'"
                        class="absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-500 ease-out"
                        fill="currentColor" viewBox="0 0 24 24"
                        :class="{ 'animate-spin-slow': effectiveTheme === 'light' }">
                        <path
                            d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 S11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0 s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
                    </svg>

                    <!-- 深色模式月亮图标 -->
                    <svg v-show="effectiveTheme === 'dark'"
                        class="absolute inset-0 w-6 h-6 text-indigo-400 transition-all duration-500 ease-out"
                        fill="currentColor" viewBox="0 0 24 24" :class="{ 'animate-float': effectiveTheme === 'dark' }">
                        <path
                            d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
                    </svg>

                    <!-- 系统模式图标 -->
                    <svg v-show="effectiveTheme === 'system'"
                        class="absolute inset-0 w-6 h-6 text-blue-500 transition-all duration-500 ease-out"
                        fill="currentColor" viewBox="0 0 24 24"
                        :class="{ 'animate-pulse-slow': effectiveTheme === 'system' }">
                        <path
                            d="M20,9V7c0-1.1-0.9-2-2-2h-3c0-1.66-1.34-3-3-3S9,3.34,9,5H6C4.9,5,4,5.9,4,7v2c-1.66,0-3,1.34-3,3s1.34,3,3,3v4 c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-4c1.66,0,3-1.34,3-3S21.66,9,20,9z M7.5,11.5c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5 S9.83,13,9,13S7.5,12.33,7.5,11.5z M16,17H8v-2h8V17z M15,13c-0.83,0-1.5-0.67-1.5-1.5S14.17,10,15,10s1.5,0.67,1.5,1.5 S15.83,13,15,13z" />
                    </svg>
                </div>

                <!-- 下拉箭头 -->
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-out"
                    :class="{ 'rotate-180': showDropdown, 'opacity-60 group-hover:opacity-100': true }" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                </svg>

                <!-- 当前主题标签 -->
                <!-- <span class="text-sm font-medium text-gray-700 dark:text-gray-200 opacity-0 group-hover:opacity-100 
                            
                    {{ getThemeLabel(effectiveTheme) }}
                </span> -->
            </button>

            <!-- 下拉菜单 -->
            <transition enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="transform -translate-y-2 opacity-0 scale-95"
                enter-to-class="transform translate-y-0 opacity-100 scale-100"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="transform translate-y-0 opacity-100 scale-100"
                leave-to-class="transform -translate-y-2 opacity-0 scale-95">
                <div v-show="showDropdown" class="absolute right-0 mt-2.5 w-52 bg-white/60 dark:bg-gray-800/60
                            backdrop-blur-xl rounded-2xl shadow-2xl shadow-gray-900/20 
                            py-2 z-50 border border-white/20 dark:border-gray-700/50
                            ring-1 ring-black/5 dark:ring-white/10" role="menu" aria-orientation="vertical">
                    <!-- 菜单标题 -->
                    <div class="px-4 py-2.5 border-b border-gray-300/30 dark:border-gray-700/30">
                        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            主题设置
                        </h3>
                    </div>

                    <!-- 菜单项 -->
                    <div class="px-2 py-1.5 space-y-0.5">
                        <!-- 浅色模式 -->
                        <button @click="setTheme('light')" class="group relative flex items-center gap-3 w-full px-3 py-3 text-left 
                                    rounded-xl transition-all duration-200 ease-out
                                    hover:bg-gray-300/30 dark:hover:bg-gray-700/80
                                    active:scale-95" :class="{
                                        'bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': effectiveTheme === 'light',
                                        'text-gray-700 dark:text-gray-300': effectiveTheme !== 'light'
                                    }" role="menuitem">
                            <!-- 选中指示器 -->
                            <div class="flex-shrink-0 w-2 h-2 rounded-full transition-all duration-300" :class="{
                                'bg-blue-500 scale-125': effectiveTheme === 'light',
                                'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500': effectiveTheme !== 'light'
                            }">
                            </div>

                            <!-- 图标 -->
                            <svg class="w-5 h-5 flex-shrink-0 transition-all duration-300" :class="{
                                'text-amber-500 scale-110': effectiveTheme === 'light',
                                'text-amber-400/60 group-hover:text-amber-400': effectiveTheme !== 'light'
                            }" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 S11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0 s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
                            </svg>

                            <div class="flex-1 min-w-0">
                                <span class="text-sm font-medium block truncate">浅色模式</span>
                                <span class="text-xs opacity-60 mt-0.5 block">明亮清晰的界面</span>
                            </div>

                            <!-- 选中时的对勾图标 -->
                            <svg v-if="effectiveTheme === 'light'" class="w-4 h-4 text-blue-500 flex-shrink-0"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>

                        <!-- 深色模式 -->
                        <button @click="setTheme('dark')" class="group relative flex items-center gap-3 w-full px-3 py-3 text-left 
                                    rounded-xl transition-all duration-200 ease-out
                                    hover:bg-gray-300/30 dark:hover:bg-gray-700/80
                                    active:scale-95" :class="{
                                        'bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': effectiveTheme === 'dark',
                                        'text-gray-700 dark:text-gray-300': effectiveTheme !== 'dark'
                                    }" role="menuitem">
                            <!-- 选中指示器 -->
                            <div class="flex-shrink-0 w-2 h-2 rounded-full transition-all duration-300" :class="{
                                'bg-blue-500 scale-125': effectiveTheme === 'dark',
                                'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500': effectiveTheme !== 'dark'
                            }">
                            </div>

                            <!-- 图标 -->
                            <svg class="w-5 h-5 flex-shrink-0 transition-all duration-300" :class="{
                                'text-indigo-400 scale-110': effectiveTheme === 'dark',
                                'text-indigo-400/60 group-hover:text-indigo-400': effectiveTheme !== 'dark'
                            }" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
                            </svg>

                            <div class="flex-1 min-w-0">
                                <span class="text-sm font-medium block truncate">深色模式</span>
                                <span class="text-xs opacity-60 mt-0.5 block">夜间或低光环境</span>
                            </div>

                            <!-- 选中时的对勾图标 -->
                            <svg v-if="effectiveTheme === 'dark'" class="w-4 h-4 text-blue-500 flex-shrink-0"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>

                        <!-- 系统模式 -->
                        <button @click="setTheme('system')" class="group relative flex items-center gap-3 w-full px-3 py-3 text-left 
                                    rounded-xl transition-all duration-200 ease-out
                                    hover:bg-gray-300/30 dark:hover:bg-gray-700/80
                                    active:scale-95" :class="{
                                        'bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': effectiveTheme === 'system',
                                        'text-gray-700 dark:text-gray-300': effectiveTheme !== 'system'
                                    }" role="menuitem">
                            <!-- 选中指示器 -->
                            <div class="flex-shrink-0 w-2 h-2 rounded-full transition-all duration-300" :class="{
                                'bg-blue-500 scale-125': effectiveTheme === 'system',
                                'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500': effectiveTheme !== 'system'
                            }">
                            </div>

                            <!-- 图标 -->
                            <svg class="w-5 h-5 flex-shrink-0 transition-all duration-300" :class="{
                                'text-blue-500 scale-110': effectiveTheme === 'system',
                                'text-blue-400/60 group-hover:text-blue-400': effectiveTheme !== 'system'
                            }" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M20,9V7c0-1.1-0.9-2-2-2h-3c0-1.66-1.34-3-3-3S9,3.34,9,5H6C4.9,5,4,5.9,4,7v2c-1.66,0-3,1.34-3,3s1.34,3,3,3v4 c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-4c1.66,0,3-1.34,3-3S21.66,9,20,9z M7.5,11.5c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5 S9.83,13,9,13S7.5,12.33,7.5,11.5z M16,17H8v-2h8V17z M15,13c-0.83,0-1.5-0.67-1.5-1.5S14.17,10,15,10s1.5,0.67,1.5,1.5 S15.83,13,15,13z" />
                            </svg>

                            <div class="flex-1 min-w-0">
                                <span class="text-sm font-medium block truncate">跟随系统</span>
                                <span class="text-xs opacity-60 mt-0.5 block">自动切换主题</span>
                            </div>

                            <!-- 选中时的对勾图标 -->
                            <svg v-if="effectiveTheme === 'system'" class="w-4 h-4 text-blue-500 flex-shrink-0"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const colorMode = useColorMode()
const showDropdown = ref(false)
const isTransitioning = ref(false)

// 获取当前有效主题
const effectiveTheme = computed(() => {
    if (import.meta.client) {
        // 当选择系统模式时，显示系统图标而不是当前实际主题
        if (colorMode.preference === 'system') {
            return 'system'
        }
        return colorMode.value
    }
    return 'light' // SSR默认值
})

// 切换下拉菜单
const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value

    // 触觉反馈
    if (navigator.vibrate && showDropdown.value) {
        navigator.vibrate(20)
    }
}

// 设置主题
const setTheme = async (theme) => {
    if (isTransitioning.value) return

    isTransitioning.value = true

    try {
        // 触觉反馈
        if (navigator.vibrate) {
            navigator.vibrate(30)
        }

        // 播放切换音效
        playToggleSound()

        // 添加过渡动画类
        document.documentElement.classList.add('theme-transition')
        document.documentElement.classList.add('theme-changing')

        // 显示加载状态
        const originalTheme = effectiveTheme.value

        // 延迟更新主题，让用户看到动画
        await new Promise(resolve => setTimeout(resolve, 150))

        // 更新主题
        colorMode.preference = theme

        // 确保 data-theme 属性正确设置
        if (theme === 'system') {
            document.documentElement.removeAttribute('data-theme')
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            document.documentElement.classList.toggle('dark', prefersDark)
        } else {
            document.documentElement.setAttribute('data-theme', theme)
            document.documentElement.classList.toggle('dark', theme === 'dark')
        }

        // 保存到 localStorage
        localStorage.setItem('theme-preference', theme)
        localStorage.setItem('last-theme-change', new Date().toISOString())

        // 触发自定义事件，让其他组件知道主题已改变
        window.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme, previousTheme: originalTheme }
        }))

        // 关闭下拉菜单
        showDropdown.value = false

        // 等待动画完成
        await new Promise(resolve => setTimeout(resolve, 300))

    } catch (error) {
        console.error('切换主题失败:', error)
    } finally {
        // 移除过渡类
        document.documentElement.classList.remove('theme-transition')
        document.documentElement.classList.remove('theme-changing')
        isTransitioning.value = false
    }
}

// 播放音效
const playToggleSound = () => {
    try {
        // 创建简单的点击音效
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // 根据主题设置音调
        const frequency = effectiveTheme.value === 'light' ? 523.25 : 392.00
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)

    } catch (error) {
        // 音效失败不影响主要功能
    }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
        showDropdown.value = false
    }
}

// 监听系统主题变化
const setupSystemThemeListener = () => {
    if (!import.meta.client) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = (e) => {
        if (colorMode.preference === 'system') {
            // 触发平滑的主题切换
            document.documentElement.classList.add('theme-transition')

            setTimeout(() => {
                colorMode.preference = 'system' // 这会自动应用系统主题
                document.documentElement.classList.toggle('dark', e.matches)

                setTimeout(() => {
                    document.documentElement.classList.remove('theme-transition')
                }, 300)
            }, 50)
        }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
}

onMounted(() => {
    if (import.meta.client) {
        document.addEventListener('click', handleClickOutside)

        // 设置系统主题监听器
        const cleanup = setupSystemThemeListener()

        // 确保 data-theme 属性正确设置
        if (colorMode.preference !== 'system') {
            document.documentElement.setAttribute('data-theme', colorMode.preference)
        }

        // 检查上次主题切换时间
        const lastChange = localStorage.getItem('last-theme-change')
        if (lastChange) {
            const daysSinceChange = (Date.now() - new Date(lastChange).getTime()) / (1000 * 60 * 60 * 24)
            if (daysSinceChange > 30) {
                // 超过30天，提示用户检查主题设置
                console.log('上次主题切换已超过30天')
            }
        }

        onBeforeUnmount(cleanup)
    }
})

onBeforeUnmount(() => {
    if (import.meta.client) {
        document.removeEventListener('click', handleClickOutside)
    }
})
</script>

<style>
/* 全局主题切换动画 */
.theme-transition * {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}

.theme-changing {
    animation: theme-change 0.3s ease-out;
}

@keyframes theme-change {
    0% {
        opacity: 0.9;
    }

    50% {
        opacity: 0.7;
    }

    100% {
        opacity: 1;
    }
}

/* 自定义动画 */
@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
    }
}

@keyframes pulse-slow {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

.animate-pulse-slow {
    animation: pulse-slow 2s ease-in-out infinite;
}

.animate-spin-slow {
    animation: spin-slow 20s linear infinite;
}
</style>