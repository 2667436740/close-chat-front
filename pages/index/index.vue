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
			<u-list-item v-for="(item, index) in indexList" :key="index">
				<view class="item-style" @click="chatPageJump">
					<u-avatar shape="square" size="40" :src="item.avatar" customStyle="margin: 0 10px 0 0"></u-avatar>
					<view class="item-text">
						<view class="item-title">
							<view class="name">
								{{item.name}}
							</view>
							<view class="time">
								{{changeTime(item.time)}}
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
	import {postGetFriend} from '../../config/api.js'
	
	export default {
		components: {},
		data() {
			return {
				title: 'Hello',
				uid: '',
				imgUrl: '',
				token: '',
				// indexList,
				indexList: [{
					name: 'John',
					avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
					message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					time: 1637325896631
				}, {
					name: 'Sindy',
					avatar: 'https://cdn.uviewui.com/uview/album/2.jpg',
					message: 'bbbbbbbb',
					time: 1637125850000
				}, {
					name: 'John',
					avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
					message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					time: 1637425896631
				}, {
					name: 'Sindy',
					avatar: 'https://cdn.uviewui.com/uview/album/2.jpg',
					message: 'bbbbbbbb',
					time: 1637125850000
				}, {
					name: 'John',
					avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
					message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					time: 1637225896631
				}, {
					name: 'Sindy',
					avatar: 'https://cdn.uviewui.com/uview/album/2.jpg',
					message: 'bbbbbbbb',
					time: 1637125850000
				}, {
					name: 'John',
					avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
					message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					time: 1637225896631
				}, {
					name: 'Sindy',
					avatar: 'https://cdn.uviewui.com/uview/album/2.jpg',
					message: 'bbbbbbbb',
					time: 1637125850000
				}, {
					name: 'John',
					avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
					message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					time: 1637225896631
				}, {
					name: 'Sindy',
					avatar: 'https://cdn.uviewui.com/uview/album/2.jpg',
					message: 'bbbbbbbb',
					time: 1637125850000
				}, {
					name: 'John',
					avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
					message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					time: 1637225896631
				}, {
					name: 'Sindy',
					avatar: 'https://cdn.uviewui.com/uview/album/2.jpg',
					message: 'bbbbbbbb',
					time: 1637125850000
				}]
			}
		},
		mixins: [getUserStorage],
		onLoad() {
			this.getFriend()
		},
		methods: {
			changeTime(date) {
				// return myfun.dateTime(date)
				// return this.Utils.formatDate('YY/MM/dd hh/mm/ss',date)
				// return myfun.formartTime(date, 1)
				// return myfun.getTime(date.toString())
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
			async getFriend() {
				const params = {
					uid: this.uid,
					state: 1,
					token: this.token
				}
				const res = await postGetFriend(params)
				console.log(res)
				if(res.status == 200) {
					this.indexList = res.data.result
					console.log(this.indexList)
				}
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
