export const widgetVideo = {
    code: 'widget-video',
    type: 'html',
    label: '视频',
    icon: 'iconshipin',
    options: {
        // 配置
        setup: [{
                type: 'Input',
                label: '图层名称',
                name: 'layerName',
                required: false,
                placeholder: '',
                value: 'video',
            },
            {
                type: 'Input',
                label: '地址',
                name: 'videoAdress',
                required: false,
                placeholder: '',
                value: 'https://www.w3school.com.cn//i/movie.ogg',
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