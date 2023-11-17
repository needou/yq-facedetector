/**
 * axios 实例
 */
import axios from 'axios'

const service = axios.create({
  baseURL: ''
})

/**
 * 处理错误响应
 */
const processErrorResponse = function (response) {
  return Promise.reject(response.data)
}

/**
 * 添加请求拦截器
 */
service.interceptors.request.use(
  config => {
    // 添加 token 到 header
    //config.headers.common[TOKEN_HEADER_NAME] = token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 添加响应拦截器
 */
service.interceptors.response.use(
  res => {
    // 处理响应错误，请求异常自动提示错误信息，如果是B0301就跳转到登录界面
    return res.data
  },
  error => {
    // 处理响应错误
    return processErrorResponse(error.response)
  }
)

export default service
