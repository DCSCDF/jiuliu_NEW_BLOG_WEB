<template>
    <!-- 文章管理内容 -->
    <h2 class="text-2xl mb-4 font-semibold text-gray-800">文章管理</h2>
    <p class="text-gray-600 mb-6">这里是文章管理页面。</p>

    <!-- 搜索和过滤区域 -->
    <div class="mb-6 md:flex md:items-center md:justify-between">
        <div class="relative flex items-center mt-4 md:mt-0">
            <span class="absolute">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 mx-3 text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </span>
            <input v-model="searchKeyword" type="text" placeholder="搜索文章标题或内容"
                class="block w-full py-1.5 mr-4 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-70 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                @keyup.enter="fetchBlogs">

            <div class="relative w-full min-w-[120px] max-w-[240px]">
                <!-- 下拉选择框 -->
                <select v-model="selectedCategory"
                    class="w-full py-1.5 pl-3 pr-8 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-400">
                    <option value="">全部分类</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id"
                        class="text-gray-900 hover:bg-blue-100">
                        {{ category.name }}
                    </option>
                </select>

                <!-- 下拉箭头图标 -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-4 mt-4 md:mt-0">
            <button @click="fetchBlogs"
                class="flex items-center justify-center px-3 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 gap-x-2 hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <span>搜索</span>
            </button>
            <button @click="addNewBlog"
                class="flex items-center justify-center px-3 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 gap-x-2 hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>添加文章</span>
            </button>
        </div>
    </div>

    <!-- 文章表格 -->
    <div class="flex flex-col mt-6">
        <div class="overflow-x-auto">
            <div class="inline-block min-w-full py-2 align-middle">
                <!-- 当有数据时显示表格 -->
                <div v-if="blogList.length > 0" class="overflow-hidden border border-gray-200 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500">
                                    <div class="flex items-center gap-x-3">
                                        <span>标题</span>
                                    </div>
                                </th>
                                <th scope="col"
                                    class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                    分类
                                </th>
                                <th scope="col"
                                    class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                    创建时间
                                </th>
                                <th scope="col"
                                    class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                                    状态
                                </th>
                                <th scope="col" class="relative py-3.5 px-4">
                                    <span class="sr-only">操作</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(blog, index) in blogList" :key="index">
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                    <div>
                                        <h2 class="font-medium text-gray-800">{{ blog.title }}</h2>
                                        <p class="text-sm font-normal text-gray-400">
                                            {{ blog.content.substring(0, 30) }}...</p>
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <div
                                        class="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60">
                                        {{ getCategoryName(blog.category_id) || "无" }}
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    {{ formatDate(blog.create_time) }}
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <span :class="{
                                        'px-3 py-1 rounded-full text-sm': true,
                                        'bg-red-100 text-red-800': blog.is_hidden,
                                        'bg-green-100 text-green-800': !blog.is_hidden
                                    }">
                                        {{ blog.is_hidden ? '已隐藏' : '已发布' }}
                                    </span>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <div class="flex items-center gap-x-6">
                                        <!-- {{ blog.is_hidden ? '已隐藏' : '已发布' }} -->
                                        <button @click="!blog.is_hidden && editBlog(blog)" :class="{
                                            'text-gray-500 hover:text-blue-500': !blog.is_hidden,
                                            'text-gray-200 cursor-not-allowed': blog.is_hidden
                                        }" class="transition-colors duration-200" :disabled="blog.is_hidden">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <button @click="toggleHiddenStatus(blog)"
                                            class="text-gray-500 transition-colors duration-200 hover:text-yellow-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        </button>
                                        <button @click="deleteBlog(blog)"
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
                        <h1 class="mt-3 text-lg text-gray-800">未找到文章</h1>
                        <p class="mt-2 text-gray-500">
                            {{ searchKeyword ? `搜索"${searchKeyword}"未找到匹配文章` : '当前没有文章数据' }}
                        </p>
                        <div class="flex items-center mt-4 sm:mx-auto gap-x-3">
                            <button @click="clearSearch"
                                class="w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg sm:w-auto">
                                清除搜索
                            </button>

                            <button @click="addNewBlog"
                                class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>添加文章</span>
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

    <!-- 添加/编辑文章模态框 -->
    <n-modal :theme-overrides="themeOverrides" v-model:show="showModal" preset="card" :title="modalTitle"
        style="width: 100%; max-width: 900px;" :style="{ margin: '40px auto' }" class="rounded-xl">

        <!-- 加载状态 -->
        <div v-if="submitting" class="flex flex-col items-center justify-center h-64">
            <n-spin size="large" />
            <p class="mt-4 text-gray-600">正在提交数据，请稍候...</p>
        </div>

        <!-- 表单内容 -->
        <n-form v-else ref="formRef" :model="currentBlog" :rules="formRules" class="max-w-full">
            <n-form-item label="标题" path="title">
                <n-input :theme-overrides="themeOverrides" v-model:value="currentBlog.title" placeholder="请输入文章标题"
                    class="rounded-lg w-full" />
            </n-form-item>

            <n-form-item :theme-overrides="themeOverrides" label="分类" path="categoryId">
                <n-select :theme-overrides="themeOverrides" v-model:value="currentBlog.categoryId"
                    :options="categorySelectOptions" placeholder="选择分类（可选）" class="rounded-lg w-full" />
            </n-form-item>

            <n-form-item label="封面图片" path="img_url">
                <n-upload :theme-overrides="themeOverrides" v-model:file-list="fileList" list-type="image-card" :max="1"
                    class="rounded-lg w-full" @change="handleUploadChange" :show-retry-button="false"
                    :show-cancel-button="false" :show-remove-button="true" :show-file-list="true" :auto-upload="false">
                    <template #default>
                    </template>
                </n-upload>
            </n-form-item>

            <n-form-item label="内容" path="content">
                <div class="w-full overflow-hidden">
                    <RichTextEditor ref="richTextEditor" v-model="currentBlog.content"
                        style="width: 100%; max-width: 100%;" />
                </div>
            </n-form-item>
        </n-form>

        <div class="flex justify-end gap-3 mt-4">
            <n-button :theme-overrides="themeOverrides" @click="showModal = false"
                class="text-gray-600 hover:bg-gray-100 transition-colors" :disabled="submitting">
                取消
            </n-button>
            <n-button :theme-overrides="themeOverrides" type="primary" @click="handleSubmit" :loading="submitting"
                class="bg-blue-500 hover:bg-blue-600 transition-colors">
                {{ isEditMode ? '更新' : '添加' }}
            </n-button>
        </div>
    </n-modal>

    <!-- 删除确认对话框 -->
    <n-modal v-model:show="showDeleteConfirm" preset="dialog" title="确认删除" class="rounded-xl">
        <template #header>
            <div class="text-lg font-medium text-gray-800">确认删除文章</div>
        </template>
        <div class="py-4 text-gray-600">确定要删除文章 "{{ currentBlog.title }}" 吗？此操作不可恢复。</div>
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

    <!-- 切换隐藏状态确认对话框 -->
    <n-modal v-model:show="showToggleHiddenModal" preset="dialog" title="确认操作" class="rounded-xl">
        <template #header>
            <div class="text-lg font-medium text-gray-800">
                {{ currentBlog.is_hidden ? '取消隐藏文章' : '隐藏文章' }}
            </div>
        </template>
        <div class="py-4 text-gray-600">
            确定要将文章 "{{ currentBlog.title }}" {{ currentBlog.is_hidden ? '取消隐藏' : '设为隐藏' }}吗？
            {{ currentBlog.is_hidden ? '取消隐藏后文章将对所有用户可见。' : '隐藏后文章将不会在公开页面显示。' }}
        </div>
        <template #action>
            <div class="flex justify-end gap-3">
                <n-button @click="showToggleHiddenModal = false"
                    class="text-gray-600 hover:bg-gray-100 transition-colors">
                    取消
                </n-button>
                <n-button type="warning" @click="confirmToggleHidden" :loading="togglingHidden"
                    class="bg-yellow-500 hover:bg-yellow-600 transition-colors">
                    {{ currentBlog.is_hidden ? '取消隐藏' : '确认隐藏' }}
                </n-button>
            </div>
        </template>
    </n-modal>


