<template>
  <div>
    <div class="order">
      <div class="nav-title">订单查询</div>
      <el-divideer></el-divideer>
      <div class="main">
        <div class="main-header">
          <el-form :model="queryform"></el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryform: {}
    };
  }
};
</script>

<style>
</style>