<template>
  <div>
    <Modal :title="dialogFormVisibleTitle" :mask-closable="false" :closable="true" v-model="visib" fullscreen :z-index='900' :before-close="closeDialog" class="screen-design">
      <div class="layout">
        <Layout>
          <!-- 左侧 -->
          <Sider hide-trigger class="layout-left">
            <Tabs type='card'>
              <TabPane label='工具栏' name="tools">
                <draggable v-for="widget in widgetTools" :key="widget.code" @end="evt => widgetOnDragged(evt, widget.code)">
                  <div class="tools-item">
                    <span class="tools-item-icon">
                      <i class="iconfont" :class="widget.icon"></i>
                    </span>
                    <span class="tools-item-text">{{ widget.label }}</span>
                  </div>
                </draggable>
              </TabPane>
              <TabPane label='图层' name='layer'>
                <draggable v-model="layerWidget" @update="datadragEnd" :options="{ animation: 300 }">
                  <transition-group>
                    <div v-for="(item, index) in layerWidget" :key="'item' + index" class="tools-item" :class="widgetIndex == index ? 'is-active' : ''" @click="layerClick(index)">
                      <span class="tools-item-icon">
                        <i class="iconfont" :class="item.icon"></i>
                      </span>
                      <span class="tools-item-text">{{ item.label }}</span>
                    </div>
                  </transition-group>
                </draggable>
              </TabPane>
            </Tabs>
          </Sider>
          <!-- 中间内容excel -->
          <Content class="layout-middle content" style='width:calc(100% - 400px);height:100%'>
            <div class="push_btn">
              <Tooltip class="item" effect="dark" content="保存" placement="bottom-start">
                <Button type="text" @click="save(false)">
                  <Icon type="ios-folder" />
                </Button>
              </Tooltip>
              <Tooltip class="item" effect="dark" content="预览" placement="bottom-start">
                <Button type="text" @click="preview()">
                  <Icon type="md-eye" />
                </Button>
              </Tooltip>

            </div>
            <div class="workbench-container" @mousedown="handleMouseDown">
              <!-- 网页标尺辅助线 -->
              <vue-ruler-tool v-model="dashboard.presetLine" class="vueRuler" :step-length="50" :parent="true" :position="'relative'" :is-scale-revise="true" :visible.sync="dashboard.presetLineVisible" style="height:100%;width:100%">
                <!-- workbench 工作台 -->
                <div id="workbench" class="workbench" :style="{
                    transform: workbenchTransform,
                    width: bigscreenWidth + 'px',
                    height: bigscreenHeight + 'px',
                    'background-color': dashboard.backgroundColor,
                    'background-image': 'url(' + dashboard.backgroundImage + ')'
                    }" @click.self="setOptionsOnClickScreen">
                  <div v-if="grade" class="bg-grid"></div>
                  <widget ref="widgets" v-for="(widget, index) in widgets" :key="index" v-model="widget.value" :index="index" :step="1" :type="widget.type" :bigscreen="{ bigscreenWidth, bigscreenHeight }" @onActivated="setOptionsOnClickWidget" @contextmenu.prevent.native="rightClick($event, index)" @mousedown.prevent.native="widgetsClick(index)" @mouseup.prevent.native="widgetsMouseup" />
                </div>
              </vue-ruler-tool>
            </div>
          </Content>
          <!-- 右侧基础配置 -->
          <Sider hide-trigger class="layout-right">
            <Tabs type='card' v-model='activeName'>
              <TabPane v-if="isNotNull(widgetOptions.setup) || isNotNull(widgetOptions.collapse)" name="first" label="配置" :index='1'>
                <dynamic-form ref="formData" :options="widgetOptions.setup" @onChanged="val => widgetValueChanged('setup', val)" />
              </TabPane>
              <TabPane v-if="isNotNull(widgetOptions.data)" name="second" label="数据" :index='2'>
                <dynamic-form ref="formData" :options="widgetOptions.data" @onChanged="val => widgetValueChanged('data', val)" />
              </TabPane>
              <TabPane v-if="isNotNull(widgetOptions.position)" name="third" label="坐标" :index='3'>
                <dynamic-form ref="formData" :options="widgetOptions.position" @onChanged="val => widgetValueChanged('position', val)" />
              </TabPane>
            </Tabs>
          </Sider>
        </Layout>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button @click="closeDialog">取消</Button>
        <Button type="primary" @click="save(true)">保存并关闭</Button>
      </div>
    </Modal>

    <content-menu :visible.sync="visibleContentMenu" :style-obj="styleObj" @deletelayer="deletelayer" @copylayer="copylayer" @istopLayer="istopLayer" @setlowLayer="setlowLayer" @moveupLayer="moveupLayer" @movedownLayer="movedownLayer" />
  </div>