</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { NButton, NModal, NForm, NFormItem, NInput, NSelect, NUpload, useMessage } from 'naive-ui'
import RichTextEditor from './RichTextEditor.vue'
import BlogApi from '../utils/blogapi'
import CategoryService from '../utils/category'
import themeOverrides from "../themeOverrides";
import { uploadImage } from '../utils/imageapi'

// 添加 richTextEditor 的引用
const richTextEditor = ref(null)

const handleUploadChange = ({ file, fileList: newFileList }) => {
    // 只更新本地状态，不执行上传操作
    fileList.value = newFileList;

    // 如果有新上传的文件，标记为pending状态
    if (file.status === 'uploading') {
        fileList.value = fileList.value.map(f =>
            f.id === file.id ? { ...f, status: 'pending' } : f
        );
    }
};

const handleSubmit = async () => {
    try {
        submitting.value = true;

        // 验证必填字段
        if (!currentBlog.value.title || !currentBlog.value.content) {
            message.error('请填写标题和内容');
            submitting.value = false;
            return;
        }

        const token = localStorage.getItem('admin_token');
        if (!token) {
            throw new Error('未找到认证token');
        }

        // console.log('处理图片...');

        if (richTextEditor.value && typeof richTextEditor.value.cleanupDeletedImages === 'function') {
            // console.log('清理已删除图片...');
            try {
                await richTextEditor.value.cleanupDeletedImages();
                // console.log('图片清理完成');
            } catch (error) {
                console.error('清理编辑器图片失败:', error);
                message.warning('清理编辑器图片失败，但文章将继续保存');
            }
        }

        // 获取当前图片URL
        const oldImageUrl = currentBlog.value.img_url;
        let newImageUrl = oldImageUrl;

        //  用户上传了新图片
        const pendingFiles = fileList.value.filter(f => f.status === 'pending');
        if (pendingFiles.length > 0) {
            // console.log('开始上传...');
            const file = pendingFiles[0];

            // 先上传新图片
            const result = await uploadImage(
                file.file,
                token,
                isEditMode.value && oldImageUrl ? oldImageUrl : null
            );

            if (!result?.url) {
                throw new Error('服务器返回数据格式不正确');
            }

            // 更新文件状态
            fileList.value = fileList.value.map(f =>
                f.id === file.id ? {
                    ...f,
                    status: 'finished',
                    url: result.url,
                    response: result
                } : f
            );

            newImageUrl = result.url;
            // console.log('封面图片上传成功:', newImageUrl);
        }
        // 情况2: 用户删除了原有图片（fileList为空且当前有图片URL）
        else if (isEditMode.value && fileList.value.length === 0 && oldImageUrl) {
            // console.log('用户删除了原有封面图片');
            newImageUrl = '';
        }

        // 准备提交数据
        const postData = {
            ...currentBlog.value,
            categoryId: currentBlog.value.categoryId || null,
            img_url: newImageUrl || ''
        };

        // console.log('准备提交的数据:', postData);

        // 根据模式调用不同的API
        let apiCall;
        if (isEditMode.value) {
            // console.log('执行更新文章操作');
            apiCall = blogApi.updateBlog(postData);
        } else {
            // console.log('执行添加文章操作');
            apiCall = blogApi.addBlog(postData);
        }

        const response = await apiCall;
        // console.log('API响应:', response);

        // 提交成功后处理图片删除
        if (response && response.success) {
            // 情况1: 编辑模式且有旧图片，且新图片上传成功或用户删除了图片
            if (isEditMode.value && oldImageUrl && oldImageUrl !== newImageUrl) {
                // console.log('需要删除旧封面图片:', oldImageUrl);
                try {
                    const filename = oldImageUrl.split('/').pop();
                    await deleteImage(filename, token);
                    // console.log('旧封面图片删除成功');
                } catch (error) {
                    console.error('删除旧图片失败:', error);
                    message.warning('删除旧图片失败，但文章已更新');
                }
            }

            // 情况2: 用户删除了原有图片（fileList为空且当前有图片URL）
            if (isEditMode.value && fileList.value.length === 0 && oldImageUrl) {
                // console.log('用户删除了封面图片，需要删除服务器上的图片');
                try {
                    const filename = oldImageUrl.split('/').pop();
                    await deleteImage(filename, token);
                    // console.log('封面图片删除成功');
                } catch (error) {
                    console.error('删除封面图片失败:', error);
                    message.warning('删除封面图片失败，但文章已更新');
                }
            }
        }

        message.success(isEditMode.value ? '文章更新成功' : '文章添加成功');
        fetchBlogs();
        showModal.value = false;
    } catch (error) {
        console.error('提交失败:', error);
        message.error(`${isEditMode.value ? '更新' : '添加'}文章失败: ${error.message}`);
    } finally {
        submitting.value = false;
    }
}

