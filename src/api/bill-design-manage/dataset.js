import {
    requestCenter
} from '@/libs/request'
// resultset
export function dataSetPreview(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: `/dataSet/detailBysetId/${data.id}`,
        method: 'get',
    })
}

export function addDataSet(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/dataSet',
        method: 'post',
        data,
    })
}
export function editDataSet(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/dataSet',
        method: 'put',
        data,
    })
}
// delete dataset
export function deleteDataSet(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/dataSet/' + data.id,
        method: 'delete',
        data,
    })
}
// 下拉数据源
export function queryAllDataSourceSet(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/dataSource/queryAllDataSource',
        method: 'get',
        data,
    })
}
// 数据集高级规则js验证
export function verificationSet(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/dataSetParam/verification',
        method: 'post',
        data,
    })
}
// 测试数据转换，以及返回数据table列表
export function testTransformSet(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/dataSet/testTransform',
        method: 'post',
        data,
    })
}

// report
export function reportPageList(params) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/report/pageList',
        method: 'get',
        params,
    })
}
// report
export function addReport(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/report',
        method: 'post',
        data,
    })
}

// report
export function editReport(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/report',
        method: 'put',
        data,
    })
}

// report
export function delReport(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/report/delReport',
        method: 'delete',
        data,
    })
}

// report
export function detailReport(id, accessKey) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: `/report/${id}?accessKey=${accessKey}`,
        method: 'get',
    })
}

// reportExcel
export function addReportExcel(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/reportExcel',
        method: 'post',
        data,
    })
}

// reportExcel
export function editReportExcel(data) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/reportExcel',
        method: 'put',
        data,
    })
}
// /dataSet/pageList
export function dataSetPageList(params) {
    return requestCenter({
        timeout: 0,
        baseUrl: window.localStorage.getItem("reportip"),
        url: '/dataSet/pageList',
        method: 'GET',
        params,
    })
}