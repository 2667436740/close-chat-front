import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
App.mpType = 'app'
const app = new Vue({
    ...App
})

// 引入请求封装，将app参数传递到配置中
require('./config/request.js')(app)

Vue.prototype.BASE_URL='http://192.168.8.84:3000' //全局后端地址

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif