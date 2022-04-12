<template>
  <div class="page-wrap">
    <div class="title u-flex u-font-18" @click="$router.go(-1)">
      <Icon type="ios-arrow-back" color="#333" />
      返回
    </div>

    <div class="con">
      <p class="u-font-16 u-p-b-20">添加提币地址</p>
      <Form ref="formValidate" :model="formValidate" inline>
        <FormItem label="币种" prop="name" style="width: 110px">
          <Select
            v-model="coinId"
            filterable
            placeholder="选择币种"
            size="large"
            @on-change="coinChange"
          >
            <Option
              v-for="item in coinList"
              :value="item.currencyId"
              :key="item.currencyId"
              >{{ item.currencyName }}</Option
            >
          </Select>
        </FormItem>

        <FormItem label="链名称" prop="chainId" style="width: 110px">
          <Select
            v-model="chainId"
            filterable
            size="large"
          >
            <Option
              v-for="item in chainList"
              :value="item.chainId"
              :key="item.chainId"
              >{{ item.chainName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="提币地址" prop="address" style="width: 400px" class="address-input">
          <Input v-model="formValidate.address" size="large" placeholder="提币地址"></Input>
        </FormItem>
        <FormItem label="备注" prop="alias" style="width: 260px">
          <Input v-model="formValidate.alias" size="large" placeholder="备注"></Input>
        </FormItem>

        <div>
          <Button
            size="large"
            style="width: 200px"
            type="primary"
            @click="handleAdd('formValidate')"
            >添加</Button
          >
        </div>
      </Form>
    </div>

    <div class="table">
      <div class="title u-font-14">地址列表</div>
      <Table :columns="columns" :data="addressList" class="hidden-xs">
        <template slot-scope="{ row, index }" slot="slotAddress">
          <span class="u-font-12">{{ row.address }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="slotHand">
          <Button size="small" type="primary" ghost @click="remove(row)">删除</Button>
        </template>
      </Table>

      <ul class="xs-list hidden-lg" v-for="row in addressList" :key="row.id">
        <li>
          <div>币种</div>
          <div>{{ row.currencyName }}</div>
        </li>
        <li>
          <div>提币地址</div>
          <div>{{ row.address }}</div>
        </li>
        <li>
          <div>备注</div>
          <div>
            <span style="color: #19be6b">{{ row.alias }}</span>
          </div>
        </li>
        <li>
          <div>操作</div>
          <div>
            <Button size="small" type="primary" ghost @click="remove(row)">删除</Button>
          </div>
        </li>
      </ul>
    </div>

    <safeModal
      v-model="safeShow"
      :safeType="38"
      @submit="confirmSubmit"
    ></safeModal>
  </div>
</template>

<script>
import { getCurrencyList, saveAddress, getAddressList, removeAddress } from '@/api/finance'
import safeModal from '@components/safeModal/safeModal'
// import QrcodeVue from "qrcode.vue"

export default {
  components: {
    // QrcodeVue
    safeModal
  },
  data() {
    return {
      addressList: [], // 地址列表
      safeShow: false, // 安全验证
      formValidate: {
        address: '',
        alias: '',
      },

      coinName: '', // 币种名
      coinId: '', // 币种ID
      chainId: '', // 网络id
      chainActive: {}, // 当前网络对象
      coinList: [],
      chainList: [],
      columns: [
        {
          title: '币种',
          key: 'currencyName'
        },
        {
          title: '提币地址',
          key: 'address',
          slot: 'slotAddress',
          width: '400px',

        },
        {
          title: '备注',
          key: 'alias'
        },
        {
          title: '操作',
          slot: 'slotHand',
          align: 'right'
        }
      ],
    }
  },
  async created() {
    try {
      await this.getCurrencyList()
      this.getAddressList()
    } catch {}
  },
  methods: {
    /* 删除 */
    remove(row) {
      this.$Modal.confirm({
          title: '提示',
          content: '确认删除？',
          loading: true,
          onOk: () => {
            removeAddress(row.id).then(() => {
              this.$Notice.success({
                title: '提示',
                desc: '成功'
              });
              this.getAddressList()
              this.formValidate = {}
            }).finally(() => {
              this.$Modal.remove();
            })
          },
          onCancel: () => {}
      });
    },
    /* 添加 */
    handleAdd() {
      if (this.formValidate.address == '') {
        this.$Notice.info({
          title: '提示',
          desc: '请输入提币地址'
        })
        return
      }
      if (this.formValidate.alias == '') {
        this.$Notice.info({
          title: '提示',
          desc: '请输入备注'
        })
        return
      }
      this.safeShow = true
    },
    /* 确认提交 */
    confirmSubmit(name, type, formData) {
      console.log(formData)
      console.log(this.chainId)
      console.log('formValidate', this.formValidate)
      // return
      saveAddress({
        ...formData,
        ...this.formValidate,
        currencyName: this.coinName,
        address: this.formValidate.address.trim(),
        chainId: this.chainId
      }).then(() => {
        this.safeShow = false
        this.getAddressList()
        this.$Notice.success({
          title: '提示',
          desc: '成功'
        })
      })
    },
    /* 获取地址列表 */
    getAddressList() {
      getAddressList().then(res => {
        this.addressList = res
      })
    },

    /* 复制地址 */
    copySuccess() {
      this.$Notice.success({
        title: '提示',
        desc: '复制成功'
      })
    },

    /* 切换币种 */
    coinChange(val) {
      let activeList = this.coinList.filter(item => {
        return item.currencyId == val
      })
      // 对应的充币网络
      this.coinName = activeList[0].currencyName
      this.chainList = activeList[0].tokenChainList
      this.chainActive = activeList[0].tokenChainList[0]
      this.chainId = activeList[0].tokenChainList[0].chainId

    },
    /* 获取币种列表 */
    getCurrencyList() {
      return new Promise(resolve => {
        getCurrencyList().then(res => {
          this.coinList = res
          this.coinId = res[0].currencyId
          this.coinName = res[0].currencyName
          this.chainList = res[0].tokenChainList
          this.chainActive = res[0].tokenChainList[0]
          this.chainId = res[0].tokenChainList[0].chainId

          resolve()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ivu-input[disabled],
fieldset[disabled] .ivu-input {
  background-color: #ecf1f8;
  border: none;
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
    padding: 24px 8px 29px;
  }
  .table {
    margin-top: 20px;
    background-color: #f9fafc;
    border-radius: 7px;
    .title {
      border-bottom: 1px solid #e8eaec;
      padding: 0 18px;
    }
  }
}
/* 手机端 */
@media (max-width: 767px) {
  .page-wrap {
    width: 100%;
  }
  ::v-deep .ivu-form-inline .ivu-form-item {
    display: block;
  }
  .address-input {
    width: 100% !important;
  }
  .xs-list {
    font-size: 14px;
    padding: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    li {
      min-height: 26px;
      display: flex;
      justify-content: space-between;
    }
  }
}

</style>