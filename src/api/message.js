import config from './config'
const baseUrl = config.baseUrl

export default {
  // 获取未读数量
  countUnreadMessage() {
    return config.doGetPromise(baseUrl + '/MessageController/countUnreadMessage', {
      userId: "zhou"
    })
  },
  // 获取已读、未读、广播消息、回收站列表数据
  //获取所有的未读个人消息列表 
  listUnreadMessage() {
    return config.doGetPromise(baseUrl + '/MessageController/listUnreadMessage', {
      queryId: "zhou"
    })
  },

  //获取所有的已读个人消息列表
  listReadedMessage() {
    return config.doGetPromise(baseUrl + '/MessageController/listReadedMessage', {
      queryId: "zhou"
    })
  },

  //获取所有的广播消息列表
  listBroadcastMessage() {
    return config.doGetPromise(baseUrl + '/MessageController/listBroadcastMessage');
  },

  //获取所有已删除的个人消息列表
  listTrashMessage() {
    return config.doGetPromise(baseUrl + '/MessageController/listTrashMessage', {
      queryId: "zhou"
    });
  },
}
