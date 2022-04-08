<template>
	<view class="page">
		<u-navbar title="设置" :safeAreaInsetTop="true" fixed :placeholder="true" @leftClick="leftClick" />
		<view class="set-item">
			<u-cell-group>
				<u-cell size="large" title="聊天背景" icon="https://cdn.uviewui.com/uview/example/tag.png"
					:iconStyle="iconStyle" @click="setChatBg" :isLink="true"></u-cell>
			</u-cell-group>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import getUserStorage from '../../mixin/getUserStorage.js'
	import {
		uploadAvatar,
		postUserUpdate,
	} from '../../config/api.js'
	import {
		pathToBase64
	} from 'image-tools'

	export default {
		data() {
			return {
				iconStyle: {
					'margin-right': '10px'
				}
			};
		},
		mixins: [getUserStorage],
		methods: {
			//返回
			leftClick() {
				uni.navigateBack({
					url: '../account/account'
				})
			},
			//设置聊天背景
			async setChatBg() {
				// uni.showToast({
				// 	title: "功能开发中"
				// })
				uni.chooseImage({
					count: 1,
					sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //图库
					success: async (res) => {
						const upRes = await uploadAvatar({
							url: 'bg',
							name: new Date().getTime() + this.uid,
							base64: await pathToBase64(res.tempFilePaths[0]),
							token: this.token,
						})
						if (upRes.data.status == 200) {
							const bgUrl = upRes.data.result.fileName //   xxxxxx.png
							const editParams = {
								id: this.uid,
								data: bgUrl,
								type: 'bgUrl',
								token: this.token
							}
							const editRes = await postUserUpdate(editParams)
							if (editRes.data.status == 200) {
								try {
									uni.setStorageSync('user', {
										id: this.uid,
										username: this.username,
										imgUrl: this.imgUrl,
										token: this.token,
										bgUrl: bgUrl,
									});
									this.$refs.uToast.show({
										type: 'success',
										message: "成功设置聊天背景"
									})
								} catch (e) {
									console.log('数据存储出错')
								}
							}
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #f1f1f1;
		height: 100vh;
	}

	.set-item {
		margin-top: 10px;
		background-color: rgb(255, 255, 255);
	}
</style>
