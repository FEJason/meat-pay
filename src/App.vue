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

// 全局样式
.u-content {
  width: 1200px;
  margin: 0 auto;
}

// 表格标题
.ivu-table-wrapper th {
  font-weight: normal;
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

/*自定义滚动条样式*/
// ::-webkit-scrollbar {
//   width: 6px;
//   background-color: transparent
// }

// ::-webkit-scrollbar-track {
//   background: transparent
// }

// ::-webkit-scrollbar-thumb {
//   border-radius: 4px;
//   background-color: #39557a
// }
</style>