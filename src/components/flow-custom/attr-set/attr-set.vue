<template>
  <Modal draggable
         class-name="page-style-modal"
         v-model="modalFlag"
         :title="modalTitle"
         width="900px"
         :styles="{ top: '20px' }"
         @on-cancel="modalCancel"
         :mask-closable="false"
  >
    <Split v-model="split" class="attr-set-height">
      <div slot="left" class="split-left-style">
        <!--   属性列表   -->
        <CellGroup @on-click="cellClick">
          <Cell
              v-for="(item, i) in cellList"
              :key="i"
              :title="item.title"
              :name="item.name"
              :selected="item.name === cellSelected"
          />
          <Cell
              title="抽检计划"
              name="samplingConfig"
              v-if="model.flowMain && targetProcessTypeIsSC"
              :selected="cellSelected === 'samplingConfig'"
          />
          <Cell
              title="抽检标准"
              name="samplingStandard"
              :selected="cellSelected === 'samplingStandard'"
          />
        </CellGroup>
      </div>
      <div slot="right" class="split-right-style">
        <!--   属性设置   -->
        <Card :bordered="false" dis-hover :padding="8" style="height: 420px;overflow-y: auto;">
          <!--   节点属性   -->
          <Form v-if="cellSelected === 'nodeSet'" :label-width="120" :label-colon="true">
            <div v-show="eleType === 'node'">
              <FormItem :label="$t('name')">
                <treeselect v-model="model.labelId" :options="stationList" showCount disable-branch-nodes
                            :placeholder="$t('pleaseSelect') + $t('name')" @select="nameSelect"/>
              </FormItem>
              <FormItem label="过站ID">{{ model.labelId }}</FormItem>
              <!-- 绑定料号配方 -->
              <FormItem :label="`${$t('pnformula')}`">
                <v-selectpage
                    class="select-page-style"
                    v-if="modalFlag"
                    key-field="batchId"
                    :show-field="row => `${row.pn} ${row.formulaName}`"
                    search-field="pn"
                    :data="pnFormulaPageListUrl"
                    :params="{enabled: -1, itemPN: '', orderField: 'pn'}"
                    v-model="model.formulaBatchId"
                    :placeholder="`${$t('pleaseSelect')}${$t('equipmentBind')}${$t('pnformula')}`"
                    :result-format="
                      (res) => {
                        let arr = res.data || []
                        let arrList = []
                        arr.forEach(o => {
                          if (!arrList.find((x) => o.batchId === x.batchId)) arrList.push(o);
                        })
                        return {
                          totalRow: res.total,
                          list: arrList,
                        };
                      }
                    ">
                </v-selectpage>
              </FormItem>
              <FormItem :label="`${$t('pnformula')}ID`">{{ model.formulaBatchId }}</FormItem>
              <FormItem label="选项">
                <checkbox v-model="model.flowMain" @on-change="flowMainChange">
                  <!-- <Tooltip content="Here is the prompt text"></Tooltip> -->
                  是否为主流程
                </checkbox>
                <checkbox v-model="model.necessary" :disabled="!model.flowMain">
                  是否为必要站点
                </checkbox>
                <checkbox v-model="model.manual">是否支持手动过站</checkbox>
                <checkbox v-model="model.split">是否为分板站</checkbox>
                <checkbox v-model="holdprocess" @on-change="holdprocessChange">
                  手动锁定制程
                </checkbox>
                <checkbox v-model="model.allowRePass">是否允许重复过站</checkbox>
                <checkbox v-model="model.isAllowedInDryBox">是否允许进防潮箱</checkbox>
                <checkbox v-model="model.enableRecipients">记录离线品追踪</checkbox>
              </FormItem>
              <FormItem label="条码过站类型">
                <RadioGroup v-model="model.allowBarCodeTypes">
                  <Radio label="">默认</Radio>
                  <Radio v-for="(item, i) in barCodeTypesList" :key="i" :label="item.detailCode">
                    {{ item.detailName }}
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="跳站设置">
                <checkbox v-model="model.forBidSkipIn">禁止跳入</checkbox>
                <checkbox v-model="model.forBidSkipOut">禁止跳出</checkbox>
              </FormItem>
              <FormItem label="复测类型">
                <Input v-model="model.repassDefectType" placeholder="例如:ABB,则要在设备A测一次,设备B测试2次才进FA"></Input>
              </FormItem>
              <FormItem label="首件数量">
                <InputNumber v-model="model.FAICount" :min="0"></InputNumber>
              </FormItem>
              <FormItem label="延迟不良触发站点">
                <Select v-model="model.delayDefectTriggerProcessId" clearable filterable>
                  <Option v-for="(item, index) in nowStationList" :value="item.labelId" :disabled="item.labelId === model.labelId" :key="index">
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </div>
            <div v-show="eleType === 'edge'">
              <FormItem :label="$t('name')">
                <Input v-model="model.label" :placeholder="$t('pleaseEnter') + $t('name')"/>
              </FormItem>
              <!--              <FormItem :label="$t('category')">-->
              <!--                <Select v-model="model.type" :placeholder="$t('pleaseSelect') + $t('name')">-->
              <!--                  <Option value="polyline">折线</Option>-->
              <!--                  <Option value="line">直线</Option>-->
              <!--                </Select>-->
              <!--              </FormItem>-->
              <FormItem label="颜色">
                <ColorPicker v-model="edgeColor" @on-change="edgeColorChange"/>
              </FormItem>
            </div>
            <FormItem v-if="!isPreview">
              <Button type="primary" @click="nodeAttrChange">{{ $t("save") }}</Button>
            </FormItem>
          </Form>
          <!--   设备绑定   -->
          <Form v-if="cellSelected === 'equipmentBind' && eleType === 'node'" :label-width="120" :label-colon="true">
            <!-- 绑定设备 -->
            <FormItem :label="$t('equipmentBind')">
              <v-selectpage
                  class="select-page-style"
                  v-if="modalFlag"
                  key-field="id"
                  :show-field="renderRow"
                  search-field="enCode"
                  multiple
                  :pageSize="selectpageSize > 10 ? selectpageSize : 10"
                  :data="eqpPageListUrl"
                  v-model="eqpIds"
                  :params="{ orderField: 'enCode', ascending: true }"
                  :placeholder="$t('pleaseSelect') + $t('eqpName')"
                  @values="eqpSelectChange"
                  :result-format="
                  (res) => {
                    return {
                      totalRow: res.total,
                      list: res.data || [],
                    };
                  }
                "
              >
              </v-selectpage>
            </FormItem>
            <FormItem label="设备编码">
              <div style="max-height:150px;overflow-y: auto;">{{ eqpCode }}</div>
            </FormItem>
            <FormItem v-if="!isPreview">
              <Button type="primary" @click="eqpBind">{{
                  `${$t("equipmentBind")}${$t("submit")}`
                }}
              </Button>
            </FormItem>
          </Form>
          <!--   QTime设置   -->
          <AttrSetQTime v-if="cellSelected === 'qTime' && eleType === 'node'" :model="model" :optList="optList"
                        :stationList="stationList" :isShow="!isPreview"/>
          <!--   TrackGo设置   -->
          <AttrSetTrackGo ref="refTrackGo" v-show="cellSelected === 'trackGo' && eleType === 'node'"
                          :model="model" :isShow="!isPreview" @on-trackGo-submit="trackChange"/>
          <!--   abb规则   -->
          <Form v-if="cellSelected === 'ABBRule' && eleType === 'node'" :label-width="80" :label-colon="true">
            <!-- abb规则 -->
            <FormItem :label="$t('ABBRule')">
              <Input v-model="model.testAbb" :placeholder="$t('pleaseEnter') + $t('ABBRule')"/>
            </FormItem>
            <FormItem v-if="!isPreview">
              <Button type="primary" @click="abbRule">{{ $t("save") }}</Button>
            </FormItem>
          </Form>
          <!--   抽检计划   -->
          <SamplingConfig v-if="cellSelected === 'samplingConfig' && eleType === 'node'" :model="model"
                          :optList="optList" :isShow="!isPreview"/>
          <!--   抽检标准   -->
          <SamplingStandard v-if="cellSelected === 'samplingStandard' && eleType === 'node'" :model="model"
                            :optList="optList" :isShow="!isPreview"/>
          <!--   生成条码   -->
          <CreateBarCode ref="createBarCode" v-show="cellSelected === 'createBarCode' && eleType === 'node'"
                         :model="model" :isShow="!isPreview" @on-createBarCode-submit="createBarCodeSubmit"/>
        </Card>
      </div>
    </Split>
    <div slot="footer">
      <Button @click="modalCancel">{{ $t("cancel") }}</Button>
    </div>
  </Modal>
