import { requestCenter } from '@/libs/request'

// 获取导航菜单
export const getlisttreecurrentuserReq = data => {
  return requestCenter({
    url: '/menubutton/getlisttreecurrentuser',
    method: 'post',
    data
  })
}

// 获取左侧菜单
export const getlisttreeauthReq = data => {
  return requestCenter({
    url: '/menubutton/getlisttreeauth',
    method: 'post',
    data
  })
}

// 获取分页菜单、按钮
export const getpagelisttreeReq = data => {
  return requestCenter({
    url: '/menubutton/getpagelisttree',
    method: 'post',
    data
  })
}

// 新增菜单、按钮
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/menubutton/add',
    method: 'post',
    data
  })
}

// 修改菜单、按钮
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/menubutton/modify',
    method: 'put',
    data
  })
}

// 上传文件
export const uploadFileReq = data => {
  return requestCenter({
    loading: true,
    url: '/assets/upload',
    method: 'post',
    data
  })
}
