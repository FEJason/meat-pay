<template>
  <div class="page-wrap">
    <div class="top">
      <div class="hint u-p-l-10">
        <Icon type="md-alert" size="16" color="#ffa400"/>
        {{ $t('finance.jcfw') }}
      </div>
      <div class="top-con u-flex u-row-between u-col-top">
        <div class="top-con-left">
          <div class="tit">
            <span>{{ $t('finance.zcgl') }}</span>
            <!-- <Icon type="ios-eye" size="26" class="u-p-l-10"/> -->
          </div>
          <div>
            <span class="num">{{ toFixeds(wallet.latestAmount, 6) || '--'}} USDT</span>
            <span class="sec u-p-l-10">≈ {{ toFixeds( NP.times(wallet.latestAmount, CNY) ) }} CNY</span>
          </div>
          <div class="profit">
            <span class="profit-left">{{ $t('finance.jrsy') }}</span>
            <span class="profit-right u-p-l-10">+0.888888 CNY</span>
          </div>
        </div>
        <div class="top-con-right">
          <Button size="large" to="/transfer?account=otc">{{ $t('finance.hz') }}</Button>
          <Button size="large" class="u-m-l-16" to="/withdraw">{{ $t('finance.tb') }}</Button>
        </div>
      </div>
    </div>

    <div class="item-wrap u-flex u-row-between">
      <div class="item-left">
        <div class="tit u-p-b-8">{{ $t('finance.bbzh') }}</div>
        <div>
          <span class="num">{{ toFixeds(spot.latestAmount, 6) || '--' }} USDT</span>
          <span class="sec u-p-l-10">≈ {{ toFixeds( NP.times(spot.latestAmount, CNY) ) }} CNY</span>
        </div>
      </div>
      <div class="item-right">
        <Button size="large" to="/transfer?account=spot">{{ $t('finance.hz') }}</Button>
        <Button size="large" class="u-m-l-16" to="/withdraw">{{ $t('finance.tb') }}</Button>
      </div>
    </div>

    <div class="item-wrap u-flex u-row-between">
      <div class="item-left">
        <div class="tit u-p-b-8">{{ $t('finance.fbzh') }}</div>
        <div>
          <span class="num">{{ toFixeds(otc.latestAmount, 6) || '--'}} USDT</span>
          <span class="sec u-p-l-10">≈ {{ toFixeds( NP.times(otc.latestAmount, CNY) ) }} CNY</span>
        </div>
      </div>
      <div class="item-right">
        <Button size="large" to="/otc/trade/buy-usdt">{{ $t('finance.gm') }}</Button>
        <Button size="large" class="u-m-l-16" to="/otc/trade/sell-usdt">{{ $t('finance.cs') }}</Button>
        <Button size="large" class="u-m-l-16" to="/transfer?account=otc">{{ $t('finance.hz') }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccount } from '@/api/finance'
import { getRate } from '@/api/user'
export default {
  data() {
    return {
      wallet: {},
      spot: {},
      otc: {},
      CNY: 6.3,
    }
  },
  created() {
    this.$emit('setactive', '1')
    this.getAccount() // 资产总览
    this.getRate()
  },
  methods: {
    /* 获取汇率 */
    getRate() {
      getRate().then(res => {
        this.CNY = res.CNY
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
.page-wrap {
  margin-top: 20px;
  width: 100%;
}
.top {
  border-radius: 10px;
  .hint {
    height: 70px;
    padding-bottom: 20px;
    line-height: 50px;
    border-radius: 10px;
    background: #FFF3DA;
    font-size: 14px;
  }
  .top-con {
    margin-top: -20px;
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
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  .tit {
    font-size: 16px;
    color: #333333;
  }
  .num {
    font-size: 18px;
    color: #333;
  }
  .sec {
    color: #7183B8;
    font-size: 16px;
  }
  
}
</style>