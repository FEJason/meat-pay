<template>
  <div class="page-wrap">
    <div class="top">
      <div class="top-con u-flex u-row-between u-col-top">
        <div class="top-con-left">
          <div class="tit">
            <span>资金账户</span>
            <!-- <Icon type="ios-eye" size="26" class="u-p-l-10"/> -->
          </div>
          <div>
            <span class="num">{{ spot.latestAmount || '--' }} USDT</span>
            <span class="sec u-p-l-10">≈ {{toFixeds( NP.times(spot.latestAmount, CNY)) }} CNY</span>
          </div>
          <!-- <div class="profit">
            <span class="profit-left">{{ $t('finance.jrsy') }}</span>
            <span class="profit-right u-p-l-10">+0.888888 CNY</span>
          </div> -->
        </div>
        <div class="top-con-right">
          <Button size="large" to="/deposit">充值</Button>
          <Button size="large" class="u-m-l-16" to="/withdraw">{{ $t('finance.tb') }}</Button>
          <!-- <router-link to="/record" class="u-p-l-16">
            {{ $t('finance.cwjl') }}
            <Icon type="ios-play" />
          </router-link> -->
        </div>
      </div>
    </div>

    <div class="item-wrap">
      <div class="u-flex u-row-between">
        <Input v-model="searchValue" prefix="ios-search" :placeholder="$t('finance.ss')" style="width: auto" @on-change="search"/>
        <div>
          <Checkbox v-model="single">{{ $t('finance.ycxe') }}</Checkbox>
        </div>
      </div>
      <div class="u-font-16 u-p-t-20 u-p-b-10">{{ $t('finance.jmhb') }}</div>

      <Table :columns="columns5" :data="assetList" :loading="tableLoading">
        <template slot-scope="{ row, index }" slot="slotOperation">
          <router-link :to="`/deposit`">充值</router-link>
          <router-link to="/withdraw" class="u-m-l-20">{{ $t('finance.tb') }}</router-link>
        </template>
      </Table>
    </div>

  </div>
</template>

<script>
import { getAccount, getAssetList } from '@/api/finance'
import { getRate } from '@/api/user'
export default {
  data() {
    return {
      CNY: 6.3,
      searchValue: '', // 搜索值
      searchList: [],
      tableLoading: false,
      wallet: {},
      spot: {},
      otc: {},
      single: false,
      assetList: [],
      columns5: [
          {
              title: this.$t('finance.bz'),
              key: 'currencyName',
              
          },
          {
              title: this.$t('finance.ky'),
              key: 'balance',
              sortable: true
          },
          {
              title: this.$t('finance.dj'),
              key: 'tradeFreeze',
              sortable: true
          },
          // {
          //     title: 'BTC估值',
          //     key: 'address',
          //     sortable: true
          // },
          // {
          //     title: '锁仓',
          //     key: 'address'
          // },
          {
              title: this.$t('finance.cz'),
              slot: 'slotOperation',
              align: 'right'
          }
      ],
    }
  },
  created() {
    this.$emit('setactive', '2')
    this.getAccount() // 资产总览
    this.getAssetList()
    this.getRate()
  },
  methods: {
    /* 获取汇率 */
    getRate() {
      getRate().then(res => {
        this.CNY = res.CNY
      })
    },
    /* 搜索 */
    search() {
      if (!this.searchValue) {
        this.assetList = this.searchList
        return
      }
      this.assetList = this.searchList.filter(item => {
        return item.currencyName.indexOf(this.searchValue.toUpperCase()) != -1
      })
    },
    /* 获取资产列表 */
    getAssetList() {
      this.tableLoading = true
      getAssetList('spot').then(res => {
        this.searchList = res
        this.assetList = res
      }).finally(() => {
        this.tableLoading = false
      })
    },
    /* 资产总览 */
    getAccount() {
      getAccount().then(res => {
        if (res && res.length) {
          let wallet = res.filter(item => {
            return item.account == 'wallet'
          })
          this.wallet = wallet[0]

          let spot = res.filter(item => {
            return item.account == 'spot'
          })
          this.spot = spot[0]

          let otc = res.filter(item => {
            return item.account == 'otc'
          })
          this.otc = otc[0]
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// 去除表格边框
.ivu-table-wrapper {
  border: none;
}
::v-deep .ivu-table:after {
  width: 0;
}
.page-wrap {
  margin-top: 20px;
  width: 100%;
}
.top {
  border-radius: 10px;
  .top-con {
    padding: 30px;
    background-color: #fff;
    border-radius: 10px;
    .tit {
      font-size: 22px;
    }
    .num {
      font-size: 33px;
      color: #333;
    }
    .sec {
      font-size: 16px;
      color: #7183B8;
    }
    .profit {
      font-size: 16px;
      .profit-left {
        color: #999999;
      }
      .profit-right {
        color: #00C096;
      }
    }
  }
}
.item-wrap {
  margin-top: 6px;
  margin-bottom: 20px;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
}
</style>