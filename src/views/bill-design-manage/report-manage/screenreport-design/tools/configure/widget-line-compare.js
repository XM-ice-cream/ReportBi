export const widgetLineCompare = {
    code: 'widgetLineCompareChart',
    type: 'chart',
    label: '折线对比图',
    icon: 'iconzhexian',
    options: {
        // 配置
        setup: [{
                type: 'Input',
                label: '图层名称',
                name: 'layerName',
                required: false,
                placeholder: '',
                value: '折线对比图',
            },
            {
                type: 'vue-color',
                label: '背景颜色',
                name: 'background',
                required: false,
                placeholder: '',
                value: ''
            },
            [{
                    name: '折线设置',
                    list: [{
                            type: 'i-switch',
                            label: '标记点',
                            name: 'markPoint',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Slider',
                            label: '点大小',
                            name: 'pointSize',
                            required: false,
                            placeholder: '',
                            value: 5,
                        },
                        {
                            type: 'i-switch',
                            label: '平滑曲线',
                            name: 'smoothCurve',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'i-switch',
                            label: '面积堆积',
                            name: 'area',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Slider',
                            label: '面积厚度',
                            name: 'areaThickness',
                            required: false,
                            placeholder: '',
                            value: 5,
                        },
                        {
                            type: 'Slider',
                            label: '线条宽度',
                            name: 'lineWidth',
                            required: false,
                            placeholder: '',
                            value: 2,
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
                            value: '#FFD700'
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
                            value: 'center'
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
                            placeholder: '多值以' | '隔开',
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
                            name: 'isShowX',
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
                            type: 'i-switch',
                            label: '数值居中',
                            name: 'boundaryX',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'vue-color',
                            label: '数值颜色',
                            name: 'colorX',
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
                            type: 'InputNumber',
                            label: '数值间隔',
                            name: 'splitNumberX',
                            required: false,
                            placeholder: '',
                            value: 1
                        },
                        {
                            type: 'i-switch',
                            label: '刻度线',
                            name: 'tickLineX',
                            require: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'i-switch',
                            label: 'X轴线',
                            name: 'lineX',
                            require: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'vue-color',
                            label: '轴颜色',
                            name: 'lineColorX',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                    ],
                },
                {
                    name: '上y轴设置',
                    list: [{
                            type: 'i-switch',
                            label: '显示',
                            name: 'isShowYTop',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Input',
                            label: '坐标名',
                            name: 'textNameYTop',
                            require: false,
                            placeholder: '',
                            value: ''
                        }, {
                            type: 'vue-color',
                            label: '坐标名颜色',
                            name: 'nameColorYTop',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '坐标字号',
                            name: 'namefontSizeYTop',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'i-switch',
                            label: '缩放',
                            name: 'scaleYTop',
                            required: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'InputNumber',
                            label: '数值切分',
                            name: 'splitNumberYTop',
                            required: false,
                            placeholder: '',
                            value: 0
                        },
                        {
                            type: 'vue-color',
                            label: '数值颜色',
                            name: 'colorYTop',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '数值字号',
                            name: 'fontSizeYTop',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'i-switch',
                            label: '刻度线',
                            name: 'tickLineYTop',
                            require: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'i-switch',
                            label: 'y轴线',
                            name: 'lineYTop',
                            require: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'vue-color',
                            label: '轴颜色',
                            name: 'lineColorYTop',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'i-switch',
                            label: '分割线',
                            name: 'splitLineYTop',
                            require: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'vue-color',
                            label: '分割线颜色',
                            name: 'splitLineColorYTop',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '分割线宽度',
                            name: 'splitLinefontSizeYTop',
                            required: false,
                            placeholder: '',
                            value: 1,
                        },
                    ],
                },
                {
                    name: '下y轴设置',
                    list: [{
                            type: 'i-switch',
                            label: '显示',
                            name: 'isShowYBottom',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Input',
                            label: '坐标名',
                            name: 'textNameYBottom',
                            require: false,
                            placeholder: '',
                            value: ''
                        }, {
                            type: 'vue-color',
                            label: '坐标名颜色',
                            name: 'nameColorYBottom',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '坐标字号',
                            name: 'namefontSizeYBottom',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'i-switch',
                            label: '缩放',
                            name: 'scaleYBottom',
                            required: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'InputNumber',
                            label: '数值切分',
                            name: 'splitNumberYBottom',
                            required: false,
                            placeholder: '',
                            value: 0
                        },
                        {
                            type: 'vue-color',
                            label: '数值颜色',
                            name: 'colorYBottom',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '数值字号',
                            name: 'fontSizeYBottom',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'i-switch',
                            label: '刻度线',
                            name: 'tickLineYBottom',
                            require: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'i-switch',
                            label: 'y轴线',
                            name: 'lineYBottom',
                            require: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'vue-color',
                            label: '轴颜色',
                            name: 'lineColorYBottom',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'i-switch',
                            label: '分割线',
                            name: 'splitLineYBottom',
                            require: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'vue-color',
                            label: '分割线颜色',
                            name: 'splitLineColorYBottom',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '分割线宽度',
                            name: 'splitLinefontSizeYBottom',
                            required: false,
                            placeholder: '',
                            value: 1,
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
                            type: 'i-switch',
                            label: '显示',
                            name: 'tipShow',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Select',
                            label: '类型',
                            name: 'tipType',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'line',
                                    name: '线形'
                                },
                                {
                                    code: 'cross',
                                    name: '十字形'
                                },
                            ],
                            value: 'line'
                        },
                        {
                            type: 'vue-color',
                            label: '颜色',
                            name: 'tipColor',
                            required: false,
                            placeholder: '#e68b55',
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
                            value: 20,
                        },
                        {
                            type: 'Slider',
                            label: '右边距(像素)',
                            name: 'marginRight',
                            required: false,
                            placeholder: '',
                            value: 50,
                        },
                        {
                            type: 'Slider',
                            label: '顶边距(像素)',
                            name: 'marginTop',
                            required: false,
                            placeholder: '',
                            value: 40,
                        },
                        {
                            type: 'Slider',
                            label: '底边距(像素)',
                            name: 'marginBottom',
                            required: false,
                            placeholder: '',
                            value: 40,
                        },
                    ],
                },
                {
                    name: '自定义配色',
                    list: [{
                        type: 'customColor',
                        label: '',
                        name: 'customColor',
                        required: false,
                        value: [{
                            color: '#36c5e7'
                        }, {
                            color: '#e68b55'
                        }],
                    }, ],
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
                        "axis": "07-25",
                        "name": "success",
                        "data": "2"
                    },
                    {
                        "axis": "07-25",
                        "name": "fail",
                        "data": "10"
                    },
                    {
                        "axis": "07-26",
                        "name": "success",
                        "data": "5"
                    },
                    {
                        "axis": "07-26",
                        "name": "fail",
                        "data": "20"
                    },
                    {
                        "axis": "07-27",
                        "name": "success",
                        "data": "15"
                    },
                    {
                        "axis": "07-27",
                        "name": "fail",
                        "data": "30"
                    },
                    {
                        "axis": "07-28",
                        "name": "success",
                        "data": "10"
                    },
                    {
                        "axis": "07-28",
                        "name": "fail",
                        "data": "12"
                    },
                    {
                        "axis": "07-29",
                        "name": "success",
                        "data": "9"
                    },
                    {
                        "axis": "07-29",
                        "name": "fail",
                        "data": "16"
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
                chartType: 'widget-stackchart',
                dictKey: 'STACK_PROPERTIES',
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