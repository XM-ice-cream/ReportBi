export const widgetMarquee = {
    code: 'widget-marquee',
    type: 'html',
    label: '滚动文本',
    icon: 'iconhengxiangwenzi',
    options: {
        // 配置
        setup: [{
                type: 'Input',
                label: '图层名称',
                name: 'layerName',
                required: false,
                placeholder: '',
                value: '跑马灯',
            },
            {
                type: 'Input',
                label: '文本内容',
                name: 'text',
                required: false,
                placeholder: '',
                value: '滚动文本',
            },
            {
                type: 'InputNumber',
                label: '字体大小',
                name: 'fontSize',
                required: false,
                placeholder: '',
                value: 26,
            },
            {
                type: 'vue-color',
                label: '字体颜色',
                name: 'color',
                required: false,
                placeholder: '',
                value: '#FAD400',
            },
            {
                type: 'InputNumber',
                label: '字体间距',
                name: 'letterSpacing',
                required: false,
                placeholder: '',
                value: 0,
            },
            {
                type: 'vue-color',
                label: '字体背景',
                name: 'background',
                required: false,
                placeholder: '',
                value: 'rgba(115,170,229,.5)',
            },
            {
                type: 'Select',
                label: '文字粗细',
                name: 'fontWeight',
                required: false,
                placeholder: '',
                selectOptions: [{
                        code: 'normal',
                        name: '正常'
                    },
                    {
                        code: 'bold',
                        name: '粗体'
                    },
                    {
                        code: 'bolder',
                        name: '特粗体'
                    },
                    {
                        code: 'lighter',
                        name: '细体'
                    }
                ],
                value: 'normal'
            },
            /*        {
                      type: 'InputNumber',
                      label: '滚动速度',
                      name: 'jScrollPane',
                      //required: false,
                      placeholder: '',
                      value: '50',
                    }*/
        ],
        // 数据
        data: [{
                type: 'RadioGroup',
                label: '数据类型',
                name: 'dataType',
                require: false,
                placeholder: '',
                selectValue: true,
                selectOptions: [{
                        code: 'staticData',
                        name: '静态数据',
                    },
                    {
                        code: 'dynamicData',
                        name: '动态数据',
                    },
                ],
                value: 'staticData',
            },
            {
                type: 'InputNumber',
                label: '刷新时间(毫秒)',
                name: 'refreshTime',
                relactiveDom: 'dataType',
                relactiveDomValue: 'dynamicData',
                value: 3600000
            },
            {
                type: 'Button',
                label: '静态数据',
                name: 'staticData',
                required: false,
                placeholder: '',
                relactiveDom: 'dataType',
                relactiveDomValue: 'staticData',
                value: '文本框',
            },
            {
                type: 'dycustComponents',
                label: '',
                name: 'dynamicData',
                required: false,
                placeholder: '',
                relactiveDom: 'dataType',
                relactiveDomValue: 'dynamicData',
                chartType: 'widget-text',
                dictKey: 'TEXT_PROPERTIES',
                value: '',
            }
        ],
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
                value: 100,
            },
            {
                type: 'InputNumber',
                label: '高度',
                name: 'height',
                required: false,
                placeholder: '该容器在1080px大屏中的高度',
                value: 40,
            },
        ],
    }
}