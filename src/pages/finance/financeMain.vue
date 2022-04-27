<template>
  <div class="page-wrap u-flex u-col-top">
    <!-- PC端导航 -->
    <div class="menu-wrap hidden-xs">
      <Menu :active-name="activeName" width="180px">
          <MenuGroup :title="$t('finance.qb')">
              <MenuItem name="2" to="/finance/otc">
                  <Icon type="md-chatbubbles" />
                  {{ $t('finance.zjzh') }}
              </MenuItem>
              <MenuItem name="4" to="/finance/record">
                  <Icon type="md-list-box" />
                  {{ $t('finance.cbtbjl') }}
              </MenuItem>
          </MenuGroup>
      </Menu>
    </div>
    <div class="con">
      <!-- 移动端导航 -->
      <div class="hidden-lg">
        <van-cell is-link @click="showPop = true">{{ $t('finance.zjzh') }}</van-cell>
        <van-popup v-model="showPop" position="left">
          <div class="pop-wrap">
            <van-sidebar v-model="activeKey" @change="onChange">
              <van-sidebar-item :title="$t('finance.zjzh')" to="/finance/otc" />
              <van-sidebar-item :title="$t('finance.cbtbjl')" to="/finance/record"/>
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
  background-color: #F2F6FD;
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