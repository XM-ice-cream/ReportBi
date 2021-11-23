import { requestCenter } from '@/libs/request'
/* 零件 Api */
// 获取零件列表
export const getlistReq = data => {
    return requestCenter({
        url: '/api/materialcenter/v1/reel/getwithvendorlist',
        method: 'post',
        data
    })
}
