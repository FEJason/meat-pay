<template>
  <div class="page-wrap">
    <!-- <div class="title u-flex u-font-18" @click="$router.go(-1)">
      <Icon type="ios-arrow-back" color="#333" />
      返回
    </div> -->
    <div class="page-con">
      <div class="con">
        <ul class="tab-wrap u-flex">
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
        <div class="title hidden-xs">
          <div class="u-font-14">{{ tableTitle }}</div>
        </div>
        <div class="table-wrap hidden-xs">
          <Table :columns="columns" :data="tableData" :loading="tableLoading">
            <template slot-scope="{ row, index }" slot="slotBillType">
              {{ active == 0 ? '充值' : '提现'}}
            </template>
            <template slot-scope="{ row, index }" slot="status">
              <div>{{ active == 0 ? formatStatus1[row.status.toString()] : formatStatus[row.status.toString()] }}</div>
            </template>
            <template slot-scope="{ row, index }" slot="slotOperation">
              <div class="u-link" @click="openDetails(row.id)">详情</div>
            </template>
          </Table>
        </div>
        <!-- 移动端列表 -->
        <!-- <ul class="xs-list hidden-lg" v-for="row in tableData" :key="row.timeStamp">
          <li>
            <div>时间</div>
            <div>
              {{ row.createTime }}
            </div>
          </li>
          <li>
            <div>币种</div>
            <div>{{ row.currencyName }}</div>
          </li>
          <li>
            <div>类型</div>
            <div>
              {{ formatType[row.billType.toString()] }}
            </div>
          </li>
          <li>
            <div>数量</div>
            <div>
              {{ row.amount }}
            </div>
          </li>
          <li>
            <div>状态</div>
            <div>
              {{ formatStatus[row.status] }}
            </div>
          </li>
        </ul> -->
      </div>
      <div class="u-text-center u-p-t-30 u-p-b-30">
        <Page :total="totalPage" @on-change="onChange" />
      </div>
    </div>
    <Modal
        v-model="modal"
        title="详情"
        footer-hide>
        <div class="detail">
          <p class="u-p-b-20 u-flex">
            <span>提现网络</span>
            <span class="u-p-l-20 u-tips-color">{{ recordDetails.contractName }}</span>
          </p>
          <p class="u-p-b-20 u-flex">
            <span>确认数</span>
            <span class="u-p-l-20 u-tips-color">{{ recordDetails.chainConfirmNum }}</span>
          </p>
          <p class="u-p-b-20 u-flex">
            <span>收款地址</span>
            <span class="u-p-l-20 u-tips-color">{{ recordDetails.toAddress }}</span>
          </p>
          <p class="u-p-b-20 u-flex">
            <span>交易哈希</span>
            <span class="u-p-l-20 u-tips-color" style="max-width: 300px; word-wrap: break-word;">{{ recordDetails.txHash}}</span>
          </p>
          <p class="u-p-b-20 u-flex">
            <span>日期</span>
            <span class="u-p-l-20 u-tips-color" style="max-width: 300px; word-wrap: break-word;">{{ recordDetails.createTime}}</span>
          </p>
          <div class="u-p-t-20">
            <Button type="primary" long :to="recordDetails.scanUrl + recordDetails.txHash">查询链上详细信息</Button>
          </div>
        </div>
    </Modal>
  </div>
</template>

<script>
import { getCurrencyList, getRecord, getRecordList, getRecordDetails } from '@/api/finance'
// import safeModal from '@components/safeModal/safeModal'
// import QrcodeVue from "qrcode.vue"

export default {
  components: {
    // QrcodeVue
    // safeModal
  },
  data() {
    return {
      modal: false,
      active: this.$route.query.active || 0,
      tableTitle: this.$t('finance.congbjl'),
      tabList: [this.$t('finance.congbjl'), this.$t('finance.tbjl')],
      formatStatus: {
        0: '待审核',
        1: '进行中',
        2: '失败',
        3: '完成'
      },
      formatStatus1: {
        0: '确认中',
        1: '成功',
        2: '失败'
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
          title: this.$t('finance.sj'),
          key: 'createTime'
        },
        {
          title: this.$t('finance.bz'),
          key: 'currencyName'
        },
        {
          title: this.$t('finance.leix'),
          align: 'right',
          slot: 'slotBillType',
          key: 'status'
        },
        {
          title: this.$t('finance.shul'),
          align: 'right',
          key: 'amount'
        },
        {
          title: this.$t('finance.zhuangt'),
          align: 'right',
          slot: 'status'
        },
        {
          title: '操作',
          align: 'right',
          slot: 'slotOperation'
        },
      ],
      queryData: {
        type: 1,
        size: 10,
        current: 1,
        currencyId: '',
        timeStamp: '',
      },
      totalPage: 0,
      recordDetails: {},
    }
  },
  created() {
    this.getList()
    // this.getCurrencyList()
  },
  methods: {
    ok () {
      this.$Message.info('Clicked ok');
    },
    cancel () {
      this.$Message.info('Clicked cancel');
    },
    openDetails(id) {
      this.modal = true
      getRecordDetails({id})
        .then(res => {
          this.recordDetails = res
        })
    },
    /* 切换页码 */
    onChange(page) {
      this.queryData.current = page
      this.getList()
    },
    /* 切换tab */
    tabChange(index) {
      this.active = index
      this.tableTitle = this.tabList[index]
      this.getList()
    },
    /* 获取列表 */
    getList() {
      switch(this.active) {
        case 0:
          this.getRecordList()
          break;
        case 1:
          this.queryData.type = 2
          this.getWithdrawList()
          break;
      }
    },
    /* 充值记录 */
    getRecordList() {
      this.tableLoading = true
      getRecordList({
        createTime: this.$yj.timeFormat(new Date().getTime())
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
    /* 提币记录 */
    getWithdrawList() {
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
  .tab-wrap {
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
.detail {
  p {
    span:nth-child(1) {
      min-width: 60px;
    }
  }
}

/* 手机端 */
@media (max-width: 767px) {
  .page-con {
    padding: 0 12px;
  }
  .page-wrap {
    .table {
      background-color: transparent !important;
    }
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