import { v4 as uuidv4 } from 'uuid'; // 导入UUID生成唯一请求ID


/** ​
 * 将ArrayBuffer转换为Base64字符串
 * @param {ArrayBuffer} buffer - 需要转换的二进制数据
 * @returns {string} Base64编码的字符串
 */
const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    // 将每个字节转为字符
    bytes.forEach(b => binary += String.fromCharCode(b));
    // 使用浏览器内置方法转为Base64
    return window.btoa(binary);
};


/** ​
 * 密码传输前处理（非存储用哈希）
 * @param {string} password - 用户输入的原始密码
 * @param {string} salt - 服务端提供的盐值
 * @returns {Promise<string>} 传输用的密码哈希(十六进制格式)
 */
const preparePasswordForTransport = async (account, password, salt) => {
    // 严格验证参数
    if (!account || !salt) {
        throw new Error('缺少必要的参数(account或salt)');
    }

    // console.log('前端哈希计算参数:', {
    //     password,
    //     salt,
    //     combinedString: password + salt
    // });

    // 确保使用UTF-8编码
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // 转换为十六进制字符串并确保小写
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b =>
        b.toString(16).padStart(2, '0')
    ).join('').toLowerCase();  // 明确转换为小写

    return hashHex;
}


/** ​
 * 从服务端获取登录盐值
 * @param {string} account - 用户账号
 * @returns {Promise<string>} 服务端返回的盐值
 */
const fetchLoginSalt = async (account) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/auth/salt?account=${encodeURIComponent(account)}`);
        if (!response.ok) throw new Error('获取salt失败');

        const data = await response.json();
        if (!data.data?.salt) throw new Error('无效的salt响应');

        // console.log('[Salt获取]', { account, salt: data.data.salt });

        return data.data.salt;
    } catch (err) {
        console.error('[Salt获取失败]', err);
        throw new Error('无法获取安全参数，请刷新重试');
    }
};


/** ​
 * 使用AES-GCM加密数据
 * @param {string} data - 需要加密的原始数据
 * @param {string} hexKey - 32字节的十六进制格式加密密钥
 * @returns {Promise<{ciphertext: string, iv: string}>} 加密结果和初始向量
 */
export const encryptData = async (data, hexKey) => {
    try {
        // 更灵活的密钥验证（允许16或32字节）
        if (!hexKey || !/^[0-9a-f]+$/i.test(hexKey)) {
            throw new Error('加密密钥格式无效，必须是十六进制字符串');
        }

        // 统一转换为16字节（32字符）密钥
        // 如果密钥是32字节（64字符），取前32字符
        const normalizedKey = hexKey.length > 32 ? hexKey.slice(0, 32) : hexKey.padEnd(32, '0');

        // console.log(`[加密] 使用密钥: ${normalizedKey.slice(0, 6)}...${normalizedKey.slice(-2)} (${normalizedKey.length}字符)`);

        // 将十六进制密钥转换为Uint8Array
        const keyBuffer = new Uint8Array(
            normalizedKey.match(/.{2}/g).map(byte => parseInt(byte, 16))
        );

        // 生成12字节的初始向量(IV)
        const iv = crypto.getRandomValues(new Uint8Array(12));

        // 导入密钥
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        );

        // 执行加密
        const encrypted = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv,
                tagLength: 128
            },
            cryptoKey,
            new TextEncoder().encode(data)
        );

        // 提取认证标签（最后16字节）
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


/** ​
 * 从服务端获取加密密钥
 * @returns {Promise<string>} 十六进制格式的加密密钥
 */
export const fetchEncryptionKey = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/encryption-key`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const { code, data, msg } = await response.json();
        if (code !== 200 || !data?.key) {
            throw new Error(msg || '无效的密钥响应');
        }

        // 移除所有非十六进制字符并转换为小写
        const key = data.key.replace(/[^0-9a-f]/gi, '').toLowerCase();

        // console.log(`[密钥获取] 原始密钥: ${data.key}, 处理后: ${key}`);

        if (!key) {
            throw new Error('无效的密钥格式');
        }

        return key;
    } catch (err) {
        console.error('[密钥获取错误]', err);
        throw new Error('获取加密密钥失败: ' + err.message);
    }
};


/** ​
 * 安全登录实现
 * @param {string} account - 用户账号
 * @param {string} password - 用户密码
 * @returns {Promise<Object>} 登录结果
 */
export const login = async (account, password) => {
    const requestId = uuidv4().slice(0, 8);
    try {
        console.log(`[${requestId}] 开始安全登录流程`);

        // 1. 获取salt（带重试和验证）
        let salt;
        try {
            salt = await fetchLoginSalt(account);
            // console.log(`[${requestId}] 获取到有效salt: ${salt.slice(0, 8)}...`);
        } catch (err) {
            console.error(`[${requestId}] salt获取失败`, err);
            throw new Error('请稍后再试。');
        }

        // 2. 计算传输哈希（严格验证参数）
        let transportHash;
        try {
            transportHash = await preparePasswordForTransport(account, password, salt);
            // console.log(`[${requestId}] 生成传输哈希: ${transportHash.slice(0, 12)}...`);
        } catch (err) {
            console.error(`[${requestId}] 哈希计算失败`, err);
            throw new Error('安全验证失败，请重试');
        }

        // 3. 加密传输数据
        const encryptionKey = await fetchEncryptionKey();
        const encryptedAccount = await encryptData(account, encryptionKey);
        const encryptedPassword = await encryptData(transportHash, encryptionKey);

        console.log(`[${requestId}] 数据加密完成`);

        // 4. 提交登录请求
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Encryption-Key': encryptionKey,
                'X-Request-ID': requestId
            },
            body: JSON.stringify({
                account: encryptedAccount,
                transportHash: encryptedPassword
            })
        });

        const result = await response.json();
        console.log(`[${requestId}] 登录结果:`, result.code);
        return result;

    } catch (err) {
        console.error(`[${requestId}] 登录错误:`, err);
        return {
            code: 500,
            msg: err.message || '登录失败',
            requestId
        };
    }
};


/** ​
 * 检查登录状态
 * @param {string} token - JWT令牌
 * @returns {Promise<{isLoggedIn: boolean, user: Object|null}>} 登录状态和用户信息
 */

// 修改后的 checkLoginStatus 函数
export async function checkLoginStatus(token) {
    const requestId = crypto.randomUUID().slice(0, 8);
    try {
        const response = await fetch(`${API_BASE_URL}/admin/check`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                isLoggedIn: false,
                error: result.msg || 'Token验证失败'
            };
        }

        return {
            isLoggedIn: true,
            user: result.data?.user
        };

    } catch (error) {
        console.error(`[${requestId}] 检查登录状态错误:`, error);
        return {
            isLoggedIn: false,
            error: '网络连接错误'
        };
    }
}


/** ​
 * 用户登出
 * @param {string} token - JWT令牌
 * @returns {Promise<Object>} 登出结果
 */
export async function logout(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return await response.json();
    } catch (error) {
        console.error('登出错误:', error);
        return { code: 500, msg: '网络错误' };
    }
}

