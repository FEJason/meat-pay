<template>
  <div class="app-page">
    <Header></Header>
    <div class="app-con">
      <router-view></router-view>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
    }
  },
  
}
</script>

<style lang="scss" scoped>
.app-page {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
.app-con {
  flex: 1;
}
</style>