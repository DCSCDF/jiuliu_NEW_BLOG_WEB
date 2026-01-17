import { defineNuxtConfig } from 'nuxt/config'
import typography from '@tailwindcss/typography'

export default defineNuxtConfig({
    //运行时候的变量环境
    runtimeConfig: {
        //服务器端读取
        public: {
            //服务器和客户端可以读取
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL
        }
    },



    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            htmlAttrs: {
                lang: 'zh-CN'
            },
            meta: [
                { 'http-equiv': 'Content-Language', content: 'zh-cn' },
            ]
        }
    },
    routeRules: {
        '/page/:page': { prerender: true }
    },
    devtools: { enabled: true },
    modules: [
        '@nuxtjs/tailwindcss',
        '@bg-dev/nuxt-naiveui',
        // 'nuxt-module-feed'
        '@nuxtjs/color-mode',
    ],
    colorMode: {
        preference: 'system', // 默认跟随系统
        fallback: 'light',    // 无法检测系统时的回退
        storageKey: 'nuxt-color-mode-scheme', // 明确的存储键
        classSuffix: '',      // 无后缀
        componentName: 'ColorScheme' // 明确组件名
    },

    tailwindcss: {
        config: {
            plugins: [typography],
            content: [
                './components/**/*.{js,vue,ts}',
                './layouts/**/*.vue',
                './pages/**/*.vue',
                './plugins/**/*.{js,ts}',
                './nuxt.config.{js,ts}',
                './app.vue'
            ],
            theme: {
                extend: {
                    typography: {
                        DEFAULT: {
                            css: {
                                color: '#333',
                                a: {
                                    color: '#3b82f6',
                                    '&:hover': {
                                        color: '#2563eb',
                                    },
                                },
                            },
                        },
                    }
                }
            }
        }
    },

    compatibilityDate: '2025-04-21'
})