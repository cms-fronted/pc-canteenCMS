<template>
  <div class="order-statistics">
    <div class="nav-title">消费总报表</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <div class="select-title">
          <el-form :inline="true" :model="formdata" label-width="80px">
            <el-form-item label="开始">
              <el-date-picker
                v-model="formdata.time_begin"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="datetime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束">
              <el-date-picker
                v-model="formdata.time_end"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="datetime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="公司">
              <el-select v-model="formdata.company_ids" @change="getList" placeholder="请选择公司">
                <el-option
                  v-for="item in companiesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
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
            <el-form-item label="消费类型">
              <el-select v-model="formdata.consumption_type">
                <el-option
                  v-for="item in consumptionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="人员类型">
              <el-select v-model="formdata.role">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="types-radio">
              <el-radio-group v-model="formdata.sum_order" @change="queryList(current_page)">
                <el-radio label="dept_name">按部门汇总</el-radio>
                <el-radio label="usr_name">按姓名汇总</el-radio>
                <el-radio label="goods_type">按人员类型汇总</el-radio>
                <el-radio label="goods_name">按消费地点汇总</el-radio>
                <el-radio label="state">按消费类型汇总</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-area">
          <el-button type="primary" @click="queryList" :disabled="isDisabled">查询</el-button>
          <el-button type="primary">导出</el-button>
        </div>
      </div>
      <div class="main-content">
        <el-table :data="tableData" border>
          <el-table-column label="统计变量" prop></el-table-column>
          <el-table-column label="开始时间" prop></el-table-column>
          <el-table-column label="结束时间" prop></el-table-column>
          <el-table-column label="姓名" prop></el-table-column>
          <el-table-column label="部门" prop></el-table-column>
          <el-table-column label="消费类型" prop></el-table-column>
          <el-table-column label="消费地点" prop></el-table-column>
          <el-table-column label="人员类型" prop></el-table-column>
          <el-table-column label="早餐数量" prop></el-table-column>
          <el-table-column label="早餐金额" prop></el-table-column>
          <el-table-column label="午餐数量" prop></el-table-column>
          <el-table-column label="午餐金额" prop></el-table-column>
          <el-table-column label="晚餐数量" prop></el-table-column>
          <el-table-column label="晚餐金额" prop></el-table-column>
          <el-table-column label="宵夜数量" prop></el-table-column>
          <el-table-column label="宵夜金额" prop></el-table-column>
          <el-table-column label="总金额" prop></el-table-column>
        </el-table>
        <pagination
          :total="total"
          :pageSize="size"
          :currentPage="current_page"
          @pagination="queryList"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
const consumption_options = [
  { id: 0, name: "全部" },
  { id: 1, name: "订餐就餐" },
  { id: 2, name: "订餐未就餐" },
  { id: 3, name: "未订餐就餐" },
  { id: 4, name: "补录" }
];
export default {
  components: { Pagination },
  data() {
    return {
      company_id: "",
      canteen_id: "",
      formdata: {},
      departmentList: [],
      dinnersList: [],
      locationList: [],
      companiesList: [],
      roleOptions: [],
      tableData: [],
      consumptionOptions: consumption_options,
      isDisabled: true,
      current_page: 1,
      size: 10,
      total: 0
    };
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
      this.isDisabled = !val;
    }
  },
  created() {
    this.getCompanies();
    this.getRoleType();
  },
  methods: {
    getList(val) {
      if (String(val).includes(",")) {
        this.departmentList = [{ name: "全部" }];
        this.locationList = [{ name: "全部" }];
        this.dinnersList = [{ name: "全部" }];
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
    getDinnersList(canteen_id) {
      if (canteen_id) {
        $axios
          .get(`/v1/canteen/dinners?canteen_id=${canteen_id}`)
          .then(res => {
            this.dinnersList = unshiftAllOptions(Array.from(res.data));
          })
          .catch(err => console.log(err));
      } else {
        this.formdata.dinner_id = "";
        this.dinnersList = [{ name: "全部" }];
      }
    },
    getDepartmentList(company_id) {
      if (company_id) {
        $axios
          .get(`v1/departments?c_id=${company_id}`)
          .then(res => {
            let arr = res.data;
            let departmentList = unshiftAllOptions(flatten(arr));
            this.departmentList = departmentList;
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
    async getRoleType() {
      const res = await $axios.get("/v1/role/types");
      if (res.msg === "ok") {
        this.roleOptions = unshiftAllOptions(res.data.data);
      }
    },
    async queryList(page) {
      page = page || 1;
      const res = await $axios.get(
        `/v1/order/orderSettlement?page=${page}&size=${this.size}`,
        this.formdata
      );
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.current_page = res.data.current_page;
        this.total = res.data.total;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.order-statistics {
  .main-header {
    .select-title {
      float: left;
      width: 90%;
      display: flex;
      flex-wrap: wrap;
      .el-input {
        width: 200px;
      }
      .el-select {
        width: 200px;
      }
      .types-radio {
        display: flex;
        justify-content: space-between;
        .el-radio-group {
          display: block;
        }
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