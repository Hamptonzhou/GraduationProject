import config from './config'
const baseUrl = config.baseUrl

export default {
  // 打开流程编辑器
  showWorkflowDesignPage() {
    return config.doGetPromise(baseUrl + '/model/new')
  },
  //获取流程定义树
  getProcessDefinitionTree() {
    return config.doGetPromise(baseUrl + '/CustomConteoller/getProcessDefinitionTree')
  },
  //获取模型的图片
  getModelImage(modelId) {
    return config.doGetPromise(baseUrl + '/model/getImageByModelId', {
      modelId: modelId
    })
  },
  //获取流程定义图片
  getProcessDefinitionImage(processDefinitionId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/getProcessDefinitionImage', {
      processDefinitionId: processDefinitionId
    })
  },
  //返回模型编辑页面地址
  showModelEditPage(modelId) {
    return config.doGetPromise(baseUrl + '/model/showModelEditPage', {
      modelId: modelId
    })
  },
  //发布模型
  deployment(modelId) {
    return config.doGetPromise(baseUrl + '/model/deployment', {
      modelId: modelId
    })
  },
  //删除模型
  deleteModelById(modelId) {
    return config.doGetPromise(baseUrl + '/model/deleteModelById', {
      modelId: modelId
    })
  },
  //删除流程定义
  deleteDeploymentProcessDefinitionById(processDefinitionId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/deleteDeploymentProcessDefinitionById', {
      processDefinitionId: processDefinitionId
    })
  },
  //管理员级联删除流程定义
  cascadeDeleteDeployment(processDefinitionId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/cascadeDeleteDeployment', {
      processDefinitionId: processDefinitionId
    })
  },
}
