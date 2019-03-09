import config from './config'
const baseUrl = config.baseUrl

export default {
  // 保存表单的json数据，直接定义一个对象传递到后台进行映射，但是需要注意，BusinessFormData对象不需要使用{}括起来
  saveFormData(BusinessFormData) {
    return config.doPostPromise(baseUrl + '/FormController/saveOrUpdateFormData', BusinessFormData)
  },
  // 获取表单实体对象
  getFormDataById(formDataId) {
    return config.doGetPromise(baseUrl + '/FormController/getFormDataById', {
      formDataId
    })
  },
  // 获取所有表单实体对象
  getAllFormData() {
    return config.doGetPromise(baseUrl + '/FormController/getAllFormData')
  },
}
