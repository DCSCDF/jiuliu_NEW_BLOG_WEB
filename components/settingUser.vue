<template>
    <form @submit.prevent="updateAccount" class="space-y-4">
        <!-- <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
            <input v-model="account.currentPassword" type="password" id="currentPassword"
                class="block py-1.5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-70 placeholder-gray-400/70 pl-3 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="输入当前密码" />
        </div> -->

        <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
            <input v-model="account.newPassword" @input="checkPasswordStrength" type="password" id="newPassword"
                class="block w-full md:w-1/2 md:max-w-96 py-1.5 text-gray-700 bg-white border border-gray-200 rounded-lg placeholder-gray-400/70 pl-3 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="输入新密码" />

            <!-- 密码强度指示器 -->
            <div class="w-52 mt-2">
                <div class="flex items-center space-x-2">
                    <div v-for="i in 3" :key="i" class="h-1.5 rounded-full flex-1" :class="getStrengthClass(i)"></div>
                </div>
                <p class="mt-1 text-xs" :class="strengthTextColor">
                    {{ strengthMessage }}
                </p>
            </div>
        </div>

        <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
            <input v-model="account.confirmPassword" type="password" id="confirmPassword"
                class="block w-full md:w-1/2 md:max-w-96 py-1.5 text-gray-700 bg-white border border-gray-200 rounded-lg placeholder-gray-400/70 pl-3 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="再次输入新密码" />
            <p v-if="showPasswordMismatch" class="mt-1 text-xs text-red-500">两次输入的密码不一致</p>
        </div>

        <button type="submit" :disabled="isSubmitting || !isFormValid"
            class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {{ isSubmitting ? '处理中...' : '更新账户信息' }}
        </button>
    </form>

</template>

<script setup>
import { ref, computed } from 'vue'
import { changePassword } from '../utils/adminapi'
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui'

const message = useMessage()
const router = useRouter();

// 账户设置数据
const account = ref({
    newPassword: '',
    confirmPassword: ''
})

const isSubmitting = ref(false)
const passwordStrength = ref(0) // 0-4表示密码强度
const strengthMessages = ['非常弱', '弱', '中等', '强', '非常强']
const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

// 计算属性
const showPasswordMismatch = computed(() => {
    return account.value.newPassword &&
        account.value.confirmPassword &&
        account.value.newPassword !== account.value.confirmPassword
})

const isFormValid = computed(() => {
    return account.value.newPassword &&
        account.value.confirmPassword &&
        account.value.newPassword === account.value.confirmPassword &&
        passwordStrength.value >= 2 // 至少中等强度
})

const strengthMessage = computed(() => {
    if (!account.value.newPassword) return '密码至少8位，包含大小写字母和数字'
    return `密码强度: ${strengthMessages[passwordStrength.value]}`
})

const strengthTextColor = computed(() => {
    const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500']
    return colors[passwordStrength.value]
})

// 方法
const getStrengthClass = (index) => {
    if (index <= passwordStrength.value) {
        return strengthColors[passwordStrength.value]
    }
    return 'bg-gray-200'
}

const checkPasswordStrength = () => {
    const password = account.value.newPassword
    if (!password) {
        passwordStrength.value = 0
        return
    }

    let strength = 0
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /[0-9]/.test(password)
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password)

    // 长度检查
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++

    // 复杂度检查
    if (hasUpperCase && hasLowerCase) strength++ // 同时有大写和小写
    if (hasNumbers) strength++ // 包含数字
    if (hasSpecialChars) strength++ // 包含特殊字符

    // 多样性加分
    const uniqueCharTypes = [
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChars
    ].filter(Boolean).length

    if (uniqueCharTypes >= 3) strength++ // 使用3种以上字符类型

    // 限制最大强度为4
    passwordStrength.value = Math.min(strength, 4)
}

const updateAccount = async () => {
    if (!isFormValid.value) return;

    isSubmitting.value = true;

    try {
        const token = localStorage.getItem('admin_token');

        if (account.value.newPassword !== account.value.confirmPassword) {
            message.error('新密码与确认密码不一致');
            return;
        }

        // 额外检查密码强度
        if (passwordStrength.value < 2) {
            message.warning('密码强度不足，请使用更复杂的密码');
            return;
        }

        const result = await changePassword(
            account.value.newPassword,
            token
        );

        if (result.code === 200) {
            message.success('密码修改成功，请重新登录');
            account.value = {
                newPassword: '',
                confirmPassword: ''
            };
            localStorage.removeItem('admin_token');
            await router.push({ path: '/admin', replace: true });

        } else {
            message.error(`密码修改失败: ${result.msg}`);
        }
    } catch (error) {
        console.error('密码修改错误:', error);
        message.error(error.message || '密码修改过程中发生错误');
    } finally {
        isSubmitting.value = false;
    }
};
</script>