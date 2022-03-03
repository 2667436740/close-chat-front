export default {
	data() {
		return {
			uid: "",
			imgUrl: "",
			token: "",
			username: "",
			baseUrl: ''
		}
	},
	onLoad() {
		this.getUserStorage()
		this.baseUrl = this.$store.state.BASE_URL //从vuex里取 BASE_URL （解决小程序为undefined的bug）
	},
	onShow() {
		// this.getUserStorage()
	},
	methods: {
		//获取缓存
		getUserStorage() {
			const value = uni.getStorageSync('user');
			if (value) {
				this.uid = value.id,
				this.imgUrl = `${this.BASE_URL}/avatar/${value.imgUrl}`,
				this.token = value.token,
				this.username = value.username
			} else {
				uni.redirectTo({
					url: '../login/login'
				})
			}
		}
	}
}
