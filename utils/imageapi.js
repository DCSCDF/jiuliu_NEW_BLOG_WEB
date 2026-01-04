import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// 配置常量（与后端保持一致）
const IMAGE_API_CONFIG = {
    BASE_URL: API_BASE_URL + '/upload',
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'],
    ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    COMPRESS_QUALITY: 75,
    MAX_WIDTH: 2560,
    MAX_HEIGHT: 1440,
    TIMEOUT: 30000 // 30秒超时
};

/**
 * 上传图片
 * @param {File} file - 要上传的图片文件
 * @param {string} token - JWT认证令牌
 * @param {string} [currentImageUrl] - 当前图片URL（用于替换）
 * @returns {Promise<{url: string, filename: string}>} 上传结果
 */
export const uploadImage = async (file, token, currentImageUrl) => {
    const requestId = uuidv4().slice(0, 8);

    try {
        const formData = new FormData();
        formData.append('files', file, file.name);

        if (currentImageUrl) {
            formData.append('oldImageUrl', currentImageUrl);
        }

        const response = await axios.post(
            `${IMAGE_API_CONFIG.BASE_URL}/rich_editor_upload`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Request-ID': requestId,
                    'Content-Type': 'multipart/form-data'
                },
                timeout: IMAGE_API_CONFIG.TIMEOUT
            }
        );

        if (response.data?.errno !== 0) {
            throw new Error(response.data?.message || '上传失败');
        }

        return {
            url: response.data.data.url,
            filename: response.data.data.url.split('/').pop()
        };

    } catch (error) {
        console.error(`[${requestId}] 上传失败详情:`, {
            error: error.response?.data || error.message,
            config: error.config
        });
        throw new Error(`上传失败: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * 删除服务器上的图片
 * @param {string} filename - 要删除的图片文件名
 * @param {string} token - JWT认证令牌
 * @returns {Promise<{success: boolean, message: string}>} 删除结果
 */
export const deleteImage = async (filename, token) => {
    const requestId = uuidv4().slice(0, 8);

    try {
        const response = await axios.delete(
            `${IMAGE_API_CONFIG.BASE_URL}/delete/${encodeURIComponent(filename)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Request-ID': requestId
                }
            }
        );

        if (response.data?.errno !== 0) {
            throw new Error(response.data?.message || '删除失败');
        }

        return response.data;

    } catch (error) {
        console.error(`[${requestId}] 删除图片失败:`, error);
        throw new Error(`删除图片失败: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * 获取服务器上的图片列表
 * @param {string} [token] - 可选的JWT认证令牌
 * @param {Object} [options] - 选项
 * @param {number} [options.page=1] - 页码
 * @param {number} [options.pageSize=20] - 每页数量
 * @returns {Promise<Array<{filename: string, url: string, size?: number, createdAt?: string}>>} 图片列表
 */
export const getImageList = async (token, options = {}) => {
    const requestId = uuidv4().slice(0, 8);

    try {
        const headers = {
            'X-Request-ID': requestId
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get(
            `${IMAGE_API_CONFIG.BASE_URL}/images`,
            {
                params: {
                    page: options.page || 1,
                    pageSize: options.pageSize || 20
                },
                headers,
                timeout: IMAGE_API_CONFIG.TIMEOUT
            }
        );

        if (response.data?.errno !== 0) {
            throw new Error(response.data?.message || '获取图片列表失败');
        }

        return response.data.data || [];

    } catch (error) {
        console.error(`[${requestId}] 获取列表过程中出错`, error);

        let userMessage = error.message;
        if (error.code === 'ECONNABORTED') {
            userMessage = '获取图片列表超时，请重试';
        }

        throw new Error(`获取图片列表失败: ${userMessage}`);
    }
};

/**
 * 压缩图片（浏览器兼容方案）
 * @param {File|Blob} file - 要压缩的图片文件
 * @param {Object} [options] - 压缩选项
 * @param {number} [options.quality=75] - 压缩质量 (1-100)
 * @param {number} [options.maxWidth=2560] - 最大宽度
 * @param {number} [options.maxHeight=1440] - 最大高度
 * @param {string} [options.type] - 输出类型 (默认保持原类型)
 * @returns {Promise<Blob>} 压缩后的图片Blob对象
 */
export const compressImage = async (file, options = {}) => {
    const requestId = uuidv4().slice(0, 8);

    try {
        const quality = Math.min(Math.max(options.quality || IMAGE_API_CONFIG.COMPRESS_QUALITY, 1), 100);
        const maxWidth = options.maxWidth || IMAGE_API_CONFIG.MAX_WIDTH;
        const maxHeight = options.maxHeight || IMAGE_API_CONFIG.MAX_HEIGHT;
        const outputType = options.type || file.type || 'image/jpeg';

        const img = new Image();
        const imgUrl = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => {
                URL.revokeObjectURL(imgUrl);
                reject(new Error('图片加载失败'));
            };
            img.src = imgUrl;
        });

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const blob = await new Promise((resolve) => {
            canvas.toBlob(
                (blob) => resolve(blob || new Blob([canvas.toDataURL(outputType, quality / 100)], { type: outputType })),
                outputType,
                quality / 100
            );
        });

        URL.revokeObjectURL(imgUrl);
        canvas.remove();

        return blob;

    } catch (error) {
        console.error(`[${requestId}] 压缩过程中出错`, error);

        if (file instanceof Blob) {
            return file;
        }

        throw new Error(`图片压缩失败: ${error.message}`);
    }
};

/**
 * 获取图片URL（用于显示）
 * @param {string} filename - 图片文件名
 * @param {Object} [options] - 选项
 * @param {string} [options.size='original'] - 图片尺寸
 * @param {boolean} [options.cacheBust=false] - 是否添加缓存破坏参数
 * @returns {string} 图片完整URL
 */
export const getImageUrl = (filename, options = {}) => {
    if (!filename) return '';

    const safeFilename = encodeURIComponent(filename);
    const sizeSuffix = options.size && options.size !== 'original' ? `_${options.size}` : '';
    const baseUrl = IMAGE_API_CONFIG.BASE_URL.replace('/api', '');
    const cacheParam = options.cacheBust ? `?v=${Date.now()}` : '';

    return `${baseUrl}/upload/${safeFilename.replace(/(\.\w+)$/, `${sizeSuffix}$1`)}${cacheParam}`;
};

/**
 * 从URL中提取文件名
 * @param {string} url - 图片URL
 * @returns {string} 文件名
 */
export const getFilenameFromUrl = (url) => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.split('/').pop();
    } catch {
        return url.split('/').pop();
    }
};