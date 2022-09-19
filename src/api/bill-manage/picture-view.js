import {
    requestCenter
} from '@/libs/request'
/* 锦溪图片查看 接口 */

// 分页获取
export const getpagelistReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/pictureview/getpagelist',
        method: 'post',
        data
    })
}
// 下载图片
export const downPictureReq = data => {
    return requestCenter({
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/api/reportcenter/anonymous/v1/pictureview/downpicture',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}