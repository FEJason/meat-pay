<template>
  <div>
    <div class="header">
      <div class="con">上币申请</div>
    </div>
    <div class="con-wrap">
      <div class="con">
        <div class="top u-m-b-20 u-font-14">
          <router-link to="/application-center">申请中心</router-link>
          <span class="u-m-r-20">
            <Icon type="ios-arrow-forward" />
            权限申请表单
          </span>
        </div>
        <div class="cen">
          <h3>权限申请表单</h3>
          <Form :model="formData" label-position="top">
            <Checkbox v-model="single">
              已阅读并遵守
              <router-link to="/">《项目展示和上币申请服务协议》</router-link>
            </Checkbox>
            <FormItem label="主体类型">
                <RadioGroup v-model="groupValue">
                    <Radio label="社区"></Radio>
                    <Radio label="基金会/公司" class="u-m-l-30"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="社区联系人的联系方式">
                <Input v-model="formData.input2" style="width: 500px"></Input>
            </FormItem>
            <FormItem label="项目代币简称（如：BTC）">
                <Input v-model="formData.input3" style="width: 500px"></Input>
            </FormItem>
            <FormItem label="公司名称（选填，只接受海外主体申请）">
                <Input v-model="formData.input3" style="width: 500px"></Input>
            </FormItem>
            <FormItem label="注册地（选填）">
                <Input v-model="formData.input3" style="width: 500px"></Input>
            </FormItem>
            <FormItem label="注册号（选填）">
                <Input v-model="formData.input3" style="width: 500px"></Input>
            </FormItem>
            <FormItem label="公司有效证件（营业执照）上传（选填）">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
            </FormItem>

            <div style="border-bottom: 2px solid #43527E" class="u-m-t-20 u-m-b-20"></div>

            <h3>项目主要负责人(至少3位)</h3>
            <div class="u-m-b-20" style="border: 1px solid #ddd; border-radius: 2px; padding: 20px" v-for="(item, i) in 3" :key="i">
              <FormItem label="手持身份证/护照/驾照上传">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
              </FormItem>
              <FormItem label="个人履历上传">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
              </FormItem>
              <FormItem label="个人履历上传">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
              </FormItem>
            </div>
            <div>
              <Button type="primary" class="y-btn u-m-t-30">添加主要负责人</Button>
            </div>

            <h3>项目技术主要负责人（CTO）</h3>
            <div style="border: 1px solid #ddd; border-radius: 2px; padding: 20px">
              <FormItem label="有效证件照片上传">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
              </FormItem>
              <FormItem label="个人履历上传">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
              </FormItem>
            </div>

            <h3>市场推广主要负责人（CIVO）</h3>
            <div style="border: 1px solid #ddd; border-radius: 2px; padding: 20px">
              <FormItem label="有效证件照片上传">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
              </FormItem>
              <FormItem label="个人履历上传">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
              </FormItem>
            </div>

            <h3>项目公司其他董事喝自然人股东（选填）</h3>
            <div class="u-m-b-30">
              <Button type="primary" class="y-btn">添加其他董事和自然人股东</Button>
            </div>

            <FormItem label="项目的公司银行账户开户行（选填）">
                <Input v-model="formData.input3" style="width: 500px"></Input>
            </FormItem>
            <FormItem label="项目的公司银行账户开户地址（选填）">
                <Input v-model="formData.input3" style="width: 500px"></Input>
            </FormItem>
            <FormItem label="项目的公司银行账户卡号（选填）">
                <Input v-model="formData.input3" style="width: 500px"></Input>
            </FormItem>
            <FormItem label="项目的代币智能合约地址（ERC20项目必">
                <Input v-model="formData.input3" style="width: 500px"></Input>
            </FormItem>
            <FormItem label="项目的代币智能合约地址（ERC20项目必备份">
                <Input v-model="formData.input3" style="width: 500px"></Input>
            </FormItem>
          </Form>
          

          <div>
            <Button type="primary" class="y-btn u-m-t-30" @click="submit">提交</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      groupValue: '社区',
      formData: {}
    }
  },
  computed: {
    ...mapState(['isLogin'])
  },
  methods: {
    submit() {
      this.$Notice.success({
        title: '提示',
        desc: "待接口开发"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
h3 {
  font-weight: bold !important;
  font-size: 18px;
  padding: 20px 0 8px 0;
}
p {
  line-height: 1.8;
}
.header {
  background-color: #202058;
  height: 80px;
  line-height: 80px;
  .con {
    width: 1200px;
    margin: 0 auto;
    color: #fff;
    font-size: 20px;
  }
}
.con-wrap {
    background-color: #F2F6FD;
    padding: 26px 0 100px 0;
  .con {
    width: 1200px;
    margin: 0 auto;
    border-radius: 4px;
    .top {
      background-color: #fff;
      padding: 20px 30px;
    }
    .cen {
      background-color: #fff;
      padding: 0 30px 20px;
      border-radius: 4px;
    }
  }
}
.y-btn {
  width: 200px;
  height: 48px;
}
// 禁用的btn
::v-deep .ivu-btn-primary[disabled] {
  background-color: #d1d3df !important;
  color: #fff !important;
}
</style>