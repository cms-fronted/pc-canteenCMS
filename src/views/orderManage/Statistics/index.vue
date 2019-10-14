<template>
  <div>
    <div class="statistics">
      <div class="nav-title">订餐统计</div>
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
              <el-form-item label="公司">
              <el-select v-model="value" placeholder="请选择公司">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消费地点">
              <el-input placeholder="请输入消费地点"></el-input>
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
  </div>
</template>

<script>
export default {
  data(){
    return {
      formdata: {
        begin_time: "",
        end_time: "",
        place: ""
      },
      value: "",
      options: [
        {
          value: "公司1",
          label: "公司1"
        }
      ]
    }
  }
}
</script>

<style lang="scss" scpoed>
  .main-header{
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