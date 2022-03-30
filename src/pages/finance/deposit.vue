<template>
  <div class="page-wrap">
    <div class="title u-flex u-font-18" @click="$router.go(-1)">
      <Icon type="ios-arrow-back" color="#333" />
      {{ $t('deposit.fh') }}
    </div>

    <div class="con u-flex u-col-top">
      <div class="left">
        <div class="tab u-flex u-p-b-16">
          <em>1</em>
          <span>{{ $t('deposit.xzcb') }}</span>
        </div>
        <section>
          <div class="coin-select u-m-b-24">
            <h4>{{ $t('deposit.bz') }}</h4>
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
            <div class="sp-tips">
              <p>
                <span>{{ $t('deposit.zxcz') }}</span>
                <span>{{ chainActive.leastPayIn }} {{ coinName }}</span>
              </p>
              <p>
                <span>{{ $t('deposit.cbqk') }}</span>
                <span>{{ chainActive.confirmNum }}{{ $t('deposit.qkqr') }}</span>
              </p>
              <!-- <p>
                <span>提币解锁确认数</span>
                <span>{{ chainActive.confirmNum }}次区块确认</span>
              </p> -->
            </div>
            <div class="content u-m-t-16">
              <p>
                <em>• </em>
                {{ $t('deposit.qwx') }}
                {{ coinName }} {{ $t('deposit.fzzc') }}
              </p>
              <p>
                <em>• </em>
                {{ $t('deposit.ncz') }}
                {{ chainActive.confirmNum }}
                {{ $t('deposit.hdz') }}
                {{ chainActive.confirmNum }}
                {{ $t('deposit.ktb') }}
              </p>
              <p>
                <em>• </em>
                {{ $t('deposit.zxcz') }}：{{ chainActive.leastPayIn }}
                {{ coinName }}{{ $t('deposit.wfth') }}
              </p>
              <p>
                <em>• </em>
                {{ $t('deposit.ndczdz') }}
              </p>
              <p>
                <em>• </em>
                {{ $t('deposit.qwbqr') }}
              </p>
            </div>
          </div>
        </section>
      </div>
      <div class="right">
        <div class="tab u-flex u-p-b-16">
          <em>2</em>
          <span>{{ $t('deposit.qrcbxx') }}</span>
        </div>
        <div>
          <div class="deposit-internet">
            <h3>{{ $t('deposit.cbwl') }}</h3>
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
            <h3 class="mod-title u-p-t-20">
              {{ $t('deposit.cbdz') }}
              <span>{{ $t('deposit.cdzkcz') }}{{ coinName }}{{ $t('deposit.zc') }}</span>
            </h3>
            <section>
              <div class="deposit-before-address" v-if="false">
                <h3>{{ $t('deposit.cbdz') }}</h3>
                <p>
                  {{ $t('deposit.rzhd') }}
                </p>
                <Button type="primary" @click="getDepositAddress"
                  >{{ $t('deposit.hqcbdz') }}</Button
                >
              </div>

              <div class="deposit-address" v-if="qrcodeValue">
                <div class="qr-image">
                  <qrcode-vue
                    :value="qrcodeValue"
                    size="120"
                  ></qrcode-vue>
                </div>
                <div class="u-p-t-20">{{ qrcodeValue }}</div>
                <div class="addr-wrap u-m-t-6">
                  <Button icon="md-copy" v-clipboard="() => qrcodeValue" v-clipboard:success="copySuccess">{{ $t('deposit.fzdz') }}</Button>
                </div>
              </div>
              <div class="deposit-address" v-else>
                {{ $t('deposit.dzhqsb') }}
                <Button @click="getDepositAddress" class="u-m-t-10">{{ $t('deposit.ddcs') }}</Button>
              </div>
            </section>
          </div>
          <h3></h3>
        </div>
      </div>
    </div>

    <div class="table">
      <div class="title u-flex u-row-between">
        <div>{{ coinName }} {{ $t('deposit.cbjl') }}<span style="color: #999">{{ $t('deposit.zj') }}</span></div>
        <div>
          <router-link to="/finance/record">{{ $t('deposit.ckqb') }}</router-link>
        </div>
      </div>
      <Table :columns="columns" :data="tableData">
        <template slot-scope="{ row, index }" slot="billType">
          充币
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <div style="color: red">等待接口返回字段...</div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { getRecord } from '@/api/finance'
import { getCurrencyList, getDepositAddress } from '@/api/finance'
import QrcodeVue from "qrcode.vue"

export default {
  components: {
    QrcodeVue
  },
  data() {
    return {
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
      this.getDepositAddress()
    } catch { }
  },
  methods: {
    /* 获取财务记录 */
    getRecord() {
      getRecord({
        walletType: 'otc',
        type: 1,
        timeStamp: '',
        size: 10,
        current: 1
      }).then(res => {
        this.tableData = res.records
      })
    },
    /* 复制地址 */
    copySuccess() {
      this.$Notice.success({
        title: this.$t('publice.ts'),
        desc: this.$t('deposit.fzcg')
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
      this.getDepositAddress()
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
      this.getDepositAddress()
    },
    /* 获取币种列表 */
    getCurrencyList() {
      return new Promise((resolve) => {
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
    },
  }
}
</script>

<style lang="scss" scoped>
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
      .mod-title {
        span {
          color: #9aa5b5;
          padding-left: 8px;
          font-weight: 400;
        }
      }
      .deposit-before-address,
      .deposit-address {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 270px;
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 8px;
        h3 {
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          color: #333;
        }
        p {
          margin: 18px 0 40px 0;
        }
      }
      .deposit-address {
        .qr-image {
          width: 120px;
          height: 120px;
          margin: 0 auto;
          background-color: #eee;
        }
        .btn-wrap {
          cursor: pointer;
        }
      }
    }
  }
}
</style>