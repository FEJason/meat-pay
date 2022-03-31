<template>
  <div class="page-wrap u-flex u-col-top">
    <!-- PC端导航 -->
    <div class="menu-wrap hidden-xs">
      <Menu :active-name="activeName" width="180px">
          <MenuGroup title="钱包">
              <!-- <MenuItem name="1" to="/finance/account">
                  <Icon type="md-document" />
                  {{ $t('finance.zczl') }}
              </MenuItem> -->
              <MenuItem name="2" to="/finance/otc">
                  <Icon type="md-chatbubbles" />
                  资金账户
              </MenuItem>
              <MenuItem name="4" to="/finance/record">
                  <Icon type="md-chatbubbles" />
                  充币&提币记录
              </MenuItem>
              <!-- <MenuItem name="3" to="/finance/otc">
                  <Icon type="md-chatbubbles" />
                  {{ $t('finance.fbzh') }}
              </MenuItem> -->
          </MenuGroup>
      </Menu>
    </div>
    <div class="con">
      <!-- 移动端导航 -->
      <div class="hidden-lg">
        <van-cell is-link @click="showPop = true">资金账户</van-cell>
        <van-popup v-model="showPop" position="left">
          <div class="pop-wrap">
            <van-sidebar v-model="activeKey" @change="onChange">
              <van-sidebar-item title="资金账户" to="/finance/otc" />
              <van-sidebar-item title="充币&提币记录" to="/finance/record"/>
            </van-sidebar>
          </div>
        </van-popup>
      </div>
      <router-view @setactive="setactive"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPop: false,
      activeKey: 0,
      activeName: '2'
    }
  },
  methods: {
    /* 设置导航选中 */
    setactive(val) {
      console.log(val)
      this.activeName = val
    },
    onChange() {
      this.showPop = false
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  background-color: #E8EEF6;
  overflow: hidden;
}
.menu-wrap {
  width: 180px;
  padding-bottom: 3000px;
  margin-bottom: -3000px;
  background-color: #fff;
}
.con {
  margin-left: 20px;
  margin-right: 20px;
  flex: 1;
  min-height: calc(100vh - 374px);
}
.pop-wrap {
  height: 100vh;
  width: 80vw;
}
::v-deep .van-sidebar {
  width: 100%;
}
::v-deep .van-sidebar-item--select::before {
  background-color: #2d8cf0;
  height: 100%;
}

/* 手机端 */
@media (max-width: 767px) {
  .con {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>