<template>
    <div class="py-0 2xl:py-12" />

    <section class="2xl:max-w-md max-w-2xl mx-auto transition-all duration-300 ">
        <!-- 上半部分：标题和描述 -->
        <div class="flex">
            <div class="p-5 w-full">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">搜索文章</h3>
                <div class="space-y-3">
                    <div class="flex flex-col mb-1">
                        <div class="relative flex flex-row group">
                            <!-- 搜索图标 - 添加hover和focus动画 -->
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-all duration-300"
                                :class="{ 'text-blue-500': isFocused }">
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input v-model="searchKeyword" type="text" placeholder="搜索文章标题或内容"
                                class="block w-full py-1.5 pr-5 text-gray-700 bg-white/10 border border-gray-200 rounded-lg placeholder-gray-400/70 pl-11 focus:pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 transition-all duration-300 group-hover:border-blue-300"
                                @input="handleInput" @focus="isFocused = true" @blur="isFocused = false">
                        </div>
                        <span class="text-left mt-2 text-gray-600 line-clamp-3 transition-opacity duration-300"
                            :class="{ 'opacity-0': searchKeyword.length > 0 }">
                            在这里检索所有文章
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    debounceTime: {
        type: Number,
        default: 500
    }
});

const emit = defineEmits(['update:modelValue', 'search']);

const searchKeyword = ref(props.modelValue);
const isFocused = ref(false);
let debounceTimeout = null;

// 监听props变化更新内部状态
watch(() => props.modelValue, (newVal) => {
    searchKeyword.value = newVal;
});

// 处理输入事件，添加防抖
const handleInput = () => {
    // 清除之前的定时器
    clearTimeout(debounceTimeout);

    // 通知父组件更新v-model绑定
    emit('update:modelValue', searchKeyword.value);

    // 设置新的防抖定时器
    debounceTimeout = setTimeout(() => {
        emit('search', searchKeyword.value);
    }, props.debounceTime);
};

// 组件卸载时清除定时器
onBeforeUnmount(() => {
    clearTimeout(debounceTimeout);
});
</script>