<template>
  <div>
    <!-- 安全验证弹窗 -->
    <Modal
      class="detail"
      v-model="visible"
      width="480px"
      :title="$t('security.aqyz')"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="cancel"
    >
      <div class="detail-list">
        <Form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          label-position="top"
        >
          <!-- 邮箱验证码 -->
          <div v-if="securityInfo.emailSetting[1] || safeType == 8">
            <div class="u-p-b-10" style="color: #9aa5b5">
              {{ $t('security.hqbsr') }} {{ securityInfo.email }} {{ $t('security.sddyzm') }}
            </div>
            <FormItem :label="$t('security.yxyzm')" prop="emailCode">
              <Input v-model="formValidate.emailCode" size="large">
                <div class="timebox" slot="append">
                  <Button
                    type="text"
                    size="default"
                    @click="send(safeType, 'uCodeEmail', 'disabled')"
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
          </div>
          <!-- 手机验证码 -->
          <div v-if="securityInfo.mobileSetting[1] || safeType == 7">
            <div class="u-p-b-10" style="color: #9aa5b5">
              {{ $t('security.hqbsrsj') }} {{ securityInfo.mobile }} {{ $t('security.sddyzm') }}
            </div>
            <FormItem :label="$t('security.sjyzm')" prop="mobileCode">
              <Input v-model="formValidate.mobileCode" size="large">
                <div class="timebox" slot="append">
                  <Button
                    type="text"
                    size="default"
                    @click="send(safeType, 'uCodeMobile', 'disabled2')"
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
          </div>
          <!-- 资金密码 -->
          <!-- 37 - 提币 -->
          <div v-if="securityInfo.tradeSetting[0] && safeType == 37">
            <FormItem :label="$t('security.zjmm')" prop="password">
              <Input v-model="formValidate.password" type="password" size="large"></Input>
            </FormItem>
          </div>
          <!-- 谷歌验证码 -->
          <div v-if="securityInfo.googleSetting[1] || safeType == 9">
            <FormItem :label="$t('security.ggyzm')" prop="googleAuthCode">
              <Input v-model="formValidate.googleAuthCode" size="large"></Input>
            </FormItem>
          </div>
          <div class="u-text-right">
            <Button type="text" @click="cancel">{{
              $t('publice.qx')
            }}</Button>
            <Button
              type="primary"
              :loading="loading"
              @click="handleSubmit('formValidate', safeType)"
              >{{  $t('publice.qd') }}</Button
            >
          </div>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
/**
 * 安全验证弹窗组件
 * 【Attributes 参数】
 *  value - 是否显示，可使用 v-model 双向绑定
 *  loading - 确认按钮loading
 *  safeType - 传给后端的 type
 * 【Events 事件】
 *  submit - 确认提交回调 submit(name, type, this.formValidate)
 */
import { sendCode } from '@/api/user'
import uVerificationCode from '@/components/u-verification-code/u-verification-code'
import { mapState } from 'vuex'
export default {
  name: 'safeModal',
  components: {
    uVerificationCode
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    safeType: {
      type: Number
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeTips: '',
      timeTips200: '',
      visible: this.value,
      // securityInfo: {
      //   mobileSetting: [false, false, false],
      //   emailSetting: [false, false, false],
      //   googleSetting: [false, false, false],
      //   tradeSetting: [false],
      //   loginSetting: [true],
      //   mobile: '',
      //   email: ''
      // },
      formValidate: {
        emailCode: '',
        mobileCode: '',
        googleAuthCode: '',
        password: ''
      },
      ruleValidate: {
        googleAuthCode: [
          {
            required: true,
            message: this.$t('security.qsrggyzm'),
            trigger: 'blur'
          }
        ],
        emailCode: [
          {
            required: true,
            message: this.$t('uc.safe.codetip'),
            trigger: 'blur'
          }
        ],
        mobileCode: [
          {
            required: true,
            message: this.$t('uc.safe.codetip'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('security.qsrzjmm'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val
      if (val) {
        this.clearForm()
      }
    }
  },
  created() {
    // 查询用户安全认证
    // this.getSecurity()
  },
  computed: {
    ...mapState(['securityInfo']),
  },
  methods: {
    /* 打开弹窗，清空表单、重置倒计时 */
    clearForm() {
      this.$refs.uCodeEmail && this.$refs.uCodeEmail.reset()
      this.$refs.uCodeMobile && this.$refs.uCodeMobile.reset()

      this.formValidate = {
        emailCode: '',
        mobileCode: '',
        googleAuthCode: '',
        password: ''
      }
    },
    /* 表单效验 */
    handleSubmit(name, type) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$emit('submit', name, type, this.formValidate)
        }
      })
    },
    /* 点击取消 */
    cancel() {
      this.$emit('input', false)
      this.$emit('cancel')
    },
    /* 发送短信验证码 */
    send(index, countName, disName) {
      // 开始倒计时、禁用button
      countName && this.$refs[countName].start()
      disName && (this.formValidate[disName] = true)
      sendCode({
        verifyType: index,
        isMobile: countName == 'uCodeEmail' ? false : true
      })
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
  }
}
</script>

<style>
</style>