// plugins/notification.client.js
import { setNotificationHandler } from '@/utils/notification'

export default defineNuxtPlugin(() => {
    /**
     * 原生通知实现（无 UI 库依赖）
     * @param {string} message - 消息内容
     * @param {string} type - 类型: 'info' | 'success' | 'warning' | 'error'
     * @param {string} title - 标题（可选）
     * @param {number} duration - 持续时间（毫秒，仅用于 console 提示，原生 alert 不支持）
     */
    const show = (message, type = 'info', title = '', duration = 3000) => {
        const fullMessage = title ? `${title}: ${message}` : message;
        const prefix = `[${type.toUpperCase()}]`;

        // 方案1: 使用 console.log（推荐，不打断用户）
        console.log(`${prefix} ${fullMessage}`);

        // 方案2: 可选 —— 在开发环境弹出 alert（仅用于调试，生产慎用）
        // if (process.dev) {
        //     alert(`${prefix}\n${fullMessage}`);
        // }

        // 方案3: 可选 —— 使用 Web Notification（需用户授权）
        // if (
        //     typeof Notification !== 'undefined' &&
        //     Notification.permission === 'granted'
        // ) {
        //     new Notification(title || '提示', { body: message, icon: '/icon.png' });
        // } else if (Notification && Notification.permission !== 'denied') {
        //     Notification.requestPermission().then(permission => {
        //         if (permission === 'granted') {
        //             new Notification(title || '提示', { body: message });
        //         }
        //     });
        // }
    };

    // 注入到工具函数（供 utils、store 等非组件环境使用）
    setNotificationHandler({ show });

    // 提供给 Vue 组件通过 this.$notification 或 useNuxtApp().$notification 使用
    return {
        provide: {
            notification: { show }
        }
    };
});