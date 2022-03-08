<template>
  <div class="wrap">
    <div class="content-wrap">
      <div class="content">
        <div class="tit u-p-20 u-flex u-row-between">
          <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 0">{{ $t('orderInfo.ddyqx') }}</div>
          <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 1">
            <div v-if="!orderInfo.isAcceptor">{{ $t('orderInfo.dwzf') }}</div>
            <div v-if="orderInfo.isAcceptor">{{ $t('orderInfo.ddfzf') }}</div>
            <div>
              <div class="u-font-14">
                <u-count-down
                  ref="uCount"
                  font-size="20"
                  :timestamp="timestamp"
                  :show-days="false"
                  :show-hours="false"
                  color="#515a6e"
                  separatorColor="#515a6e"
                  @end="countDownEnd"></u-count-down>
                {{ $t('orderInfo.qxdd') }}
              </div>
            </div>
          </div>
          <div class="u-font-20 u-font-bold" v-if="!orderInfo.isAcceptor && orderInfo.status == 2">{{ $t('orderInfo.ddmjqr') }}</div>
          <div class="u-font-20 u-font-bold" v-if="orderInfo.isAcceptor && orderInfo.status == 2">{{ $t('orderInfo.dwfb') }}</div>
          <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 3">{{ $t('orderInfo.ss') }}</div>
          <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 4">
            {{ $t('orderInfo.ywc') }}
          </div>
          
          <div>
            <span class="u-font-14">{{ $t('orderInfo.ddbh') }} {{ orderInfo.id }}</span>
            <!-- |  -->
            <!-- <span class="u-font-14">付款参考号: 888888</span> -->
          </div>
        </div>
        <div class="info u-p-20">
          <div class="u-flex u-font-18">
            <div class="u-p-r-30">
              <div class="u-font-14">{{ $t('orderInfo.zj') }}</div>
              <div style="color: #19be6b" class="u-font-bold">{{ orderInfo.sourceAmount }} {{ orderInfo.fiatCurrency}}</div>
            </div>
            <div class="u-p-r-30">
              <div class="u-font-14">{{ $t('orderInfo.sl') }}</div>
              <div class="u-font-bold">{{ orderInfo.settleAccount }} {{ orderInfo.currencyName }}</div>
            </div>
            <div>
              <div class="u-font-14">{{ $t('orderInfo.dj') }}</div>
              <div class="u-font-bold">{{ orderInfo.tradePrice }} {{ orderInfo.fiatCurrency }}</div>
            </div>
          </div>
          
          <div class="u-flex u-p-t-30">
            <span style="width: 100px;" class="u-font-14">{{ $t('orderInfo.mjskfs') }}</span>
            <span style="width: 100%; height: 1px; border-bottom: 1px solid #515a6e"></span>
          </div>
          <div v-if="orderInfo.status != 0">
            <div class="init u-flex u-m-t-30" v-if="!orderInfo.isAcceptor">
              <Icon type="ios-alert" size="20" sytle="color: #f90"/>
              <span class="u-p-l-8" style="color: #333">{{ $t('orderInfo.qwbsy') }}（李四）{{ $t('orderInfo.zxzz') }}</span>
            </div>
            <div class="u-m-t-30 u-flex u-font-14" v-for="(item, index) in orderInfo.paymentList" :key="item.paymentId">
              <span class="u-m-r-30 icon-btn" style="color: #f90">
                {{ item.payTypeId == 4 ? $t('trade.zfb') : item.payTypeId == 3 ? $t('trade.wx') : $t('trade.yhk')}}
              </span>

              <span class="u-p-r-30">{{ item.kycName }}</span>
              <span class="u-p-r-30">{{ item.account }}</span>
              <span>{{ item.accountInfo }}</span>
            </div>
            <div class="u-flex u-m-t-30">
              <Button type="primary" @click="confirmModel = true" v-if="orderInfo.status == 1 && !orderInfo.isAcceptor">我已转账，下一步</Button>
              <Button type="primary" @click="receivedModal = true" v-if="orderInfo.isAcceptor && orderInfo.status == 2">我已收到转账，下一步</Button>

              <div v-if="orderInfo.status == 2 && !orderInfo.isAcceptor">
                <span class="u-p-r-10">{{ $t('orderInfo.ddmj') }}</span>
                <Button type="primary" @click="">{{ $t('orderInfo.ss') }}</Button>
              </div>
            </div>
            <div class="u-text-right">
              <Button type="text">{{ $t('orderInfo.lxkf') }}</Button>
              <Button type="text" v-if="orderInfo.status == 1" @click="cancelModel = true">{{ $t('orderInfo.qxd') }}</Button>
            </div>
          </div>
          <div class="order-cancel" v-if="orderInfo.status == 0">
            <div class="u-p-t-20">
              <Icon type="ios-eye-off" size="50"/>
            </div>
            <div class="u-p-t-20">{{ $t('orderInfo.bkck') }}</div>
            <div class="u-p-t-40">{{ $t('orderInfo.ryyw') }}</div>
            <div class="u-p-t-10">
              <Button type="text">{{ $t('orderInfo.lxkf') }}</Button>
            </div>
          </div>
          
        </div>
        
      </div>

      <div class="bot-info u-p-t-40">
        <p>1. {{ $t('orderInfo.mjzsxm') }}</p>
        <p>2. {{ $t('orderInfo.xmjfk') }}</p>
        <p>3. {{ $t('orderInfo.qryfk') }}</p>
      </div>
    </div>

    <Modal v-model="confirmModel"
      :mask-closable="false"
      draggable scrollable :title="$t('orderInfo.qrzf')"
      :footer-hide="true">
        <div slot="header" class="u-font-20">{{ $t('orderInfo.qrzf') }}</div>
        <div class="u-p-t-20 u-p-b-20">{{ $t('orderInfo.wwczf') }}</div>
        <div class="u-flex u-row-right">
          <Button type="text" @click="confirmModel = false">{{ $t('orderInfo.qx') }}</Button>
          <Button type="primary" @click="confirmPayment">{{ $t('orderInfo.qr') }}</Button>
        </div>
    </Modal>

    <!-- 确认收到转账 -->
    <Modal v-model="receivedModal"
      :mask-closable="false"
      draggable scrollable :title="$t('orderInfo.qrfx')"
      :footer-hide="true">
        <div slot="header" class="u-font-20">{{ $t('orderInfo.qrfx') }}</div>
        <div class="u-p-t-20 u-p-b-20">{{ $t('orderInfo.qwbdl') }}</div>
        <div class="u-flex u-row-right">
          <Button type="text" @click="receivedModal = false">{{ $t('orderInfo.qx') }}</Button>
          <Button type="primary" @click="confirmCollection">{{ $t('orderInfo.qr') }}</Button>
        </div>
    </Modal>

    <Modal v-model="cancelModel"
      :mask-closable="false"
      draggable scrollable :title="$t('orderInfo.qxd')"
      :footer-hide="true">
        <div class="title u-font-20" slot="header">{{ $t('orderInfo.qxd') }}</div>
        <div class="cancel-model">
          <div class="init u-flex u-col-top">
            <Icon type="ios-alert" size="20" color="#ed4014"/>
            <div class="u-p-l-6">{{ $t('orderInfo.wfzdtk') }}</div>
          </div>
          <div>
          <div class="u-p-t-20 u-p-b-6">{{ $t('orderInfo.qgsw') }}</div>
          <RadioGroup class="radio-wrap" v-model="cancelReason" vertical>
              <Radio :label="item.value" v-for="(item, index) in cancelList" :key="index">
                <span>{{ item.label }}</span>
              </Radio>
          </RadioGroup>
          </div>
          <div class="u-p-t-20 u-flex u-row-right">
            <Button type="text" @click="cancelModel = false">{{ $t('orderInfo.qx') }}</Button>
            <Button type="primary" @click="confirmCancel" :loading="cancelLoading">{{ $t('orderInfo.qr') }}</Button>
          </div>
        </div>
    </Modal>

  </div>
