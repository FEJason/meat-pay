<template>
  <div class="page-wrap">
    <!-- <div class="title u-flex u-font-18" @click="$router.go(-1)">
      <Icon type="ios-arrow-back" color="#333" />
      返回
    </div> -->

    <div class="con">
      <ul class="u-flex">
        <li
          :class="{ on: active == index }"
          v-for="(item, index) in tabList"
          :key="index"
          @click="tabChange(index)"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="table">
      <div class="title u-flex u-row-between">
        <div class="u-font-14">{{ tableTitle }}</div>
        <div>
          <!-- <router-link to="/">查看全部</router-link> -->
        </div>
      </div>
      <div class="table-wrap">
        <Table :columns="columns" :data="tableData" :loading="tableLoading">
          <template slot-scope="{ row, index }" slot="slotBillType">
            {{ formatType[row.billType.toString()] }}
          </template>
          <template slot-scope="{ row, index }" slot="status">
            <div>{{ formatStatus[row.status] }}</div>
          </template>
        </Table>
      </div>
    </div>
    <div class="u-text-center u-p-t-30">
      <Page :total="totalPage" @on-change="onChange" />
    </div>
  </div>
</template>

<script>
import { getCurrencyList, getRecord } from '@/api/finance'
// import safeModal from '@components/safeModal/safeModal'
// import QrcodeVue from "qrcode.vue"

export default {
  components: {
    // QrcodeVue
    // safeModal
  },
  data() {
    return {
      active: this.$route.query.active || 0,
      tableTitle: '充币记录',
      tabList: ['充币记录', '提币记录'],
      formatStatus: {
        0: '待审核',
        1: '进行中',
        2: '失败',
        3: '完成'
      },
      formatType: {
        1: '充值',
        2: '提币'
      },
      coinList: [],
      tableLoading: false,
      tableData: [],
      columns: [
        {
          title: '时间',
          key: 'createTime'
        },
        {
          title: '币种',
          key: 'currencyName'
        },
        {
          title: '类型',
          align: 'right',
          slot: 'slotBillType',
          key: 'billType'
        },
        {
          title: '数量',
          align: 'right',
          key: 'amount'
        },
        {
          title: '状态',
          align: 'right',
          slot: 'status'
        },
      ],
      queryData: {
        type: 1,
        size: 10,
        current: 1,
        currencyId: '',
        timeStamp: '',
      },
      totalPage: 0
    }
  },
  created() {
    this.getRecord()
    this.getCurrencyList()
  },
  methods: {
    /* 切换页码 */
    onChange(page) {
      this.queryData.current = page
      this.getRecord()
    },
    /* 切换tab */
    tabChange(index) {
      this.active = index
      this.tableTitle = this.tabList[index]
      this.getRecord(index)
    },
    /* 获取财务记录 */
    getRecord() {
      switch(this.active) {
        case 0:
          this.queryData.type = 1
          break;
        case 1:
          this.queryData.type = 2
          break;
        case 2:
          this.queryData.type = 7
          break;
      }
      this.tableLoading = true
      getRecord({
        walletType: 'otc',
        ...this.queryData
      }).then(res => {
        if (res.records && res.records.length) {
          this.tableData = res.records
          this.totalPage = res.total
        } else {
          this.tableData = []
          this.totalPage = 0
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },

    /* 复制地址 */
    copySuccess() {
      this.$Notice.success({
        title: '提示',
        desc: '复制成功'
      })
    },
    /* 获取币种列表 */
    getCurrencyList() {
      return new Promise(resolve => {
        getCurrencyList().then(res => {
          this.coinList = res

          resolve()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ivu-table td, .ivu-table th {
    height: 40px !important;
}
::v-deep .ivu-input[disabled],
fieldset[disabled] .ivu-input {
  background-color: #ecf1f8;
  border: none;
}

.page-wrap {
  margin: 0 auto;
  .title {
    height: 68px;
    line-height: 68px;
    color: #333;
  }
  .con {
    // background-color: #f9fafc;
    // border-radius: 7px;
    padding: 20px 0;
  }
  .table {
    background-color: #f9fafc;
    border-radius: 7px;
    .title {
      border-bottom: 1px solid #e8eaec;
      padding: 0 18px;
    }
  }
}

.con {
  ul {
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