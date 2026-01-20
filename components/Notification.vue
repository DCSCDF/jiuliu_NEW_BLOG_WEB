<!-- components/GlobalNotification.vue -->
<template>
   <div v-if="show" class="fixed top-4 right-4 z-50">
        <div :class="notificationClasses" class="px-6 py-4 rounded-lg shadow-lg max-w-md transition-all duration-300">
            <div class="flex items-start">
                <!-- 图标 -->
                <div :class="iconClasses" class="flex-shrink-0 mr-3">
                    <svg v-if="type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <svg v-else-if="type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                    <svg v-else-if="type === 'warning'" class="w-6 h-6" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z">
                        </path>
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>

                <!-- 内容 -->
                <div class="flex-1">
                   <h3 v-if="title" class="font-medium">{{ title }}</h3>
                    <p class="mt-1 text-sm">{{ message }}</p>
                </div>
                <!-- 关闭按钮 -->
                <button @click="close" class="ml-4 text-gray-400 hover:text-gray-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
    show: Boolean,
    type: {
        type: String,
        default: 'info',
        validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: String,
    message: String,
    duration: {
        type: Number,
        default: 3000
    }
})

const emit = defineEmits(['update:show', 'close'])

// 自动关闭
watch(() => props.show, (newVal) => {
    if (newVal && props.duration > 0) {
        setTimeout(() => {
            close()
        }, props.duration)
    }
})

// 样式计算
const notificationClasses = computed(() => {
    const base = 'border-l-4'
    switch (props.type) {
        case 'success':
            return `${base} bg-green-50 border-green-500 text-green-800`
        case 'error':
            return `${base} bg-red-50 border-red-500 text-red-800`
        case 'warning':
            return `${base} bg-yellow-50 border-yellow-500 text-yellow-800`
        default:
            return `${base} bg-blue-50 border-blue-500 text-blue-800`
    }
})

const iconClasses = computed(() => {
    switch (props.type) {
        case 'success': return 'text-green-500'
        case 'error': return 'text-red-500'
        case 'warning': return 'text-yellow-500'
        default: return 'text-blue-500'
    }
})

// 关闭通知
const close = () => {
    emit('update:show', false)
    emit('close')
}
</script>