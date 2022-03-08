<template>
  <div class="page-wrap">
    <div class="title u-flex u-font-18" @click="$router.go(-1)">
      <Icon type="ios-arrow-back" color="#333" />
      返回
    </div>

    <div class="con">
      <div class="direction">
        <div class="u-p-b-6">划转方向</div>
        <div class="item-wrap u-flex" :class="{ in: account == 'otc' }">
          <div class="label">
            <p>从</p>
            <p>至</p>
          </div>
          <div class="item u-m-l-20" style="width: 780px">
            <p class="spot-wrap">币币账户</p>
            <p class="otc-wrap">法币账户</p>
          </div>
          <div style="width: 60px; text-align: center">
            <Icon
              type="md-swap"
              size="30"
              class="icon"
              color="#007AFF"
              @click="change"
            />
          </div>
        </div>
      </div>
      <div class="currency u-m-t-30">
        <div class="u-p-b-6">币种</div>
        <Select
          v-model="selectValue"
          filterable
          size="large"
          @on-change="onChange"
        >
          <Option
            v-for="item in currencyList"
            clearable
            :value="item.currencyName"
            :key="item.currencyName"
            >{{ item.currencyName }}</Option
          >
        </Select>
      </div>
      <div class="transfer-num u-m-t-30">
        <Form ref="formData" :model="formData" label-position="top" :rules="rules">
          <FormItem label="划转数量" prop="num">
            <div class="u-relative">
              <Input
                v-model="formData.num"
                size="large"
                @input.native="
                  () => {
                    formData.num = formData.num.replace(
                      /^\D*(\d*(?:\.\d{0,8})?).*$/g,
                      '$1'
                    )
                  }
                "
              ></Input>
              <div class="input-right">
                <span class="input-unit">{{ selectValue }}</span>
                <span
                  class="input-extent"
                  @click="formData.num = balanceObj.balance"
                  >全部</span
                >
              </div>
            </div>
            <div style="color: #9aa5b5" class="u-p-t-6 u-font-12">
              可转 {{ balanceObj.balance || 0 }} {{ selectValue }}
            </div>
          </FormItem>
        </Form>
      </div>
      <div>
        <Button
          type="primary"
          style="width: 173px"
          class="u-m-t-30"
          :loading="loading"
          @click="submit('formData')"
          >划转</Button
        >
      </div>
    </div>

    <div class="table">
      <div class="title u-flex u-row-between">
        <div>
          {{ selectValue }} 划转记录<span style="color: #999">(最近10条)</span>
        </div>
        <div>
          <router-link to="/">查看全部</router-link>
        </div>
      </div>
      <Table :columns="columns5" :data="recordList" size="small">
        <template slot-scope="{ row, index }" slot="slotBillType">
          {{ formatType[row.billType.toString()] }}
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { getAssetList, transfer, getRecord } from '@/api/finance'
import { getBalance } from '@/api/exchange'
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入划转数量'));
      } else if (value > this.balanceObj.balance) {
        callback(new Error('超出可转余额'));
      } else {
        callback()
      }
    }
    return {
      formData: {
        num: ''
      },
      rules: {
        num: [{ validator: validateNum, trigger: 'change' }]
      },
      loading: false,
      // 法币 or 币币
      account: this.$route.query.account || 'otc',
      currency: this.$route.query.currency,
      selectValue: '',
      balanceObj: {
        balance: 0,
        currencyId: ''
      },
      // 币种列表
      currencyList: [],
      columns5: [
        {
          title: '时间',
          key: 'createTime'
        },
        {
          title: '币种',
          align: 'right',
          key: 'currencyName'
        },
        {
          title: '类型',
          slot: 'slotBillType',
          align: 'right'
        },
        {
          title: '数量',
          align: 'right',
          key: 'amount'
        }
      ],
      recordList: [],
      formatType: {
        8: '币币划转法币',
        10: '法币划转币币'
      }
    }
  },
  async created() {
    await this.getAssetList()
    await this.getBalance()
    this.getRecord()
  },
  methods: {
    /* 获取币种列表 */
    getAssetList() {
      return new Promise(resolve => {
        getAssetList(this.account).then(res => {
          this.currencyList = res
          this.selectValue = this.currency || this.currencyList[0].currencyName
          resolve()
        })
      })
    },
    /* 获取币种余额 */
    getBalance() {
      return new Promise(resolve => {
        getBalance({
          type: this.account,
          currency: this.selectValue
        }).then(res => {
          this.balanceObj = res
          resolve()
        })
      })
    },
    /* 财务记录 */
    getRecord() {
      getRecord({
        walletType: this.account,
        type: 7,
        current: 1,
        size: 10,
        currencyId: this.balanceObj.currencyId
      }).then(res => {
        this.recordList = res.records || []
      })
    },
    /* 切换币种 */
    async onChange(val) {
      this.currency = val
      await this.getBalance()
      this.getRecord()
    },
    /* 划转 */
    submit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.loading = true
          transfer({
            amount: this.formData.num,
            currencyId: this.balanceObj.currencyId,
            fromWallet: this.account,
            toWallet: this.account == 'otc' ? 'spot' : 'otc'
          })
            .then(() => {
              this.$Notice.success({
                title: this.$t('publice.ts'),
                desc: this.$t('publice.cg')
              })
              this.formData.num = ''
              this.getBalance()
              this.getRecord()
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    /* 切换划转方向 */
    change() {
      this.account = this.account == 'otc' ? 'spot' : 'otc'
      this.getAssetList()
      this.getBalance()
      this.getRecord()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ivu-table td, .ivu-table th {
    height: 40px !important;
}::v-deep .ivu-form .ivu-form-item-label {
  font-size: 12px;
}
// 修改iView Input的提示样式
::v-deep .ivu-form-item-error-tip {
  padding: 12px 16px;
  background: #fff;
  top: calc(-100% + 26px);
  left: 50%;
  box-shadow: 0 2px 8px 0 rgb(28 36 44 / 10%);
  transform: translateX(-50%);
  border-radius: 2px;
  color: #596a7a;
  position: absolute;
  &:after {
    content: '';
    position: absolute;
    left: calc(50% - 6px);
    border-color: #fff transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    bottom: -5px;
  }
}
.page-wrap {
  width: 1000px;
  margin: 0 auto;
  padding-bottom: 100px;
  .title {
    height: 68px;
    line-height: 68px;
    cursor: pointer;
    color: #333;
  }
  .con {
    background-color: #f9fafc;
    border-radius: 7px;
    padding: 48px 200px;
  }
  .table {
    margin-top: 20px;
    background-color: #f9fafc;
    border-radius: 7px;
    .title {
      border-bottom: 1px solid rgba(67, 82, 126, 0.2);
      padding: 0 18px;
    }
  }
}
.direction {
  .icon {
    transform: rotate(90deg);
    cursor: pointer;
    transition: all 0.3s;
  }
  .item-wrap {
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dcdee2;
  }
  .item {
    position: relative;
    &:after {
      content: '';
      position: absolute;
      top: 56px;
      left: 0;
      right: 0;
      border-top: 1px solid #e5ebf5;
    }
    p {
      height: 56px;
      line-height: 56px;
      color: #333;
      font-size: 16px;
      position: relative;
      top: 0;
      transition: 0.35s ease-in-out;
    }
  }
  .item-wrap.in {
    .icon {
      transform: rotate(270deg);
    }
    .spot-wrap {
      top: 56px;
    }
    .otc-wrap {
      top: -56px;
    }
  }

  .label {
    position: relative;
    &:before {
      position: absolute;
      left: 19px;
      top: 27px;
      height: 57px;
      width: 0;
      border-left: 1px dashed #dfe2e7;
      content: '';
      z-index: 1;
    }
    p {
      position: relative;
      padding-left: 40px;
      line-height: 56px;
      &:before {
        position: absolute;
        width: 7px;
        height: 7px;
        background-color: #2483ff;
        border-radius: 50%;
        left: 16px;
        top: 25px;
        content: '';
        z-index: 1;
      }
    }
    p + p:before {
      background-color: #faad14;
    }
  }
}
.input-right {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
.input-unit {
  color: #9ca9b5;
}
.input-extent {
  user-select: none;
  padding: 10px 16px;
  margin-left: 10px;
  cursor: pointer;
  color: #2d8cf0;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 20px;
    border-left: 1px solid #cad7e0;
  }
  &:hover {
    color: #57a0ff;
  }
}
</style>