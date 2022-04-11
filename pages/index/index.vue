<template>
	<view class="content">
		<u-navbar title="Colse Chat" :safeAreaInsetTop="true" fixed :placeholder="true">
			<view slot="left">
				<u-avatar :src="imgUrl" size="30" @click="infoPageJunp(uid)"></u-avatar>
			</view>
			<view slot="right" class="icons">
				<u-icon name="search" size="20" class="icon-1" @click="searchPageJump"></u-icon>
				<u-icon name="list" size="20" @click="showMoreCard"></u-icon>
				<view class="more-card" v-if="isShowMordCard">
					<view class="card-item" @click="clearAllUnreadNum">
						一键已读
					</view>
				</view>
			</view>
		</u-navbar>
			<u-notice-bar :text="noticeMsg" mode="closable"></u-notice-bar>

		<u-list>
			<navigator url="../addrequest/addrequest">
				<u-list-item v-if="newRequestNum != 0">
					<view class="item-style">
						<view class="avatar">
							<u-avatar shape="square" size="40" src="../../static/img/people.png"
								customStyle="margin: 0 10px 0 0"></u-avatar>
						</view>
						<view class="item-text">
							<view class="item-title">
								<view class="name">
									您有新的朋友
								</view>
								<view class="new-badge">
									<u-badge type="error" max="99" :value="newRequestNum" shape="circle"></u-badge>
								</view>
							</view>
						</view>
					</view>
				</u-list-item>
			</navigator>

			<u-list-item v-for="(item, index) in indexList" :key="item.id">
				<!-- <u-swipe-action>
				        <u-swipe-action-item
				          :options="options1"
									v-for="(item, index) in indexList" :key="item.id"
				        > -->
				<view class="item-style" @click="chatPageJump(item)">
					<view class="avatar">
						<u-avatar shape="square" size="40" :src="`${baseUrl}/avatar/${item.imgUrl}`"
							customStyle="margin: 0 10px 0 0"></u-avatar>
						<view class="offline" v-if="!item.isOnline" />
						<view class="badge">
							<u-badge type="error" max="99" :value="item.unReadNum"></u-badge>
						</view>
					</view>
					<view class="item-text">
						<view class="item-title">
							<view class="name">
								<span v-if="item.isOnline">[在线] </span>
								{{item.username}}
							</view>
							<view class="time">
								{{changeTime(item.lastTime)}}
							</view>
						</view>
						<u--text :lines="1" :text="removeBr(item.message)" color="#666666" size="14"
							v-if="item.types == 0">
						</u--text>
						<u--text :lines="1" text="[图片]" color="#666666" size="14" v-if="item.types == 1"></u--text>
						<u--text :lines="1" text="[语音]" color="#666666" size="14" v-if="item.types == 2"></u--text>
						<u--text :lines="1" text="[位置]" color="#666666" size="14" v-if="item.types == 3"></u--text>
					</view>
				</view>
								<!-- </u-swipe-action-item>
				</u-swipe-action> -->
			</u-list-item>

			<view class="empty">
				<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/history.png" v-if="indexList.length == 0"
					text="暂无好友,快去添加吧~">
				</u-empty>
			</view>
		</u-list>
	</view>
</template>

