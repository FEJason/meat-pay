<template>
  <div class="page-wrap">
    <div class="title u-flex u-font-18" @click="$router.go(-1)">
      <Icon type="ios-arrow-back" color="#333" />
      {{ $t('withdraw.fh') }}
    </div>

    <div class="con u-flex u-col-top">
      <div class="left">
        <div class="tab u-flex u-p-b-16">
          <em>1</em>
          <span>{{ $t('withdraw.xztb') }}</span>
        </div>
        <section>
          <div class="coin-select u-m-b-24">
            <h4>{{ $t('withdraw.bz') }}</h4>
            <Select
              v-model="coinId"
              filterable
              size="large"
              @on-change="coinChange"
            >
              <Option
                v-for="item in coinList"
                :value="item.currencyId"
                :key="item.value"
                >{{ item.currencyName }}</Option
              >
            </Select>
          </div>
          <div class="des-content">
            <!-- <div class="sp-tips">
              <p>
                <span>最小充值金额</span>
                <span>{{ chainActive.leastPayIn }} {{ coinName }}</span>
              </p>
              <p>
                <span>充币区块确认数</span>
                <span>{{ chainActive.confirmNum }}次区块确认</span>
              </p>
            </div> -->
            <div class="sp-tips">
              <p>
                <span>{{ $t('withdraw.tbsx') }}</span>
                <span>{{ chainActive.payOutFee }} {{ coinName }}</span>
              </p>
              <p>
                <span>{{ $t('withdraw.zdtb') }}</span>
                <span>{{ chainActive.leastPayOut }} {{ coinName }}</span>
              </p>
              <p>
                <span>{{ $t('withdraw.zgtb') }}</span>
                <span>{{ chainActive.mostPayOut }} {{ coinName }}</span>
              </p>
            </div>
            <div class="content u-m-t-16">
              <p>
                <em>• </em>
                {{ $t('withdraw.zxtb') }}{{ chainActive.leastPayOut }} {{ coinName }}。
              </p>
              <p>
                <em>• </em>
                {{ $t('withdraw.wbzzj') }}
              </p>
              <p>
                <em>• </em>
                {{ $t('withdraw.qwbqr') }}
              </p>
            </div>
          </div>
        </section>
      </div>
      <div class="right">
        <div class="tab u-flex u-p-b-16">
          <em>2</em>
          <span>{{ $t('withdraw.txtb') }}</span>
        </div>
        <div>
          <div class="deposit-internet u-m-b-24">
            <div class="u-flex u-row-between">
              <h3>{{ $t('withdraw.tbdz') }}</h3>
              <router-link to="/address">{{ $t('withdraw.tbdzgl') }}</router-link>
            </div>
            <Input
              v-model="address"
              size="large"
              :placeholder="$t('withdraw.txtbdz')"
            />
          </div>
          <div class="deposit-internet u-m-b-24">
            <h3>{{ $t('withdraw.tbwl') }}</h3>
            <RadioGroup
              v-model="chainId"
              class="chain-list"
              @on-change="chainChange"
            >
              <Radio
                :label="item.chainId"
                class="list"
                v-for="(item, index) in chainList"
                :key="index"
                >{{ item.chainName }}</Radio
              >
            </RadioGroup>
          </div>
          <div class="deposit-internet u-m-b-24">
            <h3>{{ $t('withdraw.tbsl') }}</h3>
            <Input
              v-model="withdrawNum"
              size="large"
              :placeholder="$t('withdraw.zxtbsl') + chainActive.leastPayOut"
            />
          </div>
          <div class="deposit-internet u-m-b-24">
            <h3>{{ $t('withdraw.sxf') }}</h3>
            <Input
              v-model="withdrawFee"
              size="large"
              disabled
              :placeholder="chainActive.payOutFee + ''"
            />
          </div>
          <div class="line u-m-b-24">
            <div class="info-fee u-flex u-row-between">
              <span>{{ $t('withdraw.sxf') }}</span>
              <span>{{ chainActive.payOutFee }}</span>
            </div>
            <div class="info-amount u-m-t-8 u-flex u-row-between">
              <span>{{ $t('withdraw.sjdz') }}</span>
              <span class="u-font-20 u-font-bold">0000 {{ coinName }}</span>
            </div>
          </div>
          <Button type="primary" long size="large" @click.stop="submit"
            >{{ $t('withdraw.tb') }}</Button
          >
        </div>
      </div>
    </div>

    <div class="table">
      <div class="title u-flex u-row-between">
        <div>
          {{ coinName }} {{ $t('withdraw.tbjl') }}<span style="color: #999">{{ $t('withdraw.zj10') }}</span>
        </div>
        <div>
          <router-link to="/">{{ $t('deposit.ckqb') }}</router-link>
        </div>
      </div>
      <Table :columns="columns5" :data="data5"></Table>
    </div>

    <!-- 安全验证 -->
    <safeModal v-model="safeShow" :loading="submitLoading" :safeType="37" @submit="confirmSubmit"></safeModal>

  </div>
</template>

<script>
import {
  getCurrencyList,
  getDepositAddress,
  getRecord,
  withdraw
} from '@/api/finance'
import safeModal from '@components/safeModal/safeModal'
// import QrcodeVue from "qrcode.vue"

