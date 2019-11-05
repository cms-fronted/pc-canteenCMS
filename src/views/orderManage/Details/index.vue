<template>
  <div class="order-manage-details">
    <div class="nav-title">订餐明细</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <div class="select-title">
          <el-form :inline="true" :model="formdata" label-width="80px">
            <el-form-item label="开始">
              <el-date-picker
                v-model="formdata.time_begin"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束">
              <el-date-picker
                v-model="formdata.time_end"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
              ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="公司">
              <el-select v-model="formdata.company_ids" @change="getList" placeholder="请选择公司">
                <el-option
                  v-for="item in companiesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="消费地点">
              <el-select v-model="formdata.canteen_id" @change="getDinnersList" placeholder="请选择饭堂">
                <el-option
                  v-for="item in locationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门">
              <el-select v-model="formdata.department_id" placeholder="请选择部门">
                <el-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input placeholder="请输入姓名" v-model="formdata.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input placeholder="请输入手机号码" v-model="formdata.phone"></el-input>
            </el-form-item>
            <el-form-item label="餐次">
              <el-select v-model="formdata.dinner_id" placeholder="请选择部门">
                <el-option
                  v-for="item in dinnersList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-area">
          <el-button type="primary" @click="queryList" :disabled="isDisabled">查询</el-button>
          <el-button type="primary">导出</el-button>
        </div>
      </div>
      <div class="main-content">
        <el-table style="width:100%" :data="tableData" border>
          <el-table-column prop="ordering_date" label="订餐日期"></el-table-column>
          <el-table-column prop="canteen" label="消费地点"></el-table-column>
          <el-table-column prop="department" label="部门"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="dinner" label="餐次"></el-table-column>
        </el-table>
        <pagination v-if="!tableData" :total="total" :page="current_page" @pagination="queryList"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
export default {
  data() {
    return {
      formdata: {
        name: "",
        phone: "",
        department_id: "",
        time_begin: "",
        time_end: "",
        dinner_id: "",
        company_ids: "",
        canteen_id: ""
      },
      current_page: 1,
      pageSize: 10,
      total: 0,
      value: "",
      tableData: [],
      companiesList: [],
      departmentList: [],
      locationList: [],
      dinnersList: [],
      company_id: "",
      isDisabled: true
    };
  },
  created() {
    this.getCompanies();
  },
  computed: {
    isAble() {
      return (
        !!this.formdata.time_end &&
        !!this.formdata.time_begin &&
        !!this.formdata.company_ids
      );
    }
  },
  watch: {
    isAble(val) {
      console.log(val);
      this.isDisabled = !val;
    }
  },
  methods: {
    getList(val) {
      if (String(val).includes(",")) {
        this.departmentList = [{ name: "全部" }];
        this.locationList = [{ name: "全部" }];
        this.dinnersList = [];
        this.formdata.department_id = "";
        this.formdata.canteen_id = "";
        this.dinner_id = "";
      } else {
        this.getDepartmentList(val);
        this.getLocationList(val);
      }
    },
    getCompanies() {
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          let allCompanies = [];
          let companiesList = getAllOptions(flatten(arr));
          this.companiesList = companiesList;
        })
        .catch(err => console.log(err));
    },
    getDepartmentList(company_id) {
      $axios
        .get(`v1/departments?c_id=${company_id}`)
        .then(res => {
          let arr = res.data;
          let departmentList = unshiftAllOptions(flatten(arr));
          this.departmentList = departmentList;
        })
        .catch(err => console.log(err));
    },
    getDinnersList(canteen_id) {
      if (canteen_id) {
        $axios
          .get(`/v1/canteen/dinners?canteen_id=${canteen_id}`)
          .then(res => {
            this.dinnersList = unshiftAllOptions(Array.from(res.data));
          })
          .catch(err => console.log(err));
      }
    },
    getLocationList(company_id) {
      if (company_id) {
        $axios
          .get(`/v1/company/consumptionLocation?company_id=${company_id}`)
          .then(res => {
            this.locationList = unshiftAllOptions(Array.from(res.data.canteen));
          })
          .catch(err => console.log(err));
      }
    },
    queryList() {
      let { page, pageSize, sum } = this;
      let {
        name,
        company_ids,
        time_end,
        time_begin,
        dinner_id,
        phone,
        canteen_id,
        department_id
      } = this.formdata;
      console.log(this.formdata);
      $axios
        .get("/v1/order/orderStatistic/detail", {
          name: name,
          company_ids: company_ids,
          time_end: time_end,
          time_begin: time_begin,
          dinner_id: dinner_id,
          phone: phone,
          canteen_id: canteen_id,
          department_id: department_id
        })
        .then(res => {
          this.tableData = Array.from(res.data.data);
          this.total = res.data.total;
          this.current_page = res.data.current_page;
        })
        .catch(err => console.log(err));
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="scss" scpoed>
.order-manage-details {
  .main-header {
    .select-title {
      float: left;
      width: 90%;
      display: flex;
      flex-wrap: wrap;
      .el-input {
        width: 180px;
      }
      .el-select {
        width: 180px;
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
}
</style>