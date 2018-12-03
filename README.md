## xigua_cli
基于`webpack4+`，服务于**西瓜创客**的前端`react`单页面应用，以实现工程化的脚手架工具。
### Installation
`Node.js`: >=8.x
```
$ yarn global add xigua_cli
or
$ npm install xigua_cli -g
```
### Usage
```
$ xigua init <project-name>
```
Example:
```
$ xigua init admin // 在当前目录下创建admin项目
```
上述命令会从 `pizza` 下载最新的模板。
如果要从本地拉取模板，可以使用：
```
$ xigua init <project-name> -l
or
$ xigua init <project-name> --local
```
### command line
当初始化项目的时候，会有相关交互命令：
```
? Project name (<project-name>) - 项目名称
? Project description - 项目的描述
? Use sentry to your code? (Y/n) - 是否使用sentry 默认true
? Use sensor to your code? (Y/n) - 是否使用sensor 默认是true
? Compatible your code to IE? (Y/n) - 是否兼容IE9 默认是false
```
### build
所有的 `build` 过程都是由 `webpack` 完成。
```
$ yarn build
```
### dev
```
$ yarn start
or
$ yarn dev
```
使用以上命令，在本地开启服务，用来本地开发。
### config
为了配置本地开发和打包文件，可以修改 `/config/index.js`
```
module.exports = {
// 本地开发相关配置
dev: {
    port: 5000,                 // 本地服务端口号
    publicPath: '/',            // 静态资源引用地址
    directory: 'static',        // 资源目录
    proxy: {},                  // 代理配置
    open: true,                 // 是否打开浏览器
    host: '127.0.0.1',          // 本地服务地址
    rules: {}                   // 开发环境的eslint规则                                                
},
// 文件打包相关配置
build: {
    publicPath: '/',            // 静态资源引用地址
    directory: 'static',        // 资源目录
    rules: {}                   // 线上环境的eslint规则
}
}
```
### structure
```
- src
    - api             // api接口的集合目录
        - api-home.js   // home模块的所有api集合
    - components      // 组件的集合目录
        - loading       // loading组件
    - pages           // 页面入口
        - home          // home页面
            - pages_home.js
            - pages_home.scss
        ...
    - public          // 公共资源
        - img
        - js
    - router         // 路由目录
        - home
            - router_home.js
        router.js      // 路由入口文件
    - utils          // 工具函数
        - utils_fetch.js  // axios的上层封装
    - App.js            // 项目总入口文件
    - App.scss
    - main.js           // 项目的根文件，webpack的入口文件
```
命名规范： 需要体现出文件所在的目录

### test
- 项目组件测试
```
$ yarn test
```
- 组件测试
```
// 测试弹窗组件
$ yarn ct src/components/prompt
```

### image compress
> 框架支持打包过程，图片自动压缩（默认只压缩png）

### auto oss
> 框架支持打包后文件自动上传阿里云oss
> 相同的文件不会重复上传到阿里云oss
### deploy
> 建议采用`Jenkins`部署
- 进入`Jenkins`页面，例如`jenkins.xiguacity.cn`
- **测试环境**
```
// 项目名称
PROJECT_NAME
// 容器端口号
PORT
// git的分支
BRANCH
// docker镜像仓库名
REGISTRY
```
考虑到，多人同时开发，使用端口号区分。（张三：6301，李四：6302）
- **预发布环境**
```
// 项目名称
PROJECT_NAME
// 容器端口号
PORT
// docker镜像仓库名
REGISTRY
```
默认采用`master`或者`develop`分支，完全模拟线上环境。
- **生产环境**
```
// 项目名称
PROJECT_NAME
```
拉取预发布的`latest`镜像。
- **回滚环境**

