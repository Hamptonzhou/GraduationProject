import axios from 'axios'
import qs from 'qs'

// const baseUrl = 'http://localhost:9600'
/*  process.env.NODE_ENV === 'development' ?
 'http://172.16.10.132:8092' :
 process.env.NODE_ENV === 'release' ?
 'http://www.south-smart.com/smartwebservice/' :
 'http://172.16.10.132:8092' */


const CancelToken = axios.CancelToken
let cancel

const config = {

  // 请求后台接口的基础路径
  baseUrl: 'http://localhost:9600',

  /**
   * get获取数据，通用方法
   * @param {String} url
   * @param {Object} params
   * @param {Object} options
   */
  doGetPromise(url, params, options = {}) {
    let {
      timeout = 30000, ...arg
    } = options

    return new Promise((resolve, reject) => {
      axios.get(url, {
        timeout: timeout,
        ...arg,
        params: params,
        cancelToken: new CancelToken(function executor(c) {
          cancel = c
        })
      }).then(response => {
        //返回res.data处理，否则在API获取数据的时候，需要按照res.data.data获取
        resolve(response.data)
      }).catch(response => {
        // console.error('ajax error:', response)
        reject(response)
      })
    })
  },


  /**
   * 默认方式提交from表单数据
   * @param {String} url
   * @param {Object} data
   */
  doPostPromise(url, data) {
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(data), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        cancelToken: new CancelToken(function executor(c) {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      }).catch(res => {
        // console.log('post error:', res)
        reject(res)
      })
    })
  }
}
export default config
