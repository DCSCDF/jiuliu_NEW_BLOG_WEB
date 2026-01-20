
const DEFAULT_CONFIG = {


    // 请求超时
    TIMEOUT: 60000,

    // TokenName // Authorization
    TOKEN_NAME: 'token',

    // Token前缀，注意最后有个空格，如不需要需设置空字符串 // Bearer
    TOKEN_PREFIX: '',

    // 追加其他头
    HEADERS: {},

    // 请求是否开启缓存
    REQUEST_CACHE: false,



    // 登录用户水印
    BLOG_LOGIN_USER_WATERMARK_OPEN: false,

    // 页脚版权信息
    BLOG_FOOTER_COPYRIGHT_OPEN: false,

    // 语言
    LANG: 'zh-cn',



    // // 系统基础配置，这些是数据库中保存起来的
    // SYS_BASE_CONFIG: {
    //     // 默认logo
    //     BLOG_SYS_LOGO: '/img/logo.png',
    //     // 背景图
    //     BLOG_SYS_BACK_IMAGE: '',
    //     // 系统名称
    //     BLOG_SYS_NAME: 'BLOG',
    //     // 版本
    //     BLOG_SYS_VERSION: '3.0',
    //     // 版权
    //     BLOG_SYS_COPYRIGHT: 'BLOG ©2022 Created by jiuliu',
    //     // 版权跳转URL
    //     BLOG_SYS_COPYRIGHT_URL: 'https://www.jiuliu',
    //     // 默认文件存储
    //     BLOG_SYS_DEFAULT_FILE_ENGINE: 'LOCAL',
    //     // 是否开启B端验证码
    //     BLOG_SYS_DEFAULT_CAPTCHA_OPEN_FLAG_FOR_B: 'false',
    //     // 默认重置密码
    //     BLOG_SYS_DEFAULT_PASSWORD: '123456'
    // }
}

export default DEFAULT_CONFIG