</template>

<script>
import { getOrderInfo, confirmPayment, cancelOrder, confirmCollection } from '@/api/trade'
import uCountDown from '@/components/u-count-down/u-count-down'
export default {
  components: {
    uCountDown
  },
  data() {
    return {
      cancelLoading: false,
      // 取消原因
      cancelReason: '',
      // 取消原因列表
      cancelList: [
        {label: this.$t('orderInfo.wbxjy'), value: '1'},
        {label: this.$t('orderInfo.bmzgg'), value: '2'},
        {label: this.$t('orderInfo.mjyew'), value: '3'},
        {label: this.$t('orderInfo.mjskfsy'), value: '4'},
        {label: this.$t('orderInfo.qt'), value: '5'},
      ],
      // 订单详情
      orderInfo: {
        // 单价
        tradePrice: '',
        // 数量
        settleAccount: '',
        // 总价
        sourceAmount: '',
        // 订单过期时间
        expirationTime: ''
      },
      // 倒计时 毫秒
      timestamp: 0,
      confirmModel: false,
      cancelModel: false,
      orderId: this.$route.params.id,
      receivedModal: false,
    }
  },
  mounted() {
    // 查询订单详情
    this.getOrderInfo()
  },
  computed: {
    isLogin: function() {
      return this.$store.state.isLogin;
    }
  },
  methods: {
    /* 取消订单 */
    confirmCancel() {
      if (this.cancelReason == '') {
        this.$Notice.info({
          title: this.$t('publice.ts'),
          desc: this.$t('orderInfo.qxzqx')
        })
        return 
      }
      this.cancelLoading = true
      cancelOrder({
        orderId: this.orderId,
        cancelType: this.cancelReason
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('orderInfo.ddqxcg')
        })
        this.cancelModel = false
        this.getOrderInfo()
      }).finally(() => {
        this.cancelLoading = false
      })
    },
    /* 确认收到对方转账，放币 */
    confirmCollection() {
      confirmCollection({
        userId: '1',
        orderId: this.orderId,
        emailCode: '123123',
        mobileCode: '123123',
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('publice.cg'),
        })
        this.receivedModal = false
        this.getOrderInfo()
      })
    },
    /* 确认转账 */
    confirmPayment() {
      confirmPayment({
        userId: '1',
        orderId: this.orderId,
        paymentId: this.orderInfo.paymentList[0].paymentId,
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('publice.cg'),
        })
        this.confirmModel = false
        this.getOrderInfo()
      })
    },
    /* 倒计时结束 */
    countDownEnd() {
      this.orderInfo.status = 0
    },
    /* 查询订单详情 */
    getOrderInfo() {
      getOrderInfo({
        id: this.orderId
      }).then(res => {
        this.orderInfo = res

        this.timestamp = (this.orderInfo.expirationTime - new Date().getTime()) / 1000
        console.log(this.timestamp)
      })
    },

  }
}
</script>

