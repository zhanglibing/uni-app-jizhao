/*
 * 讨论区接口
 */
import {
	Ajax,
	getUserId
} from './ajax.js'

// 获取讨论帖列表
async function getList(params) {
	let option = {
		type: 0, //['最新提问','已解答','未解答'] 0 1 2
		TopicType:1, //  null代表全部  0代表咨询师 1代表用户
		...params
	}
	return new Promise((resolve, reject) => {
		Ajax('ForumsHandle/GetAllTopics', option).then(res => {
			res.GetAllTopics = res.GetAllTopics.map(val => {
				let {
					AvatarUrl,
					ForumTopic,
					pictureUrl
				} = val;
				return {
					AvatarUrl,
					...ForumTopic,
					pictureUrl
				}
			})
			resolve(res)
		})
	})
}

// 获取我的文章
async function getMyTopic(params) {
	return new Promise((resolve, reject) => {
		Ajax('ForumsHandle/GetMyAllTopics', {
			customerId: getUserId(),
			...params
		}).then(res => {
			res.GetAllTopics = res.GetAllTopics.map(val => {
				let {
					AvatarUrl,
					ForumTopic,
					pictureUrl
				} = val;
				return {
					AvatarUrl,
					...ForumTopic,
					pictureUrl
				}
			})
			resolve(res.GetAllTopics)
		})
	})
}
export default {
	getList,
	getMyTopic
}