</template>
<script>
import { widgetTools, getToolByCode } from "./screenreport-design/tools/index";
import draggable from "vuedraggable";
import VueRulerTool from "vue-ruler-tool"; // 大屏设计页面的标尺插件
import widget from "./screenreport-design/widget/widget.vue";
import { deepClone, isNotNull } from "@/libs/tools.js";
import DynamicForm from "./screenreport-design/components/dynamicForm.vue";
import ContentMenu from "./screenreport-design/components/contentMenu.vue";
import { addScreenReq, previewScreenReq } from '@/api/bill-design-manage/report-manage.js'

export default {
  name: "excelreport-design",
  components: { draggable, VueRulerTool, widget, DynamicForm, ContentMenu },
  props: {
    visib: {
      required: true,
      type: Boolean,
      default: false,
    },
    reportCode: {
      required: false,
      type: String,
    },
  },
  watch: {
    visib () {
      if (this.visib) {
        this.$nextTick(() => {
          // 如果是新的设计工作台
          this.initEchartData();
          this.widgets = [];
          window.addEventListener("mouseup", () => {
            this.grade = false;
          });
          this.getPXUnderScale(this.bigscreenWidth)
        });
      }
    },
    widgets: {
      handler (val) {
        //  console.log('监听', this.widgets);
        this.handlerLayerWidget(val);
      },
      deep: true
    }
  },
  computed: {
    step () {
      return Number(100 / (this.bigscreenScaleInWorkbench * 100));
    },
    // 左侧折叠切换时，动态计算中间区的宽度
    middleWidth () {
      let widthLeftAndRight = 0;
      if (this.toolIsShow) {
        widthLeftAndRight += this.widthLeftForTools; // 左侧工具栏宽度
      }
      widthLeftAndRight += this.widthLeftForToolsHideButton; // 左侧工具栏折叠按钮宽度
      widthLeftAndRight += this.widthLeftForOptions; // 右侧配置栏宽度

      let middleWidth = this.bodyWidth - widthLeftAndRight;
      return middleWidth;
    },
    middleHeight () {
      return this.bodyHeight;
    },

    workbenchTransform () {
      return `scale(${this.bigscreenScaleInWorkbench}, ${this.bigscreenScaleInWorkbench})`;
    },
    // 大屏在设计模式的大小
    bigscreenWidthInWorkbench () {
      return this.getPXUnderScale(this.bigscreenWidth) + this.widthPaddingTools;
    },
    bigscreenHeightInWorkbench () {
      return (
        this.getPXUnderScale(this.bigscreenHeight) + this.widthPaddingTools
      );
    },
    // 设计台按大屏的缩放比例
    bigscreenScaleInWorkbench () {
      let widthScale = (this.middleWidth - this.widthPaddingTools) / this.bigscreenWidth;
      let heightScale = (this.middleHeight - this.widthPaddingTools) / this.bigscreenHeight;
      return Math.min(widthScale, heightScale);
    },
  },
  data () {
    return {
      dialogFormVisibleTitle: "大屏 设计",
      bodyWidth: document.body.clientWidth,
      bodyHeight: document.body.clientHeight,
      grade: false,
      layerWidget: [],
      widgetTools: widgetTools, // 左侧工具栏的组件图标，将js变量加入到当前作用域
      isNotNull: isNotNull,
      widthLeftForTools: 200, // 左侧工具栏宽度
      widthLeftForToolsHideButton: 15, // 左侧工具栏折叠按钮宽度
      widthLeftForOptions: 300, // 右侧属性配置区
      widthPaddingTools: 18,
      toolIsShow: true, // 左侧工具栏是否显示

      bigscreenWidth: 1920, // 大屏设计的大小
      bigscreenHeight: 1080,

      // 工作台大屏画布，保存到表gaea_report_dashboard中
      dashboard: {
        id: null,
        title: "", // 大屏页面标题
        width: 1920, // 大屏设计宽度
        height: 1080, // 大屏设计高度
        backgroundColor: "", // 大屏背景色
        backgroundImage: "", // 大屏背景图片
        refreshSeconds: null, // 大屏刷新时间间隔
        presetLine: [], // 辅助线
        presetLineVisible: true, // 辅助线是否显示
      },
      // 大屏的标记
      screenCode: "",
      // 大屏画布中的组件
      widgets: [
        {
          // type和value最终存到数据库中去，保存到gaea_report_dashboard_widget中
          type: "widget-text",
          value: {
            setup: {},
            data: {},
            position: {
              width: 100,
              height: 100,
              left: 0,
              top: 0,
              zIndex: 0,
            },
          },
          // options属性是从工具栏中拿到的tools中拿到
          options: [],
        },
      ], // 工作区中拖放的组件

      // 当前激活组件
      widgetIndex: 0,
      // 当前激活组件右侧配置属性
      widgetOptions: {
        setup: [], // 配置
        data: [], // 数据
        position: [], // 坐标
      },
      flagWidgetClickStopPropagation: false, // 点击组件时阻止事件冒泡传递到画布click事件上
      styleObj: {
        left: 0,
        top: 0,
      },
      visibleContentMenu: false,
      rightClickIndex: -1,
      activeName: "first",
    };
  },
  methods: {

    // 拖动一个组件放到工作区中去，在拖动结束时，放到工作区对应的坐标点上去
    widgetOnDragged (evt, widgetCode) {
      let widgetType = widgetCode;

      // 获取结束坐标和列名
      let eventX = evt.originalEvent.clientX; // 结束在屏幕的x坐标
      let eventY = evt.originalEvent.clientY; // 结束在屏幕的y坐标

      let workbenchPosition = this.getDomTopLeftById("workbench");

      let widgetTopInWorkbench = eventY - workbenchPosition.top;
      let widgetLeftInWorkbench = eventX - workbenchPosition.left;
      // 计算在缩放模式下的x y
      let x = widgetLeftInWorkbench / this.bigscreenScaleInWorkbench;
      let y = widgetTopInWorkbench / this.bigscreenScaleInWorkbench;

      // 复制一个组件
      let tool = getToolByCode(widgetType);
      let widgetJson = {
        type: widgetType,
        value: {
          setup: {},
          data: {},
          position: {
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            zIndex: 0,
          },
        },
        options: tool.options,
      };
      // 处理默认值
      const widgetJsonValue = this.handleDefaultValue(widgetJson);
      // 将选中的复制组件，放到工作区中去
      //   console.log('widgetJsonValue', widgetJsonValue, deepClone(widgetJsonValue));
      this.widgets.push(deepClone(widgetJsonValue));
      // 激活新组件的配置属性
      //   this.setOptionsOnClickWidget(this.widgets.length - 1);
    },
    //通过监听widgets 获取图层参数
    handlerLayerWidget (val) {

      const layerWidgetArr = [];
      for (let i = 0; i < val.length; i++) {
        const obj = {};
        obj.icon = getToolByCode(val[i].type).icon;
        const options = val[i].options["setup"];
        options.forEach((el) => {
          if (el.name == "layerName") {
            obj.label = el.value;
          }
        });
        layerWidgetArr.push(obj);
      }
      this.layerWidget = layerWidgetArr;
      // console.log('this.layerWidget', this.layerWidget);
    },
    // 渲染初始化大屏报表
    async initEchartData () {

      const reportCode = this.reportCode;

      const { code, result } = await previewScreenReq({ reportCode: reportCode });
      if (code != 200) return;
      //   console.log('initEchartData', reportCode, result);
      const processData = this.handleInitEchartsData(result);
      const screenData = this.handleBigScreen(result.dashboard);
      this.widgets = processData;
      //   console.log(this.widgets);
      this.dashboard = screenData;
      this.bigscreenWidth = this.dashboard.width;
      this.bigscreenHeight = this.dashboard.height;
    },
    // 获取大屏参数--宽高，背景颜色，图片
    handleBigScreen (data) {
      const optionScreen = getToolByCode("screen").options;
      const setup = optionScreen.setup;
      for (const key in data) {
        for (let i = 0; i < setup.length; i++) {
          if (key == setup[i].name) {
            setup[i].value = data[key];
          }
        }
      }
      this.setOptionsOnClickScreen();
      return {
        backgroundColor: (data && data.backgroundColor) || "",
        backgroundImage: (data && data.backgroundImage) || "",
        height: (data && data.height) || "1080",
        title: (data && data.title) || "",
        width: (data && data.width) || "1920",
      };
    },
    // 大屏 图表
    handleInitEchartsData (data) {
      const widgets = data.dashboard ? data.dashboard.widgets : [];
      // console.log('widgets', widgets);
      const widgetsData = [];
      for (let i = 0; i < widgets.length; i++) {
        let obj = {};
        obj.type = widgets[i].type;
        obj.value = {
          setup: widgets[i].value.setup,
          data: widgets[i].value.data,
          position: widgets[i].value.position,
        };
        const tool = deepClone(getToolByCode(widgets[i].type));
        const option = tool.options;

        const options = this.handleOptionsData(widgets[i].value, option);
        //  console.log(obj.value, widgets[i].value, option, options);
        obj.options = options;
        widgetsData.push(obj);
      }
      return widgetsData;
    },
    // 大屏 右侧参数
    handleOptionsData (data, option) {
      for (const key in data.setup) {
        for (let i = 0; i < option.setup.length; i++) {
          let item = option.setup[i];
          if (Object.prototype.toString.call(item) == "[object Object]") {
            if (key == option.setup[i].name) {
              option.setup[i].value = data.setup[key];
            }
          } else if (Object.prototype.toString.call(item) == "[object Array]") {
            for (let j = 0; j < item.length; j++) {
              const list = item[j].list;
              list.forEach((el) => {
                if (key == el.name) {
                  el.value = data.setup[key];
                }
              });
            }
          }
        }
      }
      // position
      for (const key in data.position) {
        for (let i = 0; i < option.position.length; i++) {
          if (key == option.position[i].name) {
            option.position[i].value = data.position[key];
          }
        }
      }
      // data
      for (const key in data.data) {
        for (let i = 0; i < option.data.length; i++) {
          if (key == option.data[i].name) {
            option.data[i].value = data.data[key];
          }
        }
      }
      return option;
    },
    // 保存数据
    async save (flag) {
      if (!this.widgets || this.widgets.length == 0) {
        this.$Message.error("请添加组件");
        return;
      }
      const screenData = {
        reportCode: this.reportCode,
        dashboard: {
          title: this.dashboard.title,
          width: this.dashboard.width,
          height: this.dashboard.height,
          backgroundColor: this.dashboard.backgroundColor,
          backgroundImage: this.dashboard.backgroundImage,
        },
        widgets: this.widgets,
      };
      //   console.log('screenData', screenData);
      const { code, data } = await addScreenReq(screenData);
      if (code == 200) {
        this.$Message.success("保存成功！");
        if (flag) { this.closeDialog(); }
      }
    },
    // 预览--跳转至新窗口
    preview () {
      const { href } = this.$router.resolve({
        path: '/bill-design-manage/screenreport-preview',
        query: {
          reportCode: this.reportCode
        }
      });
      window.open(href, '_blank');
    },

    // 在缩放模式下的大小
    getPXUnderScale (px) {
      return this.bigscreenScaleInWorkbench * px;
    },


    // 获取dom在屏幕中的top和left
    getDomTopLeftById (id) {
      let dom = document.getElementById(id);
      return { top: dom?.getBoundingClientRect().top || 0, left: dom?.getBoundingClientRect().left || 0 };
    },

    // 对组件默认值处理
    handleDefaultValue (widgetJson) {
      for (const key in widgetJson) {
        if (key == "options") {
          // collapse、data、position、setup
          // setup 处理
          for (let i = 0; i < widgetJson.options.setup.length; i++) {
            const item = widgetJson.options.setup[i];
            if (Object.prototype.toString.call(item) == "[object Object]") {
              widgetJson.value.setup[item.name] = item.value;
            } else if (
              Object.prototype.toString.call(item) == "[object Array]"
            ) {
              for (let j = 0; j < item.length; j++) {
                const list = item[j].list;
                list.forEach((el) => {
                  widgetJson.value.setup[el.name] = el.value;
                });
              }
            }
          }
          // position
          for (let i = 0; i < widgetJson.options.position.length; i++) {
            const item = widgetJson.options.position[i];
            if (item.value) {
              widgetJson.value.position[item.name] = item.value;
            }
          }
          // data 处理
          if (widgetJson.options.data && widgetJson.options.data.length > 0) {
            for (let i = 0; i < widgetJson.options.data.length; i++) {
              const item = widgetJson.options.data[i];
              if (item.value) {
                widgetJson.value.data[item.name] = item.value;
              }
            }
          }
        }
      }
      return widgetJson;
    },
    layerClick (index) {
      // console.log('layerClick', index);
      this.widgetIndex = index;
      this.widgetsClick(index);
    },
    // 如果是点击大屏设计器中的底层，加载大屏底层属性
    setOptionsOnClickScreen () {
      //   console.log('setOptionsOnClickScreen', this.widgetOptions);
      this.screenCode = "screen";
      // 选中不同的组件 右侧都显示第一栏
      this.activeName = "first";
      this.widgetOptions = getToolByCode("screen")["options"];
    },

    // 点击组件
    widgetsClick (index) {
      const draggableArr = this.$refs.widgets;
      for (let i = 0; i < draggableArr.length; i++) {
        console.log(this.$refs.widgets[i].$refs.draggable);
        if (i == index) {
          this.$refs.widgets[i].$refs.draggable.setActive(true);
        } else {
          this.$refs.widgets[i].$refs.draggable.setActive(false);
        }
      }
      // this.activeName = 'first';
      this.setOptionsOnClickWidget(index);
      this.grade = true;
    },
    // 鼠标弹起不显示网格
    widgetsMouseup (e) {
      this.grade = false;
    },
    // 如果是点击某个组件，获取该组件的配置项
    setOptionsOnClickWidget (obj) {
      this.screenCode = "";
      if (typeof obj == "number") {
        this.widgetOptions = { ...this.widgets[obj]["options"] }
        return;
      }
      if (obj.index < 0 || obj.index >= this.widgets.length) {
        return;
      }
      this.widgetIndex = obj.index;
      this.widgets[obj.index].value.position = obj;
      this.widgets[obj.index].options.position.forEach((el) => {
        for (const key in obj) {
          if (el.name == key) {
            el.value = obj[key];
          }
        }
      });
      this.widgetOptions = { ...this.widgets[obj.index]["options"] }
    },
    // 激活组件拖拽
    handleMouseDown () {
      const draggableArr = this.$refs.widgets;
      for (let i = 0; i < draggableArr.length; i++) {
        this.$refs.widgets[i].$refs.draggable.setActive(false);
      }
    },
    // 将当前选中的组件，右侧属性值更新
    widgetValueChanged (key, val) {
      if (this.screenCode == "screen") {
        let newSetup = new Array();
        this.dashboard = deepClone(val);
        if (this.bigscreenWidth != this.dashboard.width) {
          this.bigscreenWidth = this.dashboard.width;
        }
        if (this.bigscreenHeight != this.dashboard.height) {
          this.bigscreenHeight = this.dashboard.height;
        }
        this.widgetOptions.setup.forEach((el) => {
          if (el.name == "width") {
            el.value = this.bigscreenWidth;
          } else if (el.name == "height") {
            el.value = this.bigscreenHeight;
          }
          newSetup.push(el);
        });
        this.widgetOptions.setup = newSetup;
        //  console.log('widgetValueChanged', '右侧属性值更新setup', this.widgetOptions.setup);
      } else {
        for (let i = 0; i < this.widgets.length; i++) {
          if (this.widgetIndex == i) {
            this.widgets[i].value[key] = deepClone(val);
            this.setDefaultValue(this.widgets[i].options[key], val);
          }
        }
      }
    },
    rightClick (event, index) {
      this.rightClickIndex = index;
      const left = event.clientX;
      const top = event.clientY;
      if (left || top) {
        this.styleObj = {
          left: left + "px",
          top: top + "px",
          display: "block",
        };
      }
      this.visibleContentMenu = true;
      return false;
    },
    setDefaultValue (options, val) {
      for (let i = 0; i < options.length; i++) {
        if (Object.prototype.toString.call(options[i]) == "[object Object]") {
          for (const k in val) {
            if (options[i].name == k) {
              options[i].value = val[k];
            }
          }
        } else if (
          Object.prototype.toString.call(options[i]) == "[object Array]"
        ) {
          for (let j = 0; j < options[i].length; j++) {
            const list = options[i][j].list;
            for (let z = 0; z < list.length; z++) {
              for (const k in val) {
                if (list[z].name == k) {
                  list[z].value = val[k];
                }
              }
            }
          }
        }
      }
    },
    //图层拖拉结束
    datadragEnd (evt) {
      evt.preventDefault();
      this.widgets = this.swapArr(this.widgets, evt.oldIndex, evt.newIndex);
    },
    // 数组 元素互换位置
    swapArr (arr, oldIndex, newIndex) {
      arr[oldIndex] = arr.splice(newIndex, 1, arr[oldIndex])[0];
      return arr;
    },
    // 删除
    deletelayer () {
      this.widgets.splice(this.rightClickIndex, 1);
    },
    // 复制
    copylayer () {
      const obj = deepClone(this.widgets[this.rightClickIndex]);
      this.widgets.splice(this.widgets.length, 0, obj);
    },
    // 置顶
    istopLayer () {
      if (this.rightClickIndex + 1 < this.widgets.length) {
        const temp = this.widgets.splice(this.rightClickIndex, 1)[0];
        this.widgets.push(temp);
      }
    },
    // 置底
    setlowLayer () {
      if (this.rightClickIndex != 0) {
        this.widgets.unshift(this.widgets.splice(this.rightClickIndex, 1)[0]);
      }
    },
    // 上移一层
    moveupLayer () {
      if (this.rightClickIndex != 0) {
        this.widgets[this.rightClickIndex] = this.widgets.splice(
          this.rightClickIndex - 1,
          1,
          this.widgets[this.rightClickIndex]
        )[0];
      } else {
        this.widgets.push(this.widgets.shift());
      }
    },
    // 下移一层
    movedownLayer () {
      if (this.rightClickIndex != this.widgets.length - 1) {
        this.widgets[this.rightClickIndex] = this.widgets.splice(
          this.rightClickIndex + 1,
          1,
          this.widgets[this.rightClickIndex]
        )[0];
      } else {
        this.widgets.unshift(this.widgets.splice(this.rightClickIndex, 1)[0]);
      }
    },
    //关闭弹框
    closeDialog () {
      this.$emit("update:visib", false);
    },
  },
  mounted () { },
};
</script>
<style>
.luckysheet-input-box {
  z-index: 1000;
}
</style>
<style lang="less" scoped>
.layout {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  height: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;

  .layout-left {
    display: inline-block;
    height: 100%;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border: 0px;
    background-color: #072a4f;

    //工具栏一个元素
    .tools-item {
      display: flex;
      position: relative;
      width: 100%;
      height: 48px;
      align-items: center;
      -webkit-box-align: center;
      padding: 0 6px;
      cursor: pointer;
      font-size: 12px;
      margin-bottom: 1px;

      .tools-item-icon {
        color: #409eff;
        margin-right: 10px;
        width: 2.4rem;
        height: 2.4rem;
        line-height: 30px;
        text-align: center;
        display: block;
        border: 1px solid #07375e;
        background: #072a4f;
        border-radius: 50%;
      }
      .tools-item-text {
        color: #129db4;
      }
    }
  }

  .layout-left-fold {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 100%;

    font-size: 12px;
    overflow: hidden;
    background-color: #242a30;
    cursor: pointer;
    padding-top: 26%;

    i {
      font-size: 18px;
      width: 18px;
      height: 23px;
      margin-left: 0px;
      color: #bfcbd9;
    }
  }

  .layout-middle {
    // display: flex;
    position: relative;
    //width: calc(100% - 445px);
    height: 100%;
    background-color: #000d18;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border: 1px solid #000d18;
    align-items: center;
    vertical-align: middle;
    text-align: center;

    .top-button {
      display: flex;
      flex-direction: row;
      height: 40px;
      line-height: 40px;
      margin-left: 9px;

      .btn {
        color: #788994;
        width: 55px;
        text-align: center;
        display: block;
        cursor: pointer;

        .el-icon-arrow-down {
          transform: rotate(0deg);
          -ms-transform: rotate(0deg); /* IE 9 */
          -moz-transform: rotate(0deg); /* Firefox */
          -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
          -o-transform: rotate(0deg); /* Opera */
          transition: all 0.4s ease-in-out;
        }

        &:hover {
          background: rgb(25, 29, 34);

          .el-icon-arrow-down {
            transform: rotate(180deg);
            -ms-transform: rotate(180deg); /* IE 9 */
            -moz-transform: rotate(180deg); /* Firefox */
            -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
            -o-transform: rotate(180deg); /* Opera */
            transition: all 0.4s ease-in-out;
          }
        }
      }
    }

    .workbench-container {
      position: relative;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      width: 100%;
      height: calc(100% - 35px);
      .vueRuler {
        width: 100%;
        padding: 18px 0px 0px 18px;
      }

      .workbench {
        background-color: #1e1e1e;
        position: relative;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        margin: 0;
        padding: 0;
        background-position: 0% 0%;
        background-size: 100% 100%;
        background-repeat: initial;
        background-attachment: initial;
        background-origin: initial;
        background-clip: initial;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .bg-grid {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: 30px 30px, 30px 30px;
        background-image: linear-gradient(
            hsla(0, 0%, 100%, 0.1) 1px,
            transparent 0
          ),
          linear-gradient(90deg, hsla(0, 0%, 100%, 0.1) 1px, transparent 0);
        // z-index: 2;
      }
    }

    .bottom-text {
      width: 100%;
      color: #a0a0a0;
      font-size: 16px;
      position: absolute;
      bottom: 20px;
    }
  }

  .layout-right {
    display: inline-block;
    height: 100%;
    width: 300px !important;
    min-width: 300px !important;
    max-width: 300px !important;
    flex: 0 0 300px !important;
    background: #072a4f;
  }
  .content {
    .push_btn {
      text-align: right;
      background-color: #072a4f;
      height: 32px;
      padding: 0.3rem;
      margin: 0;
      button {
        margin-right: 0.6rem;
        i {
          color: #17f5e0;
          font-size: 1.12rem;
        }
      }
    }
  }

  /deep/ .el-tabs--border-card {
    border: 0;

    .el-tabs__header {
      .el-tabs__nav {
        .el-tabs__item {
          background-color: #242f3b;
          border: 0px;
        }

        .el-tabs__item.is-active {
          background-color: #31455d;
        }
      }
    }

    .el-tabs__content {
      background-color: #242a30;
      height: calc(100vh - 39px);
      overflow-x: hidden;
      overflow-y: auto;

      .el-tab-pane {
        color: #bfcbd9;
      }

      &::-webkit-scrollbar {
        width: 5px;
        height: 14px;
      }

      &::-webkit-scrollbar-track,
      &::-webkit-scrollbar-thumb {
        border-radius: 1px;
        border: 0 solid transparent;
      }

      &::-webkit-scrollbar-track-piece {
        /*修改滚动条的背景和圆角*/
        background: #29405c;
        -webkit-border-radius: 7px;
      }

      &::-webkit-scrollbar-track {
        box-shadow: 1px 1px 5px rgba(116, 148, 170, 0.5) inset;
      }

      &::-webkit-scrollbar-thumb {
        min-height: 20px;
        background-clip: content-box;
        box-shadow: 0 0 0 5px rgba(116, 148, 170, 0.5) inset;
      }

      &::-webkit-scrollbar-corner {
        background: transparent;
      }

      /*修改垂直滚动条的样式*/
      &::-webkit-scrollbar-thumb:vertical {
        background-color: #00113a;
        -webkit-border-radius: 7px;
      }

      /*修改水平滚动条的样式*/
      &::-webkit-scrollbar-thumb:horizontal {
        background-color: #00113a;
        -webkit-border-radius: 7px;
      }
    }
  }
}
.screen-design {
  /deep/ .ivu-input {
    border: 1px solid #036595;
    border-radius: 10px !important;
    color: #17cbdd;
    background-color: #072a4f;
  }
  /deep/.ivu-radio-wrapper {
    color: #17cbdd;
  }
  /deep/.ivu-select-input {
    color: #17cbdd;
  }
  /deep/ .ivu-select-item {
    color: #cee8eb;
  }
  /deep/ .ivu-select-item-selected:hover {
    color: #17cbdd;
  }
  /deep/ .ivu-select-item:hover {
    color: #17cbdd;
  }
  /deep/.ivu-select-small.ivu-select-single .ivu-select-selection {
    border: 1px solid #036595;
    border-radius: 10px !important;
    color: #17cbdd;
    background-color: #072a4f;
  }
  /deep/.ivu-modal .ivu-select-dropdown {
    border: 1px solid #036595;
    border-radius: 10px !important;
    color: #17cbdd;
    background-color: #072a4f;
  }
  /deep/.ivu-input-number {
    border: 1px solid #036595;
    border-radius: 10px !important;
    color: #17cbdd;
    background-color: #072a4f;
  }
  /deep/ .ivu-input-number-small input {
    border: 1px solid #036595;
    border-radius: 10px !important;
    color: #17cbdd;
    background-color: #072a4f;
  }
  /deep/.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
    color: #15b3c8;
    border: 1px dashed #15b3c8;
    margin-bottom: 0.8rem;
    background: #072a4f;
  }
  /deep/.ivu-collapse > .ivu-collapse-item-active {
    border-top: 2px solid #1de3d1 !important;
  }
  /deep/.ivu-collapse > .ivu-collapse-item {
    border-top: none;
  }
  /deep/.ivu-input-group-append {
    background-color: transparent;
    border: none;
  }
}

/deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border: none;
  background: transparent;
}
/deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  background: #000d18;
  color: #14b5c7;
  font-weight: bold;
}
/deep/.ivu-modal-fullscreen .ivu-modal-body {
  padding: 0px;
  top: 2.63rem;
  bottom: 39px;
}
/deep/.ivu-form-label-left .ivu-form-item-label {
  color: #129db4;
}
/deep/.ivu-tabs .ivu-tabs-content-animated {
  background-color: #000d18;
  height: calc(100% - 33px);
  //   overflow-x: hidden;
}
/deep/.ivu-tabs .ivu-tabs-tabpane {
  background: #000d18;
  overflow-y: auto;
  padding: 1rem 0.5rem 0;
}
/deep/.ivu-tabs {
  height: 100%;
}
/deep/.ivu-tabs-bar {
  margin-bottom: 0px;
  border-bottom: none;
}
/deep/.ivu-tabs-nav .ivu-tabs-tab {
  padding: 8px 16px;
}
/deep/.ivu-tabs-nav-scrollable {
  padding: 0;
}
/deep/.ivu-tabs-nav {
  background: #072a4f;
  color: #14b5c7;
}
</style>
