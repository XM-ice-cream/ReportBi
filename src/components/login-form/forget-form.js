import { requestCenter } from '@/libs/request'
/* 忘记密码 接口 */

export const resetpasswordReq = data => {
    return requestCenter({
        loading: true,
        url: '/api/usercenter/anonymous/v1/anonymoususer/resetpasswordwithidcard',
        method: 'post',
        data
    })
}