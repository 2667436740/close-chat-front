import Vue from 'vue'
import Vuex from 'vuex'
import global from '../config/global.js'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
			BASE_URL: global.BASE_URL, //后台地址
			SOCKET_URL: global.SOCKET_URL, //socket地址
		},
    mutations: {},
    actions: {}
})
export default store