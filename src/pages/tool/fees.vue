<template>
  <div class="page-wrap">
    <div class="header">
      <div class="con">
        <h2>费率说明</h2>
        <ul class="list-wrap">
          <li class="u-flex u-row-between">
            <div class="left u-flex">
              <img src="@/assets/img/fees-icon-01.png" alt="fee" />
              <div class="u-p-l-10">
                <h3 class="u-font-16">交易费率</h3>
                <p>扣取收到的资产</p>
              </div>
            </div>
            <div class="right">
              <p>Maker (挂单) 0.200%</p>
              <p>Taker (吃单) 0.200%</p>
            </div>
          </li>
          <li class="u-flex u-row-between">
            <div class="left u-flex">
              <img src="@/assets/img/fees-icon-02.png" alt="fee" />
              <div class="u-p-l-10">
                <h3 class="u-font-16">充值费率</h3>
                <p>充值免费</p>
              </div>
            </div>
            <div class="right u-font-16">免费</div>
          </li>
          <li class="u-flex u-row-between">
            <div class="left u-flex">
              <img src="@/assets/img/fees-icon-03.png" alt="fee" />
              <div class="u-p-l-10">
                <h3 class="u-font-16">提现费率</h3>
                <p>手续费根据区块实际情况定期调整</p>
              </div>
            </div>
            <div class="right"></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="table-wrap">
      <div class="u-flex u-row-between u-p-b-20 u-border-bottom">
        <h3 class="u-font-18">币种费率信息</h3>
        <Input prefix="ios-search" placeholder="搜索" style="width: auto" />
      </div>
      <Table :columns="columns1" :data="listData"></Table>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Fess',
  data() {
    return {
      columns1: [
        {
          // 币种
          title: '币种',
          key: 'symbol'
        },
        {
          // 最小提币数量
          title: '最小提币数量',
          key: 'min'
        },
        {
          // 提取手续费
          title: '提取手续费',
          align: 'right',
          key: 'fee'
        }
      ],
      listData: [
        {
          symbol: 'BTC',
          min: '0.1',
          fee: '0.1'
        },
        {
          symbol: 'USDT',
          min: '0.1',
          fee: '0.1'
        }
      ]
    }
  },
  mounted() {
    this.SET_HADERSTYLE('home')
  },
  methods: {
    ...mapMutations(['SET_HADERSTYLE'])
  },
  destroyed() {
    this.SET_HADERSTYLE('')
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  background-color: #eff3f6;
  padding-bottom: 100px;
}
.header {
  height: 314px;
  background: url('../../assets/img/fees-bg.png') no-repeat;
  background-size: cover;
  color: #fff;
  .con {
    width: 1200px;
    margin: 0 auto;
    padding-top: 109px;
    h2 {
      padding-bottom: 37px;
      font-size: 32px;
    }
  }
  .list-wrap {
    display: flex;
    justify-content: space-between;
    li {
      padding: 10px 20px;
      width: 375px;
      height: 89px;
      background: url('../../assets/img/fees-01.png') no-repeat;
    }
  }
}
.table-wrap {
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  color: #333;
}
</style>