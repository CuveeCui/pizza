## xigua-cli
基于`webpack4+`，服务于**西瓜创客**的前端`react`单页面应用，以实现工程化的脚手架工具。
### Installation
`Node.js`: >=8.x
```
$ yarn global add xigua-cli
or
$ npm install xigua-cli -g
```
###Usage
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
    host: '127.0.0.1'           // 本地服务地址
},
// 文件打包相关配置
build: {
    publicPath: '/',            // 静态资源引用地址
    directory: 'static',        // 资源目录
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
            - pages-home.js
            - pages-home.scss
        ...
    - public          // 公共资源
        - img
        - js
    - router         // 路由目录
        - home
            - router-home.js
        router.js      // 路由入口文件
    - utils          // 工具函数
        - utils-fetch.js  // axios的上层封装
    - App.js            // 项目总入口文件
    - App.scss
    - main.js           // 项目的根文件，webpack的入口文件
```
命名规范： 需要体现出文件所在的目录

### deploy
```
- deploy
- front-deploy.py
- front-deploy.yml
```
为了解决测试环境同一项目的多人部署，在测试环境的部署当中，采用docker部署。执行以下命令：
```
$ python front-deploy.py cuizaiyong
```
