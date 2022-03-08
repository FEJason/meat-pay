<template>
  <div class="search-select">
    <Dropdown
      trigger="click"
      placement="bottom-start"
      @on-click="onClick"
    >
      <div class="yjui-select">
        {{ value }}
        <Icon type="ios-arrow-down"></Icon>
      </div>
      <DropdownMenu slot="list">
        <li class="s-input" v-if="search">
          <Input
            prefix="ios-search"
            placeholder="搜索"
            v-model="searchValue"
            @on-change="onSearch"
          />
        </li>
        <slot></slot>
        <DropdownItem
          :class="{'on': value == item[props.label]}"
          :name="item[props.label]"
          v-for="(item, index) in list"
          :key="index"
          >{{ item[props.label] }}</DropdownItem
        >
        <DropdownItem v-show="notFound">未找到结果</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
/**
 * 自定义下拉组件，下拉带搜索框
 */
export default {
  props: {
    // 当前选择的值
    value: {
      type: String,
      default: ''
    },
    // 下拉列表
    data: {
      type: Array,
    },
    // 是否带搜索
    search: {
      type: Boolean,
      default: true
    },
    props: {
      type: Object
    }
  },
  computed: {
    list() {
      return this.data
    }
  },
  data() {
    return {
      notFound: false,
      searchValue: ''
    }
  },
  methods: {
    // 点击菜单项时触发, 返回 DropdownItem 的 name 值 
    onClick(val) {
      this.$emit('on-click', val)
    },
    // 搜索框 数据改变时触发
    onSearch() {
      this.list = this.data.filter(item => {
        return item.indexOf(this.searchValue.toUpperCase()) != -1
      })
      this.notFound = this.list.length == '' ? true : false
    }
  }
};
</script>

<style lang="scss" scoped>
// 自定义下拉搜索框
.search-select {
  ::v-deep .ivu-dropdown-item {
    // color: rgb(110, 122, 137);
  }
  .s-input {
    margin: 2px;
  }
  .yjui-select {
    cursor: pointer;
    border: 1px solid #dcdee2;
    padding: 6px 8px;
    border-radius: 4px;
    // color: #c5c8ce;
  }
  .on {
    background-color: #f3f3f3;
  }
}
</style>