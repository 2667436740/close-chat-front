<template>
	<view class="user-add">
		<view class="avatar-box">
			<image :src="`${BASE_URL}/avatar/${userInfo.imgUrl}`" mode="" class="avatar"></image>
		</view>
		<view class="info-box">
			<view class="info">
				<view class="name">
					{{userInfo.username}}
				</view>
				<view class="intro">
					<u--text :lines="4"
						:text="userInfo.explain">
					</u--text>
				</view>
				<button class="btn-cancel" @click="cancel">返回</button>
				<u-button type="success" @click="()=>{isShowApplyBox = true}">添加</u-button>
			</view>
		</view>
		

		<u-modal :show="isShowApplyBox" :showCancelButton="true" confirmText="发送申请" @confirm="addUser"
			@cancel="()=> {isShowApplyBox = false}" confirmColor="#23c248">
			<view class="slot-content">
				<u--textarea v-model="msg" placeholder="请输入申请消息" style="width: 500rpx"></u--textarea>
			</view>
		</u-modal>

		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		postUserDetail,
		postApplyFriend
	} from '../../config/api.js'
	import getUserStorage from '../../mixin/getUserStorage.js'

	export default {
		data() {
			return {
				userInfo: {},
				fid: '',
				isShowApplyBox: false,
				msg: `加好友~~`,
			};
		},
		mixins: [getUserStorage],
		onLoad(option) {
			this.getFriendDetail(option.fid)
			this.fid = option.fid
		},
		methods: {
			cancel() {
				uni.navigateBack()
			},
			async addUser() {
				const params = {
					uid: this.uid,
					fid: this.fid,
					msg: this.msg,
					token: this.token
				}
				const res = await postApplyFriend(params)
				console.log(res)
				if (res.data.status == 200) {
					this.$refs.uToast.show({
						type: 'success',
						message: "好友申请已发送!"
					})
				} else if (res.data.status == 300) {
					this.$refs.uToast.show({
						type: 'error',
						message: "登录状态失效!"
					})
					setTimeout(() => {
						uni.redirectTo({
							url: '../login/login'
						})
					}, 2000)
				} else if (res.data.status == 500) {
					this.$refs.uToast.show({
						type: 'error',
						message: "服务器出错啦!"
					})
				}
				this.isShowApplyBox = false
			},
			async getFriendDetail(fid) {
				const res = await postUserDetail({
					id: fid,
					token: this.token
				})
				if(res.data.status == 200) {
					this.userInfo = res.data.result
					console.log(this.userInfo)
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.user-add {
		height: 100vh;
		background-color: #c0eeb0;
	}

	.avatar-box {
		height: 500rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.avatar {
			width: 160px;
			height: 160px;
			justify-content: center;
			align-items: center;
			border-radius: 20px;
			box-shadow: 0px 0px 20px 10px white;
		}
	}

	.info-box {
		border-radius: 26px 26px 0 0;
		background-color: white;
		height: calc(100vh - 500rpx);

		.info {
			margin: auto;
			width: 80%;
			font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;

			.name {
				margin: auto;
				font-size: 30px;
				padding: 15px;
				text-align: center;
				font-weight: 600;
			}

			.intro {
				padding: 8px;
				margin-bottom: 20px;
				border-radius: 10px;
				background-color: #eee;
			}
		}
	}



	.btn-cancel {
		margin-bottom: 10px;
	}
</style>
