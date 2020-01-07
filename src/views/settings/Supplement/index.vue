<template>
  <div>
    <div class="supplement">
      <div class="nav-title">补录管理</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
<!--          <div class="select-title">-->
            <span class="content-header">人员信息</span>
            <el-input
              class="filter-input"
              v-model="key"
              placeholder="输入人员信息"
              style="width:200px"
            ></el-input>
            <el-button type="primary" @click="queryList" style="margin-left:10px">查询</el-button>
            <el-upload
              class="upload-excel upload"
              ref="upload"
              :limit="limit"
              :headers="header"
              :show-file-list="false"
              accept=".xls,.xlsx"
              action="http://canteen.tonglingok.comhttp://canteen.tonglingok.com/api/v1/wallet/supplement/upload"
              :on-success="handleSuccess"
              :on-error="handleError"
              name="supplement"
            >
              <el-button type="primary" style="margin-left:10px">批量补录</el-button>
            </el-upload>
<!--          </div>-->
        </div>
        <div class="main-content">
          <el-table
            style="width:100%"
            :data="tableData"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="公司" prop="company"></el-table-column>
            <!-- <el-table-column label="归属饭堂" prop="canteen"></el-table-column> -->
            <el-table-column label="部门" prop="department"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="员工编号" prop="code"></el-table-column>
            <el-table-column label="卡号" prop="card_num"></el-table-column>
          </el-table>
          <pagination
            v-show="total > 10"
            :total="total"
            :page.sync="current_page"
            @pagination="getList"
          ></pagination>
          <div class="supply-form">
            <el-form :inline="true" :model="formdata" label-width="80px">
              <el-form-item label="公司" v-if="companiesVisible">
                <el-select
                  v-model="company_ids"
                  @change="getCanteenList"
                  style="width:200px"
                  placeholder="请选择公司"
                  filterable
                >
                  <el-option
                    v-for="item in companiesList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消费地点">
                <el-select
                  v-model="formdata.canteen_id"
                  style="width:200px"
                  placeholder="请选择消费地点"
                  @change="getDinnersList"
                >
                  <el-option
                    v-for="item in canteenList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消费日期">
                <el-date-picker
                  v-model="formdata.consumption_date"
                  style="width:200px"
                  type="datetime"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="消费餐次">
                <el-select
                  v-model="formdata.dinner_id"
                  style="width:200px"
                  placeholder="请选择消费餐次"
                >
                  <el-option
                    v-for="item in dinnersList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消费金额">
                <el-input
                  placeholder="请输入消费金额"
                  v-model="formdata.money"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  placeholder="请输入备注"
                  v-model="formdata.remark"
                ></el-input>
              </el-form-item>
              <div class="radio-area">
                <el-radio v-model="formdata.type" label="1">补充</el-radio>
                <el-radio v-model="formdata.type" label="2">补扣</el-radio>
              </div>
            </el-form>
            <div class="btn-area">
              <el-button type="primary">取消</el-button>
              <el-button type="primary" @click="confirmSupplement"
                >确定</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import uploadDialog from "./dialog";
import store from "@/store";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
export default {
  data() {
    return {
      grade: store.getters.grade,
      grade: 3,
      key: "",
      company_ids: "",
      companiesList: [],
      tableData: [
        /* { id: 1, company: "A企业", department: "后勤部", username: "张三三", code: "aaaaaaaa", card_num: "122324"},
        { id: 2, company: "B企业", department: "后勤部", username: "李四", code: "aaaaaaaa", card_num: "122324" }, */
      ],
      formdata: {
        canteen_id: "",
        consumption_date: "",
        dinner_id: "",
        money: "",
        remark: "",
        type: "1",
        staff_ids: ""
      },
      canteenList: [],
      dinnersList: [],
      limit: 1,
      header: {
        token: store.getters.token
      },
      total: 0,
      current_page: 1
    };
  },
  created() {
    if (this.companiesVisible) {
      this.getCompanies();
    } else {
      this.fetchCanteenList();
    }
  },
  computed: {
    companiesVisible() {
      return this.grade !== 3;
    }
  },
  components: { Pagination },
  methods: {
    sendMessage(msg) {
      if (msg === "ok") {
        this.$message({
          type: "success",
          message: "已成功进行补录!"
        });
      } else {
        this.$message({
          type: "info",
          message: "操作失败"
        });
      }
    },
    queryList() {
      console.log(this.current_page);
      $axios
        .get(
          `http://canteen.tonglingok.com/api/v1/department/staffs/recharge?page=${
            this.current_page
          }&size=10&department_id=0&key=${this.key}`
        )
        .then(res => {
          this.tableData = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    getCompanies() {
      $axios
        .get("http://canteen.tonglingok.com/api/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          let allCompanies = [];
          let companiesList = flatten(arr);
          this.companiesList = companiesList;
        })
        .catch(err => console.log(err));
    },
    getCanteenList(val) {
      this.fetchCanteenList(val);
      this.formdata.dinner_id = "";
      this.formdata.canteen_id = "";
    },
    fetchCanteenList(company_id) {
      if (company_id) {
        $axios
          .get(
            `http://canteen.tonglingok.com/api/v1/canteens?company_id=${company_id}`
          )
          .then(res => {
            this.canteenList = Array.from(res.data);
          })
          .catch(err => console.log(err));
      } else {
        $axios
          .get("http://canteen.tonglingok.com/api/v1/managerCanteens")
          .then(res => {
            this.canteenList = Array.from(res.data);
          })
          .catch(err => console.log(err));
      }
    },
    getDinnersList(canteen_id) {
      this.formdata.dinner_id = "";
      if (canteen_id) {
        $axios
          .get(
            `http://canteen.tonglingok.com/api/v1/canteen/dinners?canteen_id=${canteen_id}`
          )
          .then(res => {
            this.dinnersList = Array.from(res.data);
          })
          .catch(err => console.log(err));
      }
    },
    handleSelectionChange(arr) {
      let detail = [];
      arr.forEach(item => {
        detail.push(item.id);
      });
      this.formdata.staff_ids = detail.join(",");
    },
    confirmSupplement() {
      $axios
        .post(
          "http://canteen.tonglingok.com/api/v1/wallet/supplement",
          this.formdata
        )
        .then(res => {
          // console.log(res)
          this.sendMessage(res.msg);
        })
        .catch(err => console.log(err));
    },
    getList(val) {
      this.current_page = val;
      this.queryList();
    },
    handleSuccess(res) {
      // console.log(res)
      this.sendMessage(res.msg);
    },
    handleError(res) {
      // console.log(res)
    }
  }
};
</script>

<style lang="scss" scpoed>
.main-header {
  .content-header {
    padding: 12px 10px;
  }
  .upload {
    display: inline-block;
  }
}
.main-content {
  .supply-form {
    position: relative;
    height: 180px;
    margin-top: 20px;
    padding: 20px;
    background: #fff;
    .radio-area {
      display: inline-block;
      padding: 11px 0;
      margin-left: 10px;
    }
    .btn-area {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .el-button + .el-button {
      margin-left: 30px;
    }
  }
  .el-table {
    th,
    td {
      text-align: center;
    }
  }
}
</style>
