import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
			// BASE_URL: 'http://192.168.1.106:3000',
			// BASE_URL: 'http://192.168.8.84:3000',
			BASE_URL: 'http://124.221.144.134:3000',
		},
    mutations: {},
    actions: {}
})
export default store