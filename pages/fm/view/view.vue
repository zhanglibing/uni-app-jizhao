<template>
	<view class="fm-view" v-if="info">
		<view class="title">{{ info.Title }}</view>
		<view class="watchs">
			<text>收藏: {{ info.WishlistQuantity }}</text>
			<text>评论: {{ info.CommentQuantity }}</text>
		</view>
		<view class="img-box">
			<image :src="info.BackgroundPictureUrl" mode="widthFix"></image>
		</view>
		<view class="process-box">
			<text>{{ currentTime }}</text>
			<slider @changing="sliderchange" @change="sliderchange" :value="offerSet" min="0" :max="max" block-color="#03528A"
			 selected-color="#03528A" block-size="14" />
			<text>{{ duration }}</text>
		</view>
		<view class="flex-row play-box">
			<image v-if="isCollection" @tap="setWish(info.Id)" class="collect" src="../../../static/images/fm/collected.png"
			 mode="widthFix"></image>
			<image v-else="" @tap="setWish" class="collect" src="../../../static/images/fm/collect.png" mode="widthFix"></image>
			<image class="change" @tap="changeFm('pre')" src="../../../static/images/fm/pre.png" mode="widthFix"></image>

			<image v-if="isPlay" @tap="pause" class="play" src="../../../static/images/fm/play.png" mode="widthFix"></image>
			<image v-else="" @tap="play" class="play" src="../../../static/images/fm/pause.png" mode="widthFix"></image>

			<image class="change" @tap="changeFm('next')" src="../../../static/images/fm/next.png" mode="widthFix"></image>
			<image @tap="goComment" class="comment" src="../../../static/images/fm/coment.png" mode="widthFix"></image>
		</view>
		<view class="comment-list">
			<view class="model-title">最新评价</view>
			<view class="list" v-if="comment.length">
				<view class="item" v-for="(item, index) in comment" :key="index">
					<view class="flex-row">
						<view class="imgBox">
							<image :src="item.Avatar" mode="widthFix" />
						</view>
						<view class="name-box">
							<view class="name">{{ item.NickName }}</view>
							<view class="time">{{ item.CreateDate }}</view>
						</view>
					</view>
					<view class="desc textOver3">{{ item.CommentText }}</view>
				</view>
			</view>
			<view v-else="" class="nothing">暂无评价</view>
		</view>
		<login></login>
	</view>
</template>

