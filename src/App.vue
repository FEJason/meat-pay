<template>
  <router-view></router-view>
</template>
<script>
export default {
  
}
</script>
<style lang="scss">
@import '~@/assets/css/main.scss';
@import '~@/assets/css/h5.scss';


// 引入金额字体
@font-face {
	font-family: 'payfont';
	font-display: swap;
	src: url('./assets/fonts/DINPro-Medium.ttf') format('truetype')
}
.pay-font {
	font-family: payfont,Arial,sans-serif !important;
}

// 全局样式
.u-content {
  width: 1200px;
  margin: 0 auto;
}

// 去除text Button背景
.ivu-btn-text:hover {
  color: #57a3f3;
  background-color: transparent !important;
}
.ivu-btn-text:focus {
  box-shadow: none !important;
}

// 表格标题
.ivu-table-wrapper th {
  font-weight: normal;
}
.ivu-table-header thead tr th {
  font-size: 12px !important;
}

// 去除表单必填时，显示红色 * 号
.ivu-form-item-required .ivu-form-item-label:before {
  content: "" !important;
  margin-right: 0 !important;
}

// 去除表格边框
.ivu-table-wrapper {
  border: none !important;
}
.ivu-table:after {
  width: 0 !important;
}
.ivu-table:before {
  background-color: #fff !important;
}

// 修改表格title样式
.ivu-table th {
  background-color: transparent !important;
  color: #9aa5b5;
}
.ivu-table td, .ivu-table th {
  height: 60px !important;
}

// 去除弹窗头部下边框
.ivu-modal-header {
  border-bottom: none !important;
}

// 修改气泡提示样式
.ivu-poptip-title {
  text-align: center;
  &:after {
    height: 0 !important;
  }
}
.ivu-poptip-body {
  padding: 0 !important;
}
.ivu-poptip, .ivu-poptip-rel {
  display: block !important;
}

// 表单label
.ivu-form .ivu-form-item-label {
  font-size: 12px !important;
}
.ivu-form-label-top .ivu-form-item-label {
  padding-bottom: 4px !important;
}
.ivu-form-item-error-tip {
  font-size: 12px !important;
  padding-top: 2px !important;
}
.ivu-form-item {
  margin-bottom: 18px !important;
}
/*自定义滚动条样式*/
::-webkit-scrollbar {
    width: 6px;
    background-color: transparent
}

::-webkit-scrollbar-track {
    background: 0 0
}

::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #e5ebf5
}
</style>