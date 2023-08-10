// src/index.js
import YqVideo from '@/lib/yq-video';

const components = [YqVideo];

const install = (Vue,options) => {
    if (install.installed) return;
    install.installed = true
    console.log(options)
    components.forEach(component => {
        Vue.component(component.name, component)
    })
}

// 如果是直接引入的
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    // 同时导出组件列表
   ...components
}
