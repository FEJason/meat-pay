<template>
  <div class="orders-wrap">
    <div class="tit">
      <ul class="tab-wrap u-flex">
        <li
          :class="{'on': active == index}"
          v-for="(item, index) in tabList"
          :key="index"
          @click="tabBtn(index)">{{ item }}</li>
      </ul>
      <Table
        disabled-hover
        :columns="columns"
        :data="data"
        :loading="loading"
        class="hidden-xs">
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
        <template slot-scope="{ row, index }" slot="adName">
          <router-link :to="`/otc/orderInfo/${row.id}`" class="u-line-1">{{ row.adName }}</router-link>
        </template>
        
        <template slot-scope="{ row, index }" slot="slotTime">
          {{ row.createTime }}
        </template>
      </Table>
      <!-- 移动端列表 -->
      <ul class="xs-list hidden-lg" v-for="row in data" :key="row.id">
        <li>
          <div>订单号</div>
          <div>
            <span class="u-p-r-6" v-if="row.side == 1" style="color: #19be6b">{{ $t('orders.buy') }}</span>
            <span class="u-p-r-6" v-if="row.side == 2" style="color: #f16643">{{ $t('orders.sell') }}</span>
            <router-link :to="`/otc/orderInfo/${row.id}`">{{ row.id }}</router-link>
          </div>
        </li>
        <li>
          <div>状态</div>
          <div>{{ row.status | filterStatus }}</div>
        </li>
        <li>
          <div>总价</div>
          <div>
            <span style="color: #19be6b">{{ row.sourceAmount }} {{ row.fiatCurrency}}</span>
          </div>
        </li>
        <li>
          <div>单价</div>
          <div>
            {{ row.tradePrice }} {{ row.fiatCurrency }}
          </div>
        </li>
        <li>
          <div>数量</div>
          <div>
            {{ row.settleAccount }} {{ row.currencyName }}
          </div>
        </li>
        <li>
          <div>广告商</div>
          <div>
            <router-link :to="`/otc/orderInfo/${row.id}`" class="u-line-1">{{ row.adName }}</router-link>
          </div>
        </li>
        <li>
          <div>创建时间</div>
          <div>
            {{ row.createTime }}
          </div>
        </li>
      </ul>
      <!-- 分页 -->
      <div class="u-text-center u-m-t-20 u-m-b-20">
        <Page
          :pageSize="page.size"
          :total="page.total"
          :current="page.current"
          @on-change="changePage"
        ></Page>
      </div>
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
          width: '240px'
        },
        {
          title: this.$t('orders.zt'),
          slot: 'slotStatus',
          width: '140px'
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
          title: '广告商',
          slot: 'adName'
        },
        {
          title: this.$t('orders.cjsj'),
          width: '166',
          slot: 'slotTime',
          align: 'right'
        },
      ],
      data: [],
      page: {
        size: 10,
        current: 1,
        total: 0,
      }
    }
  },
  filters: {
    filterStatus(val) {
      // 0：订单取消 1：待付款 2：确认付款 3：申诉 4：完成
      switch(val) {
        case 0:
          return '已取消'
        case 1:
          return '待付款'
        case 2:
          return '已付款'
        case 3:
          return '申诉中'
        case 4:
          return '已完成'
      }
    }
  },
  created() {
    // 默认查进行中
    this.getUndoneList()
  },
  methods: {
    /* 分页 */
    changePage(val) {
      this.page.current = val
      switch(this.active) {
        case 0:
          this.getUndoneList()
          break;
        case 1:
          this.getOrderList(4)
          break;
        case 2:
          this.getOrderList(0)
          break;
        case 3:
          this.getOrderList('')
          break;
      }
    },
    /* 切换状态 */
    tabBtn(index) {
      this.active = index
      this.page.current = 1
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
        current: this.page.current,
      }).then(res => {
        this.data = res.records
        this.page = {
          current: res.current,
          size: res.size,
          total: res.total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    /* 查询未完成的订单 */
    getUndoneList() {
      this.loading = true
      getUndoneList().then(res => {
        this.data = res.records
        this.page = {
          current: res.current,
          size: res.size,
          total: res.total
        }
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
  .tab-wrap {
    padding: 30px 0;
    li {
      margin-right: 30px;
      font-size: 16px;
      color: #333;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }
    .on {
      color: #2483ff;
      border-bottom: 2px solid #2483ff;
    }
  }
}
/* 手机端 */
@media (max-width: 767px) {
  .orders-wrap {
    width: 100%;
    padding: 0 24px;
  }
  .xs-list {
    font-size: 14px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    li {
      height: 26px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>