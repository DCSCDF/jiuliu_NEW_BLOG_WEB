import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

/** 
 * 将ArrayBuffer转换为Base64字符串
 * @param {ArrayBuffer} buffer - 需要转换的二进制数据
 * @returns {string} Base64编码的字符串
 */
const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return window.btoa(binary);
};

/** 
 * 密码传输前处理（非存储用哈希）
 * @param {string} password - 用户输入的原始密码
 * @param {string} salt - 服务端提供的盐值
 * @returns {Promise<string>} 传输用的密码哈希(十六进制格式)
 */
const preparePasswordForTransport = async (account, password, salt) => {
    if (!account || !salt) {
        throw new Error('缺少必要的参数(account或salt)');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b =>
        b.toString(16).padStart(2, '0')
    ).join('').toLowerCase();

    return hashHex;
}

/** 
 * 从服务端获取登录盐值
 * @param {string} account - 用户账号
 * @returns {Promise<string>} 服务端返回的盐值
 */
const fetchLoginSalt = async (account) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/auth/salt`, {
            params: { account }
        });

        if (!response.data?.data?.salt) {
            throw new Error('无效的salt响应');
        }

        return response.data.data.salt;
    } catch (err) {
        console.error('[Salt获取失败]', err);
        throw new Error('无法获取安全参数，请刷新重试');
    }
};

/** 
 * 使用AES-GCM加密数据
 * @param {string} data - 需要加密的原始数据
 * @param {string} hexKey - 32字节的十六进制格式加密密钥
 * @returns {Promise<{ciphertext: string, iv: string}>} 加密结果和初始向量
 */
export const encryptData = async (data, hexKey) => {
    try {
        if (!hexKey || !/^[0-9a-f]+$/i.test(hexKey)) {
            throw new Error('加密密钥格式无效，必须是十六进制字符串');
        }

        const normalizedKey = hexKey.length > 32 ? hexKey.slice(0, 32) : hexKey.padEnd(32, '0');
        const keyBuffer = new Uint8Array(
            normalizedKey.match(/.{2}/g).map(byte => parseInt(byte, 16))
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        );

        const encrypted = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv,
                tagLength: 128
            },
            cryptoKey,
            new TextEncoder().encode(data)
        );

        const ciphertext = encrypted.slice(0, encrypted.byteLength - 16);
        const tag = encrypted.slice(encrypted.byteLength - 16);

        return {
            ciphertext: arrayBufferToBase64(ciphertext),
            iv: arrayBufferToBase64(iv),
            tag: arrayBufferToBase64(tag)
        };
    } catch (err) {
        console.error('[加密错误]', err.message, { hexKey });
        throw new Error('数据加密失败: ' + err.message);
    }
};

/** 
 * 从服务端获取加密密钥
 * @returns {Promise<string>} 十六进制格式的加密密钥
 */
export const fetchEncryptionKey = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/encryption-key`);

        const { code, data, msg } = response.data;
        if (code !== 200 || !data?.key) {
            throw new Error(msg || '无效的密钥响应');
        }

        const key = data.key.replace(/[^0-9a-f]/gi, '').toLowerCase();
        if (!key) {
            throw new Error('无效的密钥格式');
        }

        return key;
    } catch (err) {
        console.error('[密钥获取错误]', err);
        throw new Error('获取加密密钥失败: ' + err.message);
    }
};

/** 
 * 安全登录实现
 * @param {string} account - 用户账号
 * @param {string} password - 用户密码
 * @returns {Promise<Object>} 登录结果
 */
export const login = async (account, password) => {
    const requestId = uuidv4().slice(0, 8);
    try {
        console.log(`[${requestId}] 开始安全登录流程`);

        // 1获取salt
        const salt = await fetchLoginSalt(account);

        // 计算传输哈希
        const transportHash = await preparePasswordForTransport(account, password, salt);

        // 加密传输数据
        const encryptionKey = await fetchEncryptionKey();
        const encryptedAccount = await encryptData(account, encryptionKey);
        const encryptedPassword = await encryptData(transportHash, encryptionKey);

        console.log(`[${requestId}] 数据加密完成`);

        // 提交登录请求
        const response = await axios.post(`${API_BASE_URL}/admin/login`, {
            account: encryptedAccount,
            transportHash: encryptedPassword
        }, {
            headers: {
                'X-Encryption-Key': encryptionKey,
                'X-Request-ID': requestId
            }
        });

        console.log(`[${requestId}] 登录结果:`, response.data.code);
        return response.data;

    } catch (err) {
        console.error(`[${requestId}] 登录错误:`, err);
        return {
            code: 500,
            msg: err.message || '登录失败',
            requestId
        };
    }
};

/** 
 * 检查登录状态
 * @param {string} token - JWT令牌
 * @returns {Promise<{isLoggedIn: boolean, user: Object|null}>} 登录状态和用户信息
 */
export async function checkLoginStatus(token) {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/check`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return {
            isLoggedIn: true,
            user: response.data.data?.user
        };

    } catch (error) {
        // 静默处理错误，不打印到控制台
        return {
            isLoggedIn: false,
            error: error.response?.data?.msg || 'Token验证失败'
        };
    }
}

/**
 * 修改用户密码
 * @param {string} token - JWT令牌
 * @param {string} newPassword - 用户新密码
 * @returns {Promise<Object>} 修改密码结果
 */
export async function changePassword(newPassword, token) {
    const requestId = uuidv4().slice(0, 8);
    try {
        console.log(`[${requestId}] 开始密码修改流程`);

        // 1. 获取用户账号
        const userInfo = await checkLoginStatus(token);
        if (!userInfo.isLoggedIn || !userInfo.user?.account) {
            throw new Error('无法获取用户信息或未登录');
        }
        const account = userInfo.user.account;
        console.log(`[${requestId}] 当前用户账号: ${account}`);

        // 2. 获取加密密钥和盐值
        const [encryptionKey, salt] = await Promise.all([
            fetchEncryptionKey(),
            fetchLoginSalt(account)
        ]);

        // 3. 计算新密码哈希
        const newPasswordHash = await preparePasswordForTransport(
            account,
            newPassword,
            salt
        );

        // 4. 发送修改密码请求
        const response = await axios.post(`${API_BASE_URL}/admin/change-password`, {
            newPasswordHash,
            account
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Request-ID': requestId
            }
        });

        console.log(`[${requestId}] 密码修改成功`, response.data);
        return response.data;

    } catch (error) {
        console.error(`[${requestId}] 密码修改错误:`, error);
        throw new Error(error.response?.data?.msg || '密码修改过程中发生错误');
    }
}

/** 
 * 用户登出
 * @param {string} token - JWT令牌
 * @returns {Promise<Object>} 登出结果
 */
export async function logout(token) {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('登出错误:', error);
        return { code: 500, msg: '网络错误' };
    }
}