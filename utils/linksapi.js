import axios from 'axios';

/**
 * 获取友链列表
 * @param {Object} [options] - 可选参数
 * @param {number} [options.page] - 页码
 * @param {number} [options.pageSize] - 每页数量
 * @param {string} [options.keyword] - 搜索关键词
 * @returns {Promise<{code: number, data: Array, count: number, msg: string}>} 友链列表
 */
export const getLinks = async (options = {}) => {
    const requestId = crypto.randomUUID().slice(0, 8);
    try {
        const response = await axios.get(`${API_BASE_URL}/links/search`, {
            params: {
                page: options.page,
                pageSize: options.pageSize,
                keyword: options.keyword
            },
            headers: {
                'X-Request-ID': requestId
            }
        });

        return {
            code: 200,
            data: response.data.data,
            count: response.data.count,
            msg: response.data.msg || '获取成功'
        };
    } catch (error) {
        console.error(`[${requestId}] 获取友链列表错误:`, error);
        throw new Error(error.response?.data?.msg ||
            error.response?.data?.error ||
            '获取友链列表失败');
    }
};

/**
 * 添加友链
 * @param {string} token - JWT 令牌
 * @param {Object} linkData - 友链数据
 * @returns {Promise<{code: number, data: Object, msg: string}>} 操作结果
 */
export const addLink = async (token, linkData) => {
    const requestId = crypto.randomUUID().slice(0, 8);
    try {
        const response = await axios.post(`${API_BASE_URL}/links/add`, linkData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Request-ID': requestId
            }
        });

        return {
            code: 200,
            data: response.data.data,
            msg: response.data.msg || '添加成功'
        };
    } catch (error) {
        console.error(`[${requestId}] 添加友链错误:`, error);
        throw new Error(error.response?.data?.msg ||
            error.response?.data?.error ||
            '添加友链失败');
    }
};

/**
 * 更新友链
 * @param {string} token - JWT 令牌
 * @param {Object} linkData - 友链数据
 * @returns {Promise<{code: number, data: Object, msg: string}>} 操作结果
 */
export const updateLink = async (token, linkData) => {
    const requestId = crypto.randomUUID().slice(0, 8);
    try {
        const response = await axios.put(`${API_BASE_URL}/links/update`, linkData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Request-ID': requestId
            }
        });

        return {
            code: 200,
            data: response.data.data,
            msg: response.data.msg || '更新成功'
        };
    } catch (error) {
        console.error(`[${requestId}] 更新友链错误:`, error);
        throw new Error(error.response?.data?.msg ||
            error.response?.data?.error ||
            '更新友链失败');
    }
};

/**
 * 删除友链
 * @param {string} token - JWT 令牌
 * @param {string} id - 友链ID
 * @returns {Promise<{code: number, msg: string}>} 操作结果
 */
export const deleteLink = async (token, id) => {
    const requestId = crypto.randomUUID().slice(0, 8);
    try {
        const response = await axios.delete(`${API_BASE_URL}/links/delete`, {
            params: { id },
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Request-ID': requestId
            }
        });

        return {
            code: 200,
            msg: response.data.msg || '删除成功'
        };
    } catch (error) {
        console.error(`[${requestId}] 删除友链错误:`, error);
        throw new Error(error.response?.data?.msg ||
            error.response?.data?.error ||
            '删除友链失败');
    }
};