import {
    baseImgUrl
} from '@/api/bill-design-manage/report-manage.js'
export const widgetImage = {
    code: 'widget-image',
    type: 'html',
    label: '图片',
    icon: 'icontupian',
    options: {
        // 配置
        setup: [{
                type: 'Input',
                label: '图层名称',
                name: 'layerName',
                required: false,
                placeholder: '',
                value: '图片',
            },
            {
                type: 'i-switch',
                label: '开启旋转',
                name: 'startRotate',
                required: false,
                placeholder: '',
                value: false,
            },
            {
                type: 'i-switch',
                label: '逆时针',
                name: 'anticlockwise',
                required: false,
                placeholder: '',
                value: false,
            },
            {
                type: 'InputNumber',
                label: '转速',
                name: 'rotate',
                required: false,
                placeholder: '',
                value: 12
            },
            {
                type: 'Slider',
                label: '透明度',
                name: 'transparency',
                required: false,
                placeholder: '',
                value: 100
            },
            {
                type: 'InputNumber',
                label: '圆角',
                name: 'borderRadius',
                required: false,
                placeholder: '',
                value: 0
            },
            {
                type: 'custom-upload',
                label: '图片地址',
                name: 'imageAdress',
                required: false,
                placeholder: '',
                value: baseImgUrl,
            },
            {
                type: 'vue-color',
                label: '背景颜色',
                name: 'background',
                required: false,
                placeholder: '',
            },
        ],
        // 数据
        data: [],
        // 坐标
        position: [{
                type: 'InputNumber',
                label: '左边距',
                name: 'left',
                required: false,
                placeholder: '',
                value: 0,
            },
            {
                type: 'InputNumber',
                label: '上边距',
                name: 'top',
                required: false,
                placeholder: '',
                value: 0,
            },
            {
                type: 'InputNumber',
                label: '宽度',
                name: 'width',
                required: false,
                placeholder: '该容器在1920px大屏中的宽度',
                value: 300,
            },
            {
                type: 'InputNumber',
                label: '高度',
                name: 'height',
                required: false,
                placeholder: '该容器在1080px大屏中的高度',
                value: 200,
            },
        ],
    }
}