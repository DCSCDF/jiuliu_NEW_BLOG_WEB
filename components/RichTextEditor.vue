<template>
    <div style="border: 1px solid #ccc; margin-top: 10px; border-radius: 8px;">
        <div style="margin: 10px">
            <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
                style="border-bottom: 1px solid #ccc" />
            <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml"
                style="height: 400px; overflow-y: hidden" @onCreated="handleCreated" @onChange="handleChange" />
        </div>
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, shallowRef, onBeforeUnmount, nextTick, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import axios from 'axios';
import Compressor from 'compressorjs';



const mode = ref('default');
const editorRef = shallowRef();
const valueHtml = ref('');
const allInsertedImages = ref(new Set()); // 记录所有曾经插入过的图片
const currentImages = ref(new Set()); // 记录当前编辑器中的图片

// 2. 定义编辑器配置 (必须先定义)
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {}
};

// 3. 定义工具栏配置
const toolbarConfig = {
    excludeKeys: [
        'uploadVideo',
        'group-video'
    ]
};

// 4. 定义API相关变量和函数
let authToken = null;
const api = axios.create({
    baseURL: LSKY_CONFIG.baseUrl,
    withCredentials: false
})

// 请求拦截器
api.interceptors.request.use(config => {
    const noAuthUrls = ['/tokens']
    if (authToken && !noAuthUrls.some(url => config.url.includes(url))) {
        config.headers['Authorization'] = `Bearer ${authToken}`
    } else {
        delete config.headers['Authorization']
    }
    return config
}, error => {
    return Promise.reject(error)
})

const getLskyToken = async () => {
    if (authToken) return authToken;

    try {
        const response = await api.post('/tokens', {
            email: LSKY_CONFIG.email,
            password: LSKY_CONFIG.password
        }, {
            withCredentials: false
        })
        authToken = response.data.data.token;
        setTimeout(() => authToken = null, 60 * 60 * 1000);
        return authToken;
    } catch (error) {
        console.error('认证失败:', error.response?.data || error.message);
        throw new Error('图片服务认证失败');
    }
};

// 6. 完善编辑器配置
editorConfig.MENU_CONF = {
    uploadImage: {
        // 允许上传的图片后缀列表
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],

        customUpload: async (file, insertFn) => {
            try {
                // 获取文件后缀（不包含点）
                const fileExt = file.name.split('.').pop().toLowerCase();

                // 验证文件后缀 - 通过 editorConfig.MENU_CONF.uploadImage 访问
                if (!editorConfig.MENU_CONF.uploadImage.allowedFileTypes.includes(fileExt)) {
                    throw new Error(`不支持的文件类型: .${fileExt}，请上传图片文件`);
                }

                const token = await getLskyToken();
                const compressedFile = await new Promise((resolve, reject) => {
                    new Compressor(file, {
                        quality: 0.8,
                        success: resolve,
                        error: reject,
                        // 保持原始文件类型
                        mimeType: file.type
                    });
                });

                const formData = new FormData();
                // 保持原始文件名和后缀
                formData.append('file', compressedFile, file.name);

                const response = await api.post('/upload', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data?.status) {
                    const imageUrl = response.data.data.links.url;
                    insertFn(imageUrl, file.name, imageUrl);
                    allInsertedImages.value.add(imageUrl);
                    currentImages.value.add(imageUrl);
                    return imageUrl;
                }
                throw new Error(response.data?.message || '上传失败');
            } catch (error) {
                console.error('上传失败:', error);
                throw error;
            }
        }
    }
};

// 获取当前编辑器中的所有图片
const getCurrentImages = () => {
    if (!editorRef.value) return [];
    return editorRef.value.getElemsByType('image').map(img => img.src);
};

// 更新当前图片集合
const updateCurrentImages = () => {
    const images = getCurrentImages();
    currentImages.value = new Set(images);
};

// 获取已删除的图片（只在调用时计算）
const getDeletedImages = () => {
    updateCurrentImages();
    return [...allInsertedImages.value].filter(src => !currentImages.value.has(src));
};

const cleanupDeletedImages = async () => {
    const deleted = getDeletedImages();
    if (deleted.length === 0) {
        // console.log('没有需要删除的图片');
        return;
    }

    try {
        const token = await getLskyToken();
        if (!token) throw new Error('无法获取有效Token');

        // 先获取所有图片列表，建立URL到key的映射
        // console.log('获取图片列表以建立URL-key映射...');
        const imageListResponse = await api.get('/images', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!imageListResponse.data?.status) {
            throw new Error('获取图片列表失败');
        }

        // 创建URL到key的映射表
        const urlToKeyMap = {};
        imageListResponse.data.data.data.forEach(image => {
            urlToKeyMap[image.links.url] = image.key;
        });

        // console.log('URL-key映射表:', urlToKeyMap);

        // 删除图片
        const results = await Promise.allSettled(
            deleted.map(async (url) => {
                try {
                    const key = urlToKeyMap[url];
                    if (!key) {
                        console.warn(`找不到URL对应的key: ${url}`);
                        return false;
                    }

                    // console.log(`准备删除图片 key=${key}, url=${url}`);
                    const response = await api.delete(`/images/${key}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        },
                        timeout: 5000
                    });

                    if (response.data?.status) {
                        // console.log(`图片删除成功 key=${key}`);
                        allInsertedImages.value.delete(url);
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('删除图片失败:', { url, error });
                    return false;
                }
            })
        );

        // 输出删除结果
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`图片 ${deleted[index]} 删除结果:`, result.value ? '成功' : '失败');
            } else {
                console.error(`图片 ${deleted[index]} 删除失败:`, result.reason);
            }
        });

        return results;
    } catch (error) {
        console.error('清理图片时出错:', error);
        throw error;
    }
};

// 7. 组件生命周期和props
const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:model-value']);

const handleCreated = (editor) => {
    editorRef.value = editor;

    // 监听图片插入事件
    editor.on('insertedImage', (imageNode) => {
        if (imageNode?.src) {
            allInsertedImages.value.add(imageNode.src);
            currentImages.value.add(imageNode.src);
        }
    });

    // 初始化内容
    if (props.modelValue) {
        editor.setHtml(props.modelValue);

        // 提取初始内容中的图片
        nextTick(() => {
            const images = editor.getElemsByType('image');
            images.forEach(img => {
                if (img.src) {
                    allInsertedImages.value.add(img.src);
                    currentImages.value.add(img.src);
                }
            });
        });
    }
};

const handleChange = (editor) => {
    const html = editor.getHtml();
    valueHtml.value = html;
    emit('update:model-value', html);

    // 更新当前图片集合
    updateCurrentImages();
};

watch(
    () => props.modelValue,
    (newVal) => {
        if (editorRef.value && newVal !== valueHtml.value) {
            editorRef.value.setHtml(newVal);

            // 更新图片跟踪
            allInsertedImages.value.clear();
            currentImages.value.clear();
            const images = editorRef.value.getElemsByType('image');
            images.forEach(img => {
                if (img.src) {
                    allInsertedImages.value.add(img.src);
                    currentImages.value.add(img.src);
                }
            });
        }
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    if (editorRef.value && editorRef.value.destroy) {
        try {
            editorRef.value.destroy();
        } catch (e) {
            console.warn('Editor cleanup error:', e);
        }
    }
});

defineExpose({
    destroyEditor: () => editorRef.value?.destroy(),
    getEditor: () => editorRef.value,
    getDeletedImages,
    cleanupDeletedImages,
    mode,
    editorRef,
    valueHtml,
    toolbarConfig,
    editorConfig,
});
</script>