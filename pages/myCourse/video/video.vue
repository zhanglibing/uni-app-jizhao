<template>
	<view v-if="url">
		<video v-if="isMp4" :src="url" :autoplay="true" id="myVideo" preload="auto"></video>
		<view class="video-box" v-else="">
			<view class="process-box">
				<text>{{ currentTime }}</text> <progress :percent="offerSet" stroke-width="6" />
				<text>{{ duration }}</text>
			</view>
			<button @tap="pause" v-if="isPlay">暂停播放</button>
			<button @tap="play" type="primary" v-else="">开始播放</button>
		</view>
	</view>
</template>

<script>
import api from '../../../api/course.js';
export default {
	data() {
		return {
			url: '',
			isPlay: false,
			myaudio: null,
			duration: '00:00', //总时长
			currentTime: '00:00', //当前时长
			offerSet: 0,
			isMp4: false
		};
	},
	onLoad(options) {
		let id = options.id;
		uni.showLoading({
			title: '加载中'
		});
		api.getVidepUrl(id).then(res => {
			uni.hideLoading();
			this.url = res;
			console.log(res)
			if (res.slice(-3) != 'mp4') {
				this.init();
			} else {
				this.isMp4 = true;
				
			}
		});
	},
	methods: {
		init() {
			//创建一个音频实例
			const myaudio = wx.createInnerAudioContext();
			this.myaudio = myaudio;
			//设置obeyMuteSwitch: false（不遵循系统静音开关，即使用户打开了静音开关，也能继续发出声音）
			//设置autoplay: true（自动开始播放）
			if (wx.setInnerAudioOption) {
				wx.setInnerAudioOption({
					obeyMuteSwitch: false,
					autoplay: false
				});
			} else {
				myaudio.obeyMuteSwitch = false;
				myaudio.autoplay = false;
			}

			//监听各个阶段
			myaudio.onCanplay(e => {
				myaudio.duration;
				console.log('可以播放');
				setTimeout(() => {
					this.duration = this.formatTime(myaudio.duration);
				}, 1000);
			});
			myaudio.onPlay(e => {
				console.log('监听到音频开始播放');
			});
			myaudio.onEnded(() => {
				console.log('音频自然播放结束事件');
			});
			myaudio.onStop(() => {
				console.log('音频停止事件');
			});
			myaudio.onTimeUpdate(res => {
				// console.log(myaudio.currentTime);
				this.currentTime = this.formatTime(myaudio.currentTime);
				this.offerSet = (myaudio.currentTime / myaudio.duration) * 100;
			});
			myaudio.onError(res => {
				console.log(res.errMsg);
				console.log(res.errCode);
			});
			myaudio.onWaiting(res => {
				console.log('音频加载中事件，当音频因为数据不足，需要停下来加载时会触发');
			});
			//设置播放链接
			myaudio.src = this.url;
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
		//时间格式化
		formatTime(val) {
			let h = Math.floor(val / 3600);
			let m = Math.floor((val % 3600) / 60);
			let s = Math.floor(val % 60);
			h = h < 10 ? '0' + h : h;
			m = m < 10 ? '0' + m : m;
			s = s < 10 ? '0' + s : s;
			return `${m}:${s}`;
		}
	},
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {
		this.myaudio.destroy();
	}
};
</script>

<style lang="scss">
.video-box {
	padding: 30rpx;
	box-sizing: border-box;
}
.process-box {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 40rpx;
	progress {
		flex: 1;
		margin: 0 30rpx;
	}
}

video {
	width: 100%;
}
</style>
