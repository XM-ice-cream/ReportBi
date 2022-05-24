<template>
  <div>
    <Row class="expand-row">
      <Col span="8">
      <span class="expand-key">FA 回复人员: </span>
      <span class="expand-value">{{ row.fA_EMPNO }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">FA 回复时间: </span>
      <span class="expand-value">{{formatDate(row.fA_TIME)  }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">FA 回复信息: </span>
      <span class="expand-value">{{ row.fA_MSG }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">CA 回复人员: </span>
      <span class="expand-value">{{ row.cA_EMPNO }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">CA 回复时间: </span>
      <span class="expand-value">{{formatDate(row.cA_TIME ) }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">CA 回复信息: </span>
      <span class="expand-value">{{ row.cA_MSG }}</span>
      </Col>

      <Col span="8">
      <span class="expand-key">Q 回复人员: </span>
      <span class="expand-value">{{ row.q_EMPNO }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">Q 回复时间: </span>
      <span class="expand-value">{{formatDate(row.q_TIME)  }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">Q 回复信息: </span>
      <span class="expand-value">{{ row.q_MSG }}</span>
      </Col>

    </Row>
  </div>
</template>
<script>
import { formatDate } from "@/libs/tools";

export default {
  props: {
    row: Object
  },
  data () {
    return {
      formatDate: formatDate
    }
  },
  watch: {
    row () {
      console.log(this.row);
    }
  }
};
</script>
<style scoped lang="less">
.expand-row {
  margin-bottom: 16px;
  .expand-key {
    font-weight: bold;
    display: inline-block;
    width: 6rem;
    text-align: right;
    padding-right: 0.8rem;
  }
}
.expand-row .ivu-col {
  padding: 0.3rem 1rem;
}
</style>