import config from './config'
const baseUrl = config.baseUrl

export default {
  // 获取未读数量
  countUnreadMessage() {
    return config.doGetPromise(baseUrl + '/MessageController/countUnreadMessage', {
      userId: "zhou"
    })
  },
  //获取已读、未读、广播消息、回收站列表数据
  messageInit() {
    //获取所有的未读个人消息列表
    var unreadList = []
    unreadList = config.doGetPromise(baseUrl + '/MessageController/listUnreadMessage', {
      queryId: "zhou"
    });

    //获取所有的已读个人消息列表
    var readedList = []
    readedList = config.doGetPromise(baseUrl + '/MessageController/listReadedMessage', {
      queryId: "zhou"
    });

    //获取所有的广播消息列表
    var broadcastList = []
    broadcastList = config.doGetPromise(baseUrl + '/MessageController/listbroadcastMessage');

    //获取所有已删除的个人消息列表
    var trashList = []
    trashList = config.doGetPromise(baseUrl + '/MessageController/listTrashMessage', {
      queryId: "zhou"
    });
    console.log(unreadList, readedList, broadcastList, trashList)
    return {
      unreadList,
      readedList,
      broadcastList,
      trashList

    }
  }
}
