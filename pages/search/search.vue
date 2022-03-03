<template>
	<view class="search">
		<!-- <u-navbar :safeAreaInsetTop="true" fixed :placeholder="true">
			<view slot="left"/>
			<view slot="right" class="right-bar">
				<u-search :show-action="true" shape="square" actionText="取消" @custom="backPageJump"
					placeholder="请输入要搜索的用户名或邮箱" @change="$u.debounce(compareName, 500)" v-model="searchWord" class="search">
				</u-search>
			</view>
		</u-navbar> -->
		<u-navbar :safeAreaInsetTop="true" fixed :placeholder="true" title="搜索">
			<view slot="left"/>
		</u-navbar>
		<view class="serach-bar">
			<u-search :show-action="true" shape="square" actionText="取消" @custom="backPageJump"
				placeholder="请输入要搜索的用户名或邮箱" @change="$u.debounce(compareName, 500)" v-model="searchWord">
			</u-search>
		</view>
		<view class="search-list">
			<u-list>
				<u-list-item v-for="(item, index) in showUserArr" :key="item._id">
					<u-cell>
						<u-avatar slot="icon" shape="square" size="40" :src="`${baseUrl}/avatar/${item.imgUrl}`"
							customStyle="margin: -3px 5px -3px 0"></u-avatar>
						<view class="title" slot="title">
							<view class="item-title" v-html="searchKeyword(item.username,searchWord)"></view>
							<view class="" v-html="searchKeyword(item.email,searchWord)"></view>
						</view>
						<button slot="value" size="mini" :class="[{'dark': item.isFriend == true}]"
							@click="userAddPageJump(item)">{{isF(item)}}</button>
					</u-cell>
				</u-list-item>
			</u-list>
		</view>

		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		postSearchUser,
		postIsFriend
	} from '../../config/api.js'
	import getUserStorage from '../../mixin/getUserStorage.js'

	export default {
		data() {
			return {
				userArr: [],
				searchWord: '',
				showUserArr: [],
			};
		},
		mixins: [getUserStorage],
		methods: {
			backPageJump() {
				uni.navigateBack()
			},
			isF(item) {
				return item.isFriend == true ? '发消息' : '加好友'
			},
			// dynamicColor(item) {
			// 	return item.isFriend == true ? 'dark' : 'light'
			// },
			//关键字高亮
			searchKeyword(val, keyword) {
				val = val + '';
				if (val.indexOf(keyword) !== -1 && keyword !== '') {
					return val.replace(keyword, `<span style="color:red;">${keyword}</span>`);
				} else {
					return val;
				}
			},
			//动态搜索
			async compareName() {
				this.userArr = []
				this.showUserArr = []
				const params = {
					data: this.searchWord,
					token: this.token
				}
				const res = await postSearchUser(params)
				if (res.data.status == 200) {
					const arr = res.data.result
					//搜索列表过滤用户自己
					this.userArr = arr.filter(item => {
						return item._id != this.uid
					})
					//判断每个用户是不是好友
					for (let item of this.userArr) {
						const resIsFriend = await postIsFriend({
							uid: this.uid,
							fid: item._id,
							token: this.token
						})
						item.isFriend = resIsFriend.data.status == 200 ? true : false
					}
					this.showUserArr = this.userArr
					console.log(this.showUserArr)
				}
			},
			//添加好友
			userAddPageJump(item) {
				if (item.isFriend === true) {
					//跳转发消息界面
					uni.navigateTo({
						url: `../chat/chat?id=${item._id}&imgUrl=${item.imgUrl}&username=${item.username}`
					})
				} else {
					uni.navigateTo({
						url: '../userAdd/userAdd?fid=' + item._id
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.search {
		font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
	}

	// .u-navbar__content__right {
	// 	width: 90%;
	// }

	// .right-bar {
	// 	width: 100%;
	// }
	
	// .search {
	// 	width: 100%;
	// }

	.serach-bar {
		height: 44px;
		padding: 0 10px;
		border-bottom: 1px solid $uni-color-border;
		position: fixed;
		z-index: 99;
		width: 95%;
		background-color: white;
	}

	.search-list {
		padding-top: 55px;

		.title {

			.item-title {
				font-size: 20px;
				font-weight: 600;
			}
		}
	}

	.dark {
		background-color: $uni-bg-color-btn;
	}

	.light {
		background-color: $uni-bg-color;
	}
</style>
