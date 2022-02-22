const http = uni.$u.http

// post请求，获取菜单
export const postMenu = (params, config = {}) => http.post('/ebapi/public_api/index', params, config)

// get请求，获取菜单，注意：get请求的配置等，都在第二个参数中，详见前面解释
export const getMenu = (data) => http.get('/ebapi/public_api/index', data)

export const getTest = (data) => http.get('/test', data)
//邮箱测试
export const postEmail = (params, config = {}) => http.post('/mail', params, config)
//注册
export const postSignUp = (params, config = {}) => http.post('/signup/add', params, config)
//用户或邮箱是否占用判断
export const postJudgeValue = (params, config = {}) => http.post('/signup/judge', params, config)
//登录
export const postSignIn = (params, config = {}) => http.post('/signin/match', params, config)
//token测试
export const postTokenTest = (params, config = {}) => http.post('/signin/test', params, config)
//搜索用户
export const postSearchUser = (params, config = {}) => http.post('/search/user', params, config)
//判断是否为好友
export const postIsFriend = (params, config = {}) => http.post('/search/isfriend', params, config)
//用户详情
export const postUserDetail = (params, config = {}) => http.post('/user/detail', params, config)
//用户信息修改
export const postUserUpdate = (params, config = {}) => http.post('/user/update', params, config)
//好友申请
export const postApplyFriend = (params, config = {}) => http.post('/friend/applyfriend', params, config)
//更新好友状态，同意好友
export const postUpdateFriendState = (params, config = {}) => http.post('/friend/updatefriendstate', params, config)
//拒绝好友或删除好友
export const postDeleteFriend = (params, config = {}) => http.post('/friend/deletefriend', params, config)
//上传
export const upload = (params) => http.upload('/files/upload', params)
//获取好友
export const postGetFriend = (params, config = {}) => http.post('/index/getfriend', params, config)
//获取最后一条消息
export const postGetLastMsg = (params, config = {}) => http.post('/index/getlastmsg', params, config)
//汇总一对一消息未读数
export const postGetUnreadMsg = (params, config = {}) => http.post('/index/getunreadmsg', params, config)
//清除消息未读数
export const postClearUnreadMsg = (params, config = {}) => http.post('/index/clearunreadmsg', params, config)
//裁剪头像上传
export const uploadAvatar = (params, config = {}) => http.post('/avatar/upload', params, config)
//获取聊天一对一分页消息
export const getMsg = (params, config = {}) => http.post('/chat/msg', params, config)