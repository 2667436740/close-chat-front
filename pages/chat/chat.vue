<template>
	<view>
		<u-navbar title="我是大海" rightIcon="more-dot-fill" @rightClick="rightClick" @leftClick="leftClick" fixed
			:placeholder="true" :safeAreaInsetTop="true"></u-navbar>
		<view class="message-box" :style="{paddingBottom: dynamicBoxHeight + 'px'}" @touchstart="closeToolsBox">
			<view v-for="(item,index) in sortMsgs">
				<view class="time" v-if="hideSpaceTime(index)">
					{{changeTime(item.time)}}
				</view>
				<view class="opposite" v-if="item.id != 'b'">
					<view class="opposite-avatar">
						<u-avatar :src="item.imgUrl" shape="square"></u-avatar>
					</view>
					<view class="opposite-message" v-if="item.types == 0">{{item.message}}</view>
					<view class="opposite-message-img" v-if="item.types == 1">
						<image :src="item.message" mode="widthFix" class="chat-img" @click="previewImage(item.message)">
						</image>
					</view>
					<view class="opposite-message" v-if="item.types == 3">
						<map style="max-width: 100%; height: 150px;" :latitude="item.message.latitude"
							:longitude="item.message.longitude" :markers="item.message.covers">
						</map>
					</view>
				</view>
				<view class="me" v-if="item.id == 'b'">
					<view class="me-avatar">
						<u-avatar :src="item.imgUrl" shape="square"></u-avatar>
					</view>
					<view class="me-message" v-if="item.types == 0">{{item.message}}</view>
					<view class="me-message-img" v-if="item.types == 1">
						<image :src="item.message" mode="widthFix" class="chat-img" @click="previewImage(item.message)">
						</image>
					</view>
					<view class="me-message" v-if="item.types == 3">
						<view class="">
							{{item.message.name}}
						</view>
						<view class="">
							{{item.message.address}}
						</view>
						<map style="max-width: 100%; height: 150px;" :latitude="item.message.latitude"
							:longitude="item.message.longitude" :markers="covers(item.message)">
						</map>
					</view>
				</view>
			</view>
		</view>

		<view class="dynamic-box" ref="dynamicbox">
			<view class="send-tool-bar">
				<view class="input-msg">
					<!-- <u--input v-model="message" shape='circle' size="small" class="input" :autosize="true" type="textarea"></u--input> -->
					<u--textarea v-model="message" autoHeight class="input" :fixed='true' maxlength='-1'
						:adjustPosition='true' @focus="keyboardHeightChange"></u--textarea>
				</view>
				<view class="send-btns">
					<u-button type="success" shape='circle' size="small" @click="sendMessage(message,0)">发送</u-button>
					<u-icon name="plus-circle" color="#616161" size="30" @click="moreClick"></u-icon>
				</view>
			</view>

			<view class="tools-box" v-if="isShowToolsBox" ref="toolsbox">
				<u-grid :border="false" col="4" class="grid" v-if="isShowGrid">
					<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex" @click="toolClick(listIndex)">
						<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="listItem.name" :size="35"></u-icon>
						<text class="grid-text">{{listItem.title}}</text>
					</u-grid-item>
				</u-grid>

				<view class="phiz" v-if="isShowPhiz">
					<emoji @emoji="emoji"></emoji>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import myfun from '../../commons/util/myfun.js'
	import emoji from '../../components/emoji.vue'
	export default {
		data() {
			return {
				msgs: [{
						id: 'a',
						imgUrl: 'https://cdn.uviewui.com/uview/album/1.jpg',
						message: 'balabala我说了很多',
						types: 0,
						time: new Date() - 1000,
						tip: 0
					},
					{
						id: 'a',
						imgUrl: 'https://cdn.uviewui.com/uview/album/1.jpg',
						message: 'hgauewgfjHSALDHAEIFHBAGSHDF我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala',
						types: 0,
						time: new Date() - 1000 * 160,
						tip: 1
					}, {
						id: 'b',
						imgUrl: 'https://cdn.uviewui.com/uview/album/2.jpg',
						message: 'https://cdn.uviewui.com/uview/album/10.jpg',
						types: 1,
						time: new Date() - 1000 * 16 * 1000,
						tip: 2
					}, {
						id: 'b',
						imgUrl: 'https://cdn.uviewui.com/uview/album/2.jpg',
						message: '我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala我说了很多balabala',
						types: 0,
						time: new Date() - 1000 * 16 * 5000,
						tip: 3
					}, {
						id: 'a',
						imgUrl: 'https://cdn.uviewui.com/uview/album/1.jpg',
						message: 'https://cdn.uviewui.com/uview/album/5.jpg',
						types: 1,
						time: new Date() - 1000 * 16 * 10000,
						tip: 4
					}, {
						id: 'b',
						imgUrl: 'https://cdn.uviewui.com/uview/album/2.jpg',
						message: 'https://cdn.uviewui.com/uview/album/8.jpg',
						types: 1,
						time: new Date() - 1000 * 16 * 1000000,
						tip: 5
					}, {
						id: 'b',
						imgUrl: 'https://cdn.uviewui.com/uview/album/2.jpg',
						message: {
							name: '天安门',
							address: '北京市东城区东长安街',
							latitude: 39.908821,
							longitude: 116.397469,
						},
						types: 3,
						time: new Date() - 1000 * 16 * 1000000,
						tip: 6
					}
				],
				sortMsgs: [],
				preImgs: [],
				message: '',
				isShowToolsBox: false,
				list: [{
						name: 'coupon',
						title: '表情'
					},
					{
						name: 'photo',
						title: '图片'
					},
					{
						name: 'camera',
						title: '拍摄'
					},
					{
						name: 'attach',
						title: '文件'
					},
					{
						name: 'map',
						title: '位置'
					}
				],
				dynamicBoxHeight: 44,
				keyboardHeight: 0,
				isShowGrid: true,
				isShowPhiz: false
			};
		},
		components: {
			emoji
		},
		onShow() {
			//排序信息先后
			this.sortMsgs = this.msgs.sort(function(a, b) {
				return b.tip - a.tip
			})
			//准备预览图片列表
			for (let item of this.sortMsgs) {
				if (item.types == 1) this.preImgs.push(item.message)
			}
			//进入页面时，直接页面底部
			this.$nextTick(() => {
				this.pageScrollToBottom(0)
			});
		},
		onReady() {
			//获取元素高度等
			this.$nextTick(function() {
				console.log(this.$refs.dynamicbox.$el.offsetHeight)
			})
		},
		watch: {
			message(newM, oldM) {
				// console.log(newM,oldM)
				this.$nextTick(function() {
					this.dynamicBoxHeight = this.$refs.dynamicbox.$el.offsetHeight
				})
			},
			dynamicBoxHeight(newM, oldM) {
				console.log(newM, oldM)
				this.$nextTick(() => {
					this.pageScrollToBottom(200)
				});
			}
		},
		methods: {
			leftClick() {
				uni.switchTab({
					url: '../index/index'
				})
			},
			rightClick() {
				uni.$u.toast('暂未开放')
			},
			changeTime(time) {
				return myfun.weChatTimeFormat(time)
			},
			previewImage(currentMessage) {
				uni.previewImage({
					current: currentMessage, //传当前点击图片的url
					urls: this.preImgs,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			hideSpaceTime(index) {
				if (index == 0) return true
				else return myfun.spaceTime(this.sortMsgs[index - 1].time, this.sortMsgs[index].time) == '' ? false : true
			},
			moreClick() {
				this.isShowToolsBox = !this.isShowToolsBox
				if (this.isShowToolsBox == true) {
					this.$nextTick(function() {
						this.isShowGrid = true
						this.isShowPhiz = false
						this.dynamicBoxHeight += this.$refs.toolsbox.$el.offsetHeight
					})
				} else {
					this.$nextTick(function() {
						this.dynamicBoxHeight = this.$refs.dynamicbox.$el.offsetHeight
					})
				}

				this.$nextTick(function() {
					this.pageScrollToBottom(200)
				})
			},
			//滚动到页面底部
			pageScrollToBottom(delay) {
				uni.pageScrollTo({
					scrollTop: 99999,
					duration: delay //滚动延时
				});
			},
			closeToolsBox() {
				if (this.isShowToolsBox == true) {
					this.isShowToolsBox = false
					this.$nextTick(function() {
						this.dynamicBoxHeight = this.$refs.dynamicbox.$el.offsetHeight
						this.pageScrollToBottom(200)
					})
				}
			},
			send(message, types) {
				let len = this.sortMsgs.length
				let data = {
					id: 'b',
					imgUrl: 'https://cdn.uviewui.com/uview/album/2.jpg',
					message: message,
					types: types,
					time: new Date(),
					tip: len
				}
				this.sortMsgs.push(data)
				this.message = ''
				this.$nextTick(() => {
					setTimeout(() => {
						this.isShowPhiz = false
						this.isShowToolsBox = false
						this.dynamicBoxHeight = 44
						console.log('sendok...' + this.dynamicBoxHeight)
					}, 100)
					this.pageScrollToBottom(200)
				});
			},
			sendMessage(message, types) {
				switch (types) {
					case 0: //文字
						if (this.message != '') {
							this.send(message, types)
						}
						break;
					case 1: //图片
						this.send(message, types)
						this.preImgs.push(message)
						break;
					case 2: //音频
						// uni.$u.toast('功能开发中')
						break;
					case 3: //定位
						this.send(message, types)
						console.log(message)
						break;
					case 4:
						break;
				}
			},
			keyboardHeightChange(e) {
				// this.dynamicBoxHeight += e.detail.height
				console.log(e)
			},
			toolClick(index) {
				switch (index) {
					case 0:
						this.isShowGrid = false
						this.isShowPhiz = true
						break;
					case 1:
						this.sendImg('album')
						break;
					case 2:
						this.sendImg('camera')
						break;
					case 3:
						uni.$u.toast('功能开发中')
						break;
					case 4:
						this.chooseLocation()
						break;
				}
			},
			emoji(e) {
				this.message += e
			},
			sendImg(type) {
				let count = 9
				if (type == 'camera') count = 1

				uni.chooseImage({
					count: count,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [type], //拍照
					success: (res) => {
						const imgPaths = res.tempFilePaths
						for (let i = 0; i < imgPaths.length; i++) {
							this.sendMessage(imgPaths[i], 1)
						}
					}
				});
			},
			chooseLocation() {
				uni.chooseLocation({
					success: (res) => {
						let data = {
							name: res.name,
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude,
						}
						this.sendMessage(data, 3)
					}
				});
			},
			covers(e) {
				return [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/img/location.png',
					width: 35
				}]
			}
		},

		// //监听页面显示
		// onShow() {
		// 	uni.onKeyboardHeightChange(res => {
		// 		//获取键盘高度
		// 		//键盘高度改变时调用
		// 		if (this.data.first) { //弹起时第一次的数据是错误的，所以不需要修改keyBoardHeight
		// 			this.setData({
		// 				first: false //将first改为false表示不是第一次调用
		// 			})
		// 		} else {
		// 			console.log(res.height)
		// 			this.keyboardHeight = res.height;
		// 			this.dynamicBoxHeight += this.keyboardHeight
		// 			this.pageScrollToBottom(200)
		// 		}

		// 	})
		// }
	}
</script>

<style lang="scss">
	.message-box {
		padding-bottom: 44px;

		.time {
			text-align: center;
			padding: 10px 0;
			font-size: 14px;
			color: gray;
		}

		.opposite {
			padding-left: 20px;
			overflow: hidden;
			padding-bottom: 20px;

			.opposite-avatar {
				padding-right: 10px;
				float: left;
			}

			.opposite-message {
				max-width: 65%;
				border: 1px solid #b3b3b3;
				border-radius: 0 10px 10px 10px;
				padding: 8px;
				float: left;
			}

			.opposite-message-img {
				max-width: 65%;
				padding: 8px;
				float: left;
			}
		}

		.me {
			padding-right: 20px;
			overflow: hidden;
			padding-bottom: 20px;

			.me-avatar {
				padding-left: 10px;
				float: right;
			}

			.me-message {
				max-width: 65%;
				background-color: #40ce40;
				border-radius: 10px 0 10px 10px;
				padding: 8px;
				float: right;
			}

			.me-message-img {
				max-width: 65%;
				padding: 8px;
				float: right;
			}
		}

		.chat-img {
			max-width: 100%;
			border-radius: 10px;
		}
	}

	.dynamic-box {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #f4f4f4;
	}

	.send-tool-bar {
		min-height: 40px;
		padding: 4px 0;
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.input-msg {
			flex: 1;
			padding-left: 10px;
			width: 300rpx;

			.input {
				background-color: white;
			}
		}

		.send-btns {
			width: 100px;
			padding-left: 5px;
			padding-right: 10px;
			display: flex;
		}
	}

	.tools-box {
		height: 160px;
		display: flex;
		width: 100%;

		.grid {
			width: 100%;
		}

		.phiz {
			width: 100%;
			justify-content: center;
		}
	}

	.high-box {
		padding-bottom: 144px;
	}
</style>
