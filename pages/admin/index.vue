<template>
    <div class="min-h-screen transition-colors duration-300">
        <!-- 添加通知容器 -->
        <Notification v-model:show="notification.show" :type="notification.type" :title="notification.title"
            :message="notification.message" :duration="notification.duration" @close="clearNotification" />

        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <appheader></appheader>

            <div class="flex justify-center">
                <div class="w-full max-w-md mt-20">

                    <div
                        class="bg-white/50 py-5 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 transform">

                        <div class="px-8 py-3 pb-5 dark:border-gray-700">
                            <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">管理员登录</h1>
                        </div>


                        <div class="px-8 py-6">

                            <div v-if="cooldown"
                                class="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-lg transition-all duration-300">
                                账户已锁定，请 {{ remainingMinutes }} 分钟后再试
                            </div>

                            <form @submit.prevent="handleLogin" class="space-y-6">

                                <div>
                                    <label for="username"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                                        账号
                                    </label>
                                    <div class="relative">
                                        <input id="username" v-model="admin.account" type="text" required
                                            class="w-full px-4 py-2.5 text-gray-800 dark:text-gray-200 bg-white/70 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                                            placeholder="请输入账号" :disabled="cooldown || loading">
                                        <div
                                            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>


                                <div>
                                    <label for="password"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                                        密码
                                    </label>
                                    <div class="relative">
                                        <input id="password" v-model="admin.password" type="password" required
                                            class="w-full px-4 py-2.5 text-gray-800 dark:text-gray-200 bg-white/70 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                                            placeholder="请输入密码" :disabled="cooldown || loading"
                                            @keyup.enter="handleLogin">
                                        <div
                                            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center">
                                    <input id="remember-me" v-model="rememberMe" type="checkbox"
                                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors duration-200">
                                    <label for="remember-me"
                                        class="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                        记住账号密码
                                    </label>
                                </div>

                                <div>
                                    <button type="submit" :disabled="cooldown || loading"
                                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <span v-if="loading" class="flex items-center">
                                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                            登录中...
                                        </span>
                                        <span v-else>
                                            {{ cooldown ? `锁定中（剩余${remainingMinutes}分钟）` : "登录" }}
                                        </span>
                                    </button>
                                </div>

                                <!-- <div v-if="remainingAttempts < 5 && !cooldown"
                                    class="text-center text-sm text-yellow-600 dark:text-yellow-400 transition-colors duration-200">
                                    剩余尝试次数：{{ remainingAttempts }}
                                </div> -->
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const SEO = await getSeoConfig();
useHead(() => ({
    title: `${SEO.title} - 后台登陆`,
    meta: [
        { name: 'description', content: '后台登陆页面。' },
        { name: 'keywords', content: SEO.keywords.join(', ') },
        { name: 'robots', content: 'index, follow' },
    ],
}))

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { login, checkLoginStatus } from "../../utils/adminapi";

const router = useRouter();
const loading = ref(false);
const rememberMe = ref(false);
const cooldown = ref(false);
const remainingMinutes = ref(0);
const remainingAttempts = ref(5);
const isCheckingLogin = ref(false);
const admin = ref({
    account: "",
    password: "",
});

// 通知状态
const notification = ref({
    show: false,
    type: 'info',
    title: '',
    message: '',
    duration: 3000
})
const clearNotification = () => {
    notification.value = {
        show: false,
        type: 'info',
        title: '',
        message: '',
        duration: 3000
    }
}
// 显示通知的函数
const showNotification = (type, title, message, duration = 3000) => {
    notification.value = {
        show: true,
        type,
        title,
        message,
        duration
    }
}

const checkTokenAndRedirect = async () => {
    if (import.meta.client && !isCheckingLogin.value) {
        isCheckingLogin.value = true;
        try {
            const token = localStorage.getItem("admin_token");
            if (!token) {
                isCheckingLogin.value = false;
                return;
            }

            const { isLoggedIn, error } = await checkLoginStatus(token);
            if (isLoggedIn && !window.location.pathname.startsWith("/admin/dashboard")) {
                router.push("/admin/dashboard");
                showNotification('info', '提示', '已经登陆过了,跳转仪表盘');
            } else if (error) {
                showNotification('error', '错误', error);
                localStorage.removeItem("admin_token");
            }
        } catch (error) {
            console.error("Token验证失败:", error);
            showNotification('error', '错误', 'Token验证失败');
            localStorage.removeItem("admin_token");
        } finally {
            isCheckingLogin.value = false;
        }
    }
};

onMounted(() => {
    checkTokenAndRedirect();

    if (import.meta.client) {
        const savedAccount = localStorage.getItem("admin_account");
        const savedPassword = localStorage.getItem("admin_password");

        if (savedAccount && savedPassword) {
            admin.value.account = savedAccount;
            admin.value.password = savedPassword;
            rememberMe.value = true;
        }
    }
});

const handleLogin = async () => {
    if (!admin.value.account || !admin.value.password) {
        showNotification('error', '错误', '请填写账号和密码');
        return;
    }

    loading.value = true;
    const startTime = Date.now();

    try {
        const loginPromise = login(admin.value.account, admin.value.password);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("登录请求超时")), 10000)
        );

        const response = await Promise.race([loginPromise, timeoutPromise]);

        if (response.code === 200) {
            if (rememberMe.value) {
                localStorage.setItem("admin_account", admin.value.account);
                localStorage.setItem("admin_password", admin.value.password);
            } else {
                localStorage.removeItem("admin_account");
                localStorage.removeItem("admin_password");
            }

            localStorage.setItem("admin_token", response.data.token);
            // showNotification('success', '成功', '登录成功');
            router.push("/admin/dashboard");
        } else {
            remainingAttempts.value = response.data?.remainingAttempts || remainingAttempts.value - 1;

            if (response.data?.lockUntil) {
                cooldown.value = true;
                const lockTime = new Date(response.data.lockUntil).getTime();
                const now = Date.now();
                remainingMinutes.value = Math.ceil((lockTime - now) / (1000 * 60));
            }

            showNotification('error', '错误', response.msg || "登录失败");
        }
    } catch (error) {
        console.error("登录错误:", error);
        showNotification('error', '错误', error.message.includes("超时") ? "请求超时，请检查网络" : error.message || "登录失败");
    } finally {
        loading.value = false;
        console.log(`登录耗时: ${Date.now() - startTime}ms`);
    }
}
</script>

<style>
/* 修复输入框点击外部不失去焦点的问题 */
input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* 美化输入框 */
input {
    transition: all 200ms ease-in-out;
    transition-property: color, background-color, border-color, box-shadow;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

input:not(:disabled):hover {
    border-color: #93c4fd71;
}

input:focus {
    border-color: #3b82f6;
    background-color: rgba(255, 255, 255, 0.194);
}

.dark input:focus {
    background-color: rgba(55, 65, 81, 0.281);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>