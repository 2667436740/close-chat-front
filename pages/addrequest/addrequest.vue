<template>
	<view>
		<u-navbar title="新的好友" @rightClick="rightClick" @leftClick="leftClick"></u-navbar>
		<view class="box">
			<u-list>
				<u-list-item v-for="(item, index) in newAddRequestList" :key="index">
					<u-cell :title="item.name">
						<u-avatar slot="icon" shape="square" size="35" :src="item.avatar"
							customStyle="margin: -3px 5px -3px 0"></u-avatar>
						<view slot="value">
							<u-button type="success" size="mini" customStyle="display: inline-block; margin-right: 5px">
								同意</u-button>
							<u-button type="error" size="mini" customStyle="display: inline-block">拒绝</u-button>
						</view>
					</u-cell>
				</u-list-item>
			</u-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newAddRequestList: [{
					name: '阿伟',
					avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
					isFriend: true
				}, {
					name: '我是大海',
					avatar: 'https://cdn.uviewui.com/uview/album/2.jpg',
					isFriend: true
				}, {
					name: '爱你',
					avatar: 'https://cdn.uviewui.com/uview/album/3.jpg',
					isFriend: false
				}, {
					name: '大宝贝',
					avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
					isFriend: false
				}]
			};
		},
		methods: {
			leftClick() {
				uni.navigateBack({

				})
			}
		}
	}
</script>

<style lang="scss">
	.box {
		padding: 0 10px;
	}
</style>
