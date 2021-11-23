import {requestCenter} from '@/libs/request'
/* input投入站 接口 */

// 新增
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/inputreel/add',
    method: 'post',
    data
  })
}

// 新增BE段投入站信息,可以用于其他逻辑相同的投入站
export const addbeReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/v1/inputreel/addbe',
    method: 'post',
    data
  })
}

// 获取产出资料表
export const getlistReq = data => {
  return requestCenter({
    url: '/api/workflowcenter/v1/sncount/getlist',
    method: 'post',
    data
  })
}

// 新增MiniLed SMT段投入站信息
export const addMiniLedReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/anonymous/v1/trackgo/input',
    method: 'post',
    data
  })
}

// 新增D01投入站信息
export const addD01Req = data => {
  return requestCenter({
    loading: true,
    url: '/api/workflowcenter/anonymous/v1/trackgo/input_d01',
    method: 'post',
    data
  })
}