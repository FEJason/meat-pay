<template>
  <div class="page-wrap">
    <div class="u-p-b-20 u-text-left">{{$t('myad.wxts')}}</div>
    <Form class="form hidden-xs" :model="formItem" :label-width="75" inline>
      <FormItem :label="$t('myad.mm')">
        <Select clearable v-model="formItem.side" style="width:100px;" :placeholder="$t('publice.qxz')">
          <Option value="1">{{ $t('myad.buy') }}</Option>
          <Option value="2">{{ $t('myad.sell') }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('myad.zt')">
        <Select clearable v-model="formItem.status" style="width:100px;" :placeholder="$t('publice.qxz')">
          <Option v-for="(item,index) in statusList " :value="item.value " :key="index">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('myad.szhb')">
        <Select clearable v-model="formItem.currencyId" style="width:100px;" :placeholder="$t('publice.qxz')">
          <Option v-for="item in coins" :value="item.id" :key="item.id">{{ item.currency }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('myad.fb')">
        <Select clearable v-model="formItem.fiatId" style="width:100px;" :placeholder="$t('publice.qxz')">
          <Option v-for="item in legalList" :value="item.id" :key="item.id">{{ item.fiatCurrency }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">{{$t('myad.ss')}}</Button>
        <!-- <Button style="margin-left: 8px " @click="handleClear " class="clear_btn">{{$t('uc.finance.trade.clear')}}</Button> -->
      </FormItem>
    </Form>
    <Table :columns="columns" :data="data" :loading="loading" class="hidden-xs">
      
      <template slot-scope="{ row, index }" slot="slotId">
        {{ row.marketNo }}
      </template>
      <template slot-scope="{ row, index }" slot="slotCurrencyName">
        <span class="u-p-r-6" v-if="row.side == 1" style="color: #19be6b">{{ $t('myad.buy') }}</span>
        <span class="u-p-r-6" v-if="row.side == 2" style="color: #f16643">{{ $t('myad.sell') }}</span>
        {{ row.currencyName }}
      </template>
      <template slot-scope="{ row, index }" slot="slotPrice">
        {{ row.posterPrice }} {{ row.fiatCurrency }}
      </template>
      <template slot-scope="{ row, index }" slot="slotAccount">
        {{ row.account }}
      </template>
      <template slot-scope="{ row, index }" slot="slotStatus">
        <div>
          <span class="u-p-r-6" v-if="row.status == 0" style="color: #515a6e;">{{ $t('myad.yxj') }}</span>
          <span class="u-p-r-6" v-if="row.status == 1" style="color: #19be6b">{{ $t('myad.ysj') }}</span>
          <span class="u-p-r-6" v-if="row.status == 3" style="color: #515a6e;">{{ $t('myad.ycx') }}</span>
        </div>
      </template>
      <template slot-scope="{ row, index }" slot="slotOperation">
        <Button type="primary" size="small" v-if="row.status == 0" @click="setRelease(row, 1)" :loading="row.loading">{{ $t('myad.sj') }}</Button>
        <Button type="warning" size="small" v-if="row.status == 1" @click="setRelease(row, 0)" :loading="row.loading">{{ $t('myad.xj') }}</Button>
        <Button type="error" size="small" class="u-m-l-10" @click="revoke(row.id)" v-if="row.status == 0">{{ $t('myad.cx') }}</Button>
      </template>
    </Table>
    <!-- 移动端列表 -->
    <ul class="xs-list hidden-lg" v-for="row in data" :key="row.id">
      <li>
        <div>委托单号</div>
        <div>
          <span>{{ row.marketNo }}</span>
        </div>
      </li>
      <li>
        <div>币种</div>
        <div>
          <span class="u-p-r-6" v-if="row.side == 1" style="color: #19be6b">{{ $t('myad.buy') }}</span>
          <span class="u-p-r-6" v-if="row.side == 2" style="color: #f16643">{{ $t('myad.sell') }}</span>
          {{ row.currencyName }}
        </div>
      </li>
      <li>
        <div>单价</div>
        <div>
          {{ row.posterPrice }} {{ row.fiatCurrency }}
        </div>
      </li>
      <li>
        <div>数量</div>
        <div>
          {{ row.account }}
        </div>
      </li>
      <li>
        <div>状态</div>
        <div>
          <span class="u-p-r-6" v-if="row.status == 0" style="color: #515a6e;">{{ $t('myad.yxj') }}</span>
          <span class="u-p-r-6" v-if="row.status == 1" style="color: #19be6b">{{ $t('myad.ysj') }}</span>
          <span class="u-p-r-6" v-if="row.status == 3" style="color: #515a6e;">{{ $t('myad.ycx') }}</span>
        </div>
      </li>
      <li>
        <div>操作</div>
        <div>
          <Button type="primary" size="small" v-if="row.status == 0" @click="setRelease(row, 1)" :loading="row.loading">{{ $t('myad.sj') }}</Button>
          <Button type="warning" size="small" v-if="row.status == 1" @click="setRelease(row, 0)" :loading="row.loading">{{ $t('myad.xj') }}</Button>
          <Button type="error" size="small" class="u-m-l-10" @click="revoke(row.id)" v-if="row.status == 0">{{ $t('myad.cx') }}</Button>
        </div>
      </li>
    </ul>
    <div class="u-text-center u-m-t-20 u-m-b-20">
      <Page
        :pageSize="page.size"
        :total="page.total"
        :current="page.current"
        @on-change="changePage"
      ></Page>
    </div>
  </div>
</template>
<script>
import { getMyAd, getLegalList, getCurrencyList, revoke, setRelease } from '@/api/trade'
export default {
  components: {},
  data() {
    return {
      legalList: [],
      coins: [],
      // 0:下架 1:上架 2:完成 3:撤销
      statusList: [
        { label: this.$t('myad.xj'), value: 0},
        { label: this.$t('myad.sj'), value: 1},
        { label: this.$t('myad.wc'), value: 2},
        { label: this.$t('myad.cx'), value: 3},
      ],
      formItem: {},
      loading: false,
      page: {
        size: 10,
        current: 1,
        total: 0,
      },
      current: 1,
      pageSize: 10,
      total: 0,
      columns: [
        {
          title: this.$t('myad.wtdh'),
          slot: 'slotId'
        },
        {
          title: this.$t('myad.bz'),
          slot: 'slotCurrencyName'
        },
        {
          title: this.$t('myad.dj'),
          slot: 'slotPrice'
        },
        {
          title: this.$t('myad.sl'),
          slot: 'slotAccount'
        },
        {
          title: this.$t('myad.zt'),
          slot: 'slotStatus'
        },
        // {
        //   title: '状态',
        //   slot: 'slotStatus'
        // },
        {
          title: this.$t('myad.cz'),
          slot: 'slotOperation',
          align: 'right'
        },
      ],
      data: [],
    };
  },
  created() {
    this.getMyAd()
    this.getLegalList()
    this.getCurrencyList()
  },
  methods: {
    /* 分页 */
    changePage(val)  {
      this.page.current = val
      this.getMyAd()
    },
    /* 上下架 */
    setRelease(row, status) {
      this.$set(row, "loading", true);
      setRelease({
        status,
        id: row.id,
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('publice.cg')
        });
        this.getMyAd()
      }).finally(() => {
        this.$set(row, "loading", false);
      })
    },
    /* 撤销广告 */
    revoke(id) {
      this.$Modal.confirm({
          title: this.$t('publice.ts'),
          content: this.$t('myad.qrcx'),
          loading: true,
          onOk: () => {
            revoke({
              id
            }).then(() => {
              this.$Notice.success({
                title: this.$t('publice.ts'),
                desc: this.$t('publice.cg')
              });
              this.getMyAd()
            }).finally(() => {
              this.$Modal.remove();
            })
          },
          onCancel: () => {
              // this.$Message.info('Clicked cancel');
          }
      });
      
    },
    /* 搜索 */
    handleSubmit()  {
      this.getMyAd()
    },
    handleClear() {
      this.formItem = {}
      this.getMyAd()
    },
    /* 查询法定货币列表 */
    getLegalList() {
      return new Promise(resolve => {
        getLegalList().then(res => {
          this.legalList = res
          resolve()
        })
      })
    },
    /* 获取币种列表 */
    getCurrencyList() {
      return new Promise(resolve => {
        getCurrencyList().then(res => {
          this.coins = res
          resolve()
        })
      })
    },
    /* 获取我的广告 */
    getMyAd() {
      this.loading = true
      getMyAd({
        size: this.page.size,
        current: this.page.current, 
        ...this.formItem
      }).then(res => {
        this.data = res.records || []
        this.page.total = res.total
      }).finally(() => {
        this.loading = false
      })
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .ivu-btn-error {
  background-color: #ff5f67;
}
.page-wrap {
  padding-top: 40px;
  width: 1200px;
  margin: 0 auto;
}
/* 手机端 */
@media (max-width: 767px) {
  .page-wrap {
    width: 100%;
    padding: 0 24px;
  }
  .xs-list {
    font-size: 14px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    li {
      height: 26px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>