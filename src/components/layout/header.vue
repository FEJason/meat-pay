<template>
  <div>
    <div class="hidden-xs header-wrap u-flex u-row-between" :class="{'home-header-wrap': headerStyle == 'home', 'invitation-header-wrap': headerStyle == 'invitation'}">
      <div class="header-left u-flex">
        <div class="header-logo">
          <h1 class="logo" style="color: #fff; margin-bottom: 20px;">
            <!-- <router-link to="/">
              <img
                src="@/assets/images/meta_logo.png"
                alt="logo"
                style="width: 142px"
              />
            </router-link> -->
            <router-link to="/" style="color: #fff">Expay</router-link>
          </h1>
        </div>
        <!-- 导航 -->
        <div class="header-nav">
          <router-link to="/otc/trade/buy-usdt" class="link u-m-l-24 u-m-r-24"
            v-text="$t('header.buymoney')">买币</router-link>
          <router-link to="/otc/trade/sell-usdt" class="link u-m-r-24"
            v-text="$t('header.sellmoney')">卖币</router-link>
          <router-link to="/myads" class="link u-m-r-24"
            v-text="$t('header.wdgg')">我的广告</router-link>
        </div>
      </div>
      <div class="header-right u-flex">
        <!-- 已登录 -->
        <div class="u-flex" v-if="isLogin">
          <router-link to="/finance/otc" class="link u-m-r-24"
            v-text="$t('header.qb')">钱包</router-link>
          
          <router-link to="/otc/orders" class="link u-m-r-24"
            v-text="$t('header.order')">订单</router-link>
          
          <Button type="primary"
            v-text="$t('header.congz')"
            @click="goToDeposit">充值</Button>

          <!-- 个人中心 -->
          <Dropdown class="u-p-l-24 u-p-r-24">
            <div style="color: hsla(0,0%,100%,.8); cursor: pointer;" class="u-flex">
              <Icon type="md-person" size="20"></Icon>
            </div>
            <DropdownMenu slot="list">
              <DropdownItem>
                <router-link to="/security" class="dropdown-item-link"
                  v-text="$t('header.security')">账号&安全</router-link>
              </DropdownItem>
              <DropdownItem>
                <router-link to="/set-payment" class="dropdown-item-link"
                  v-text="$t('header.setPayment')">收款设置</router-link>
              </DropdownItem>
              <DropdownItem>
                <div @click="logout" class="dropdown-item-link"
                  v-text="$t('header.logout')">退出登录</div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <!-- 消息 -->
          <div class="u-m-r-24" style="cursor: pointer;" @click="handleNotice">
            <Badge :count="notRead">
              <Icon type="ios-notifications-outline" size="26" color="#fff"></Icon>
            </Badge>
          </div>
        </div>
        <!-- 未登录 -->
        <div class="u-font-14" v-else>
          <router-link
            to="/login"
            style="color: hsla(0,0%,100%,.8);"
            v-text="$t('header.login')">登录</router-link>
          <router-link
            to="/register"
            style="color: hsla(0,0%,100%,.8);"
            class="reg u-m-l-20 u-m-r-20"
            v-text="$t('header.reg')">注册</router-link>
        </div>

        <!-- App下载 -->
        <!-- <div class="app-down u-p-l-20">
          <poptip placement="bottom" width="120" class="appdownload" trigger="hover">
            <div style="font-size:14px; color: hsla(0,0%,100%,.8);">{{$t("header.appdownlaod")}}
              <Icon type="md-arrow-dropdown" size="18" />
            </div>
            <div class="u-text-center u-p-t-10 u-p-b-10" slot="content">
              <div class="ios">
                <img src="@/assets/images/appdownload.png" style="width: 116px;" alt="">
                <div class="tips">
                  <span>{{$t("header.downloadapp")}}</span>
                </div>
              </div>
            </div>
          </poptip>
        </div> -->

        <!-- 语言切换 -->
        <Menu
          mode="horizontal"
          width="auto"
          @on-select="changelanguage"
          style="height: 50px; line-height: 50px"
        >
          <Submenu name="lang">
            <template slot="title" class="lang-title">
              <span style="color: hsla(0,0%,100%,.8)">{{ languageValue }}</span>
            </template>
            <MenuItem name="en" class="lang-item">English</MenuItem>
            <MenuItem name="zh" class="lang-item">繁體中文</MenuItem>
            <MenuItem name="zh-CN" class="lang-item">简体中文</MenuItem>
          </Submenu>
        </Menu>
      </div>
    </div>
    <!-- 手机端 -->
    <div class="hidden-lg xs-header-wrap u-flex u-row-between">
      <h1 class="logo" style="color: #fff; margin-bottom: 10px; line-height: 60px; padding-left: 10px">
        <router-link to="/" style="color: #fff">Expay</router-link>
      </h1>
      <div class="u-flex">
        <div class="u-flex" v-if="isLogin">
          <Icon type="md-person" size="24" color="#fff" @click="userShow = true"></Icon>
        </div>
        <div class="u-font-14" v-else>
          <router-link to="/login" style="color: hsla(0,0%,100%,.8);">{{$t("header.login")}}</router-link>
          <Button to="/register" type="primary" class="u-m-l-20">{{$t("header.reg")}}</Button>
        </div>
        <Icon type="md-menu" size="30" color="#fff" class="u-p-l-20 u-p-r-10" @click="navShow = true"/>
      </div>
      <van-popup v-model="navShow" position="right" closeable>
        <div class="nav-wrap">
          <div @click="navShow = false">
            <van-cell :title="$t('header.buymoney')" to="/otc/trade/buy-usdt" size="large"/>
            <van-cell :title="$t('header.sellmoney')" to="/otc/trade/sell-usdt" size="large"/>
            <van-cell :title="$t('header.wdgg')" to="/myads" size="large"/>
          </div>
        </div>
      </van-popup>
      <van-popup v-model="userShow" position="right" closeable>
        <div class="nav-wrap">
          <div @click="userShow = false">
            <div class="u-p-l-16 u-p-r-16 u-m-b-20" style="font-weight: blod; color: #333">
              <p class="u-font-20">{{userInfo.username}}</p>
              <p>UID: {{userInfo.uuid}}</p>
            </div>
            <van-cell :title="$t('header.qb')" to="/finance/otc" size="large"/>
            <van-cell :title="$t('header.order')" to="/otc/orders" size="large"/>
            <van-cell :title="$t('header.congz')" to="/deposit" size="large"/>
            <van-cell :title="$t('header.security')" to="/security" size="large"/>
            <van-cell :title="$t('header.setPayment')" to="/set-payment" size="large"/>
            <van-cell :title="$t('header.logout')" size="large" @click="logout"/>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { logout } from '@/api/user'