<script>
	import myfun from '../../commons/util/myfun.js'
	import getUserStorage from '../../mixin/getUserStorage.js'
	import {
		postGetFriend,
		postGetLastMsg,
		postGetUnreadMsg,
		postClearUnreadMsg,
	} from '../../config/api.js'

	export default {
		components: {},
		data() {
			return {
				title: 'Hello',
				uid: '',
				imgUrl: '',
				token: '',
				indexList: [],
				newRequestNum: 0,
				noticeMsg: '本项目试测验中 ~ 绿色上网 ~ 文明交流 ~',
				appBadgeNum: 0, //手机应用角标数
				isShowMordCard: false,
				options1: [{
				   text: '删除'
				}]
			}
		},
		mixins: [getUserStorage],
		onLoad() {
			this.listenMsg()
			this.listenDraft()
			this.listenOnline()
			this.getFriend()
			this.getAddRequestList()
			this.clearUnreadMsg()
			this.delFriend()
			// this.listenReNew()
		},
		onShow() {
			this.socket.emit('login', this.uid)
			const value = uni.getStorageSync('hideApp')
			if (value == 1) {
				this.getFriend()
				this.getAddRequestList()
			}
			uni.removeStorageSync('hideApp')
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getFriend()
			this.getAddRequestList()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		watch: {
			appBadgeNum: {
				handler(newName, oldName) {
					// #ifdef APP-PLUS
					plus.runtime.setBadgeNumber(newName)
					// #endif
				},
				immediate: true
			}
		},
		methods: {
			//右上角更多按钮点击
			showMoreCard() {
				this.isShowMordCard = !this.isShowMordCard
			},
			//清除所有未读数
			async clearAllUnreadNum() {
				this.indexList.map(async e => {
					if (e.unReadNum != 0) {
						const params = {
							uid: e.id,
							fid: this.uid,
							token: this.token
						}
						const res = await postClearUnreadMsg(params)
					}
					e.unReadNum = 0
				})
				this.appBadgeNum = 0
				this.isShowMordCard = false
			},
			//去掉msg里的 \n ,即浏览器里的 <br>
			removeBr(msg) {
				return msg.replace(/\n/g, " ")
			},
			//重新统计未读数
			countNums() {
				this.appBadgeNum = 0
				this.indexList.map(e => {
					this.appBadgeNum += e.unReadNum
				})
			},
			//聊天页返回时，清空对应好友未读数
			clearUnreadMsg() {
				uni.$on('clearUnreadNum', data => {
					if (data.clearId) {
						this.indexList.map(e => {
							if (e.id == data.clearId) {
								e.unReadNum = 0
							}
						})
					}
				})
				this.countNums()
			},
			//删除好友操作返回主页时，前端删除对应好友
			delFriend() {
				uni.$on('delId', delId => {
					if (delId) {
						this.indexList.map((e, i) => {
							if (e.id == delId) {
								this.indexList.splice(i, 1)
							}
						})
					}
				})
			},
			//获取新的收到请求列表
			async getAddRequestList() {
				const params = {
					uid: this.uid,
					state: 1,
					token: this.token
				}
				const res = await postGetFriend(params)
				if (res.data.status == 200) {
					this.newRequestNum = res.data.result.length
				}
			},
			//格式化时间显示
			changeTime(date) {
				return myfun.weChatTimeFormat(date)
			},
			//搜索页跳转
			searchPageJump() {
				uni.navigateTo({
					url: '../search/search'
				})
			},
			//个人信息页跳转
			infoPageJunp(id) {
				uni.navigateTo({
					url: '../information/information?id=' + id
				})
			},
			//跳转到聊天页
			async chatPageJump(item) {
				uni.navigateTo({
					url: `../chat/chat?id=${item.id}&imgUrl=${item.imgUrl}&username=${item.username}`
				})
				const params = {
					uid: item.id,
					fid: this.uid,
					token: this.token
				}
				const res = await postClearUnreadMsg(params)
				if (res.data.status == 200) {
					item.unReadNum = 0
				}
				this.countNums()
			},
			//获取首页好友列
			async getFriend() {
				const params = {
					uid: this.uid,
					state: 0,
					token: this.token
				}
				const res = await postGetFriend(params)
				if (res.data.status == 200) {
					let indexList = res.data.result
					//获取每个好友的最后一条消息和消息未读数
					for (let item of indexList) {
						item.isOnline = false
						const params = {
							uid: this.uid,
							fid: item.id,
							token: this.token
						}
						const resMsg = await postGetLastMsg(params)
						if (resMsg.data.status == 200) {
							item.message = resMsg.data.result.message
							item.types = resMsg.data.result.types
						}
						const resNum = await postGetUnreadMsg(params)
						if (resNum.data.status == 200) {
							item.unReadNum = resNum.data.result
						}
					}
					//按聊天时间排序
					indexList.sort((a, b) => {
						return b.lastTime - a.lastTime
					})
					this.indexList = indexList
					this.countNums()
					this.socket.emit('getOnline', this.uid)
				}
			},
			//监听接收socket传来的消息
			listenMsg() {
				this.socket.on('msg', (msgObj, fromId, tip) => {
					this.indexList.map((e, i) => {
						//前端更新 对方发来的消息
						if (e.id == fromId && tip == 0) {
							// uni.vibrateLong()
							switch (msgObj[0].types) {
								case 0: //文字
									e.message = msgObj[0].message
									break;
								case 1: //图片
									e.message = '[图片]'
									break;
								case 2: //音频
									e.message = '[语音]'
									break;
								case 3: //定位
									e.message = '[位置]'
									break;
							}
							e.unReadNum++
							e.lastTime = new Date().getTime()
							this.indexList.splice(i, 1)
							this.indexList.unshift(e)
							this.countNums()
						}
						//前端更新 自己主页的消息
						if (this.uid == fromId) {
							switch (msgObj[0].types) {
								case 0: //文字
									e.message = msgObj[0].message
									break;
								case 1: //图片
									e.message = '[图片]'
									break;
								case 2: //音频
									e.message = '[语音]'
									break;
								case 3: //定位
									e.message = '[位置]'
									break;
							}
							e.lastTime = new Date().getTime()
							this.indexList.splice(i, 1)
							this.indexList.unshift(e)
						}
					})
				})
				this.socket.on('newFriend', (toId) => {
					if (this.uid == toId) {
						this.newRequestNum++
					}
				})
				this.socket.on('agree', (toId) => {
					if (this.uid == toId) {
						this.getFriend()
						this.getAddRequestList()
					}
				})
			},
			//监听聊天页返回是否有草稿
			async listenDraft() {
				uni.$on('draft', async data => {
					if (data.draftType == 1) { //有草稿
						this.indexList.map(e => {
							if (e.id == data.draftId) {
								e.message = '[草稿]  ' + data.message
							}
						})
					}
					if (data.draftType == 0) { //无草稿
						if(this.uid && this.token) {
							const params = {
								uid: this.uid,
								fid: data.draftId,
								token: this.token
							}
							const resMsg = await postGetLastMsg(params)
							if (resMsg.data.status == 200) {
								this.indexList.map((e, i) => {
									if (e.id == data.draftId) {
										const result = resMsg.data.result
										//新获取的最后一条消息 和 之前 不一致，更新
										if (e.message != result.message) {
											e.message = result.message
											e.types = result.types
											e.lastTime = new Date(result.time).valueOf()
											this.indexList.splice(i, 1)
											this.indexList.unshift(e)
										}
									}
								})
							}
						}
					}
				})
			},
			//监听在线用户改变并更改
			listenOnline() {
				this.socket.on('onlineUsers', data => {
					// console.log('onlineUsers', data)
					let onlineUsers = JSON.parse(data)
					this.indexList = this.indexList.map((e, j) => {
						e.isOnline = false
						return e
					})
					onlineUsers.map((item, i) => {
						this.indexList = this.indexList.map((e, j) => {
							if (e.id == item.id) {
								e.isOnline = true
							}
							return e
						})
					})
				})
			},
			// //监听页面回来
			// listenReNew() {
			// 	uni.$on('reNew',()=>{

			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
	}

	.icons {
		display: flex;
		flex-direction: row;
		// position: relative;

		.icon-1 {
			padding-right: 10px;
		}

		.more-card {
			position: absolute;
			width: 100px;
			background-color: pink;
			right: 10px;
			top: 44px;
			border-radius: 10px;
			padding: 5px;
			box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
			background: #fff;

			.card-item {
				padding: 5px;
				text-align: center;
			}
		}
	}

	.item-style {
		height: 50px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 5px 15px;
		border-bottom: 1px $uni-color-border solid;
		position: relative;

		.avatar {
			position: relative;

			.badge {
				position: absolute;
				top: 0;
				right: 0;
				transform: translateY(-40%);
			}
		}

		.offline {
			width: 40px;
			height: 40px;
			border-radius: 4px;
			position: absolute;
			background: gray;
			opacity: 0.5;
			top: 0;
			z-index: 99;
		}
	}

	.item-text {
		flex: 1;
		width: 80%;
		overflow: hidden;
	}

	.item-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		.new-badge {
			width: 17px;
			height: 17px;
		}

		.name {
			font-size: 18px;
			font-weight: 500;
			display: flex;
			align-items: center;

			span {
				font-size: 14px;
				color: red;
			}
		}

		.time {
			font-size: 12px;
			// padding-bottom: 5px;
			color: #666666;
		}
	}

	.empty {
		padding-top: 200rpx;
	}
</style>
