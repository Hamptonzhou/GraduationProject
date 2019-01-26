import config from './config'
const baseUrl = config.baseUrl

export default {
  // 验证登陆名是否存在
  checkLoginNameExist(loginName) {
    return config.doPostPromise(baseUrl + '/UserController/checkLoginNameExist', {
      loginName: loginName,
    })
  },
  //新增或修改员工信息
  saveOrUpdateUser(UserInfo) {
    console.log("js" + UserInfo)
    return config.doPostPromise(baseUrl + '/UserController/saveOrUpdateUser', UserInfo)
  }
}
