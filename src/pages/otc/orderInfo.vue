<template>
  <div class="wrap">
    <div class="content-wrap">
      <div class="content">
        <div class="left">
          <div class="tit u-p-20 u-flex u-row-between">
            <!-- 订单已取消 -->
            <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 0">{{ $t('orderInfo.ddyqx') }}</div>
            <!-- 待付款 -->
            <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 1">
              <!-- 待我支付-->
              <div v-if="isBuy">{{ $t('orderInfo.dwzf') }}</div>
              <!-- 待对方支付 -->
              <div v-if="isSell">{{ $t('orderInfo.ddfzf') }}</div>
              <div>
                <div class="u-font-14">
                  <u-count-down
                    ref="uCount"
                    font-size="30"
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
            <!-- 确认付款 -->
            <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 2">
              <!-- 等待卖家确认收款 -->
              <span v-if="isBuy">{{ $t('orderInfo.ddmjqr') }}</span>
              <!-- 待我放币 -->
              <span v-if="isSell">{{ $t('orderInfo.dwfb') }}</span>
            </div>
            <!-- 申诉 -->
            <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 3">申述中...，请耐心等待</div>
            <!-- 完成 -->
            <div class="u-font-20 u-font-bold" v-if="orderInfo.status == 4">
              {{ $t('orderInfo.ywc') }}
            </div>
            
            <div class="hidden-xs">
              <span class="u-font-14">{{ $t('orderInfo.ddbh') }} {{ orderInfo.id }}</span>
            </div>
          </div>
          <div class="info u-p-20">
            <div class="price-info u-font-18">
              <div class="item u-p-r-30">
                <div class="u-font-14">{{ $t('orderInfo.zj') }}</div>
                <div style="color: #19be6b" class="u-font-bold">{{ orderInfo.sourceAmount }} {{ orderInfo.fiatCurrency}}</div>
              </div>
              <div class="item u-p-r-30">
                <div class="u-font-14">{{ $t('orderInfo.sl') }}</div>
                <div class="u-font-bold">{{ orderInfo.settleAccount }} {{ orderInfo.currencyName }}</div>
              </div>
              <div class="item">
                <div class="u-font-14">{{ $t('orderInfo.dj') }}</div>
                <div class="u-font-bold">{{ orderInfo.tradePrice }} {{ orderInfo.fiatCurrency }}</div>
              </div>
            </div>
            
            <div class="u-flex u-p-t-30">
              <span style="width: 100px;" class="u-font-14 u-tips-color">{{ $t('orderInfo.mjskfs') }}</span>
              <span class="u-flex-1" style="height: 1px; border-bottom: 1px solid #eee"></span>
            </div>
            <div v-if="orderInfo.status != 0">
              <div class="init u-flex u-m-t-30"
                v-if="isBuy"
                >
                <Icon type="ios-alert" size="20" sytle="color: #f90"/>
                <span class="u-p-l-8" style="color: #333">{{ $t('orderInfo.qwbsy') }}（{{userInfo.username}}）{{ $t('orderInfo.zxzz') }}</span>
              </div>
              <div class="u-m-t-30 u-flex u-font-14" v-for="(item, index) in orderInfo.paymentList" :key="item.paymentId">
                <span class="u-m-r-30 icon-btn"
                  :style="{color: item.payTypeId == 4 ? '#1bb1f3' : item.payTypeId == 3 ? '#42c71b' : '#f1bc15'}">
                  {{ item.payTypeId == 4 ? 
                      $t('trade.zfb') : 
                      item.payTypeId == 3 ? 
                      $t('trade.wx') : 
                      $t('trade.yhk')
                  }}
                </span>

                <span class="u-p-r-30">{{ item.kycName }}</span>
                <span class="u-p-r-30">{{ item.account }}</span>
                <span>{{ item.accountInfo }}</span>
              </div>
              <div class="u-flex u-m-t-30">
                <div v-if="orderInfo.status == 1">
                  <Button type="primary" @click="confirmModel = true"
                    v-if="isBuy"
                    >我已转账，下一步</Button>
                </div>
                <div v-if="orderInfo.status == 2">
                  <!-- 我已收到转账，下一步 -->
                  <Button type="primary" @click="receivedModal = true"
                    v-if="(orderInfo.side == 2 && orderInfo.adSide == null) || (orderInfo.side == 1 && orderInfo.adSide == 2)"
                    >我已收到转账，下一步</Button>
                  <!-- 未收到资产，申述 -->
                  <div v-if="isBuy">
                    <span class="u-p-r-10">{{ $t('orderInfo.ddmj') }}</span>
                    <Button type="primary" @click="showPlead = true">{{ $t('orderInfo.ss') }}</Button>
                  </div>
                </div>

              </div>
              <div class="u-text-right">
                <Button type="text">{{ $t('orderInfo.lxkf') }}</Button>
                <!-- 取消订单 -->
                <Button type="text" v-if="orderInfo.status == 1 && isBuy" @click="cancelModel = true">{{ $t('orderInfo.qxd') }}</Button>
              </div>
            </div>
            <div class="order-cancel" v-if="orderInfo.status == 0">
              <div class="u-p-t-20">
                <Icon type="ios-eye-off" size="50"/>
              </div>
              <div class="u-p-t-20">{{ $t('orderInfo.bkck') }}</div>
              <div class="u-p-t-40">{{ $t('orderInfo.ryyw') }}</div>
              <div class="u-p-t-10">
                <Button>{{ $t('orderInfo.lxkf') }}</Button>
              </div>
            </div>
          </div>
        </div>
        <div class="right hidden-xs">
          <div class="r-top u-p-20">
            <h4 class="u-font-18">聊天室开发中。。。</h4>
            <p>
              认证广告方 
              <Icon type="ios-checkmark-circle" size="16" color="#007AFF"/>
            </p>
            <div class="u-flex u-p-t-10">
              <div>
                <p class="u-tips-color">30日成单数</p>
                <p>289</p>
              </div>
              <div class="u-m-l-60">
                <p class="u-tips-color">30日成单率</p>
                <p>100%</p>
              </div>
            </div>
          </div>
          <div class="r-con u-relative">
            <div class="u-text-center">
              <p class="u-p-t-20">{{orderInfo.createTime}}</p>
              <p class="u-p-t-10">您已下单成功。</p>
            </div>
            <div class="chat-content">
              <div class="chat-left">
                <p>哈哈哈哈</p>
              </div>
              <div class="chat-right">
                <p>赶紧付款赶紧付款赶紧付款赶紧付款赶</p>
              </div>
            </div>
            <div class="u-p-10 bot-wrap u-flex">
              <Input style="width: 100%;" placeholder="输入消息，回车发送"></Input>
              <Icon class="u-p-l-10" type="md-image" size="26" color="#909399"/>
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

    <!-- 我已转账 -->
    <Modal v-model="confirmModel"
      :mask-closable="false"
      draggable scrollable :title="$t('orderInfo.qrzf')"
      :footer-hide="true">
        <div slot="header" class="u-font-20">{{ $t('orderInfo.qrzf') }}</div>
        <div class="u-p-t-20 u-p-b-20">{{ $t('orderInfo.wwczf') }}</div>
        <div class="u-flex u-row-right">
          <Button type="text" @click="confirmModel = false">{{ $t('orderInfo.qx') }}</Button>
          <Button type="primary" :loading="confirmPaymentLoading" @click="confirmPayment">{{ $t('orderInfo.qr') }}</Button>
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
          <Button type="primary" :loading="confirmCollectionLoading" @click="confirmCollection">{{ $t('orderInfo.qr') }}</Button>
        </div>
    </Modal>

    <!-- 取消订单 -->
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

    <!-- 申述 -->
    <Modal v-model="showPlead"
      :mask-closable="false"
      draggable scrollable
      :footer-hide="true">
        <div class="title u-font-20" slot="header">申诉</div>
        <Form ref="formPlead" :model="formPlead" :rules="rules" :label-width="100">
          <FormItem label="申述理由" prop="type">
            <Select v-model="formPlead.type" placeholder="请选择">
              <Option :value="item.value" v-for="item in pleadList" :key="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="联系电话" prop="contactPhone">
            <Input v-model="formPlead.contactPhone"></Input>
          </FormItem>
          <FormItem label="联系人" prop="contactName">
            <Input v-model="formPlead.contactName"></Input>
          </FormItem>
          <FormItem label="申述说明" prop="directions">
            <Input v-model="formPlead.directions" type="textarea"></Input>
          </FormItem>
          <FormItem label="申诉截图（暂不可用）">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              multiple
              type="drag"
              action="//jsonplaceholder.typicode.com/posts/"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </FormItem>

          <div class="u-p-t-20 u-flex u-row-right">
            <Button type="text" @click="showPlead = false">{{ $t('orderInfo.qx') }}</Button>
            <Button type="primary" @click="confirmPlead('formPlead')" :loading="pleadLoading">{{ $t('orderInfo.qr') }}</Button>
          </div>
        </Form>
    </Modal>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
