// themeOverrides.js
export default {
    common: {
        textColorBase: "white",
        primaryColor: "#3b82f6",  // 标准蓝色
        primaryColorHover: "#60a5fa",  // 浅一点的蓝色
        primaryColorPressed: "#2563eb",  // 深一点的蓝色
        primaryColorSuppl: "#1d4ed8",  // 更深的蓝色
        infoColor: "#93c5fd",  // 浅蓝色
        infoColorHover: "#bfdbfe",  // 更浅的蓝色
        infoColorPressed: "#60a5fa",
        infoColorSuppl: "#3b82f6",
        successColor: "#3b82f6",  // 保持绿色
        successColorHover: "#60a5fa",
        successColorPressed: "#2563eb",
        successColorSuppl: "#1d4ed8",
        warningColor: "#f59e0b",  // 橙色
        warningColorHover: "#fbbf24",
        warningColorPressed: "#d97706",
        warningColorSuppl: "#b45309",
        errorColor: "#ef4444",  // 红色
        errorColorHover: "#f87171",
        errorColorPressed: "#dc2626",
        errorColorSuppl: "#b91c1c"
    },
    Pagination: {
        itemColor: '#ffffff',          // 页码背景色
        itemColorHover: '#f3f4f6',     // 悬停背景色
        itemColorPressed: '#e5e7eb',   // 按下背景色
        itemBorder: '1px solid #e5e7eb', // 边框
        itemBorderHover: '1px solid #d1d5db',
        itemBorderActive: '1px solid #3b82f6', // 当前页边框
        itemTextColor: '#4b5563',      // 文字颜色
        itemTextColorHover: '#1f2937',
        itemTextColorActive: '#3b82f6', // 当前页文字颜色
        itemTextColorDisabled: '#9ca3af',
        itemIconColor: '#6b7280',      // 图标颜色
        itemIconColorHover: '#4b5563',
        itemIconColorActive: '#3b82f6',
        itemIconColorDisabled: '#d1d5db',
        jumperTextColor: '#4b5563',
        jumperTextColorDisabled: '#9ca3af',
    },
    Select: {
        peers: {
            InternalSelection: {
                textColor: '#1f2937',      // 深灰色文字
                border: '1px solid #d1d5db',
                borderHover: '1px solid #93c5fd',  // 蓝色悬停边框
                borderFocus: '1px solid #93c5fd',   // 蓝色聚焦边框
                borderActive: '1px solid #93c5fd',
                boxShadowFocus: '0 0 0 2px rgba(147, 197, 253, 0.5)', // 蓝色聚焦阴影
                boxShadowHover: 'none',
                color: 'white',
                colorActive: 'white',
            },
            InternalSelectMenu: {
                optionColorActive: '#ebf5ff',       // 浅蓝色选中背景
                optionTextColor: '#1f2937',        // 深灰色文字
                optionTextColorActive: '#1f2937',
                optionTextColorPressed: '#1f2937',
                optionCheckColor: '#3b82f6',       // 蓝色勾选标记
                dividerColor: '#e5e7eb',
            }
        }
    },
    Pagination: {
        itemColorActive: '#3b82f6',          // 当前页背景色
        itemTextColorActive: '#ffffff',      // 当前页文字颜色
        itemBorderActive: '1px solid #3b82f6',
        itemColorHover: '#f0f7ff',          // 悬停背景色
        itemTextColorHover: '#3b82f6',       // 悬停文字颜色
        itemSizeMedium: '32px',              // 按钮尺寸
        itemBorder: '1px solid #e5e7eb',    // 默认边框
        jumperTextColor: '#4b5563',
        jumperInputWidth: '60px'
    },
    // 表格组件配置
    DataTable: {
        thColor: '#f9fafb',                 // 表头背景
        tdColor: '#ffffff',                 // 单元格背景
        tdColorHover: '#f8fafc',            // 悬停背景
        borderColor: '#e5e7eb',             // 边框颜色
        paginationMargin: '24px 0 0 0'      // 分页边距
    }
}