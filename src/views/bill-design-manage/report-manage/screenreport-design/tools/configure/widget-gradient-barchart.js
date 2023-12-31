export const widgetGradientBarchart = {
    code: 'widget-gradient-color-barchart',
    type: 'chart',
    label: '柱状图-渐变色',
    icon: 'iconzhuzhuangtu',
    options: {
        // 配置
        setup: [{
                type: 'Input',
                label: '图层名称',
                name: 'layerName',
                required: false,
                placeholder: '',
                value: '柱形图-渐变色',
            },
            {
                type: 'i-switch',
                label: '竖展示',
                name: 'verticalShow',
                required: false,
                placeholder: '',
                value: false,
            },
            {
                type: 'vue-color',
                label: '背景颜色',
                name: 'background',
                required: false,
                placeholder: '',
                value: ''
            }, {
                type: 'Slider',
                label: '滚动条显示百分比',
                name: 'dataZoomEnd',
                require: false,
                placeholder: '',
                value: 100,
            },
            [{
                    name: '柱体设置',
                    list: [{
                            type: 'Slider',
                            label: '最大宽度',
                            name: 'maxWidth',
                            required: false,
                            placeholder: '',
                            value: 10,
                        },
                        {
                            type: 'Slider',
                            label: '圆角',
                            name: 'radius',
                            require: false,
                            placeholder: '',
                            value: 5,
                        },
                    ],
                },
                {
                    name: '标题设置',
                    list: [{
                            type: 'i-switch',
                            label: '标题',
                            name: 'isNoTitle',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Input',
                            label: '标题',
                            name: 'titleText',
                            required: false,
                            placeholder: '',
                            value: '',
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
                            value: 22
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
                            value: 'center'
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
                            value: '#90979c'
                        },
                        {
                            type: 'Input',
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
                            value: 20
                        },
                    ],
                },
                {
                    name: '图例操作',
                    list: [{
                            type: 'i-switch',
                            label: '图例显示',
                            name: 'isShowLegend',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Input',
                            label: '图例名称',
                            name: 'legendName',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'lengedColor',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '字体字号',
                            name: 'lengedFontSize',
                            required: false,
                            placeholder: '',
                            value: 12,
                        },
                        {
                            type: 'InputNumber',
                            label: '图例宽度',
                            name: 'lengedWidth',
                            required: false,
                            placeholder: '',
                            value: 12,
                        },
                        {
                            type: 'Select',
                            label: '横向位置',
                            name: 'lateralPosition',
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
                            value: 'center'
                        },
                        {
                            type: 'Select',
                            label: '纵向位置',
                            name: 'longitudinalPosition',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'top',
                                    name: '顶部'
                                },
                                {
                                    code: 'bottom',
                                    name: '底部'
                                },
                            ],
                            value: 'top'
                        },
                        {
                            type: 'Select',
                            label: '布局前置',
                            name: 'layoutFront',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'vertical',
                                    name: '竖排'
                                },
                                {
                                    code: 'horizontal',
                                    name: '横排'
                                },
                            ],
                            value: 'horizontal'
                        },
                    ],
                },
                {
                    name: 'X轴设置',
                    list: [{
                            type: 'i-switch',
                            label: '显示',
                            name: 'hideX',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Input',
                            label: '坐标名',
                            name: 'xName',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '坐标名颜色',
                            name: 'nameColorX',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '坐标字号',
                            name: 'nameFontSizeX',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'vue-color',
                            label: '数值颜色',
                            name: 'Xcolor',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '数值字号',
                            name: 'fontSizeX',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'Slider',
                            label: '数值角度',
                            name: 'textAngle',
                            required: false,
                            placeholder: '',
                            value: 0
                        },
                        {
                            type: 'InputNumber',
                            label: '数值间隔',
                            name: 'textInterval',
                            required: false,
                            placeholder: '',
                            value: 1
                        },
                        {
                            type: 'i-switch',
                            label: '轴反转',
                            name: 'reversalX',
                            required: false,
                            placeholder: '',
                            value: false
                        },
                        {
                            type: 'vue-color',
                            label: '轴颜色',
                            name: 'lineColorX',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'i-switch',
                            label: '分割线显示',
                            name: 'isShowSplitLineX',
                            require: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'vue-color',
                            label: '分割线颜色',
                            name: 'splitLineColorX',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        }, {
                            type: 'InputNumber',
                            label: '多轴间距',
                            name: 'spaceX',
                            required: false,
                            placeholder: '',
                            value: 20,
                        }
                    ],
                },
                {
                    name: 'Y轴设置',
                    list: [{
                            type: 'i-switch',
                            label: '显示',
                            name: 'isShowY',
                            require: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Input',
                            label: '坐标名',
                            name: 'textNameY',
                            require: false,
                            placeholder: '',
                            value: ''
                        }, {
                            type: 'vue-color',
                            label: '坐标名颜色',
                            name: 'nameColorY',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '坐标字号',
                            name: 'namefontSizeY',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'vue-color',
                            label: '数值颜色',
                            name: 'colorY',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '数值字号',
                            name: 'fontSizeY',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'Slider',
                            label: '数值角度',
                            name: 'ytextAngle',
                            required: false,
                            placeholder: '',
                            value: 0
                        },
                        {
                            type: 'i-switch',
                            label: '缩放',
                            name: 'scale',
                            require: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'InputNumber',
                            label: '均分',
                            name: 'splitNumber',
                            required: false,
                            placeholder: '',
                            value: 0
                        },
                        {
                            type: 'i-switch',
                            label: '轴反转',
                            name: 'reversalY',
                            required: false,
                            placeholder: '',
                            value: false
                        },
                        {
                            type: 'vue-color',
                            label: '轴颜色',
                            name: 'lineColorY',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'i-switch',
                            label: '分割线显示',
                            name: 'isShowSplitLineY',
                            require: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'vue-color',
                            label: '分割线颜色',
                            name: 'splitLineColorY',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        }, {
                            type: 'InputNumber',
                            label: '多轴间距',
                            name: 'spaceY',
                            required: false,
                            placeholder: '',
                            value: 100,
                        },
                    ],
                },
                {
                    name: '数值设定',
                    list: [{
                            type: 'i-switch',
                            label: '显示',
                            name: 'isShow',
                            required: false,
                            placeholder: '',
                            value: true
                        },
                        {
                            type: 'InputNumber',
                            label: '距离',
                            name: 'distance',
                            required: false,
                            placeholder: '',
                            value: 5
                        },
                        {
                            type: 'InputNumber',
                            label: '字体大小',
                            name: 'fontSize',
                            required: false,
                            placeholder: '',
                            value: 14
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'subTextColor',
                            required: false,
                            placeholder: '',
                            value: '#fff'
                        },
                        {
                            type: 'Select',
                            label: '字体粗细',
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
                    ],
                },
                {
                    name: '提示语设置',
                    list: [{
                            type: 'InputNumber',
                            label: '字体大小',
                            name: 'tipsFontSize',
                            required: false,
                            placeholder: '',
                            value: 16
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'lineColor',
                            required: false,
                            placeholder: '#ff7f50',
                        },
                    ],
                },
                {
                    name: '坐标轴边距设置',
                    list: [{
                        type: 'Slider',
                        label: '左边距(像素)',
                        name: 'marginLeft',
                        required: false,
                        placeholder: '',
                        value: 10,
                    }, {
                        type: 'Slider',
                        label: '顶边距(像素)',
                        name: 'marginTop',
                        required: false,
                        placeholder: '',
                        value: 50,
                    }, {
                        type: 'Slider',
                        label: '右边距(像素)',
                        name: 'marginRight',
                        required: false,
                        placeholder: '',
                        value: 40,
                    }, {
                        type: 'Slider',
                        label: '底边距(像素)',
                        name: 'marginBottom',
                        required: false,
                        placeholder: '',
                        value: 10,
                    }, ],
                },
                {
                    name: '渐变色',
                    list: [{
                            type: 'vue-color',
                            label: '0%处',
                            name: 'bar0color',
                            required: false,
                            placeholder: '',
                            value: 'rgba(0,244,255,1)'
                        },
                        {
                            type: 'vue-color',
                            label: '100%处',
                            name: 'bar100color',
                            required: false,
                            placeholder: '',
                            value: 'rgba(0,77,167,1)'
                        },
                        {
                            type: 'vue-color',
                            label: '阴影颜色',
                            name: 'shadowColor',
                            required: false,
                            placeholder: '',
                            value: 'rgba(0,160,221,1)'
                        },
                        {
                            type: 'InputNumber',
                            label: '模糊系数',
                            name: 'shadowBlur',
                            required: false,
                            placeholder: '',
                            value: 4,
                        },
                    ],
                },
            ],
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
                value: 5000
            },
            {
                type: 'Button',
                label: '静态数据',
                name: 'staticData',
                required: false,
                placeholder: '',
                relactiveDom: 'dataType',
                relactiveDomValue: 'staticData',
                value: [{
                        "axis": "苹果",
                        "data": 1000
                    },
                    {
                        "axis": "三星",
                        "data": 2229
                    },
                    {
                        "axis": "小米",
                        "data": 3879
                    },
                    {
                        "axis": "oppo",
                        "data": 2379
                    },
                    {
                        "axis": "vivo",
                        "data": 4079
                    },
                ],
            },
            {
                type: 'dycustComponents',
                label: '',
                name: 'dynamicData',
                required: false,
                placeholder: '',
                relactiveDom: 'dataType',
                relactiveDomValue: 'dynamicData',
                chartType: 'widget-barchart',
                dictKey: 'BAR_PROPERTIES',
                value: '',
            },
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
                value: 400,
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