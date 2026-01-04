<template>
    <div class="flex flex-col min-h-screen h-full bg-white/50 md:mx-10 xl:mx-40">
        <div class="flex-1">
            <appheader></appheader>


            <div>

                <div
                    class="inset-0 shadow-2xl p-8 h-min w-full max-w-sm m-auto mx-auto mt-40 bg-white/50 rounded-xl border border-gray-200">
                    <div class="flex mt-2 font-bold text-gray-700 text-xl justify-center mx-auto">
                        <h1>管理员登录</h1>
                    </div>
                    <div class="mt-6" title="管理员后台登陆">
                        <div v-if="cooldown" class="text-red-500 text-sm mb-2">
                            账户已锁定，请 {{ remainingMinutes }} 分钟后再试
                        </div>
                        <n-form ref="formRef" :rules="rules" :model="admin">
                            <n-form-item path="account" label="账号">
                                <n-input v-model:value="admin.account" :bordered="false" placeholder="请输入账号"
                                    :theme-overrides="themeOverrides" />
                            </n-form-item>
                            <n-form-item path="password" label="密码">
                                <n-input v-model:value="admin.password" :bordered="false" type="password"
                                    placeholder="请输入密码" :theme-overrides="themeOverrides" @keyup.enter="handleLogin" />
                            </n-form-item>
                        </n-form>
                        <ClientOnly>
                            <n-checkbox v-model:checked="rememberMe" class="my-4" label="记住账号密码"
                                :theme-overrides="themeOverrides" />
                        </ClientOnly>
                        <n-button style="width: 100%" @click="handleLogin" :disabled="cooldown || loading"
                            :loading="loading" :theme-overrides="themeOverrides">
                            {{ cooldown ? `锁定中（剩余${remainingMinutes}分钟）` : "登录" }}
                        </n-button>
                        <!-- 剩余尝试提示 -->
                        <!-- <div v-if="remainingAttempts < 5 && !cooldown" class="text-yellow-500 text-sm mt-2">
                            剩余尝试次数：{{ remainingAttempts }}
                        </div> -->
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>

useHead(() => ({
    title: `${SEO.title} - 后台登陆`,
    meta: [
        {
            name: 'description',
            content: '后台登陆页面。'
        },
        {
            name: 'keywords',
            content: SEO.keywords.join(', ')
        },
        { name: 'author', content: '久流' },
        { name: 'robots', content: 'index, follow' },
    ],
}))

import { useMessage } from "naive-ui";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { login, checkLoginStatus } from "../../utils/adminapi";
import themeOverrides from "../../themeOverrides";

const message = useMessage();
const formRef = ref(null);
const loading = ref(false);
const rememberMe = ref(false);
const cooldown = ref(false);
const remainingMinutes = ref(0);
const remainingAttempts = ref(5);
const isCheckingLogin = ref(false);
const router = useRouter();
const admin = ref({
    account: "",
    password: "",
});

const rules = {
    account: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};


const checkTokenAndRedirect = async () => {
    if (process.client && !isCheckingLogin.value) {
        isCheckingLogin.value = true;
        try {
            const token = localStorage.getItem("admin_token"); // 在这里定义token
            if (!token) {
                isCheckingLogin.value = false;
                return;
            }

            const { isLoggedIn, error } = await checkLoginStatus(token);
            if (isLoggedIn && !window.location.pathname.startsWith("/admin/dashboard")) {
                router.push("/admin/dashboard");
                message.success("已经登陆过了,跳转仪表盘")
            } else if (error) {
                message.error(error);
                localStorage.removeItem("admin_token");
            }
        } catch (error) {
            console.error("Token验证失败:", error);
            localStorage.removeItem("admin_token");
        } finally {
            isCheckingLogin.value = false;
        }
    }
};

onMounted(() => {
    checkTokenAndRedirect(); // 直接调用，不需要传递token参数

    if (process.client) {
        const savedAccount = localStorage.getItem("admin_account");
        const savedPassword = localStorage.getItem("admin_password");

        if (savedAccount && savedPassword) {
            admin.value.account = savedAccount;
            admin.value.password = savedPassword;
            rememberMe.value = true;
        }
    }
});

// 优化后的登录处理函数
const handleLogin = async () => {
    // 验证表单
    try {
        await formRef.value?.validate()
    } catch (errors) {
        message.error("请填写正确的登录信息")
        return
    }

    loading.value = true
    const startTime = Date.now()

    try {
        // 设置超时
        const loginPromise = login(admin.value.account, admin.value.password)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("登录请求超时")), 10000)
        )

        const response = await Promise.race([loginPromise, timeoutPromise])

        if (response.code === 200) {
            // 记住账号密码
            if (rememberMe.value) {
                localStorage.setItem("admin_account", admin.value.account)
                localStorage.setItem("admin_password", admin.value.password)
            } else {
                localStorage.removeItem("admin_account")
                localStorage.removeItem("admin_password")
            }

            // 设置token到LocalStorage
            localStorage.setItem("admin_token", response.data.token)

            message.success("登录成功")
            router.push("/admin/dashboard")
        } else {
            // 处理错误响应
            remainingAttempts.value = response.data?.remainingAttempts || remainingAttempts.value - 1

            if (response.data?.lockUntil) {
                cooldown.value = true
                const lockTime = new Date(response.data.lockUntil).getTime()
                const now = Date.now()
                remainingMinutes.value = Math.ceil((lockTime - now) / (1000 * 60))
            }

            message.error(response.msg || "登录失败")
        }
    } catch (error) {
        console.error("登录错误:", error)
        message.error(
            error.message.includes("超时") ? "请求超时，请检查网络" : error.message || "登录失败"
        )
    } finally {
        loading.value = false
        console.log(`登录耗时: ${Date.now() - startTime}ms`)
    }
}
</script>