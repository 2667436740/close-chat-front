<template>
	<view>
		<view class="content">
			<view class="logo">
				<image src="../../static/img/logo2.png" mode=""></image>
			</view>
			<span>注册 Close Chat 账号</span>

			<u--form class="form" ref="regForm" :rules="rules" :model="model1">
				<u-form-item borderBottom prop="userInfo.username">
					<u--input placeholder="取个名字吧" v-model="model1.userInfo.username" border="none" prefixIcon="account"
						@blur="matchUser">
					</u--input>
					<view class="icon-box" v-show="isShowUserTag">
						<u-icon name="close-circle" color="#da4a12" size="20" v-show="!canUserReg"></u-icon>
						<p v-show="!canUserReg">已注册</p>
						<u-icon name="checkmark-circle" color="#15da25" size="20" v-show="canUserReg"></u-icon>
					</view>
				</u-form-item>
				<u-form-item borderBottom prop="userInfo.email" ref="email">
					<u--input placeholder="这里填写邮箱" v-model="model1.userInfo.email" border="none" prefixIcon="email"
						@blur="matchEmail">
					</u--input>
					<view class="icon-box" v-show="isShowEmailTag">
						<u-icon name="close-circle" color="#da4a12" size="20" v-show="!canEmailReg"></u-icon>
						<p v-show="!canEmailReg">已注册</p>
						<u-icon name="checkmark-circle" color="#15da25" size="20" v-show="canEmailReg"></u-icon>
					</view>
				</u-form-item>
				<u-form-item borderBottom prop="userInfo.password">
					<u--input placeholder="别忘了设定密码" v-model="model1.userInfo.password" border="none" :password="true"
						prefixIcon="lock"></u--input>
				</u-form-item>
			</u--form>

			<view class="btns">
				<u-button text="注册" size="normal" class="btn-reg" type="success" @click="reg"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		postSignUp,
		postJudgeValue
	} from '../../config/api.js'
	export default {
		data() {
			return {
				model1: {
					userInfo: {
						username: '',
						email: '',
						password: '',
					}
				},
				rules: {
					'userInfo.username': {
						required: true,
						message: '请填写不少于5位用户名',
						min: 5,
						trigger: ['blur', 'change']
					},
					'userInfo.email': [{
						required: true,
						message: '请填写邮箱',
						trigger: ['blur', 'change']
					}, {
						validator: (rule, value, callback) => {
							return uni.$u.test.email(value);
						},
						message: '邮箱格式不正确',
						trigger: ['blur', 'change'],
					}],
					'userInfo.password': {
						required: true,
						message: '请填写不少于6位密码',
						min: 6,
						trigger: ['blur', 'change']
					}
				},
				isShowUserTag: false,
				canUserReg: true, //用户名是否可注册
				isShowEmailTag: false,
				canEmailReg: true, //邮箱是否可注册
			};
		},
		methods: {
			matchUser() {
				if (this.model1.userInfo.username.length >= 5) {
					this.isShowUserTag = true
					const params = {
						data: this.model1.userInfo.username,
						type: 'username'
					}
					postJudgeValue(params).then(res => {
						const status = res.data.status
						if (status == 200) {
							const result = res.data.result
							this.canUserReg = result > 0 ? false : true
						} else {
							uni.$u.toast('服务器出错啦')
						}
					})
				} else {
					this.isShowUserTag = false
				}
			},
			async matchEmail() {
				if (uni.$u.test.email(this.model1.userInfo.email)) {
					this.isShowEmailTag = true
					const params = {
						data: this.model1.userInfo.email,
						type: 'email'
					}
					const res = await postJudgeValue(params)
					const status = res.data.status
					if (status == 200) {
						const result = res.data.result
						this.canEmailReg = result > 0 ? false : true
					} else {
						uni.$u.toast('服务器出错啦')
					}
				}
			},
			reg() {
				this.$refs.regForm.validate().then(res => {
					console.log('ok')
					if (this.canUserReg && this.canEmailReg) {
						const params = {
							email: this.model1.userInfo.email,
							username: this.model1.userInfo.username,
							password: this.model1.userInfo.password
						}
						postSignUp(params).then(res => {
							if (res.data.status == 200) {
								uni.$u.toast('注册成功！正跳转登录..')
								setTimeout(() => {
									uni.navigateTo({
										url: '../login/login'
									})
								}, 2000)
							} else uni.$u.toast('注册失败！')
						})
					} else {
						uni.$u.toast('用户名或邮箱被占用！')
					}
				}).catch(err => {
					uni.$u.toast('请正确填写注册信息！')
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.logo {
		height: 200px;
	}

	.form {
		width: 250px;
		margin-top: 15px;

		.icon-box {
			display: flex;

			p {
				color: green;
			}
		}
	}

	.btns {
		padding-top: 15px;
		width: 250px;

		.btn-reg {
			margin-top: 15px;
		}

	}
</style>
