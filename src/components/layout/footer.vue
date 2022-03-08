<template>
  <div class="footer-wrap">
    <div class="con u-flex u-row-between">
      <div class="left">
        <h2 class="logo u-m-b-32" style="color: #fff; margin-bottom: 10px;">
          <!-- <router-link to="/">
            <img
              src="@/assets/images/meta_logo.png"
              alt="logo"
              style="width: 142px;"
            />
          </router-link> -->
          Meta Pay
        </h2>
        <p class="u-m-b-25">{{ $t('footer.bah') }}</p>
        <div class="social-list">
            <div>
              <Tooltip content="Wechat" theme="dark" placement="top" class="u-m-r-8">
                <div>
                  <Icon custom="i-icon iconfont iconweixin" />
                </div>
                <div slot="content">
                    <img style="width: 130px;border-radius: 5px;" src="@/assets/images/wechatqrcode.jpg" />
                </div>
              </Tooltip>
              <Tooltip content="Telegram" theme="dark" placement="top" class="u-m-r-8">
                <div>
                  <Icon custom="i-icon iconfont icontelegram1" />
                </div>
                <div slot="content">
                    <img style="width: 130px;border-radius: 5px;" src="@/assets/images/telegramqrcode.jpg"></img>
                </div>
              </Tooltip>
              <!-- <Tooltip content="https://weibo.com/BTXCHAIN" theme="dark" placement="top">
                <div>
                  <Icon custom="i-icon iconfont iconweibo" />
                </div>
              </Tooltip> -->
              <Tooltip content="https://twitter.com/BTXCHAINGlobal" theme="dark" placement="top" class="u-m-r-8">
                <div>
                  <Icon type="logo-twitter" />
                </div>
              </Tooltip>
              <Tooltip content="https://medium.com/@BTXCHAIN" theme="dark" placement="top" class="u-m-r-8">
                <div>
                  <Icon custom="i-icon iconfont iconmedium" />
                </div>
              </Tooltip>
              <Tooltip content="https://www.reddit.com/u/BTXCHAINglobal" theme="dark" placement="top" class="u-m-r-8">
                <div>
                  <Icon custom="i-icon iconfont iconreddit" />
                </div>
              </Tooltip>
              <Tooltip content="coming" theme="dark" placement="top" style="display:none;">
                <div>
                  <Icon type="logo-facebook" />
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState(['lang'])
  }
}
</script>

<style lang="scss" scoped>
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
</style>