module.exports = {
    lintOnSave: false,
    configureWebpack: {
        output: {
            libraryExport: 'default'
        }
    },
    css: {
        extract: false //强制关联，不产生css文件
    }
};
