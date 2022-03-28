<template>
  <div class="page-wrap">
    <div class="page-con">
      <h1 class="u-m-b-30">注册</h1>
      <ul class="email-phone u-flex">
        <li :class="{'on': changeActive == 0}" @click="handleTab(0)">{{ $t('register.yxzc') }}</li>
        <li :class="{'on': changeActive == 1}" @click="handleTab(1)">{{ $t('register.sjzc') }}</li>
      </ul>
      <div class="form-con">
          <!-- 邮箱注册 -->
          <Form ref="formEmail" :model="formEmail" :rules="rules" v-if="changeActive == 0">
            <FormItem prop="email" class="phone">
              <Input type="text" v-model="formEmail.email" :placeholder="$t('register.yxdz')">
              </Input>
            </FormItem>
            <FormItem prop="code">
              <Input type="text" v-model="formEmail.code" :placeholder="$t('register.yxyzm')">
                <Button slot="append"
                  style="border: 1px solid #2d8cf0 !important; color: #2d8cf0; background-color: #fff; height: 50px"
                  @click="sendEmailCode"
                  :disabled="disEmailCodeBtn">{{sendcodeValue}}</Button>
              </Input>
            </FormItem>
            <FormItem prop="password"  class="password">
              <Input type="password" password v-model="formEmail.password" :placeholder="$t('register.dlmm')">
              </Input>
            </FormItem>
            <FormItem prop="sourceInviteCode" :label="$t('register.yqm')" v-show="!$route.query.ref">
              <Input type="text" v-model="formEmail.sourceInviteCode" :placeholder="$t('register.yqm')"></Input>
            </FormItem>
            <div class="check-agree">
              <label>
                <Checkbox v-model="agree">{{ $t('register.wyyd') }}</Checkbox>
              </label>
              <router-link :to="`/agreement?lang=${lang}`">{{ $t('register.yhxy') }}</router-link>
              {{ $t('register.he') }}
              <router-link :to="`/privacy?lang=${lang}`">{{ $t('register.yszc') }}</router-link>
            </div>
            <FormItem class="u-p-t-20">
              <Button
                style="height: 50px;"
                type="primary" class="register_btn" @click="handleSubmit('formEmail')" long
                :loading="submitLoading" >{{ $t('register.zc') }}</Button>
            </FormItem>
          </Form>
          <!-- 手机注册 -->
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
            <FormItem prop="code">
              <Input type="text" v-model="formMobile.code" :placeholder="$t('register.dxyz')">
                <Button
                  :disabled="disPhoneCodeBtn"
                  slot="append"
                  style="border: 1px solid #2d8cf0 !important; color: #2d8cf0; background-color: #fff; height: 50px"
                  @click="sendPhoneCode">{{sendcodeValue}}</Button>
              </Input>
            </FormItem>
            <FormItem prop="password"  class="password">
              <Input type="password" password v-model="formMobile.password" :placeholder="$t('register.dlmm')">
              </Input>
            </FormItem>
            <FormItem prop="sourceInviteCode" :label="$t('register.yqm')" v-show="!$route.query.ref">
              <Input type="text" v-model="formMobile.sourceInviteCode" :placeholder="$t('register.yqm')"></Input>
            </FormItem>
            <div class="check-agree">
              <label>
                <Checkbox v-model="agree">{{ $t('register.wyyd') }}</Checkbox>
              </label>
              <router-link :to="`/agreement?lang=${lang}`">{{ $t('register.yhxy') }}</router-link>
              {{ $t('register.he') }}
              <router-link :to="`/privacy?lang=${lang}`">{{ $t('register.yszc') }}</router-link>
            </div>
            <FormItem class="u-p-t-20">
              <Button
                style="height: 50px;"
                long
                type="primary"
                class="register_btn"
                @click="handleSubmit('formMobile')"
                :loading="submitLoading">{{ $t('register.zc') }}</Button>
            </FormItem>
          </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getCountryList, sendMobileCode, sendEmailCode, register } from '@/api/user'
