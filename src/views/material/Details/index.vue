<template>
  <div class="details">
    <div class="nav-title">菜品材料明细</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <span class="content-header">公司：</span>
        <el-select v-model="value" placeholder="请选择" style="width:150px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span class="content-header">餐次：</span>
        <el-select v-model="value" placeholder="请选择" style="width:150px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" plain>查询</el-button>
        <el-button type="primary">添加</el-button>
      </div>
      <div class="main-content">
        <el-table></el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>