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
                value: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.pptjia.com%2Fimage%2F20190902%2F5014c164c90b8e20726363b718939681.jpg&refer=http%3A%2F%2Fimg.pptjia.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651913631&t=e0f460f526a4ec2390cd74f3a3873054',
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