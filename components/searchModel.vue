<template>
	<view class="search-box-model">
		<view class="search" :class="{ active: isShowSearch }">
			<form class="input-box" action="javascript:return true;">
				<icon class="search-icon" type="search" size="20" @tap="searching" />
				<input
					@confirm="searching"
					type="text"
					confirm-type="search"
					v-model="strWhere"
                     :focus="focus"
					placeholder="请输入搜索值"
				/>
				<view class="empty" v-if="strWhere" @tap="emptySearch">
					<icon type="clear"  size="20"></icon>
				</view>
			</form>
			<view class="cancel" @tap="cancelSeach">取消</view>
		</view>
		<view class="show-search" :class="{ active: !isShowSearch }" @tap="showSearch">
			<icon type="search" size="20" /> 搜索
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isShowSearch: false,
			strWhere: '',
			focus:false
		};
	},
	methods: {
		showSearch() {
			this.isShowSearch = true;
			this.focus=true;
		},
		emptySearch() {
			this.strWhere = '';
			this.searching();
			
		},
		//取消搜索
		cancelSeach() {
			this.isShowSearch = false;
			this.strWhere = '';
			this.searching();
		},
		//搜索
		searching() {
			this.focus=false;
			this.$emit('searching', this.strWhere);
		},
		keyUp() {
			if (!this.strWhere) {
				this.searching();
			}
		}
	}
};
</script>

<style lang="scss" scoped="">
.search-box-model {
	position: relative;
	width: 100%;
	z-index: 100;
	height: 100%;
	box-sizing: border-box;
	padding: 10px 15px;
	align-items: center;
	overflow: hidden;
	.search {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		height: 0;
		overflow: hidden;
		&.active {
			height: auto;
		}
		.input-box {
			flex: 1;
			position: relative;
			height: 32px;
			border-radius: 4px;
			background: #fff;
			padding-left: 80upx;
			.search-icon{
				position:absolute;
				top:15upx;
				left:15upx;
			}
			input {
				width:100%;
				height: 30px;
				box-sizing: border-box;
				border: none;
			}
			text {
				font-size: 18px;
				position: absolute;
				top: 5px;
				left: 10px;
				color: #999;
			}
			.empty {
				position: absolute;
				top: 0;
				right: 0;
				width: 40px;
				height: 100%;
				z-index: 20;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				b {
					font-size: 18px;
					color: #999;
				}
			}
		}
		.cancel {
			margin-left: 10px;
			font-size: 14px;
			text-align: right;
		}
	}

	.show-search {
		width: 100%;
		border-radius: 4px;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 14px;
		color: #999;
		background: #fff;
		height: 0;
		overflow: hidden;
		&.active {
			height: 30px;
		}
		icon{margin-right: 20upx;}
		text {
			font-size: 18px;
			color: #999;
			margin-right: 15px;
		}
	}
}
</style>
