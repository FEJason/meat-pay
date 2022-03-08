<template>
  <div class="page-wrap u-flex u-col-top">
    <div class="menu-wrap">
      <Menu :active-name="activeName" width="180px">
          <MenuGroup title="钱包">
              <!-- <MenuItem name="1" to="/finance/account">
                  <Icon type="md-document" />
                  {{ $t('finance.zczl') }}
              </MenuItem> -->
              <MenuItem name="2" to="/finance/spot">
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
      <router-view @setactive="setactive"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '1'
    }
  },
  methods: {
    /* 设置导航选中 */
    setactive(val) {
      this.activeName = val
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  background-color: #E8EEF6;
}
.menu-wrap {
  width: 180px;
  min-height: 660px;
  background-color: #fff;
}
.con {
  margin-left: 20px;
  margin-right: 20px;
  width: 100%;
}
</style>