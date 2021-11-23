import { requestCenter } from '@/libs/request'
/* 聊天室接口
 */
// 获取联系人列表
export const getContactListReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/chatcontent/getcontactlist',
    method: 'post',
    data
  })
}

// 分页获取聊天内容表
export const getPageListReq = data => {
  return requestCenter({
    url: '/api/systemcenter/v1/chatcontent/getpagelist',
    method: 'post',
    data
  })
}

// 新增聊天内容
export const addReq = data => {
    return requestCenter({
      url: '/api/systemcenter/v1/chatcontent/add',
      method: 'post',
      data
    })
  }




