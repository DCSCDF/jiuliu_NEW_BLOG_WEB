// utils/api/adminService.js
import { createAxiosInstance } from '@/utils/api/axios'

/**
 * 用户认证服务
 * 后端通过 Cookie 自动管理认证
 */
class AdminService {
    /**
     * 构造函数
     * @param {string} baseURL - API 基础地址，由调用方（如 Vue 组件）传入
     */
    constructor(baseURL) {
        // 创建专属 axios 实例
        this.axiosInstance = createAxiosInstance(baseURL)

        // localStorage 键名
        this.usernameKey = 'username'
        this.profileKey = 'profile'
        this.loginTimeKey = 'login_time'
        this.lastCheckKey = 'last_check'

        // 调试信息
        console.log('AdminService 初始化完成')
        console.log('使用的 baseURL:', baseURL)
    }

    // ==================== 核心 API 方法 ====================

    /**
     * 获取 RSA 公钥（用于前端密码加密）
     * @returns {Promise<string>} Base64 编码的公钥字符串
     */
    async getPublicKey() {
        try {
            console.log('正在获取 RSA 公钥，URL:', this.axiosInstance.defaults.baseURL + '/auth/public-key')

            const response = await this.axiosInstance.get('/auth/public-key')

            console.log('公钥接口原始响应:', response)

            // ✅ 修正：response 本身就是 { publicKey: "..." }
            const publicKey = response?.publicKey

            if (!publicKey || typeof publicKey !== 'string' || publicKey.length < 100) {
                throw new Error('无效的公钥数据')
            }

            console.log('成功获取公钥 (前60字符):', publicKey.substring(0, 60) + '...')
            return publicKey
        } catch (error) {
            console.error('获取公钥失败:', error)
            showError({
                statusCode: 500,
                statusMessage: '获取公钥失败',
                message: error,
                fatal: false
            })
            if (error.response) {
                console.error('公钥接口错误响应:', error.response)
            }
            throw new Error('无法获取加密公钥，请刷新页面重试')
        }
    }


    /**
     * 用户登录（密码必须已加密或为明文）
     * @param {string} username - 用户名
     * @param {string} encryptedPassword - 已加密的密码（或明文，若未启用加密）
     * @returns {Promise<Object>} 登录响应数据
     */
    async login(username, encryptedPassword) {
        if (!username || !encryptedPassword) {
            throw new Error('用户名和密码不能为空')
        }

        try {
            console.log('正在登录，用户名:', username.trim())
            console.log('请求URL:', this.axiosInstance.defaults.baseURL + '/auth/login')

            const userData = await this.axiosInstance.post('/auth/login', {
                username: username.trim(),
                password: encryptedPassword // 直接使用传入的密码（应已加密）
            })

            console.log('登录响应:', userData)

            if (!userData?.username) {
                throw new Error('登录响应缺少用户信息')
            }

            this.saveUserData({
                username: userData.username,
                updateTime: userData.updateTime
            })

            return userData
        } catch (error) {
            console.error('登录失败:', error.message)

            if (error.response) {
                console.error('登录错误响应:', error.response.data)
            }
            this.clearUserData()
            throw error
        }
    }



    async checkLoginStatus() {
        try {
            console.log('检查登录状态，URL:', this.axiosInstance.defaults.baseURL + '/auth/is-logged-in')

            const response = await this.axiosInstance.get('/auth/is-logged-in')

            console.log('登录状态检查结果:', response)

            const loggedIn = response.loggedIn === true

            console.log('解析后的登录状态:', loggedIn)

            if (!loggedIn) {
                this.clearUserData()
                return {
                    isLoggedIn: false,
                    error: '用户未登录',
                    shouldRedirect: true
                }
            }

            this.updateLastCheckTime()

            return {
                isLoggedIn: true,
                username: this.getUsername(),
                loginTime: this.getLoginTime()
            }
        } catch (error) {
            console.error('检查登录状态失败:', error)
            showError({
                statusCode: 500,
                statusMessage: '检查登录状态失败',
                message: error,
                fatal: false
            })
            if (error.response) {
                console.error('状态检查响应:', error.response.status, error.response.data)
            }

            if (error.status === 401 || error.response?.status === 401) {
                this.clearUserData()
                return {
                    isLoggedIn: false,
                    error: '登录已过期，请重新登录',
                    shouldRedirect: true
                }
            }

            return {
                isLoggedIn: false,
                error: error.message,
                shouldRedirect: false
            }
        }
    }

