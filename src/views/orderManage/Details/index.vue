<template>
  <div class="details">
    <div class="nav-title">订餐明细</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <div class="select-title">
          <el-form :inline="true" :model="formdata">
            <el-form-item label="开始时间">
              <el-date-picker v-model="formdata.begin_time" style="width:200px" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="formdata.end_time" style="width:200px" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item label="餐次">
              <el-input placeholder="请输入餐次"></el-input>
            </el-form-item>
            <el-form-item label="消费地点">
              <el-input placeholder="请输入消费地点"></el-input>
            </el-form-item>
            <el-form-item label="部门">
              <el-select v-model="value" placeholder="请选择部门">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="人员信息">
              <el-input placeholder="请输入人员信息"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-area">
          <el-button type="primary">查询</el-button>
          <el-button type="primary">导出</el-button>
        </div>
      </div>
      <div class="main-content">
        <el-table style="width:100%" :data="tableData" border>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        name: "",
        phone: "",
        types: "",
        department: "",
        begin_time: "",
        end_time: "",
        status: "",
        goods_name: ""
      },
      value: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scpoed>
.main-header {
  .select-title {
    float: left;
    width: 90%;
    display: flex;
    flex-wrap: wrap;
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