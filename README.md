# vision
实时监控平台
•	主要技术栈：Vue2，axios，Vue-Router，ECharts，koa
•	使用ECharts搭建多种动态可视化图表组件库；
•	搭建socket中间件实现数据收发的监听；
•	监控页面图表全屏点击，通过socket实现各个页面全屏同步；

## 项目启动
在VISION文件夹下的koa_serve中，cmd里`node app.js`启动koa的后端数据；可实时监听数据请求状况
在VISION文件夹中（本文件夹）的调试终端中先`npm install`安装相关依赖，再`npm run serve`启动页面；



