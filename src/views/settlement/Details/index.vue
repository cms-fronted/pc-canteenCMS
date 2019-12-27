<template>
  <div>
    <div class="settlement-details">
      <div class="main">
        <div class="nav-title">消费明细</div>
        <el-divider />
        <div class="main-header">
          <div class="select-title">
            <el-form
              :inline="true"
              :model="formdata"
              label-width="60px"
              label-position="left"
            >
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
                  @change="getOptions"
                  placeholder="请选择公司"
                >
                  <el-option
                    v-for="item in companyOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="消费地点" label-width="80px">
                <el-select
                  v-model="formdata.canteen_id"
                  @change="getDinnersOptions"
                  placeholder="请选择饭堂"
                >
                  <el-option
                    v-for="item in canteenOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="餐次">
                <el-select
                  v-model="formdata.dinner_id"
                  placeholder="请选择餐次"
                >
                  <el-option
                    v-for="item in dinnersOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="部门"
                prop="department_id"
                v-if="companiesVisible"
              >
                <el-select
                  v-model="formdata.department_id"
                  placeholder="请选择部门"
                >
                  <el-option
                    v-for="item in departmentOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input placeholder="请输入姓名" v-model="formdata.name" />
              </el-form-item>
              <el-form-item label="手机号码" label-width="80px">
                <el-input
                  placeholder="请输入手机号码"
                  v-model="formdata.phone"
                />
              </el-form-item>
              <el-form-item
                label="消费类型"
                label-width="80px"
                prop="consumption_type"
              >
                <el-select
                  v-model="formdata.consumption_type"
                  placeholder="请选择类型"
                >
                  <el-option label="订餐就餐" :value="1" />
                  <el-option label="订餐未就餐" :value="2" />
                  <el-option label="未订餐就餐" :value="3" />
                  <el-option label="补录" :value="4" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="btn-area">
            <el-button
              type="primary"
              @click="queryList(1)"
              :disabled="isDisabled"
              >查询</el-button
            >
            <el-button type="primary" @click="exportFile">导出</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="used_time" label="消费时间" width="180" />
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="phone" label="手机号码" />
        <el-table-column prop="canteen" label="消费地点" />
        <el-table-column prop="consumption_type" label="类型" />
        <el-table-column prop="dinner" label="餐次"></el-table-column>
        <!-- <el-table-column prop="c_name" label="商品名称" />
        <el-table-column prop="num" label="商品数量" />
        <el-table-column prop="price" label="商品金额" />
        <el-table-column prop="deliver_way" label="配送方式" />
        <el-table-column prop="note" label="备注" width="300" /> -->
      </el-table>
      <pagination
        :total="total"
        :pageSize="size"
        :currentPage="current_page"
        @pagination="queryList"
      />
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
  components: { Pagination },
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
        company_ids: null,
        canteen_id: null,
        department_id: null,
        dinner_id: null,
        time_begin: "",
        time_end: "",
        phone: null,
        name: null,
        consumption_type: null
      },
      current_page: 1,
      size: 10,
      total: 0,
      tableData: [],
      canteenOptions: [],
      companyOptions: [],
      departmentOptions: [],
      dinnersOptions: []
    };
  },
  async created() {
    if (this.companiesVisible) {
      await this.getCompanyOptions();
      await this.queryList(1);
    } else {
      await this.getCanteenOptions();
      await this.queryList(1);
    }
  },
  methods: {
    getOptions(company_ids) {
      this.canteenOptions = [];
      this.dinnersOptions = [];
      this.departmentOptions = [];
      this.formdata.canteen_id = "";
      this.formdata.dinner_id = "";
      this.formdata.department_id = "";
      if (!Number(company_ids)) return;
      this.getCanteenOptions(company_ids);
      this.getDepartmentOptions(company_ids);
    },
    async getCompanyOptions() {
      const res = await $axios.get(
        "http://canteen.tonglingok.com/api/v1/admin/companies"
      );
      if (res.msg === "ok") {
        this.companyOptions = getAllOptions(flatten(res.data));
        this.formdata.company_ids = this.companyOptions[0].id;
      }
    },
    async getCanteenOptions(company_ids) {
      let res;
      if (company_ids) {
        res = await $axios.get(
          `http://canteen.tonglingok.com/api/v1/canteens?company_id=${company_ids}`
        );
      } else {
        res = await $axios.get(
          "http://canteen.tonglingok.com/api/v1/managerCanteens"
        );
      }
      if (res.msg === "ok") {
        this.canteenOptions = unshiftAllOptions(Array.from(res.data)); //给数组添加一个全部option
        this.formdata.canteen_id = this.canteenOptions[0].id;
      }
    },
    async getDepartmentOptions(company_ids) {
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/departments?c_id=${company_ids}`
      );
      if (res.msg === "ok") {
        this.departmentOptions = unshiftAllOptions(flatten(res.data));
        this.formdata.department_id = this.departmentOptions[0].id;
      }
    },
    async getDinnersOptions(canteen_id) {
      //饭堂不为全部时， 0 为全部
      if (canteen_id) {
        const res = await $axios.get(
          `http://canteen.tonglingok.com/api/v1/canteen/dinners?canteen_id=${canteen_id}`
        );
        if (res.msg === "ok") {
          this.dinnersOptions = unshiftAllOptions(Array.from(res.data));
          this.formdata.dinner_id = this.dinnersOptions[0].id;
        }
      }
    },
    async exportFile() {
      await this.$exportExcel(
        "http://canteen.tonglingok.com/api/v1/order/orderSettlement/export",
        this.formdata
      );
    },
    async queryList(page) {
      page = typeof page == "number" ? page : 1;
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/order/orderSettlement?page=${page}&size=${this.size}`,
        this.formdata
      );
      if (res.msg === "ok") {
        this.tableData = [...res.data.data];
        this.total = res.data.total;
        this.current_page = res.data.current_page;
      }
    }
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
  }
};
</script>

<style lang="scss" scoped>
.settlement-details {
  .main-header {
    .select-title {
      float: left;
      width: 90%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-input {
        width: 160px;
      }
      .el-select {
        width: 160px;
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
</style>
