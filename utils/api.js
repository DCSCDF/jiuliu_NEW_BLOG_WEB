// 设置API基础URL，优先使用环境变量中的配置

//后端地址
export const API_BASE_URL = 'https://api.jiuliu.top';

// 从环境变量获取配置  twkioo评论
export const commentConfig = {
    scriptUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.6.7/dist/twikoo.all.min.js",
    apiEndpoint: "https://discuss.jiuliu.top/", //评论后端
}

// 图床
export const LSKY_CONFIG = {
    baseUrl: "https://img.jiuliu.top/api/v1", //图床后端
    email: "3209174373@qq.com",
    password: "q1012414217"
}
// 先定义关键词数组

//SEO数据
export const SEO = {
    title: "JIULIUTOP",
    keywords: [
        '技术博客',
        '博客',
        '前端开发',
        'JavaScript',
        'Nuxt3',
        'Vue',
        'Web开发',
        '编程教程',
        '生活分享',
        '久流'
    ],
    url: "https://jiuliu.top"
}