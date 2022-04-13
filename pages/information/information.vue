<template>
	<view>
		<u-navbar title="个人信息" :safeAreaInsetTop="true" fixed :placeholder="true" @leftClick="leftClick" />
		<view class="cells">
			<view class="cell">
				<span>头像:</span>
				<view class="cell-content">
					<avatar selWidth="200px" selHeight="400upx" @upload="myUpload"
						:avatarSrc="`${baseUrl}/avatar/${imgUrl}`"
						avatarStyle="width: 120rpx; height: 120rpx; border-radius: 20%;" v-if="id==uid">
					</avatar>
					<img :src="`${baseUrl}/avatar/${imgUrl}`" style="width: 120upx; height: 120upx; border-radius: 20%;"
						v-if="id!=uid">
					</img>
				</view>
			</view>
			<view class="cell">
				<span>用户名:</span>
				<view class="cell-content">
					{{username}}
				</view>
			</view>
			<view class="cell">
				<span>邮箱:</span>
				<view class="cell-content">
					{{email}}
				</view>
			</view>
			<view class="cell">
				<span>签名:</span>
				<view class="cell-content" @click="showEditIntroPopup" v-if="id==uid">
					{{showExplain}}
				</view>
				<view class="cell-content" v-if="id!=uid">
					{{showExplain}}
				</view>
			</view>
			<view class="cell">
				<span>注册:</span>
				<view class="cell-content">
					{{regTime}}
				</view>
			</view>
			<button type="default" class="btn" @click="changePwd_Click" v-if="id==uid">修改密码</button>
			<button type="warn" class="btn" @click="delFriend_Click" v-if="id!=uid">删除好友</button>

			<u-popup :show="isShowEditIntro" mode="center" :closeable="true" @close="closePopup">
				<view class="pop">
					<u--textarea v-model="explain" placeholder="请写下你的个签" height="200px" :count="true" maxlength="50"
						style="padding-top: 40px;"></u--textarea>
					<button type="default" @click="saveIntro">确定</button>
				</view>
			</u-popup>

			<u-toast ref="uToast"></u-toast>
			<u-modal :show="isShowChangePwd" title="修改密码" :showCancelButton="true" @cancel="cancelChangePwd"
				@confirm="changePwd" confirmColor="#23c248">
				<view class="slot-content">
					<u--input placeholder="请输入原密码" border="surround" v-model="oldPwd" :password="true"></u--input>
					<u--input placeholder="请输入新密码" border="surround" v-model="newPwd" :password="true"></u--input>
					<u--text type="error" text=" tip: 请填写不少于8位新密码" v-if="newPwd.length<8"></u--text>
				</view>
			</u-modal>
			<u-modal :show="isShowDelFriend" title="是否删除该好友?" @confirm="delFriend" confirmColor="#cf0000"
				:closeOnClickOverlay="true" @close="closeDelFriend"></u-modal>
		</view>
	</view>
</template>

