// utils/notification.js
let notificationHandler = null

// 设置全局通知处理器
export const setNotificationHandler = (handler) => {
    notificationHandler = handler
}

// 显示通知
export const showNotification = (message, type = 'info', title = '', duration = 3000) => {
    if (notificationHandler) {
        notificationHandler.show(message, type, title, duration)
    } else {
        // 备用：在控制台显示
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`)
    }
}

// 快捷方法
export const notify = {
    success: (message, title = '成功', duration = 3000) => 
        showNotification(message, 'success', title, duration),
    
    error: (message, title = '错误', duration = 5000) => 
        showNotification(message, 'error', title, duration),
    
    warning: (message, title = '警告', duration = 4000) => 
        showNotification(message, 'warning', title, duration),
    
    info: (message, title = '提示', duration = 3000) => 
        showNotification(message, 'info', title, duration)
}