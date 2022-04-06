<template>
  <div class="content-wraps">
    <!-- 公共头部 -->
    <div class="top-wrap">
      <div class="top-content u-flex u-row-between u-col-bottom u-p-b-10">
        <router-link to="/otc/trade/buy-usdt" class="tit u-font-16 u-font-bold">{{ $t('trade.main.zxjy') }}</router-link>
        <div class="hidden-xs" v-if="isLogin">
          <!-- <router-link to="/" class="u-font-16 u-p-r-40" style="color: #515a6e">{{ $t('trade.main.help') }}</router-link> -->
          <Dropdown @on-click="gotoMenu">
            <span class="u-font-16" style="color: #515a6e; cursor: pointer;">
              {{ $t('trade.main.set') }}
              <Icon type="ios-arrow-down"></Icon>
            </span>
            <DropdownMenu slot="list">
              <DropdownItem name="/set-payment">{{ $t('trade.main.skfs') }}</DropdownItem>
              <!-- <DropdownItem name="">交易设置</DropdownItem> -->
              <DropdownItem name="/security">{{ $t('trade.main.rzxx') }}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <router-link to="/" class="u-font-16 u-p-l-40" style="color: #515a6e">历史广告</router-link>
          <router-link to="/otc/orders" class="u-font-16 u-p-l-40" style="color: #515a6e">{{ $t('trade.main.order') }}</router-link>
        </div>
      </div>
    </div>
    
    <div class="trade-content">
      <router-view></router-view>
    </div>
    
  </div>
</template>

<style scoped lang="scss">
.top-wrap {
  background-color: #FBFCFF;
  .top-content {
    width: 1200px;
    margin: 0 auto;
    height: 82px;
  }
  .tit {
    cursor: pointer;
    color: #007AFF;
  }
}
.trade-content {
  background-color: #F2F6FD;
  min-height: calc(100vh - 456px);
}

/* 手机端 */
@media (max-width: 767px) {
  .top-wrap {
    padding: 0 24px;
    .top-content {
      width: 100%;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      
    };
  },
  computed: {
    isLogin: function() {
      return this.$store.state.isLogin;
    }
  },
  methods: {
    /* 跳转菜单 */
    gotoMenu(name) {
      this.$router.push({
        path: name
      })
    }
  },
  created() {
    this.$store.commit('navigate', 'nav-otc')
  }
};
</script>
