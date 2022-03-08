<template>
  <div class="page-wrap u-text-center">
    <h2>
      <img src="@/assets/img/h5/h5-download-logo.png" alt="logo" style="width: 70px; height: 70px;" />
    </h2>
    <h3>下载Meta Life交易所</h3>
    <p class="u-font-16">全球排名前50的数字货币交易所</p>
    <div class="btn-wrap">
      <Button icon="logo-apple" shape="circle" class="btn u-m-r-30">iOS</Button>
      <Button icon="logo-android" shape="circle" class="btn">Android</Button>
    </div>
    <div class="bg">
      <img src="@/assets/img/h5/h5-download-01.png" alt="app" style="width: 339px" />
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.page-wrap {
  min-height: 100vh;
  background: url('../assets/img/h5/h5-download-bg.png') no-repeat;
  background-size: cover;
}
h2 {
  text-align: center;
  padding-top: 68px;
}
h3 {
  font-size: 28px;
  color: #fff;
  padding: 10px 0;
}
.btn-wrap {
  padding-top: 48px;
  ::v-deep .ivu-icon {
    font-size: 20px;
    line-height: 20px;
  }
  .btn {
    width: 130px;
    height: 45px;
    color: #fff;
    border: none;
    background: linear-gradient(90deg, #789EFF 0%, #0D3A8A 100%, #003268 100%);
    &:hover {
      border: 1px solid #2b85e4;
    }
  }
}
.bg {
  padding: 48px 0;
}
</style>