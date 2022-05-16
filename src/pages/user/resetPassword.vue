<template>
  <div class="page-wrap">
    <div class="page-con">
      <h1 v-text="$t('resetPass.czdlmm')">重置登录密码</h1>
      <div class="hint u-m-t-30 u-m-b-20" v-text="$t('resetPass.jztb')">重置登录密码后，24小时内禁止提币</div>
      <ul class="email-phone u-flex">
        <li :class="{'on': changeActive == 0}" @click="handleTab(0)" v-text="$t('resetPass.youx')">邮箱</li>
        <li :class="{'on': changeActive == 1}" @click="handleTab(1)" v-text="$t('resetPass.shouj')">手机</li>
      </ul>
      <Form ref="formEmail" :model="formEmail" :rules="rules" v-if="changeActive == 0">
        <FormItem prop="email">
          <Input type="text" v-model="formEmail.email" :placeholder="$t('register.yxdz')" class="user"></Input>
        </FormItem>
        <FormItem class="u-p-t-20">
          <Button
            style="height: 50px;"
            type="primary" class="register_btn" @click="handleSubmit('formEmail')" long 
            :loading="submitLoading" >{{ $t('resetPass.tj') }}</Button>
        </FormItem>
      </Form>

      <Form ref="formMobile" :model="formMobile" :rules="rules" v-if="changeActive == 1">
        <div class="u-flex u-col-top">
          <Select
            style="width: 90px"
            v-model="formMobile.areaCode" filterable class="area u-m-r-8" placeholder="">
            <Option 
              :label="'+' + item.code"
              :value="item.code"
              v-for="(item, index) in countryList"
              :key="index">
              <span>+{{item.code}}</span>
              <span style="margin-left:10px;color:#ccc">{{item.name}}</span>
            </Option>
          </Select>
          <FormItem prop="mobile" class="phone u-flex-1">
            <Input type="text" v-model="formMobile.mobile" :placeholder="$t('register.sjhm')">
            </Input>
          </FormItem>
        </div>
        <FormItem class="u-p-t-20">
          <Button
            style="height: 50px;"
            long
            type="primary"
            class="register_btn"
            @click="handleSubmit('formMobile')"
            :loading="submitLoading">{{ $t('resetPass.tj') }}</Button>
        </FormItem>
      </Form>
    </div>

    <!-- 安全验证弹窗 -->
    <Modal
      class="detail"
      v-model="visible"
      width="480px"
      :title="$t('security.aqyz')"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="visible = false"
    >
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        label-position="top"
      >
        <!-- 邮箱验证码 -->
        <FormItem :label="$t('security.yxyzm')" prop="emailCode" v-if="changeActive == 0">
          <Input v-model="formValidate.emailCode" size="large">
            <div class="timebox" slot="append">
              <Button
                type="text"
                size="default"
                @click="send('uCodeEmail', 'disabled')"
                :disabled="formValidate.disabled"
              >
                <u-verification-code
                  ref="uCodeEmail"
                  :keep-running="false"
                  @change="
                    text => {
                      timeTips = text
                    }
                  "
                  @end="formValidate.disabled = false"
                ></u-verification-code>
                {{ timeTips }}
              </Button>
            </div>
          </Input>
        </FormItem>
        <!-- 手机验证码 -->
        <FormItem :label="$t('security.sjyzm')" prop="mobileCode" v-if="changeActive == 1">
          <Input v-model="formValidate.mobileCode" size="large">
            <div class="timebox" slot="append">
              <Button
                type="text"
                size="default"
                @click="send('uCodeMobile', 'disabled2')"
                :disabled="formValidate.disabled2"
              >
                <u-verification-code
                  ref="uCodeMobile"
                  :keep-running="false"
                  @change="
                    text => {
                      timeTips200 = text
                    }
                  "
                  @end="formValidate.disabled2 = false"
                ></u-verification-code>
                {{ timeTips200 }}
              </Button>
            </div>
          </Input>
        </FormItem>
        <div class="u-text-right u-m-t-30">
          <Button type="text" @click="visible = false">{{
            $t('publice.qx')
          }}</Button>
          <Button
            type="primary"
            :loading="loading"
            @click="submit('formValidate')"
            >{{ $t('publice.qd') }}</Button
          >
        </div>
      </Form>
    </Modal>

    <!-- 重置密码 -->
    <Modal
      class="detail"
      v-model="visibleThree"
      width="480px"
      :title="$t('resetPass.czmm')"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="visibleThree = false"
    >
      <Form
        ref="formValidateT"
        :model="formValidateT"
        :rules="ruleValidate"
        label-position="top"
      >
        <FormItem :label="$t('resetPass.ps')" prop="password">
          <Input type="password" password v-model="formValidateT.password" size="large"></Input>
        </FormItem>
        <div class="u-text-right u-m-t-30">
          <Button type="text" @click="visibleThree = false">{{
            $t('uc.api.cancel')
          }}</Button>
          <Button
            type="primary"
            :loading="resetLoading"
            @click="submitThree('formValidateT')"
            >{{ $t('common.ok') }}</Button
          >
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { 
  getCountryList, sendEmailCode, sendMobileCode,
  resetPass, resetPassT, restPassword
} from '@/api/user'
import uVerificationCode from '@/components/u-verification-code/u-verification-code'
export default {
  components: {
    uVerificationCode
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      let isEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if (value == "") {
        callback(new Error(this.$t('register.qsryx')));
      } else if (!isEmail.test(this.formEmail.email)) {
        callback(new Error(this.$t('register.yxbzq')));
      } else {
        callback();
      }
    }
    return {
      resetLoading: false,
      visibleThree: false,
      formValidateT: {},
      loading: false,
      visible: false,
      timeTips: '获取验证码',
      timeTips200: '获取验证码',
      submitLoading: false,
      changeActive: 0,
      countryList: [],
      stepsKey: '',
      formEmail: {},
      formMobile: {
        areaCode: 1, // 国家地区区号
      },
      formValidate: {

      },
      ruleValidate: {
        emailCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
        mobileCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      },
      rules: {
        mobile: [
          {
            required: true,
            message: this.$t('register.qsrsjh'),
            trigger: "blur"
          }
        ],
        email: [{ validator: validateEmail, trigger: "blur" }],
      },
    }
  },
  created() {
    this.getCountryList()
  },
  methods: {
    /* 重置密码第二步 */
    submit(name) {
      console.log(name)
      this.$refs[name].validate(valid => {
        if (valid) {
          let obj = {}
          if (this.changeActive == 0) {
            obj = {
              isMobile: false,
              emailCode: this.formValidate.emailCode
            }
          } else {
            obj = {
              isMobile: true,
              mobileCode: this.formValidate.mobileCode
            }
          }
          this.loading = true
          resetPassT({
            ...obj,
            stepsKey: this.stepsKey
          }).then(res => {
            // 弹出第3步输入新密码
            this.stepsKey = res
            this.visibleThree = true
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    /* 重置密码第三步 */
    submitThree(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.resetLoading = true
          restPassword({
            stepsKey: this.stepsKey,
            password: this.formValidateT.password
          }).then(() => {
            this.$Notice.success({
              title: this.$t('publice.ts'),
              desc: this.$t('publice.cg')
            })
            this.$router.push('/login')
          }).finally(() => {
            this.resetLoading = false
          })
        }
      })
    },
    /* 查询国家地区区号 */
    getCountryList() {
      getCountryList().then(res => {
        this.countryList = res
      })
    },
    /* 切换Tab */
    handleTab(index) {
      this.changeActive = index
    },
    /* 发送短信验证码 */
    send(countName, disName) {
      // 开始倒计时、禁用button
      countName && this.$refs[countName].start()
      disName && (this.formValidate[disName] = true)
      let request = countName == 'uCodeEmail' ? sendEmailCode : sendMobileCode
      let obj = {}
      if (countName == 'uCodeEmail') {
        obj = {
          type: 3,
          email: this.formEmail.email
        }
      } else {
        obj = {
          type: 3,
          areaCode: this.formMobile.areaCode,
          mobile: this.formMobile.mobile
        }
      }
      request(obj)
        .then(() => {
          this.$Notice.success({
              title: this.$t('publice.ts'),
              desc: this.$t('publice.cg')
            })
        })
        .catch(() => {
          // 接口报错重置
          countName && this.$refs[countName].reset()
          disName && (this.formValidate[disName] = false)
        })
    },
    /* 重置密码第一步 */
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.submitLoading = true
          resetPass({
            username: name == 'formEmail' ? this.formEmail.email : this.formMobile.mobile
          }).then(res => {
            this.stepsKey = res
            this.visible = true
          }).finally(() => {
            this.submitLoading = false
          })
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.page-con ::v-deep .ivu-input, ::v-deep .ivu-select-selection {
  height: 50px;
  line-height: 50px;
}
.page-wrap {
  background-color: #000b23;
  min-height: calc(100vh - 54px);
}
.page-con {
  width: 492px;
  height: 429px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 4px;
  padding: 28px 70px;
  .hint {
    height: 50px;
    line-height: 50px;
    padding-left: 15px;
    background-color: #FFF3DA;
    color: #FE850D;
  }
}
.email-phone {
  margin-bottom: 20px;
  li {
    flex: 1;
    text-align: center;
    padding: 7px 0;
    background-color: #F2F6FD;
    border-radius: 4px;
    cursor: pointer;
  }
  .on {
    background-color: #007AFF;
    color: #fff;
  }
}
</style>