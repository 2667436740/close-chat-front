<template>
	<view>
		<view class="cells">
			<view class="cell">
				<span>头像:</span>
				<view class="cell-content">
					<u-avatar :src="this.imgUrl" size="50" @click="" shape="square"></u-avatar>
				</view>
			</view>
			<view class="cell">
				<span>用户名:</span>
				<view class="cell-content">
					柒锋
				</view>
			</view>
			<view class="cell">
				<span>邮箱:</span>
				<view class="cell-content">
					2667436740@qq.com
				</view>
			</view>
			<view class="cell">
				<span>签名:</span>
				<view class="cell-content" @click="showEditIntroPopup">
					{{intro}}
				</view>
			</view>
			<button type="default" class="btn">修改密码</button>

			<u-popup :show="isShowEditIntro" mode="center" :closeable="true" @close="closePopup">
				<view class="pop">
					<u--textarea v-model="intro" placeholder="请写下你的个签" height="200px" :count="true" maxlength="200"
						style="padding-top: 40px;"></u--textarea>
					<button type="default" @click="saveIntro">确定</button>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import getUserStorage from '../../mixin/getUserStorage.js'

	export default {
		data() {
			return {
				isShowEditIntro: false,
				intro: '只是一个前端小菜鸡罢了...后面测试三行省略~~~活动i哇额u发iOA未必就发货我ID发货IASDHFDAEWFBADFKJAHSDFOIUA瓦数的GIF好吧不HJALDSGPHI回到房间看不JEWBFHOAHEWBFKA'
			};
		},
		mixins: [getUserStorage],
		methods: {
			showEditIntroPopup() {
				this.isShowEditIntro = true
			},
			saveIntro() {
				//保存服务器刷新
				//...
				this.isShowEditIntro = false
			},
			closePopup() {
				this.isShowEditIntro = false
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
