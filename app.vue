<template>

    <n-dialog-provider>
        <n-config-provider>
            <n-message-provider>
                <div class="">
                    <NuxtPage>
                    </NuxtPage>
                </div>
            </n-message-provider>
        </n-config-provider>
    </n-dialog-provider>


</template>
<script setup>

console.info("%c jiuliuTOP %c v1.0 ", "padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #FF6699; font-weight: bold;", "padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: #FF9999; font-weight: bold;")

</script>

<style>
@import './public/Comment/Comment.css';

/* 深色模式适配 */
/* 默认浅色主题 */
:root {
    --twikoo-text-color: #333;
    /* --twikoo-bg-color: #fff; */
    --twikoo-border-color: #dcdfe6;
    --twikoo-card-bg: #f5f7fa;
}

/* 深色主题 - 通过[data-theme="dark"]或系统偏好应用 */
[data-theme="dark"],
.dark {
    --twikoo-text-color: #e5e7eb;
    /* --twikoo-bg-color: #1a1a1a; */
    --twikoo-border-color: #ffffff5b;
    --twikoo-card-bg: #22222200;
}

/* 系统偏好深色模式 - 仅当用户未手动选择主题时应用 */
@media (prefers-color-scheme: dark) {
    :root:not([data-theme]) {
        --twikoo-text-color: #e5e7eb;
        /* --twikoo-bg-color: #1a1a1a; */
        --twikoo-border-color: #ffffff5b;
        --twikoo-card-bg: #22222200;
    }
}

/* 应用样式 */
.twikoo {
    color: var(--twikoo-text-color);
    background-color: var(--twikoo-bg-color);
    transition: color 0.3s, background-color 0.3s;
}

.twikoo .el-input__inner,
.twikoo .el-textarea__inner {
    color: var(--twikoo-text-color);
    background-color: var(--twikoo-card-bg);
    border-color: var(--twikoo-border-color);
    transition: all 0.3s;
}

.tk-admin {
    background-color: rgba(0, 0, 0, 0.8);
}

.tk-comment,
.tk-expand,
.tk-comments-count,
.tk-comments-no,
.tk-submit {
    color: var(--twikoo-text-color);
}

.tk-tag {
    background-color: rgba(255, 255, 255, 0.1);
}

.tk-preview-container {
    border-color: var(--twikoo-border-color);
}

/* 主题切换过渡效果 */
.theme-transition * {
    transition: color 0.3s, background-color 0.3s, border-color 0.3s !important;
}


body {
    background: #3939390c;
}

/* 代码块基础样式 */
pre[class*="language-"] {
    background: #1f2937 !important;
}

.fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

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


.theme-transition *,
.theme-transition *::before,
.theme-transition *::after {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* 图标容器样式 */
.relative.w-5.h-5 svg {
    transition: opacity 0.3s ease;
}

.rotate-180 {
    transform: rotate(180deg);
}
</style>