<script>
	import getUserStorage from '../../mixin/getUserStorage.js'
	import avatar from "../../components/yq-avatar/yq-avatar.vue"
	import myfun from '../../commons/util/myfun.js'
	import {
		uploadAvatar,
		postUserUpdate,
		postUserDetail,
		postDeleteFriend,
	} from '../../config/api.js'
	import {
		pathToBase64
	} from 'image-tools'

	export default {
		data() {
			return {
				id: '', //传入页面的用户id
				isShowEditIntro: false,
				explain: '',
				email: '',
				regTime: '',
				isChangeAvatar: false, //是否修改了头像
				oldPwd: '',
				newPwd: '',
				isShowChangePwd: false,
				isShowDelFriend: false
			};
		},
		mixins: [getUserStorage],
		components: {
			avatar
		},
		computed: {
			showExplain() {
				return this.explain == '' ? '暂无个签~' : this.explain
			}
		},
		onLoad(option) {
			this.id = option.id
		},
		onShow() {
			this.getInformation(this.id)
		},
		methods: {
			//返回
			leftClick() {
				if (this.isChangeAvatar) {
					uni.reLaunch({
						url: '../index/index'
					})
				} else {
					uni.navigateBack()
				}
			},
			//获取用户详情
			async getInformation(id) {
				const params = {
					id: id,
					token: this.token
				}
				const res = await postUserDetail(params)
				if (res.data.status == 200) {
					const result = res.data.result
					this.explain = result.explain ? result.explain : ''
					this.email = result.email
					this.regTime = new Date(result.time).valueOf() //转ISODate为时间戳
					this.regTime = myfun.formatDate('YYYY-MM-dd hh:mm', this.regTime)
					this.username = result.username
					this.imgUrl = result.imgUrl
				} else {
					this.$refs.uToast.show({
						type: 'error',
						message: "获取用户信息失败"
					})
				}
			},
			showEditIntroPopup() {
				this.isShowEditIntro = true
			},
			closePopup() {
				this.isShowEditIntro = false
			},
			//修改个签
			async saveIntro() {
				const editParams = {
					id: this.uid,
					data: this.explain,
					type: 'explain',
					token: this.token
				}
				const editRes = await postUserUpdate(editParams)
				if (editRes.data.status == 200) {
					this.$refs.uToast.show({
						type: 'success',
						message: "个签修改成功"
					})
					this.isShowEditIntro = false
				} else {
					this.$refs.uToast.show({
						type: 'error',
						message: "个签修改失败"
					})
				}
			},
			//头像裁剪
			async myUpload(rsp) {
				// console.log(await pathToBase64(rsp.path))
				//存头像文件
				const params = {
					url: 'avatar',
					name: new Date().getTime() + this.uid,
					base64: await pathToBase64(rsp.path),
					token: this.token,
				}
				const res = await uploadAvatar(params)
				if (res.data.status == 200) {
					//   xxxxxx.png
					const imgUrl = res.data.result.fileName
					//修改数据库头像信息
					const editParams = {
						id: this.uid,
						data: imgUrl,
						type: 'imgUrl',
						token: this.token
					}
					const editRes = await postUserUpdate(editParams)
					if (editRes.data.status == 200) {
						//更新storage头像信息
						try {
							uni.setStorageSync('user', {
								id: this.uid,
								username: this.username,
								imgUrl: imgUrl,
								token: this.token,
								bgUrl: this.bgUrl,
							});
							this.$refs.uToast.show({
								type: 'success',
								message: "头像修改成功"
							})
						} catch (e) {
							console.log('数据存储出错')
						}
						//更新前台视觉上的头像
						this.imgUrl = imgUrl;
						this.isChangeAvatar = true
					}
				}
			},
			//修改密码按钮点击
			changePwd_Click() {
				this.isShowChangePwd = true
			},
			//取消修改密码
			cancelChangePwd() {
				this.isShowChangePwd = false
			},
			//确认修改密码
			async changePwd() {
				if (this.newPwd.length >= 8) {
					const params = {
						id: this.uid,
						data: this.newPwd,
						type: 'password',
						password: this.oldPwd,
						token: this.token
					}
					const res = await postUserUpdate(params)
					if (res.data.status == 200) {
						this.isShowChangePwd = false
						this.$refs.uToast.show({
							type: 'success',
							message: "密码修改成功,请重新登录"
						})
						uni.clearStorageSync()
						setTimeout(() => {
							uni.navigateTo({
								url: '../login/login'
							})
						}, 1000)
					} else {
						this.isShowChangePwd = false
						this.$refs.uToast.show({
							type: 'error',
							message: "密码修改出错"
						})
					}
				}
			},
			//删除好友按钮点击
			delFriend_Click() {
				this.isShowDelFriend = true
			},
			//执行删除好友
			async delFriend() {
				const params = {
					uid: this.uid,
					fid: this.id,
					token: this.token
				}
				const res = await postDeleteFriend(params)
				this.isShowDelFriend = false
				if (res.data.status == 200) {
					uni.$emit('delId', this.id)
					uni.switchTab({
						url: '../index/index'
					})
				}
			},
			//点击遮罩关闭对话框
			closeDelFriend() {
				this.isShowDelFriend = false
			}
		}
	}
</script>

<style lang="scss">
	.toast {
		z-index: 9999;
	}

	.cells {
		margin-top: 20px;
		border-top: 1px solid $uni-color-border;

		.cell {
			border-bottom: 1px solid $uni-color-border;
			padding: 12px 30px;
			display: flex;
			align-items: center;

			span {
				width: 70px;
			}

			.cell-content {
				max-width: 75%;
				// white-space: nowrap;
				// text-overflow: ellipsis;
				// overflow: hidden;
			}
		}
	}

	.btn {
		margin-top: 30px;
	}

	.pop {
		width: 300px;
	}
</style>
