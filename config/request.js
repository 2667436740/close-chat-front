module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		// #ifdef H5
		config.baseURL = '/api'; /* H5 */
		// #endif
		// #ifdef APP-PLUS ||MP
		config.baseURL = 'http://192.168.8.84:3000'; /* 安卓 */
		// #endif

		return config
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		const data = response.data
		if (data.status == 300) {
			// this.$refs.uToast.show({
			// 	type: 'error',
			// 	message: "登录状态失效!"
			// })
			setTimeout(() => {
				uni.redirectTo({
					url: '../login/login'
				})
			}, 2000)
		} else if (data.status == 500) {
			// this.$refs.uToast.show({
			// 	type: 'error',
			// 	message: "服务器出错啦!"
			// })
		}
		return response
	}, (response) => {
		// 对响应错误做点什么 （statusCode !== 200）
		// return Promise.reject(response)
	})
}
