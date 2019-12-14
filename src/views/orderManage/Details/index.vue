<template>
  <div class="order-manage-details">
    <div class="nav-title">订餐明细</div>
    <el-divider />
    <div class="main">
      <div class="main-header">
        <div class="select-title">
          <el-form :inline="true" :model="formdata" label-width="80px">
            <el-form-item label="时间">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="formdata.date"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                type="daterange"
              />
            </el-form-item>
            <el-form-item label="公司" v-if="companiesVisible">
              <el-select
                v-model="formdata.company_ids"
                filterable
                @change="getList"
                placeholder="请选择公司"
              >
                <el-option
                  v-for="item in companiesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="消费地点">
              <el-select
                v-model="formdata.canteen_id"
                @change="getDinnersList"
                placeholder="请选择饭堂"
              >
                <el-option
                  v-for="item in locationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="部门" v-if="companiesVisible">
              <el-select
                v-model="formdata.department_id"
                placeholder="请选择部门"
              >
                <el-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input placeholder="请输入姓名" v-model="formdata.name" />
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input placeholder="请输入手机号码" v-model="formdata.phone" />
            </el-form-item>
            <el-form-item label="餐次">
              <el-select v-model="formdata.dinner_id" placeholder="请选择餐次">
                <el-option
                  v-for="item in dinnersList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-area">
          <el-button type="primary" @click="queryList" :disabled="isDisabled"
            >查询</el-button
          >
          <el-button type="primary">导出</el-button>
        </div>
      </div>
      <div class="main-content">
        <el-table style="width:100%" :data="tableData" border>
          <el-table-column prop="ordering_date" label="订餐日期" />
          <el-table-column prop="canteen" label="消费地点" />
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="dinner" label="餐次" />
        </el-table>
        <pagination
          :total="total"
          :currentPage="current_page"
          @pagination="queryList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";
import moment from "moment";
export default {
  data() {
    return {
      grade: store.getters.grade,
      formdata: {
        date: [
          moment()
            .subtract(7, "d")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ],
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
      company_id: ""
    };
  },
  async created() {
    if (this.companiesVisible) {
      await this.getCompanies();
    } else {
      this.getLocationList();
    }
    await this.queryList(1);
  },
  computed: {
    isDisabled() {
      return !!!this.formdata.date;
    },
    companiesVisible() {
      return this.grade !== 3;
    }
  },
  watch: {
    formdata: {
      handler: function(val, oldVal) {
        if (val.date) {
          this.formdata.time_begin = this.formdata.date[0];
          this.formdata.time_end = this.formdata.date[1];
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getList(val) {
      if (String(val).includes(",")) {
        this.departmentList = [{ name: "全部", id: 0 }];
        this.dinnersList = [{ name: "全部", id: 0 }];
        this.locationList = [{ name: "全部", id: 0 }];
        this.formdata.department_id = 0;
        this.formdata.canteen_id = 0;
        this.formdata.dinner_id = 0;
      } else {
        this.getDepartmentList(val);
        this.getLocationList(val);
      }
    },
    async getCompanies() {
      await $axios
        .get("http://canteen.tonglingok.com/api/v1/admin/companies")
        .then(res => {
          if (res.msg === "ok") {
            let arr = res.data;
            let companiesList = getAllOptions(flatten(arr));
            this.companiesList = companiesList;
            this.formdata.company_ids = this.companiesList[0].id;
            this.departmentList = [{ name: "全部", id: 0 }];
            this.dinnersList = [{ name: "全部", id: 0 }];
            this.locationList = [{ name: "全部", id: 0 }];
            this.formdata.canteen_id = 0;
            this.formdata.dinner_id = 0;
            this.formdata.department_id = 0;
          }
        })
        .catch(err => console.log(err));
    },
    getDepartmentList(company_id) {
      $axios
        .get(
          `http://canteen.tonglingok.com/api/v1/departments?c_id=${company_id}`
        )
        .then(res => {
          let arr = res.data;
          let departmentList = unshiftAllOptions(flatten(arr));
          this.departmentList = departmentList;
          this.formdata.department_id = this.departmentList[0].id;
        })
        .catch(err => console.log(err));
    },
    getDinnersList(canteen_id) {
      if (canteen_id) {
        $axios
          .get(
            `http://canteen.tonglingok.com/api/v1/canteen/dinners?canteen_id=${canteen_id}`
          )
          .then(res => {
            this.dinnersList = unshiftAllOptions(Array.from(res.data));
            this.formdata.dinner_id = this.dinnersList[0].id;
          })
          .catch(err => console.log(err));
      }
    },
    getLocationList(company_id) {
      if (company_id) {
        $axios
          .get(
            `http://canteen.tonglingok.com/api/v1/canteens?company_id=${company_id}`
          )
          .then(res => {
            this.locationList = unshiftAllOptions(Array.from(res.data));
            this.formdata.canteen_id = this.locationList[0].id;
          })
          .catch(err => console.log(err));
      } else {
        $axios
          .get("http://canteen.tonglingok.com/api/v1/managerCanteens")
          .then(res => {
            this.locationList = unshiftAllOptions(Array.from(res.data));
            this.formdata.canteen_id = this.locationList[0].id;
          })
          .catch(err => console.log(err));
      }
    },
    async queryList(page) {
      page = typeof page == "number" ? page : 1;
      let { pageSize, sum } = this;
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
      await $axios
        .get(
          `http://canteen.tonglingok.com/api/v1/order/orderStatistic/detail?page=${page}&size=${pageSize}`,
          {
            name: name,
            company_ids: company_ids,
            time_end: time_end,
            time_begin: time_begin,
            dinner_id: dinner_id,
            phone: phone,
            canteen_id: canteen_id,
            department_id: department_id
          }
        )
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
