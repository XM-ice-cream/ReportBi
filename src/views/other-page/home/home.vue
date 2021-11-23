<template>
  <div class="page-style overflowY home-style">
    <div class="header-content">
      <div class="container-detail">
        <div class="avatar">
          <span class="avatar-image">
            <avatar-custom :imgUrl="headIcon" v-if="headIcon"></avatar-custom>
            <img class="head-portrait" src="../../../assets/images/default-head.png" v-else>
          </span>
          <div class="avatar-bg" :class="changeVipLevel(vipLevel)"></div>
        </div>
        <div class="avatar-content">
          <div class="content-title">{{ hoursTip }}，{{ userName }}，{{ textTip }}</div>
          <div>
            <span title="LV等级根据登录天数提升" style="color: #484848">LV{{ vipLevel }}</span> |
            <span title="系统版本号" style="color: #f47920"> v{{ infoObj.systemVersion }}</span>
            | {{ email }} | {{ userIP }}
          </div>
          <div class="online-user">
            <p class="online-title">{{ $t('onlineUser') }}</p>
            <p class="online-total">{{ infoObj.userLine }} / {{ infoObj.userTotal }}</p>
          </div>
        </div>
      </div>
    </div>
    <!--信息卡片-->
    <div class="home-bottom">
      <div class="home-bottom-title">更新动态</div>
      <div class="time-line">
        <div class="time-content" v-for="(item, i) in versionList" :key="i">
          <h3 class="time-content-title">{{ item.version }} {{ item.title }}</h3>
          <pre class="content" v-html="item.content"></pre>
          <div class="time">
            <span style="padding-right: 5px;color:#4fcc72">{{ item.createUserName }} </span>
            <span style="color:rgba(0,0,0,.45);padding-right: 5px">发布更新</span>
            <span>{{ item.formCreateDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getindexjsonReq,} from "@/api/organize-manager/user-manager";
import {getpagelistReq} from "@/api/system-manager/developer-center";
import {formatDate} from "@/libs/tools";
import AvatarCustom from '@/components/avatar-custom'

export default {
  name: "home",
  components: {AvatarCustom},
  data() {
    return {
      modalFlag: false,
      modalTitle: "",
      navIndex: null,
      qr: {
        text: "功能开发中......",
      },
      bar: {
        barValue: "~VSUFCR.",
        barList: [
          {
            name: "设置为回车结尾",
            text: "~VSUFCR.",
          },
          {
            name: "设置为table结尾",
            text: "~SUFBK29909.",
          },
          {
            name: "删除末尾",
            text: "~SUFCA2.",
          },
        ],
      },
      carrierObj: {
        carrierCode: "",
        carrierValue: "",
        carrierCount: 0,
        codeColor: "",
      },
      infoObj: {
        systemName: "",
        systemVersion: "",
        userTotal: 0,
        userLine: 0,
        userActive: 0,
        pVDay: 0,
        pVYear: 0,
        apiDay: 0,
        apiYear: 0,
      },
      navList: [
        {
          iconName: "iconfont icon-bar_code",
          iconColor: "#4ab91c",
          navName: this.$t("barCodeSetting"),
          id: 'barCodeSetting'
        },
        {iconName: "iconfont icon-qr_code", iconColor: "#FF3333", navName: this.$t("qrCode"), id: 'qrCode'},
        {iconName: "iconfont icon-check", iconColor: "#CCFF99", navName: this.$t("carrierCheck"), id: 'carrierCheck'},
        {
          iconName: "iconfont icon-barchart",
          iconColor: "#6699FF",
          navName: this.$t("publicReport"),
          id: 'publicReport'
        },
        // {iconName: "iconfont icon-mobile", iconColor: "#66CC33", navName: "白泽TV",id:'tv'},
        {iconName: "iconfont icon-paper", iconColor: "#66CCFF", navName: "流程控制台", id: 'flowConsole'},
        // {
        //   iconName: "iconfont icon-paper",
        //   iconColor: "#66FF66",
        //   navName: this.$t("chatAuthorization"),
        //   id:chatAuthorization
        // },
        {iconName: "iconfont icon-buliang", iconColor: "#996699", navName: "错误代码", id: 'errorCode'},
      ],
      versionList: [],
      userIP: this.$store.state.ip,
      headIcon: this.$store.state.avatarImgPath,
      userName: this.$store.state.userName,
      email: this.$store.state.email,
      phone: this.$store.state.phone,
      vipLevel: this.$store.state.vipLevel,
      selectPageVal: "",
      hoursTip: '',
      textTip: '祝你开心每一天！',
      textList: [
        '不能改变世界，那你试过改变自己吗?',
        '祝你开心每一天！',
        '云破日出，你是那道光束。',
        '未来还长，梦想还远，余生的路，不在敷衍。',
        '活出生命辽阔，拥有选择的权利。',
        '此刻想举重若轻，之前必要负重前行。',
        '这一生，你唯一要完成的KPI，就是做自己。',
        '不管有多少沮丧，别对自己失望好吗，好春光不必趁早，那些辜负你的总会奔赴而来。',
        '人生的可能，就是选择相信。',
        '在江湖上想要被看见，要学会亮剑，我已经出招，你呢?',
        '逆风的方向，更适合飞翔。',
        '总有一天，光会为你而来。',
        '青春是不计后果的勇敢，成长是看清真相后的坚持。',
        '未来还长，梦想还远，余生的路不再敷衍。',
        '生活是自己的，创造自己的答案，我要我觉得，不要你觉得。',
        '下一个夏天，要再勇敢一点。',
        '你只要放下烦恼，且听风吟就好。',
        '人生苦短要勇敢，翻一座山，追一个梦，爱一个人。',
        '那个你想到达的地方，念念不忘，必有回响。',
        '不管今年多少岁，只要你觉得每一天都值得，就是不负好年华。',
        '苦心人，天不负，卧薪尝胆，三千越甲可吞吴。',
        '仲夏，尝完这口甜，就去跟世界和解。',
        '有韧性，更任性。',
        '那些不期而会的遇到，才是无招胜有招。',
        '生活很苦，偶尔要学会加一点甜。',
        '生活从来不平等，你有多努力，才能有多特殊。',
        '等云开雾散的那天，去见你想见的那个人吧。跑着去~',
        '交出一部分自己的青春，来换谁也偷不走的阅历。',
        '和生活单挑时，每刺出致胜一剑，你就有资格为自己加冕。',
        '努力的意义，就是给爸妈花钱的时候可以毫不犹豫。',
        '你未必光芒万丈，但你的一点温暖，却能照亮远方。',
        '若想胜券在握，就得关关难过，关关过。',
        '你若要纵情撒野，今生我把酒奉陪。',
      ]
    }
  },
  mounted() {
    this.$Message.destroy();
    this.getIndexJson();
    this.getVersionData();
    this.changeTips()
    this.changeText()
  },
  methods: {
    // 获取首页数据
    getIndexJson() {
      getindexjsonReq().then((res) => {
        if (res.code === 200) {
          this.infoObj.systemName = res.result.systemName;
          this.infoObj.systemVersion = res.result.systemCoreVersion;
          this.infoObj.userTotal = res.result.userTotalCount;
          this.infoObj.userActive = res.result.userActiveCount;
          this.infoObj.userLine = res.result.userOnLineCount;
          this.infoObj.pVDay = res.result.pvDay;
          this.infoObj.pVYear = res.result.pvYear;
          this.infoObj.apiDay = res.result.apiDay;
          this.infoObj.apiYear = res.result.apiYear;
        }
      });
    },
    // 获取版本数据
    getVersionData() {
      const obj = {
        orderField: "id", // 排序字段
        ascending: false, // 是否升序
        pageSize: 50, // 分页大小
        pageIndex: 1, // 当前页码
        data: {enabled: 1},
      };
      getpagelistReq(obj).then((res) => {
        if (res.code === 200) {
          this.versionList = res.result.data || [];
          this.versionList.forEach((o) => {
            o.formCreateDate = formatDate(o.createDate) || null;
          });
        }
      });
    },
    // 弹窗取消事件
    modalCancel() {
      this.modalFlag = false;
      this.modalTitle = "";
      this.navIndex = null;
      this.carrierObj.carrierCount = 0;
      this.carrierObj.carrierValue = "";
      this.carrierObj.carrierCode = "";
      this.carrierObj.codeColor = "";
    },
    // 判断当前时间
    changeTips() {
      let date = new Date();
      if (date.getHours() >= 0 && date.getHours() < 12) {
        this.hoursTip = "早安"
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        this.hoursTip = "午安"
      } else {
        this.hoursTip = "晚上好"
      }
    },
    changeText() {
      let randomTextIndex = Math.round(Math.random() * this.textList.length);
      this.textTip = this.textList[randomTextIndex]
    },
    changeVipLevel(val) {
      const state = {
        0: "v0",
        1: "v1",
        2: "v2",
        3: "v3",
        4: "v4",
        5: "v5",
        6: "v6",
      };
      return state[val];
    }
  }
}
</script>

<style>
.avatar-image .ivu-avatar {
  width: 100%;
  height: 100%;
  vertical-align: middle;
  margin: 0 auto;
}

</style>
<style scoped lang="less">
.home-style {
  background-color: #f0f2f5;
}

.header-content {
  padding: 12px 30px;
  margin-bottom: 10px;
  background: #fff;

  .container-detail {
    display: flex;

    .avatar {
      flex: 0 1 72px;
      position: relative;

      &:hover {
        // 头像旋转
        transform: rotate(666turn);
        transition: all 59s cubic-bezier(.34, 0, .84, 1) 1s;
      }

      .avatar-image {
        display: block;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: #bbf1ca;
        overflow: hidden;

        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .head-portrait {
          width: 78%;
          height: auto;
          margin: 0 auto;
          padding-top: 6px;
        }
      }
    }

    .avatar-bg {
      width: 120px;
      height: 120px;
      position: absolute;
      top: -25px;
      left: -25px;
    }

    .v0 {
      width: 99px;
      height: 99px;
      top: -15px;
      left: -16px;
      background: url("../../../assets/images/v0.gif") no-repeat;
      background-size: 100% 100%;
    }

    .v1 {
      background: url("../../../assets/images/v1.gif") no-repeat;
      background-size: 100% 100%;
    }

    .v2 {
      background: url("../../../assets/images/v1.gif") no-repeat;
      background-size: 100% 100%;
    }

    .v3 {
      background: url("../../../assets/images/v2.gif") no-repeat;
      background-size: 100% 100%;
    }

    .v4 {
      background: url("../../../assets/images/v2.gif") no-repeat;
      background-size: 100% 100%;
    }

    .v5 {
      background: url("../../../assets/images/v3.gif") no-repeat;
      background-size: 100% 100%;
    }

    .v6 {
      background: url("../../../assets/images/v3.gif") no-repeat;
      background-size: 100% 100%;
    }

    .avatar-content {
      position: relative;
      top: 4px;
      flex: 1 1 auto;
      margin-left: 24px;
      color: rgba(0, 0, 0, .45);
      line-height: 22px;

      .content-title {
        margin-bottom: 12px;
        color: rgba(0, 0, 0, .85);
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
      }
    }

    .online-user {
      text-align: center;
      position: absolute;
      right: 0;
      bottom: 18px;

      .online-title {
        margin-bottom: 10px;
        color: rgba(0, 0, 0, .45);
        font-size: 14px;
      }

      .online-total {
        color: rgba(0, 0, 0, .85);
        font-size: 24px;
      }
    }
  }
}

.home-bottom {
  height: calc(100% - 110px);
  margin: 0 8px;
  background-color: #fff;

  .home-bottom-title {
    margin: 0 auto;
    font-size: 16px;
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba(0, 0, 0, 0.85);
  }

  .time-line {
    padding: 16px;
    overflow-y: auto;
    height: calc(100% - 49px);

    .time-content {
      width: 100%;
      border-bottom: 1px solid #f0f0f0;
      padding: 12px 16px;
      line-height: 1.6;

      .time-content-title {
        font-size: 16px;
      }
    }

    .time {
      font-size: 14px;
      margin: 5px 0;
      color: rgba(0, 0, 0, .25);
    }

    pre {
      font-size: 14px;
    }
  }
}

.time-line::-webkit-scrollbar {
  width: 5px;
}

.time-line::-webkit-scrollbar-thumb {
  background-color: rgba(197, 198, 199, 0.4);
}
</style>
