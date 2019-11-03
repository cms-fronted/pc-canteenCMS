<template>
  <div class="pagination-container">
    <el-pagination
      :small="small"
      :background="background"
      :total="total"
      :layout="layout"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      @current-change="handleClickPage"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    small: {
      type: Boolean,
      default: false
    },
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    background: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: "prev, pager, next"
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      }
    }
  },
  methods: {
    handleClickPage(val) {
      this.$emit("pagination", val);
    }
  }
};
</script>

<style lang="scss" scpoed>
.pagination-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.el-pagination {
  margin-top: 15px;
}
</style>