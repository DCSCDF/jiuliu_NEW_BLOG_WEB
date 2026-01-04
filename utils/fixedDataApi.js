import axios from 'axios';

/**
 * 获取固定数据
 * @param {string} key - 固定数据的key
 * @returns {Promise<{code: number, data: Object, msg: string}>} 操作结果
 */
export const getFixedData = async (key) => {
    const requestId = crypto.randomUUID().slice(0, 8);
    try {
        const response = await axios.get(`${API_BASE_URL}/settings/${encodeURIComponent(key)}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': requestId
            }
        });

        return {
            code: 200,
            data: response.data.data,
            msg: response.data.msg || '获取成功',
            requestId
        };
    } catch (error) {
        console.error(`[${requestId}] 获取固定数据错误:`, error);
        throw new Error(
            error.response?.data?.msg ||
            error.response?.data?.error ||
            '获取固定数据失败'
        );
    }
};

/**
 * 更新固定数据
 * @param {string} token - JWT 令牌
 * @param {string} key - 固定数据的key
 * @param {Object} data - 更新数据
 * @param {string} data.content - 内容
 * @param {string} [data.format] - 格式 (可选)
 * @returns {Promise<{code: number, data: Object, msg: string}>} 操作结果
 */
export const updateFixedData = async (token, key, data) => {
    const requestId = crypto.randomUUID().slice(0, 8);
    try {
        // 验证必填字段
        if (!data.content) {
            throw new Error('内容不能为空');
        }

        const response = await axios.put(
            `${API_BASE_URL}/settings/${encodeURIComponent(key)}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Request-ID': requestId
                }
            }
        );

        return {
            code: 200,
            data: response.data.data,
            msg: response.data.msg || '更新成功',
            requestId
        };
    } catch (error) {
        console.error(`[${requestId}] 更新固定数据错误:`, error);
        throw new Error(
            error.response?.data?.msg ||
            error.response?.data?.error ||
            '更新固定数据失败'
        );
    }
};