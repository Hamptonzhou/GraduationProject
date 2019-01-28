import Mock from 'mockjs'
import {
  doCustomTimes
} from '@/libs/util'
const Random = Mock.Random

//多功能表格数据
export const getTableData = req => {
  let tableData = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      createTime: '@date'
    }))
  })
  return tableData
}
