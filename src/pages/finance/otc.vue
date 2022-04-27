<template>
  <div class="page-wrap">
    <div class="top-wrap">
      <div class="tit u-flex">
        <span v-text="$t('finance.zcgz')">资产估值</span>
        <i class="icon-wrap u-m-l-12" :class="hideBalance ? 'hide' : 'show'" @click="hiddenAmount"></i>
      </div>
      <div class="top-con-lg u-p-t-12">
        <div class="pay-font">
          <span class="num">
            {{ hideBalance ? '****' : otc.latestAmount}}
          </span>
          <span class="u-font-16 u-font-bold">BTC</span>
        </div>
        <div class="sec pay-font">≈ ￥{{hideBalance ? '****' : toFixeds( $yj.accMul(otc.usdAmount, CNY)) }}</div>
      </div>
      <div class="u-p-t-12">
        <Button type="primary" to="/deposit" v-text="$t('finance.congz')">充值</Button>
        <Button class="u-m-l-10" to="/withdraw" v-text="$t('finance.tb')">提币</Button>
        <router-link to="/finance/record" class="u-p-l-16">
          {{ $t('finance.cztbjl') }}
          <Icon type="ios-play" />
        </router-link>
      </div>
    </div>

    <div class="item-wrap u-m-t-20 u-m-b-20">
      <div class="u-flex">
        <Input
          class="search-wrap"
          style="width: auto;"
          v-model="searchValue" prefix="ios-search"
          :placeholder="$t('finance.ss')" @on-change="search"/>
        <div class="hidden-xs u-m-l-30">
          <Checkbox v-model="single" @on-change="hiddenMin" style="user-select: none;"
            v-text="$t('finance.yc0zc')">隐藏0资产</Checkbox>
        </div>
      </div>
      <div class="u-p-t-20 u-p-b-10">{{ $t('finance.jmhb') }}</div>

      <Table
        class="hidden-xs"
        :columns="columns5" :data="assetList"
        :loading="tableLoading" disabled-hover>
        <template slot-scope="{ row, index }" slot="currencyName">
          <div class="u-flex">
            <img :src="row.imageUrl" alt="img" style="width: 28px; height: 28px;"/>
            <div class="u-p-l-16">
              <p class="u-font-16">{{ row.currencyName }}</p>
              <p class="u-tips-color">{{ row.fullName }}</p>
            </div>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="balance">
          <div class="pay-font">
            {{ hideBalance ? '****' : row.balance }}
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="freeze">
          <div class="pay-font">
            {{ hideBalance ? '****' : row.freeze }}
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="rateUsd">
          <div class="pay-font">
            {{ hideBalance ? '****' :  toFixeds($yj.accDiv(row.rateUsd, btcPrice), 8) }}
          </div>
          <div class="u-tips" style="color: #7183B8">
            ≈ ￥{{ hideBalance ? '****' :  toFixeds($yj.accMul(row.rateUsd, CNY)) }}
          </div>
        </template>
        
        <template slot-scope="{ row, index }" slot="slotOperation">
          <!-- <router-link to="/otc/trade/buy-usdt" style="color: #28c878">{{ $t('finance.gm') }}</router-link> -->
          <router-link :to="`/deposit`"  v-text="$t('finance.congz')">充值</router-link>
          <router-link to="/withdraw" class="u-m-l-20"  v-text="$t('finance.tb')">提币</router-link>
        </template>
      </Table>

      <!-- 移动端列表 -->
      <div class="list-xs hidden-lg">
        <van-collapse v-model="collActive">
          <van-collapse-item
            v-for="row in assetList" :key="row.currencyId" :name="row.currencyId">
            <template #title>
              <div class="u-flex">
                <img :src="row.imageUrl" alt="img" style="width: 28px; height: 28px;"/>
                <div class="u-p-l-16">
                  <p class="u-font-16">{{ row.currencyName }}</p>
                  <p class="u-tips-color">{{ row.fullName }}</p>
                </div>
              </div>
            </template>
            
            <template #value>
              {{ hideBalance ? '****' : row.balance }}
            </template>

            <div class="u-font-12">
              <div class="u-flex u-row-between">
                <div v-text="$t('finance.ky')">可用</div>
                <div>{{ hideBalance ? '****' : row.balance }}</div>
              </div>
              <div class="u-flex u-row-between">
                <div v-text="$t('finance.dj')">冻结</div>
                <div>{{ hideBalance ? '****' : row.freeze }}</div>
              </div>
              <div class="u-flex u-row-between">
                <div v-text="$t('finance.btcgz')">BTC估值</div>
                <div class="u-text-right">
                  <span class="pay-font">
                  {{ hideBalance ? '****' :  toFixeds($yj.accDiv(row.rateUsd, btcPrice), 8) }}
                  </span>
                  <span class="u-tips u-p-l-10" style="color: #7183B8">
                    ≈ ￥{{ hideBalance ? '****' :  toFixeds($yj.accMul(row.rateUsd, CNY)) }}
                  </span>
                </div>
              </div>
            </div>

          </van-collapse-item>
        </van-collapse>
      </div>
    </div>

  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { getAccount, getAssetList } from '@/api/finance'
