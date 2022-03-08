<template>
  <div class="page-wrap">
    <div class="header">
      <div class="con">
        <h2>帮助中心</h2>
        <div class="pos-wrap">
          <Input placeholder="请输入您的问题" style="width: 536px;" size="large"/>
          <Button type="primary" icon="ios-search" class="u-m-l-10" style="width: 48px; height: 48px; font-size: 20px"></Button>
        </div>
      </div>
    </div>
    <div class="page-con">
      <ul class="tab-wrap u-flex u-row-between">
        <li
          :class="{'on': active == index}"
          v-for="(item, index) in titleList"
          :key="index"
          @click="changeTab(index)">{{ item }}</li>
      </ul>
      <div class="layout-wrap u-flex u-row-between">
        <ul class="nav-left">
          <li :class="{ 'on': actives == index }" v-for="(item, index) in titleLists" :key="index">{{ item }}</li>
        </ul>
        <div class="main-right">
          <ul class="list-wrap">
            <li class="u-flex u-row-between" v-for="(item, index) in 4" :key="index">
              <router-link to="/">
                <Icon type="md-star" color="#ff7f01"/>
                最新热点最新热点最新热点最新热点最新热点最新热点最新热点最新热点
              </router-link>
              <span class="u-font-12">01/10 00:01</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Help',
  data() {
    return {
      active: 0,
      actives: 0,
      titleList: ['重要公告', '最新活动', '用户须知', '币币交易', 'TOC交易', '合约交易'],
      titleLists: ['最新热点', '新币上市', '项目介绍', '充提开放'],
    }
  },
  methods: {
    /* 切换tab */
    changeTab(index){
      this.active = index
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ivu-input-large {
  height: 48px;
  font-size: 16px;
  padding-left: 20px;
}
.page-wrap {
  font-size: 14px;
}
.header {
  height: 150px;
  background-color: #201F58;
  text-align: center;
  position: relative;
  .con {
    width: 1200px;
    margin: 0 auto;
    h2 {
      color: #fff;
      font-size: 32px;
      padding-top: 40px;
    }
    .pos-wrap {
      position: absolute;
      bottom: -18px;
      left: 50%;
      transform: translate(-50%);
    }
  }
}
.page-con {
  padding: 56px 0;
  background-color: #F2F6FD;
}
.tab-wrap {
  width: 1200px;
  margin: 0 auto;
  flex-flow: row wrap;
  li {
    width: 390px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 20px;
    font-size: 14px;
    border: 1px solid transparent;
    cursor: pointer;
    color: #007AFF;
  }
  .on {
    border: 1px solid #007AFF;
    color: #007AFF;
  }
}
.layout-wrap {
  width: 1200px;
  height: 600px;
  margin: 0 auto;
  .nav-left {
    height: 100%;
    background-color: #fff;
    border-radius: 4px;
    padding: 20px 0;
    width: 162px;
    li {
      height: 40px;
      line-height: 40px;
      padding-left: 16px;
      cursor: pointer;
      overflow: hidden;
    }
    .on {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -8px;
        width: 4px;
        height: 16px;
        background-color: #007AFF;
      }
    }
  }
  .main-right {
    flex: 1;
    margin-left: 20px;
    height: 100%;
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
    .list-wrap {
      li {
        padding: 16px;
        font-size: 16px;
        border-bottom: 1px solid #eee;
        &:hover {
          background: #f8fafd;
        }
        a {
          color: #1c242c;
          &:hover {
            color: #2d8cf0;
          }
        }
        span {
          color: #999;
        }
      }
    }
  }
}
</style>