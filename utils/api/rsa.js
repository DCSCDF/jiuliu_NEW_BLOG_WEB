/**
 * RSA加密工具
 * 生产环境使用RSA加密密码
 */

let JSEncrypt = null
let rsaPublicKey = null
let encryptionEnabled = true

// 动态导入JSEncrypt
const loadJSEncrypt = async () => {
    if (typeof window === 'undefined') return

    if (!JSEncrypt) {
        try {
            const module = await import('jsencrypt')
            JSEncrypt = module.default
        } catch (error) {
            console.error('加载JSEncrypt失败:', error)
            throw new Error('加密模块加载失败')
        }
    }
    return JSEncrypt
}


/**
 * 设置RSA公钥
 */
export const setPublicKey = (publicKey) => {
    rsaPublicKey = publicKey
}

/**
 * 获取当前公钥
 */
export const getPublicKey = () => {
    return rsaPublicKey
}
// rsaEncrypt.js
export const encryptWithRSA = async (data, publicKey) => {
    if (!encryptionEnabled) return data
    if (!publicKey) throw new Error('未提供公钥')
    await loadJSEncrypt()
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    const encrypted = encryptor.encrypt(data)
    if (!encrypted) throw new Error('RSA加密失败')
    return encrypted
}

/**
 * 检查是否支持RSA加密
 */
export const isEncryptionEnabled = () => {
    return encryptionEnabled
}
