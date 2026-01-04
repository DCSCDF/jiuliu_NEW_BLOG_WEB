# JIULIU 博客系统开发文档

## 📖 项目简介

JIULIU博客系统是一个基于 Nuxt 3 构建的现代化个人博客平台，采用服务端渲染（SSR）和静态站点生成（SSG）技术，提供优秀的用户体验和SEO性能。系统包含完整的前台展示和后台管理功能，支持文章发布、分类管理、评论互动、友链管理等核心功能。

### 主要特点

- 🚀 基于 Nuxt 3 + Vue 3，性能优异
- 🎨 使用 Naive UI + Tailwind CSS，界面美观
- 🌓 支持深色/浅色主题自动切换
- 📱 完全响应式设计，移动端友好
- 🔍 SEO优化，支持sitemap和RSS
- ✏️ 富文本编辑器，支持Markdown
- 💬 集成Twikoo评论系统
- 🔐 JWT认证，安全可靠
- 📷 图床集成（Lsky Pro）

## 🛠️ 技术栈

### 核心框架
- **Nuxt 3** (v3.16.2) - Vue.js元框架，提供SSR/SSG支持
- **Vue 3** (v3.5.13) - 渐进式JavaScript框架
- **Vue Router** (v4.5.0) - 官方路由管理器

### UI框架与样式
- **Naive UI** (v2.41.0) - 主要UI组件库
- **Tailwind CSS** (v6.13.2) - 原子化CSS框架
- **@tailwindcss/typography** (v0.5.16) - 文章排版插件
- **@nuxtjs/color-mode** (v3.5.2) - 主题切换支持

### 富文本与代码高亮
- **@wangeditor/editor** (v5.1.23) - 富文本编辑器
- **@wangeditor/plugin-md** (v1.0.0) - Markdown支持
- **Prismjs** (v1.30.0) - 代码语法高亮

### 工具库
- **Axios** (v1.8.4) - HTTP客户端
- **bcryptjs** (v3.0.2) - 密码加密
- **uuid** (v11.1.0) - UUID生成
- **compressorjs** (v1.2.1) - 图片压缩

### SEO与站点优化
- **nuxt-simple-sitemap** (v4.4.1) - 自动生成站点地图
- **nuxt-module-feed** (v1.1.4) - RSS订阅支持

## 📁 项目结构

```
jiuliu_NEW_BLOG_WEB/
├── .git/                      # Git版本控制
├── .gitignore                 # Git忽略配置
├── .nuxt/                     # Nuxt构建输出（自动生成）
├── node_modules/              # 依赖包
├── package.json               # 项目配置
├── package-lock.json          # 依赖锁定文件
├── pnpm-lock.yaml            # pnpm锁定文件
│
├── nuxt.config.ts            # Nuxt核心配置
├── tsconfig.json             # TypeScript配置
├── themeOverrides.js         # Naive UI主题配置
├── app.vue                   # 应用根组件
├── error.vue                 # 全局错误页面
│
├── pages/                    # 页面路由（基于文件的路由）
│   ├── index.vue            # 首页（博客列表）
│   ├── guestbook.vue        # 留言板
│   ├── links.vue            # 友情链接
│   ├── admin/               # 管理后台
│   │   ├── index.vue       # 登录页
│   │   └── dashboard/
│   │       └── index.vue   # 管理仪表板
│   ├── blog/
│   │   └── [id].vue        # 文章详情（动态路由）
│   └── page/
│       └── [page].vue      # 分页页面（动态路由）
│
├── components/               # Vue组件（22个组件）
│   ├── appheader.vue        # 顶部导航栏
│   ├── articleToc.vue       # 文章目录（TOC）
│   ├── blogcard.vue         # 博客卡片列表
│   ├── category.vue         # 分类管理
│   ├── darkButton.vue       # 主题切换按钮
│   ├── dashboard.vue        # 仪表板主页
│   ├── heros.vue            # 首页横幅
│   ├── linkMessage.vue      # 友链消息
│   ├── links.vue            # 友链组件
│   ├── notification.vue     # 通知组件
│   ├── posts.vue            # 文章发布/编辑
│   ├── reusableSidebar.vue  # 可复用侧边栏
│   ├── RichTextEditor.vue   # 富文本编辑器封装
│   ├── settingHeadLink.vue  # 头部链接设置
│   ├── settingLink.vue      # 友链设置
│   ├── settingLsky.vue      # 图床配置
│   ├── settingRss.vue       # RSS配置
│   ├── settings.vue         # 设置主组件
│   ├── settingSeo.vue       # SEO设置
│   ├── settingUser.vue      # 用户设置
│   ├── settingWelcome.vue   # 欢迎页设置
│   └── sidebar.vue          # 侧边栏
│
├── utils/                    # 工具函数和API封装
│   ├── api.js               # 基础配置（后端地址、评论、图床、SEO）
│   ├── adminapi.js          # 管理员API（登录、认证）
│   ├── blogapi.js           # 博客API（文章CRUD、分页）
│   ├── category.js          # 分类API
│   ├── commentapi.js        # 评论API
│   ├── fixedDataApi.js      # 固定数据API（站点配置）
│   ├── imageapi.js          # 图片API（图床集成）
│   └── linksapi.js          # 友链API
│
├── server/                   # Nuxt服务端目录
│   └── tsconfig.json        # 服务端TS配置
│
└── public/                   # 静态资源
    ├── favicon.ico          # 网站图标
    ├── robots.txt           # 搜索引擎爬虫配置
    ├── ZhiyiMaru-Regular.ttf # 自定义字体
    └── Comment/             # Twikoo评论系统资源
        ├── Comment.js
        └── Comment.css
```

