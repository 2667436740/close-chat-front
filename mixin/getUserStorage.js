export default {
	data() {
		return {
			uid: "",
			imgUrl: "",
			token: "",
			username: "",
			baseUrl: '',
			bgUrl: ''
		}
	},
	onLoad() {
		this.getUserStorage()
		this.baseUrl = this.$store.state.BASE_URL //从vuex里取 BASE_URL （解决小程序为undefined的bug）
		this.join()
	},
	onShow() {
		// this.getUserStorage()
	},
	methods: {
		//获取缓存
		getUserStorage() {
			const value = uni.getStorageSync('user');
			if (value) {
				this.uid = value.id
				this.imgUrl = `${this.BASE_URL}/avatar/${value.imgUrl}`
				this.token = value.token
				this.username = value.username
				this.bgUrl = value.bgUrl
			} else {
				uni.redirectTo({
					url: '../login/login'
				})
			}
		},
		//用户登录socket注册(除了登录和注册页)
		join() {
			this.socket.emit('login', this.uid)
		},
	}
}
