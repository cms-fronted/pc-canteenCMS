<template>
  <div>
    <div class="details">
      <div class="main">
        <div class="main-header">
          <div class="nav-title">消费明细</div>
          <el-divider></el-divider>
          <div class="select-title">
            <div v-for="o in 8" :key="o">
              开始
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="btn-area">
            <el-button type="primary">查询</el-button>
            <el-button type="primary">导出</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="序号" width="50"></el-table-column>
        <el-table-column prop="create_date" label="下单时间" width="180"></el-table-column>
        <el-table-column prop="place" label="消费地点"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="c_name" label="商品名称"></el-table-column>
        <el-table-column prop="num" label="商品数量"></el-table-column>
        <el-table-column prop="price" label="商品金额"></el-table-column>
        <el-table-column prop="deliver_way" label="配送方式"></el-table-column>
        <el-table-column prop="note" label="备注" width="300"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  }
};
</script>

<style lang="scss" scoped>
.details {
  .select-title {
    float: left;
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    .el-select {
      width: 50%;
    }
    div {
      margin-bottom: 5px;
      width: 25%;
    }
  }
  .btn-area {
    float: right;
    width: 10%;
    display: flex;
    flex-direction: column;
    display: block;
    .el-button {
      margin-bottom: 20px;
    }
  }
}
</style>