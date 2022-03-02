import App from './App'
import Vue from 'vue'
//引入weapp.socket.io
import io from '@hyoga/uni-socket.io'

Vue.config.productionTip = false

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

App.mpType = 'app'
const app = new Vue({
	...App
})

// 引入请求封装，将app参数传递到配置中
require('./config/request.js')(app)

// Vue.prototype.BASE_URL = 'http://192.168.1.106:3000' //全局后端地址
Vue.prototype.BASE_URL = 'http://124.221.144.134:3000' //全局后端地址

Vue.prototype.socket = io('http://124.221.144.134:8082',{
  query: {},
  transports: [ 'websocket', 'polling' ], //必须，web端为轮询，小程序app端为websocket
  timeout: 5000,
})

app.$mount()