## ⚡ 功能特性

### 前台功能

#### 1. 博客展示系统
- **文章列表** - 卡片式布局，分页加载
- **文章详情** - 支持目录导航、代码高亮、响应式排版
- **分类浏览** - 按分类筛选文章
- **搜索功能** - 关键词搜索
- **主题切换** - 深色/浅色模式，跟随系统

#### 2. 互动功能
- **评论系统** - 集成Twikoo评论
- **留言板** - 访客留言功能
- **友情链接** - 友链展示与申请

#### 3. SEO优化
- 自动生成sitemap.xml
- RSS订阅支持
- Meta标签优化
- 中文语言配置
- SSR渲染优化

#### 4. 响应式设计
- 移动端优化（侧边栏浮动按钮）
- 平板/桌面多栏布局
- 平滑过渡动画

### 后台管理功能

#### 1. 认证系统
- 管理员登录（JWT Token）
- 防暴力破解（账户锁定机制）
- 记住密码功能
- Token自动刷新

#### 2. 内容管理
- **文章管理** - 发布、编辑、删除文章
- **富文本编辑器** - 支持Markdown和所见即所得
- **分类管理** - 添加、编辑、删除分类
- **友链管理** - 管理友情链接

#### 3. 系统设置
- **SEO配置** - 标题、关键词、URL设置
- **图床配置** - Lsky Pro集成
- **RSS设置** - RSS订阅配置
- **用户设置** - 修改密码、个人信息
- **欢迎页配置** - 自定义欢迎信息
- **头部链接** - 导航栏链接管理

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0
- 后端API服务（需单独部署）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/DCSCDF/jiuliu_NEW_BLOG_WEB.git
cd jiuliu_NEW_BLOG_WEB
```

2. **安装依赖**
```bash
npm install
# 或
pnpm install
```

3. **配置后端地址**

编辑 `utils/api.js` 文件：
```javascript
// 开发环境
export const API_BASE_URL = 'http://127.0.0.1:8080';

// 生产环境
// export const API_BASE_URL = 'https://api.jiuliu.top';

// 配置评论后端
export const commentConfig = {
    scriptUrl: "/Comment/Comment.js",
    apiEndpoint: "https://discuss.jiuliu.top/"
}
```

4. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3001

### 可用脚本

```bash
# 开发模式（端口3001）
npm run dev

# 构建生产版本（SSR）
npm run build

