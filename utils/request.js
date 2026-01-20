// utils/request.js
import axios from 'axios'
import sysConfig from '@/config/index'
import tool from '@/utils/tool'

// 以下这些code需要重新登录
const reloadCodes = [401, 1011007, 1011008]
const errorCodeMap = {
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。'
}

// 定义一个重新登录弹出窗的变量
let loginBack = false

// 创建 axios 实例
console.log('REQUEST配置: baseURL=', sysConfig.API_URL, 'timeout=', sysConfig.TIMEOUT)
const service = axios.create({

    timeout: sysConfig.TIMEOUT,
    withCredentials: true  // 重要：允许跨域携带 Cookie
})

// HTTP request 拦截器
service.interceptors.request.use(
    (config) => {
        console.log(`请求拦截器: ${config.method?.toUpperCase()} ${config.url}`)

        // 如果是 Cookie 认证，通常不需要手动设置 Authorization header
        // 但保留这段代码，以防后端需要 token
        // const token = tool.data.get('TOKEN')
        // if (token && sysConfig.TOKEN_NAME && sysConfig.TOKEN_PREFIX) {
        //     config.headers[sysConfig.TOKEN_NAME] = sysConfig.TOKEN_PREFIX + token
        //     console.log('已添加Token到请求头')
        // } else if (token) {
        //     // 如果没有配置TOKEN_NAME，使用默认的Authorization
        //     config.headers['Authorization'] = 'Bearer ' + token
        //     console.log('已添加Authorization到请求头')
        // } else {
        //     console.log('未找到本地Token，使用Cookie认证')
        // }

        // 防缓存
        if (!sysConfig.REQUEST_CACHE && config.method === 'get') {
            config.params = config.params || {}
            config.params._ = new Date().getTime()
        }

        // 添加默认headers
        Object.assign(config.headers, sysConfig.HEADERS)

        // 调试信息
        // console.log('请求配置:', {
        //     url: config.url,
        //     method: config.method,
        //     headers: config.headers,
        //     withCredentials: config.withCredentials
        // })

        return config
    },
    (error) => {
        console.error('请求拦截器错误:', error)
        return Promise.reject(error)
    }
)

// 自定义提示函数
const showMessage = (msg, type = 'info') => {
    if (typeof window !== 'undefined') {
        console.log(`[${type.toUpperCase()}]: ${msg}`)

        // // 使用浏览器的 alert 或 confirm
        // if (type === 'warning' || type === 'error') {
        //     alert(msg)
        // }
    }
}

// 自定义确认对话框
const showConfirm = (title, content) => {
    if (typeof window !== 'undefined') {
        return window.confirm(`${title}\n${content}`)
    }
    return false
}

// 保持重新登录Modal的唯一性
const error = () => {
    if (loginBack) return
    loginBack = true

    // const shouldRelogin = showConfirm('提示：', '登录已失效，请重新登录')
    // if (shouldRelogin) {
    //     loginBack = false
    //     tool.data.remove('TOKEN')
    //     tool.data.remove('USER_INFO')
    //     tool.data.remove('MENU')
    //     tool.data.remove('PERMISSIONS')
    //     window.location.reload()
    // } else {
    //     loginBack = false
    // }
}

// HTTP response 拦截器
service.interceptors.response.use(
    (response) => {
        console.log(`响应拦截器: ${response.config.method?.toUpperCase()} ${response.config.url} 状态码: ${response.status}`)

        // 配置了blob，不处理直接返回文件流
        if (response.config.responseType === 'blob') {
            if (response.status === 200) {
                return response
            } else {
                showMessage('文件下载失败或此文件不存在', 'warning')
                return
            }
        }

        const data = response.data
        console.log('原始响应数据:', data)

        // 检查响应格式
        if (!data || typeof data !== 'object') {
            console.error('响应数据格式错误:', data)
            return Promise.reject(new Error('响应数据格式错误'))
        }

        const code = data.code
        const msg = data.msg

        // 处理需要重新登录的code
        if (reloadCodes.includes(code)) {
            console.warn('需要重新登录，code:', code, 'msg:', msg)
            if (!loginBack) {
                error()
            }
            return Promise.reject(data)
        }

        // 处理错误状态码
        if (code !== 200) {
            console.error('业务错误，code:', code, 'msg:', msg)
            const customErrorMessage = response.config.customErrorMessage
            showMessage(customErrorMessage || msg, 'error')
            return Promise.reject(data)
        }

        // 成功提示
        const functionName = response.config.url.split('/').pop()
        const apiNameArray = [
            'add', 'edit', 'delete', 'update', 'grant', 'reset', 'stop',
            'pass', 'disable', 'enable', 'revoke', 'suspend', 'active',
            'turn', 'adjust', 'reject', 'saveDraft'
        ]

        apiNameArray.forEach((apiName) => {
            if (functionName.includes(apiName)) {
                showMessage(msg, 'success')
            }
        })

        console.log('返回数据部分:', data.data)
        return Promise.resolve(data.data)
    },
    (error) => {
        console.error('响应拦截器错误:', error)

        if (error && error.response) {
            const status = error.response.status || 503
            const description = errorCodeMap[status] || '未知错误'

            // console.error({
            //     message: '请求错误',
            //     description,
            //     status,
            //     url: error.config?.url,
            //     responseData: error.response.data
            // })

            // 处理401未授权 - 这是Cookie认证的关键
            if (status === 401) {
                console.log('HTTP 401 未授权，可能是Cookie失效')
                if (!loginBack) {
                    error()
                }
            }

            // 网络错误提示
            if (status >= 500) {
                showMessage(`服务器错误 (${status}): ${description}`, 'error')
            } else if (status >= 400) {
                showMessage(`客户端错误 (${status}): ${description}`, 'warning')
            }

            return Promise.reject({
                status,
                message: description,
                originalError: error,
                response: error.response
            })
        } else if (error && error.request) {
            // 请求已发送但没有收到响应
            console.error('网络连接失败，请检查网络设置')
            showMessage('网络连接失败，请检查网络设置', 'error')
        } else {
            // 请求配置错误
            console.error('请求配置错误:', error.message)
        }

        return Promise.reject(error)
    }
)

export default service