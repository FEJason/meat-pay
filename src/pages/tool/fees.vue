<template>
  <div class="page-wrap">
    <div class="header">
      充值&提现费率
    </div>
    <div class="body">
      <div class="top">
        <div class="u-flex u-row-between">
          <div class="u-flex-1">
            <div>充值手续费</div>
            <div class="u-tips-color">Expay不收取数字币充值手续费。</div>
          </div>
          <div class="u-flex-1">
            <div>提现费率</div>
            <div class="u-tips-color">通过区块网络提币时，您将支付相应主网产生的手续费。提现费率由区块链网络决定。请检查最新数据。</div>
          </div>
        </div>
        <div>
          <Input class="search" prefix="ios-search" placeholder="请选择数字币" @on-change="seachInputChange" v-model="searchValue"/>
        </div>
      </div>
      <div class="con u-border-bottom u-m-b-60">
        <Table :columns="columns" :data="feeData" disabled-hover>
          <template slot-scope="{ row, index }" slot="slotName">
            <div class="table-column">
              <!-- <img :src="row.icon" alt="icon" style="width: 30px;" class="u-m-8"> -->
              <div>{{row.currencyName}}</div>
            </div>
          </template>
          <!-- <template slot-scope="{ row, index }" slot="slotNames">
            <div class="u-flex">
              <div class="table-column">{{row.names}}</div>
            </div>
          </template> -->
          <template slot-scope="{ row, index }" slot="slotType">
            <div class="u-flex table-column" v-for="item in row.tokenChainList" :key="item.tokenId">
              <div class="u-p-r-4">{{item.chainName}}</div>
              <div class="hint" v-if="item.isOutState">暂停提币</div>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="slotMin">
            <div class="u-flex table-column" v-for="item in row.tokenChainList" :key="item.tokenId">
              <div class="u-p-r-4">{{item.leastPayOut}}</div>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="slotIsFree">
            <div class="table-column">免费</div>
          </template>
          <template slot-scope="{ row, index }" slot="slotFee">
             <div class="u-flex table-column" v-for="item in row.tokenChainList" :key="item.tokenId">
              <div class="u-p-r-4">{{item.payOutFee}}</div>
            </div>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrencyList } from '@/api/finance'
export default {
  name: 'Fess',
  data() {
    return {
      searchValue: '',
      columns: [
          {
              title: '币种',
              slot: 'slotName'
          },
          // {
          //     title: '全称',
          //     slot: 'slotNames'
          // },
          {
              title: '主网类型',
              slot: 'slotType'
          },
          {
              title: '最小提现数量',
              slot: 'slotMin'
          },
          {
              title: '充值手续费',
              slot: 'slotIsFree'
          },
          {
              title: '提币手续费',
              slot: 'slotFee'
          }
      ],
      searchData: [],
      feeData: []
    }
  },
  created() {
    this.getCurrencyList()
  },
  methods: {
    async getCurrencyList() {
      let res = await getCurrencyList()
      this.feeData = res
      this.searchData = res
    },
    seachInputChange() {
      if (!this.searchValue) {
        this.feeData = this.searchData
        return
      }
      this.feeData = this.searchData.filter(item => {
        return item.currencyName.indexOf(this.searchValue.toUpperCase()) != -1
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ivu-table td {
  vertical-align: top;
}
::v-deep .ivu-table th{
  height: 44px !important;
  border-top: 1px solid #e8eaec;
}
.page-wrap {
  .header {
    padding: 40px 132px;
    font-size: 40px;
  }
  .body {
    padding: 32px 132px;
  }
}
.search {
  margin-top: 40px;
  margin-bottom: 30px;
  ::v-deep input {
    border-radius: 20px;
    width: 145px;
  }
}
.table-column {
  padding-top: 20px;
  &:last-child {
    padding-bottom: 20px;
  }
}
.hint {
    font-size: 12px;
    height: 20px;
    padding-left: 8px;
    padding-right: 8px;
    line-height: 20px;
    background-color: rgba(253,92,183,0.1);
    color: #DD3652;
    border-radius: 4px;
}

</style>