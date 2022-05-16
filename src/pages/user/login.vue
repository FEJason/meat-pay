<template>
  <div class="page-wrap">
    <div class="page-con">
      <h1 class="u-m-b-30" v-text="$t('login.dl')">登录</h1>
      <Form ref="form" :model="form" :rules="rules">
        <FormItem prop="username">
          <Input type="text" v-model="form.username" :placeholder="$t('login.qsrs')" class="user"></Input>
        </FormItem>
        <FormItem prop="password" class="password">
          <Input type="password" password v-model="form.password" :placeholder="$t('login.qsrmm')" @on-keyup="onKeyup"></Input>
        </FormItem>
        <FormItem style="margin-bottom:15px;">
          <Button
            style="height: 50px;"
            type="primary" @click="handleSubmit('form')" long
              :loading="submitLoading">{{ $t('login.dl') }}</Button>
        </FormItem>
        <div class="u-flex u-row-between">
          <div>
            <span>{{ $t('login.myzh') }}</span>
            <router-link to="/register">{{ $t('login.ljzc') }}</router-link>
          </div>
          <router-link to="/reset-password" v-text="$t('login.zhmm')">找回密码</router-link>

        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
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
    }
  },
  created: function() {
    this.init();
  },
  // 在导航确认前被调用
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      // console.log('to', to)
      // console.log('from', from)
      // 记录上个页面路径
      vm.backPath = from.fullPath
    })
  },
  methods: {
    ...mapActions(['getUserInfo', 'getSecurity', 'getCertification', 'getAllNotRead']),
    ...mapMutations(['SET_ISLOGIN']),
    init() {
      this.$store.commit("navigate", "nav-other")
    },
    onKeyup(ev) {
      if (ev.keyCode == 13) {
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

              // 获取用户信息
              this.getUserInfo()
              // 获取用户安全信息
              this.getSecurity()
              // 实名信息
              this.getCertification()
              // 获取消息
              this.getAllNotRead()

              // 上个页面是注册 or 重置页面，跳转到首页
              if (this.backPath.indexOf('register') != -1 ||
                  this.backPath.indexOf('reset-password') != -1 ) {
                this.$router.push({
                  path: '/'
                })
              }
              // 返回上个页面
              else {
                this.$router.push(this.backPath)
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
  height: 429px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 4px;
  padding: 28px 70px;
}
</style>