<template>
	<view>
		<view class="content">
			<u-transition :show="showLogo" mode="fade" duration="800">
			<view class="logo">
				<image src="../../static/img/logo2.png" mode=""></image>
			</view>
			</u-transition>

			<u-transition :show="showBox" mode="slide-up">
				<view class="login-box">
					<span class="wel-txt">Welcome to Close Chat!</span>

					<u--form class="form" ref="loginForm" :rules="rules" :model="model1">
						<u-form-item borderBottom prop="userInfo.username">
							<u--input placeholder="请填写用户名/邮箱" v-model="model1.userInfo.username" border="none"
								prefixIcon="account">
							</u--input>
						</u-form-item>
						<u-form-item borderBottom prop="userInfo.password">
							<u--input placeholder="请填写密码" v-model="model1.userInfo.password" border="none"
								:password="true" prefixIcon="lock"></u--input>
						</u-form-item>
					</u--form>

					<view class="btns">
						<u-button text="登录" size="normal" type="success" @click="login"></u-button>
						<u-button text="注册" size="normal" class="btn-reg" @click="regPageJump"></u-button>
					</view>
				</view>
			</u-transition>
		</view>

		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		postSignIn
	} from '../../config/api.js'

	export default {
		data() {
			return {
				model1: {
					userInfo: {
						username: '',
						password: '',
					},
				},
				rules: {
					'userInfo.username': {
						required: true,
						message: '请填写用户名',
						trigger: ['blur', 'change']
					},
					'userInfo.password': {
						required: true,
						message: '请填写密码',
						trigger: ['blur', 'change']
					}
				},
				showBox: false,
				showLogo: false
			};
		},
		onReady() {
			this.showBox = true
			this.showLogo = true
		},
		methods: {
			async login() {
				const params = {
					data: this.model1.userInfo.username,
					password: this.model1.userInfo.password
				}
				const res = await postSignIn(params)
				if (res.data.status == 200) {
					const back = res.data.back
					try {
						uni.setStorageSync('user', {
							id: back.id,
							username: back.username,
							imgUrl: back.imgUrl,
							token: back.token,
							bgUrl: back.bgUrl
						});
					} catch (e) {
						console.log('数据存储出错')
					}
					uni.reLaunch({
						url: '../index/index'
					})
					//---------登录成功后强制刷新一下当前页面---------
					// window.location.reload(); 
				} else if (res.data.status == 400 || res.data.status == 401) {
					this.$refs.uToast.show({
						type: 'error',
						message: "用户名或密码错误"
					})
					this.model1.userInfo.password = ''
				} else if (res.data.status == 500) {
					this.$refs.uToast.show({
						type: 'error',
						message: "服务器开小差啦!"
					})
				}
			},
			regPageJump() {
				uni.navigateTo({
					url: '../reg/reg'
				})
			}
		}
	}
</script>

<style lang="scss">
	.content,
	.login-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		.wel-txt {
			font-weight: 600;
			font-size: 20px;
		}
	}

	.logo {
		height: 200px;
	}

	.form {
		width: 250px;
		margin-top: 15px;
	}

	.btns {
		padding-top: 15px;
		width: 250px;

		.btn-reg {
			margin-top: 15px;
		}
	}
</style>
