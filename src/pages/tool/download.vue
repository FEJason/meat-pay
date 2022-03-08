<template>
  <div class="page-wrap">
    <div class="page-con u-flex u-row-between">
      <div class="left">
        <!-- <h2 class="logo u-m-b-32">
          <router-link to="/">
            <img
              src="@/assets/images/meta_logo.png"
              alt="logo"
              style="width: 142px;"
            />
          </router-link>
        </h2> -->
        <h3>全球排名前50的数字货币交易所</h3>
        <p class="u-font-20">随时随地开启交易</p>
        <div class="btn-wrap u-m-t-40">
          <Button icon="logo-apple" shape="circle" class="btn u-m-r-30">iOS</Button>
          <Button icon="logo-android" shape="circle" class="btn">Android</Button>
        </div>
      </div>
      <div class="right">
        <img src="@/assets/img/download-01.png" alt="bg">
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {

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
  background: url('../../assets/img/download-02.png') no-repeat;
  background-size: cover;
  height: 960px;
  padding-top: 170px;
}
.page-con {
  width: 1400px;
  margin: 0 auto;
}
.btn-wrap {
  ::v-deep .ivu-icon {
    font-size: 20px;
    line-height: 20px;
  }
  .btn {
    width: 140px;
  }
}
.left {
  h3 {
    font-size: 42px;
    color: #fff;
  }
}
</style>