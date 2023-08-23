import {
  requestCenter
} from '@/libs/request'

// 获取用户信息
export const getcurrentuserReq = data => {
  return requestCenter({
    url: '/user/getcurrentuser',
    method: 'post',
    data
  })
}

// 用户退出登录
export const userofflineReq = data => {
  return requestCenter({
    url: '/user/useroffline',
    method: 'post',
    data
  })
}

// 查询用户
export const getpagelistReq = data => {
  return requestCenter({
    url: '/user/getpagelist',
    method: 'post',
    data
  })
}

// 获取工单信息表分页数据
export const userPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/usercenter/v1/user/getpagelist`

// 获取角色用户信息
export const getrolerbyuserlistReq = data => {
  return requestCenter({
    url: '/user/getrolerbyuserlist',
    method: 'post',
    data
  })
}

// 新增角色
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/user/add',
    method: 'post',
    data
  })
}

// 修改角色
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/user/modify',
    method: 'put',
    data
  })
}

// 永不过期
export const neverexpReq = data => {
  return requestCenter({
    loading: true,
    url: '/user/neverexp',
    method: 'put',
    data
  })
}

// 重置密码
export const resetpasswordReq = data => {
  return requestCenter({
    loading: true,
    url: '/user/resetpassword',
    method: 'put',
    data
  })
}

// 修改密码
export const updatepasswordReq = data => {
  return requestCenter({
    loading: true,
    url: '/user/updatepassword',
    method: 'put',
    data
  })
}

// 上传用户头像 (没用引用)
export const uploadheadiconReq = data => {
  return requestCenter({
    url: '/user/uploadheadicon',
    method: 'post',
    data
  })
}

// 上传用户头像
export const getheadiconReq = data => {
  return requestCenter({
    url: '/user/getheadicon',
    responseType: 'arraybuffer',
    method: 'get',
    params: {
      ...data
    }
  })
}

// 获取首页信息
export const getindexjsonReq = data => {
  return requestCenter({
    url: '/user/getindexjson',
    method: 'get',
    params: {
      ...data
    }
  })
}

// 获取用户IP地址
export const getReq = data => {
  return requestCenter({
    url: '/user/getip',
    method: 'get',
    params: {
      ...data
    }
  })
}

// 上传用户头像
export const uploadHeadIcon =()=> `${window.localStorage.getItem("configip")}/ftpfile/uploadheadicon`

// 通讯授权新增
export const chatauthorizationAddReq = data => {
  return requestCenter({
    url: '/chatauthorization/add',
    method: 'post',
    data
  })
}

// 通讯授权查询
export const chatauthorizationGetReq = data => {
  return requestCenter({
    url: '/chatauthorization/get',
    method: 'get',
    params: data
  })
}

// 获取单个角色用户信息
export const getUserReq = data => {
  return requestCenter({
    url: '/user/getuser',
    method: 'post',
    data
  })
}
