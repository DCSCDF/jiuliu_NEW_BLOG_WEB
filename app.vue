<template>
    <NuxtPage />
</template>

<script setup>
console.info("%c jiuliuTOP %c v1.0 ", "padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #FF6699; font-weight: bold;", "padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: #FF9999; font-weight: bold;")


</script>

<style>
/* 先导入字体，再导入其他样式 */
@import './assets/Comment/Comment.css';
@import './assets/Comment/style.css';

/* 字体定义 - 放在最前面 */
@font-face {
    font-family: 'MyCustomFont';
    src: url('./assets/ZhiyiMaru-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
        /* 重要：控制字体加载时的显示方式 */
}

/* 应用到 body */
body {
    font-family: 'MyCustomFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
        font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        /* 改善字体渲染 */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
}


/* 确保所有元素都继承字体 */
*,
*::before,
*::after {
    font-family: inherit;
}

/* 代码块基础样式 */
pre[class*="language-"] {
    background: #1f2937 !important;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
        /* 代码块保持等宽字体 */
}

/* 确保 body 元素正确处理滚动条 */
body {
    overflow-x: hidden;
    /* 防止水平滚动 */
}

/* 滚动条整体部分 */
::-webkit-scrollbar {
    width: 5px;
    height: 4px;
}

/* 滚动条轨道部分 */
::-webkit-scrollbar-track {
    background: #00000000;
    border-radius: 4px;
}

/* 滚动条滑块部分 */
::-webkit-scrollbar-thumb {
    background: #8888882c;
    border-radius: 4px;
}

/* 滚动条滑块:hover */
::-webkit-scrollbar-thumb:hover {
    background: #5555552f;
}
</style>