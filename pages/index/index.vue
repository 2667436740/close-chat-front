<template>
	<view class="content">
		<u-navbar title="Colse Chat" :safeAreaInsetTop="true" fixed :placeholder="true">
			<view slot="left">
				<u-avatar :src="imgUrl" size="30" @click="infoPageJunp"></u-avatar>
			</view>
			<view slot="right" class="icons">
				<u-icon name="search" size="20" class="icon-1" @click="searchPageJump"></u-icon>
				<u-icon name="list" size="20"></u-icon>
			</view>
		</u-navbar>

		<u-list>
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
						<u--text :lines="1" text="[音频]" color="#666666" size="14" v-if="item.types == 2"></u--text>
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
	} from '../../config/api.js'

	export default {
		components: {},
		data() {
			return {
				title: 'Hello',
				uid: '',
				imgUrl: '',
				token: '',
				indexList: []
			}
		},
		mixins: [getUserStorage],
		onLoad() {
			this.getFriend()
			this.join()
			this.socketTest()
		},
		methods: {
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
			infoPageJunp() {
				uni.navigateTo({
					url: '../information/information'
				})
			},
			//聊天页跳转
			chatPageJump(item) {
				uni.navigateTo({
					url: `../chat/chat?id=${item.id}&imgUrl=${item.imgUrl}&username=${item.username}`
				})
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

		.name {
			font-size: 18px;
			font-weight: 500;
		}

		.time {
			font-size: 12px;
			padding-top: 5px;
			color: #666666;
		}
	}

	.empty {
		padding-top: 200rpx;
	}
</style>
