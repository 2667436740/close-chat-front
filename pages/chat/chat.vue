<template>
	<view>
		<u-navbar :title="fusername" rightIcon="more-dot-fill" @rightClick="rightClick(fid)" @leftClick="leftClick"
			fixed :placeholder="true" :safeAreaInsetTop="true" class="navbar"></u-navbar>
		<view class="message-box" @touchstart="closeToolsBox">
			<view v-for="(item,index) in sortMsgs" :key="item.id">
				<view class="time" v-if="hideSpaceTime(index)">
					{{changeTime(item.time)}}
				</view>
				<!-- 对方 -->
				<view class="opposite" v-if="item.fromId != uid">
					<view class="opposite-avatar">
						<u-avatar :src="`${baseUrl}/avatar/${item.imgUrl}`" shape="square" @click="infoPageJump(fid)">
						</u-avatar>
					</view>
					<view class="opposite-message" v-if="item.types == 0">
						<u--text :text="item.message" wordWrap="anywhere"></u--text>
					</view>
					<view class="opposite-message-img" v-if="item.types == 1">
						<image :src="`${baseUrl}/chat/${item.message}`" mode="widthFix" class="chat-img"
							@click="previewImage(item.message)">
						</image>
					</view>
					<view class="opposite-message" v-if="item.types == 3">
						<view class="map-name">
							{{JSON.parse(item.message).name}}
						</view>
						<view class="address">
							{{JSON.parse(item.message).address}}
						</view>
						<map style="max-width: 100%; height: 150px;z-index: 1;"
							:latitude="JSON.parse(item.message).latitude"
							:longitude="JSON.parse(item.message).longitude" :markers="covers(JSON.parse(item.message))">
						</map>
					</view>
				</view>
				<!-- 自己 -->
				<view class="me" v-if="item.fromId == uid">
					<view class="me-avatar">
						<u-avatar :src="`${baseUrl}/avatar/${item.imgUrl}`" shape="square" @click="infoPageJump(uid)">
						</u-avatar>
					</view>
					<view class="me-message" v-if="item.types == 0">
						<u--text :text="item.message" wordWrap="anywhere"></u--text>
					</view>
					<view class="me-message-img" v-if="item.types == 1">
						<image :src="`${baseUrl}/chat/${item.message}`" mode="widthFix" class="chat-img"
							@click="previewImage(item.message)">
						</image>
					</view>
					<view class="me-message" v-if="item.types == 3">
						<view class="map-name">
							{{JSON.parse(item.message).name}}
						</view>
						<view class="address">
							{{JSON.parse(item.message).address}}
						</view>
						<map style="max-width: 100%; height: 150px;" :latitude="JSON.parse(item.message).latitude"
							:longitude="JSON.parse(item.message).longitude" :markers="covers(JSON.parse(item.message))">
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
						:adjustPosition='true'></u--textarea>
				</view>
				<view class="send-btns">
					<u-button type="success" shape='circle' size="small" @click="sendMessage(message,0)"
						class="send-btn">发送</u-button>
					<u-icon name="plus-circle" color="#616161" size="30" @click="moreClick"></u-icon>
				</view>
			</view>

			<view class="tools-box" v-if="isShowToolsBox" ref="toolsbox">
				<u-grid :border="false" col="4" class="grid" v-if="isShowGrid">
					<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex" @click="toolClick(listIndex)"
						class="grid-item">
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
	import getUserStorage from '../../mixin/getUserStorage.js'
	import {
		getMsg,
		uploadAvatar,
		postClearUnreadMsg,
	} from '../../config/api.js'
	import {
		pathToBase64
	} from 'image-tools'

	export default {
		data() {
			return {
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
				isShowGrid: false,
				isShowPhiz: false,
				fid: '',
				fimgUrl: '',
				fusername: '',
				nowPage: 0,
				pageSize: 20,
				noexebshowFalg: true, //不允许再次触发onshow这个声明周期
			};
		},
		components: {
			emoji
		},
		mixins: [getUserStorage],
		onLoad(option) {
			this.fid = option.id
			this.fimgUrl = option.imgUrl
			this.fusername = option.username
			this.getChatMsg(this.nowPage, this.pageSize)
			this.listenMsg()
			this.getDraftMsg()
		},
		onShow() {
			if (this.noexebshowFalg) {
				//进入页面时，直接页面底部
				setTimeout(() => {
					this.pageScrollToBottom(0)
				}, 500)
			}
		},
		//下拉加载数据
		onPullDownRefresh() {
			this.getChatMsg(this.nowPage, this.pageSize)
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			//获取缓存是否有草稿
			getDraftMsg() {
				const value = uni.getStorageSync(this.fid)
				if (value) this.message = value.message
				uni.removeStorageSync(this.fid)
			},
			//跳转个人信息页
			infoPageJump(id) {
				uni.navigateTo({
					url: '../information/information?id=' + id
				})
			},
			//返回主页
			async leftClick() {
				const params = {
					uid: this.fid,
					fid: this.uid,
					token: this.token
				}
				const res = await postClearUnreadMsg(params)
				if (res.data.status == 200) {
					uni.$emit('clearUnreadNum', {
						clearId: this.fid
					})
				}
				//返回保留草稿消息
				if (this.message != '') {
					uni.setStorageSync(this.fid, {
						message: this.message
					})
					uni.$emit('draft', {
						draftId: this.fid,
						draftType: 1, //有草稿
						message: this.message
					})
				} else {
					uni.$emit('draft', {
						draftId: this.fid,
						draftType: 0 //无草稿
					})
				}
				uni.switchTab({
					url: '../index/index'
				})
			},
			//右上角 '···' 点击
			rightClick(id) {
				uni.navigateTo({
					url: '../information/information?id=' + id
				})
			},
			//格式化时间显示
			changeTime(time) {
				return myfun.weChatTimeFormat(time)
			},
			//预览图片
			previewImage(currentMessage) {
				// console.log(currentMessage)
				this.noexebshowFalg = false; //不允许再次触发onshow这个声明周期
				uni.previewImage({
					current: `${this.baseUrl}/chat/${currentMessage}`, //传当前点击图片的url
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
			//判断两个消息时间差是否过小，隐藏时间
			hideSpaceTime(index) {
				if (index == 0) return true
				else return myfun.spaceTime(this.sortMsgs[index - 1].time, this.sortMsgs[index].time) == '' ? false : true
			},
			// 加号‘+’点击
			moreClick() {
				this.isShowToolsBox = !this.isShowToolsBox
				if (this.isShowToolsBox == true) {
					this.$nextTick(function() {
						this.isShowGrid = true
						this.isShowPhiz = false
					})
				} else {}
			},
			//滚动到页面底部
			pageScrollToBottom(delay) {
				this.$nextTick(function() {
					uni.pageScrollTo({
						scrollTop: 99999999999,
						duration: delay //滚动延时
					});
				})
			},
			closeToolsBox() {
				if (this.isShowToolsBox == true) {
					this.isShowToolsBox = false
				}
			},
			//本地消息列添加消息
			addMsg(message, types, fromId) {
				let data = {
					fromId: fromId == this.fid ? this.fid : this.uid,
					imgUrl: fromId == this.fid ? this.fimgUrl : this.imgUrl.replace(/(.*\/)*([^.]+).*/ig, "$2") + '.' +
						this.imgUrl.replace(/.+\./,
							""), //获取文件名和后缀( 如xxx.png )  
					message: message,
					types: types,
					time: new Date().getTime(),
				}
				this.sortMsgs.push(data)
				fromId == this.fid ? null : this.message = '' //对方发来的输入框消息不清空

				this.pageScrollToBottom(200)
			},
			//本地消息列添加消息 和 通过socket发送到服务器
			async send(message, types) {
				//socket提交
				if (types == 0) { //文字
					this.addMsg(message, types)
					const msgObj = [{
						message: message,
						types: types
					}]
					this.socket.emit('msg', msgObj, this.uid, this.fid)
				}
				if (types == 1) { //图片
					let imgUrl
					const res = await uploadAvatar({
						url: 'chat',
						name: new Date().getTime() + this.uid,
						base64: await pathToBase64(message),
						token: this.token,
					})
					if (res.data.status == 200) {
						imgUrl = res.data.result.fileName //   xxxxxx.png
						this.addMsg(imgUrl, types)
						this.preImgs.push(`${this.baseUrl}/chat/${imgUrl}`)
						const msgObj = [{
							message: imgUrl,
							types: types
						}]
						this.socket.emit('msg', msgObj, this.uid, this.fid)
					}
				}
				if (types == 3) { //定位
					this.addMsg(JSON.stringify(message), types)
					const msgObj = [{
						message: JSON.stringify(message),
						types: types
					}]
					this.socket.emit('msg', msgObj, this.uid, this.fid)
				}

				this.$nextTick(() => {
					setTimeout(() => {
						this.isShowPhiz = false
						this.isShowToolsBox = false
					}, 100)
					this.pageScrollToBottom(200)
				});
			},
			//发送消息
			sendMessage(message, types) {
				switch (types) {
					case 0: //文字
						if (this.message != '') {
							this.send(message, types)
						}
						break;
					case 1: //图片
						this.send(message, types)
						// this.preImgs.push(`${this.baseUrl}/chat/${message}`)
						break;
					case 2: //音频
						// uni.$u.toast('功能开发中')
						break;
					case 3: //定位
						this.send(message, types)
						console.log(message)
						break;
				}
			},
			//工具栏某功能点击
			toolClick(index) {
				switch (index) {
					case 0: //表情
						this.isShowGrid = false
						this.isShowPhiz = true
						break;
					case 1: //图片
						this.sendImg('album')
						break;
					case 2: //拍摄
						this.sendImg('camera')
						break;
					case 3: //文件
						uni.$u.toast('功能开发中')
						break;
					case 4: //位置
						this.chooseLocation()
						break;
				}
			},
			//添加文本emoji
			emoji(e) {
				this.message += e
			},
			//相册选图 或 拍摄
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
							this.sendMessage(imgPaths[i], 1) //imgPaths[i]为临时图片地址
						}
					}
				});
			},
			//选择定位
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
			//定位上的中心图标
			covers(e) {
				return [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/img/location.png',
					width: 35
				}]
			},
			//获取聊天消息列表
			async getChatMsg(nowPage, pageSize) {
				const params = {
					uid: this.uid,
					fid: this.fid,
					nowPage: nowPage,
					pageSize: pageSize,
					token: this.token
				}
				const res = await getMsg(params)
				let msgs = res.data.result
				let sortMsgs = msgs.sort(function(a, b) {
					return a.time - b.time
				})
				this.sortMsgs = [...sortMsgs, ...this.sortMsgs]
				//准备预览图片列表
				this.preImgs = []
				for (let item of this.sortMsgs) {
					if (item.types == 1) this.preImgs.push(`${this.baseUrl}/chat/${item.message}`)
				}
				this.nowPage++
			},
			//监听接收socket传来的消息
			listenMsg() {
				this.socket.on('msg', (msgObj, fromId, tip) => {
					//一对一判断,只有对方发来的才更新消息
					if (fromId == this.fid && tip == 0) {
						console.log('接收到了消息,' + msgObj + fromId)
						if (msgObj[0].types == 0) { //文字
							this.addMsg(msgObj[0].message, msgObj[0].types, fromId)
						}
						if (msgObj[0].types == 1) { //图片
							this.addMsg(msgObj[0].message, msgObj[0].types, fromId)
							this.preImgs.push(`${this.baseUrl}/chat/${msgObj[0].message}`)
						}
						if (msgObj[0].types == 3) { //定位
							this.addMsg(msgObj[0].message, msgObj[0].types, fromId)
						}
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	.navbar {
		z-index: 9999;
	}

	.map-name {
		font-size: 15px;
		font-weight: 600;
	}

	.address {
		font-size: 12px;
		color: #333333;
	}

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
				max-width: 60%;
				border: 1px solid #b3b3b3;
				border-radius: 0 10px 10px 10px;
				padding: 8px;
				float: left;
				word-wrap: break-word;
			}

			.opposite-message-img {
				max-width: 50%;
				padding: 8px;
				float: left;

				// image {
				// 	max-height: 50%;
				// 	max-width: 50%;
				// }
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
				max-width: 60%;
				background-color: #4fd653;
				border-radius: 10px 0 10px 10px;
				padding: 8px;
				float: right;
				word-wrap: break-word;
			}

			.me-message-img {
				max-width: 50%;
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
		padding: 6px 0;
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
			  max-height: 150px;
				overflow-y: scroll;
			}
		}

		.send-btns {
			width: 100px;
			padding-left: 5px;
			padding-right: 5px;
			display: flex;

			.send-btn {
				margin: 0 4px;
			}
		}
	}

	.tools-box {
		height: 320rpx;
		display: flex;
		width: 100%;
		background-color: #f4f4f4;

		.grid {
			margin: 0 10px 5px 10px;
			width: calc(100% - 20px);
			background-color: white;
			border-radius: 4px;

			.grid-item {
				margin: 5px 0;
			}
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
