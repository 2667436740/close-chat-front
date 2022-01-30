<template>
	<view>
		<view class="head-box">
			<view class="info-box">
				<view class="name">
					{{username}}
				</view>
				<u-avatar :src="imgUrl" size="90"></u-avatar>
			</view>
			<view class="intro">
				<u--text :lines="3"
					:text="showExplain">
				</u--text>
			</view>
		</view>
		<view class="cells-box">
			<view class="cell">
				<navigator url="../information/information">
					<u-cell title="个人信息" icon="file-text" :isLink="true" :border="false"></u-cell>
				</navigator>
			</view>
			<view class="cell">
				<u-cell title="收藏" icon="bookmark" :isLink="true" :border="false" @click="favClick"></u-cell>
			</view>
			<view class="cell">
				<u-cell title="设置" icon="setting" :isLink="true" :border="false" @click="setClick"></u-cell>
			</view>
		</view>
		<button type="default" class="quitbtn" @click="showQuitPopup">退出</button>

		<u-popup :show="isShowQuit" mode="bottom">
			<view>
				<button type="default" @click="quitAcoount">退出登录</button>
				<u-gap height="10"></u-gap>
				<button type="default" @click="cancelQuit">取消</button>
			</view>
		</u-popup>
		
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import getUserStorage from '../../mixin/getUserStorage.js'
	import {postUserDetail} from '../../config/api.js'
	
	export default {
		data() {
			return {
				isShowQuit: false,
				uid: "",
				imgUrl: "",
				token: "",
				explain: "",
			};
		},
		mixins: [getUserStorage],
		onShow() {
			this.getInformation()
		},
		computed: {
			showExplain() {
				return this.explain == '' ? '快去添加一条个签吧~': this.explain
			}
		},
		methods: {
			//获取用户详情
			async getInformation() {
				const params = {
					id: this.uid,
					token: this.token
				}
				const res = await postUserDetail(params)
				if (res.data.status == 200) {
					const result = res.data.result
					this.explain = result.explain ? result.explain : ''
				} else {
					this.$refs.uToast.show({
						type: 'error',
						message: "获取用户信息失败"
					})
				}
			},
			showQuitPopup() {
				this.isShowQuit = true
			},
			quitAcoount() {
				uni.redirectTo({
					url: '../login/login'
				})
				uni.clearStorage()
			},
			cancelQuit() {
				this.isShowQuit = false
			},
			favClick() {
				this.$refs.uToast.show({
					message: "功能开发中~"
				})
			},
			setClick() {
				this.$refs.uToast.show({
					message: "功能开发中~"
				})
			},
			//查看大图头像
			// imgListPreview() {
			// 	// var urlList = []
			// 	// urlList.push(this.userInfo.avatar) //push中的参数为 :src="item.img_url" 中的图片地址
			// 	uni.previewImage({
			// 		indicator: "number",
			// 		loop: true,
			// 		urls: ['https://cdn.uviewui.com/uview/album/2.jpg']
			// 	})
			// },
		}
	}
</script>

<style lang="scss">
	.head-box {
		font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
		border-bottom: 1px solid $uni-color-border;
	}

	.info-box {
		display: flex;
		justify-content: space-between;
		padding: 30px 40px;

		.name {
			font-size: 30px;
			font-weight: 600;
		}
	}

	.intro {
		margin: 5px 40px 20px;
		height: 60px;
	}

	.cells-box {
		font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;

		.cell {
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid $uni-color-border;
			padding: 0 30px;
		}
	}

	.quitbtn {
		margin-top: 20px;
	}
</style>
