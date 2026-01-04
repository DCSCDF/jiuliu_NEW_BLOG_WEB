import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default class CategoryService {
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
     * 获取分类列表（公开接口，无需认证）
     * @returns {Promise<{
     *   data: Array<{
     *     id: string,
     *     name: string,
     *     blog_count: number,
     *     create_time: number,
     *     formatted_create_time: string
     *   }>,
     *   total: number,
     *   requestId: string
     * }>} 分类列表
     */
    async getCategoryList() {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/category/list`,
                this._getConfig({ withAuth: false })
            );

            const result = this._handleResponse(response);

            // 确保每个分类都有blog_count属性
            if (result.data) {
                result.data = result.data.map(category => ({
                    ...category,
                    blog_count: category.blog_count || 0
                }));
            }

            return result;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 添加分类（需要管理员权限）
     * @param {string} name - 分类名称
     * @returns {Promise<{
     *   code: number,
     *   msg: string,
     *   categoryId: string,
     *   create_time: number,
     *   requestId: string
     * }>} 添加结果
     */
    async addCategory(name) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/category/add`,
                { name },
                this._getConfig()
            );
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 更新分类（需要管理员权限）
     * @param {string} id - 分类ID
     * @param {string} name - 新分类名称
     * @returns {Promise<{
     *   code: number,
     *   msg: string,
     *   requestId: string
     * }>} 更新结果
     */
    async updateCategory(id, name) {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/category/update`,
                { id, name },
                this._getConfig()
            );
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 删除分类（需要管理员权限，会检查分类下是否有文章）
     * @param {string} id - 要删除的分类ID
     * @returns {Promise<{
     *   code: number,
     *   msg: string,
     *   requestId: string
     * }>} 删除结果
     * @throws {Error} 如果分类下有文章会抛出错误
     */
    async deleteCategory(id) {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/category/delete`,
                this._getConfig({
                    params: { id }
                })
            );
            return this._handleResponse(response);
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * 检查分类名称是否已存在（需要管理员权限）
     * @param {string} name - 要检查的分类名称
     * @returns {Promise<{
     *   exists: boolean,
     *   requestId: string
     * }>} 是否存在
     */
    async checkCategoryNameExists(name) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/category/check-name`,
                this._getConfig({
                    params: { name }
                })
            );
            const result = this._handleResponse(response);
            return result.exists || false;
        } catch (error) {
            this._handleError(error);
        }
    }
}