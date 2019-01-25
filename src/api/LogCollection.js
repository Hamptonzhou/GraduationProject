// import config from '../config'
// const baseUrl = config.baseUrl
import config from './config'
const baseUrl = config.baseUrl

export default {
  // 获取分页列表
  getOperationLogList (page, rows, startDate, endDate, keyword) {
    console.log(baseUrl)
    return config.doGetPromise(baseUrl + '/LogAnalyseController/getOperationLogList', {
      page: page,
      rows: rows,
      startDate: startDate,
      endDate: endDate,
      keyword: keyword
    })
  }
}