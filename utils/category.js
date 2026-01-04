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
            const response = await fetch(`${API_BASE_URL}/category/list`, {
                headers: this._getHeaders(false) // 公开接口不需要认证
            });
            const result = await this._handleResponse(response);

            // 确保每个分类都有blog_count属性
            if (result.data) {
                result.data = result.data.map(category => ({
                    ...category,
                    blog_count: category.blog_count || 0
                }));
            }

            return result;
        } catch (error) {
            console.error('获取分类列表失败:', error);
            throw error;
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
            const response = await fetch(`${API_BASE_URL}/category/add`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify({ name })
            });
            return this._handleResponse(response);
        } catch (error) {
            console.error('添加分类失败:', error);
            throw error;
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
            const response = await fetch(`${API_BASE_URL}/category/update`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify({ id, name })
            });
            return this._handleResponse(response);
        } catch (error) {
            console.error('更新分类失败:', error);
            throw error;
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
            const response = await fetch(`${API_BASE_URL}/category/delete?id=${id}`, {
                method: 'DELETE',
                headers: this._getHeaders()
            });
            return this._handleResponse(response);
        } catch (error) {
            console.error('删除分类失败:', error);
            throw error;
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
            const response = await fetch(`${API_BASE_URL}/category/check-name?name=${encodeURIComponent(name)}`, {
                headers: this._getHeaders()
            });
            const result = await this._handleResponse(response);
            return result.exists || false;
        } catch (error) {
            console.error('检查分类名称失败:', error);
            throw error;
        }
    }
}