<template>
  <div class="page-wrap">
    <div class="title">
      <h2>认证广告方申请</h2>
      <p>成为Expay认证广告方，获得广告发布权限，享受更多权限</p>
    </div>
    <div class="icon-wrap">
      <Row :gutter="16">
        <Col span="8">
          <div class="card">
            <img src="@/assets/img/application-01.png" alt="img" style="width: 100px; height: 100px;">
            <h3 class="u-font-20">广告发布权限</h3>
            <p>广告方可以自由发布广告，买卖更灵活，更便捷</p>
          </div>
        </Col>
        <Col span="8">
          <div class="card">
            <img src="@/assets/img/application-02.png" alt="img" style="width: 100px; height: 100px;">
            <h3 class="u-font-20">专属标识</h3>
            <p>广告方专属认证标识，增强交易方信任</p>
          </div>
        </Col>
        <Col span="8">
          <div class="card">
            <img src="@/assets/img/application-03.png" alt="img" style="width: 100px; height: 100px;">
            <h3 class="u-font-20">一对一服务</h3>
            <p>我们针对广告方提供一对一服务，提高交易效率</p>
          </div>
        </Col>
      </Row>
    </div>
    <div class="card-wrap u-flex u-row-between u-m-t-20">
      <div class="left u-flex-1">
        <p>{{ (certificationInfo && certificationInfo.cardName) || userInfo.username }}</p>
        <div class="u-flex u-m-t-16">
          <div class="u-flex-1">
            <p>所在国家/地区</p>
            <div class="u-flex u-m-t-16">
              <span>{{ (certificationInfo && certificationInfo.country) || '请先完成实名认证' }}</span>
            </div>
          </div>
          <!-- <div class="u-flex-1">
            <p>可发布的法币</p>
            <div class="u-flex u-m-t-16">
              <img src="" alt="">
              <span>CNY</span>
            </div>
          </div> -->
        </div>
      </div>
      <div class="right u-flex-1">
        <p>申请条件</p>
        <div class="u-flex u-row-between u-m-t-8">
          <div>
            <Icon type="md-checkmark-circle" size="16" color="#0ecb81" v-if="bindMobileAndEmail"/>
            <Icon type="md-close-circle" size="16" color="#f6465d" v-else/>
            <span>完成手机号及邮箱绑定</span>
          </div>
          <div class="u-flex" v-if="!bindMobileAndEmail">
            <Icon type="md-refresh" size="20" class="u-m-r-10"/>
            <Button type="primary" size="small" to="/security">去绑定</Button>
          </div>
        </div>
        <div class="u-flex u-row-between u-m-t-6">
          <div>
            <Icon type="md-checkmark-circle" size="16"  color="#0ecb81" v-if="certificationInfo"/>
            <Icon type="md-close-circle" size="16" color="#f6465d" v-else/>
            <span>完成身份验证</span>
          </div>
          <div class="u-flex" v-if="!certificationInfo">
            <Icon type="md-refresh" size="20" class="u-m-r-10"/>
            <Button type="primary" size="small" to="/security">去验证</Button>
          </div>
        </div>
        <div class="u-flex u-row-between u-m-t-6">
          <div>
            <Icon type="md-checkmark-circle" size="16" color="#0ecb81" v-if="isGreater"/>
            <Icon type="md-close-circle" size="16" color="#f6465d" v-else/>
            <span>资金账户USDT数量至少大于等于15000</span>
          </div>
          <div class="u-flex" v-if="!isGreater">
            <Icon type="md-refresh" size="20" class="u-m-r-10"/>
            <Button type="primary" size="small">去充值</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="u-text-center u-m-t-20">
      <Button
        type="primary" style="width: 334px" size="large"
        :loading="loading"
        :disabled="isDisabled"
        @click="applicationShow = true">立即申请</Button>
    </div>

    <Modal
      v-model="applicationShow"
      title="认证广告方申请"
      :mask-closable="false"
      :footer-hide="true"
      width="800px"
    >
      <div class="u-p-l-60 u-p-r-60" style="min-height: 500px">
        <div>
          <Steps :current="stepsCurrent">
            <Step title="填写资料"></Step>
            <Step title="录制视频"></Step>
            <Step title="等待结果"></Step>
          </Steps>
        </div>

        <div v-if="stepsCurrent == 0">
          <Form
            class="u-p-t-40"
            ref="formApply"
            :model="formApply"
            :rules="rules"
            :label-width="136"
            >
            <FormItem label="商家昵称" prop="storeName">
              <Input v-model="formApply.storeName" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="联系方式" prop="concat">
              <Input v-model="formApply.concat" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="总计划投入 (CNY)" prop="planInvestment">
              <Input v-model="formApply.planInvestment" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="总数字货币 (USDT)" prop="totalDigitalCurrency">
              <Input v-model="formApply.totalDigitalCurrency" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="微信" prop="wechat">
              <Input v-model="formApply.wechat" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="Facebook (选填)" prop="facebook">
              <Input v-model="formApply.facebook" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="Twitter (选填)" prop="twitter">
              <Input v-model="formApply.twitter" placeholder="请输入"></Input>
            </FormItem>
            <!-- <FormItem label="资产截图">
              <Upload action="//jsonplaceholder.typicode.com/posts/">
                <Button icon="ios-cloud-upload-outline">选择图片</Button>
              </Upload>
            </FormItem> -->

            <div class="u-text-right">
              <!-- <Button type="text" @click="formApply = false">{{ $t('publice.qx') }}</Button> -->
              <Button
                type="primary"
                @click="handleNext('formApply')"
                class="u-m-l-8"
                >下一步</Button
              >
            </div>
          </Form>
        </div>

        <div v-if="stepsCurrent == 1">
          <div class="u-m-t-70">
            <Upload
              type="drag"
              accept="video/*"
              action="//jsonplaceholder.typicode.com/posts/">
              <div style="padding: 20px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p class="u-p-b-10">点击或者拖拽文件到此上传</p>
                  <Button type="primary">点击上传</Button>
              </div>
            </Upload>
            
          </div>
          <h3 class="u-m-t-40">录制视频：</h3>
          <p>请手持身份证正面照，并按照下面文字进行朗读，录制音频的视频通过邮箱形式发送到 8888@gmaill.com 中进行验证。</p>
          <h3 class="u-m-t-20">朗读文字：</h3>
          <p>本人（xxx)，身份证号（89899xxx)，承诺我的资金来源合法可靠，自愿进行比特币等数字货币资产交易，并且已充分了解数字货币投资交易的风险，本人具有抗风险的能力并愿意承担一切风险</p>
          <div class="u-text-right u-m-t-80">
            <Button type="text" @click="stepsCurrent = 0">上一步</Button>
            <Button
              type="primary"
              @click="handleSubmit('formApply')"
              :loading="applyLoading"
              class="u-m-l-8"
              >下一步</Button
            >
          </div>
        </div>

        <div class="three-wrap u-text-center" v-if="stepsCurrent == 2">
          <img src="@/assets/img/submit.png" alt="icon" style="width: 141px;">
          <p>已提交，请等待审核</p>
          <Button type="primary" class="u-m-t-50">返回首页</Button>
        </div>

      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { getAssetList } from '@/api/finance'
