// src/index.js

import YqVerify from './yq-verify';
import BaiduVerify from './baidu-verify';

const components = [YqVerify,BaiduVerify];

const install = (Vue) => {
    if (install.installed) return;
    install.installed = true

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
