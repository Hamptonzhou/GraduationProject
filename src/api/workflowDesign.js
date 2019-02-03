import config from './config'
const baseUrl = config.baseUrl

export default {
  // 打开流程编辑器
  showWorkflowDesignPage() {
    return config.doGetPromise(baseUrl + '/model/new')
  },
  // 获取所有模型数据
  getAllModel() {
    return config.doGetPromise(baseUrl + '/model/list')
  },

}
