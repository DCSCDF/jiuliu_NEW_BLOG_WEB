
//后端地址 https://api.jiuliu.top http://127.0.0.1:8080
export const API_BASE_URL = 'http://127.0.0.1:8080';

// 从环境变量获取配置  twkioo评论
export const commentConfig = {
    scriptUrl: "/Comment/Comment.js",
    apiEndpoint: "https://discuss.jiuliu.top/", //评论后端
}

import { getFixedData } from "./fixedDataApi"
// 获取站点信息
export const LSKY_CONFIG = {
    baseUrl: "",
    email: "",
    password: "",
    _initialized: false
};

export const initLskyConfig = async () => {
    try {
        const response = await getFixedData('lsky_account');

        if (response.code === 200 && response.data) {
            // 安全解析JSON
            const content = typeof response.data.content === 'string'
                ? JSON.parse(response.data.content)
                : response.data.content;

            // 更新配置
            Object.assign(LSKY_CONFIG, {
                baseUrl: content.api_url || "",
                email: content.email || "",
                password: content.password || "",
                _initialized: true
            });
        }
    } catch (err) {
        console.error('初始化图床配置失败:', err);
        throw new Error('配置初始化失败');
    }
};

// SEO 配置对象
export const SEO = {
    title: "",
    keywords: [],
    url: "",
    _initialized: false
};

// 初始化SEO配置
export const initSeoConfig = async () => {
    try {
        const response = await getFixedData('seo_message');
        if (response.code === 200 && response.data) {
            let content;
            const rawContent = response.data.content;
            if (typeof rawContent === 'object' && rawContent !== null) {
                content = rawContent;
            }
            else if (typeof rawContent === 'string' && rawContent.trim().startsWith('{')) {
                try {
                    content = JSON.parse(rawContent);
                } catch (jsonError) {
                    try {
                        content = new Function('return ' + rawContent)();
                    } catch (evalError) {
                        console.error('JSON:', evalError);
                        content = {};
                    }
                }
            }
            else {
                content = {};
            }
            Object.assign(SEO, {
                title: content.title || "",
                keywords: Array.isArray(content.keywords) ? content.keywords : [''],
                url: content.url || "",
                _initialized: true
            });
        }
    } catch (err) {
        console.error('初始化SEO配置失败:', err);
        Object.assign(SEO, {
            title: "",
            keywords: [''],
            url: "",
            _initialized: true
        });
    }
};

// 获取SEO配置的快捷方式（确保已初始化）
export const getSeoConfig = async () => {
    if (!SEO._initialized) {
        await initSeoConfig();
    }
    return {
        title: SEO.title,
        keywords: SEO.keywords,
        url: SEO.url
    };
};
