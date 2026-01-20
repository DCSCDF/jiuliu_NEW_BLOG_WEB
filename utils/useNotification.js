// composables/useNotification.js
export const useNotification = () => {
    const notification = reactive({
        show: false,
        type: 'info', // 'success' | 'error' | 'warning' | 'info'
        title: '',
        message: '',
        duration: 3000
    })

    const show = (message, type = 'info', title = '', duration = 3000) => {
        notification.message = message
        notification.type = type
        notification.title = title || getDefaultTitle(type)
        notification.duration = duration
        notification.show = true
    }

    const clear = () => {
        notification.show = false
        notification.message = ''
        notification.title = ''
    }

    const getDefaultTitle = (type) => {
        switch (type) {
            case 'success': return '成功'
            case 'error': return '错误'
            case 'warning': return '警告'
            default: return '提示'
        }
    }

    return {
        notification: readonly(notification),
        show,
        clear
    }
}