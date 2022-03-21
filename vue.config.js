const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

let publicPath = '/'

// 打包上线，修改publicPath
if (process.env.NODE_ENV === 'production') {
    publicPath = './'
}

const pages = {
    index: {
        entry: 'src/main.js',
        template: 'public/index.html',
    },
    h5: {
        entry: 'src/h5/main.js',
        template: 'public/h5.html'
    }
}

module.exports = {
    pages,
    // 公共路径，默认根路径
    publicPath,
    // 项目打包之后，静态资源会放在这个文件夹下
    assetsDir: 'assets',
    // 保存时lint检查
    lintOnSave: false,
    // 不需要生产环境的 source map，将其设置为 false 以加速生产环境构建
    productionSourceMap: false,
    // 开发服务配置
    devServer: {
        port: 8016,
        open: false,
        proxy: {
            // process.env.VUE_APP_BASE_API 是在 .env 文件中定义的全局变量 VUE_APP_BASE_API
            [process.env.VUE_APP_BASE_API]: {
                // target: 'https://api.bizzans.com', // 测试环境
                // target: 'https://api.bizzan.pro', // 测试环境
                target: 'http://192.168.0.67:9999', // 测试环境
                // target: 'https://861a-119-137-54-93.ngrok.io', // 本地联调
                // target: 'http://81.71.137.210:7080', // 本地联调
                
                changeOrigin: true, //开启代理
                ws: true, // 是否启用websockets
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            },
            // '/netty': {
            //     target: 'ws://192.168.0.57:8080',
            //     changeOrigin: true,
            //     ws: true,
            //     pathRewrite: {
            //         '^/netty': '/netty',
            //     }
            // },
            // 设置多个代理行为
            // 带有 /uc 开头的接口，被代理到 'http://192.168.0.110:6001'
            // 例如： 请求接口 /uc/check/login
            // 浏览器F12显示：http://192.168.0.109:8080/uc/check/login
            // 被代理到：http://192.168.0.110:6001/uc/check/login
            // '/otc': {
            //     target: 'http://192.168.0.110:9999',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/otc': '/otc',
            //     }
            // },
            // '/marker': {
            //     target: 'https://api.bizzans.com',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/marker': '/marker',
            //     }
            // },
        }
    },
    // 调整 webpack 配置
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
                '@assets': resolve('src/assets'),
                'vue$': 'vue/dist/vue.esm.js',
                '@js':resolve('src/assets/js'),
                '@components':resolve('src/components')
            }
            
        }
    },
    // 向CSS相关的 loader 传递选项
    css: {
        // loaderOptions: {
        //     // 这里的选项会传递给 sass-loader
        //     sass: {
        //         // 配置sass全局变量
        //         prependData: `@import '~@/assets/css/public.scss';`
        //     }
        // }
    },

    // 是一个函数，会接受一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更洗粒度的修改。
    chainWebpack: config => {
        /**
         * 删除懒加载模块的 prefetch preload，降低带宽压力
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
         * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
         */
        config.plugins
            .delete('prefetch')
            .delete('preload')
        // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
        config.resolve
            .symlinks(true)
    }

}