</template>

<script>
import {eqpPageListUrl} from "@/api/eqp-manage/eqp-info";
import {pnFormulaPageListUrl} from "@/api/basis-info/pnformula";
import {getlistReq as getdataitemlistReq} from "@/api/system-manager/data-item";
import {addReq as addEqpReq, getlistReq} from "@/api/system-manager/eqp-relation";
import {getProcessStateReq, holdprocessReq, unholdProcessReq} from "@/api/basis-info/wf-route";
import AttrSetQTime from "./attr-set-qTime.vue";
import AttrSetTrackGo from "./attr-set-trackGo.vue";
import SamplingConfig from "./attr-set-samplingConfig.vue";
import SamplingStandard from "./attr-set-samplingStandard.vue";
import CreateBarCode from "./attr-set-createBarCode.vue";
import {errorType} from "@/libs/tools";

export default {
  name: "attr-set",
  components: {AttrSetQTime, AttrSetTrackGo, SamplingConfig, SamplingStandard, CreateBarCode},
  props: {
    // 当前节点数据
    selectElement: {
      type: Object,
      default() {
        return {};
      },
    },
    // 站点数据
    stationList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 当前站点数据
    nowStationList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 当前流程数据
    optList: {
      type: Object,
      default() {
        return {};
      },
    },
    // 当前流程数据
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectpageSize: 10,
      split: 0.2,
      modalFlag: false,
      modalTitle: this.$t("attrSet"),
      eleObj: {},
      model: {},
      eleType: "",
      holdprocess: false, //是否锁定制程
      cellSelected: "trackGo",
      cellList: [
        {name: "trackGo", title: "过站设置"},
        {name: "nodeSet", title: "节点属性"},
        {name: "equipmentBind", title: "设备绑定"},
        {name: "qTime", title: "QTime设置"},
        {name: "ABBRule", title: "ABB规则"},
        {name: "createBarCode", title: "生成条码"},
      ],
      edgeColor: "#999",
      eqpTimer: null,
      eqpPageListUrl: eqpPageListUrl(),
      pnFormulaPageListUrl: pnFormulaPageListUrl(),
      eqpIds: "", // 已选设备id
      eqpCode: "", // 已选设备编码
      eqpIdList: "", // 已选设备id
      barCodeTypesList: [], // 条码过站类型数据
      targetProcessTypeIsSC: false, //下一制程是否包含SC
      renderRow (row) {
        let result = ''
        if(row && Object.keys(row).length)
         result = row.remark ? `<b>${row.enCode}</b> - [${row.remark}]` : `<b>${row.enCode}</b>`
        return result
      }
    };
  },
  computed: {
    trackGoState() {
      return this.model.trackInMethods.length === 0 || this.model.trackOutMethods.length === 0;
    },
  },
  watch: {
    modalFlag(newVal) {
      if (newVal) {
        this.eleObj = this.selectElement || {};
        this.model = this.selectElement.getModel();
        this.model.routeId = this.optList.id
        this.model.repassDefectType = this.model.repassDefectType || ''
        this.model.FAICount = this.model.FAICount || 0
        this.eleType = this.selectElement.get("type");
        this.edgeColor = this.model.style.stroke;
        this.eqpIds = "";
        this.getProcessState();
        if (this.eleType === "node") {
          this.onEqpBind();
          this.cellClick("trackGo");
        }
        //下一制程是否包含SC 置为false
        this.targetProcessTypeIsSC = false;
        let {nodes, edges} = this.optList.graph.save();
        //根据开始连线的source等于当前的id,筛选出下一制程的数据
        let targetList = edges.filter((item) => item.source === this.model.id) || [];
        targetList.map((item) => {
          nodes.map((nodeItem) => {
            if (nodeItem.id === item.target) {
              //如果下一制程否包含SC
              if (nodeItem.processType === "SC") {
                this.targetProcessTypeIsSC = true;
              }
            }
          });
        });
      }
    },
  },
  methods: {
    // 过站改变触发
    trackChange(obj) {
      this.model.trackInMethods = obj.trackInMethods;
      this.model.collectDataMethods = obj.collectDataMethods;
      this.model.trackOutMethods = obj.trackOutMethods;
      if (this.trackGoState)
        this.$Msg.error(`${this.$t("trackIn")}、${this.$t("trackOut")}${this.$t("noEmpty")}`);
      else this.$emit("track-ok", this.model);
    },
    //生成条码保存
    createBarCodeSubmit(obj) {
      this.model.createSnMethods = obj.createSnMethods;
      this.$emit("track-ok", this.model);
    },
    // 节点属性改变
    nodeAttrChange() {
      if (this.eleType === "node") {
        if (this.trackGoState)
          return this.$Msg.error(
              `${this.$t("trackIn")}、${this.$t("trackOut")}${this.$t("noEmpty")}`
          );
        let color = "";
        if (this.model.manual) {
          color = "#ff9900";
        } else if (this.model.flowMain && this.model.necessary) {
          color = "#ed4014";
        } else if (this.model.flowMain && !this.model.necessary) {
          color = "#19be6b";
        } else {
          color = "#990099";
        }
        this.model.style.fill = color;
        this.model.style.stroke = color;
      }
      if (this.model.repassDefectType) this.model.repassDefectType = this.model.repassDefectType.replace(/\s/g, '')
      this.$emit("node-attr-change", this.model);
    },
    // 弹窗取消
    modalCancel() {
      this.modalFlag = false;
      this.cellSelected = "trackGo";
      this.eleObj = {};
      this.model = {};
    },
    // 点击索引条选择触发
    cellClick(name) {
      this.cellSelected = name;
      if (name === "trackGo") {
        const arr = this.model.repassDefectType ? ['RepassMaxCheckAsync'] : []
        this.$refs.refTrackGo.initTrackData({inList: arr});
      }
      if (name === "createBarCode") this.$refs.createBarCode.initData()
      if (name === "nodeSet") this.getDataItemData();
    },
    // 名称下拉选项选中
    nameSelect(node) {
      this.model.label = node.label;
    },
    // 是否为主流程复选框改变
    flowMainChange(val) {
      if (!val) this.model.necessary = val;
    },
    //是否锁定制程复选框改变
    holdprocessChange(value) {
      if (this.isPreview) return;
      let obj = {routeId: this.optList.id, processId: this.model.labelId};
      if (value) {
        holdprocessReq(obj).then((res) => {
          if (res.code === 200) {
            this.$Message.success(`${this.$t("success")}`);
          } else this.$Msg.error(`${this.$t("fail")},${errorType(this, res)}`);
        });
      } else {
        unholdProcessReq(obj).then((res) => {
          if (res.code === 200) {
            this.$Message.success(`${this.$t("success")}`);
          } else this.$Msg.error(`${this.$t("fail")},${errorType(this, res)}`);
        });
      }
    },
    // 边颜色改变触发
    edgeColorChange(val) {
      this.edgeColor = val || "#999";
      this.model.style.stroke = this.edgeColor;
      this.model.style.endArrow.fill = this.edgeColor;
    },
    // 设备信息改变
    eqpSelectChange(data) {
      this.eqpIds = data.length ? data.map((o) => o.id).join(",") : "";
      this.eqpCode = data.length ? data.map((o) => o.enCode) : "";
    },
    // 获取已绑定设备信息
    async getEqpBindData(obj) {
      let arr = [];
      await getlistReq({...obj, enabled: 1}).then((res) => {
        if (res.code === 200) {
          arr = res.result || [];
        }
      });
      return arr;
    },
    // 获取已绑定设备
    async onEqpBind() {
      this.eqpIdList = await this.getEqpBindData({
        routeId: this.optList.id,
        processId: this.model.labelId,
      });
      this.selectpageSize = this.eqpIdList.length;
      this.eqpIds = this.eqpIdList.length ? this.eqpIdList.map((o) => o.eqpId).join(",") : "";
    },
    // 设备绑定
    eqpBind() {
      if (this.trackGoState)
        this.$Msg.error(`${this.$t("trackIn")}、${this.$t("trackOut")}${this.$t("noEmpty")}`);
      else {
        if (!this.eqpIds) return this.$Msg.error(`${this.$t("equipment")}${this.$t("noEmpty")}`);
        const obj = {
          eqpIds: this.eqpIds.split(","),
          processId: this.model.labelId,
          routeId: this.optList.id,
          enabled: 1,
        };
        addEqpReq(obj).then((res) => {
          if (res.code === 200) {
            this.$Message.success(`${this.$t("success")}`);
          } else this.$Msg.error(`${this.$t("fail")},${errorType(this, res)}`);
        });
      }
    },
    //add规则提交
    abbRule() {
      this.$emit("node-attr-change", this.model);
    },
    //获取锁定制程状态
    getProcessState() {
      getProcessStateReq({routeId: this.optList.id, processId: this.model.labelId}).then(
          (res) => {
            if (res.code === 200) {
              this.holdprocess = res.message === 'hold';
            }
          }
      );
    },
    // 点击编码规则中的加号按钮触发
    async getDataItemData() {
      this.barCodeTypesList = await this.getDataItemDetailList("AllowBarCodeTypes");
    },
    async getDataItemDetailList(itemCode) {
      const obj = {itemCode, enabled: 1};
      let arr = [];
      await getdataitemlistReq(obj).then((res) => {
        if (res.code === 200) arr = res.result || [];
      });
      return arr;
    },
  },
};
</script>

<style scoped lang="less">
.attr-set-height {
  height: 420px;
}

.split-left-style {
  height: 100%;
  overflow-y: auto;
}

.split-right-style {
  //.split-left-style;
  padding-left: 7px;
}
</style>
