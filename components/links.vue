<template>
    <!-- 链接管理内容 -->
    <h2 class="text-2xl mb-4 font-semibold text-gray-800">友情链接管理</h2>
    <p class="text-gray-600 mb-6">这里是友情链接管理页面，您可以添加、编辑和删除友情链接。</p>

    <!-- 搜索和操作区域 -->
    <div class="mb-6 md:flex md:items-center md:justify-between">
        <div class="relative flex items-center mt-4 md:mt-0">
            <span class="absolute">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 mx-3 text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </span>
            <input type="text" v-model="searchKeyword" @keyup.enter="fetchLinks"
                class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="搜索链接名称或URL" />
        </div>

        <div class="flex items-center gap-4 mt-4 md:mt-0">
            <button @click="addNewLink"
                class="flex items-center justify-center px-3 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 gap-x-2 hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>添加链接</span>
            </button>
        </div>
    </div>

    <!-- 链接表格 -->
    <div class="flex flex-col mt-6">
        <div class="overflow-x-auto">
            <div class="inline-block min-w-full py-2 align-middle">
                <!-- 当有数据时显示表格 -->
                <div v-if="linkList.length > 0" class="overflow-hidden border border-gray-200 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500">
                                    <div class="flex items-center gap-x-3">
                                        <span>链接名称</span>
                                    </div>
                                </th>
                                <th scope="col"
                                    class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                    链接URL
                                </th>
                                <th scope="col"
                                    class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                    图片
                                </th>
                                <th scope="col"
                                    class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                    创建时间
                                </th>
                                <th scope="col" class="relative py-3.5 px-4">
                                    <span class="sr-only">操作</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(link, index) in linkList" :key="index">
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                    <div>
                                        <h2 class="font-medium text-gray-800">{{ link.title }}</h2>
                                        <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ link.content }}</p>
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <a :href="link.url" target="_blank" rel="noopener noreferrer"
                                        class="text-blue-500 hover:underline">{{ link.url }}</a>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <img v-if="link.img_url" :src="link.img_url" alt="链接图片"
                                        class="w-10 h-10 object-cover rounded" @error="handleImageError" />
                                    <span v-else class="text-gray-400">无图片</span>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    {{ new Date(link.create_time).toLocaleString() }}
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <div class="flex items-center gap-x-6">
                                        <button @click="editLink(link)"
                                            class="text-gray-500 transition-colors duration-200 hover:text-blue-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <button @click="deleteLink(link)"
                                            class="text-gray-500 transition-colors duration-200 hover:text-red-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 当无数据时显示空状态 -->
                <div v-else class="flex items-center mt-6 text-center border rounded-lg h-72 ">
                    <div class="flex flex-col w-full max-w-sm px-4 mx-auto">
                        <div class="p-3 mx-auto text-blue-500 bg-blue-100 rounded-full ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <h1 class="mt-3 text-lg text-gray-800">未找到链接</h1>
                        <p class="mt-2 text-gray-500">
                            {{ searchKeyword ? `搜索"${searchKeyword}"未找到匹配链接` : '当前没有链接数据' }}
                        </p>
                        <div class="flex items-center mt-4 sm:mx-auto gap-x-3">
                            <button @click="searchKeyword = ''; fetchLinks()"
                                class="w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg sm:w-auto">
                                清除搜索
                            </button>

                            <button @click="addNewLink"
                                class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>添加链接</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 分页 -->
    <div class="mt-6 sm:flex sm:items-center sm:justify-between">
        <div class="text-sm text-gray-500">
            共 <span class="font-medium text-gray-700">{{ pagination.itemCount }}</span> 条
        </div>
        <div class="flex items-center mt-4 gap-x-4 sm:mt-0">
            <button @click="handlePageChange(pagination.page - 1)" :disabled="pagination.page <= 1"
                class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <span>上一页</span>
            </button>
            <button @click="handlePageChange(pagination.page + 1)"
                :disabled="pagination.page * pagination.pageSize >= pagination.itemCount"
                class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100">
                <span>下一页</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </button>
        </div>
    </div>

    <!-- 添加/编辑链接模态框 -->
    <n-modal :theme-overrides="themeOverrides" v-model:show="showModal" preset="card" :title="modalTitle"
        style="width: 80%; max-width: 600px" class="rounded-xl">
        <template #default>
            <n-form ref="formRef" :model="currentLink" :rules="formRules">
                <n-form-item label="链接名称" path="title">
                    <n-input :theme-overrides="themeOverrides" v-model:value="currentLink.title" placeholder="请输入链接名称"
                        class="rounded-lg" />
                </n-form-item>
                <n-form-item label="链接描述" path="content">
                    <n-input :theme-overrides="themeOverrides" v-model:value="currentLink.content" placeholder="请输入链接描述"
                        class="rounded-lg" type="textarea" :autosize="{ minRows: 2 }" />
                </n-form-item>
                <n-form-item label="链接URL" path="url">
                    <n-input :theme-overrides="themeOverrides" v-model:value="currentLink.url"
                        placeholder="请输入链接URL (包含http://或https://)" class="rounded-lg" />
                </n-form-item>
                <n-form-item label="图片URL" path="img_url">
                    <n-input :theme-overrides="themeOverrides" v-model:value="currentLink.img_url"
                        placeholder="请输入图片URL (可选)" class="rounded-lg" />
                    <template #feedback>
                        <div class="text-xs text-gray-400 mt-1">建议图片尺寸为120x60像素</div>
                    </template>
                </n-form-item>
                <div v-if="currentLink.img_url" class="mb-4">
                    <p class="text-sm text-gray-500 mb-2">图片预览:</p>
                    <img :src="currentLink.img_url" alt="链接图片预览" class="max-w-full h-auto rounded border"
                        @error="handleImageError" />
                </div>
            </n-form>

            <div class="flex justify-end gap-3 mt-4">
                <n-button :theme-overrides="themeOverrides" @click="showModal = false"
                    class="text-gray-600 hover:bg-gray-100 transition-colors">
                    取消
                </n-button>
                <n-button :theme-overrides="themeOverrides" type="primary" @click="handleSubmit" :loading="submitting"
                    class="bg-blue-500 hover:bg-blue-600 transition-colors">
                    {{ isEditMode ? '更新' : '添加' }}
                </n-button>
            </div>
        </template>
    </n-modal>

    <!-- 删除确认对话框 -->
    <n-modal v-model:show="showDeleteConfirm" preset="dialog" title="确认删除" class="rounded-xl">
        <template #header>
            <div class="text-lg font-medium text-gray-800">确认删除链接</div>
        </template>
        <div class="py-4 text-gray-600">
            确定要删除链接 "{{ currentLink.title }}" 吗？
        </div>
        <template #action>
            <div class="flex justify-end gap-3">
                <n-button @click="showDeleteConfirm = false" class="text-gray-600 hover:bg-gray-100 transition-colors">
                    取消
                </n-button>
                <n-button type="error" @click="confirmDelete" :loading="deleting"
                    class="bg-red-500 hover:bg-red-600 transition-colors">
                    确认删除
                </n-button>
            </div>
        </template>
    </n-modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { NButton, NModal, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { getLinks, addLink, updateLink, deleteLink as apiDeleteLink } from '../utils/linksapi'
import themeOverrides from "../themeOverrides";

// 初始化消息组件
const message = useMessage()

// 数据状态
const linkList = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const submitting = ref(false)
const deleting = ref(false)

const currentLink = ref({
    id: '',
    title: '',
    content: '',
    url: '',
    img_url: ''
})

// 分页配置
const pagination = ref({
    page: 1,
    pageSize: 10,
    itemCount: 0
})

// 表单验证规则
const formRules = {
    title: {
        required: true,
        message: '请输入链接名称',
        trigger: 'blur'
    },
    url: {
        required: true,
        message: '请输入链接URL',
        trigger: 'blur',
        validator: (rule, value) => {
            if (!value) return false
            return value.startsWith('http://') || value.startsWith('https://')
                ? true
                : new Error('URL必须以http://或https://开头')
        }
    }
}

// 计算属性
const isEditMode = computed(() => !!currentLink.value.id)
const modalTitle = computed(() => isEditMode.value ? '编辑链接' : '添加链接')

// 生命周期钩子
onMounted(() => {
    fetchLinks()
})

// 方法定义
const fetchLinks = async () => {
    try {
        loading.value = true
        // 添加搜索关键字参数
        const params = {
            page: pagination.value.page,
            pageSize: pagination.value.pageSize,
            keyword: searchKeyword.value.trim() // 添加搜索关键字
        }

        const result = await getLinks(params)
        linkList.value = result.data || []
        pagination.value.itemCount = result.count || 0
    } catch (error) {
        message.error(`获取链接列表失败: ${error.message}`)
    } finally {
        loading.value = false
    }
}

const handlePageChange = (page) => {
    pagination.value.page = page
    fetchLinks()
}

const addNewLink = () => {
    currentLink.value = {
        id: '',
        title: '',
        content: '',
        url: '',
        img_url: ''
    }
    showModal.value = true
}

const editLink = (link) => {
    currentLink.value = { ...link }
    showModal.value = true
}

const deleteLink = (link) => {  // 这是组件方法
    currentLink.value = { ...link }
    showDeleteConfirm.value = true
}

const confirmDelete = async () => {
    try {
        deleting.value = true
        const token = localStorage.getItem('admin_token');
        await apiDeleteLink(token, currentLink.value.id)
        message.success('链接删除成功')
        showDeleteConfirm.value = false
        fetchLinks()
    } catch (error) {
        message.error(`删除链接失败: ${error.message}`)
    } finally {
        deleting.value = false
    }
}

const handleSubmit = async () => {
    try {
        submitting.value = true

        // 验证表单
        if (!currentLink.value.title) {
            message.error('请填写链接名称')
            return
        }

        if (!currentLink.value.url ||
            (!currentLink.value.url.startsWith('http://') && !currentLink.value.url.startsWith('https://'))) {
            message.error('请填写有效的URL (必须以http://或https://开头)')
            return
        }

        const token = localStorage.getItem('admin_token');
        if (isEditMode.value) {
            // 更新调用方式调整
            await updateLink(token, currentLink.value)
            message.success('链接更新成功')
        } else {
            // 添加调用方式调整
            await addLink(token, currentLink.value)
            message.success('链接添加成功')
        }

        showModal.value = false
        fetchLinks()
    } catch (error) {
        message.error(`${isEditMode.value ? '更新' : '添加'}链接失败: ${error.message}`)
    } finally {
        submitting.value = false
    }
}

const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAxMjAgNjAiPgogIDxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiIGZpbGw9IiNlZWVlZWUiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4='
}
</script>

<style scoped>
/* 基础表格样式 */
.responsive-table {
    width: 100%;
    overflow-x: auto;
}

/* 表格单元格样式 */
table {
    min-width: 100%;
    table-layout: fixed;
}

th,
td {
    padding: 12px 15px;
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
}

th {
    font-weight: 600;
    color: #4b5563;
    background-color: #f9fafb;
}

td {
    color: #6b7280;
    border-top: 1px solid #e5e7eb;
}

/* 按钮样式 */
button {
    transition: all 0.2s ease;
}

/* 分页按钮样式 */
.pagination-button {
    min-width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 2px;
}

/* 响应式调整 */
@media (max-width: 768px) {

    th,
    td {
        padding: 8px 10px;
        font-size: 14px;
    }

    .pagination-button {
        min-width: 28px;
        height: 28px;
        font-size: 14px;
    }
}
</style>