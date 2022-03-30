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
            <div class="sp-tips u-font-12">
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
            <p class="u-flex u-row-between u-font-12 u-p-t-8">
              <span>可用</span>
              <span>{{ balance }}  {{ coinName }}</span>
            </p>
            <div class="content u-m-t-16 u-font-12">
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
              @input.native="onInput"
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
              <span class="u-font-20 u-font-bold">{{ actual }} {{ coinName }}</span>
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
          <router-link to="/finance/record">{{ $t('deposit.ckqb') }}</router-link>
        </div>
      </div>
      <Table :columns="columns" :data="tableData">
        <template slot-scope="{ row, index }" slot="billType">
          提币
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <div>{{ formatStatus[row.status] }}</div>
        </template>
      </Table>
    </div>

    <!-- 安全验证 -->
    <safeModal v-model="safeShow" :loading="submitLoading" :safeType="37" @submit="confirmSubmit"></safeModal>

  </div>
</template>

<script>
import {
  getCurrencyList,
  getRecord,
  withdraw
} from '@/api/finance'
import { getBalance } from '@/api/exchange'
import safeModal from '@components/safeModal/safeModal'
// import QrcodeVue from "qrcode.vue"

export default {
  components: {
    // QrcodeVue
    safeModal
  },
  data() {
    return {
      formatStatus: {
        0: '待审核',
        1: '进行中',
        2: '失败',
        3: '完成'
      },
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
      actual: 0, // 实际到账
      address: '', // 提币地址
      balance: 0, // 可用余额
      qrcodeValue: '',
      coinName: '', // 币种名
      coinId: '', // 币种ID
      chainId: '', // 网络id
      chainActive: {}, // 当前网络对象
      coinList: [],
      chainList: [],
      columns: [
        {
            title: this.$t('deposit.sj'),
            key: 'createTime',
        },
        {
            title: this.$t('deposit.bz'),
            key: 'currencyName'
        },
        {
            title: this.$t('deposit.lx'),
            slot: 'billType',
        },
        {
            title: this.$t('deposit.sl'),
            key: 'amount'
        },
        {
            title: this.$t('deposit.zt'),
            slot: 'status',
            align: 'right'
        }
      ],
      tableData: []
    }
  },
  async created() {
    this.getRecord()
    try {
      await this.getCurrencyList()
    } catch {}
    this.getBalance()
  },
  methods: {
    /* 获取币种余额 */
    getBalance() {
      return new Promise(resolve => {
        getBalance({
          type: 'otc',
          currency: this.coinName
        }).then(res => {
          this.balance = res.balance
          resolve()
        })
      })
    },
    /* 输入数量 */
    onInput() {
      if (this.withdrawNum == '') return
      this.withdrawNum = this.withdrawNum.replace(/^\D*(\d*(?:\.\d{0,8})?).*$/g, '$1')
      this.actual = this.NP.minus(this.withdrawNum, this.chainActive.payOutFee)
    },
    /* 获取财务记录 */
    getRecord() {
      getRecord({
        walletType: 'otc',
        type: 2,
        timeStamp: '',
        size: 10,
        current: 1
      }).then(res => {
        this.tableData = res.records
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
    /* 切换网络 */
    chainChange(val) {
      let list = this.chainList.filter(item => {
        return item.chainId == val
      })
      this.chainActive = list[0]

      this.onInput()
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
        padding: 16px 10px;
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