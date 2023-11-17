/**
 * 通用请求工具类封装
 *
 * @author starter
 * @date 2023/4/8 10:47
 */
import request from './request'

export default class RequestUtil {
  /**
   * get请求
   *
   * @author Starter
   * @date 2022/4/8 10:50
   */
  static async get(url, params) {
    if (params === undefined) {
      params = {}
    }
    let result = await request.get(url, {params})
    return result
  }

  /**
   * get请求并获取数据
   *
   * @author Starter
   * @date 2022/4/8 10:50
   */
  static async getAndLoadData(url, params) {
    let result = await this.get(url, params)
    return result.data
  }

  /**
   * post请求
   *
   * @author Starter
   * @date 2022/4/8 10:50
   */
  static async post(url, params) {
    if (params === undefined) {
      params = {}
    }
    return request.post(url, params)
  }

  /**
   * post请求并获取数据
   *
   * @author Starter
   * @date 2022/4/8 10:50
   */
  static async postAndLoadData(url, params) {
    let result = await this.post(url, params)
    return result.data
  }

}
