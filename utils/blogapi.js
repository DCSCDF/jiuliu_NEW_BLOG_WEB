import { v4 as uuidv4 } from 'uuid';

export default class BlogApi {
    /**
     * 生成请求ID
     * @private
     * @returns {string} 请求ID
     */
    _generateRequestId() {
        return uuidv4().slice(0, 8);
    }

    /**
     * 处理API响应
     * @private
     * @param {Response} response - fetch响应对象
     * @returns {Promise<Object>} 解析后的JSON数据
     */
    async _handleResponse(response) {
        const requestId = response.headers.get('X-Request-ID') || this._generateRequestId();

        // 处理401未授权情况
        if (response.status === 401) {
            console.error(`[${requestId}] 认证失败: 请重新登录`);
            window.location.href = '/admin';
            throw new Error('认证过期，请重新登录');
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error(`[${requestId}] API请求失败:`, {
                status: response.status,
                url: response.url,
                error: data.msg || '未知错误'
            });

            const error = new Error(data.msg || `请求失败，状态码: ${response.status}`);
            error.code = response.status;
            error.requestId = requestId;
            throw error;
        }

        return data;
    }

    /**
     * 获取JWT令牌
     * @private
     * @returns {string} JWT令牌
     */
    _getToken() {
        return localStorage.getItem('admin_token') || '';
    }

    /**
     * 构造请求头
     * @private
     * @param {boolean} [withAuth=true] - 是否包含认证头
     * @returns {Object} 请求头
     */
    _getHeaders(withAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
            'X-Request-ID': this._generateRequestId()
        };

        if (withAuth) {
            const token = this._getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }


    /**
     * 用户登出
     * @returns {Promise<Object>} 登出结果
     */
    async logout() {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/logout`, {
                method: 'POST',
                headers: this._getHeaders()
            });

            localStorage.removeItem('admin_token');
            return await this._handleResponse(response);
        } catch (error) {
            console.error('登出错误:', error);
            return { code: 500, msg: '网络错误' };
        }
    }

    /**
     * 添加博客
     * @param {Object} blogData - 博客数据
     * @returns {Promise<Object>} 添加结果
     */
    async addBlog(blogData) {
        try {
            const response = await fetch(`${API_BASE_URL}/blog/add`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(blogData)
            });

            return this._handleResponse(response);
        } catch (error) {
            console.error('添加博客失败:', error);
            throw error;
        }
    }

    /**
     * 更新博客
     * @param {Object} blogData - 博客数据
     * @returns {Promise<Object>} 更新结果
     */
    async updateBlog(blogData) {
        try {
            const response = await fetch(`${API_BASE_URL}/blog/update`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify(blogData)
            });

            return this._handleResponse(response);
        } catch (error) {
            console.error('更新博客失败:', error);
            throw error;
        }
    }

    /**
     * 删除博客
     * @param {string} blogId - 要删除的博客ID
     * @returns {Promise<Object>} 删除结果
     */
    async deleteBlog(blogId) {
        try {
            const response = await fetch(`${API_BASE_URL}/blog/delete?id=${blogId}`, {
                method: 'DELETE',
                headers: this._getHeaders()
            });

            return this._handleResponse(response);
        } catch (error) {
            console.error('删除博客失败:', error);
            throw error;
        }
    }

    /**
     * 搜索博客 - 公开接口，无需认证
     * @param {Object} [params={}] - 搜索参数
     * @returns {Promise<Object>} 搜索结果
     */
    async searchBlogs(params = {}) {
        try {
            const queryString = new URLSearchParams({
                keyword: params.keyword || '',
                categoryId: params.categoryId || 0,
                page: params.page || 1,
                pageSize: params.pageSize || 10
            }).toString();

            const response = await fetch(`${API_BASE_URL}/blog/search?${queryString}`, {
                headers: this._getHeaders(false) // 公开接口不需要认证
            });

            return this._handleResponse(response);
        } catch (error) {
            console.error('搜索博客失败:', error);
            throw error;
        }
    }

    /**
     * 获取博客详情 - 公开接口，无需认证
     * @param {string} blogId - 博客ID
     * @returns {Promise<Object>} 博客详情
     */
    async getBlogDetail(blogId) {
        try {
            const response = await fetch(`${API_BASE_URL}/blog/detail?id=${blogId}`, {
                headers: this._getHeaders(false) // 公开接口不需要认证
            });

            return this._handleResponse(response);
        } catch (error) {
            console.error('获取博客详情失败:', error);
            throw error;
        }
    }

    /**
     * 获取今日新增文章数 - 公开接口，无需认证
     * @returns {Promise<number>} 今日新增文章数
     */
    async getTodayPostCount() {
        try {
            const response = await fetch(`${API_BASE_URL}/blog/today-count`, {
                headers: this._getHeaders(false) // 公开接口不需要认证
            });
            const result = await this._handleResponse(response);
            return result.count || 0;
        } catch (error) {
            console.error('获取今日新增文章数失败:', error);
            throw error;
        }
    }

    /**
     * 获取本周新增文章数 - 公开接口，无需认证
     * @returns {Promise<number>} 本周新增文章数
     */
    async getWeekPostCount() {
        try {
            const response = await fetch(`${API_BASE_URL}/blog/week-count`, {
                headers: this._getHeaders(false) // 公开接口不需要认证
            });
            const result = await this._getHeaders(response);
            return result.count || 0;
        } catch (error) {
            console.error('获取本周新增文章数失败:', error);
            throw error;
        }
    }

    /**
     * 获取文章统计信息 - 公开接口，无需认证
     * @returns {Promise<{total: number, todayAdded: number, weekAdded: number}>} 文章统计信息
     */
    async getPostStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/blog/stats`, {
                headers: this._getHeaders(false) // 公开接口不需要认证
            });
            const result = await this._handleResponse(response);
            return result.data || {
                total: 0,
                todayAdded: 0,
                weekAdded: 0
            };
        } catch (error) {
            console.error('获取文章统计信息失败:', error);
            throw error;
        }
    }
}