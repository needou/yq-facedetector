//导出组件
import YVideo from './YVideo'

const allComponents={
    ...YVideo
}

export default {
    install(app) {
        for (const key in allComponents) {
            app.component(key, allComponents[key]);
        }
    }
}

export {
    YVideo
}
