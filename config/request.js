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
}