<style lang="scss" scoped>
.cancel-model {
  .init {
    padding: 12px 16px;
    border-radius: 4px;
    background: #fff5f5;
    border: 1px solid #ffb3b8;
  }
}
.radio-wrap {
  width: 100%;
  border: 1px solid #eee;
  border-radius: 4px;
  .ivu-radio-wrapper {
    width: 100%;
    padding: 0 16px;
    border-bottom: 1px solid #eee;
    margin-right: 0;
  }
}

::v-deep .ivu-modal-footer {
  border-top: none;
}
.wrap {
  background-color: #F2F6FD;
  .content-wrap {
    padding: 50px 0;
    .content {
      width: 1200px;
      margin: 0 auto;
      background-color: #FFF;
      border-radius: 4px;

    }
    .info {
      .init {
        padding: 10px;
        border-radius: 4px;
        color: #f90;
        background: rgba(250,173,20,.05);
        border: 1px solid rgba(250,173,20,.3);
      }
      .icon-btn {
        min-width: 58px;
        text-align: center;
        border: 1px solid #f90;
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 12px;
      }
    }
  }
  .bot-info {
    width: 1200px;
    margin: 0 auto;
    p {
      line-height: 28px;
    }
  }
}
.order-cancel {
  min-height: 100px;
  text-align: center;
  font-size: 16px;
}
</style>