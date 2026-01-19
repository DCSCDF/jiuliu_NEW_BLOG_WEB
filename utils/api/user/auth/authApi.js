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

    // 核心 API 方法

    /**
     * 获取 RSA 公钥（用于前端密码加密）
     * @returns {Promise<string>} Base64 编码的公钥字符串
     */
    async getPublicKey() {
        try {
            console.log('正在获取 RSA 公钥，URL:', this.axiosInstance.defaults.baseURL + '/api/auth/public-key')

            const response = await this.axiosInstance.get('/api/auth/public-key')
            console.log('公钥接口原始响应:', response)

            // 检查是否为429错误（请求过于频繁）
            if (response?.data?.code === 429) {
                const errorMsg = response.data.msg;
                console.warn('公钥接口频率限制:', errorMsg);

                // 创建429错误对象
                const rateLimitError = new Error(errorMsg);
                rateLimitError.response = {
                    status: 429,
                    data: response.data
                };
                throw rateLimitError;
            }

            const responseData = response.data.data;
            const { tempToken, publicKey } = responseData;

            // 返回包含公钥和临时令牌的对象
            return {
                publicKey,
                tempToken
            }
        } catch (error) {
            console.error('获取公钥失败:', error)

            // 统一使用API返回的错误消息
            const errorMessage = error.response?.data?.msg

            showError({
                statusCode: error.response?.data?.code,
                statusMessage: errorMessage,
                message: errorMessage,
                fatal: false
            });

            throw error;
        }
    }



    /**
     * 用户登录（密码必须已加密或为明文）
     * @param {string} username - 用户名
     * @param {string} encryptedPassword - 已加密的密码
     * @param {string} tempToken - 临时令牌
     * @returns {Promise<Object>} 登录响应数据
     */
    async login(username, encryptedPassword, tempToken = null) {
        if (!username || !encryptedPassword) {
            throw new Error('用户名和密码不能为空')
        }

        try {
            console.log('正在登录，用户名:', username.trim())
            if (tempToken) {
                console.log('使用临时令牌登录，令牌:', tempToken.substring(0, 20) + '...')
            }
            console.log('请求URL:', this.axiosInstance.defaults.baseURL + '/api/auth/login')

            // 构建请求体
            const requestBody = {
                username: username.trim(),
                password: encryptedPassword
            }

            if (tempToken) {
                requestBody.tempToken = tempToken
            }

            console.log('登录请求体:', {
                username: requestBody.username,
                tempToken: tempToken ? tempToken.substring(0, 20) + '...' : '未提供',
                password: '[已加密]'
            })

            const response = await this.axiosInstance.post('/api/auth/login', requestBody)
            console.log('登录接口原始响应:', response)

            // 修复：从response.data中获取业务状态码
            const responseData = response.data
            const businessCode = responseData?.code
            const businessMsg = responseData?.msg

            console.log('业务状态码:', businessCode, '消息:', businessMsg)

            // 检查业务状态码
            if (businessCode === 400) {
                console.warn('用户名或密码错误，业务状态码400:', businessMsg)

                const loginError = new Error(businessMsg)
                loginError.response = {
                    status: 400,
                    data: responseData
                }
                throw loginError
            }

            if (businessCode !== 200) {
                const errorMsg = businessMsg
                console.error('登录业务状态码异常:', businessCode, errorMsg)

                const loginError = new Error(errorMsg)
                loginError.response = {
                    status: businessCode || 500,
                    data: responseData
                }
                throw loginError
            }

            // 提取登录成功数据
            const loginData = responseData?.data
            if (!loginData) {
                console.warn('登录成功但返回数据为空')
            } else {
                console.log('登录成功，令牌:', loginData.token ? loginData.token.substring(0, 20) + '...' : '无令牌')
            }

            // 保存用户数据（保存用户名到本地存储）
            this.saveUserData({
                username: username.trim(),
                token: loginData?.token, // 保存token
                updateTime: new Date().toISOString()
            })

            return loginData
        } catch (error) {
            console.error('登录失败:', error.message)

            if (error.response) {
                console.error('登录错误响应详情:', {
                    状态码: error.response.status,
                    业务码: error.response.data?.code,
                    消息: error.response.data?.msg
                })
            }

            this.clearUserData()
            throw error
        }
    }

    async getUserProfile() {
        try {
            console.log('获取用户资料，URL:', this.axiosInstance.defaults.baseURL + '/api/auth/profile')

            const response = await this.axiosInstance.get('/api/auth/profile')
            console.log('用户资料获取成功:', response)

            // 检查业务状态码
            if (response?.code === 401) {
                console.warn('用户未登录，业务状态码401:', response.msg)
                this.clearUserData()

                // 创建统一的错误对象
                const authError = new Error(response.msg)
                authError.response = {
                    status: 401,
                    data: response
                }
                throw authError
            }

            // 检查是否为成功状态码
            if (response?.code !== 200) {
                const errorMsg = response?.msg
                console.error('业务状态码异常:', response?.code, errorMsg)
                throw new Error(errorMsg)
            }

            // 提取用户数据
            const userProfile = response?.data
            if (!userProfile) {
                console.warn('用户数据为空，但状态码为200')
            } else {
                console.log('解析到的用户数据:', {
                    id: userProfile.id,
                    username: userProfile.username,
                    nickname: userProfile.nickname
                })
            }

            // 保存用户资料
            this.saveProfile(userProfile)
            return userProfile

        } catch (error) {
            console.error('获取用户资料失败:', error)

            if (error.response) {
                console.error('用户资料响应详情:', {
                    状态码: error.response.status,
                    业务码: error.response.data?.code,
                    消息: error.response.data?.msg
                })

                // 处理401未授权（包括HTTP状态码和业务状态码）
                if (error.response.data?.code === 401) {
                    console.log('检测到未授权，清除用户数据')
                    this.clearUserData()

                    // 重定向到登录页
                    if (typeof window !== 'undefined') {
                        window.location.href = '/'
                    }
                }
            }

            throw error
        }
    }

    async logout() {
        try {
            console.log('执行登出，URL:', this.axiosInstance.defaults.baseURL + '/api/auth/logout')
            await this.axiosInstance.post('/api/auth/logout')
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

    // 本地存储管理

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

    // 工具方法 

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