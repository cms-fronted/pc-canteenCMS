<template>
  <div>
    <div class="card-balance">
      <div class="nav-title">饭卡余额查询</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <div class="select-title">
            <el-form :inline="true" :model="formdata" label-width="80px">
              <el-form-item label="部门">
                <el-select
                  v-model="formdata.department_id"
                  placeholder="请选择部门"
                >
                  <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="人员信息">
                <el-input
                  placeholder="请输入信息"
                  v-model="formdata.personnelInfo"
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号码">
                <el-input
                  placeholder="请输入手机号"
                  v-model="formdata.phone"
                ></el-input>
              </el-form-item>
              <el-form-item label="余额">
                <el-input
                  placeholder="请输入余额"
                  v-model="formdata.balance"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="btn-area">
            <el-button type="primary" @click="handleClear">一键清零</el-button>
            <el-button type="primary" @click="fetchTableList">查询</el-button>
            <el-button type="primary" @click="deriveData">导出</el-button>
          </div>
        </div>
        <div class="total" v-show="total > 0">
          <span
            >共有 <strong>{{ total }}</strong> 条记录</span
          >
        </div>
        <div class="main-content">
          <el-table
            style="width:100%"
            :data="tableData"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column
              label="员工编号"
              prop="employee_num"
            ></el-table-column>
            <el-table-column label="卡号" prop="card_num"></el-table-column>
            <el-table-column label="手机号码" prop="phone"></el-table-column>
            <el-table-column label="部门" prop="department"></el-table-column>
            <el-table-column label="余额" prop="balance"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
export default {
  data() {
    return {
      formdata: {
        department_id: "",
        personnelInfo: "",
        phone: "",
        balance: ""
      },
      departmentList: [],
      tableData: [
        {
          name: "张三",
          employee_num: "12345",
          card_num: "12345",
          phone: "136234567811",
          department: "后勤部",
          balance: "100"
        },
        {
          name: "李四",
          employee_num: "12345",
          card_num: "12345",
          phone: "136234567811",
          department: "后勤部1",
          balance: "400"
        },
        {
          name: "王五",
          employee_num: "12345",
          card_num: "12345",
          phone: "136234567811",
          department: "后勤部2",
          balance: "200"
        }
      ],
      total: 0,
      multipleSelection: []
    };
  },
  methods: {
    handleClear() {},
    fetchTableList() {},
    deriveData() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // 获取到对应的数据进行处理
    }
  }
};
</script>

<style lang="scss" scpoed>
.main-header {
  .select-title {
    float: left;
    width: 73%;
    display: flex;
    flex-wrap: wrap;
    .el-select {
      width: 200px;
    }
  }
  .btn-area {
    float: right;
    width: 27%;
    display: flex;
    flex-direction: column;
    display: block;
    .el-button {
      margin-bottom: 20px;
    }
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
.main {
  .total {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
