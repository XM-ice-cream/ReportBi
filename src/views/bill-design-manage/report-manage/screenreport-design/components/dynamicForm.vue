
<template>
  <div class="collapse-input-style">
    <Form :label-width="80" label-position="left">
      <template v-for="(item, index) in options">
        <div v-if="isShowForm(item, '[object Object]')" :key="index">
          <FormItem v-if=" inputShow[item.name] && item.type != 'dycustComponents' &&item.type != 'dynamic-add-table'
            " :label="item.label" :prop="item.name" :required="item.required">
            <InputNumber v-if="item.type == 'InputNumber'" size="small" style="width:100%" v-model.trim="formData[item.name]" controls-position="right" @on-change="changed($event, item.name)" />

            <Input v-if="item.type == 'Input'" v-model.trim="formData[item.name]" type="text" size="small" placeholder="请输入内容" clearable @on-change="changed($event, item.name)" />

            <Input v-if="item.type == 'InputTextarea'" v-model.trim="formData[item.name]" type="textarea" size="small" :rows="2" placeholder="请输入内容" @on-change="changed($event, item.name)" />

            <i-switch v-if="item.type == 'i-switch'" v-model="formData[item.name]" size="small" placeholder="请输入内容" @on-change="changed($event, item.name)" />

            <ColorPickerComponents v-if="item.type == 'vue-color'" v-model="formData[item.name]" @change="val => changed(val, item.name)" />

            <!-- 图片上传 -->
            <customUpload v-if="item.type == 'custom-upload'" v-model="formData[item.name]" @change="changed($event, item.name)" />

            <RadioGroup v-if="item.type == 'RadioGroup'" v-model="formData[item.name]" @on-change="val => changed(val, item.name)">
              <Radio v-for="itemChild in item.selectOptions" :key="itemChild.code" :label="itemChild.code">{{ itemChild.name }}</Radio>
            </RadioGroup>

            <Select v-if="item.type == 'Select'" size="small" v-model="formData[item.name]" clearable placeholder="请选择" @on-change="val => changed(val, item.name)">
              <Option v-for="itemChild in item.selectOptions" :key="itemChild.code" :label="itemChild.name" :value="itemChild.code" />
            </Select>

            <Slider v-if="item.type == 'Slider'" v-model="formData[item.name]" @on-change="val => changed(val, item.name)" />

            <Button v-if="item.type == 'Button'" type="primary" size="small" plain @click="addStaticData">编辑</Button>

            <!-- 弹窗 -->
            <Modal title="代码编辑" v-model="dialogVisibleStaticData" width="50%" :before-close="handleClose">
              <vue-json-editor v-model="formData[item.name]" :show-btns="false" :mode="'code'" lang="zh" class="my-editor" />
              <span slot="footer" class="dialog-footer">
                <Button @click="dialogVisibleStaticData = false">取 消</Button>
                <Button type="primary" @click="saveData">确 定</Button>
              </span>
            </Modal>
          </FormItem>
          <dynamicComponents v-if="item.type == 'dycustComponents' && inputShow[item.name]" v-model="formData[item.name]" :chart-type="item.chartType" :dict-key="item.dictKey" @change="changed($event, item.name)" />
          <dynamic-add-table v-if="item.type == 'dynamic-add-table' && inputShow[item.name]" v-model="formData[item.name]" :chart-type="item.chartType" @change="changed($event, item.name)" />
        </div>
        <div v-else-if="isShowForm(item, '[object Array]')" :key="'a-' + index" class="screenCollapse">
          <Collapse v-model="collapseIndex" accordion>
            <Panel v-for="(itemChild, indexChild) in item" :key="indexChild" :name="itemChild.name">
              {{itemChild.name}}
              <p slot="content">
                <template v-for="(itemChildList, idx) in itemChild.list">
                  <FormItem :key="idx" :label="itemChildList.label" :prop="itemChildList.name" :required="itemChildList.required">
                    <InputNumber v-if="itemChildList.type == 'InputNumber'" size="small" style="width:100%" v-model="formData[itemChildList.name]" controls-position="right" :placeholder="itemChildList.placeholder" @on-change="changed($event, itemChildList.name)" />

                    <Input v-if="itemChildList.type == 'Input'" v-model.trim="formData[itemChildList.name]" type="text" size="small" placeholder="请输入内容" clearable @on-change="changed($event, itemChildList.name)" />

                    <Input v-if="itemChildList.type == 'Input-textarea'" v-model.trim="formData[itemChildList.name]" size="small" type="textarea" :rows="2" placeholder="请输入内容" @on-change="changed($event, itemChildList.name)" />

                    <i-switch v-if="itemChildList.type == 'i-switch'" v-model="formData[itemChildList.name]" placeholder="请输入内容" size="small" @on-change="changed($event, itemChildList.name)" />

                    <ColorPickerComponents v-if="itemChildList.type == 'vue-color'" v-model="formData[itemChildList.name]" @change="val => changed(val, itemChildList.name)" />

                    <Upload v-if="itemChildList.type == 'Upload-picture'" size="small" action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" />

                    <RadioGroup v-if="itemChildList.type == 'RadioGroup'" v-model="formData[itemChildList.name]" @on-change="val => changed(val, itemChildList.name)">
                      <Radio v-for="it in itemChildList.selectOptions" :key="it.code" :label="it.code">{{ it.name }}</Radio>
                    </RadioGroup>

                    <Select v-if="itemChildList.type == 'Select'" size="small" v-model="formData[itemChildList.name]" clearable placeholder="请选择" @on-change="val => changed(val, itemChildList.name)">
                      <Option v-for="it in itemChildList.selectOptions" :key="it.code" :label="it.name" :value="it.code" />
                    </Select>

                    <Slider v-if="itemChildList.type == 'Slider'" v-model="formData[itemChildList.name]" @on-change="val => changed(val, itemChildList.name)" />
                  </FormItem>
                  <customColorComponents v-if="itemChildList.type == 'customColor'" :key="'b-' + idx" v-model="formData[itemChildList.name]" @change="changed($event, itemChildList.name)" />
                </template>
              </p>
            </Panel>
          </Collapse>
        </div>
      </template>
    </Form>
  </div>
