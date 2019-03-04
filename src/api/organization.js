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
    return config.doPostPromise(baseUrl + '/UserController/saveOrUpdateUser', UserInfo)
  },
  // 新增或修改部门或岗位的信息
  saveOrUpdateDepartment(DepartmentInfo) {
    return config.doPostPromise(baseUrl + '/DepartmentController/saveOrUpdateDepartment', DepartmentInfo)
  },
  // 获取所有部门名称的列表
  getDepartmentList(parentId) {
    return config.doGetPromise(baseUrl + '/DepartmentController/getDepartmentList', {
      parentId: parentId
    })
  },
  // 获取组织结构树
  getDepartmentTree() {
    return config.doGetPromise(baseUrl + '/DepartmentController/getDepartmentTree')
  },
  //获取选择部门下的人员
  loadUserList(selectedNodeId) {
    return config.doGetPromise(baseUrl + '/UserController/getUserByParentId', {
      queryId: selectedNodeId
    })
  }
}
