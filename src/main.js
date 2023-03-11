import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入字体文件
import './assets/font/iconfont.css'
// grobal style
import './assets/css/global.less'
import axios from 'axios'
import SocketService from '@/utils/socket_service'
// 对服务端进行websocket连接
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance
// 请求基准路径配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 将axios挂载在vue
Vue.prototype.$http = axios

// import window.echarts
// this.$echarts
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
