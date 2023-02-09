// 请求接口封装
const querystring = require('querystring')
import axios from 'axios'
import i18n from "../locale"
import {
  userLocalInfo
} from "./utils"
import {
  Message,
  Spin,
  Modal
} from 'view-design'

// 接口请求状态码
const _status = {
  400: i18n.t('err400'),
  401: i18n.t('err401'),
  404: i18n.t('err404'),
  999: i18n.t('err999')
}

const ignoreRecordUrlList = ['/api/reportcenter/v1/usagerecord/addusagerecord']
// 错误返回值处理
const errorInfo = ({
  loading
}, {
  config,
  data,
  status,
  statusText
}) => {
  // 错误信息
  const info = {
    error: data.error,
    error_description: data.error_description,
    status: status,
    statusText: _status[status] || statusText
  }
  // 忽略的接口
  const ignoreUrlList = ['/api/systemcenter/v1/errorrecord/add', '/api/usercenter/v1/user/getheadicon']

  if (loading) Spin.hide()

  if (!ignoreUrlList.includes(config.url)) {
    // 401提示
    if (status === 401) {
      return Modal.error({
        title: 401,
        content: info.statusText,
        onOk: () => {
          window.$Vue.$store.dispatch('handleLogOut').then(() => {})
          window.location.reload()
        }
      })
    }

    // 非400提示
    info.status !== 400 && Message.error({
      content: `${info.status === 999 ? '' : status} ${info.statusText}`,
      duration: 10,
      closable: true,
    })

    // 提交错误记录
    let {
      baseURL,
      url,
      method,
      data,
      params,
      headers: {
        Authorization
      }
    } = config
    const payload = {
      baseUrl: baseURL,
      url,
      method,
      data,
      params,
      Authorization,
      status,
      errorCode: status,
      errorCodeMsg: null,
      message: null,
      result: null
    }
    window.$Vue.$store.dispatch('handleErrorRecord', payload).then(() => {})
  }
  return info
}

// 通用请求配置
export function requestCenter(params) {
  //timeout 指定请求超时的毫秒数(0 表示无超时时间)
  const instance = axios.create({
    timeout: params.timeout === 0 ? params.timeout : (1000 * 20),
    baseURL: params.baseUrl || window.localStorage.getItem("configip")
  })

  // axios拦截器
  instance.interceptors.request.use(config => {
    if (params.loading) Spin.show()
    // 在这里可以添加一些请求信息，比如配置header，验证令牌等
    if (params.reqType && params.reqType === 'FormData') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      config.transformRequest = [function (data) {
        return querystring.stringify(data)
      }]
    } else if (params.reqType && params.reqType === 'FormDataTv') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    } else {
      config.headers['Content-Type'] = 'application/json; charset=UTF-8'
    }
    //如果有传的token取传的值
    config.headers['Authorization'] = `Bearer ${(params.data && params.data.tokenStr) || userLocalInfo().token}`
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    if (config.method === 'get' && config.params) {
      for (let item in config.params) {
        if (typeof config.params[item] === 'string') {
          config.params[item] = config.params[item].trim()
        }
      }
    } else if (config.data) {
      if (config.data.data) {
        for (let item in config.data.data) {
          if (typeof config.data.data[item] === 'string') {
            let itemValue = config.data.data[item].trim()
            //当前字段是否模糊查询
            let isFuzzyKey = config.data.isFuzzyKey && config.data.isFuzzyKey.includes(item)
            //判断 当前字段值不为 "" && 当前字段是模糊查询
            config.data.data[item] = itemValue && isFuzzyKey ? itemValue + '∞' : itemValue
          }
        }
        //删除 isFuzzyKey 字段
        delete config.data.isFuzzyKey
      } else {
        for (let item in config.data) {
          if (typeof config.data[item] === 'string') {
            let itemValue = config.data[item].trim()
            //当前字段是否模糊查询
            let isFuzzyKey = config.data.isFuzzyKey && config.data.isFuzzyKey.includes(item)
            //判断 当前字段值不为 "" && 当前字段是模糊查询
            config.data[item] = itemValue && isFuzzyKey ? itemValue + '∞' : itemValue
          }
        }
        //删除 isFuzzyKey 字段
        delete config.data.isFuzzyKey
      }
    }
    if (params.url && params.url.startsWith("/api/reportcenter") && !ignoreRecordUrlList.includes(params.url)) {
      let obj = {
        ip: '',
        apiUrl: params.url
      };
      let request = addUsageRecordReq(obj);
      request.then((res) => {});
    }
    return config
  }, error => {
    if (params.loading) Spin.hide()
    return error
  })

  instance.interceptors.response.use(res => {
    // 响应成功
    if (params.loading) Spin.hide()
    const {
      status,
      config: {
        baseURL,
        url,
        method,
        headers: {
          Authorization
        }
      }
    } = res
    if (res.config.responseType) return res.data
    return {
      ...res.data,
      status,
      baseUrl: baseURL,
      url,
      method,
      data: res.config.data,
      params: res.config.params,
      Authorization,
      resData: {
        ...res.data
      }
    }
  }, error => {
    // 响应失败
    if (error.response) {
      return Promise.reject(errorInfo(params, error.response))
    } else {
      if (params.loading) Spin.hide()
      if (error.request.status === 0) {
        Message.error({
          content: i18n.t('errNetwork'),
          duration: 10,
          closable: true,
        })
      }
      return Promise.reject(error.request)
    }
  })

  return instance(params)
}
export const addUsageRecordReq = data => {
  return requestCenter({
    timeout: 0,
    baseUrl: window.localStorage.getItem("reportip"),
    url: '/api/reportcenter/v1/usagerecord/addusagerecord',
    method: 'post',
    data
  })
}