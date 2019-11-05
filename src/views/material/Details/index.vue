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
        <span class="content-header">消费地点：</span>
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
        <el-button type="primary">导出</el-button>
      </div>
      <div class="main-content">
        <el-table style="width:100%">
          <el-table-column label="序号"></el-table-column>
          <el-table-column label="餐次"></el-table-column>
          <el-table-column label="菜品"></el-table-column>
          <el-table-column label="操作"></el-table-column>
          <el-table-column label="材料名称"></el-table-column>
          <el-table-column label="单位"></el-table-column>
          <el-table-column label="数量"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ],
      value: ""
    };
  }
};
</script>

<style></style>
