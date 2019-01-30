import {
  login,
  logout,
  getUserInfo,
  // getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  // getUnreadCount
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'

import messageApi from "@/api/message.js";

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageBroadcastList:[],
    messageContentStore: {}
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    },
    setMessageBroadcastList (state, list) {
      state.messageBroadcastList = list
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length,
    messagebroadcastCount: state => state.messageBroadcastList.length,
  },
  actions: {
    // 未使用，页面上的未读条数是通过getters中的messageUnreadCount获取的。分析错误！
    // 浏览器上报错找不到该定义，说明该方法被某个文件引用了。细查可知：在main.vue中引用。在头像下拉中显示的是改未读消息的数量。
    // 好处：打开首页可知未读数量，但是并未加载未读、已读、回收站的实体列表。仅当打开消息中心时，才进行加载实体。

    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
        messageApi.countUnreadMessage().then(res => {
        commit('setMessageCount', res.data)
      })
    },
    // 初始化时，立刻被调用。获取了三种消息的列表实体，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      messageApi.listUnreadMessage().then(res => {
        if(res.status===0){
          const unreadList = res.data.rows
          commit('setMessageUnreadList', unreadList.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
        }else{
          console.log("else-获取未读消息列表失败")
        }
      }).catch(err=>{
        console.log("catch-获取未读消息列表失败")
      })

      messageApi.listReadedMessage().then(res => {
        if(res.status===0){
          const readedList = res.data.rows
          commit('setMessageReadedList', readedList.map(_ => {_.loading = false; return _ }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
        }else{
          console.log("else-获取已读消息列表失败")
        }
        }).catch(err=>{
          console.log("catch-获取已读消息列表失败")
        })

      messageApi.listBroadcastMessage().then(res => {
        if(res.status===0){
        const broadcastList = res.data.rows
        commit('setMessageBroadcastList', broadcastList.map(_ => { _.loading = false; return _}).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
        }else{
          console.log("else-获取广播消息列表失败")
        }
      }).catch(err=>{
        console.log("catch-获取广播消息列表失败")
      })

      messageApi.listTrashMessage().then(res => {
        if(res.status===0){
          const trashList = res.data.rows
        commit('setMessageTrashList', trashList.map(_ => { _.loading = false; return _}).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
        }else{
          console.log("else-获取回收站消息列表失败")
        }
      }).catch(err=>{
        console.log("catch-获取回收站消息列表失败")
      })
         
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
       return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          messageApi.getContentByMsgId(msg_id).then(res => {
            const content = res.data.data.content
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        messageApi.hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
        // 登录
    handleLogin ({ commit }, {userName, password}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data
          commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            commit('setAvator', data.avator)
            commit('setUserName', data.name)
            commit('setUserId', data.user_id)
            commit('setAccess', data.access)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
  }
}
