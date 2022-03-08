<template>
  <div class="page-wrap">
    <div class="header">
      <div class="banner">
        <Carousel autoplay :autoplay-speed="5000" v-model="bannerValue" :height="486" arrow="never">
          <CarouselItem v-for="(item, index) in bannerList" :key="index">
            <div class="banner-first" :style="{'background-image': `url(${item.imgLink})`}"></div>
          </CarouselItem>
        </Carousel>
      </div>
      <div class="trade-block">
        <ul class="market-ticker u-flex">
          <li
            class="u-flex u-row-between"
            v-for="(item, index) in trendData"
            :key="index"
          >
            <div class="left">
              <p class="u-p-b-12">
                <strong style="color: #fff">{{ item.coinSymbol }}/{{ item.baseSymbol }}</strong>
                <span class="u-m-l-10" :class="parseFloat(item.chg) < 0 ? 'sell' : parseFloat(item.chg) > 0 ? 'buy' : ''">
                  {{ parseFloat(item.chg) > 0 ? '+' : '' }}
                  {{ item.chg }}%
                </span>
              </p>
              <p class="price u-font-16">{{ item.close }}</p>
              <p class="vol" style="color: #666666">24H Vol {{ item.volume }}</p>
            </div>
            <div class="right">
              <!-- <SvgIndex ref="svgIndexRef" style="margin-bottom: -5px;" :width="800" :height="150" :values="lineValues"></SvgIndex> -->
              <SvgLine
                :values="lineValues"
                :rose="'+1.41%'"
                :width="120"
                :height="25"
              ></SvgLine>
            </div>
          </li>
        </ul>
      </div>

    </div>

    <div class="table-wrap">
      <h3 class="title">{{ $t('home.zfb') }}</h3>
      <Table stripe :columns="columns1" :data="listData">
        <template slot-scope="{ row, index }" slot="slotSymbol">
          <div>{{ row.coinSymbol }}/{{ row.baseSymbol }}</div>
        </template>
        <template slot-scope="{ row, index }" slot="slotClose">
          <div>{{ row.close }}</div>
        </template>
        <template slot-scope="{ row, index }" slot="slotChg">
          <div :class="parseFloat(row.chg) < 0 ? 'sell' : parseFloat(row.chg) > 0 ? 'buy' : ''">
            {{ parseFloat(row.chg) > 0 ? '+' : '' }}
            {{ row.chg }}%
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="slotHigh">
          <div>{{ row.high }}</div>
        </template>
        <template slot-scope="{ row, index }" slot="slotLow">
          <div>{{ row.low }}</div>
        </template>
        <template slot-scope="{ row, index }" slot="slotVolume">
          <div>{{ row.volume }}</div>
        </template>
        
      </Table>
      <div class="more u-flex u-row-center">
        <router-link to="/exchange/btc_usdt" style="color: #515a6e">
          <span>{{ $t('home.ckgd') }}</span>
          <Icon type="md-arrow-round-forward" />
        </router-link>
      </div>
    </div>

    <div class="card-wrap">
      <div class="con">
        <h2 class="u-font-20 u-text-center">国家机构保障资产安全</h2>
        <div class="list-wrap">
          <div class="list-one list-card u-flex u-row-wrap">
            <div class="list">
              <img src="@/assets/img/home/home-001.png" style="width: 352px; height: 357px;" alt="icon">
            </div>
            <div>
              <h2 class="title left">金融级安全</h2>
              <p class="u-p-t-20 text">全方位金融风控系统和防盗系统，冷热钱包、多签系统保证资金安全</p>
            </div>
          </div>
          <div class="list-two list-card u-flex u-row-wrap">
            <div class="u-text-right">
              <h2 class="title right">极速充提</h2>
              <p class="u-p-t-20 text">充值提现最快3分钟完成，24H人工在线审核，保护客户不错过最佳投资机会</p>
            </div>
            <div class="list">
              <img src="@/assets/img/home/home-002.png" style="width: 352px; height: 357px;" alt="icon">
            </div>
          </div>
          <div class="list-three list-card u-flex u-row-wrap">
            <div class="list">
              <img src="@/assets/img/home/home-003.png" style="width: 352px; height: 357px;" alt="icon">
            </div>
            <div>
              <h2 class="title left">全球服务</h2>
              <p class="u-p-t-20 text">全球业务服务网络覆盖，助您投资全球加密资产，与全球用户交易</p>
            </div>
          </div>
          <div class="list-four list-card u-flex u-row-wrap">
            <div class="u-text-right">
              <h2 class="title right">严选资产</h2>
              <p class="u-p-t-20 text">严格选择优质加密项目，为您过滤80%极高风险项目</p>
            </div>
            <div class="list">
              <img src="@/assets/img/home/home-004.png" style="width: 352px; height: 357px;" alt="icon">
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="app-download">
      <div class="app-con u-flex u-col-top">
        <img src="@/assets/img/home/app-web.png" alt="icon" style="width: 700px; height: 413px;" />
        <div class="right">
          <h2>随时随地开启交易</h2>
          <div class="u-p-b-24">
            <Button icon="logo-apple" shape="circle" class="btn">iOS</Button>
          </div>
          <div>
            <Button icon="logo-android" shape="circle" class="btn">Android</Button>
          </div>
          <div class="u-m-t-20">
            <img src="@/assets/img/home/code.png" alt="icon" style="width: 126px; height: 126px;">
          </div>
          <p>ios & Android扫码下载</p>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import SvgIndex from '@/components/exchange/SvgIndex.vue'
