<template>
  <div class="page-wrap">
    <div class="header-bg">
      <div class="header-title">消息中心<span class="u-p-l-10">{{notRead}}条未读消息</span></div>
    </div>
    <div class="page-content">
      <div class="title u-flex u-row-between">
        <div class="cur u-font-18" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" />返回
        </div>
        <Button @click="allRead">全部标记为已读</Button>
      </div>
      <div class="con">
        <ul>
          <li class="list" v-for="item in lists" :key="item.id">
            <h2 :class="item.isRead == 0 ? 'unread' : '' ">{{item.title}}</h2>
            <p class="u-font-12 u-p-t-14 u-tips-color">
              <span class="u-line-2">{{item.contentThumb}}</span>
              <!-- <span class="u-link u-font-12">查看全部消息</span> -->
              <router-link :to="`inmail-info/${item.id}`">点击查看全部消息</router-link>
            </p>
            <p class="u-p-t-14 u-p-b-20 u-font-12 u-tips-color">{{ $yj.timeFormat(item.time)}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMessage, allRead } from '@/api/user'
export default {
  data() {
    return {
      lists: []
    }
  },
  computed: {
    ...mapState(['notRead'])
  },
  created() {
    this.getMessage()
  },
  methods: {
    /* 获取消息列表 */
    getMessage() {
      getMessage().then(res => {
        this.lists = res.records
      })
    },
    /* 全部标记为已读 */
    allRead() {
      allRead().then(() => {
        this.$Notice.success({
          title: '提示',
          desc: "成功"
        })
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
    .list {
      border-bottom: 1px solid #eee;
    }
    h2 {
      position: relative;
      padding-top: 20px;
    }
    .unread {
      &::after {
        position: absolute;
        content: '';
        top: 33px;
        left: -14px;
        width: 6px;
        height: 6px;
        border-radius: 6px;
        background-color: #fa4d56;
      }
    }
  }
}
</style>