import { getRate, priceUnit } from '@/api/user'
export default {
  data() {
    return {
      collActive: [],
      btcPrice: 0,
      CNY: 0,
      searchValue: '',
      searchList: [],
      tableLoading: false,
      wallet: {},
      spot: {},
      otc: {
        usdAmount: 0.00,
        latestAmount: '0.00000000'
      },
      single: false,
      assetList: [],
      columns5: [
          {
              title: this.$t('finance.bz'),
              slot: 'currencyName',
          },
          {
              title: this.$t('finance.ky'),
              slot: 'balance',
              // sortable: true,
              align: 'right'
          },
          {
              title: this.$t('finance.dj'),
              slot: 'freeze',
              align: 'right'
          },
          {
              title: this.$t('finance.btcgz'),
              slot: 'rateUsd',
              align: 'right',
              sortable: true
          },
          {
              title: this.$t('finance.cz'),
              slot: 'slotOperation',
              align: 'right'
          },
      ],
      
    }
  },
  async created() {
    this.$emit('setactive', '2')
    try {
      await this.priceUnit()
    } catch (e) { }
    this.getAccount() // 资产总览
    this.getAssetList()
    this.getRate()
  },
  computed: {
    ...mapState(['hideBalance'])
  },
  methods: {
    ...mapMutations(['SETISHIDDENAMOUNT']),
    /* 隐藏资产 */
    hiddenAmount() {
      this.hideBalance ? this.SETISHIDDENAMOUNT(false) : this.SETISHIDDENAMOUNT(true)
    },
    /* 获取汇率 */
    getRate() {
      getRate().then(res => {
        this.CNY = res.CNY
      })
    },
    /* 获取计价单位 */
    priceUnit() {
      return new Promise((resolve, reject) => {
        priceUnit().then(res => {
          const arr = res.filter(item => {
            return item.symbol == 'BTC'
          })
          this.btcPrice = arr[0].price
          resolve()
        }).case(() => {
          reject()
        })
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
    /* 隐藏小额币种 */
    hiddenMin(val) {
      if (val) {
        this.assetList = this.searchList.filter(item => {
          return item.balance > 0 || item.freeze > 0
        })
      } else {
        this.assetList = this.searchList
      }
    },
    /* 获取资产列表 */
    getAssetList() {
      this.tableLoading = true
      getAssetList('otc').then(res => {
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
          const otc = res.filter(item => {
            return item.account == 'otc'
          })
          this.otc.usdAmount = otc[0].latestAmount
          this.otc.latestAmount = this.toFixeds(this.$yj.accDiv(otc[0].latestAmount, this.btcPrice), 8) || '0.00000000'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ivu-table td, .ivu-table th {
  height: 89px !important;
}
// 去除表格边框
.ivu-table-wrapper {
  border: none;
}
::v-deep .search-wrap .ivu-input {
  border-radius: 50px;
}
::v-deep .ivu-table:after {
  width: 0;
}
.page-wrap {
  margin-top: 20px;
  width: 100%;
}

.icon-wrap {
  cursor: pointer;
  display: inline-block;
  background-color: rgba(154,165,181,.1);
  width: 24px;
  height: 24px;
  border-radius: 6px;
  margin-left: 16px;
  background-repeat: no-repeat;
  &:hover {
    background-color: rgba(27,56,98,.1);
  }
}
.icon-wrap.show {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEzLjU1IDExLjk1YTEuNTUgMS41NSAwIDExLTMuMSAwIDEuNTUgMS41NSAwIDAxMy4xIDB6IiBmaWxsPSIjOUFBNUI1Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiA4YzIuMjEgMCA0LjIxIDEuMzE0IDYgMy45NDMtMS43OSAyLjYyOC0zLjc5IDMuOTQzLTYgMy45NDNzLTQuMjEtMS4zMTUtNi0zLjk0M0M3Ljc5IDkuMzE0IDkuNzkgOCAxMiA4em0wIDEuMDI5Yy0xLjY0IDAtMy4xODQuOTA0LTQuNjUyIDIuODA1bC0uMDgzLjEwOS4wMTcuMDIyYzEuNDY2IDEuOTMzIDMuMDEgMi44NjYgNC42NDkgMi44OTJIMTJjMS42NCAwIDMuMTg0LS45MDUgNC42NTItMi44MDVsLjA4My0uMTEtLjAxNy0uMDJjLTEuNDY2LTEuOTM0LTMuMDEtMi44NjctNC42NDktMi44OTNIMTJ6IiBmaWxsPSIjOUFBNUI1IiBzdHJva2U9IiM5QUE1QjUiIHN0cm9rZS13aWR0aD0iLjUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=);
}
.icon-wrap.hide {
  background-position: 50%;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC45MzQgNC4wNzlhLjU4OC41ODggMCAwMC0uODAzLjIxNWwtLjM2OC42MzdBNS40MzQgNS40MzQgMCAwMDkgNC44NzdjLTIuMjEgMC00LjIxIDEuMzE0LTYgMy45NDMuODg4IDEuMzA0IDEuODI4IDIuMjg1IDIuODIgMi45NDJsLS4zMzUuNThhLjU4OC41ODggMCAxMDEuMDE5LjU4N2w0LjY0Ni04LjA0NmEuNTg4LjU4OCAwIDAwLS4yMTYtLjgwNHptLTQuNiA2Ljc5TDkuMTk5IDUuOTFhNC40MzkgNC40MzkgMCAwMC0uMTI5LS4wMDRIOWMtMS42NCAwLTMuMTg0LjkwNS00LjY1MiAyLjgwNWwtLjA4My4xMS4wMTcuMDJjLjY2OC44ODEgMS4zNTEgMS41NTQgMi4wNTMgMi4wMjh6IiBmaWxsPSIjOUFBNUI1Ii8+PHBhdGggZD0iTTguOTMgMTEuNzM0YTQuMzggNC4zOCAwIDAxLS4zNjYtLjAyMWwtLjU1NC45NmMuMzI1LjA2LjY1NS4wOS45OS4wOSAyLjIxIDAgNC4yMS0xLjMxNCA2LTMuOTQzLS45NDItMS4zODMtMS45NDItMi40MDItMy0zLjA1N2wtLjUxNS44OWMuNzY1LjQ3OSAxLjUwOCAxLjE5IDIuMjMzIDIuMTQ1bC4wMTcuMDIyLS4wODMuMTA5Yy0xLjQ2OCAxLjktMy4wMTIgMi44MDUtNC42NTIgMi44MDVoLS4wN3oiIGZpbGw9IiM5QUE1QjUiLz48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC45MzQgNC4wNzlhLjU4OC41ODggMCAwMC0uODAzLjIxNWwtLjM2OC42MzdBNS40MzQgNS40MzQgMCAwMDkgNC44NzdjLTIuMjEgMC00LjIxIDEuMzE0LTYgMy45NDMuODg4IDEuMzA0IDEuODI4IDIuMjg1IDIuODIgMi45NDJsLS4zMzUuNThhLjU4OC41ODggMCAxMDEuMDE5LjU4N2w0LjY0Ni04LjA0NmEuNTg4LjU4OCAwIDAwLS4yMTYtLjgwNHptLTQuNiA2Ljc5TDkuMTk5IDUuOTFhNC40MzkgNC40MzkgMCAwMC0uMTI5LS4wMDRIOWMtMS42NCAwLTMuMTg0LjkwNS00LjY1MiAyLjgwNWwtLjA4My4xMS4wMTcuMDJjLjY2OC44ODEgMS4zNTEgMS41NTQgMi4wNTMgMi4wMjh6IiBzdHJva2U9IiM5QUE1QjUiIHN0cm9rZS13aWR0aD0iLjUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNOC45MyAxMS43MzRhNC4zOCA0LjM4IDAgMDEtLjM2Ni0uMDIxbC0uNTU0Ljk2Yy4zMjUuMDYuNjU1LjA5Ljk5LjA5IDIuMjEgMCA0LjIxLTEuMzE0IDYtMy45NDMtLjk0Mi0xLjM4My0xLjk0Mi0yLjQwMi0zLTMuMDU3bC0uNTE1Ljg5Yy43NjUuNDc5IDEuNTA4IDEuMTkgMi4yMzMgMi4xNDVsLjAxNy4wMjItLjA4My4xMDljLTEuNDY4IDEuOS0zLjAxMiAyLjgwNS00LjY1MiAyLjgwNWgtLjA3eiIgc3Ryb2tlPSIjOUFBNUI1IiBzdHJva2Utd2lkdGg9Ii41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+);
}
.top-wrap{
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  border-radius: 10px;
  .tit {
    font-size: 28px;
    font-weight: bold;
    user-select: none;
  }
  .num {
    font-size: 33px;
    color: #333;
  }
  .sec {
    font-size: 16px;
    color: #7183B8;
    padding-bottom: 7px;
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


.item-wrap {
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
}

.list-xs {
  ::v-deep .van-cell {
    align-items: center;
  }
}

/* PC端 */
@media (min-width: 768px) {
  .top-con-lg {
    display: flex;
    align-items: flex-end;
    .sec {
      padding-left: 10px;
    }
  }
}
/* 手机端 */
@media (max-width: 767px) {
  .page-wrap {
    margin-top: 1px;
  }
  .item-wrap {
    margin: 0 !important;
    padding: 20px 10px 10px;
    border-radius: 0;
  }
  .top-wrap {
    border-radius: 0;
  }
  .search-wrap {
    width: 100% !important;
    ::v-deep .ivu-input{
      width: 100%;
    }
  }
  
}
</style>