    async getUserProfile() {
        try {
            console.log('获取用户资料，URL:', this.axiosInstance.defaults.baseURL + '/auth/profile')

            const profile = await this.axiosInstance.get('/auth/profile')

            console.log('用户资料获取成功:', profile)

            this.saveProfile(profile)
            return profile
        } catch (error) {
            console.error('获取用户资料失败:', error)
            if (error.response) {
                console.error('用户资料响应:', error.response.status, error.response.data)
            }

            if (error.status === 401 || error.response?.status === 401) {
                this.clearUserData()
            }

            throw error
        }
    }

    async logout() {
        try {
            console.log('执行登出，URL:', this.axiosInstance.defaults.baseURL + '/auth/logout')
            await this.axiosInstance.post('/auth/logout')
            console.log('后端登出接口调用成功')
        } catch (error) {
            console.warn('登出接口调用失败:', error.message)
            if (error.response) {
                console.warn('登出响应:', error.response.status, error.response.data)
            }
        } finally {
            this.clearUserData()

            if (typeof window !== 'undefined') {
                setTimeout(() => {
                    window.location.href = '/user'
                }, 300)
            }

            return { success: true }
        }
    }

    // ==================== 本地存储管理 ====================

    saveUserData(userData) {
        if (typeof window === 'undefined') return

        if (userData.username) {
            localStorage.setItem(this.usernameKey, userData.username)
        }

        if (userData.updateTime) {
            const profile = {
                updateTime: userData.updateTime,
                ...userData
            }
            localStorage.setItem(this.profileKey, JSON.stringify(profile))
        }

        const loginTime = Date.now()
        localStorage.setItem(this.loginTimeKey, loginTime.toString())
        this.updateLastCheckTime()
    }

    clearUserData() {
        if (typeof window === 'undefined') return

        localStorage.removeItem(this.usernameKey)
        localStorage.removeItem(this.profileKey)
        localStorage.removeItem(this.loginTimeKey)
        localStorage.removeItem(this.lastCheckKey)

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('admin_')) {
                localStorage.removeItem(key)
            }
        })
    }

    getUsername() {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(this.usernameKey)
    }

    getLoginTime() {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(this.loginTimeKey)
    }

    getProfile() {
        if (typeof window === 'undefined') return null

        const profileStr = localStorage.getItem(this.profileKey)
        if (!profileStr) return null

        try {
            return JSON.parse(profileStr)
        } catch (error) {
            return null
        }
    }

    saveProfile(profile) {
        if (typeof window === 'undefined') return

        if (profile) {
            const currentProfile = this.getProfile() || {}
            const updatedProfile = {
                ...currentProfile,
                ...profile
            }

            localStorage.setItem(this.profileKey, JSON.stringify(updatedProfile))

            if (profile.username) {
                localStorage.setItem(this.usernameKey, profile.username)
            }
        }
    }

    updateLastCheckTime() {
        if (typeof window === 'undefined') return
        localStorage.setItem(this.lastCheckKey, Date.now().toString())
    }

    // ==================== 工具方法 ====================

    async initialize() {
        console.log('初始化认证状态...')
        console.log('本地用户名:', this.getUsername())

        if (this.getUsername()) {
            try {
                console.log('有本地缓存，检查登录状态...')
                const status = await this.checkLoginStatus()
                console.log('登录状态检查结果:', status)
                return status
            } catch (error) {
                console.error('初始化检查登录状态失败:', error)
                return { isLoggedIn: false, error: error.message }
            }
        }

        console.log('未检测到本地登录信息')
        return { isLoggedIn: false, error: '未检测到登录信息' }
    }

    getCurrentUser() {
        if (typeof window === 'undefined') return null

        return {
            username: this.getUsername(),
            profile: this.getProfile(),
            loginTime: localStorage.getItem(this.loginTimeKey)
        }
    }
}

export default AdminService