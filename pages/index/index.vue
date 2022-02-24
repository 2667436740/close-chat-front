<template>
	<view class="content">
		<u-navbar title="Colse Chat" :safeAreaInsetTop="true" fixed :placeholder="true">
			<view slot="left">
				<u-avatar :src="imgUrl" size="30" @click="infoPageJunp(uid)"></u-avatar>
			</view>
			<view slot="right" class="icons">
				<u-icon name="search" size="20" class="icon-1" @click="searchPageJump"></u-icon>
				<u-icon name="list" size="20"></u-icon>
			</view>
		</u-navbar>

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
				<view class="item-style" @click="chatPageJump(item)">
					<view class="avatar">
						<u-avatar shape="square" size="40" :src="`${BASE_URL}/avatar/${item.imgUrl}`"
							customStyle="margin: 0 10px 0 0"></u-avatar>
						<u-badge type="error" max="99" :value="item.unReadNum" class="badge"></u-badge>
					</view>
					<view class="item-text">
						<view class="item-title">
							<view class="name">
								{{item.username}}
							</view>
							<view class="time">
								{{changeTime(item.lastTime)}}
							</view>
						</view>
						<u--text :lines="1" :text="item.message" color="#666666" size="14" v-if="item.types == 0">
						</u--text>
						<u--text :lines="1" text="[图片]" color="#666666" size="14" v-if="item.types == 1"></u--text>
						<u--text :lines="1" text="[语音]" color="#666666" size="14" v-if="item.types == 2"></u--text>
						<u--text :lines="1" text="[位置]" color="#666666" size="14" v-if="item.types == 3"></u--text>
					</view>
				</view>
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
				newRequestNum: 0
			}
		},
		mixins: [getUserStorage],
		onLoad() {
			this.getFriend()
			this.getAddRequestList()
			this.clearUnreadMsg()
			this.delFriend()
			this.join()
			this.socketTest()
			this.listenMsg()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getFriend()
			this.getAddRequestList()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
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
			},
			//删除好友操作返回主页时，前端删除对应好友
			delFriend() {
				uni.$on('delId',delId => {
					if (delId) {
						this.indexList.map((e,i) => {
							if (e.id == delId) {
								this.indexList.splice(i,1)
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
			//聊天页跳转
			async chatPageJump(item) {
				uni.navigateTo({
					url: `../chat/chat?id=${item.id}&imgUrl=${item.imgUrl}&username=${item.username}`
				})
				const params = {
					uid: this.uid,
					fid: item.id,
					token: this.token
				}
				const res = await postClearUnreadMsg(params)
				if (res.data.status == 200) {
					item.unReadNum = 0
				}
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
				}
			},
			//用户登录socket注册
			join() {
				this.socket.emit('login', this.uid)
			},
			//服务器消息接收
			socketTest() {
				this.socket.on('login', id => {
					console.log('接收到了消息,' + id)
				})
			},
			//监听接收socket传来的消息
			listenMsg() {
				this.socket.on('msg', (msgObj, fromId) => {
					this.indexList.map((e, i) => {
						//前端更新 对方发来的消息
						if (e.id == fromId) {
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
			}
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

		.icon-1 {
			padding-right: 10px;
		}
	}

	.item-style {
		height: 50px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 5px 15px;
		border-bottom: 1px $uni-color-border solid;

		.avatar {
			position: relative;

			.badge {
				position: absolute;
				top: 0;
				right: 0;
				transform: translateY(-40%);
			}
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