# 生成静态站点（SSG）
npm run generate

# 预览构建结果
npm run preview

# 准备Nuxt环境
npm run postinstall
```

## ⚙️ 配置说明

### Nuxt配置 (nuxt.config.ts)

```typescript
export default defineNuxtConfig({
    devServer: {
        port: 3001,           // 开发端口
        host: '0.0.0.0'      // 允许外部访问
    },

    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            htmlAttrs: { lang: 'zh-CN' }
        }
    },

    colorMode: {
        preference: 'system',  // 默认跟随系统
        fallback: 'light',     // 回退方案
    },

    routeRules: {
        '/page/:page': { prerender: true }  // 预渲染分页
    }
})
```

### 主题配置 (themeOverrides.js)

自定义Naive UI主题色：
```javascript
export default {
    common: {
        primaryColor: '#3b82f6',      // 主色
        primaryColorHover: '#2563eb',  // 悬停色
        primaryColorPressed: '#1d4ed8' // 按下色
    }
}
```

## 🔌 API说明

### API基础配置

**文件位置**: `utils/api.js`

```javascript
// 后端API地址
export const API_BASE_URL = 'http://127.0.0.1:8080';

// 评论系统配置
export const commentConfig = {
    scriptUrl: "/Comment/Comment.js",
    apiEndpoint: "https://discuss.jiuliu.top/"
}

// 图床配置（动态加载）
export const LSKY_CONFIG = {
    baseUrl: "",
    email: "",
    password: ""
};

// SEO配置（动态加载）
export const SEO = {
    title: "",
    keywords: [],
    url: ""
};
```

### API模块

#### 1. 管理员API (adminapi.js)
- `login(username, password)` - 管理员登录
- `checkTokenValidity(token)` - 验证Token有效性

#### 2. 博客API (blogapi.js)
- `getAllBlogs()` - 获取所有文章
- `getBlogById(id)` - 获取文章详情
- `createBlog(blogData)` - 创建文章
- `updateBlog(id, blogData)` - 更新文章
- `deleteBlog(id)` - 删除文章
- `getBlogsByPage(page, pageSize)` - 分页获取文章
- `searchBlogs(keyword)` - 搜索文章

#### 3. 分类API (category.js)
- `getAllCategories()` - 获取所有分类
- `createCategory(name)` - 创建分类
- `updateCategory(id, name)` - 更新分类
- `deleteCategory(id)` - 删除分类

#### 4. 友链API (linksapi.js)
- `getAllLinks()` - 获取所有友链
- `createLink(linkData)` - 创建友链
- `updateLink(id, linkData)` - 更新友链
- `deleteLink(id)` - 删除友链

#### 5. 图片API (imageapi.js)
- `uploadImage(file)` - 上传图片到图床
- 集成Lsky Pro图床

#### 6. 固定数据API (fixedDataApi.js)
- `getFixedData(key)` - 获取配置数据
- `updateFixedData(key, data)` - 更新配置数据
- 支持的key：`seo_message`, `lsky_account`, `rss_config`等

### 请求拦截器

所有API请求都包含：
- **请求ID追踪** - 使用UUID标识每个请求
- **JWT认证** - 自动附加Token
- **统一错误处理** - 401自动跳转登录
- **响应拦截** - 统一处理响应数据

## 🎨 开发指南

### 组件开发规范

1. **命名规范**
   - 组件文件使用小驼峰命名：`blogCard.vue`
   - 组件名使用大驼峰：`<BlogCard />`

2. **组件结构**
```vue
<template>
  <!-- 模板 -->
</template>

<script setup>
// 导入
// 响应式数据
// 计算属性
// 方法
// 生命周期钩子
</script>

<style scoped>
/* 样式 */
</style>
```

3. **使用Composition API**
   - 优先使用 `<script setup>` 语法
   - 合理拆分composables

### 路由开发

Nuxt 3使用基于文件的路由系统：

```
pages/
├── index.vue          → /
├── guestbook.vue      → /guestbook
├── blog/
│   └── [id].vue       → /blog/:id
└── page/
    └── [page].vue     → /page/:page
