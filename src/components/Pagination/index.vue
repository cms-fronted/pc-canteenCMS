<template>
  <div class="pagination-container">
    <el-pagination
      :background="background"
      :total="total"
      :layout="layout"
      :current-page.sync="currentPage"
      @current-change="handleClickPage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props:{
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
    }
  },
  computed:{
    currentPage:{
      get(){
        return this.page;
      },
      set(val){
        this.$emit('update:page', val);
      }
    }
  },
  methods:{
    handleClickPage(val){
      this.$emit('pagination',val);
    }
  }
}
</script>

<style lang="scss" scpoed>
.pagination-container{
    width: 100%;
    display: flex;
    justify-content: center;
}
.el-pagination {
    margin-top: 15px;
}
</style>