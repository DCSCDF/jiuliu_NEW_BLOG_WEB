// utils/linksapi.js


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
        // 构建查询参数
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.pageSize) params.append('pageSize', options.pageSize);
        if (options.keyword) params.append('keyword', options.keyword);

        const response = await fetch(`${API_BASE_URL}/links/search?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': requestId
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.msg || result.error || '获取友链列表失败');
        }

        return {
            code: 200,
            data: result.data,
            count: result.count,
            msg: result.msg || '获取成功'
        };
    } catch (error) {
        console.error(`[${requestId}] 获取友链列表错误:`, error);
        throw error;
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
        const response = await fetch(`${API_BASE_URL}/links/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Request-ID': requestId
            },
            body: JSON.stringify(linkData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.msg || result.error || '添加友链失败');
        }

        return {
            code: 200,
            data: result.data,
            msg: result.msg || '添加成功'
        };
    } catch (error) {
        console.error(`[${requestId}] 添加友链错误:`, error);
        throw error;
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
        const response = await fetch(`${API_BASE_URL}/links/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Request-ID': requestId
            },
            body: JSON.stringify(linkData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.msg || result.error || '更新友链失败');
        }

        return {
            code: 200,
            data: result.data,
            msg: result.msg || '更新成功'
        };
    } catch (error) {
        console.error(`[${requestId}] 更新友链错误:`, error);
        throw error;
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
        const response = await fetch(`${API_BASE_URL}/links/delete?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Request-ID': requestId
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.msg || result.error || '删除友链失败');
        }

        return {
            code: 200,
            msg: result.msg || '删除成功'
        };
    } catch (error) {
        console.error(`[${requestId}] 删除友链错误:`, error);
        throw error;
    }
};