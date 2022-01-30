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
				<view class="item-style" @click="chatPageJump">
					<u-avatar shape="square" size="40" :src="`${BASE_URL}/avatar/${item.imgUrl}`"
						customStyle="margin: 0 10px 0 0"></u-avatar>
					<view class="item-text">
						<view class="item-title">
							<view class="name">
								{{item.username}}
							</view>
							<view class="time">
								{{changeTime(item.lastTime)}}
							</view>
						</view>
						<u--text :lines="1" :text="item.message"></u--text>
					</view>
				</view>
			</u-list-item>
		</u-list>
	</view>
</template>

<script>
	import myfun from '../../commons/util/myfun.js'
	import getUserStorage from '../../mixin/getUserStorage.js'
	import {
		postGetFriend,
		postGetLastMsg
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
		onShow() {
			this.getFriend()
		},
		methods: {
			changeTime(date) {
				return myfun.weChatTimeFormat(date)
			},
			searchPageJump() {
				uni.navigateTo({
					url: '../search/search'
				})
			},
			infoPageJunp() {
				uni.navigateTo({
					url: '../information/information'
				})
			},
			chatPageJump() {
				uni.navigateTo({
					url: '../chat/chat'
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
					this.getIndexLastMsg(indexList)
					indexList.sort((a, b) => {
						return b.lastTime - a.lastTime
					})
					this.indexList = indexList
					console.log(this.indexList)
				}
			},
			//获取最后一条消息
			async getIndexLastMsg(indexList) {
				for (let item of indexList) {
					const params = {
						uid: this.uid,
						fid: item.id,
						token: this.token
					}
					const resMsg = await postGetLastMsg(params)
					if (resMsg.data.status == 200) {
						item.message = resMsg.data.result.message,
						item.types = resMsg.data.result.types
					}
				}
			},
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
			font-size: 14px;
		}
	}
</style>
