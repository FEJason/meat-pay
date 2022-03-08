<template>
  <div class="page-wrap">
    <div class="header-wrap">
      <div class="con">{{ $t('transac.bbdd') }}</div>
    </div>
    <div class="tab-wrap">
      <ul class="u-flex">
        <li :class="{ on: active == 0 }" @click="handleTab(0)">{{ $t('transac.dqwt') }}</li>
        <li :class="{ on: active == 1 }" @click="handleTab(1)">{{ $t('transac.wtls') }}</li>
        <!-- <li :class="{'on' : active == 2}" @click="handleTab(2)">成交明细</li> -->
      </ul>
    </div>
    <div class="con-wrap">
      <div class="table-wrap">
        <div class="u-flex u-row-between">
          <h2>{{ title }}</h2>
          <div class="u-m-t-24">
            <Form class="form" :model="formItem" :label-width="75" inline>
              <FormItem :label="$t('transac.qzsj')">
                <DatePicker
                  type="daterange"
                  v-model="formItem.date"
                  style="width: 220px"
                  :placeholder="$t('transac.xzrq')"
                ></DatePicker>
              </FormItem>
              <FormItem :label="$t('transac.lx')">
                <Select
                  clearable
                  v-model="formItem.type"
                  style="width: 100px"
                  :placeholder="$t('publice.qxz')"
                >
                  <Option value="LIMIT_PRICE">{{ $t('transac.xj') }}</Option>
                  <Option value="MARKET_PRICE">{{ $t('transac.sj') }}</Option>
                </Select>
              </FormItem>
              <FormItem :label="$t('transac.jyfx')">
                <Select
                  clearable
                  v-model="formItem.direction"
                  style="width: 100px"
                  :placeholder="$t('publice.qxz')"
                >
                  <Option value="BUY">{{ $t('transac.buy') }}</Option>
                  <Option value="SELL">{{ $t('transac.sell') }}</Option>
                </Select>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleSubmit">{{ $t('transac.ss') }}</Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="table">
          <Table
            size="small"
            :no-data-text="$t('publice.zwsj')"
            :columns="columns"
            :data="orders"
            :loading="loading"
          >
            <template slot-scope="{ row, index }" slot="slotTime">
              {{ $yj.timeFormat(row.time) }}
            </template>
            <template slot-scope="{ row, index }" slot="slotSymbol">
              <div style="color: #007aff">{{ row.coinSymbol }}/{{ row.baseSymbol }}</div>
            </template>
            <template slot-scope="{ row, index }" slot="slotType">
              {{
                row.type === 'LIMIT_PRICE'
                  ? $t('transac.xj')
                  : $t('transac.sj')
              }}
            </template>
            <template slot-scope="{ row, index }" slot="slotDirection">
              <div :style="{ color: row.direction == 'BUY' ? '#19be6b' : '#f16643'}">
                {{
                  row.direction == 'BUY'
                    ? $t('transac.buy')
                    : $t('transac.sell')
                }}
              </div>
            </template>
            <template slot-scope="{ row, index }" slot="slotPrice">
              <div>
                {{ $yj.transMoney(row.price) }}
              </div>
            </template>
            <template slot-scope="{ row, index }" slot="slotNum">
              <div>
                {{ row.amount }}
              </div>
            </template>
            <!-- <template slot-scope="{ row, index }" slot="slotTradedAmount">
              <div>
              </div>
            </template> -->
            <template slot-scope="{ row, index }" slot="slotTurnover">
              <div> {{ $yj.transMoney(row.turnover) }} </div>
            </template>
            <template slot-scope="{ row, index }" slot="slotCancel" v-if="active == 0">
              <Button @click="cancel(row.orderId)" size="small" >{{ $t('transac.cd') }}</Button>
            </template>
          </Table>
          <!-- <div class="page">
            <Page
              :total="total"
              :pageSize="pageSize"
              :current="pageNo"
              @on-change="loadDataPage"
            ></Page>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { currentOrder, historyOrder } from '@/api/user'