</template>

<script>
import ColorPickerComponents from "./colorPickerComponents.vue";
import vueJsonEditor from "vue-json-editor";
import "codemirror/lib/codemirror.css"; // 核心样式
import "codemirror/theme/cobalt.css"; // 引入主题后还需要在 options 中指定主题才会生效
// language
import "codemirror/mode/vue/vue.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/shell/shell.js";
import dynamicComponents from "./dynamicComponents.vue";
import customColorComponents from "./customColorComponents";
import dynamicAddTable from "./dynamicAddTable.vue";
import customUpload from "./customUpload.vue";
import { deepClone } from "@/libs/tools.js";
export default {
  name: "DynamicForm",
  components: {
    ColorPickerComponents,
    vueJsonEditor,
    dynamicComponents,
    customColorComponents,
    dynamicAddTable,
    customUpload
  },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    options: Array,
    value: String
  },
  data () {
    return {
      formData: {},
      inputShow: {}, // 控制表单是否显示
      dialogVisibleStaticData: false,
      validationRules: "",
      optionsJavascript: {
        mode: "text/javascript",
        tabSize: 2, // 缩进格式
        lineNumbers: true, // 显示行号
        line: true,
        styleActiveLine: true, // 高亮选中行

        hintOptions: {
          completeSingle: true // 当匹配只有一项的时候是否自动补全
        }
      },
      collapseIndex: ''
    };
  },
  watch: {
    value (newValue, oldValue) {
      //  console.log('newValue', newValue);
      this.formData = newValue || {};
    },
    options (val) {
      //   console.log('options', this.options);
      this.setDefaultValue();
      this.isShowData();
    }
  },
  created () {
    this.isShowData();
    this.setDefaultValue();
  },
  mounted () { },
  methods: {
    onJsonChange (val) {
      console.log(val);
    },
    onJsonSave (val) {
      console.log(val);
    },
    // 无论哪个输入框改变 都需要触发事件 将值回传
    changed (val, key) {

      if (val?.type) {
        //   console.log('val type', val.target.value);
        this.$set(this.formData, key, val.target.value);
      } else {
        this.$set(this.formData, key, val);
      }
      this.$emit("onChanged", this.formData);
      // key为当前用户操作的表单组件
      for (let i = 0; i < this.options.length; i++) {
        let item = this.options[i];
        if (item.relactiveDom == key) {
          this.inputShow[item.name] = val == item.relactiveDomValue;
          this.inputShow = Object.assign({}, this.inputShow);
        }
      }
    },
    saveData () {
      this.$emit("onChanged", this.formData);
      this.dialogVisibleStaticData = false;
    },
    // 静态数据
    addStaticData () {
      this.dialogVisibleStaticData = true;
    },
    handleClose () {
      this.dialogVisibleStaticData = false;
    },
    // 组件属性 数据是否展示动态还是静态数据
    isShowData () {
      let currentData = {};
      const data = [];
      for (let i = 0; i < this.options.length; i++) {
        // 添加默认的inputShow值
        this.inputShow[this.options[i].name] = true;
        if (this.options[i].selectValue) {
          currentData = this.options[i];
        } else {
          data.push(this.options[i]);
        }
      }
      data.forEach(el => {
        if (el.relactiveDomValue != currentData.value) {
          this.inputShow[el.name] = false;
        }
      });
    },
    // 组件拖入时 赋值
    setDefaultValue () {
      if (this.options && this.options.length > 0) {
        for (let i = 0; i < this.options.length; i++) {
          const obj = this.options[i];
          if (Object.prototype.toString.call(obj) == "[object Object]") {
            //先暂时这样，原本是浅拷贝的
            this.formData[this.options[i].name] = this.options[i].value;
          } else if (Object.prototype.toString.call(obj) == "[object Array]") {
            for (let j = 0; j < obj.length; j++) {
              const list = obj[j].list;
              list.forEach(el => {
                this.formData[el.name] = el.value;
              });
            }
          }
        }
        this.formData = Object.assign({}, this.formData);
      }
    },
    // 是否显示 那种格式
    isShowForm (val, type) {
      return Object.prototype.toString.call(val) == type;
    }
  }
};
</script>

<style scoped lang="less">
.screenCollapse .ivu-collapse {
  background-color: transparent;
  border-radius: 3px;
  border: none !important;
}
/deep/.screenCollapse {
  .ivu-collapse-content {
    color: #ffffff;
    padding: 0 16px;
    background-color: #020202;
  }
}
/deep/ .FormItem {
  margin-bottom: 5px;
}
/deep/ .FormItem__label {
  font-size: 12px;
  color: #fff;
}
.code-mirror {
  width: 100%;
  height: 100% !important;
}
.Collapse {
  border-top: none;
  border-bottom: none;
}
/deep/.CollapseItem__header {
  height: 40px;
  line-height: 40px;
  background: transparent;
  color: #bcc9d4;
  font-weight: 300;
  font-size: 12px;
  border-color: #282e3a;
}
/deep/.CollapseItem__wrap {
  background: transparent;
  border: none;
}
/deep/.CollapseItem__content {
  padding-bottom: 0;
}
</style>
