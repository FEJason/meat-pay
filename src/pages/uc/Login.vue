<template>
  <div class="login_form">
    <div class="login_right">
      <Form ref="form" :model="form" :rules="rules">
        <div class="login_title">{{ $t('login.dl') }}</div>
        <FormItem prop="username">
          <Input type="text" v-model="form.username" :placeholder="$t('login.qsrs')" class="user">
          </Input>
        </FormItem>
        <FormItem prop="password" class="password">
          <Input type="password" v-model="form.password" :placeholder="$t('login.qsrmm')" @on-keyup="onKeyup">
          </Input>
        </FormItem>
        <!-- <p id="notice" class="hide">{{$t('uc.login.validatemsg')}}</p> -->
        <p style="height:30px;">
          <!-- <router-link to="/findPwd" style="color:#979797;float:right;padding-right:10px;font-size:12px;">
            {{$t('uc.login.forget')}}
          </router-link> -->
        </p>
        <FormItem style="margin-bottom:15px;">
          <Button type="primary" @click="handleSubmit('form')" long
              :loading="submitLoading">{{ $t('login.dl') }}</Button>
        </FormItem>
        <div class='to_register'>
          <span>{{ $t('login.myzh') }}</span>
          <router-link to="/register">{{ $t('login.ljzc') }}</router-link>
        </div>
      </Form>

    </div>
  </div>
</template>
<style scoped lang="scss">
.login_title{
  height: 70px;
  text-align: center;
  font-size: 20px;
  color: #fff;
}
/* 验证码 */
.login_form {
  background: #0b1520 url(../../assets/images/login_bg.png) no-repeat center center;
  height: 760px;
  position: relative;
  overflow: hidden;
  .login_right {
    padding: 20px 30px 20px 30px;
    position: absolute;
    background: #17212e;
    width: 350px;
    height: 330px;
    left: 50%;
    top: 50%;
    margin-left: -175px;
    margin-top: -165px;
    border-top: 4px solid #2d8cf0;
    border-radius: 5px;
    form.ivu-form.ivu-form-label-right.ivu-form-inline {
      
      .ivu-form-item {
        .ivu-form-item-content {
          .login_btn.ivu-btn {
            width: 100%;
            background-color: #2d8cf0;
            outline: none;
            border-color: #2d8cf0;
            color: #fff;
            font-size: 18px;
            border-radius: 5px;
            &:focus {
              -moz-box-shadow: 0px 0px 0px #fff, 0px 0px 0px #fff;
              -webkit-box-shadow: 0px 0px 0px #fff, 0px 0px 0px #fff;
              box-shadow: 0px 0px 0px #fff, 0px 0px 0px #fff;
            }
          }
        }
      }
    }
  }
  .to_register {
    overflow: hidden;
    font-size: 12px;
    span {
      float: left;
    }
    a {
      float: right;
      color: #2d8cf0;
    }
  }
}
#captcha {
  width: 100%;
  display: inline-block;
}
.show {
  display: block;
}
.hide {
  display: none;
}
#notice {
  color: red;
}
#wait {
  text-align: left;
  color: #666;
  margin: 0;
}
.geetest_wait_dot geetest_dot_1 {
  color: red;
}
.user .ivu-btn,
.ivu-btn:active,
.ivu-btn:focus {
  border-color: #d7dde4;
  box-shadow: none;
}
/*  */
</style>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { encryption } from '@/util/util'
import { login } from '@/api/user'
export default {
  data() {
    return {
      backPath: '', // 上个页面路径
      submitLoading: false,
      form: {
        username: "",
        password: "",
        grant_type: 'password'
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('login.qsrzh'),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('login.qsrmm'),
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: this.$t('login.mmcd'),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created: function() {
    this.init();
  },
  computed: {
    // ...mapState(['']),
    ...mapGetters(['isLogin']),
  },
  // 在导航确认前被调用
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      console.log('to', to)
      console.log('from', from)
      // 记录上个页面路径
      vm.backPath = from.fullPath
    })
  },
  methods: {
    ...mapMutations(['SET_ISLOGIN']),
    init() {
      this.$store.commit("navigate", "nav-other");
      // this.$store.state.HeaderActiveName = "0";

      if (this.isLogin) {
        // this.$router.push("/uc/safe");
      } else {
        // this.initGtCaptcha();
      }
    },
    onKeyup(ev) {
      if (ev.keyCode == 13) {
        // $(".login_btn").click();
        this.handleSubmit()
      }
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log(this.form)
          const obj = encryption({
            data: this.form,
            key: 'thanks,metacloud',
            param: ['password']
          })
          this.submitLoading = true
          // login 返回数据结构不同，没有使用拦截器
          login(obj).then(res => {
            if (res.status == 200) {
              this.$Notice.success({
                title: this.$t('publice.ts'),
                desc: this.$t('login.dlcg')
              })
              this.SET_ISLOGIN(res.data.access_token)
              // 登录后跳转到上一个路由（排除注册）
              console.log('backPath', this.backPath)
              if (this.backPath.indexOf('register') != -1) {
                this.$router.push({
                  path: '/'
                })
              } else {
                this.$router.go(-1)
              }
            }
          }).catch(error => {
            // 状态码
            let status = error.response.status
            // 接口返回的 data
            let data = error.response.data

            if (status !== 200 || data.code === 1) {
              this.$Notice.error({
                title: '提示',
                desc: data.msg
              })
            }
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.login_form {
  .login_right {
    form.ivu-form.ivu-form-label-right.ivu-form-inline {
      .ivu-form-item {
        .ivu-form-item-content {
          .ivu-input-wrapper.ivu-input-type {
            .ivu-input {
              background-color:transparent;
              font-size: 14px;
              border: none;
              border-bottom: 1px solid #27313e;
              border-radius:0;
              // color:#fff;
              &:focus {
                border: none;
                border-bottom: 1px solid #27313e;
                -moz-box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;
                -webkit-box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;
                box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;
              }
            }
          }
        }
      }
    }
  }
}

.ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
  padding-right: 10px;
  padding-left: 3px;
}
.ivu-select-single .ivu-select-selection .ivu-select-arrow{
  right: 2px;
}

.ivu-form-item-error .ivu-input-group-append, .ivu-form-item-error .ivu-input-group-prepend{
  background-color: #17212e;
  border-color: transparent;
}
.ivu-form-item-error .ivu-select-arrow{
  color: #808695;
}

.login_right .ivu-select-dropdown{
  background: #1c2a32;
}
</style>
<style>
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
    padding-right: 20px;
  }
  .ivu-select-arrow{
    right: 4px;
  }

  .ivu-select-item span:first-child{
    display: inline-block;
    width: 30px;
    text-align: left;
  }
</style>