```

**动态路由获取参数**：
```javascript
const route = useRoute()
const id = route.params.id
```

### 状态管理

使用Vue 3的Composition API进行状态管理：

```javascript
// 使用ref/reactive
const state = ref({})
const data = reactive({})

// 使用computed
const filtered = computed(() => data.filter(...))
```

### 样式开发

1. **优先使用Tailwind CSS工具类**
```vue
<div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800">
```

2. **复杂样式使用Naive UI组件**
```vue
<n-button type="primary" size="large">提交</n-button>
```

3. **自定义样式使用scoped**
```vue
<style scoped>
.custom-class {
  /* 自定义样式 */
}
</style>
```

### 主题适配

支持深色模式：

```vue
<template>
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    内容
  </div>
</template>

<script setup>
const colorMode = useColorMode()
// colorMode.value: 'light' | 'dark' | 'system'
</script>
```

## 📦 构建与部署

### SSR部署（推荐）

1. **构建**
```bash
npm run build
```

2. **启动**
```bash
node .output/server/index.mjs
```

3. **使用PM2管理**
```bash
pm2 start .output/server/index.mjs --name "jiuliu-blog"
```

### SSG部署（静态托管）

1. **生成静态文件**
```bash
npm run generate
```

2. **部署到静态托管**
   - 将 `.output/public/` 目录上传到：
     - Vercel
     - Netlify
     - GitHub Pages
     - Cloudflare Pages

### Docker部署

创建 `Dockerfile`：
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

构建并运行：
```bash
docker build -t jiuliu-blog .
docker run -p 3000:3000 jiuliu-blog
```

### 环境变量

创建 `.env` 文件：
```env
# API地址
NUXT_PUBLIC_API_BASE_URL=https://api.jiuliu.top

# 评论服务
NUXT_PUBLIC_COMMENT_ENDPOINT=https://discuss.jiuliu.top/
```

## 🐛 常见问题

### Q1: 端口被占用

**错误**: `Port 3001 is already in use`

**解决**:
```bash
# 查找占用进程
lsof -i :3001

# 杀死进程
kill -9 <PID>

# 或修改端口
# nuxt.config.ts
devServer: {
  port: 3002
}
```

### Q2: 依赖安装失败

**解决**:
```bash
# 清除缓存
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 或使用pnpm
pnpm install
```

### Q3: 图床上传失败

**检查**:
1. `utils/api.js` 中图床配置是否正确
2. 后端API是否已配置Lsky账号
3. 网络连接是否正常

### Q4: 评论加载失败

**检查**:
1. `utils/api.js` 中评论端点配置
2. Twikoo服务是否运行正常
3. 浏览器控制台错误信息

### Q5: 深色模式不生效

**解决**:
```bash
# 清除localStorage
localStorage.removeItem('nuxt-color-mode-scheme')

# 刷新页面
```

### Q6: 构建失败

**常见原因**:
1. TypeScript类型错误
2. 导入路径错误
3. 依赖版本冲突

**解决**:
```bash
# 检查类型错误
npx nuxi typecheck

# 清除构建缓存
rm -rf .nuxt .output

# 重新构建
npm run build
```

## 📚 参考资料

### 官方文档
- [Nuxt 3 文档](https://nuxt.com)
- [Vue 3 文档](https://vuejs.org)
- [Naive UI 文档](https://www.naiveui.com)
- [Tailwind CSS 文档](https://tailwindcss.com)

### 相关链接
- [项目仓库](https://github.com/DCSCDF/jiuliu_NEW_BLOG_WEB)
- [在线演示](https://jiuliu.top)
- [后端API](https://api.jiuliu.top)

## 📄 许可证

本项目采用 MIT 许可证。

## 👥 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📮 联系方式

如有问题，请通过以下方式联系：

- 提交Issue: [GitHub Issues](https://github.com/DCSCDF/jiuliu_NEW_BLOG_WEB/issues)
- 官方网站: https://jiuliu.top

---

**最后更新**: 2026-01-05
