<template>
	<view>
		<u-navbar title="新的好友" :safeAreaInsetTop="true" fixed :placeholder="true" @leftClick="leftClick">
		</u-navbar>
		<view class="box">
			<ul class="list">
				<li v-for="(item, index) in showList" :key="item.id">
					<view class="card-top">
						<view class="disagree-btn">
							<u-button type="error" @click="refuse(item.id)">拒绝</u-button>
						</view>
						<view class="agree-btn">
							<u-button type="success" @click="agree(item.id)">同意</u-button>
						</view>
						<view class="avatar">
							<u-avatar shape="circle" size="70" :src="`${baseUrl}/avatar/${item.imgUrl}`"></u-avatar>
						</view>
						<view class="name">
							{{item.username}}
						</view>
						<view class="time">
							{{item.time}}
						</view>
					</view>
					<view class="card-bottom">
						<view class="message-box">
							{{item.message}}
						</view>
					</view>
				</li>
			</ul>
		</view>

		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import getUserStorage from '../../mixin/getUserStorage.js'
	import {
		postGetFriend,
		postGetLastMsg,
		postUpdateFriendState,
		postDeleteFriend
	} from '../../config/api.js'
	import myfun from '../../commons/util/myfun.js'

	export default {
		data() {
			return {
				newAddRequestList: [],
				showList: []
			};
		},
		mixins: [getUserStorage],
		onShow() {
			this.getAddRequestList()
		},
		methods: {
			//返回
			leftClick() {
				uni.reLaunch({
					url: '../friends/friends'
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
					this.newAddRequestList = res.data.result
					for (let item of this.newAddRequestList) {
						const params = {
							uid: this.uid,
							fid: item.id,
							token: this.token
						}
						const resMsg = await postGetLastMsg(params)
						if (resMsg.data.status == 200) {
							item.message = resMsg.data.result.message
							const time = new Date(resMsg.data.result.time).valueOf()
							item.time = myfun.weChatTimeFormat(time)
						}
					}
					this.showList = this.newAddRequestList
				}
			},
			//同意申请
			async agree(fid) {
				const params = {
					uid: this.uid,
					fid: fid,
					token: this.token
				}
				const res = await postUpdateFriendState(params)
				if (res.data.status == 200) {
					this.socket.emit('agree', fid)
					this.$refs.uToast.show({
						type: 'success',
						message: "成功添加好友！"
					})
					this.showList = this.showList.filter(item => {
						return item.id != fid
					})
				} else {
					this.$refs.uToast.show({
						type: 'error',
						message: "操作失败！"
					})
				}
			},
			//拒绝申请
			async refuse(fid) {
				const params = {
					uid: this.uid,
					fid: fid,
					token: this.token
				}
				const res = await postDeleteFriend(params)
				if (res.data.status == 200) {
					this.$refs.uToast.show({
						type: 'success',
						message: "已拒绝好友申请！"
					})
					this.showList = this.showList.filter(item => {
						return item.id != fid
					})
				} else {
					this.$refs.uToast.show({
						type: 'error',
						message: "操作失败！"
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.box {
		padding: 0 10px 10px 10px;

		.list {
			list-style: none;
			margin: 0;
			padding: 0 10px;

			li {
				width: 100%;
				margin-top: 10px;

				.card-top {
					width: 100%;
					padding: 10px 0;
					background-color: #fae04d;
					position: relative;

					.agree-btn {
						width: 20%;
						position: absolute;
						top: 0;
						right: 0;
					}

					.disagree-btn {
						width: 20%;
						position: absolute;
						top: 0;
					}

					.avatar {
						text-align: center;
						display: flex;
						justify-content: center;
					}

					.name {
						text-align: center;
						font-size: 22px;
						font-weight: 600;
						margin-top: 10px;
					}
					
					.time {
						text-align: center;
						font-size: 14px;
						font-weight: 500;
						margin-top: 5px;
						color: gray;
					}
				}

				.card-bottom {
					width: 100%;

					.message-box {
						padding: 10px;
						min-height: 100px;
						border: 1px solid #f4d84a;
						// border-radius: 12px;
						word-break: break-all;
						word-wrap: break-word;
					}
				}
			}
		}
	}
</style>
