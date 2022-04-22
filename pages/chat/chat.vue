<template>
	<view>
		<u-navbar :title="fusername" rightIcon="more-dot-fill" @rightClick="rightClick(fid)" @leftClick="leftClick"
			fixed :placeholder="true" :safeAreaInsetTop="true" class="navbar"></u-navbar>

		<view class="bg" :style="{'background-image': `url(${baseUrl}/bg/${bgUrl})`}" v-if="bgUrl" />

		<view class="message-box" @touchstart="closeToolsBox" :style="activeStyle" id="messageBox">

			<view v-for="(item,index) in sortMsgs" :key="item.id">
				<view class="time" v-if="hideSpaceTime(index)">
					{{changeTime(item.time)}}
				</view>
				<view class="withdraw" v-if="item.types == -1">
					{{showDelTip(item.isOwnDel)}}
				</view>
				<!-- 对方 -->
				<view class="opposite" v-if="item.fromId != uid">
					<view class="opposite-avatar" v-if="item.types != -1">
						<u-avatar :src="`${baseUrl}/avatar/${item.imgUrl}`" shape="square" @click="infoPageJump(fid)">
						</u-avatar>
					</view>
					<view class="msg-box">
						<view class="opposite-message" v-if="item.types == 0">
							<u--text :text="item.message" wordWrap="anywhere"></u--text>
							<!-- <u--text :text="item.message" wordWrap="anywhere" v-if="isUrl(item.message)" mode="link" :href="item.message"></u--text> -->
						</view>
						<view class="opposite-message-img" v-if="item.types == 1">
							<u-image :src="`${baseUrl}/chat/${item.message}`" mode="widthFix"
								@click="previewImage(item.message)" width="380rpx" height="380rpx" radius="10px"
								loadingIcon="reload">
								<u-loading-icon slot="loading" color="red"></u-loading-icon>
							</u-image>
						</view>
						<view class="opposite-message" v-if="item.types == 3">
							<view class="map-name">
								{{JSON.parse(item.message).name}}
							</view>
							<view class="address">
								{{JSON.parse(item.message).address}}
							</view>
							<map style="max-width: 100%; height: 150px;" :latitude="JSON.parse(item.message).latitude"
								:longitude="JSON.parse(item.message).longitude"
								:markers="covers(JSON.parse(item.message))">
							</map>
						</view>
					</view>
				</view>
				<!-- 自己 -->
				<view class="me" v-if="item.fromId == uid">
					<view class="me-avatar">
						<u-avatar :src="`${baseUrl}/avatar/${item.imgUrl}`" shape="square" @click="infoPageJump(uid)">
						</u-avatar>
					</view>
					<view class="msg-box" @longpress="onClick_msg(item, $event)">
						<view class="me-message" v-if="item.types == 0">
							<u--text :text="item.message" wordWrap="anywhere"></u--text>
						</view>
						<view class="me-message-img" v-if="item.types == 1">
							<view class="overlay" v-if="!isImgSendSuccess">
								<u-loading-icon class="loading-icon"></u-loading-icon>
							</view>
							<u-image :src="`${baseUrl}/chat/${item.message}`" mode="widthFix"
								@click="previewImage(item.message)" width="380rpx" height="380rpx" radius="10px">
								<u-loading-icon slot="loading" color="red"></u-loading-icon>
							</u-image>
						</view>
						<view class="me-message" v-if="item.types == 3">
							<view class="map-name">
								{{JSON.parse(item.message).name}}
							</view>
							<view class="address">
								{{JSON.parse(item.message).address}}
							</view>
							<map style="max-width: 100%; height: 150px;" :latitude="JSON.parse(item.message).latitude"
								:longitude="JSON.parse(item.message).longitude"
								:markers="covers(JSON.parse(item.message))">
							</map>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="dynamic-box" ref="dynamicbox" id="dynamicbox">
			<view class="send-tool-bar">
				<view class="input-msg">
					<!-- <u--input v-model="message" shape='circle' size="small" class="input" :autosize="true" type="textarea"></u--input> -->
					<u--textarea v-model="message" autoHeight class="input" :fixed='true' maxlength='-1'
						:adjustPosition='true' @confirm="sendMessage(message,0)" @linechange="linechange"></u--textarea>
				</view>
				<view class="send-btns">
					<u-button type="success" shape='circle' size="small" @click="sendMessage(message,0)"
						class="send-btn" v-if="message != ''">发送</u-button>
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

		<u-overlay :show="isShowTooltip" @click="isShowTooltip = false" opacity="0" duration="100">
			<view class="tooltip" :style="{top: tooltipLocation.clientY + 'px', left: tooltipLocation.clientX + 'px'}">
				<view class="tool-item" @click="withdraw">
					撤回
				</view>
			</view>
		</u-overlay>

		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import myfun from '../../commons/util/myfun.js'
	import emoji from '../../components/emoji/emoji.vue'
	import getUserStorage from '../../mixin/getUserStorage.js'
	import {
		getMsg,
		uploadAvatar,
		postClearUnreadMsg,
		deleteMsg,
	} from '../../config/api.js'
	import {
		pathToBase64
	} from 'image-tools'
	// import gcoord from 'gcoord'

	export default {
		data() {
			return {
				sortMsgs: [], //经过时间排序后 的 消息列表
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
				noexebshowFalg: true, //不允许再次触发onshow这个声明周期, 是否首次进入聊天页
				isClickSend: false, //自己是否 点发送 并 成功发送消息
				dynamicBoxHeight: 52, //输入栏高度
				isImgSendSuccess: true,
				messageBoxHeight: 0, //聊天盒高度
				tooltipLocation: {
					clientX: 100,
					clientY: 1700
				}, //鼠标点击的位置信息
				isShowTooltip: false,
				withdrawId: '', //需要撤回的消息id
			};
		},
		components: {
			emoji
		},
		mixins: [getUserStorage],
		watch: {
			dynamicBoxHeight: {
				handler(newName, oldName) {
					this.$nextTick(function() {
						this.pageScrollToBottom(200)
					})
				},
				immediate: true
			}
		},
		onLoad(option) {
			this.fid = option.id
			this.fimgUrl = option.imgUrl
			this.fusername = option.username
			this.getChatMsg(this.nowPage, this.pageSize)
			this.listenMsg()
			this.listenDelMsg()
			this.getDraftMsg()
		},
		onShow() {
			this.socket.emit('login', this.uid)
		},
		onReady() {
			// this.getDynamicBoxHeight()
		},
		//数据最新状态
		updated() {
			if (this.noexebshowFalg) {
				//进入页面时，直接页面底部
				this.pageScrollToBottom(0)
				this.noexebshowFalg = false
			}
		},
		//下拉加载数据
		onPullDownRefresh() {
			this.getChatMsg(this.nowPage, this.pageSize)
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		computed: {
			activeStyle() {
				// const bg = this.bgUrl ? `url(${this.baseUrl}/bg/${this.bgUrl})` : ''
				return {
					'padding-bottom': this.dynamicBoxHeight + 'px',
					// 'background-image': bg
				}
			}
		},
		methods: {
			showDelTip(isOwnDel) {
				return isOwnDel ? '撤回了一条消息' : '对方撤回了一条消息'
			},
			//长按消息显示 ‘撤回’ 等功能的tooltip
			onClick_msg(item, e) {
				this.withdrawId = item.uuid
				this.tooltipLocation.clientX = e.touches[0].clientX - 50
				this.tooltipLocation.clientY = e.touches[0].clientY - 40
				this.isShowTooltip = true
			},
			//撤回消息
			async withdraw() {
				let msg = this.sortMsgs.filter(e => {
					return e.uuid == this.withdrawId
				})[0]
				let msgTime = msg.time
				let nowTime = new Date().getTime()
				console.log(nowTime)
				console.log(msgTime) //有问题
				if (Math.abs(nowTime - msgTime) > 3 * 60 * 1000) {
					this.$refs.uToast.show({
						message: "时间超过三分钟，不可撤回"
					})
				} else {
					const params = {
						uuid: this.withdrawId
					}
					const res = await deleteMsg(params)
					if (res.data.status == 200) {
						//告诉对方撤回
						this.socket.emit('delmsg', this.withdrawId, this.fid)
						//撤回前端视觉上的消息
						this.sortMsgs.map((e, i) => {
							if (e.uuid == this.withdrawId) {
								this.sortMsgs.splice(i, 1, {
									types: -1,
									isOwnDel: true
								})
							}
						})
					}
				}
				this.withdrawId = ''
				this.isShowTooltip = false
			},
			//是否为url
			isUrl(msg) {
				return uni.$u.test.url(msg) ? true : false
			},
			//输入框行数变化
			linechange(e) {
				// console.log(e)
				this.getDynamicBoxHeight()
			},
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
			//输入栏加号‘+’点击
			moreClick() {
				this.isShowToolsBox = !this.isShowToolsBox
				if (this.isShowToolsBox == true) {
					this.$nextTick(function() {
						this.isShowGrid = true
						this.isShowPhiz = false
					})
				} else {}
				this.getDynamicBoxHeight()
			},
			//获取dynamicbox高度并保存
			getDynamicBoxHeight() {
				this.$nextTick(function() {
					const query = uni.createSelectorQuery().in(this);
					query.select('#dynamicbox').boundingClientRect(data => {
						this.dynamicBoxHeight = data.height
					}).exec();
				})
			},
			//获取messageBox高度并保存
			getMessageBoxHeight() {
				this.$nextTick(function() {
					const query = uni.createSelectorQuery().in(this);
					query.select('#messageBox').boundingClientRect(data => {
						this.messageBoxHeight = data.height - 44
					}).exec();
				})
			},
			//滚动到页面底部
			pageScrollToBottom(delay, top = 99999999999) {
				this.$nextTick(function() {
					uni.pageScrollTo({
						scrollTop: top,
						duration: delay //滚动延时
					});
				})
			},
			closeToolsBox() {
				if (this.isShowToolsBox) {
					this.isShowToolsBox = false
					this.getDynamicBoxHeight()
				}
			},
			//本地消息列添加消息
			addMsg(message, types, uuid, fromId) {
				let data = {
					fromId: fromId == this.fid ? this.fid : this.uid,
					imgUrl: fromId == this.fid ? this.fimgUrl : this.imgUrl.replace(/(.*\/)*([^.]+).*/ig, "$2") + '.' +
						this.imgUrl.replace(/.+\./,
							""), //获取文件名和后缀( 如xxx.png )  
					message: message,
					types: types,
					time: new Date().getTime(),
					uuid: uuid,
				}
				this.sortMsgs.push(data)
				fromId == this.fid ? null : this.message = '' //对方发来的输入框消息不清空
				this.dynamicBoxHeight = 52
				this.pageScrollToBottom(200)
			},
			//本地消息列添加消息 和 通过socket发送到服务器
			async send(message, types) {
				this.isClickSend = true
				let uuid = myfun.getUuid()
				//socket提交
				if (types == 0) { //文字
					this.addMsg(message, types, uuid)
					const msgObj = [{
						message: message,
						types: types,
						uuid: uuid
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
						this.addMsg(imgUrl, types, uuid)
						this.preImgs.push(`${this.baseUrl}/chat/${imgUrl}`)
						const msgObj = [{
							message: imgUrl,
							types: types,
							uuid: uuid
						}]
						this.socket.emit('msg', msgObj, this.uid, this.fid)
						this.isImgSendSuccess = true
					}
				}
				if (types == 3) { //定位
					this.addMsg(JSON.stringify(message), types, uuid)
					const msgObj = [{
						message: JSON.stringify(message),
						types: types,
						uuid: uuid
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
						// console.log(message)
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
				let longitude = ''
				let latitude = ''
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					accuracy: 'best',
					geocode: true,
					timeout: '10',
					success: function(res) {
						// console.log('当前位置的经度：' + res.longitude);
						// console.log('当前位置的纬度：' + res.latitude);
						longitude = res.longitude
						latitude = res.latitude
						// var result = gcoord.transform([res.latitude, res.longitude], // 经纬度坐标
						// 	gcoord.WGS84, // 当前坐标系
						// 	gcoord.GCJ02 // 目标坐标系
						// )
						// console.log(result)
					}
				});
				uni.chooseLocation({
					longitude: longitude,
					latitude: latitude,
					success: (res) => {
						const data = {
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
						// console.log('接收到了消息,' + msgObj + fromId)
						if (msgObj[0].types == 0) { //文字
							this.addMsg(msgObj[0].message, msgObj[0].types, msgObj[0].uuid, fromId)
						}
						if (msgObj[0].types == 1) { //图片
							this.addMsg(msgObj[0].message, msgObj[0].types, msgObj[0].uuid, fromId)
							this.preImgs.push(`${this.baseUrl}/chat/${msgObj[0].message}`)
						}
						if (msgObj[0].types == 3) { //定位
							this.addMsg(msgObj[0].message, msgObj[0].types, msgObj[0].uuid, fromId)
						}
					}
				})
			},
			//监听对方撤回消息
			listenDelMsg() {
				this.socket.on('delmsg', (msgId) => {
					//撤回前端视觉上的消息
					this.sortMsgs.map((e, i) => {
						if (e.uuid == msgId) {
							this.sortMsgs.splice(i, 1, {
								types: -1,
								isOwnDel: false
							})
						}
					})
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

	.bg {
		top: 44px;
		height: calc(100vh - 44px - 52px);
		position: absolute;
		width: 100%;
		position: fixed;
		z-index: -1;
		background-size: cover;
		background-position: center;
	}

	.message-box {
		// position: relative;
		padding-bottom: 52px;
		// min-height: calc(100vh - 52px - 44px);
		background-size: cover;
		// margin-top: 40px;

		.time {
			text-align: center;
			padding: 10px 0;
			font-size: 14px;
			color: gray;
		}

		.withdraw {
			text-align: center;
			font-size: 12px;
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
				background-color: rgb(255, 255, 255);
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
				position: relative;

				.overlay {
					width: calc(100% - 16px);
					height: calc(100% - 20px);
					background-color: #d9d9d9;
					border-radius: 10px;
					opacity: 0.7;
					position: absolute;
					z-index: 90;

					.loading-icon {
						position: absolute;
						z-index: 99;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
					}
				}
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
			max-width: 100px;
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

	.tooltip {
		position: absolute;
		height: 30px;
		background-color: white;
		z-index: 999;
		display: flex;
		align-items: center;
		border-radius: 4px;
		border: 1px solid #cecece;
		font-size: 13px;

		.tool-item {
			padding: 10px;
		}
	}
</style>