export default {
  data() {
    return {
      navShow: false,
      userShow: false,
    };
  },
  created() {
    this.$i18n.locale = this.lang;
  },
  computed: {
    ...mapState(['activeNav', 'lang', 'isLogin', 'headerStyle', 'userInfo', 'notRead', 'certificationInfo']),
    languageValue() {
      let curlang = this.lang;
      if (curlang == "en") {
        return "English";
      }
      if (curlang == "ja_JP") {
        return "日本語";
      }
      if (curlang == "ko_KR") {
        return "한국어";
      }
      if (curlang == "de_DE") {
        return "Deutsche";
      }
      if (curlang == "fr_FR") {
        return "français";
      }
      if (curlang == "it_IT") {
        return "italiano";
      }
      if (curlang == "es_ES") {
        return "Español";
      }
      if (curlang == "zh") {
        return "繁體中文";
      }
      if (curlang == "zh-CN") {
        return "简体中文";
      }
      return curlang;
    },
  },
  methods: {
    ...mapMutations(['SET_ATCIVENAV', 'SET_ISLOGIN']),
    /* 充值 */
    goToDeposit() {
      if(!this.certificationInfo) {
        this.$router.push('/security')
        this.$Notice.info({
          title: this.$t('publice.ts'),
          desc: this.$t('请先完成实名认证')
        })
      } else {
        this.$router.push('/deposit')
      }
    },
    /* 通知 */
    handleNotice() {
      this.$router.push('/inmail')
    },
    /* 切换语言 */
    changelanguage: function (name) {
      this.$store.commit("setlang", name);
      this.$i18n.locale = name;
      location.reload()
    },
    /* 退出登录 */
    logout() {
      logout().then(() => {
        this.SET_ISLOGIN(false)
        localStorage.clear()
        location.href = "/";
      })
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .ivu-menu-submenu {
  padding: 0;
}
// 修改徽标样式
::v-deep .ivu-badge-count {
  padding: 0 3px;
  height: 14px;
  font-size: 12px;
  line-height: 12px;
  box-shadow: none;
  top: -3px;
  background-color: #fa4d56;
}
// 下拉框
.ivu-select-dropdown {
  a {
    color: #515a6e !important;
  }
}
.header-wrap {
  padding: 0 19px;
  background-color: #0c0c33;
}
// 首页头部样式
.home-header-wrap {
  background-color: transparent !important;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 99999;
}
.invitation-header-wrap {
  background: #9D5F00;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 99999;
}
.header-left {
  .logo {
    padding: 0 16px 0 20px;
    height: 25px;
    cursor: pointer;
    user-select: none;
  }
  .header-nav {
    // 去掉背景颜色
    .ivu-menu-light {
      background: transparent;
    }
    // 文字白色
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item {
      color: hsla(0,0%,100%,.8);
    }
    // 去掉导航下边框
    .ivu-menu-horizontal.ivu-menu-light:after {
      height: 0;
    }
    // 修改导航高度
    .ivu-menu-horizontal {
      height: 54px;
      line-height: 54px;
    }
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item,
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu {
      border-bottom: none;
    }
    // 修改选中的下边框宽度
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover,
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active,
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {
      color: #007AFF;
      border-bottom: 3px solid #007AFF;
    }
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover,
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {
      color: #fff;
      border-bottom: none;
    }
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active:hover {
      color: #007AFF;
      border-bottom: 3px solid #007AFF;
    }
    .ivu-menu-item {
      padding: 0;
      margin-left: 24px;
    }
  }
}
.link {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  user-select: none;
  &:hover {
    color: #fff;
  }
}
.header-right {
  // 去掉背景颜色
  .ivu-menu-light {
    background: transparent;
  }
  // 去掉导航下边框
  .ivu-menu-horizontal.ivu-menu-light:after {
    height: 0;
  }
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover,
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu {
    color: #fff;
    border-bottom: none;
  }
  // 下拉 item 高度调整
  .ivu-dropdown-item {
    height: 40px;
    line-height: 26px;
    font-size: 14px !important;
    padding: 0;
    .dropdown-item-link {
      display: block;
      padding: 7px 16px;
    }
  }
  .app-down {
    border-left: 1px solid rgba(97,105,138,.3);
  }
  .reg {
    display: inline-block;
    height: 28px;
    line-height: 28px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 2px;
    background-color: #007AFF;
    color: #fff;
    &:hover {
      background-color: #6ea6ff;
    }
  }
}

/* 手机端 */
@media (max-width: 767px) {
  .xs-header-wrap {
    background-color: #0c0c33;
    padding: 0 8px;
    height: 64px;
  }
  .nav-wrap {
    width: 100vw;
    height: 100vh;
    padding: 28px 0;
  }
}
</style>