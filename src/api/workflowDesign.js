import config from './config'
const baseUrl = config.baseUrl

export default {
  // 打开流程编辑器
  showWorkflowDesignPage() {
    return config.doGetPromise(baseUrl + '/model/new')
  }
}
