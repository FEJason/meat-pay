import axios from "axios"
import router from '@/router'
import store from '@/store'
import { Notice } from 'view-design'

Notice.config({
  top: 70
})

// 创建一个错误
// function errorCreate(msg) {
//   const error = new Error(msg)
//   errorLog(error)
//   throw error
// }

// 提示错误
function errorLog(msg) {
  Notice.error({
    title: '提示',
    desc: msg,
    duration: 5,
  })
}
// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  // headers:{"Content-Type": "multipart/form-data"},
  timeout: 120000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    const token = localStorage.token
    // const lang = localStorage.LANGUAGE
    const lang = store.state.lang

    token && (config.headers.Authorization = 'Bearer ' + token)
    // token && (config.headers.Authorization = 'bearer 90309d0f-2954-4c0a-8b5c-c97819c42c85')
    lang && (config.headers['Accept-Language'] = lang)

    // config 是我们自己定义的字段
    // let params = {
    //   id: 123,
    //   name: 'abc',
    // }
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {

    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 这个状态码是和后端约定的
    const code = dataAxios.code

    // 根据 code 进行判断
    if (code === undefined) {
      return dataAxios
    } else {
      switch (code) {
        // 根据后端接口定义
        // 正确的code
        case 0:
          return dataAxios.data
        // token失效，跳转到登录页，提示
        case 424:
          // router.push('/login')
          // errorLog('登陆失效，请重新登陆')
          break
        default:
          // 不是正确的 code 提示
          errorLog(dataAxios.msg)
          // 抛出错误，在 axios.().catch(err) 中可以获取回调数据
          return Promise.reject(dataAxios)
      }
    }
  },
  // 非200 的状态码
  error => {
    if (error && error.response) {
      // 状态码
      let status = error.response.status
      // 接口返回的 data
      let data = error.response.data

      if (status == 424) {
        errorLog(data.msg || status)
        router.push('/login')
        localStorage.clear()
        store.commit("SET_ISLOGIN", false)
        return Promise.reject(data)
      }

      if (status !== 200 || data.code === 1) {
        errorLog(data.msg || status)
        return Promise.reject(data)
      }

      switch (error.response.status) {
        // case 400: error.message = '请求错误'; break
        // case 401: error.message = '未授权，请登录'; break
        // case 403: error.message = '拒绝访问'; break
        // case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        // case 408: error.message = '请求超时'; break
        // case 500: error.message = '服务器内部错误'; break
        // case 501: error.message = '服务未实现'; break
        // case 502: error.message = '网关错误'; break
        // case 503: error.message = '服务不可用'; break
        // case 504: error.message = '网关超时'; break
        // case 505: error.message = 'HTTP版本不受支持'; break
        case 424:
          error.message = '请先登录';
          errorLog(error.message)
          break
        default: break
      }
    }

    return Promise.reject(error)
  }
)

export default service