import { cancelOrder } from '@/api/exchange'
import TradeVue from '../otc/Trade.vue'
export default {
  data() {
    return {
      title: this.$t('transac.dqwt'),
      active: 0,
      loading: false,
      pageSize: 10,
      pageNo: 1,
      total: 10,
      formItem: {
        symbol: '',
        type: '',
        direction: '',
        date: ''
      },
      symbol: [],
      columns: [
        {
          title: this.$t('transac.time'),
          slot: 'slotTime',
          minWidth: 55
        },
        {
          title: this.$t('transac.jyd'),
          width: 130,
          slot: 'slotSymbol'
        },
        {
          title: this.$t('transac.lx'),
          slot: 'slotType',
          width: 70
        },
        {
          title: this.$t('transac.fx'),
          slot: 'slotDirection',
          width: 90
        },
        {
          title: this.$t('transac.jg'),
          slot: 'slotPrice'
        },
        {
          title: this.$t('transac.sl'),
          slot: 'slotNum'
        },
        {
          title: this.$t('transac.cjje'),
          slot: 'slotTurnover'
        },
        {
          title: this.$t('transac.cz'),
          key: 'operate',
          width: 110,
          slot: 'slotCancel'
        }
      ],
      orders: []
    }
  },
  created() {
    this.getOrders(0) // 获取当前委托
  },
  methods: {
    /* 撤单 */
    cancel(orderId) {
      cancelOrder(
        orderId
      ).then(() => {
        this.getHistoryOrder()
        this.$Notice.success({
          title: this.$t("exchange.tip"),
          desc: this.$t("exchange.cancelsuccess")
        })
      })
    },
    /* 切换tab */
    handleTab(index) {
      console.log(index)
      this.active = index
      this.getOrders(index)
      switch (index) {
        case 0:
          this.title = this.$t("transac.dqwt")
          break
        case 1:
          this.title = this.$t("transac.wtls")
          break
        case 2:
          // this.title = '成交明细'
          break
      }
    },
    loadDataPage(data) {
      this.pageNo = data
      this.getOrders()
    },
    handleSubmit() {
      this.pageNo = 1
      this.getOrders(this.active)
    },
    /* 查询当前委托 */
    getOrders(index) {
      const { symbol, type, direction, date: rangeDate } = this.formItem
      const startTime = new Date(rangeDate[0]).getTime() || '',
        endTime = new Date(rangeDate[1]).getTime() || ''

      console.log(index)
      let fetch = index == 0 ? currentOrder : index == 1 ? historyOrder : ''

      this.loading = true
      fetch({
        current: this.pageNo,
        size: this.pageSize,
        symbol,
        type,
        direction,
        startTime,
        endTime
      })
        .then(resp => {
          let rows = []
          if (resp.records.length > 0) {
            this.total = resp.totalElements
            // for (var i = 0; i < resp.records.length; i++) {
            //   var row = resp.records[i]
            //   row.price =
            //     row.type == 'MARKET_PRICE'
            //       ? this.$t('exchange.marketprice')
            //       : row.price
            //   rows.push(row)
            // }
            this.orders = resp.records
          } else {
            this.orders = []
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.header-wrap {
  height: 80px;
  line-height: 80px;
  background-color: #202058;
  .con {
    width: 1200px;
    margin: 0 auto;
    font-size: 20px;
    color: #fff;
  }
}
.tab-wrap {
  ul {
    width: 1200px;
    margin: 0 auto;
    height: 85px;
    line-height: 85px;
    li {
      margin-right: 30px;
      font-size: 16px;
      cursor: pointer;
    }
    .on {
      color: #007aff;
    }
  }
}
.con-wrap {
  background-color: #f2f6fd;
  border-radius: 34px 34px 0 0;
  min-height: 750px;
  .table-wrap {
    width: 1200px;
    margin: 0 auto;
  }
}
</style>