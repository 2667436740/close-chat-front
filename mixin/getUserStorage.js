export default {
	data() {
		return {
			uid: "",
			imgUrl: "",
			token: "",
			username: "",
		}
	},
	onShow() {
		this.getUserStorage()
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