import { encryption } from '@/util/util'
export default {
  data() {
    // 邮箱号验证
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
      countryList: [],
      submitLoading: false,
      agree: true, // 勾选协议
      changeActive: 0,
      sendcodeValue: this.$t('register.fsyzm'),
      disPhoneCodeBtn: false,
      disEmailCodeBtn: false,
      formMobile: {
        mobile: "", // 手机号
        code: "", // 验证码
        areaCode: 1, // 国家地区区号
        password: "",
        sourceInviteCode: this.$route.query.ref || "", // 邀请码
      },
      formEmail: {
        email: "",
        code: "",
        password: "",
        sourceInviteCode: this.$route.query.ref || ""
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
        code: [
          {
            required: true,
            message: this.$t('register.qsrdx'),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('register.qsrdl'),
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: this.$t('register.mmcdbr'),
            trigger: "blur"
          }
        ],
      },
    };
  },
  computed: {
    ...mapState(['lang']),
    ...mapGetters(['isLogin']),
  },
  created () {
    window.scrollTo(0, 0);
    this.init();
  },
  methods: {
    init() {
      this.$store.commit("navigate", "nav-other");
      this.getCountryList()
    },
    /* 查询国家地区区号 */
    getCountryList() {
      getCountryList().then(res => {
        // console.log(res)
        this.countryList = res
      })
    },
    /* 发送手机验证码 */
    sendPhoneCode() {
      if (this.formMobile.mobile == '') {
        this.$Notice.warning({
            title: this.$t('publice.ts'),
            desc: this.$t('register.qsrsjh')
        })
        return
      }
      console.log(this.formMobile.areaCode)
      sendMobileCode({
        type: 2, // 注册：2
        areaCode: this.formMobile.areaCode, 
        mobile: this.formMobile.mobile
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('register.yzmfscg')
        })
        this.countDown(60, 'disPhoneCodeBtn')
      })
    },
    /* 发送邮箱验证码 */
    sendEmailCode() {
      if (this.formEmail.email == '') {
        this.$Notice.warning({
          title: this.$t('publice.ts'),
          desc: this.$t('register.qsryx')
        })
        return
      }
      sendEmailCode({
        type: 2,
        email: this.formEmail.email
      }).then(() => {
        this.$Notice.success({
          title: this.$t('publice.ts'),
          desc: this.$t('register.yzmfscg')
        })
        this.countDown(60, 'disEmailCodeBtn')
      })
    },
    /* 倒计时 */
    countDown(time, name) {
      if (time <= 0) {
        this[name] = false
        this.sendcodeValue = this.$t('register.fsyzm')
        return
      } else {
        this[name] = true
        this.sendcodeValue = `${this.$t('register.cxfs')}(${time})`
        time--
      }
      setTimeout(() => {
        this.countDown(time, name)
      }, 1000)
    },
    /* 切换手机注册 or 邮箱注册 */
    handleTab(index) {
      this.$refs['formMobile'] && this.$refs['formMobile'].resetFields()
      this.$refs['formEmail'] && this.$refs['formEmail'].resetFields()
      this.changeActive = index;
    },
    /* 提交注册 */
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 未勾选用户协议，提示
          if (!this.agree) {
            this.$Notice.info({
              title: this.$t('publice.ts'),
              desc: this.$t('register.qgx'),
            });
            return
          }
          
          const obj = encryption({
            data: name == 'formMobile'? this.formMobile : this.formEmail,
            key: 'thanks,metacloud',
            param: ['password']
          })
          console.log(obj)
          this.submitLoading = true
          register(
            obj
          ).then(res => {
            this.$Notice.success({
              title: this.$t('publice.ts'),
              desc: this.$t('register.zccg')
            })
            this.$router.push({
              path: '/login'
            })
            console.log(res)
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
::v-deep .ivu-input-prefix i, ::v-deep .ivu-input-suffix i {
  line-height: 50px;
}
.page-wrap {
  background-color: #000b23;
  min-height: calc(100vh - 54px);
}
.page-con {
  width: 492px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 4px;
  padding: 28px 70px;
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