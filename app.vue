<template>

    <n-dialog-provider>
        <n-config-provider>
            <n-message-provider>
                <NuxtPage />
                <template #error="{ error }">
                    <ErrorPage :error="error" />
                </template>
            </n-message-provider>
        </n-config-provider>
    </n-dialog-provider>


</template>
<script setup>

console.info("%c jiuliuTOP %c v1.0 ", "padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #FF6699; font-weight: bold;", "padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: #FF9999; font-weight: bold;")

const originalWarn = console.warn;
console.warn = (...args) => {
    if (!args[0].includes('Slot "default" invoked outside of the render function')) {
        originalWarn(...args);
    }
};

</script>

<style>
body {
    background: #3939390c;
}

/* 全局样式文件中添加 */
.n-config-provider {
    --n-body-color: #ffffff !important;
    --n-text-color-base: #1f2937 !important;

    /* 覆盖所有深色模式变量 */
    [data-theme="dark"] {
        display: none !important;
    }
}

/* Naive UI 模态框和抽屉的特殊处理 */
.n-modal,
.n-drawer {
    --n-scrollbar-width: 10px;
    /* 与滚动条宽度一致 */
}

/* 防止模态框内容被滚动条覆盖 */
.n-modal-container,
.n-drawer-container {
    padding-right: var(--n-scrollbar-width);
}

/* 修复 Naive UI 模态框滚动条问题 */
.n-modal-body-wrapper,
.n-drawer-content-wrapper {
    scrollbar-gutter: auto;
    /* 重置模态框内部的滚动条处理 */
}

/* 确保 body 元素正确处理滚动条 */
body {
    overflow-x: hidden;
    /* 防止水平滚动 */
}
</style>