<script>
	import fm from '../../../api/fm.js';
	import login from '../../../components/login'
	export default {
		components: {
			login
		},
		data() {
			return {
				list: [], //播放列表
				activeIndex: 0,
				info: null,
				comment: [],
				id: '',
				myaudio: null,
				isPlay: false,
				offerSet: 0,
				duration: '00:00', //总时长
				currentTime: '00:00', //当前时长
				max: 100
			};
		},
		onLoad(option) {
			this.id = option.id;

			//创建一个音频实例
			// const myaudio = wx.createInnerAudioContext();
			const myaudio = wx.getBackgroundAudioManager()
			this.myaudio = myaudio;
			// 			//设置obeyMuteSwitch: false（不遵循系统静音开关，即使用户打开了静音开关，也能继续发出声音）
			// 			//设置autoplay: true（自动开始播放）
			// 			if (wx.setInnerAudioOption) {
			// 				wx.setInnerAudioOption({
			// 					obeyMuteSwitch: false,
			// 					autoplay: false
			// 				});
			// 			} else {
			// 				myaudio.obeyMuteSwitch = false;
			// 				myaudio.autoplay = false;
			// 			}
			// 
			//监听各个阶段
			myaudio.onCanplay(e => {
				myaudio.duration;
				// console.log('可以播放');
				setTimeout(() => {
					this.duration = this.formatTime(myaudio.duration);
					this.max = myaudio.duration;
				}, 1000);
			});
			// 			myaudio.onPlay(e => {
			// 				// console.log('监听到音频开始播放');
			// 			});
			myaudio.onEnded(() => {
				this.changeFm('next');
				// console.log('音频自然播放结束事件');
			});
			// 			myaudio.onStop(() => {
			// 				// console.log('音频停止事件');
			// 			});
			myaudio.onTimeUpdate(res => {
				this.currentTime = this.formatTime(myaudio.currentTime);
				this.offerSet = myaudio.currentTime;
			});
			// 			myaudio.onError(res => {
			// 				console.log(res.errMsg);
			// 				console.log(res.errCode);
			// 			});
			myaudio.onWaiting(res => {
				console.log('音频加载中事件，当音频因为数据不足，需要停下来加载时会触发');
			});
		},
		onShow() {
			this.list = this.$store.state.fmList;
			this.list.forEach((val, index) => {
				//设置当前播放位置
				if (val.Id == this.id) {
					this.activeIndex = index;
				} else {

				}
				this.info = this.list[this.activeIndex];
				this.init();

			});
			if (!this.list.length && this.id) {
				this.getView();
			}
		},
		methods: {
			init() {
				console.log(11)
				//设置播放链接
				// this.myaudio.src = this.info.AudioPathUrl;
				this.initBackAudio();
				this.getComment();
				// this.play();
				if (!this.$store.state.fmWishList.length) {
					fm.getWishLists();
				}
			},
			initBackAudio() {
				let {
					Title,
					BackgroundPictureUrl,
					AudioPathUrl
				} = this.info
				//后台播放音乐
				const backgroundAudioManager = this.myaudio;
				backgroundAudioManager.title = Title;
				backgroundAudioManager.epname = Title;
				backgroundAudioManager.singer = '幸福谋方'

				backgroundAudioManager.coverImgUrl = BackgroundPictureUrl;
				// 设置了 src 之后就会自动播放，若此处不设置src默认将为空字符串，当设置了src可以播放音乐
				backgroundAudioManager.src = AudioPathUrl;
				this.play()
			},
			//拖动进度
			sliderchange(e) {
				this.myaudio.seek(e.detail.value);
				this.play();
			},
			//开始播放
			play() {
				this.myaudio.play();
				this.isPlay = true;
			},
			//暂停播放
			pause() {
				this.myaudio.pause();
				this.isPlay = false;
			},
			//切换fm播放
			changeFm(type) {
				//播放列表为空  从分享入口进入
				if (!this.list.length) {
					uni.showModal({
						title: '提示',
						content: '当前播放列表为空',
						confirmText: '前往列表',
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../list'
								});
							}
						}
					});
					return false;
				}
				if ((type = 'pre')) {
					this.activeIndex--;
					if (this.activeIndex < 0) {
						this.activeIndex = this.list.length - 1;
					}
				} else {
					this.activeIndex++;
					if (this.activeIndex == this.list.length) {
						this.activeIndex = 0;
					}
				}
				this.info = this.list[this.activeIndex];
				this.initBackAudio()
				// this.myaudio.src = this.info.AudioPathUrl;
				this.myaudio.seek(0);
				this.getComment();
				this.play();
			},
			//时间格式化
			formatTime(val) {
				let h = Math.floor(val / 3600);
				let m = Math.floor((val % 3600) / 60);
				let s = Math.floor(val % 60);
				h = h < 10 ? '0' + h : h;
				m = m < 10 ? '0' + m : m;
				s = s < 10 ? '0' + s : s;
				return `${m}:${s}`;
			},
			//无播放列表时获取详情
			getView() {
				fm.getFmDetails(this.id).then(res => {
					this.info = res;

					this.init();
				});
			},
			//获取评论列表
			getComment() {
				fm.getCommentList(this.info.Id).then(res => {
					this.comment = [...res.Data];
				});
			},
			//收藏和取消收藏
			setWish() {
				if (!this.$isLogin()) {
					return false;
				}
				fm.setWish(this.info.Id).then(res => {
					console.log(res);
					uni.showToast({
						title: res,
						icon: 'success'
					});
				});
			},
			//前往评论页面
			goComment() {
				if (!this.$isLogin()) {
					return false;
				}
				uni.navigateTo({
					url: '../comment/comment?id=' + this.info.Id
				});
			}
		},
		computed: {
			//是否已收藏
			isCollection() {
				if (!this.info) {
					return false;
				}
				let bool = this.$store.state.fmWishList.some(val => val.FMId == this.info.Id);
				return bool;
			}
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			// this.myaudio.destroy();
			let {
				Title,
				BackgroundPictureUrl,
				AudioPathUrl
			} = this.info
			//后台播放音乐
			// 			const backgroundAudioManager = wx.getBackgroundAudioManager()
			// 			backgroundAudioManager.title = Title;
			// 			backgroundAudioManager.epname = Title;
			// 			backgroundAudioManager.singer = '幸福谋方'
			// 
			// 			backgroundAudioManager.coverImgUrl = BackgroundPictureUrl;
			// 			// 设置了 src 之后就会自动播放，若此处不设置src默认将为空字符串，当设置了src可以播放音乐
			// 			backgroundAudioManager.src = AudioPathUrl;


		},
		onHide() {
// 			let {
// 				Title,
// 				BackgroundPictureUrl,
// 				AudioPathUrl
// 			} = this.info
// 			//后台播放音乐
// 			const backgroundAudioManager = this.myaudio;
// 			backgroundAudioManager.title = Title;
// 			backgroundAudioManager.epname = Title;
// 			backgroundAudioManager.singer = '幸福谋方'
// 
// 			backgroundAudioManager.coverImgUrl = BackgroundPictureUrl;
// 			// 设置了 src 之后就会自动播放，若此处不设置src默认将为空字符串，当设置了src可以播放音乐
// 			backgroundAudioManager.src = AudioPathUrl;

		},

		//转发话术
		onShareAppMessage(res) {
			return {
				title: this.info.Title,
				imageUrl: this.info.BackgroundPictureUrl
			};
		}
	};
</script>

<style lang="scss">
	.fm-view {
		padding: 30upx 40upx;
		background: #fff;
		color: #666;

		.title {
			margin-bottom: 30upx;
		}

		.watchs {
			display: flex;
			flex-direction: row;
			margin-bottom: 30upx;

			text {
				margin-right: 60upx;
				font-size: 10px;
			}
		}

		.img-box {
			margin-bottom: 30upx;

			image {
				max-height: 400upx;
			}
		}
	}

	.process-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40rpx;

		slider {
			flex: 1;
			margin: 0 30rpx;
		}
	}

	.play-box {
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40upx;
		height: 110upx;

		.collect {
			width: 44upx;
			height: 40upx;
		}

		.change {
			width: 37upx;
		}

		.play {
			width: 110upx;
			height: 110upx;
		}

		.comment {
			width: 47upx;
		}
	}

	.comment-list {
		.model-title {
			font-size: 16px;
			border-bottom: 1px solid #eee;
			padding-bottom: 20upx;
		}

		.item {
			padding-top: 30upx;

			&>.flex-row {
				align-items: center;
				margin-bottom: 20upx;

				.imgBox {
					width: 90upx;
					height: 90upx;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 30upx;

					image {
						max-width: 100%;
						height: 100%;
					}
				}

				.name-box {
					.name {
						color: #000;
						margin-bottom: 10upx;
					}

					.time {
						font-size: 12px;
						color: #666;
					}
				}
			}

			.desc {
				font-size: 14px;
			}
		}
	}

	.nothing {
		padding-top: 20upx;
		line-height: 60upx;
		text-align: center;
	}
</style>
