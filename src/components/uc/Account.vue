<template>
  <div class="page-wrap">
    <div class="con">
      <div class="tit u-text-left u-p-b-40">
        <span class="u-font-20 u-p-r-10">收款方式</span>
        <span
          >请务必使用您本人的实名账户，被激活的收款方式将在交易时向买方展示，最多激活3种</span
        >
      </div>
      <div class="list u-p-t-30">
        <div class="item u-flex u-row-between" v-for="(item, index) in paymentList" :key="index">
          <div class="u-flex">
            <div class="u-flex" style="width: 120px; text-align: left;">
              <!-- 图标 -->
              <i class="icons alipay" v-if="item.payTypeId == 4"></i>
              <i class="icons wechat" v-else-if="item.payTypeId == 3"></i>
              <i class="icons bankfor" v-else></i>
              <!-- 3微信 4支付宝 其它银行卡 -->
              <span class="u-p-l-10 u-p-r-20">
                {{ item.payTypeId == 3 ? 
                  '微信':
                  item.payTypeId == 4 ?
                  '支付宝' :
                  $t("uc.account.backcardno") }}
              </span>
            </div>
            
            <!-- 银行卡显示银行名、支行名 -->
            <p v-if="item.payTypeId != 3 && item.payTypeId != 4" class="bankInfo" style="color: #fff">
              {{ item.account }}，{{ item.accountName }}，{{
                item.accountInfo
              }}
            </p>
            <p v-else>{{ item.account }}</p>
          </div>
          <div class="u-flex">
            <div class="u-m-r-20 edit-btn" @click="edit(item)">修改</div>
            <i-switch size="large" :value="item.status == 1 ? true : false" @on-change="switchChange(item)">
              <span slot="open">ON</span>
              <span slot="close">OFF</span>
            </i-switch>
          </div>
        </div>
        <div class="u-flex u-row-right u-p-20">
          <Button type="primary" icon="md-add" @click="addShow = true"
            >添加收款方式</Button
          >
        </div>
      </div>
    </div>
    <!-- 添加修改银行卡弹窗 -->
    <Modal
      class="detail"
      v-model="blankShow"
      :title="$t('uc.account.backcardno')"
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
            <FormItem :label="$t('uc.account.name')">
              <Input disabled size="large" v-model="blankForm.kycName"></Input>
            </FormItem>
            <!-- 开户银行 -->
            <FormItem :label="$t('uc.account.bankaccount')" prop="accountName">
              <Input v-model="blankForm.accountName" size="large"></Input>
            </FormItem>
            <!-- 开户支行 -->
            <FormItem :label="$t('uc.account.bankbranch')" prop="accountInfo">
              <Input v-model="blankForm.accountInfo" size="large"></Input>
            </FormItem>
            <!-- 银行账号 -->
            <FormItem :label="$t('uc.account.bankno')" prop="account">
              <Input
                v-model="blankForm.account"
                size="large"
                type="text"
              ></Input>
            </FormItem>
            <!-- 确认卡号 -->
            <!-- <FormItem :label="$t('uc.account.confirmbankno')" prop="bankNoConfirm">
                      <Input v-model="blankForm.bankNoConfirm" size="large" type="text"></Input>
                  </FormItem> -->
            <!-- passwd -->
            <!-- <FormItem :label="$t('uc.account.fundpwd')" prop="password">
              <Input
                v-model="blankForm.password"
                type="password"
                size="large"
              ></Input>
            </FormItem> -->
            <!-- Button -->
            <FormItem class="u-text-right">
              <Button type="text" @click="blankShow = false" class="u-m-r-10"
                >取消</Button
              >
              <Button type="primary" @click="submit('blankForm')" :loading="blankLoading">{{
                $t("uc.account.save")
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
      title="支付宝"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div class="account-detail">
        <div class="detail-list">
          <Form
            ref="aliForm"
            :model="aliForm"
            :rules="rules"
            :label-width="85"
          >
            <!-- 姓名 -->
            <FormItem :label="$t('uc.account.name')">
              <Input disabled size="large" v-model="aliForm.kycName"></Input>
            </FormItem>
            <!-- 支付宝账号 -->
            <FormItem label="支付宝账号" prop="account">
              <Input v-model="aliForm.account" size="large"></Input>
            </FormItem>
            <FormItem class="u-text-right">
              <Button type="text" @click="aliShow = false" class="u-m-r-10"
                >取消</Button
              >
              <Button type="primary" @click="submit('aliForm')" :loading="blankLoading">{{
                $t("uc.account.save")
              }}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>

    <!-- 添加微信弹窗 -->
    <Modal
      class="detail"
      v-model="weChatShow"
      title="微信"
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
            <FormItem :label="$t('uc.account.name')">
              <Input disabled size="large" v-model="weChatForm.kycName"></Input>
            </FormItem>
            <!-- 微信账号 -->
            <FormItem label="微信账号" prop="account">
              <Input v-model="weChatForm.account" size="large"></Input>
            </FormItem>
            <FormItem class="u-text-right">
              <Button type="text" @click="weChatShow = false" class="u-m-r-10"
                >取消</Button
              >
              <Button type="primary" @click="submit('weChatForm')" :loading="blankLoading">{{
                $t("uc.account.save")
              }}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>

    <Modal
      class="detail"
      v-model="addShow"
      title="添加收款方式"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div class="detail">
        <div class="u-p-b-10">收款方式</div>
          <Select
            filterable
            v-model="payTypeId"
            size="large"
            placeholder="请输入关键字"
            @on-change="changePayType"
          >
            <Option v-for="item in payTypeList" :value="item.id" :key="item.id">{{
              item.name
            }}</Option>
          </Select>
        <div class="u-flex u-row-right u-p-t-20">
          <Button type="text" @click="addShow = false">取消</Button>
          <Button type="primary" @click="confirmPayType">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getPaymentList, savePayment, editPayment, getPayType } from "@/api/user";
export default {
  data() {
    return {
      blankLoading: false,
      blankSwitch: false,
      blankShow: false,
      aliShow: false,
      weChatShow: false,
      weChatForm: {},
      blankForm: {},
      aliForm: {},
      rules: {
        accountName: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
        accountInfo: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
        account: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
      },
      user: {
        bankVerified: false, // 是否绑定银行卡
        bankInfo: {},
      },
      // 用户收款列表
      paymentList: [],
      payTypeId: "", // 收款方式
      payTypeList: [], // 收款方式列表
      addShow: false,
      saveOrEdit: 'save',
      editId: '', // 修改ID
    };
  },
  created() {
    this.getPaymentList(); // 获取收款列表
    this.getPayType(); // 查询支持收款方式
  },
  methods: {
    /* 开启、关闭 */
    switchChange(item) {
      editPayment({
        id: item.id,
        status: item.status == 1 ? 0 : 1
      }).then(() => {
        this.$Notice.success({
          title: "提示",
          desc: "成功",
        });
        this.getPaymentList()
      })
    },
    /* 修改收款方式 */
    edit(item) {
      this.saveOrEdit = 'edit'
      this.editId = item.id
      console.log(item)
      switch(item.payTypeId) {
        // 微信
        case 3:
          this.weChatForm = {
            account: item.account
          }
          this.weChatShow = true
          break;
        // 支付宝
        case 4:
          this.aliForm = {
            account: item.account
          }
          this.aliShow = true
          break;
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
      console.log(this.payTypeId);
      if (this.payTypeId == "") {
        this.$Notice.success({
          title: "提示",
          desc: "请选择收款方式",
        });
      }
    },
    /* 选择收款方式 */
    changePayType(value) {
      this.saveOrEdit = 'save'
      switch (value) {
        // 微信
        case 3:
          this.weChatForm = {}
          this.weChatShow = true
          break;
        // 支付宝
        case 4:
          this.aliForm = {}
          this.aliShow = true
          break;
        // 银行卡
        default:
          this.blankForm = {}
          this.blankShow = true;
      }
      this.addShow = false
    },
    getPayType() {
      getPayType().then((res) => {
        this.payTypeList = res;
      });
    },
    /* 添加收款方式 */

    /* 开关 */
    switichChange() {},
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

      this.$refs[name].validate((valid) => {
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
            ...params,
          }).then(() => {
            this.$Notice.success({
              title: '提示',
              desc: '操作成功'
            });
            this.blankShow = false
            this.aliShow = false
            this.weChatShow = false
            this.getPaymentList()
          }).finally(() => {
            this.blankLoading = false
          })
        }
      })
    },
    /* 获取收款列表 */
    getPaymentList() {
      getPaymentList().then((res) => {
        this.paymentList = res
        let arr = res;
        arr.forEach((val) => {
          switch (true) {
            // 微信
            case val == 3:
              break;
            // 支付宝
            case val == 4:
              break;
            // 银行卡
            default:
              this.user.bankVerified = true;
              this.user.bankInfo = val;
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.icons {
  height: 17px;
  width: 17px;
  display: inline-block;
  margin-top: -1px;
  background-size: 100% 100%;
}
.bankfor {
  background-image: url(../../assets/img/bankcard.png);
}
.icons.alipay {
  background-image: url(../../assets/img/alipay.png);
}

.icons.wechat {
  background-image: url(../../assets/img/wechat.png);
}

.list {
  color: #fff;
  width: 1200px;
  margin: 0 auto;
  .item {
    padding: 20px;
    box-shadow: 0 1px 0 0 rgb(69 112 128 / 6%);
  }
}

.edit-btn {
  padding: 10px;
  color: #2d8cf0;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
}

.detail {
  ::v-deep .ivu-input[disabled],
  fieldset[disabled] .ivu-input {
    background-color: #f3f3f3 !important;
    border: none;
  }
  ::v-deep .ivu-select-single .ivu-select-selection {
    background-color: #fff !important;
    border: 1px solid #dcdee2 !important;
  }
  ::v-deep .ivu-input,
  .ivu-input-number-input,
  .ivu-input-number {
    background-color: #fff !important;
    color: #27313e !important;
    border: 1px solid #dcdee2 !important;
  }

  ::v-deep .ivu-select-dropdown {
    background-color: #fff !important;
  }

  ::v-deep .ivu-select-item {
    color: #515a6e !important;
  }
  ::v-deep .ivu-select-item-focus,
  ::v-deep .ivu-select-item:hover {
    background: #f3f3f3 !important;
  }
  ::v-deep .ivu-select-selected-value {
    color: #515a6e !important;
  }
  ::v-deep .ivu-select-item-selected, ::v-deep .ivu-select-item-selected:hover {
    background: #f3f3f3 !important;
  }
}
</style>