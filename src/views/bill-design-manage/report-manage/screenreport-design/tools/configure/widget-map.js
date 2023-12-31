export const widgetMap = {
    code: 'widget-map',
    type: 'chart',
    label: '中国地图',
    icon: 'iconzhongguoditu',
    options: {
        setup: [{
            type: 'Input',
            label: '图层名称',
            name: 'layerName',
            required: false,
            placeholder: '',
            value: '迁徙图',
        }, ],
        data: [],
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
                value: 600,
            },
            {
                type: 'InputNumber',
                label: '高度',
                name: 'height',
                required: false,
                placeholder: '该容器在1080px大屏中的高度',
                value: 400,
            },
        ]
    }
}