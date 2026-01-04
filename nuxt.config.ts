import { defineNuxtConfig } from 'nuxt/config'
import typography from '@tailwindcss/typography'


export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: {
                lang: 'zh-CN'
            },
            meta: [
                { 'http-equiv': 'Content-Language', content: 'zh-cn' },
            ]
        }
    },

    devtools: { enabled: true },

    modules: [
        '@nuxtjs/tailwindcss',
        '@bg-dev/nuxt-naiveui',

    ],

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

    devServer: {
        port: 3001,
        host: '0.0.0.0'
    },
    // router: {
    //     options: {
    //         history: true
    //     } as {}
    // },
    compatibilityDate: '2025-04-21'
})


