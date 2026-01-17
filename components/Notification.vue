<!-- components/Notification.vue -->
<template>
    <div class="fixed top-10 right-4 space-y-2 w-72 z-[9999]">
        <Transition enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="transform translate-x-full opacity-0" enter-to-class="transform translate-x-0 opacity-100"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform translate-x-full opacity-0">
            <div v-if="show" :class="[
                'p-4 rounded-lg shadow-lg',
                type === 'success' ? 'bg-green-100 text-green-800' :
                    type === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
            ]" class="relative">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-medium">{{ title }}</h3>
                        <p class="text-sm mt-1">{{ message }}</p>
                    </div>
                    <button @click="close" class="text-gray-500 hover:text-gray-700" aria-label="关闭通知">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'info' // 'success', 'error', 'info'
    },
    title: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    duration: {
        type: Number,
        default: 3000
    }
})

const emit = defineEmits(['update:show', 'close'])

const timeout = ref(null)

const close = () => {
    clearTimeout(timeout.value)
    emit('update:show', false)
    emit('close')
}

watch(() => props.show, (newVal) => {
    if (newVal && props.duration > 0) {
        clearTimeout(timeout.value)
        timeout.value = setTimeout(() => {
            close()
        }, props.duration)
    }
})
</script>