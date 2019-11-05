<template>
  <div>
    <div class="operation">
      <div class="nav-title">操作日志查询</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <div class="select-title">
            <el-form :inline="true" :model="formdata" label-width="60px">
              <el-form-item label="开始">
                <el-date-picker
                  v-model="formdata.time_begin"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:200px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束">
                <el-date-picker
                  v-model="formdata.time_end"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:200px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-input
                class="filter-input"
                v-model="filterText"
                placeholder="输入关键信息"
                style="width:200px;margin: 0 20px;"
              ></el-input>
              <el-button type="primary" @click="fetchTableList">查询</el-button>
            </el-form>
          </div>
        </div>
        <div class="total" v-show="total > 0">
          <span
            >共有 <strong>{{ total }}</strong> 条记录</span
          >
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border>
            <el-table-column label="序号" prop="order_num"></el-table-column>
            <el-table-column label="操作时间" prop="time"></el-table-column>
            <el-table-column label="操作明细" prop="details"></el-table-column>
            <el-table-column label="操作员" prop="operator"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 序号 order_num 操作时间 time  操作明细 details 操作员 operator 备注 remark
export default {
  data() {
    return {
      filterText: "",
      formdata: {
        time_begin: "",
        time_end: ""
      },
      tableData: [
        {
          order_num: "1",
          time: "2019-05-25 12:00:12",
          details: "张三从A部门移动到B部门",
          operator: "张三",
          remark: ""
        },
        {
          order_num: "2",
          time: "2019-05-26 12:00:12",
          details: "C部门已删除",
          operator: "李四",
          remark: ""
        },
        {
          order_num: "3",
          time: "2019-05-27 12:00:12",
          details: "密码已重设",
          operator: "王五",
          remark: ""
        }
      ],
      total: 0
    };
  },
  methods: {
    fetchTableList() {}
  }
};
</script>

<style lang="scss" scpoed>
.main {
  .total {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    margin-top: 10px;
  }
}
.main-content {
  .el-table {
    th,
    td {
      text-align: center;
    }
  }
}
</style>
