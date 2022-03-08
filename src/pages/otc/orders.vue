<template>
  <div class="orders-wrap">
    <div class="tit">
      <ul class="u-flex">
        <li
          :class="{'on': active == index}"
          v-for="(item, index) in tabList"
          :key="index"
          @click="tabBtn(index)">{{ item }}</li>
      </ul>
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row, index }" slot="slotId">
          <div>
            <span class="u-p-r-6" v-if="row.side == 1" style="color: #19be6b">{{ $t('orders.buy') }}</span>
            <span class="u-p-r-6" v-if="row.side == 2" style="color: #f16643">{{ $t('orders.sell') }}</span>
            <router-link :to="`/otc/orderInfo/${row.id}`">{{ row.id }}</router-link>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="slotStatus">
          {{ row.status | filterStatus }}
        </template>
        <template slot-scope="{ row, index }" slot="slotSourceAmount">
          <span style="color: #19be6b">{{ row.sourceAmount }} {{ row.fiatCurrency}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="slotPrice">
          {{ row.tradePrice }} {{ row.fiatCurrency }}
        </template>
        <template slot-scope="{ row, index }" slot="slotNum">
          {{ row.settleAccount }} {{ row.currencyName }}
        </template>
        <template slot-scope="{ row, index }" slot="slotTime">
          {{ row.createTime }}
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { getOrderList, getUndoneList } from '@/api/trade'
export default {
  data() {
    return {
      loading: false,
      active: 0,
      tabList: [
        this.$t('orders.jxz'),
        this.$t('orders.ywc'),
        this.$t('orders.yqx'),
        this.$t('orders.qb')
      ],
      columns: [
        {
          title: this.$t('orders.ddh'),
          slot: 'slotId',
          width: '280px'
        },
        {
          title: this.$t('orders.zt'),
          slot: 'slotStatus'
        },
        {
          title: this.$t('orders.zj'),
          slot: 'slotSourceAmount'
        },
        {
          title: this.$t('orders.dj'),
          slot: 'slotPrice'
        },
        {
          title: this.$t('orders.sl'),
          slot: 'slotNum'
        },
        {
          title: this.$t('orders.cjsj'),
          slot: 'slotTime',
          align: 'right'
        },
      ],
      data: []
    }
  },
  filters: {
    filterStatus(val) {
      // 0：订单取消 1：待付款 2：确认付款 3：申诉 4：完成
      switch(val) {
        case 0:
          return this.$t('orders.ddqx')
        case 1:
          return this.$t('orders.dfk')
        case 2:
          return this.$t('orders.qrfk')
        case 3:
          return this.$t('orders.ss')
        case 4:
          return this.$t('orders.ywc')
      }
    }
  },
  created() {
    // 默认查进行中
    this.getUndoneList()
  },
  methods: {
    /* 切换状态 */
    tabBtn(index) {
      this.active = index
      switch(index) {
        // 进行中
        case 0:
          this.getUndoneList()
          break
        // 已完成
        case 1:
          this.getOrderList(4)
          break;
        // 已取消
        case 2:
          this.getOrderList(0)
          break;
        // 全部
        case 3:
          this.getOrderList('')
          break;
      }
      
    },
    /* 获取列表 */
    getOrderList(status) {
      this.loading = true
      getOrderList({
        status: status,
        pages: 2,
      }).then(res => {
        this.data = res.records
      }).finally(() => {
        this.loading = false
      })
    },
    /* 查询未完成的订单 */
    getUndoneList() {
      this.loading = true
      getUndoneList().then(res => {
        this.data = res.records
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.orders-wrap {
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 100px;
}
.tit {
  ul {
    padding: 30px 0;
    li {
      margin-right: 30px;
      font-size: 16px;
      color: #333;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }
    .on {
      border-bottom: 2px solid #333;
    }
  }
}

</style>