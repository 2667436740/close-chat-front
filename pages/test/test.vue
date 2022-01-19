<template>
	<view>
		<button @click="test">上传图片</button>
		<view class="" v-for="(item,i) in imgs">
			<image :src="item" mode=""></image>
		</view>
	</view>
</template>

<script>
	import {
		upload
	} from '../../config/api.js'
	export default {
		data() {
			return {
				id: 'aghnlekfPAWEJGNFLKAf',
				imgs: []
			};
		},
		methods: {
			test() {
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						const url = 'my' //保存的后端文件夹
						for(let i=0; i<tempFilePaths.length; i++) {
							upload({
								filePath: tempFilePaths[i],
								name: 'file',
								formData: {
									'url': url,
									'name': new Date().getTime() + this.id + i //动态文件名
								},
								getTask: (task, options) => {
									task.onProgressUpdate((res) => {
										console.log('上传进度' + res.progress);
										console.log('已经上传的数据长度' + res.totalBytesSent);
										console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
										
										//   // 测试条件，取消上传任务。
										//   if (res.progress > 50) {
										//     uploadTask.abort();
										//   }
									});
								},
							}).then(res => {
								console.log(res);
								const filename = res.data[0].filename
								this.imgs.push(`${this.BASE_URL}/${url}/${filename}`)
								console.log(this.imgs)
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">

</style>
