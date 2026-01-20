// utils/api/user/auth/authApi.js
import service from '@/utils/request'

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
        this.axiosInstance = service
        this.axiosInstance.defaults.baseURL = baseURL

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

            if (response && typeof response === 'object') {
                const { tempToken, publicKey } = response

                if (publicKey) {
                    console.log('成功获取公钥 (前60字符):', typeof publicKey === 'string'
                        ? publicKey.substring(0, 60) + '...'
                        : '非字符串类型')

                    if (tempToken) {
                        console.log('临时令牌 (前20字符):', typeof tempToken === 'string'
                            ? tempToken.substring(0, 20) + '...'
                            : '非字符串类型')
                    } else {
                        console.log('未返回临时令牌')
                    }

                    return {
                        publicKey: String(publicKey).trim(),
                        tempToken: tempToken ? String(tempToken).trim() : null
                    }
                } else {
                    console.error('公钥接口未返回publicKey字段:', response)
                    throw new Error('公钥数据缺失')
                }
            }

            throw new Error('公钥数据格式错误')

        } catch (error) {
            console.error('获取公钥失败:', error)
            throw error
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

            // response 应该是 token 对象
            if (response && typeof response === 'object') {
                const { token } = response

                if (token) {
                    console.log('登录成功，令牌:', token.substring(0, 20) + '...')
                    return { token }
                } else {
                    console.log('登录成功，但未返回token')
                    return response
                }
            }

            throw new Error('登录响应格式错误')

        } catch (error) {
            console.error('登录失败:', error.message)
            throw error
        }
    }

    async getUserProfile() {
        try {
            console.log('获取用户资料，URL:', this.axiosInstance.defaults.baseURL + '/api/auth/profile')

            const response = await this.axiosInstance.get('/api/auth/profile')
            console.log('用户资料获取成功:', response)

            // 修正：response 应该是用户资料对象
            if (response && typeof response === 'object') {
                const { id, username, nickname, email, avatarUrl, createTime, updateTime } = response

                if (username) {
                    console.log('解析到的用户数据:', {
                        id,
                        username,
                        nickname,
                        email
                    })
                    return response
                } else {
                    console.warn('用户数据缺少必要字段')
                    return response
                }
            }

            throw new Error('用户资料响应格式错误')

        } catch (error) {
            console.error('获取用户资料失败:', error)

            throw error
        }
    }

    /**
       * 用户登出
       * 安全登出：无论用户是否登录，都会尝试调用登出接口
       * @returns {Promise<Object>} 登出结果
       */
    async logout() {
        try {
            console.log('执行登出，URL:', this.axiosInstance.defaults.baseURL + '/api/auth/logout')

            // 尝试调用登出接口
            const response = await this.axiosInstance.post('/api/auth/logout')
            console.log('登出接口响应:', response)

            // 解析响应
            let logoutMessage = '登出成功'
            let wasLoggedIn = true

            if (response && typeof response === 'object') {
                if (response.message) {
                    logoutMessage = response.message
                }
                if (response.wasLoggedIn !== undefined) {
                    wasLoggedIn = response.wasLoggedIn
                }

                console.log(`登出结果: ${logoutMessage}, 原登录状态: ${wasLoggedIn ? '已登录' : '未登录'}`)
            }

            return {
                success: true,
                message: logoutMessage,
                wasLoggedIn: wasLoggedIn,
                logoutTime: Date.now(),
                data: response
            }

        } catch (error) {
            console.warn('登出接口调用异常:', error.message)

            // 安全处理：即使接口调用失败，也视为登出成功
            // 因为用户可能已经处于未登录状态
            let errorMessage = '网络异常，正常跳转'
            let errorType = 'network'

            if (error.response) {
                const { status, data } = error.response
                console.warn('登出响应详情:', { status, data })

                if (status === 401 || status === 403) {
                    errorMessage = '用户未登录或会话已过期'
                    errorType = 'unauthorized'
                } else if (status === 429) {
                    errorMessage = '请求过于频繁'
                    errorType = 'rate_limit'
                } else if (status >= 500) {
                    errorMessage = '服务器异常，但已执行本地登出'
                    errorType = 'server_error'
                }

                if (data && data.message) {
                    errorMessage = data.message
                }
            }

            console.log(`登出处理: ${errorMessage}`)

            return {
                success: true, // 仍然视为成功，因为已经清理了本地状态
                message: errorMessage,
                wasLoggedIn: false, // 发生错误时假设用户未登录
                logoutTime: Date.now(),
                error: errorType,
                originalError: error.message
            }

        } finally {
            // 无论后端登出是否成功，都清理前端状态
            this.cleanupFrontendState()

            // 延迟跳转，让用户看到反馈
            if (typeof window !== 'undefined') {
                setTimeout(() => {
                    console.log('跳转到首页')
                    window.location.href = '/'
                }, 800)
            }
        }
    }

    /**
     * 清理前端状态
     * 无论后端是否成功登出，都要清理前端存储的状态
     */
    cleanupFrontendState() {
        if (typeof window === 'undefined') return

        try {
            // 清理 localStorage
            const keysToRemove = [
                // 'TOKEN',
                // 'USER_INFO',
                // 'MENU',
                // 'PERMISSIONS',
                // 'username',
                // 'profile',
                // 'login_time',
                // 'last_check',
                // 'savedUsername',
                // 'savedEncryptedPassword'
            ]

            keysToRemove.forEach(key => {
                try {
                    localStorage.removeItem(key)
                } catch (e) {
                    // 忽略单个key删除失败
                }
            })

            // 清理所有以特定前缀开头的key
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('admin_') || key.startsWith('SNOWY_')) {
                    try {
                        localStorage.removeItem(key)
                    } catch (e) {
                        // 忽略
                    }
                }
            })

            console.log('前端状态已清理')

        } catch (error) {
            console.warn('清理前端状态时发生错误:', error)
        }
    }
}

export default AdminService