<template>
  <div class="page-wrap u-text-center">
    <h2>官方验证通道</h2>
    <p>为防止不法分子借用火币全球站名义进行诈骗，您可通过此页面确认联系您的电话，微信等是否为Meta Life官方渠道。</p>
    <div>
      <Input placeholder="请输入完整的查询信息" style="width: 536px;" size="large"/>
      <Button type="primary" icon="ios-search" class="u-m-l-10" style="width: 40px; height: 40px; font-size: 20px"></Button>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.page-wrap {
  background: url('../../assets/img/validate-bg.png');
  height: 906px;
  padding-top: 216px;
  h2 {
    font-size: 42px;
    color: #fff;
    padding-bottom: 39px;
  }
  p {
    font-size: 16px;
    width: 591px;
    margin: 0 auto;
    padding-bottom: 68px;
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>