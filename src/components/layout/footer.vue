<template>
  <div class="footer-wrap">
    <div class="hidden-xs con u-flex u-row-between">
      <div class="left">
        <h2 class="logo u-m-b-32" style="color: #fff; margin-bottom: 10px;">
          <!-- <router-link to="/">
            <img
              src="@/assets/images/meta_logo.png"
              alt="logo"
              style="width: 142px;"
            />
          </router-link> -->
          Expay
        </h2>
        <p class="u-m-b-25">{{ $t('footer.bah') }}</p>
        <div class="social-list">
            <div>
              <Tooltip content="Telegram" theme="dark" placement="top" class="u-m-r-8">
                <div>
                  <Icon custom="i-icon iconfont icontelegram1" />
                </div>
                <div slot="content">
                    <img style="width: 130px;border-radius: 5px;" src="@/assets/images/telegramqrcode.jpg"></img>
                </div>
              </Tooltip>
              <Tooltip content="https://twitter.com/BTXCHAINGlobal" theme="dark" placement="top" class="u-m-r-8">
                <div>
                  <Icon type="logo-twitter" />
                </div>
              </Tooltip>
            </div>
        </div>
      </div>
      <div class="right">
        <ul class="u-flex u-col-top">
          <!-- <li class="u-m-r-40">
            <p class="title">{{ $t('footer.tool') }}</p>
            <p><router-link to="/download">{{ $t('footer.khdxz') }}</router-link></p>
            <p><router-link to="/validate">{{ $t('footer.gfyz') }}</router-link></p>
            <p><router-link to="/invitation">{{ $t('footer.yqjl') }}</router-link></p>
          </li> -->
          <li class="u-m-r-40">
            <p class="title">{{ $t('footer.service') }}</p>
            <p><router-link to="/fees">{{ $t('footer.rate') }}</router-link></p>
            <!-- <p><router-link to="/help">{{ $t('footer.help') }}</router-link></p> -->
            <p><router-link to="/">{{ $t('footer.guide') }}</router-link></p>
          </li>
          <!-- <li class="u-m-r-40">
            <p class="title">{{ $t('footer.support') }}</p>
            <p><router-link to="/application-center">{{ $t('footer.sbsq') }}</router-link></p>
          </li> -->
          <li>
            <p class="title">{{ $t('footer.tksm') }}</p>
            <p><router-link :to="`/agreement?lang=${lang}`">{{ $t('footer.yhxy') }}</router-link></p>
            <p><router-link :to="`/privacy?lang=${lang}`">{{ $t('footer.ystk') }}</router-link></p>
            <p><router-link to="/">{{ $t('footer.fbjygz') }}</router-link></p>
          </li>
        </ul>
      </div>
    </div>
    <div class="hidden-lg xs-footer-wrap">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item :title="$t('footer.service')" name="1">
          <van-cell :title="$t('footer.rate')" to="/fees" />
          <van-cell :title="$t('footer.guide')" to="/fees" />
        </van-collapse-item>
        <van-collapse-item :title="$t('footer.tksm')" name="2">
          <van-cell :title="$t('footer.yhxy')" :to="`/agreement?lang=${lang}`" />
          <van-cell :title="$t('footer.ystk')" :to="`/privacy?lang=${lang}`" />
          <van-cell :title="$t('footer.fbjygz')" to="/" />
        </van-collapse-item>
      </van-collapse>
      <div class="u-p-l-16 u-m-t-20">
        <router-link to="/" class="u-m-r-20">
          <Icon custom="i-icon iconfont icontelegram1" size="26" color="#697080"/>
        </router-link>
        <router-link to="/">
          <Icon type="logo-twitter" size="26" color="#697080"/>
        </router-link>
      </div>
      <div class="u-text-center u-m-t-20">
        <h2 class="logo u-m-b-10" style="color: #fff; margin-bottom: 10px;">
          Expay
        </h2>
        <p class="u-m-b-25" style="color: #697080">{{ $t('footer.bah') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      activeNames: ['1'],
    }
  },
  computed: {
    ...mapState(['lang'])
  }
}
</script>

<style lang="scss" scoped>
/* PC端 */
@media (min-width: 768px) {
  a{
    color: rgba(255, 255, 255, 0.8)
  }
  a:hover {
    color: #57a3f3;
  }
  .footer-wrap {
    background-color: #121212;
    height: 324px;
    padding-top: 94px;
    color: #697080;
    .con {
      width: 1200px;
      margin: 0 auto;
    }
    .right {
      p {
        padding-top: 10px;
      }
      .title {
        padding-bottom: 16px;
        padding-top: 0;
      }
    }
  }
}

/* 手机端 */
@media (max-width: 767px) {
  ::v-deep .van-collapse-item__content {
    padding: 0;
  }
  ::v-deep .van-cell, ::v-deep .van-collapse-item__content {
    background-color: transparent;
    color: #fff;
    &:after {
      border: none;
    }
  }
  ::v-deep [class*=van-hairline]::after {
    border: none;
  }
  ::v-deep .van-collapse-item__title {
    position: relative;
    .van-cell__title {
      color: #969799;
    }
  }
  ::v-deep .van-collapse-item--border::after {
    border: none;
  }
  a {
    color: #fff;
  }
  .xs-footer-wrap {
    background-color: #121212;
    padding-bottom: 10px;
  }
}
</style>