<template>
  <div class="wrap">
    <div class="box">
      <div class="btn-wrap u-flex u-row-around">
        <span class="btn" :class="{'on': changeActive == 0}" @click="handleTab(0)">{{ $t('register.sjzc') }}</span>
        <span class="btn" :class="{'on': changeActive == 1}" @click="handleTab(1)">{{ $t('register.yxzc') }}</span>
      </div>
      <div class="form-con u-p-t-20">
        <!-- 手机注册 -->
        <Form ref="formMobile" :model="formMobile" :rules="rules" v-if="changeActive == 0">
          <div class="u-flex u-col-top">
            <Select v-model="formMobile.areaCode" filterable class="area u-m-r-8" placeholder="">
              <Option 
                :label="'+' + item.code"
                :value="item.code"
                v-for="(item, index) in countryList"
                :key="index">
                <span>+{{item.code}}</span>
                <span style="margin-left:10px;color:#ccc">{{item.name}}</span>
              </Option>
            </Select>
            <FormItem prop="mobile" class="phone">
              <Input type="text" v-model="formMobile.mobile" :placeholder="$t('register.sjhm')">
              </Input>
            </FormItem>
          </div>
          <FormItem prop="code">
            <Input type="text" v-model="formMobile.code" :placeholder="$t('register.dxyz')">
              <Button
                :disabled="disPhoneCodeBtn"
                slot="append"
                style="border: 1px solid #2d8cf0 !important; color: #2d8cf0"
                @click="sendPhoneCode">{{sendcodeValue}}</Button>
            </Input>
          </FormItem>
          <FormItem prop="password"  class="password">
            <Input type="password" v-model="formMobile.password" :placeholder="$t('register.dlmm')">
            </Input>
          </FormItem>
          <FormItem prop="repassword"  class="password">
            <Input type="password" v-model="formMobile.repassword" :placeholder="$t('register.qrmm')">
            </Input>
          </FormItem>
          <FormItem prop="sourceInviteCode" :label="$t('register.yqm')">
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
              long
              type="primary"
              class="register_btn"
              @click="handleSubmit('formMobile')"
              :disabled="phoneRegDis"
              :loading="submitLoading">{{ $t('register.zc') }}</Button>
          </FormItem>
        </Form>
        <!-- 邮箱注册 -->
        <Form ref="formEmail" :model="formEmail" :rules="rules" v-if="changeActive == 1">
          <FormItem prop="email" class="phone">
            <Input type="text" v-model="formEmail.email" :placeholder="$t('register.yxdz')">
            </Input>
          </FormItem>
          <FormItem prop="code">
            <Input type="text" v-model="formEmail.code" :placeholder="$t('register.yxyzm')">
              <Button slot="append" style="border: 1px solid #2d8cf0 !important; color: #2d8cf0"
                @click="sendEmailCode"
                :disabled="disEmailCodeBtn">{{sendcodeValue}}</Button>
            </Input>
          </FormItem>
          <FormItem prop="password"  class="password">
            <Input type="password" v-model="formEmail.password" :placeholder="$t('register.dlmm')">
            </Input>
          </FormItem>
          <FormItem prop="repassword2"  class="password">
            <Input type="password" v-model="formEmail.repassword2" :placeholder="$t('register.qrmm')">
            </Input>
          </FormItem>
          <FormItem prop="sourceInviteCode" :label="$t('register.yqm')">
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
            <Button type="primary" class="register_btn" @click="handleSubmit('formEmail')" long :disabled="emailRegDis"
              :loading="submitLoading" >{{ $t('register.zc') }}</Button>
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
    // 两次密码不一致
    const validatePs = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('register.qsrqr')));
      } else if (value !== this.formMobile.password) {
        callback(new Error(this.$t('register.lcmmsr')));
      } else {
        callback();
      }
    };
    const validatePs2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('register.qsrqr')));
      } else if (value !== this.formEmail.password) {
        callback(new Error(this.$t('register.lcmmsr')));
      } else {
        callback();
      }
    };
    return {
      countryList: [],
      submitLoading: false,
      agree: true, // 勾选协议
      changeActive: 0,
      sendcodeValue: this.$t('register.fsyzm'),
      disPhoneCodeBtn: false,
      disEmailCodeBtn: false,
      phoneRegDis: false,
      emailRegDis: false,
      formMobile: {
        mobile: "", // 手机号
        code: "", // 验证码
        areaCode: 1, // 国家地区区号
        password: "",
        repassword: "",
        sourceInviteCode: "YU7DE927", // 邀请码
      },
      formEmail: {
        email: "",
        code: "",
        password: "",
        repassword2: "",
        sourceInviteCode: "YU7DE927"
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
        repassword: [{ validator: validatePs, trigger: "blur" }],
        repassword2: [{ validator: validatePs2, trigger: "blur" }],
      },
    };
  },
  watch: {
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
            title: this.$t('register.qsrsjh')
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
          title: this.$t('register.yzmfscg')
        })
        this.countDown(60, 'disPhoneCodeBtn')
      })
    },
    /* 发送邮箱验证码 */
    sendEmailCode() {
      if (this.formEmail.email == '') {
        this.$Notice.warning({
          title: this.$t('register.qsryx')
        })
        return
      }
      sendEmailCode({
        type: 2,
        email: this.formEmail.email
      }).then(() => {
        this.$Notice.success({
          title: this.$t('register.yzmfscg')
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
      console.log(name)
      this.$refs[name].validate(valid => {
        if (valid) {
          // 未勾选用户协议，提示
          if (!this.agree) {
            this.$Notice.error({
              title: this.$t('register.qgx'),
            });
            return
          }
          
          const obj = encryption({
            data: name == 'formMobile'? this.formMobile : this.formEmail,
            key: 'thanks,metacloud',
            param: ['password']
          })
          if (name == 'formMobile') {
            delete obj.repassword
          } else {
            delete obj.repassword2
          }
          console.log(obj)
          this.submitLoading = true
          register(
            obj
          ).then(res => {
            this.$Notice.success({
              title: this.$t('register.zccg')
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
};
</script>

<style lang="scss" scoped>
.wrap {
  background: #0b1520 url(../../assets/images/login_bg.png) no-repeat center center;
  height: 760px;
  position: relative;
  overflow: hidden;
  .box {
    padding: 20px 30px;
    position: absolute;
    background: #17212e;
    width: 350px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-top: 4px solid #2d8cf0;
    border-radius: 5px;
    .btn-wrap {
      .btn {
        padding: 6px 15px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: color .2s linear, background-color .2s linear, border .2s linear, box-shadow .2s linear;
        &:hover {
          color: #2d8cf0;
        }
      }
      .on {
        color: #2d8cf0;
      }
    }
    .form-con {
      .area {
        flex: 1.2;
      }
      .phone {
        flex: 3;
      }
    }
  }
}
// 重置ui颜色
// 下拉背景色
::v-deep .ivu-select-dropdown {
  background-color: #212b36;
}
::v-deep .ivu-input-group-append, ::v-deep .ivu-input-group-prepend {
  background-color: transparent !important;
  border: none;
}
::v-deep .ivu-checkbox-checked .ivu-checkbox-inner {
  background-color: #2d8cf0 !important;
  border: 1px solid #2d8cf0 !important;
}
::v-deep .ivu-btn[disabled] {
  background-color: #27313e;
  color: #FFF;
}
</style>

