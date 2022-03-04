<template>
	<view class="user-add">
		<view class="avatar-box">
			<image :src="`${baseUrl}/avatar/${userInfo.imgUrl}`" mode="" class="avatar"></image>
		</view>
		<view class="name">
			{{userInfo.username}}
		</view>
		<view class="email">
			{{userInfo.email}}
		</view>
		<view class="info-box">
			<view class="info">
				<view class="intro">
					{{showExplain}}
				</view>
				<u-button type="default" class="btn-cancel" style="border: 1px solid #bababa;" @click="cancel">返回
				</u-button>
				<u-button type="success" @click="()=>{isShowApplyBox = true}">添加</u-button>
			</view>
		</view>


		<u-modal :show="isShowApplyBox" :showCancelButton="true" confirmText="发送申请" @confirm="addUser"
			@cancel="()=> {isShowApplyBox = false}" confirmColor="#23c248">
			<u--textarea v-model="msg" placeholder="请输入申请消息" style="width: 500rpx" :focus="true" :cursor="msg.length"></u--textarea>
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
				msg: '',
			};
		},
		mixins: [getUserStorage],
		onLoad(option) {
			this.fid = option.fid
			this.msg = `你好，我是${this.username}`
		},
		onShow() {
			this.getFriendDetail()
		},
		computed: {
			showExplain() {
				return this.userInfo.explain ? this.userInfo.explain : '此用户暂无个签~';
			}
		},
		methods: {
			cancel() {
				uni.navigateBack()
			},
			//发送好友添加申请
			async addUser() {
				const params = {
					uid: this.uid,
					fid: this.fid,
					msg: this.msg,
					token: this.token
				}
				const res = await postApplyFriend(params)
				if (res.data.status == 200) {
					this.socket.emit('newFriend', this.fid)
					this.$refs.uToast.show({
						type: 'success',
						message: "好友申请已发送!"
					})
				}
				this.isShowApplyBox = false
			},
			//获取好友详情信息
			async getFriendDetail() {
				const res = await postUserDetail({
					id: this.fid,
					token: this.token
				})
				if (res.data.status == 200) {
					this.userInfo = res.data.result
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
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: flex-end;

		.avatar {
			width: 160px;
			height: 160px;
			justify-content: center;
			align-items: center;
			border-radius: 20px;
			box-shadow: 0px 0px 20px 10px white;
		}
	}

	.name {
		margin: auto;
		font-size: 30px;
		padding-top: 15px;
		text-align: center;
		font-weight: 600;
	}

	.email {
		margin: auto;
		font-size: 18px;
		padding: 10px;
		text-align: center;
		font-weight: 600;
	}

	.info-box {
		border-radius: 26px 26px 0 0;
		background-color: white;
		height: calc(100vh - 200px);

		.info {
			margin: auto;
			width: 80%;
			font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
			padding-top: 40px;


			.intro {
				padding: 12px;
				margin-bottom: 40px;
				border-radius: 10px;
				background-color: #eee;
				line-height: 21px;
				height: 84px;
			}
		}
	}



	.btn-cancel {
		margin-bottom: 10px;
	}
</style>
