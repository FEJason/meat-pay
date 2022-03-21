<template>
  <div>
    <div class="header">
      <h2>我的广告</h2>
      <div class="btn-wrap">
        <router-link to="/otc/ad" class="u-font-14 u-m-r-24">
          <Icon type="md-albums" color="#007AFF" size="16" />
          历史广告
        </router-link>
        <Button type="primary" icon="md-add" @click="releaseModal = true">发布新广告</Button>
      </div>
    </div>
    <div class="con u-text-center u-p-t-80 u-p-b-80"
      v-if="!this.isMerchant">
      <img
        src="@/assets/img/myads-01.png"
        alt="icon"
        style="width: 96px; height: 96px"
      />
      <p class="u-font-20 u-m-t-32">申请商户</p>
      <p class="u-font-16 u-m-t-8">您需要先申请商户</p>
      <Button type="primary" class="u-m-t-40" size="large" @click="modalShow = true">现在申请</Button>
    </div>
    <div class="con u-text-center u-p-t-80 u-p-b-80"
      v-else>
      <img
        src="@/assets/img/myads-01.png"
        alt="icon"
        style="width: 96px; height: 96px"
      />
      <p class="u-font-20 u-m-t-32">您是尊贵的商户，去交易吧</p>
      <!-- <p class="u-font-16 u-m-t-8">您是尊贵的商户</p> -->
      <!-- <Button type="primary" class="u-m-t-40" size="large" @click="modalShow = true">现在申请</Button> -->
    </div>
    

    <Modal
      v-model="modalShow"
      title="申请商户"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div class="u-text-center u-p-b-20">
        <img src="@/assets/img/home/code.png" alt="code">
        <p>请扫码下载App，完成商户申请</p>
      </div>
    </Modal>


    <!-- 发布广告弹窗 -->
    <Modal
      v-model="releaseModal"
      :mask-closable="false"
      :footer-hide="true">
      <div slot="header" class="u-font-18">发布广告</div>
      <div class="detail u-p-l-20 u-p-r-20">
          <Form ref="releaseForm" :model="releaseForm" :rules="rules" :label-width="110">
              <!-- 广告类型 -->
              <FormItem :label="$t('trade.gglx')" prop="side">
                  <Select v-model="releaseForm.side" size="large"
                    @on-change="sideChange">
                      <Option value="1">我要购买</Option>
                      <Option value="2">我要出售</Option>
                  </Select>
              </FormItem>
              <div class="p-flex">
                <!-- 数字货币 -->
                <FormItem :label="$t('trade.szhb')" prop="currencyId" class="u-flex-1">
                    <Select v-model="releaseForm.currencyId" size="large" :placeholder="$t('publice.qxz')">
                        <Option v-for="item in coins" :value="item.id + ',' + item.currency" :key="item.id">{{ item.currency }}</Option>
                    </Select>
                </FormItem>
                <!-- 法币 -->
                <FormItem :label="$t('trade.fb')" prop="fiatId" class="u-flex-1">
                    <Select v-model="releaseForm.fiatId" size="large" :placeholder="$t('publice.qxz')">
                        <Option v-for="item in legalList" :value="item.id + ',' + item.fiatCurrency" :key="item.id">{{ item.fiatCurrency }}</Option>
                    </Select>
                </FormItem>
              </div>
              <!-- 单价 -->
              <FormItem :label="$t('trade.price')" prop="posterPrice">
                  <Input v-model="releaseForm.posterPrice" size="large"></Input>
              </FormItem>
              <!-- 数量 -->
              <FormItem :label="$t('trade.number')" prop="account">
                  <Input v-model="releaseForm.account" size="large" type="text"></Input>
              </FormItem>
              <!-- 单笔最小限额 -->
              <FormItem :label="$t('trade.dbzx')" prop="minOrderAmt">
                  <Input v-model="releaseForm.minOrderAmt" type="text" size="large"></Input>
              </FormItem>
              <!-- 单笔最大限额 -->
              <FormItem :label="$t('trade.dbzd')" prop="maxOrderAmt">
                  <Input v-model="releaseForm.maxOrderAmt" type="text" size="large"></Input>
              </FormItem>
              <!-- 支付方式 -->
              <FormItem :label="$t('trade.zffs')" prop="paymentIds">
                <!-- 类型购买传 payTypeId -->
                <Select v-model="releaseForm.paymentIds" size="large" multiple :placeholder="$t('publice.qxz')" 
                   v-if="releaseForm.side == 1">
                  <Option v-for="item in paymentList" :value="item.payTypeId" :key="item.payTypeId">
                    {{ item.payTypeId == 4 ? $t('trade.zfb') : item.payTypeId == 3 ? $t('trade.wx') : $t('trade.yhk')}} - 
                    {{ item.accountName }} {{ item.account }}
                  </Option>
                </Select>
                <!-- 类型出售传 id  -->
                <Select v-model="releaseForm.paymentIds" size="large" multiple :placeholder="$t('publice.qxz')"
                   v-if="releaseForm.side == 2">
                  <Option v-for="item in paymentList" :value="item.id" :key="item.id">
                    {{ item.payTypeId == 4 ? $t('trade.zfb') : item.payTypeId == 3 ? $t('trade.wx') : $t('trade.yhk')}} - 
                    {{ item.accountName }} {{ item.account }}
                  </Option>
                </Select>
              </FormItem>
              <!-- 交易说明 -->
              <FormItem :label="$t('trade.jysm')" prop="directions">
                  <Input v-model="releaseForm.directions" type="textarea" size="large"></Input>
              </FormItem>
              <FormItem class="u-text-right">
                  <Button type="text" @click="releaseModal = false" class="u-m-r-10">{{ $t('trade.cancel') }}</Button>
                  <Button type="primary" @click="submitRelease('releaseForm')" :loading="submitLoad">{{ $t('trade.fbgg') }}</Button>
              </FormItem>
          </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getCurrencyList, getLegalList, getAdList, release, setRelease, getIdAdv, otcOrder } from '@/api/trade'
