<template>
  <div>
    <div class="header">
      <div class="con">申请中心</div>
    </div>
    <div class="con-wrap">
      <div class="con">
        <div class="top u-m-b-20 u-font-14">
          <span class="u-m-r-20">通过项目方资质认证即可申请上币</span>
          <router-link to="/login" v-if="!isLogin">
            <span>登录</span>
            <Icon type="ios-arrow-forward" />
          </router-link>
          <router-link to="/application" v-else>
            <span>去认证</span>
            <Icon type="ios-arrow-forward" />
          </router-link>
        </div>
        <div class="cen">
          <h3>上币说明及申请</h3>
          <p>为了提高项目方上币沟通效率，杜绝人为干预因素，火币推出自助上币平台，让项目方通过平台第一时间了解审核进展，补充上币材料，加快上币进程。<br/>
            Meta Life 自助上币平台同时针对Meta Life 主板和Meta Life 创业板的上币项目，Meta Life 主板更适合成熟项目，Meta Life 创业板更适合早期项目。项目方可根据自身项目进展选择Meta Life 主板或者Meta Life 创业板上币</p>
          <h3>Meta Life主板申请条件</h3>
          <p>为了保护投资者的利益，Meta Life主板会对资产进行评估，所有上线交易的品种需要满足如下条件，包含但不限于：</p>
          <p>
            ·项目提交资料齐全且准确<br/>
            ·无政策风险并且达到专业和合规要求<br/>
            ·达到SMARTChain区块链资产评级要求<br/>
            ·强有力的团队或社区维护<br/>
            ·有实际技术支撑或有实际应用的项目<br/>
            ·能真实及时披露项目信息包含项目白皮书，定期发展及进度报告<br/>
            ·交易平台关于上线币种交易的其他要求
          </p>

          <h3>Meta Life创业板申请条件</h3>
          <p>为了保护投资者的利益，Meta Life创业板上线的交易品种需要满足如下条件，包含但不限于：</p>
          <p>
            ·项目提交资料齐全且准确<br/>
            ·无政策风险并且达到专业和合规要求<br/>
            ·有专业资深投资机构的推荐<br/>
            ·强有力的社区支持<br/>
            ·有实际技术支撑或有实际应用的项目<br/>
            ·能真实及时披露项目信息包含项目白皮书，定期发展及进度报告<br/>
            ·交易平台关于上线币种交易的其他要求<br/>
          </p>

          <h3>币种下线说明</h3>
          <p>为保护投资者利益，Meta Life主板和Meta Life创业板保留项目下线或继续支持项目在平台上交易的权利，项目方如果触发如下条件，我们会公告通知交易下线，包含但不限于：</p>
          <p>
            ·项目方不更新周报，达八次以上的<br/>
            ·项目方故意隐瞒可能严重影响代币价格的重大事件<br/>
            ·项目涉嫌洗钱、欺诈或传销等违法犯罪活动的<br/>
            ·项目存在其他重大风险隐患如黑客盗币、隐瞒增发等，足以使项目发生风险事件的<br/>
            ·代币日平均交易额低于10万美金或其他等值代币，持续达三十日上<br/>
            ·项目方涉嫌操纵市场，情节严重的<br/>
            ·项目方宣传或市场行为损害火币创业板或社区利益，情节严重的<br/>
            ·项目方团队解散或发生成员异动<br/>
            ·其他足以退市的情形<br/>
          </p>

          <p class="u-p-t-20">Meta Life主板和Meta Life创业板会对触发下线条件的项目提前5天发出下线公告。自公告日起30天内，用户将该币种提币至个人数字资产钱包或其他交易平台账户。</p>
        
          <Button type="primary" disabled class="y-btn u-m-t-30">上币申请</Button>
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

    }
  },
  computed: {
    ...mapState(['isLogin'])
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