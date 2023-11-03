module.exports = {
    lintOnSave: false,
    configureWebpack: {
        output: {
            library: 'YqFacedetector', // 库的全局变量名
            libraryTarget: 'umd', // 输出 ES 模块
        }
    },
    css: {
        extract: false //强制关联，不产生css文件
    }
};
