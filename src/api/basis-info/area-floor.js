import { requestCenter } from '@/libs/request'

// 获取区域/楼层/线体树型数据
export const getlisttreeReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/areafloorline/getlisttree',
    method: 'post',
    data
  })
}

// 获取分页区域/楼层/线体
export const getpagelisttreeReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/areafloorline/getpagelisttree',
    method: 'post',
    data
  })
}
// 分页查询
export const areaPageListUrl =()=> `${window.localStorage.getItem("configip")}/api/systemcenter/v1/areafloorline/getpagelisttree`

// 获取用户授权下的区域/楼层/线体信息
export const getlisttreeauthReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/areafloorline/getlisttreeauth',
    method: 'post',
    data
  })
}
// 获取权限下所有父级下的某个类别的信息【区域/楼层/线体信息】
export const getlistauthbyparentReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/areafloorline/getlistauthbyparent',
    method: 'post',
    data
  })
}


//获取用户授权下楼层
export const getfloorlistReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/areafloorline/getfloorlist',
    method: 'post',
    data
  })
}

//获取楼层列表	查询使用
export const getfloorReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/areafloorline/getfloor',
    method: 'post',
    data
  })
}
//获取区域、楼层、线体列表	查询使用不带权限
export const getAreaFloorLineListReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/areafloorline/getareafloorlinelist',
    method: 'post',
    data
  })
}


// 新增区域/楼层/线体
export const addReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/areafloorline/add',
    method: 'post',
    data
  })
}

// 修改区域/楼层/线体
export const modifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/systemcenter/v1/areafloorline/modify',
    method: 'put',
    data
  })
}

// 新增区域/楼层/线体授权
export const floorlineauthorizeaddReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/usercenter/v1/areafloorlineauthorize/add',
    method: 'post',
    data
  })
}

// 修改区域/楼层/线体授权
export const floorlineauthorizemodifyReq = data => {
  return requestCenter({
    loading: true,
    url: '/api/usercenter/v1/areafloorlineauthorize/modify',
    method: 'put',
    data
  })
}