const confirmDelete = async () => {
    try {
        deleting.value = true;
        const token = localStorage.getItem('admin_token');
        if (!token) {
            throw new Error('未找到认证token');
        }

        await blogApi.deleteBlog(currentBlog.value.id, token);

        if (currentBlog.value.img_url) {
            try {
                const filename = currentBlog.value.img_url.split('/').pop();
                await deleteImage(filename, token);
            } catch (error) {
                console.error('删除封面图片失败:', error);
                message.warning('删除封面图片失败，但文章已删除');
            }
        }

        message.success('文章删除成功');
        fetchBlogs();
    } catch (error) {
        console.error('删除失败:', error);
        message.error(`删除文章失败: ${error.message}`);
    } finally {
        deleting.value = false;
        showDeleteConfirm.value = false;
    }
}



const editBlog = async (blog) => {
    try {
        loading.value = true;
        const response = await blogApi.getBlogDetail(blog.id);
        const fullBlog = response.data;

        currentBlog.value = {
            ...fullBlog,
            categoryId: fullBlog.category_id,
            content: fullBlog.content,
            img_url: fullBlog.img_url
        };

        // 处理封面图片
        fileList.value = fullBlog.img_url ? [{
            id: '1',
            name: 'cover',
            url: fullBlog.img_url,
            status: 'finished',
            response: { url: fullBlog.img_url }
        }] : [];

        showModal.value = true;
    } catch (error) {
        message.error(`获取文章详情失败(如果隐藏了请发布后重试): ${error.message}`);
    } finally {
        loading.value = false;
    }
};

