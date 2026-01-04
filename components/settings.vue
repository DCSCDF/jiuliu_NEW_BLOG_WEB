<template>
    <h2 class="text-2xl mb-4 font-semibold text-gray-800">设置</h2>
    <p class="text-gray-600 mb-6">管理系统基本配置和内容。</p>
    <div>

        <!-- 选项卡导航 -->
        <div class="mb-2 border-b border-gray-200 flex ">
            <button @click="activeTab = 'account'" :class="{
                'bg-blue-600 text-white': activeTab === 'account',
                'bg-white text-gray-700': activeTab !== 'account'
            }" class="px-4 py-2 rounded-t-lg mr-2 transition-all duration-300 hover:bg-blue-500 hover:text-white">
                账户设置
            </button>
            <button @click="activeTab = 'homepage'" :class="{
                'bg-blue-600 text-white': activeTab === 'homepage',
                'bg-white text-gray-700': activeTab !== 'homepage'
            }" class="px-4 py-2 rounded-t-lg mr-2 transition-all duration-300 hover:bg-blue-500 hover:text-white">
                网站内容
            </button>
        </div>

        <!-- 账户设置面板 -->
        <div v-show="activeTab === 'account'" class="p-6 mb-8 animate-fade-in-up">
            <h3 class="text-xl font-medium text-gray-700 flex items-center">
                账户设置
            </h3>
            <p class="text-sm font-medium text-gray-500 mb-4 flex items-center">
                对账户的密码进行修改
            </p>
            <SettingUser></SettingUser>
            <div class="border-b my-10 border-gray-200 "></div>
            <h3 class="text-xl font-medium text-gray-700 flex items-center">
                图床账号修改
            </h3>
            <p class="text-sm font-medium text-gray-500 mb-4 flex items-center">
                兰空图床账户密码修改
            </p>
            <SettingLsky></SettingLsky>
        </div>

        <!-- 主页内容面板 -->
        <div v-show="activeTab === 'homepage'" class="p-6 mb-8 animate-fade-in-up">
            <h3 class="text-xl font-medium text-gray-700 flex items-center">
                链接
            </h3>
            <p class="text-sm font-medium text-gray-500 mb-4 flex items-center">
                编辑网站的header中的自定义链接
            </p>
            <SettingHeadLink></SettingHeadLink>
            <div class="border-b my-10 border-gray-200 "></div>
            <h3 class="text-xl font-medium text-gray-700 flex items-center">
                网站SEO
            </h3>
            <p class="text-sm font-medium text-gray-500 mb-4 flex items-center">
                对网站的SEO信息进行编辑
            </p>
            <SettingSeo></SettingSeo>
            <div class="border-b my-10 border-gray-200 "></div>
            <h3 class="text-xl font-medium text-gray-700 flex items-center">
                首页展示
            </h3>
            <p class="text-sm font-medium text-gray-500 mb-4 flex items-center">
                对网站首页介绍信息的html进行修改
            </p>
            <SettingWelcome></SettingWelcome>
            <div class="border-b my-10 border-gray-200 "></div>
            <h3 class="text-xl font-medium text-gray-700 flex items-center">
                友链信息
            </h3>
            <p class="text-sm font-medium text-gray-500 mb-4 flex items-center">
                对友情链接页面的本站信息表格进行修改
            </p>
            <SettingLink></SettingLink>
            <div class="border-b my-10 border-gray-200 "></div>
            <h3 class="text-xl font-medium text-gray-700 flex items-center">
                RSS信息
            </h3>
            <p class="text-sm font-medium text-gray-500 mb-4 flex items-center">
                对资源描述框架站点摘要信息进行修改
            </p>
            <SettingRss></SettingRss>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
// 选项卡
const activeTab = ref('account')

</script>

<style>
/* 动画 */
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

.animate-fade-in-up {
    animation: fadeInUp 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}


/* 响应式表格 */
@media (max-width: 640px) {
    table {
        display: block;
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
}

/* 友链表格悬停效果 */
tr {
    transition: all 0.2s ease;
}
</style>