import { merchantApply } from '@/api/myads'
export default {
  data() {
    return {
      stepsCurrent: 2,
      formApply: {},
      rules: {
        storeName: [
          { required: true, message: '请输入', trigger: "blur" }
        ],
        concat: [
          { required: true, message: '请输入', trigger: "blur" }
        ],
        planInvestment: [
          { required: true, message: '请输入', trigger: "blur" }
        ],
        totalDigitalCurrency: [
          { required: true, message: '请输入', trigger: "blur" }
        ],
        wechat: [
          { required: true, message: '请输入', trigger: "blur" }
        ]
      },
      applyLoading: false,
      applicationShow: true,
      isDisabled: true,
      loading: false,
      assetList: [{balance: 0}]
    }
  },
  computed: {
    ...mapState(['certificationInfo', 'userInfo', 'securityInfo']),
    bindMobileAndEmail() {
      return this.securityInfo.emailSetting[0] && this.securityInfo.mobileSetting[0]
    },
    isGreater() {
      return this.assetList[0].balance >= 15000
    }
  },
  created() {
    this.getAssetList()
  },
  methods: {
    /* 第一步 */
    handleNext(name) {
      console.log(JSON.parse(JSON.stringify(this.formApply)))
      // return
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.stepsCurrent = 1
        }
      })
    },
    /* 第二步 */
    handleSubmit() {
      this.applyLoading = true
      merchantApply({
        ...this.formApply,
        // 视频认证 路径 必填
        "videoProve": "/and/123123",
        // 资产截图 路径 必填
        "assetsProve": "abc",
      }).then(() => {
        this.stepsCurrent = 2
      }).finally(() => {
        this.applyLoading = false
      })
    },
    /* 获取资产列表 */
    getAssetList() {
      getAssetList('otc').then(res => {
        this.assetList = res.filter(item => {
          return item.currencyName == 'USDT'
        })
        this.assetList = [{balance: 15000}] // 调试
        if (this.bindMobileAndEmail && this.certificationInfo && this.isGreater) {
          this.isDisabled = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ivu-btn-primary[disabled] {
  border: none;
}
.page-wrap {
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 300px;
}
.title {
  text-align: center;
  padding-top: 40px;
  h2 {
    font-size: 32px;
    font-weight: bold !important;
  }
  p {
    font-size: 16px;
  }
}
.icon-wrap {
  margin-top: 80px;
  .card {
    text-align: center;
    border-radius: 10px;
    padding: 60px 16px 32px;
    background: #F9FAFC;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      top: -40px;
      transform: translateX(-50%);
    }
  }
}
.card-wrap {
  width: 100%;
  .left, .right {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 24px 10px;
    height: 166px;
  }
  .left {
    
  }
  .right {
    margin-left: 10px;
  }
}
.three-wrap {
  padding-top: 129px;
}
</style>