// 初始化API和消息组件
const blogApi = new BlogApi()
const categoryService = new CategoryService()
const message = useMessage()

// 数据状态
const blogList = ref([])
const categories = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('')
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const showToggleHiddenModal = ref(false) // 切换隐藏状态模态框
const submitting = ref(false)
const deleting = ref(false)
const togglingHidden = ref(false) // 切换隐藏状态加载状态
const currentBlog = ref({
    id: '',
    title: '',
    categoryId: null,
    content: '',
    img_url: '',
    is_hidden: false
})
const fileList = ref([])

// 切换隐藏状态
const toggleHiddenStatus = (blog) => {
    currentBlog.value = { ...blog }
    showToggleHiddenModal.value = true
}

// 确认切换隐藏状态
const confirmToggleHidden = async () => {
    try {
        togglingHidden.value = true;

        // 确保使用 await 等待 API 调用完成
        const result = await blogApi.toggleBlogHidden(currentBlog.value.id);

        if (result.code === 200) {
            message.success(`文章已${currentBlog.value.is_hidden ? '取消隐藏' : '隐藏'}`);

            // 更新本地状态
            const index = blogList.value.findIndex(b => b.id === currentBlog.value.id);
            if (index !== -1) {
                blogList.value[index].is_hidden = !blogList.value[index].is_hidden;
            }
        } else {
            throw new Error(result.msg || '操作失败');
        }
    } catch (error) {
        console.error('切换隐藏状态失败:', error);
        message.error(`切换隐藏状态失败: ${error.message}`);
    } finally {
        togglingHidden.value = false;
        showToggleHiddenModal.value = false;
    }
}
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
        message: '请输入文章标题',
        trigger: 'blur'
    },
    content: {
        required: true,
        message: '请输入文章内容',
        trigger: 'blur'
    }
}

// 计算属性
const isEditMode = computed(() => !!currentBlog.value.id)
const modalTitle = computed(() => isEditMode.value ? '编辑文章' : '添加文章')

// 分类选择框选项
const categorySelectOptions = computed(() => {
    return categories.value.map(category => ({
        label: category.name,
        value: category.id
    }))
})

// 监听分类选择变化
watch(selectedCategory, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        // 重置到第一页
        pagination.value.page = 1
        fetchBlogs()
    }
})

// 生命周期钩子
onMounted(async () => {
    await fetchCategories() // 先获取分类数据
    fetchBlogs()


})

// 方法定义
const fetchCategories = async () => {
    try {
        const response = await categoryService.getCategoryList()
        categories.value = response.data || []
    } catch (error) {
        message.error(`获取分类列表失败: ${error.message}`)
    }
}
// 添加清除搜索方法
const clearSearch = () => {
    searchKeyword.value = ''
    selectedCategory.value = '' // 同时重置分类筛选
    fetchBlogs()
}

const fetchBlogs = async () => {
    try {
        loading.value = true
        const params = {
            keyword: searchKeyword.value,
            categoryId: selectedCategory.value || null, // 确保传递null而不是空字符串
            page: pagination.value.page,
            pageSize: pagination.value.pageSize
        }
        let admin = true //确认是管理员访问
        const result = await blogApi.searchBlogsAdmin(params, admin)
        blogList.value = result.data.rows
        pagination.value.itemCount = result.data.count
    } catch (error) {
        message.error(`获取文章列表失败: ${error.message}`)
    } finally {
        loading.value = false
    }
}

// 根据分类ID获取分类名称
const getCategoryName = (categoryId) => {
    if (!categoryId) return null
    const category = categories.value.find(c => c.id === categoryId)
    return category ? category.name : null
}

// 格式化日期
const formatDate = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleString()
}

const handlePageChange = (page) => {
    pagination.value.page = page
    fetchBlogs()
}


const addNewBlog = () => {
    currentBlog.value = {
        id: '',
        title: '',
        categoryId: null,
        content: '',
        img_url: ''
    }
    fileList.value = []
    showModal.value = true
}


const deleteBlog = (blog) => {
    currentBlog.value = { ...blog }
    showDeleteConfirm.value = true
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

/* 状态标签样式 */
.status-label {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.status-hidden {
    background-color: rgb(254 226 226);
    color: rgb(153 27 27);
}

.status-visible {
    background-color: rgb(220 252 231);
    color: rgb(22 101 52);
}
</style>
