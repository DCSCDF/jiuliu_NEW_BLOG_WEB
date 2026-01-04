
export const setupComment = (elementId, blogId) => {
    // 动态加载twikoo CDN
    const loadTwikoo = () => new Promise((resolve, reject) => {
        if (window.twikoo) return resolve();

        const script = document.createElement('script');
        script.src = commentConfig.scriptUrl
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    // 初始化评论
    const init = async () => {
        try {
            await loadTwikoo();
            twikoo.init({
                envId: commentConfig.apiEndpoint,
                el: `#${elementId}`,
                path: blogId
            });
        } catch (err) {
            console.error('评论初始化失败:', err);
        }
    };

    init();
};


export const setupCommentSystem = async (elementId, blogId) => {
    try {
        // console.log('开始初始化评论系统...')

        // 检查是否已加载Twikoo
        if (!window.twikoo) {
            // console.log('正在加载Twikoo脚本...')
            await new Promise((resolve, reject) => {
                const script = document.createElement('script')
                script.src = commentConfig.scriptUrl
                script.onload = () => {
                    // console.log('Twikoo脚本加载成功')
                    resolve()
                }
                script.onerror = (err) => {
                    console.error('Twikoo脚本加载失败:', err)
                    reject(new Error('Twikoo脚本加载失败'))
                }
                document.head.appendChild(script)
            })
        }

        // 检查容器是否存在
        const container = document.getElementById(elementId)
        if (!container) {
            throw new Error(`找不到评论容器 #${elementId}`)
        }
        // console.log('找到评论容器:', container)

        //初始化Twikoo
        // console.log('正在初始化Twikoo...', {
        //     envId: commentConfig.apiEndpoint,
        //     el: `#${elementId}`,
        //     path: blogId
        // })

        twikoo.init({
            envId: commentConfig.apiEndpoint,
            el: `#${elementId}`,
            path: blogId,
            region: 'ap-shanghai',
            onCommentLoaded: () => {
                // console.log('Twikoo评论加载完成')
            }
        })

        // console.log('Twikoo初始化完成')
    } catch (err) {
        console.error('评论系统初始化失败:', err)
        throw err
    }
}