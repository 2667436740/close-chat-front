import App from './App'
import Vue from 'vue'

//引入weapp.socket.io
import io from '@hyoga/uni-socket.io'

//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store

import global from './config/global.js'

Vue.config.productionTip = false

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

App.mpType = 'app'
const app = new Vue({
	...App,
	store
})

// 引入请求封装，将app参数传递到配置中
require('./config/request.js')(app)

Vue.prototype.BASE_URL = global.BASE_URL //全局后端地址

Vue.prototype.socket = io(global.SOCKET_URL,{ //socket地址
  query: {},
  transports: [ 'websocket', 'polling' ], //必须，web端为轮询，小程序app端为websocket
  timeout: 5000,
})

app.$mount()
