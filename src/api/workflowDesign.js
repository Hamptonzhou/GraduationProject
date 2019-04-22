import config from './config'
const baseUrl = config.baseUrl

export default {
  /**####################################流程设计模块接口#################################### **/
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

  /**####################################我的工作模块接口#################################### **/
  //获取在办工作列表 TODO 查询当前用户
  getHanglingWorkList(page, rows, keyword, userId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/getMyWorkListBySearchText', {
      page: page,
      rows: rows,
      keyword: keyword,
      queryId: userId,
      searchText: 'HanglingWork'
    })
  },
  //获取办结工作列表 TODO 查询当前用户
  getFinishedWorkList(page, rows, keyword, userId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/getMyWorkListBySearchText', {
      page: page,
      rows: rows,
      keyword: keyword,
      queryId: userId,
      searchText: 'FinishedWork'
    })
  },
  //获取个人已办理的工作列表 TODO 查询当前用户
  getPersonalDoneWorkList(page, rows, keyword, userId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/getMyWorkListBySearchText', {
      page: page,
      rows: rows,
      keyword: keyword,
      queryId: userId,
      searchText: 'PersonalDoneWork'
    })
  },
  //获取流程状态图
  getProcessImage(processInstanceId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/getProcessImage', {
      queryId: processInstanceId
    })
  },
  //接办任务
  claimTask(taskId, userId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/claimTask', {
      taskId,
      userId
    })
  },
  //完成任务
  completeTask(taskId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/completeTask', {
      taskId
    })
  },
  //设置备注内容
  setRemarkContent(taskId, remarkContent) {
    return config.doPostPromise(baseUrl + '/CustomConteoller/setRemarkContent', {
      taskId,
      remarkContent
    })
  },
  //新增或修改业务定义
  saveOrUpdateBusinessDefinition(businessDefinition) {
    return config.doPostPromise(baseUrl + '/BusinessDefinitionController/saveOrUpdateBusinessDefinition', {
      businessName: businessDefinition.businessTitle,
      processDefinitionId: businessDefinition.useProcessId,
      processDefinitionName: businessDefinition.useProcessName,
      businessFormId: businessDefinition.useFormId,
      businessFormName: businessDefinition.useFormName,
      creatorId:businessDefinition.creatorId
    })
  },

  //设置业务定义中的备注内容
  setBusinessDefRemark(businessId, remarkContent) {
    return config.doPostPromise(baseUrl + '/BusinessDefinitionController/setBusinessDefRemark', {
      businessId,
      remarkContent
    })
  },

  //获取业务定义列表 TODO 查询当前用户
  getBusinessDefinitionList(page, rows, keyword, userId) {
    return config.doGetPromise(baseUrl + '/BusinessDefinitionController/getBusinessDefinitionList', {
      page: page,
      rows: rows,
      keyword: keyword,
      queryId: userId
    })
  },
  //删除业务定义
  deleteItem(itemId) {
    return config.doGetPromise(baseUrl + '/BusinessDefinitionController/deleteBusinessDefinitionByIds', {
      ids: itemId
    })
  },
  //获取流程实例的businessKey
  getBusinessFormId(processInstanceId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/getBusinessFormId', {
      processInstanceId
    })
  },
  //根据流程定义Id启动流程，同时绑定Business_Key
  startProcessDefinition(businessId) {
    return config.doGetPromise(baseUrl + '/CustomConteoller/startProcessDefinition', {
      businessId
    })
  },
  //获取可用流程数量
  getUseableProcessCount() {
    return config.doGetPromise(baseUrl + '/CustomConteoller/getProcessDefinitionCount')
  },
}