import SvgLine from '@/components/exchange/SvgLine.vue'
import { getBannerList, findHotList } from '@/api/home'
export default {
  components: {
    SvgIndex,
    SvgLine
  },
  data() {
    return {
      bannerList: [{
        imgLink: 'https://huobi-1306115679.file.myqcloud.com/bit/banner/8c86c572-d780-43cd-a28f-9a4ea430b470.png'
      }],
      lineValues: [
        85, 84, 87, 86, 85, 83, 85, 86, 88, 84, 87, 87, 86, 86, 86, 85, 87, 55,
        58, 67, 85, 26, 67, 86, 45, 23, 75, 46, 48, 94, 37, 67, 86, 86, 96, 35,
        57, 55, 58, 67
      ],
      bannerValue: 0,
      columns1: [
        {
          // 交易对
          title: this.$t('home.jyd'),
          slot: 'slotSymbol'
        },
        {
          // 价格
          title: this.$t('home.jg'),
          slot: 'slotClose'
        },
        {
          // 涨跌幅
          title: this.$t('home.zdf'),
          slot: 'slotChg'
        },
        {
          // 24小时最高价
          title: this.$t('home.zgj'),
          slot: 'slotHigh'
        },
        {
          // 24小时最低价
          title: this.$t('home.zdj'),
          slot: 'slotLow'
        },
        {
          // 24小时成交量
          title: this.$t('home.cjl'),
          slot: 'slotVolume',
          align: 'right'
        }
      ],
      listData: [],
      trendData: []
    }
  },
  created() {
    this.getBannerList()
    this.findHotList() // 趋势行情
    this.findHotLists() // 涨幅榜
  },
  mounted() {
    this.SET_HADERSTYLE('home')
  },
  methods: {
    ...mapMutations(['SET_HADERSTYLE']),
    /* 首页行情 */
    findHotList() {
      findHotList({
        rankType: 'TOP'
      }).then(res => {
        this.trendData = res
        this.trendData.length = 5
      })
    },
    /* 首页行情 */
    findHotLists() {
      findHotList({
        rankType: 'UP'
      }).then(res => {
        this.listData = res
      })
    },
    /* 获取banner图 */
    getBannerList() {
      getBannerList({
        carouselPictureType: 'AD',
        deviceType: 'MOBILE'
      }).then(res => {
        if (res.length) {
          this.bannerList = res
        }
      })
    }
  },
  destroyed() {
    this.SET_HADERSTYLE('')
  }
}
</script>

<style lang="scss" scoped>
.buy {
    color: #00b275 !important;
}

.sell {
    color: #f15057 !important;
}
.header {
  .banner {
    height: 486px;
    .banner-first {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: cover;
    }
  }
  .market-ticker {
    border-top: 1px solid hsla(0, 0%, 100%, 0.15);
    background-color: #000;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    li {
      padding: 18px 22px;
      position: relative;
      flex: 1;
      cursor: pointer;
      &:after {
        content: '';
        position: absolute;
        border-left: 1px solid hsla(0, 0%, 100%, 0.15);
        left: 0;
        top: 18px;
        bottom: 18px;
      }
      &:hover {
        background: #161616;
      }
    }
    li:first-child {
      &:after {
        border-left: none;
      }
    }
    .right {
    }
  }
}
.table-wrap {
  width: 1200px;
  margin: 46px auto 0;
  .title {
    font-size: 20px;
  }
  .more {
    height: 80px;
    line-height: 80px;
    cursor: pointer;
    font-size: 16px;
  }
}
.card-wrap {
  background: #000B23 url('../../assets/img/home/home-100.png') no-repeat;
  color: #fff;
  height: 1560px;
  padding-top: 60px;
  .con {
    width: 1200px;
    margin: 0 auto;
    h2 {
      font-size: 30px;

    }
    .list-wrap {
      position: relative;
      .list-card {
        position: absolute;
      }
      .list-one {
        left: 0;
        top: 100px;
      }
      .list-two {
        right: 0;
        top: 358px;
      }
      .list-three {
        left: 0;
        top: 658px;
      }
      .list-four {
        right: 0;
        top: 958px;
      }
      .title.left {
        position: relative;
        &:after {
          content: '';
          position: absolute;
          width: 36px;
          left: 0;
          bottom: -6px;
          border-bottom: 4px solid #007AFF;
        }
      }
      .title.right {
        position: relative;
        &:after {
          content: '';
          position: absolute;
          width: 36px;
          right: 0;
          bottom: -6px;
          border-bottom: 4px solid #007AFF;
        }
      }
      .text {
        width: 289px;
      }
    }
  }
}
.app-download {
  background: #000B23 url('../../assets/img/home/app-bg.png') no-repeat;
  height: 644px;
  .app-con {
    width: 1200px;
    margin: 0 auto;
    padding-top: 120px;
    .right {
      padding-left: 164px;
    }
  }
  h2 {
    font-size: 30px;
    margin-bottom: 40px;
    color: #000;
  }
  .btn {
    width: 162px;
    height: 45px;
    background-color: #000;
    color: #fff;
  }
  .btn::v-deep .ivu-icon {
    font-size: 20px;
    line-height: 20px;
  }
}
</style>