// import io from 'socket.io'
import { getOrderInfo, confirmPayment, cancelOrder, confirmCollection, plead } from '@/api/trade'
import uCountDown from '@/components/u-count-down/u-count-down'
export default {
  components: {
    uCountDown
  },
  data() {
    return {
      pleadList: [
        { name: '卖家不放币', value: '1'},
        { name: '买家长时间不付款', value: '2'},
        { name: '买家付款错误', value: '3'},
        { name: '其他', value: '4'},
      ],
      pleadLoading: false,
      formPlead: {},
      rules: {
        type: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        directions: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
      },
      showPlead: false,
      confirmCollectionLoading: false,
      confirmPaymentLoading: false,
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
    this.getUserInfo()
    // this.initChat()
  },
  computed: {
    ...mapState(['isLogin', 'userInfo']),
    isBuy() {
      if (
        // 买入 or 商家买入 (side == 1 && adSide == null) || (side == 1 && adSide == 1)
        (this.orderInfo.side == 1 && this.orderInfo.adSide == null) ||
        (this.orderInfo.side == 1 && this.orderInfo.adSide == 1)
      ) {
        return true
      } else {
        return false
      }
    },
    isSell() {
      if (
        // 卖出 or 商家卖出 (side == 1 && adSide == null) || (side == 1 && adSide == 1)
        (this.orderInfo.side == 2 && this.orderInfo.adSide == null) ||
        (this.orderInfo.side == 1 && this.orderInfo.adSide == 2)
      ) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions(['getUserInfo']),
    /* 连接聊天室 */
    initChat() {
      var url = 'http://192.168.0.67:8081/otc?Authorization=' + localStorage.token;
      var socket = io.connect(url);
      socket.on('connect', function () {
        console.log('连接成功')
          // output("<span class=sys-msg>系统通知: " + token + "成功连接至websocket服务器</span>");
      });

      socket.on('message', function (data) {
          // var uuid = $('#uuid').val();
          if (data.uuid == uuid) {
              // output("<span class=username-msg>" + data.roomId + " 群消息: " + data.uuid + " 说: " + data.message + "</span>");
          } else {
              // output("<span class=connect-msg>" + data.roomId + " 群消息: " + data.uuid + " 说: " + data.message + "</span>");
          }
      });

      socket.on('disconnect', function () {
        console.log('断开连接')
          // output("<span class=disconnect-msg>系统通知: " + token + "已从websocket服务器断开连接</span>", null);
      });
    },
    /* 申述 */
    confirmPlead(name) {
      console.log(this.formPlead)
      this.$refs[name].validate((valid) => {
        if (valid) {
          plead({
            ...this.formPlead,
            tradeId: this.orderInfo.id,
            action: this.isBuy ? 0 : 1
          }).then(() => {
            this.$Notice.success({
              title: '提示',
              desc: "申诉成功"
            })
            this.showPlead = false
            this.getOrderInfo()
          })
        } 
    })
    },
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
    /* 我已收到转账，下一步 */
    confirmCollection() {
      this.confirmCollectionLoading = true
      confirmCollection({
        userId: this.userInfo.uuid,
        orderId: this.orderId,
        // emailCode: '123123',
        // mobileCode: '123123',
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('publice.cg'),
        })
        this.receivedModal = false
        this.getOrderInfo()
      }).finally(() => {
        this.confirmCollectionLoading = false
      })
    },
    /* 我已转账，下一步 */
    confirmPayment() {
      this.confirmPaymentLoading = true
      confirmPayment({
        userId: this.userInfo.uuid,
        orderId: this.orderId,
        paymentId: this.orderInfo.paymentList ? this.orderInfo.paymentList[0].paymentId : this.orderInfo.paymentId,
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('publice.cg'),
        })
        this.confirmModel = false
        this.getOrderInfo()
      }).finally(() => {
        this.confirmPaymentLoading = false
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
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      .left{
        background-color: #FFF;
        border-radius: 8px;
      }
      .right {
        margin-left: 20px;
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: #FFF;
        border-radius: 8px;
        .r-top {
          border-bottom: 1px solid #eee;
        }
        .r-con {
          flex: 1;
        }
        .chat-content {
          padding: 10px;
          .chat-left {
            p {
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              background-color: #d1e7ff;
            }
          }
          .chat-right {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
            p {
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              background-color: #eee;
            }
          }
        }
        .bot-wrap {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
        }
      }
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
        background-color: rgb(250, 250, 250);
        border-radius: 4px;
        padding: 4px 8px;
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
.price-info {
  display: flex;
}
.order-cancel {
  min-height: 100px;
  text-align: center;
  font-size: 16px;
}
@media (min-width: 768px) {
  .content {
    .left{
      width: 70%;
    }
  }
}
@media (max-width: 767px) {
  ::v-deep .ivu-modal-content {
    width: auto !important;
  }
  .wrap {
    .content-wrap {
      padding-top: 10px;
      .content {
        width: 100%;
      }
    }
  }
  .wrap .bot-info {
    width: 100%;
    padding: 0 10px;
  }
  .price-info {
    display: block;
    .item {
      display: flex;
      justify-content: space-between;
      padding-right: 0 !important;
    }
  }
}
</style>