import { getPaymentList, getCertification } from '@/api/user'
export default {
  data() {
    return {
      isMerchant: false,
      submitLoad: false,
      paymentList: [], // 收款列表
      // 法币列表
      legalList: [],
      // 币种列表
      coins: [
        { currency: 'USDT' },
        { currency: 'BTC' },
        { currency: 'ETH' },
      ],
      modalShow: false,
      releaseModal: false,
      releaseForm: {
        side: '1'
      },
      rules: {
        side: [
          { required: true, message: '请选择广告类型', trigger: "change" }
        ],
        currencyId: [
          { required: true, message: '请选择', trigger: "change" }
        ],
        fiatId: [
          { required: true, message: '请选择', trigger: "change" }
        ],
        posterPrice: [
          { required: true, message: '请输入', trigger: "blur" }
        ],
        account: [
          { required: true, message: '请输入', trigger: "blur" }
        ],
        minOrderAmt: [
          { required: true, message: '请输入', trigger: "blur" }
        ],
        maxOrderAmt: [
          { required: true, message: '请输入', trigger: "blur" }
        ],
        paymentIds: [
          { required: true, type: 'array', message: '请选择', trigger: "change" }
        ],
      },
    }
  },
  computed: {
    isLogin: function() {
      return this.$store.state.isLogin;
    }
  },
  async created() {
    // this.SET_ATCIVENAV('nav-myad')
    if (!this.isLogin) {
      this.$router.push('/login')
      return
    }
    await this.getCurrencyList()
    await this.getLegalList()
    this.getPaymentList() // 获取收款方式列表
    this.getCertification()
  },
  methods: {
    ...mapMutations(['SET_ATCIVENAV']),
    getCertification() {
      console.log(111)
      getCertification().then(res => {
        this.isMerchant = res
      })
    },
    /* 获取收款列表 */
    getPaymentList() {
      getPaymentList().then(res => {
        this.paymentList = res
      })
    },
    /* 获取币种列表 */
    getCurrencyList() {
      return new Promise(resolve => {
        getCurrencyList().then(res => {
          this.coins = res
          resolve()
        })
      })
    },
    /* 查询法定货币列表 */
    getLegalList() {
      return new Promise(resolve => {
        getLegalList().then(res => {
          this.legalList = res
          resolve()
        })
      })
    },
    /* 发布委托单，切换买卖 */
    sideChange() {
      this.releaseForm.paymentIds = []
    },
    /* 发布广告 */
    submitRelease(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let currencyId = this.releaseForm.currencyId.split(',')[0]
          let currencyName = this.releaseForm.currencyId.split(',')[1]
          let fiatId = this.releaseForm.fiatId.split(',')[0]
          let fiatCurrency = this.releaseForm.fiatId.split(',')[1]
          let paymentIds = this.releaseForm.paymentIds.join(',')

          this.submitLoad = true
          release({
            ...this.releaseForm,
            currencyId,
            currencyName,
            fiatId,
            fiatCurrency,
            paymentIds
          }).then(res => {
            // 接口成功，弹窗是否上架，不上架去个人中心
            this.$Modal.confirm({
                title: '是否确认上架该广告？',
                content: '确认上架，该广告将展示在交易大厅',
                loading: true,
                onOk: () => {
                  setRelease({
                    status: 1,
                    id: res
                  }).then(() => {
                    this.$Notice.success({
                      title: '提示',
                      desc: '广告上架成功'
                    });
                    this.loadAd(1)
                    // 清空表单，关闭弹窗
                    this.releaseForm = { side: '1' }
                    this.releaseModal = false
                    this.$refs[name] && this.$refs[name].resetFields()
                  }).finally(() => {
                    this.$Modal.remove()
                  })
                },
                onCancel: () => {
                  
                }
            });
          }).finally(() => {
            this.submitLoad = false
          })
        }
      })

    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  background-color: #fafafa;
  padding: 32px 120px;
  h2 {
    font-size: 30px;
  }
}
/* PC端 */
@media (min-width: 768px) {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .p-flex {
    display: flex;
  }
}
/* 手机端 */
@media (max-width: 767px) {
  .header {
    padding: 10px;
    h2 {
      font-size: 22px;
      font-weight: bold !important;
    }
    .btn-wrap {
      padding-top: 10px;
    }
  }
}

</style>