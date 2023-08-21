import {
    widgetTool
} from "./main"
const screenConfig = {
    code: 'screen',
    type: 'screen',
    label: '大屏设置',
    icon: '',
    options: {
        setup: [{
                type: 'InputNumber',
                label: '大屏宽度',
                name: 'width',
                required: false,
                placeholder: 'px',
                value: 1920,
            },
            {
                type: 'InputNumber',
                label: '大屏高度',
                name: 'height',
                required: false,
                placeholder: 'px',
                value: 1080,
            },
            {
                type: 'Input',
                label: '标题',
                name: 'title',
                require: false,
                placeholder: '',
                value: '大屏',
            },
            {
                // Input-textarea
                type: 'InputTextarea',
                label: '大屏简介',
                name: 'description',
                required: false,
                placeholder: '',
            },
            {
                type: 'vue-color',
                label: '背景颜色',
                name: 'backgroundColor',
                required: false,
                placeholder: '',
                value: '#000',
            },
            {
                type: 'custom-upload',
                label: '图片地址',
                name: 'backgroundImage',
                required: false,
                placeholder: '',
                value: '',
            },
        ],
        data: [],
        position: [],
    }
}
const widgetTools = [
    ...widgetTool
]

const getToolByCode = function (code) {
    // 获取大屏底层设置属性
    if (code == 'screen') {
        return screenConfig
    }
    // 获取组件
    let item = widgetTools.find(function (item, index, arrs) {
        return item.code === code
    })
    return item
}

export {
    widgetTools,
    getToolByCode
}