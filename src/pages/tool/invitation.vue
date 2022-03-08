<template>
  <div class="page-wrap">
    <div class="header">
      <div class="banner-wrap">
        <div class="banner">
          <h2>邀请好友一起交易</h2>
          <p>多邀多得</p>
        </div>
        <div class="pos-con">
          <h3>邀请总览</h3>
          <div>
            <ul class="u-flex">
              <li>
                <div class="num">
                  <p>3</p>
                  <span>+1</span>
                </div>
                <p class="u-font-14">邀请人数(人)</p>
              </li>
              <li>
                <div class="num">
                  <p>0.00</p>
                  <span>+0</span>
                </div>
                <p class="u-font-14">我的福利（USDT）</p>
              </li>
              <li>
                <div class="num">
                  <p>0.00</p>
                  <span>+0</span>
                </div>
                <p class="u-font-14">我的福利（USDT）</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="pos-img">
          <img
            src="@/assets/img/invitation-01.png"
            alt="bg"
            style="width: 569px"
          />
        </div>
      </div>
    </div>
    <div class="table-wrap">
      <h3>邀请详情</h3>
      <div class="table-con">
        <div class="title"></div>
        <div class="con">
          <ul class="tab-wrap u-flex u-m-b-10">
            <li :class="{ on: active == 0 }" @click="handleTab(0)">邀请列表</li>
            <li :class="{ on: active == 1 }" @click="handleTab(1)">我的返利</li>
            <li :class="{ on: active == 2 }" @click="handleTab(2)">交易返利</li>
          </ul>
          <Form ref="formInline" :model="formInline" inline>
            <FormItem>
              <DatePicker
                type="daterange"
                v-model="formInline.date"
                style="width: 220px"
                placeholder="选择日期"
              ></DatePicker>
            </FormItem>
            <FormItem prop="password">
              <Input
                prefix="ios-search"
                placeholder="请输入账户"
                style="width: auto"
              />
            </FormItem>
            <FormItem prop="password">
              <Input
                prefix="ios-search"
                placeholder="请输入邀请码"
                style="width: auto"
              />
            </FormItem>
            <FormItem prop="password">
              <Select v-model="model1" style="width: 100px">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
            <!-- <FormItem prop="password">
              <Select v-model="model1" style="width: 100px">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem> -->

            <Button
              type="warning"
              style="background-color: #fe850d; color: #fff; float: right;"
              >搜索</Button
            >
          </Form>

          <Table :columns="columns1" :data="data1"></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      formInline: {},
      active: 0,
      model1: 'New',
      cityList: [
        {
          value: 'New',
          label: '全部状态'
        },
        {
          value: 'New York',
          label: '生效中'
        },
        {
          value: 'New York',
          label: '已过期'
        },
        {
          value: 'New York',
          label: '已禁用'
        },
      ],
      columns1: [
        {
          title: '账户',
          key: 'name'
        },
        {
          title: '注册时间',
          key: 'name'
        },
        {
          title: '国籍',
          key: 'name'
        },
        {
          title: '我的返利比列',
          key: 'name'
        },
        {
          title: '剩余有效天数',
          key: 'name'
        },
        {
          title: '24小时成交量',
          key: 'name',
          align: 'right'
        }
      ],
      data1: []
    }
  },
  mounted() {
    this.SET_HADERSTYLE('invitation')
  },
  destroyed() {
    this.SET_HADERSTYLE('')
  },
  methods: {
    ...mapMutations(['SET_HADERSTYLE']),
    handleTab(index) {
      this.active = index
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ivu-table-large th {
  font-weight: normal;
}
.page-wrap {
  background: #f2f6fd;
  padding-bottom: 100px;
}
h3 {
  font-size: 26px;
  color: #333;
  padding: 26px;
}
.header {
  background: url('../../assets/img/invitation-02.png') no-repeat;
  height: 604px;
  .banner-wrap {
    position: relative;
    width: 1103px;
    height: 504px;
    margin: 0 auto;
    .banner {
      color: #fff;
      h2 {
        font-size: 70px;
        padding-top: 147px;
      }
      p {
        font-size: 36px;
      }
    }
    .pos-con {
      position: absolute;
      bottom: -110px;
      left: 0;
      width: 1103px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 20px;
      padding-bottom: 30px;
      li {
        flex: 1;
        text-align: center;
        .num {
          display: inline-block;
          min-width: 40px;
          position: relative;
          p {
            font-size: 40px;
            color: #fe850d;
            font-weight: bold;
          }
          span {
            position: absolute;
            right: -10px;
            top: 0;
            color: #fe850d;
          }
        }
      }
    }
    .pos-img {
      position: absolute;
      right: -156px;
      bottom: 0;
    }
  }
}
.table-wrap {
  width: 1103px;
  margin: 0 auto;
  padding-top: 20px;
  h3 {
    padding-left: 0;
  }
  .table-con {
    background-color: #fff;
    border-radius: 20px;
    padding: 20px;
  }
  .tab-wrap {
    padding-bottom: 20px;
    li {
      position: relative;
      font-size: 16px;
      color: #fe850d;
      margin-right: 38px;
      cursor: pointer;
    }
    .on:after {
      content: '';
      width: 32px;
      height: 4px;
      background-color: #fe850d;
      position: absolute;
      left: 16px;
      bottom: -10px;
    }
  }
}
</style>