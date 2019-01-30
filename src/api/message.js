import config from './config'
const baseUrl = config.baseUrl

import axios from 'axios'

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

  //根据消息id获取指定的消息体
  getContentByMsgId(msg_id) {
    return axios.get(baseUrl + '/MessageController/getContentByMsgId', {
      params: {
        userId: "zhou",
        messageItemIds: msg_id
      }
    })
    // return config.doGetPromise(baseUrl + '/MessageController/readMessage', {
    //   userId:"zhou",
    //   messageItemIds: msg_id
    // })
  },

  //点击消息，进行查看后，将消息的状态设置成已读
  hasRead(msg_id) {
    return axios.get(baseUrl + '/MessageController/setHasRead', {
      params: {
        userId: "zhou",
        messageItemIds: msg_id
      }
    })
  },

  //删除消息，即把消息删除标志设置成1，把消息放入回收站即可
  deletePersonalMessage(msg_id) {
    return axios.get(baseUrl + '/MessageController/deletePersonalMessage', {
      params: {
        userId: "zhou",
        messageItemIds: msg_id
      }
    })
  },

  //将回收站的消息恢复到已读消息，修改删除标志为0即可
  restoreDeleteMessage(msg_id) {
    return axios.get(baseUrl + '/MessageController/restoreDeleteMessage', {
      params: {
        userId: "zhou",
        messageItemIds: msg_id
      }
    })
  }

}
