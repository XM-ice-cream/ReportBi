import {
    requestCenter
} from '@/libs/request'
/*  SIP 包装箱号核验 */

//  SIP 包装箱号核验
export const checkBoxNoReq = data => {
    return requestCenter({
        baseUrl: "http://10.32.44.112:5700" || window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/sippacagecheck/getsndetail',
        method: 'post',
        loading: true,
        data
    })
}