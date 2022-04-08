import global from './global.js'

module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		// #ifdef H5
		config.baseURL = '/api'; /* H5 */
		// #endif
		// #ifdef APP-PLUS ||MP
		config.baseURL = global.BASE_URL; /* 安卓 */
		// #endif

		return config
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		const data = response.data
		if (data.status == 300) {
			uni.showToast({
				title: '登录状态失效!',
				duration: 1000,
				icon: 'error',
			});
			setTimeout(() => {
				uni.redirectTo({
					url: '../login/login'
				})
			}, 2000)
		} 
		if (data.status == 500) {
			// uni.showToast({
			// 	title: '网络出错啦!',
			// 	duration: 1000,
			// 	icon: 'error',
			// });
		}
		return response
	}, (response) => {
		// 对响应错误做点什么 （statusCode !== 200）
		// return Promise.reject(response)
	})
}