export default {
  components: {
    // QrcodeVue
    safeModal
  },
  data() {
    return {
      submitLoading: false,
      safeShow: false, // 安全验证
      formValidate: {
        emailCode: '',
        mobileCode: '',
        googleAuthCode: '',
        password: ''
      },
      withdrawForm: {}, // 提币表单
      withdrawNum: '', // 提币数量
      withdrawFee: '', // 提币手续费
      address: '', // 提币地址
      qrcodeValue: '',
      coinName: '', // 币种名
      coinId: '', // 币种ID
      chainId: '', // 网络id
      chainActive: {}, // 当前网络对象
      coinList: [],
      chainList: [],
      columns5: [
        {
            title: this.$t('deposit.sj'),
            key: 'date',
        },
        {
            title: this.$t('deposit.bz'),
            key: 'name'
        },
        {
            title: this.$t('deposit.lx'),
            key: 'age',
        },
        {
            title: this.$t('deposit.sl'),
            key: 'address'
        },
        {
            title: this.$t('deposit.zt'),
            key: 'address',
            align: 'right'
        }
      ],
      data5: []
    }
  },
  async created() {
    this.getRecord()
    try {
      await this.getCurrencyList()
      // this.getDepositAddress()
    } catch {}
  },
  methods: {
    /* 获取财务记录 */
    getRecord() {
      getRecord({
        walletType: 'spot',
        type: 2,
        timeStamp: '',
        size: 10,
        current: 1
      }).then(res => {
        console.log(res)
      })
    },
    /* 确认提交 */
    confirmSubmit(name, type, formData) {
      this.submitLoading = true
      withdraw({
        ...this.withdrawForm,
        ...formData
      }).then(() => {
        this.safeShow = false
        this.getRecord()
        this.$Notice.success({
          title: '提示',
          desc: '成功'
        })
      }).finally(() => {
        this.submitLoading = false
      })
    },
    
    /* 提币 */
    submit() {
      if (this.address == '') {
        this.$Notice.info({
          title: '提示',
          desc: '请输入提币地址'
        })
        return
      }
      if (this.withdrawNum == '') {
        this.$Notice.info({
          title: '提示',
          desc: '请输入提币数量'
        })
        return
      }
      this.withdrawForm = {
        // 提现地址
        address: this.address,
        // 提现金额
        amount: this.withdrawNum,
        // 提现主链ID
        chainId: this.chainId,
        // 提现币种ID
        currencyId: this.coinId
      }
      this.safeShow = true
    },
    /* 复制地址 */
    copySuccess() {
      this.$Notice.success({
        title: '提示',
        desc: '复制成功'
      })
    },
    /* 获取充币地址 */
    getDepositAddress() {
      getDepositAddress(this.chainId).then(res => {
        this.qrcodeValue = res
      })
    },
    /* 切换网络 */
    chainChange(val) {
      let list = this.chainList.filter(item => {
        return item.chainId == val
      })
      this.chainActive = list[0]

      this.qrcodeValue = ''
      // this.getDepositAddress()
    },
    /* 切换币种 */
    coinChange(val) {
      let activeList = this.coinList.filter(item => {
        return item.currencyId == val
      })
      // 对应的充币网络
      this.coinName = activeList[0].currencyName
      this.chainList = activeList[0].tokenChainList
      this.chainActive = activeList[0].tokenChainList[0]
      this.chainId = activeList[0].tokenChainList[0].chainId

      this.qrcodeValue = ''
      // this.getDepositAddress()
    },
    /* 获取币种列表 */
    getCurrencyList() {
      return new Promise(resolve => {
        getCurrencyList().then(res => {
          this.coinList = res
          this.coinId = res[0].currencyId
          this.coinName = res[0].currencyName
          this.chainList = res[0].tokenChainList
          this.chainActive = res[0].tokenChainList[0]
          this.chainId = res[0].tokenChainList[0].chainId

          resolve()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ivu-input[disabled],
fieldset[disabled] .ivu-input {
  background-color: #ecf1f8;
  border: none;
}

.page-wrap {
  width: 1000px;
  margin: 0 auto;
  padding-bottom: 100px;
  .title {
    height: 68px;
    line-height: 68px;
    cursor: pointer;
    color: #333;
  }
  .con {
    background-color: #f9fafc;
    border-radius: 7px;
    padding: 40px;
  }
  .table {
    margin-top: 20px;
    background-color: #f9fafc;
    border-radius: 7px;
    .title {
      border-bottom: 1px solid #e8eaec;
      padding: 0 18px;
    }
  }
}

.tab {
  em {
    font-style: normal;
    color: #fff;
    width: 16px;
    height: 16px;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    border-radius: 50%;
    background: #007aff;
    display: inline-block;
  }
  span {
    color: #333333;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    padding-left: 8px;
  }
}

.con {
  .left {
    width: 400px;
    padding-right: 60px;
    .coin-select {
      h4 {
        font-size: 12px;
        font-weight: normal;
        color: #495666;
        margin-bottom: 4px;
      }
    }
    .des-content {
      .sp-tips {
        padding: 16px;
        border-radius: 4px;
        background: rgba(127, 152, 227, 0.1);
        p {
          display: flex;
          justify-content: space-between;
          line-height: 14px;
        }
        p + p {
          margin-top: 8px;
        }
      }
      .content {
        p {
          color: #999;
        }
        p + p {
          margin-top: 8px;
        }
      }
    }
  }
  .right {
    flex: 1;
    .deposit-internet {
      h3 {
        margin-bottom: 4px;
        font-size: 12px;
      }
      .chain-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .list {
          width: 256px;
          display: inline-flex;
          align-items: center;
          padding: 0 12px;
          border: 1px solid #ccd2da;
          border-radius: 4px;
          min-height: 40px;
          margin-bottom: 8px;
          margin-right: 0;
        }
        .ivu-radio-wrapper-checked {
          border-color: #007aff;
        }
      }
    }
    .line {
      .info-fee {
        line-height: 20px;
        .desc {
          color: #9aa5b5;
        }
      }
    }
  }
}
</style>