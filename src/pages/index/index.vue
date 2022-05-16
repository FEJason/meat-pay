<template>
  <div>
    <div class="header-wrap">
      <div class="header-img">
        <img src="@/assets/img/home/home-header-01.png" alt="img">
      </div>
      <div class="header-text">
        <h2 v-text="$t('home.qqzaq')">全球最安全的C2C交易平台</h2>
        <p v-text="$t('home.mmszhb')">在EXPAY您可以安全便携，0 手续费买卖数字货币</p>
        <Button style="min-width: 160px;" size="large"
          to="/otc/trade/buy-usdt" v-text="$t('home.ljgm')">立即购买</Button>
      </div>
    </div>
    <div class="page-content">
      <Table class="hidden-xs" disabled-hover :columns="columns1" :data="listData" @on-row-click="onRowClick" size="large">
        <template slot-scope="{ row, index }" slot="currency">
          <div class="u-flex">
            <img :src="row.imageUrl" alt="icon" style="width: 26px; height: 26px;">
            <span class="u-p-l-10">{{ row.currency }}</span>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="price">
          <div>{{ toFixeds(row.price) }}</div>
        </template>
        <template slot-scope="{ row, index }" slot="marketCap">
          <div>{{ toFixeds(row.marketCap / 100000000) }}{{$t('home.yi')}} </div>
        </template>
        <template slot-scope="{ row, index }" slot="percentChange24h">
          <div :class="parseFloat(row.percentChange24h) < 0 ? 'sell' : parseFloat(row.percentChange24h) > 0 ? 'buy' : ''">
            {{ parseFloat(row.percentChange24h) > 0 ? '+' : '' }}{{ toFixeds(row.percentChange24h) }}%
          </div>
        </template>
      </Table>

      <div class="table-wrap-xs hidden-lg">
        <div class="th u-flex u-row-between">
          <span style="width: 10%">#</span>
          <span class="u-flex-1" v-text="$t('home.bz')">币种</span>
          <span class="u-flex-1" v-text="$t('home.zxj')">最新价$</span>
          <span style="width: 20%">24h{{$t('home.zdf')}}</span>
        </div>
        <div class="u-flex u-row-between u-p-t-28 u-p-b-28"
          v-for="row in listData" :key="row.cmcRank"
          @click="onRowClick(row)">
          <div style="width: 10%">{{row.cmcRank}}</div>
          <div class="u-flex u-flex-1">
            <img :src="row.imageUrl" alt="icon" style="width: 20px; height: 20px;">
            <span class="u-p-l-10">{{ row.currency }}</span>
          </div>
          <div class="u-flex-1">{{ toFixeds(row.price) }}</div>
          <div style="width: 20%" :class="parseFloat(row.percentChange24h) < 0 ? 'sell' : parseFloat(row.percentChange24h) > 0 ? 'buy' : ''">
            {{ parseFloat(row.percentChange24h) > 0 ? '+' : '' }}{{ toFixeds(row.percentChange24h) }}%
          </div>
        </div>
      </div>
    </div>
    <div class="content section-a hidden-xs">
      <div>
        <div class="title" v-text="$t('home.aqbjjy')">安全便捷交易</div>
        <Row type="flex" justify="space-between">
          <Col span="6">
            <div class="ser">Step 1</div>
            <div class="img-wrap">
              <img src="@/assets/img/home/home-icon-01.png" alt="img">
            </div>
            <h3 v-text="$t('home.xzgg')">选择广告</h3>
            <p v-text="$t('home.xznxyjy')">选择您想要交易的数字货币，筛选法币或支付方式，选择一个广告，点击购买。</p>
          </Col>
          <Col span="6">
            <div class="ser">Step 2</div>
            <div class="img-wrap">
              <img src="@/assets/img/home/home-icon-02.png" alt="img">
            </div>
            <h3 v-text="$t('home.xiadd')">下订单</h3>
            <p v-text="$t('home.shurgm')">输入购买数量，选择支付方式，然后按照卖家提供的收款方式线下转账给商家。</p>
          </Col>
          <Col span="6">
            <div class="ser">Step 3</div>
            <div class="img-wrap">
              <img src="@/assets/img/home/home-icon-03.png" alt="img">
            </div>
            <h3 v-text="$t('home.wczz')">完成转账</h3>
            <p v-text="$t('home.anzxs')">按照显示给您的付款说明进行操作。支付完成后，通知对方释放数字资产。</p>
          </Col>
        </Row>
      </div>
    </div>
    <div class="section-b hidden-xs">
      <div class="content">
        <h3 v-text="$t('home.zhiffs50')">50多种支付方式</h3>
        <p v-text="$t('home.womdzzs')">我们的宗旨是为全球各地的用户提供对点交易数字货币的服务</p>
      </div>
    </div>
    <div class="adv-wrap hidden-xs u-flex u-row-between">
      <div class="left">
        <div class="title">Expay{{$t('home.dys')}}</div>
        <ul>
          <li class="u-flex">
            <div class="l">
              <img src="@assets/img/home/adv-01.png" alt="icon" style="width: 44px; height: 44px;">
            </div>
            <div class="r u-p-l-20">
              <h2 v-text="$t('home.aqkk')">安全可靠</h2>
              <p v-text="$t('home.qwzy')">全网最严风控，T+1与T+2提现限制。人脸识别+大数据甄别洗钱及欺诈行为。</p>
            </div>
          </li>
          <li class="u-flex">
            <div class="l">
              <img src="@assets/img/home/adv-02.png" alt="icon" style="width: 44px; height: 44px;">
            </div>
            <div class="r u-p-l-20">
              <h2 v-text="$t('home.qqfg')">全球覆盖</h2>
              <p v-text="$t('home.wlnszhc')">无论您身在何处，Expay都能为您提供支持，支持50多种支付方式及10多种法币，服务全球用户。</p>
            </div>
          </li>
          <li class="u-flex">
            <div class="l">
              <img src="@/assets/img/home/adv-03.png" alt="icon" style="width: 44px; height: 44px;">
            </div>
            <div class="r u-p-l-20">
              <h2 v-text="$t('home.xd0sxf')">下单0手续费</h2>
              <p v-text="$t('home.yhkyz')">用户可以在Expay平台上下单购买或出售数字货币，享受0手续费优惠。</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="right u-text-center">
        <img src="@/assets/img/home/adv-04.png" alt="image" style="width: 650px;">
      </div>
    </div>
    <div class="section-a section-d hidden-xs">
      <div class="content">
        <div class="tit" v-text="$t('home.shangjjh')">Expay商家计划</div>
        <Row type="flex" justify="space-between">
          <Col span="7" class-name="item">
            <div class="img-wrap">
              <img src="@/assets/img/home/home-icon-04.png" alt="img">
            </div>
            <h3 v-text="$t('home.fee0')">0手续费发广告</h3>
            <p v-text="$t('home.zaiqqy')">Expay在全球有超过5000位联盟商家，超低手续费发布购买或出售广告。</p>
          </Col>
          <Col span="7" class-name="item">
            <div class="img-wrap">
              <img src="@/assets/img/home/home-icon-05.png" alt="img">
            </div>
            <h3 v-text="$t('home.tequan')">VIP特权</h3>
            <p v-text="$t('home.lianmsj')">Expay联盟商家享受VIP特权，更低手续费，快速交易，定期线下沟通等。</p>
          </Col>
          <Col span="7" class-name="item">
            <div class="img-wrap">
              <img src="@/assets/img/home/home-icon-06.png" alt="img">
            </div>
            <h3 v-text="$t('home.kehzc')">24/7客户支持</h3>
            <p v-text="$t('home.lianmsjzsku')">Expay联盟商家享受专属客户服务，24/7小时全球客服为您解决订单问题。</p>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import { commonRank } from '@/api/home'
