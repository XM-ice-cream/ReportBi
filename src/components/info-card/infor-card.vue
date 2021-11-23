<template>
  <Card :shadow="shadow" class="info-card-wrapper" :padding="12">
    <div slot="title">
      <span class="card-title">{{cardTitle}}</span>
    </div>
    <div slot="extra" class="info-card-tag">
      <Tag type="border" v-show="cardTag" color="#999">{{cardTag}}</Tag>
    </div>
    <slot></slot>
    <div class="info-card-footer"><span>{{cardFooterTitle}}<span>{{cardFooterValue}}</span></span></div>
  </Card>
</template>

<script>

  export default {
    name: 'InforCard',
    props: {
      shadow: {
        type: Boolean,
        default: false
      },
      cardTitle: {
        type: String,
        default: ''
      },
      cardTag: {
        type: String,
        default: ''
      },
      cardFooterTitle: {
        type: String,
        default: ''
      },
      cardFooterValue: {
        type: [Number, String],
        default: null
      }
    },
    computed: {
    }
  }
</script>

<style lang="less">
  .info-card-wrapper {
    .ivu-card-head {
      border-bottom:none;
      padding: 24px 16px 0px 18px;
    }
    .card-total {
      height: 38px;
      overflow: hidden;
      color: rgba(0,0,0,.85);
      font-size: 24px;
      line-height: 38px;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: -apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol,noto color emoji;
    }
  }
</style>
<style scoped lang="less">
  .card-title {
    color: rgba(0,0,0,.45);
    font-size: 14px;
  }
  .info-card-tag {
    position: absolute;
    right: -6px;
    top: 3px;
  }
  .info-card-footer {
    display: flex;
    justify-content: space-between;
    height: 30px;
    margin-top: 10px;
    padding-top: 15px;
    border-top: 1px solid #f0f0f0;
    font-size: 14px;
    color:#000;
    >span {
      >span {
        padding-left: 5px;
      }
    }
  }
</style>
