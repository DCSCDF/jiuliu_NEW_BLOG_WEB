import axios from 'axios';
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
     * @param {Object} response - axios响应对象
     * @returns {Object} 处理后的响应数据
     */
    _handleResponse(response) {
        const requestId = response.config.headers['X-Request-ID'] || this._generateRequestId();

        // 处理401未授权情况
        if (response.status === 401) {
            console.error(`[${requestId}] 认证失败: 请重新登录`);
            window.location.href = '/admin';
            throw new Error('认证过期，请重新登录');
        }

        return response.data;
    }

    /**
     * 处理API错误
     * @private
     * @param {Object} error - axios错误对象
     * @throws {Error} 抛出自定义错误
     */
    _handleError(error) {
        const requestId = error.config?.headers['X-Request-ID'] || this._generateRequestId();
        const response = error.response;

        if (response?.status === 401) {
            console.error(`[${requestId}] 认证失败: 请重新登录`);
            window.location.href = '/admin';
            throw new Error('认证过期，请重新登录');
        }

        console.error(`[${requestId}] API请求失败:`, {
            status: response?.status,
            url: error.config?.url,
            error: response?.data?.msg || '未知错误'
        });

        const err = new Error(response?.data?.msg || `请求失败，状态码: ${response?.status || '无响应'}`);
        err.code = response?.status;
        err.requestId = requestId;
        throw err;
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
     * 构造请求配置
     * @private
     * @param {Object} [options={}] - 额外配置选项
     * @param {boolean} [options.withAuth=true] - 是否包含认证头
     * @param {string} [options.method='get'] - 请求方法
     * @param {Object} [options.data] - 请求体数据
     * @param {Object} [options.params] - 查询参数
     * @returns {Object} axios请求配置
     */
    _getConfig(options = {}) {
        const {
            withAuth = true,
            method = 'get',
            data,
            params
        } = options;

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

        return {
            method,
            headers,
            data,
            params
        };
    }

    /**
     * 用户登出
     * @returns {Promise<Object>} 登出结果
     */
    async logout() {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/admin/logout`,
                {},
                this._getConfig()
            );

            localStorage.removeItem('admin_token');
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
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
            const response = await axios.post(
                `${API_BASE_URL}/blog/add`,
                blogData,
                this._getConfig()
            );
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 更新博客
     * @param {Object} blogData - 博客数据
     * @returns {Promise<Object>} 更新结果
     */
    async updateBlog(blogData) {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/blog/update`,
                blogData,
                this._getConfig()
            );
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 删除博客
     * @param {string} blogId - 要删除的博客ID
     * @returns {Promise<Object>} 删除结果
     */
    async deleteBlog(blogId) {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/blog/delete`,
                this._getConfig({
                    params: { id: blogId }
                })
            );
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 切换博客隐藏状态
     * @param {string} blogId - 要切换状态的博客ID
     * @returns {Promise<Object>} 操作结果，包含新的隐藏状态
     */
    async toggleBlogHidden(blogId) {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/blog/toggle-hidden`,
                { id: blogId },
                this._getConfig()
            );
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 搜索博客 - 公开接口，无需认证
     * @param {Object} [params={}] - 搜索参数
     * @returns {Promise<Object>} 搜索结果
     */
    async searchBlogs(params = {}) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/blog/search`,
                this._getConfig({
                    withAuth: false,
                    params: {
                        keyword: params.keyword || '',
                        categoryId: params.categoryId || 0,
                        page: params.page || 1,
                        pageSize: params.pageSize || 10
                    }
                })
            );
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 搜索博客 - 管理员接口，需要认证
     * @param {Object} [params={}] - 搜索参数
     * @returns {Promise<Object>} 搜索结果
     */
    async searchBlogsAdmin(params = {}) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/blog/admin_search`,
                this._getConfig({
                    params: {
                        keyword: params.keyword || '',
                        categoryId: params.categoryId || 0,
                        page: params.page || 1,
                        pageSize: params.pageSize || 10
                    }
                })
            );
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 获取博客详情 - 公开接口，无需认证
     * @param {string} blogId - 博客ID
     * @param {boolean} [admin=false] - 是否以管理员身份获取（可查看隐藏文章）
     * @returns {Promise<Object>} 博客详情
     */
    async getBlogDetail(blogId, admin = false) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/blog/detail`,
                this._getConfig({
                    withAuth: admin,
                    params: {
                        id: blogId,
                        admin: admin ? 'true' : 'false'
                    }
                })
            );
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 获取今日新增文章数 - 公开接口，无需认证
     * @returns {Promise<number>} 今日新增文章数
     */
    async getTodayPostCount() {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/blog/today-count`,
                this._getConfig({ withAuth: false })
            );
            const result = this._handleResponse(response);
            return result.count || 0;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 获取本周新增文章数 - 公开接口，无需认证
     * @returns {Promise<number>} 本周新增文章数
     */
    async getWeekPostCount() {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/blog/week-count`,
                this._getConfig({ withAuth: false })
            );
            const result = this._handleResponse(response);
            return result.count || 0;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 获取文章统计信息 - 公开接口，无需认证
     * @returns {Promise<{total: number, todayAdded: number, weekAdded: number}>} 文章统计信息
     */
    async getPostStats() {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/blog/stats`,
                this._getConfig({ withAuth: false })
            );
            const result = this._handleResponse(response);
            return result.data || {
                total: 0,
                todayAdded: 0,
                weekAdded: 0
            };
        } catch (error) {
            this._handleError(error);
        }
    }
}