export default {
  data() {
    return {
      page: {
        current: 1,
        size: 10
      },
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          // 币种
          title: this.$t('home.bz'),
          width: 200,
          slot: 'currency',
        },
        {
          // 最新价
          title: `${this.$t('home.zxj')}$`,
          slot: 'price',
          width: 200,
          align: 'right'
        },
        {
          // 流通市值
          title: `${this.$t('home.ltsz')}$`,
          slot: 'marketCap',
          width: 300,
          align: 'right'
        },
        {
          // 24h涨跌幅
          title: `24h${this.$t('home.zdf')}`,
          slot: 'percentChange24h',
          align: 'center'
        },
      ],
      listData: [],
    }
  },
  created() {
    this.commonRank()
  },
  methods: {
    /* 获取首页币种列表 */
    commonRank() {
      commonRank({
        current: this.page.current,
        size: this.page.size
      }).then(res => {
        this.listData = res.records
      })
    },
    /* 点击某一行 */
    onRowClick(row) {
      this.$router.push(`/otc/trade/buy-${row.currency.toLowerCase()}`)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ivu-table-header thead tr th {
  font-size: 16px !important;
}
::v-deep .ivu-table-row {
  cursor: pointer;
}
.buy {
    color: #00b275 !important;
    font-weight: bold;
}

.sell {
    color: #f15057 !important;
    font-weight: bold;
}

.content {
  width: 1200px;
  margin: 0 auto;
}
.header-wrap {
  position: relative;
  width: 100%;
  height: 498px;
  overflow: hidden;
  background: #3C4152;
  // background: linear-gradient(135deg, #4E5F74 0%, #2F3A4E 100%);
  .header-img {
    position: absolute;
    left: 0;
    top: 160px;
    width: 100%;
    text-align: center;
  }
  .header-text {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    h2 {
      font-size: 56px;
      font-weight: bold !important;
      padding-top: 108px;
    }
    p {
      font-size: 20px;
      margin: 22px 0;
    }
  }
}
.page-content {
  width: 1200px;
  margin: -120px auto 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 28px 32px rgb(0 0 0 / 6%);
}
.adv-wrap {
  width: 1200px;
  margin: 0 auto;
  padding: 60px 0 40px;
  .left {
    width: 400px;
    li {
      padding-bottom: 60px;
    }
    .title {
      font-size: 40px;
      font-weight: bold;
      margin-bottom: 60px;
    }
    .r {
      h2 {
        font-size: 24px;
        font-weight: 700 !important;
      }
    }
  }
  .right {
    flex: 1;
  }
}
.table-wrap-xs {
  padding: 10px;
}
.section-a {
  margin-top: 80px;
  .title {
    position: relative;
    width: 100%;
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    margin: 38px 0;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 40%;
      height: 1px;
      background-color: #eee;
    }
    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      width: 40%;
      height: 1px;
      background-color: #eee;
    }
  }
  .ser, .img-wrap {
    padding: 12px 0;
  }
  h3 {
    font-size: 24px;
    font-weight: 700 !important;
    padding-bottom: 12px;
  }
  p {
    font-size: 14px;
    line-height: 20px;
    color: #707A8A;
  }
}
.section-b {
  text-align: center;
  background-color: #445368;
  color: #fff;
  padding: 38px 0;
  margin-top: 80px;
  h3 {
    font-weight: 700 !important;
    font-size: 40px;
    line-height: 48px;
    padding-bottom: 22px;
  }
  p {
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
  }
}
.section-d {
  padding: 44px 0 82px;
  background-color: #FAFAFA;
  .tit {
    font-weight: 700;
    font-size: 40px;
    line-height: 48px;
    padding-bottom: 50px;
  }
  .item {
    padding: 21px 33px;
    background-color: #FFFFFF;
    border: 1px solid #EAECEF;
    border-radius: 16px;
    .img-wrap {
      padding-top: 0;
    }
    p {
      font-size: 20px;
      line-height: 28px;
    }
  }
}
/* 手机端 */
@media (max-width: 767px) {
  .header-wrap {
    height: 200px;
    .header-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .header-text {
      h2 {
        font-size: 28px;
        padding-top: 18px;
      }
      p {
        font-size: 16px;
      }
    }
  }

  .page-content {
    width: 100%;
    margin-top: 0;
  }
}
</style>