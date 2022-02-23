<template>
	<view>
		<u-navbar title="个人信息" :safeAreaInsetTop="true" fixed :placeholder="true" @leftClick="leftClick" />
		<view class="cells">
			<view class="cell">
				<span>头像:</span>
				<view class="cell-content">
					<avatar selWidth="200px" selHeight="400upx" @upload="myUpload"
						:avatarSrc="`${BASE_URL}/avatar/${imgUrl}`"
						avatarStyle="width: 120rpx; height: 120rpx; border-radius: 20%;" v-if="id==uid">
					</avatar>
					<img :src="`${BASE_URL}/avatar/${imgUrl}`"
						style="width: 120upx; height: 120upx; border-radius: 20%;" v-if="id!=uid">
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
			<button type="default" class="btn">修改密码</button>

			<u-popup :show="isShowEditIntro" mode="center" :closeable="true" @close="closePopup">
				<view class="pop">
					<u--textarea v-model="explain" placeholder="请写下你的个签" height="200px" :count="true" maxlength="200"
						style="padding-top: 40px;"></u--textarea>
					<button type="default" @click="saveIntro">确定</button>
				</view>
			</u-popup>

			<u-toast ref="uToast"></u-toast>
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
	} from '../../config/api.js'
	import {
		pathToBase64
	} from 'image-tools'

	export default {
		data() {
			return {
				isShowEditIntro: false,
				explain: '',
				email: '',
				regTime: '',
				isChangeAvatar: false, //是否修改了头像
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
				this.isChangeAvatar == true ? uni.reLaunch({
					url: '../index/index'
				}) : uni.switchTab({
					url: '../index/index'
				});
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
								token: this.token
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
			}
		}
	}
</script>

<style lang="scss">
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
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
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
