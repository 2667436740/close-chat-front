<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			//收到通知消息
			plus.push.addEventListener('click', message => {
				let payload = message.payload
				try {

				} catch (e) {
					//TODO handle the exception
				}
			})
			//收到透传消息
			plus.push.addEventListener('receive', message => {
				let payload = message.payload
				try {

				} catch (e) {
					//TODO handle the exception
				}
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')
			uni.connectSocket({
				url: this.$store.state.SOCKET_URL,
				success: res => {
					// uni.showToast({
					// 	title: 'websocket 连接了',
					// 	duration: 2000
					// });
					console.log('websocket 连接了')
				}
			})
			// uni.$emit('reNew')
		},
		onHide: function() {
			console.log('App Hide')
			uni.setStorageSync('hideApp', 1)
		},
		methods: {}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	@import './static/css/uni.css';

	/*每个页面公共css */
</style>
