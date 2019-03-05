import config from './config'
const baseUrl = config.baseUrl

export default {
  // 保存表单的json数据
  saveFormData(formName, formData) {
    return config.doPostPromise(baseUrl + '/FormController/saveFormData', {
      formName,
      formData
    })
  },
  // 获取表单实体对象
  getFormDataById(formDataId) {
    return config.doGetPromise(baseUrl + '/FormController/getFormDataById', {
      formDataId
    })
  },
}
