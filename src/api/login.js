import config from './config'
const baseUrl = config.baseUrl

import axios from 'axios'

export default {
  // 登陆
  login(data) {
    return config.doPostPromise(baseUrl + '/LoginController/login', data)
  },
  //退出登陆
  logout() {
    return config.doGetPromise(baseUrl + '/LoginController/logout')
  },

  //获取用户信息
  getUserInfo() {

  },
}
