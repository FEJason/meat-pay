<template>
  <div class="page-wrap">
    <div class="page-con">
      <div class="header"></div>
      <div class="card-wrap">
        <div class="title u-flex">
          <h2 v-text="$t('payment.shoukfs')">收款方式</h2>
          <p class="u-font-12 u-p-l-20" v-text="$t('payment.qinwbsy')">
            请务必使用您本人的实名账户，
            被激活的收款方式将在交易时向买方展示，最多激活3种
          </p>
        </div>
        <div class="list-wrap u-font-14">
          <div class="u-flex u-row-right u-p-t-20 u-p-b-20">
            <Button type="primary" icon="md-add" @click="addShow = true"
              v-text="$t('payment.tianjsk')">添加收款方式</Button
            >
          </div>
          <div
            class="list"
            v-for="(item, index) in paymentList"
            :key="index"
          >
            <div class="left u-flex u-font-12">
              <div class="u-flex" style="width: 120px; text-align: left">
                <div class="icon-wrap" style="color: #00C096" v-if="item.payTypeId == 3" 
                  v-text="$t('payment.weix')">微信支付</div>
                <div class="icon-wrap" style="color: #007AFF" v-else-if="item.payTypeId == 4"
                  v-text="$t('payment.zhifb')">支付宝</div>
                <div class="icon-wrap" style="color: #f4a661" v-else
                  v-text="$t('payment.yinghk')">银行卡</div>
              </div>

            </div>
            <div class="right">
              <div class="u-flex">
                <p class="u-p-r-60">{{ realNameInfo.cardName }}</p>

                <!-- 银行卡显示银行名、支行名 -->
                <p
                  v-if="item.payTypeId != 3 && item.payTypeId != 4"
                  class="bankInfo"
                >
                  {{ item.account }}，{{ item.accountName }}，{{
                    item.accountInfo
                  }}
                </p>
                <p v-else>{{ item.account }}</p>
              </div>

              <div class="u-flex edit">
                <div class="u-m-r-20 u-link" @click="edit(item)" v-text="$t('payment.xiug')">修改</div>
                <i-switch
                  size="large"
                  :value="item.status == 1 ? true : false"
                  @on-change="switchChange(item)"
                >
                  <span slot="open">ON</span>
                  <span slot="close">OFF</span>
                </i-switch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加修改银行卡弹窗 -->
    <Modal
      class="detail"
      v-model="blankShow"
      :title="$t('payment.tianjyhk')"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div class="account-detail">
        <div class="detail-list">
          <Form
            ref="blankForm"
            :model="blankForm"
            :rules="rules"
            :label-width="85"
          >
            <!-- 姓名 -->
            <FormItem :label="$t('payment.xinm')">
              <Input disabled size="large" v-model="realNameInfo.cardName"></Input>
            </FormItem>
            <!-- 开户银行 -->
            <FormItem :label="$t('payment.kaihyh')" prop="accountName">
              <Input v-model="blankForm.accountName" size="large"></Input>
            </FormItem>
            <!-- 开户支行 -->
            <FormItem :label="$t('payment.kaihzh')" prop="accountInfo">
              <Input v-model="blankForm.accountInfo" size="large"></Input>
            </FormItem>
            <!-- 银行账号 -->
            <FormItem :label="$t('payment.yinghzh')" prop="account">
              <Input
                v-model="blankForm.account"
                size="large"
                type="text"
              ></Input>
            </FormItem>
            <FormItem class="u-text-right">
              <Button type="text" @click="blankShow = false" class="u-m-r-10">{{ $t("publice.qx") }}</Button
              >
              <Button type="primary" @click="submit('blankForm')" :loading="blankLoading">{{
                $t("publice.qd")
              }}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>

    <!-- 添加支付宝弹窗 -->
    <Modal
      class="detail"
      v-model="aliShow"
      :title="$t('payment.zhifb')"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div class="account-detail">
        <div class="detail-list">
          <Form ref="aliForm" :model="aliForm" :rules="rules" :label-width="85">
            <!-- 姓名 -->
            <FormItem :label="$t('payment.xinm')">
              <Input disabled size="large" v-model="realNameInfo.cardName"></Input>
            </FormItem>
            <!-- 支付宝账号 -->
            <FormItem :label="$t('payment.zhifbzh')" prop="account">
              <Input v-model="aliForm.account" size="large"></Input>
            </FormItem>
            <FormItem class="u-text-right">
              <Button type="text" @click="aliShow = false" class="u-m-r-10"
                >{{ $t("publice.qx") }}</Button
              >
              <Button
                type="primary"
                @click="submit('aliForm')"
                :loading="blankLoading"
                >{{ $t("publice.qd") }}</Button
              >
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>

    <!-- 添加微信弹窗 -->
    <Modal
      class="detail"
      v-model="weChatShow"
      :title="$t('payment.weix')"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div class="account-detail">
        <div class="detail-list">
          <Form
            ref="weChatForm"
            :model="weChatForm"
            :rules="rules"
            :label-width="85"
          >
            <!-- 姓名 -->
            <FormItem :label="$t('payment.xinm')">
              <Input disabled size="large" v-model="realNameInfo.cardName"></Input>
            </FormItem>
            <!-- 微信账号 -->
            <FormItem :label="$t('payment.weixzh')" prop="account">
              <Input v-model="weChatForm.account" size="large"></Input>
            </FormItem>
            <FormItem class="u-text-right">
              <Button type="text" @click="weChatShow = false" class="u-m-r-10"
                >{{ $t("publice.qx") }}</Button
              >
              <Button
                type="primary"
                @click="submit('weChatForm')"
                :loading="blankLoading"
                >{{ $t("publice.qd") }}</Button
              >
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>

    <Modal
      class="detail"
      v-model="addShow"
      :title="$t('payment.tianjsk')"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div class="detail">
        <div class="u-p-b-10" v-text="$t('payment.shoukfs')">收款方式</div>
        <Select
          filterable
          v-model="payTypeId"
          size="large"
          :placeholder="$t('payment.qingsrgjz')"
          @on-change="changePayType"
        >
          <Option v-for="item in payTypeList" :label="item.name" :value="item.id" :key="item.id" class="u-flex">
            <img :src="VUE_APP_WS + item.image" alt="img" style="width: 21px;"/>
            <span class="u-p-l-6">{{item.name}}</span>
          </Option>
        </Select>
        <div class="u-flex u-row-right u-p-t-20">
          <Button type="text" @click="addShow = false">{{ $t("publice.qx") }}</Button>
          <Button type="primary" @click="confirmPayType">{{ $t("publice.qd") }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getPaymentList,
  savePayment,
  editPayment,
  getPayType,
  getCertification
} from '@/api/user'
export default {
  data() {
    return {
      VUE_APP_WS: process.env.VUE_APP_WS,
      realNameInfo: {},
      blankLoading: false,
      blankSwitch: false,
      blankShow: false,
      aliShow: false,
      weChatShow: false,
      weChatForm: {},
      blankForm: {},
      aliForm: {},
      rules: {
        accountName: [{ required: true, message: '请输入', trigger: 'blur' }],
        accountInfo: [{ required: true, message: '请输入', trigger: 'blur' }],
        account: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      user: {
        bankVerified: false, // 是否绑定银行卡
        bankInfo: {}
      },
      // 用户收款列表
      paymentList: [],
      payTypeId: '', // 收款方式
      payTypeList: [], // 收款方式列表
      addShow: false,
      saveOrEdit: 'save',
      editId: '' // 修改ID
    }
  },
  created() {
    this.getPaymentList() // 获取收款列表
    this.getPayType() // 查询支持收款方式
    this.getCertification() // 查询实名认证信息
  },
  methods: {
    /* 查询实名认证信息 */
    getCertification() {
      getCertification().then((res) => {
        if (!res) {
          this.$Notice.info({
            title: '提示',
            desc: "请先完成实名认证"
          })
          this.$route.push({
            path: '/security'
          })
          return
        }
        this.realNameInfo = res;
      });
    },
    /* 开启、关闭 */
    switchChange(item) {
      editPayment({
        id: item.id,
        status: item.status == 1 ? 0 : 1
      }).then(() => {
        this.$Notice.success({
          title: '提示',
          desc: '成功'
        })
        this.getPaymentList()
      })
    },
    /* 修改收款方式 */
    edit(item) {
      this.saveOrEdit = 'edit'
      this.editId = item.id
      console.log(item)
      switch (item.payTypeId) {
        // 微信
        case 3:
          this.weChatForm = {
            account: item.account
          }
          this.weChatShow = true
          break
        // 支付宝
        case 4:
          this.aliForm = {
            account: item.account
          }
          this.aliShow = true
          break
        // 银行卡
        default:
          this.blankForm = {
            accountName: item.accountName,
            accountInfo: item.accountInfo,
            account: item.account
          }
          this.blankShow = true
      }
    },
    /* 选择收款方式 */
    confirmPayType() {
      console.log(this.payTypeId)
      if (this.payTypeId == '') {
        this.$Notice.success({
          title: '提示',
          desc: '请选择收款方式'
        })
      }
    },
    /* 选择收款方式 */
    changePayType(value) {
      console.log(value)
      this.saveOrEdit = 'save'
      switch (value) {
        // 微信
        case 3:
          this.weChatForm = {}
          this.weChatShow = true
          break
        // 支付宝
        case 4:
          this.aliForm = {}
          this.aliShow = true
          break
        // 银行卡
        default:
          this.blankForm = {}
          this.blankShow = true
      }
      this.addShow = false
    },
    /* 查询支持收款方式 */
    getPayType() {
      getPayType().then(res => {
        this.payTypeList = res
      })
    },
    /* 银行卡提交 */
    submit(name) {
      let params = {}
      if (name == 'blankForm') {
        params = this.blankForm
      } else if (name == 'aliForm') {
        params = this.aliForm
      } else if (name == 'weChatForm') {
        params = this.weChatForm
      }

      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(JSON.parse(JSON.stringify(this.blankForm)))
          this.blankLoading = true

          let request = null
          if (this.saveOrEdit == 'save') {
            // 新增传类型 payTypeId
            params.payTypeId = this.payTypeId
            request = savePayment
          } else {
            // 编辑传id
            params.id = this.editId
            request = editPayment
          }
          request({
            ...params
          })
            .then(() => {
              this.$Notice.success({
                title: '提示',
                desc: '操作成功'
              })
              this.blankShow = false
              this.aliShow = false
              this.weChatShow = false
              this.getPaymentList()
            })
            .finally(() => {
              this.blankLoading = false
            })
        }
      })
    },
    /* 获取收款列表 */
    getPaymentList() {
      getPaymentList().then(res => {
        this.paymentList = res
        let arr = res
        arr.forEach(val => {
          switch (true) {
            // 微信
            case val == 3:
              break
            // 支付宝
            case val == 4:
              break
            // 银行卡
            default:
              this.user.bankVerified = true
              this.user.bankInfo = val
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  background: #f2f6fd;
}
/* PC端 */
@media (min-width: 768px) {
  .page-wrap {
    min-height: 60vh;
  }
}
.page-con {
  width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}
.card-wrap {
  background-color: #fff;
  border-radius: 7px;
  overflow: hidden;
  .title {
    font-size: 16px;
    background-color: #f8fafd;
    border-radius: 7px 7px 0 0;
    padding: 20px;
    h2 {
      font-size: 16px;
    }
    p {
      color: #999;
    }
  }
}
.list-wrap {
  padding: 10px 20px 0;
  border-radius: 7px;
  .list {
    display: flex;
    justify-content: space-between;
    .left {
      width: 112px;
    }
    .right {
      display: flex;
      justify-content: space-between;
      margin-left: 10px;
      flex: 1;
      border-bottom: 1px solid #eee;
      padding: 30px 0;
    }
  }
  .icon-wrap {
    border-radius: 2px;
    border: 1px solid #DDDDDD;
    padding: 5px 10px;
    min-width: 100px;
    text-align: center;
  }
}

/* 手机端 */
@media (max-width: 767px) {
  .page-con {
    width: 100%;
  }
  .list-wrap {
    .list {
      display: block;
      .right {
        display: block;
        margin-bottom: 10px;
        margin-left: 0;
        padding: 10px 0 20px;
        .u-flex {
          display: block !important;
        }
        .edit {
          display: flex !important;;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>