// utils/api/axios.js
import axios from 'axios'

/**
 * 生成唯一的请求ID
 */
const generateRequestId = () => {
    if (typeof window === 'undefined') return ''
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 创建可配置的 axios 实例
 * @param {string} baseURL - API 基础地址
 * @returns {AxiosInstance}
 */
export function createAxiosInstance(baseURL) {
    const instance = axios.create({
        baseURL,
        timeout: 30000,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })

    // 请求拦截器
    instance.interceptors.request.use(
        (config) => {
            if (process.env.NODE_ENV === 'development') {
                console.groupCollapsed(`API 请求: ${config.method?.toUpperCase()} ${config.url}`)
                console.log('请求配置:', {
                    地址: config.url,
                    方法: config.method,
                    数据: config.data,
                    参数: config.params,
                    请求头: config.headers
                })
                console.groupEnd()
            }

            if (typeof window !== 'undefined') {
                const requestId = generateRequestId()
                config.headers['X-Request-ID'] = requestId
                config.headers['X-Client-Time'] = new Date().toISOString()
            }

            if (config.method?.toLowerCase() === 'get' && config.params) {
                config.params = {
                    ...config.params,
                    _t: Date.now()
                }
            }

            if (config.data instanceof FormData) {
                delete config.headers['Content-Type']
            }

            return config
        },
        (error) => {
            console.error('请求拦截器错误:', error)
            return Promise.reject(error)
        }
    )

    // 响应拦截器
    instance.interceptors.response.use(
        (response) => {
            const { data, config, status, statusText } = response

            if (process.env.NODE_ENV === 'development') {
                console.groupCollapsed(`API 响应: ${config.method?.toUpperCase()} ${config.url} (状态码: ${status} ${statusText})`)
                console.log('响应信息:', {
                    状态码: status,
                    状态文本: statusText,
                    响应数据: data,
                    响应头: response.headers
                })
                console.groupEnd()
            }

            const contentType = response.headers['content-type']
            if (contentType && contentType.includes('application/json')) {
                if (data.code !== undefined && data.code !== 200) {
                    // 创建错误对象
                    const error = new Error(data.message)

                    // 附加业务信息
                    error.code = data.code
                    error.data = data.data

                    // 附加原始 response，使前端能通过 error.response 判断来源
                    error.response = {
                        status: data.code,
                        data: data,
                        headers: response.headers,
                        config: response.config
                    }

                    return Promise.reject(error)
                }
                return data.data !== undefined ? data.data : data
            }

            return data
        },
        (error) => {
            if (process.env.NODE_ENV === 'development') {
                console.groupCollapsed(`API 错误: ${error.config?.method?.toUpperCase()} ${error.config?.url}`)
                console.error('错误详情:', {
                    错误信息: error.message,
                    错误堆栈: error.stack,
                    请求配置: error.config,
                    响应信息: error.response
                })
                console.groupEnd()
            }

            if (error.response) {
                const { status, data } = error.response
                const url = error.config?.url
                const method = error.config?.method

                switch (status) {
                    case 400: error.message = data?.message; break
                    case 401: error.message = data?.message; break
                    case 403: error.message = data?.message; break
                    case 404: error.message = data?.message; break
                    case 408: error.message = '请求超时，请检查网络连接'; break
                    case 429: error.message = '请求过于频繁，请稍后重试'; break
                    case 500: error.message = data?.message; break
                    case 502:
                    case 503:
                    case 504: error.message = '服务器暂时不可用，请稍后重试'; break
                    default: error.message = data?.message
                }

                error.status = status
                error.url = url
                error.method = method
            } else if (error.request) {
                error.message = '网络连接失败，请检查网络设置或服务器状态'
            } else if (error.code === 'ECONNABORTED') {
                error.message = '请求超时，请检查网络连接或稍后重试'
            } else {
                error.message = error.message || '请求发送失败'
            }

            return Promise.reject(error)
        }
    )

    return instance
}

