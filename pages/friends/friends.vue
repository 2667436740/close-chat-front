<template>
	<view>
		<u-navbar title="朋友" :safeAreaInsetTop="true" fixed :placeholder="true">
			<view slot="left"></view>
			<view slot="right">
				<u-avatar src="../../static/img/friend_add.png" size="20" @click="searchPageJump"></u-avatar>
			</view>
		</u-navbar>

		<u-index-list :index-list="indexList" :customNavHeight="80">
			<u-cell-group slot="header">
				<navigator url="../addrequest/addrequest">
					<u-cell title="新的朋友">
						<u-avatar slot="icon" shape="square" size="35" icon="man-add-fill" fontSize="26" randomBgColor
							customStyle="margin: -3px 5px -3px 0"></u-avatar>
						<u-badge slot="value" shape="circle" max="99" :value="newRequestNum"></u-badge>
					</u-cell>
				</navigator>
			</u-cell-group>
			<!-- 索引块（A-Z） -->
			<u-index-item v-for="(item, index) in indexList" :key="index">
				<!-- 索引 -->
				<u-index-anchor :text="item" v-if="isShowAnchor(item)"></u-index-anchor>
				<!-- 每块内容 -->
				<u-cell v-for="(item1, index1) in itemArr" :key="item1.id" :title="item1.username"
					:border="index1 !== item.length - 1" v-if="item1.char == item" @click="chatPageJump(item1)">
					<u-avatar slot="icon" shape="square" size="35" :src="`${baseUrl}/avatar/${item1.imgUrl}`"
						customStyle="margin: -3px 5px -3px 0"></u-avatar>
				</u-cell>
			</u-index-item>
		</u-index-list>
	</view>
</template>

<script>
	import getUserStorage from '../../mixin/getUserStorage.js'
	import {
		postGetFriend
	} from '../../config/api.js'
	import pinyin from 'pinyin'

	const indexList = () => {
		const indexList = []
		const charCodeOfA = 'A'.charCodeAt(0)
		for (let i = 0; i < 26; i++) {
			indexList.push(String.fromCharCode(charCodeOfA + i))
		}
		indexList.push('#')
		return indexList
	}

	export default {
		components: {},
		data() {
			return {
				value: 'friends',
				indexList: indexList(),
				newRequestNum: 0,
				itemArr: []
			};
		},
		computed: {

		},
		mixins: [getUserStorage],
		onLoad() {
			this.getFriend()
		},
		onShow() {
			this.getAddRequestList()
			// this.getFriend()
		},
		methods: {
			//是否展示单项锚点
			isShowAnchor(item) {
				let showFlag = false
				this.itemArr.map(ee => {
					if (ee.char == item) showFlag = true
				})
				return showFlag
			},
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
				this.itemArr = []
				const params = {
					uid: this.uid,
					state: 0,
					token: this.token
				}
				const res = await postGetFriend(params)
				if (res.data.status == 200) {
					const result = res.data.result
					result.map(item => {
						const regChar = new RegExp("^[a-zA-Z]")
						const regNum = new RegExp("^[0-9]")
						const char = item.username.slice(0, 1)
						if (regChar.test(char)) {
							//开头是字母
							this.itemArr.push({
								char: char.toUpperCase(),
								username: item.username,
								imgUrl: item.imgUrl,
								id: item.id
							})
						} else if (regNum.test(char)) {
							//开头是数字
							this.itemArr.push({
								char: '#',
								username: item.username,
								imgUrl: item.imgUrl,
								id: item.id
							})
						} else {
							//开头是汉字
							const charStart = pinyin(char, {
								style: pinyin.STYLE_FIRST_LETTER //首字
							})
							this.itemArr.push({
								char: charStart[0][0].toUpperCase(),
								username: item.username,
								imgUrl: item.imgUrl,
								id: item.id
							})
						}
					})
				}
			},
			//跳转好友聊天页
			chatPageJump(item) {
				uni.navigateTo({
					url: `../chat/chat?id=${item.id}&imgUrl=${item.imgUrl}&username=${item.username}`
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
