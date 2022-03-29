<template>
  <div class="page-wrap">
    <div class="header-bg">
      <div class="header-title">消息中心<span class="u-p-l-10">{{notRead}}条未读消息</span></div>
    </div>
    <div class="page-content">
      <div class="title">
        <div class="cur u-font-18" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" />返回
        </div>
      </div>
      <div class="con">
        <h2>{{ info.title }}</h2>
        <p class="u-p-t-14 u-p-b-20 u-font-12 u-tips-color">{{ $yj.timeFormat(info.time)}}</p>
        <p v-html="info.contentThumb"></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { getMessageInfo, editMessageRead } from '@/api/user'
export default {
  data() {
    return {
      id: this.$route.params.id || '',
      info: {}
    }
  },
  computed: {
    ...mapState(['notRead'])
  },
  created() {
    this.getMessageInfo()
  },
  methods: {
    ...mapActions(['getAllNotRead']),
    /* 查询消息详情 */
    getMessageInfo() {
      getMessageInfo(this.id).then(res => {
        this.info = res
        this.editMessageRead()
      })
    },
    /* 已读 */
    editMessageRead() {
      editMessageRead(this.id).then(() => {
        this.getAllNotRead()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  background-color: #F2F6FD;
  min-height: 600px;
  padding-bottom: 60px;
}
.header-bg {
  height: 80px;
  line-height: 80px;
  color: #fff;
  background-color: #202058;
  .header-title {
    width: 1200px;
    margin: 0 auto;
    font-size: 20px;
    span {
      opacity: 0.6;
      font-size: 12px;
    }
  }
}
.page-content {
  width: 1200px;
  margin: 0 auto;
  .title {
    height: 98px;
    line-height: 98px;
    .cur {
      cursor: pointer;
    }
  }
  .con {
    background-color: #fff;
    padding: 24px;
    h2 {
      position: relative;
      padding-top: 20px;
      font-size: 20;
      font-weight: bold !important;
    }
  }
}
</style>