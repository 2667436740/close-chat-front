<template>
	<view>
		<u-navbar title="朋友" :safeAreaInsetTop="true" fixed :placeholder="true">
			<view slot="left"></view>
			<view slot="right">
				<u-avatar src="../../static/img/friend_add.png" size="20" @click="searchPageJump"></u-avatar>
			</view>
		</u-navbar>

		<u-index-list>
			<u-cell-group slot="header">
				<navigator url="../addrequest/addrequest">
					<u-cell title="新的朋友">
						<u-avatar slot="icon" shape="square" size="35" icon="man-add-fill" fontSize="26" randomBgColor
							customStyle="margin: -3px 5px -3px 0"></u-avatar>
						<u-badge slot="value" shape="circle" max="99" :value="newRequestNum"></u-badge>
					</u-cell>
				</navigator>
				<u-cell title="标签">
					<u-avatar slot="icon" shape="square" size="35" icon="tags-fill" fontSize="26" randomBgColor
						customStyle="margin: -3px 5px -3px 0"></u-avatar>
				</u-cell>
			</u-cell-group>
			<template v-for="(item, index) in indexList">
				<!-- #ifdef APP-NVUE -->
				<u-index-anchor :text="indexList[index]" :key="index"></u-index-anchor>
				<!-- #endif -->
				<u-index-item :key="index">
					<!-- #ifndef APP-NVUE -->
					<u-index-anchor :text="indexList[index]"></u-index-anchor>
					<!-- #endif -->
					<u-cell v-for="(item1, index1) in item" :key="index1" :title="item1.username"
						:border="index1 !== item.length - 1">
						<u-avatar slot="icon" shape="square" size="35" :src="`${BASE_URL}/avatar/${item.imgUrl}`"
							customStyle="margin: -3px 5px -3px 0"></u-avatar>
					</u-cell>
				</u-index-item>
			</template>
		</u-index-list>
	</view>
</template>

<script>
	import getUserStorage from '../../mixin/getUserStorage.js'
	import {
		postGetFriend
	} from '../../config/api.js'

	// const indexList = () => {
	// 	const indexList = []
	// 	const charCodeOfA = 'A'.charCodeAt(0)
	// 	for (let i = 0; i < 26; i++) {
	// 		indexList.push(String.fromCharCode(charCodeOfA + i))
	// 	}
	// 	return indexList
	// }
	// const dom = uni.requireNativePlugin('dom')

	export default {
		components: {},
		data() {
			return {
				value: 'friends',
				// indexList: indexList(),
				// urls: [
				// 	'https://cdn.uviewui.com/uview/album/1.jpg',
				// 	'https://cdn.uviewui.com/uview/album/2.jpg',
				// 	'https://cdn.uviewui.com/uview/album/3.jpg',
				// 	'https://cdn.uviewui.com/uview/album/4.jpg',
				// 	'https://cdn.uviewui.com/uview/album/5.jpg',
				// 	'https://cdn.uviewui.com/uview/album/6.jpg',
				// 	'https://cdn.uviewui.com/uview/album/7.jpg',
				// 	'https://cdn.uviewui.com/uview/album/8.jpg',
				// 	'https://cdn.uviewui.com/uview/album/9.jpg',
				// 	'https://cdn.uviewui.com/uview/album/10.jpg',
				// ],
				// names: ["勇往无敌", "疯狂的迪飙", "磊爱可", "梦幻梦幻梦", "枫中飘瓢", "飞翔天使",
				// 	"曾经第一", "追风幻影族长", "麦小姐", "胡格罗雅", "Red磊磊", "乐乐立立", "青龙爆风", "跑跑卡叮车", "山里狼", "supersonic超"
				// ],
				newRequestNum: 0,
				indexList: []
			};
		},
		computed: {
			// itemArr() {
			// 	return this.indexList.map(item => {
			// 		const arr = []
			// 		for (let i = 0; i < 10; i++) {
			// 			arr.push({
			// 				name: this.names[uni.$u.random(0, this.names.length - 1)],
			// 				url: this.urls[uni.$u.random(0, this.urls.length - 1)]
			// 			})
			// 		}
			// 		return arr
			// 	})
			// }
		},
		mixins: [getUserStorage],
		onShow() {
			this.getAddRequestList()
			this.getFriend()
		},
		methods: {
			searchPageJump() {
				uni.navigateTo({
					url: '../search/search'
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
					this.newRequestNum = res.data.result.length
				}
			},
			//获取好友列表
			async getFriend() {
				const params = {
					uid: this.uid,
					state: 0,
					token: this.token
				}
				const res = await postGetFriend(params)
				if(res.status == 200) {
					this.indexList = res.data.result
					// console.log(this.indexList)
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
