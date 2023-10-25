export const widgetMap = {
    code: 'widget-map',
    type: 'chart',
    label: '中国地图',
    icon: 'iconzhongguoditu',
    options: {
        // 配置
        setup: [{
                type: 'Input',
                label: '图层名称',
                name: 'layerName',
                required: false,
                placeholder: '',
                value: '迁移图',
            },
            {
                type: 'vue-color',
                label: '背景颜色',
                name: 'background',
                required: false,
                placeholder: '',
                value: '#0F1C3C'
            },
            [
                {
                    name: '标题设置',
                    list: [{
                            type: 'i-switch',
                            label: '标题',
                            name: 'isNoTitle',
                            required: false,
                            placeholder: '',
                            value: true
                        },
                        {
                            type: 'Input',
                            label: '标题',
                            name: 'titleText',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'textColor',
                            required: false,
                            placeholder: '',
                            value: '#fff'
                        },
                        {
                            type: 'Select',
                            label: '字体粗细',
                            name: 'textFontWeight',
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
                        {
                            type: 'InputNumber',
                            label: '字体大小',
                            name: 'textFontSize',
                            required: false,
                            placeholder: '',
                            value: 20
                        },
                        {
                            type: 'Select',
                            label: '字体位置',
                            name: 'textAlign',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'center',
                                    name: '居中'
                                },
                                {
                                    code: 'left',
                                    name: '左对齐'
                                },
                                {
                                    code: 'right',
                                    name: '右对齐'
                                },
                            ],
                            value: 'left'
                        },
                        {
                            type: 'Input',
                            label: '副标题',
                            name: 'subText',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'subTextColor',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'Select',
                            label: '字体粗细',
                            name: 'subTextFontWeight',
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
                        {
                            type: 'InputNumber',
                            label: '字体大小',
                            name: 'subTextFontSize',
                            required: false,
                            placeholder: '',
                            value: 12
                        },
                    ],
                },
                {
                    name: '地图块颜色',
                    list: [{
                            type: 'vue-color',
                            label: '地图块颜色',
                            name: 'areaColor',
                            required: false,
                            placeholder: '',
                            value: 'rgba(34, 70, 168, 0.7)'
                        },
                        {
                            type: 'vue-color',
                            label: '边框颜色',
                            name: 'borderColor',
                            required: false,
                            placeholder: '',
                            value: '#0692a4'
                        },
                        {
                            type: 'InputNumber',
                            label: '边框宽度',
                            name: 'borderWidth',
                            required: false,
                            placeholder: '',
                            value: '1'
                        },
                        {
                            type: 'vue-color',
                            label: '鼠标悬浮',
                            name: 'emphasisColor',
                            required: false,
                            placeholder: '',
                            value: 'rgba(119, 139, 224, 0.548)'
                        },
                    ],
                },
                {
                    name: '航线颜色',
                    list: [{
                        type: 'customColor',
                        label: '',
                        name: 'customColor',
                        required: false,
                        value: [{
                            color: '#a6c84c'
                        }, {
                            color: '#ffa022'
                        }, {
                            color: '#46bee9'
                        }],
                    }, ],
                }
            ],
        ],
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
                value: ['苏州',[
                                [
                                    {
                                        name: "苏州",
                                    },
                                    {
                                        name: "福州",
                                        value: 95,
                                    },
                                ],
                                [
                                    {
                                        name: "苏州",
                                    },
                                    {
                                        name: "太原",
                                        value: 90,
                                    },
                                ],
                                [
                                    {
                                        name: "苏州",
                                    },
                                    {
                                        name: "长春",
                                        value: 80,
                                    },
                                ],
                                [
                                    {
                                        name: "苏州",
                                    },
                                    {
                                        name: "重庆",
                                        value: 70,
                                    },
                                ],
                                [
                                    {
                                        name: "苏州",
                                    },
                                    {
                                        name: "西安",
                                        value: 60,
                                    },
                                ],
                                [
                                    {
                                        name: "苏州",
                                    },
                                    {
                                        name: "成都",
                                        value: 50,
                                    },
                                ],
                                [
                                    {
                                        name: "苏州",
                                    },
                                    {
                                        name: "常州",
                                        value: 40,
                                    },
                                ],
                                [
                                    {
                                        name: "苏州",
                                    },
                                    {
                                        name: "北京",
                                        value: 30,
                                    },
                                ],
                                [
                                    {
                                        name: "苏州",
                                    },
                                    {
                                        name: "北海",
                                        value: 20,
                                    },
                                ],
                                [
                                    {
                                        name: "苏州",
                                    },
                                    {
                                        name: "海口",
                                        value: 10,
                                    },
                                ],
                            ]
                        ],
            },
            {
                type: 'dycustComponents',
                label: '',
                name: 'dynamicData',
                required: false,
                placeholder: '',
                relactiveDom: 'dataType',
                chartType: 'widget-plantmap',
                dictKey: 'MAP_PROPERTIES',
                relactiveDomValue: 'dynamicData',
                value: '',
            },
        ],
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