<template>
  <div>
    <div class="card-balance">
      <div class="nav-title">饭卡余额查询</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header clearfix">
          <div class="select-title">
            <el-form :model="formdata" label-width="70px">
              <el-row>
                <el-col :span="6">
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
                </el-col>
                <el-col :span="6">
                  <el-form-item label="人员信息">
                    <el-input
                      placeholder="请输入信息"
                      v-model="formdata.user"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="手机号码">
                    <el-input
                      placeholder="请输入手机号"
                      v-model="formdata.phone"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- <el-form-item label="余额">
                <el-input placeholder="请输入余额" v-model="formdata.balance"></el-input>
              </el-form-item>-->
            </el-form>
          </div>
          <div class="btn-area" :class="{ grade: grade === 2 }">
            <el-button type="primary" @click="handleClear" v-if="grade === 2"
              >一键清零</el-button
            >
            <el-button type="primary" @click="fetchTableList">查询</el-button>
            <el-button type="primary" @click="exportFile">导出</el-button>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="total" v-show="total > 0">
          <span>
            共有
            <strong>{{ total }}</strong> 条记录
          </span>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border>
            <!-- <el-table-column
              type="selection"
              width="55">
            </el-table-column>-->
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="员工编号" prop="code"></el-table-column>
            <el-table-column label="卡号" prop="card_num"></el-table-column>
            <el-table-column label="手机号码" prop="phone"></el-table-column>
            <el-table-column label="部门" prop="department"></el-table-column>
            <el-table-column label="余额" prop="balance"></el-table-column>
          </el-table>
          <pagination
            v-if="total > 10"
            :total="total"
            :page.sync="current_page"
            @pagination="getList"
          ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import store from "@/store";
export default {
  data() {
    return {
      grade: store.getters.grade,
      formdata: {
        department_id: "",
        user: "",
        phone: "",
        balance: ""
      },
      departmentList: [],
      tableData: [
        /*  {name: "张三",employee_num:"12345",card_num:"12345",phone:"136234567811",department: "后勤部",balance:"100"},
        {name: "李四",employee_num:"12345",card_num:"12345",phone:"136234567811",department: "后勤部1",balance:"400"},
        {name: "王五",employee_num:"12345",card_num:"12345",phone:"136234567811",department: "后勤部2",balance:"200"}, */
      ],
      total: 0,
      detail: [],
      current_page: 1
    };
  },
  async created() {
    await this.fetchDepartmentList();
    await this.fetchTableList();
  },
  methods: {
    async fetchDepartmentList() {
      // 正确接口，没数据：https://tonglingok.com/canteen/api/v1/departments/recharge 测试接口：https://tonglingok.com/canteen/api/v1/departments?c_id=2
      await $axios
        .get("https://tonglingok.com/canteen/api/v1/departments/recharge")
        .then(res => {
          this.departmentList = res.data;
          if (this.departmentList.length > 1) {
            this.departmentList.unshift({ id: 0, name: "全部" });
            this.formdata.department_id = 0;
          }
        })
        .catch(err => console.log(err));
    },
    async handleClear() {
      await $axios
        .post("https://tonglingok.com/canteen/api/v1/wallet/clearBalance")
        .then(res => {
          this.fetchTableList();
        })
        .catch(err => console.log(err));
    },
    async exportFile() {
      await this.$exportExcel(
        "https://tonglingok.com/canteen/api/v1/wallet/users/balance/export",
        this.formdata
      );
    },
    async fetchTableList() {
      // page size user phone  department_id 部门id，全部传0
      // 返回的数据 res.data.data username code card_num phone department balance
      let { user, phone, department_id } = this.formdata;
      await $axios
        .get("https://tonglingok.com/canteen/api/v1/wallet/users/balance", {
          page: this.current_page,
          size: 10,
          user,
          phone,
          department_id
        })
        .then(res => {
          this.tableData = Array.from(res.data.data);
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    deriveData() {},
    getList(val) {
      this.current_page = val;
      this.fetchTableList();
    }
  },
  components: { Pagination }
};
</script>

<style lang="scss" scpoed>
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
// .main-header {
//   .select-title {
//     float: left;
//     width: 84%;
//     display: flex;
//     flex-wrap: wrap;
//     .el-select {
//       width: 200px;
//     }
//   }
//   .btn-area {
//     float: right;
//     width: 16%;
//     display: flex;
//     flex-direction: column;
//     display: block;
//     .el-button {
//       margin-bottom: 20px;
//     }
//   }
//   .select-title.grade {
//     width: 73%;
//   }
//   .btn-area.grade {
//     width: 27%;
//   }
// }
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
    // margin-top: 10px;
  }
}
</style>
