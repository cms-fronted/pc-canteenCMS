<template>
  <div class="canteen-statistics-manager">
    <div class="nav-title">消费订单汇总查询</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <div class="select-title">
          <el-form :model="formdata" label-width="70px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="时间">
                  <el-date-picker
                    class="date-picker"
                    value-format="yyyy-MM-dd"
                    v-model="formdata.date"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    type="daterange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公司" v-if="companiesVisible">
                  <el-select
                    v-model="formdata.company_id"
                    placeholder="请选择企业"
                    @change="getList"
                    filterable
                  >
                    <el-option
                      v-for="item in companyList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
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
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商品类型">
                  <el-select
                    v-model="formdata.category_id"
                    @change="changeCategory"
                  >
                    <el-option
                      v-for="item in categoryOptions"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="商品名称">
                  <el-select
                    v-model="formdata.product_id"
                    remote
                    filterable
                    :remote-method="remoteMethod"
                    :loading="loading"
                    @change="changeProduct"
                    placeholder="请选择商品名称"
                  >
                    <el-option
                      v-for="item in productOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="状态">
                  <el-select v-model="formdata.status">
                    <el-option
                      v-for="item in goodStateOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item class="types-radio">
              <el-radio-group
                v-model="formdata.type"
                @change="queryList(current_page)"
              >
                <el-radio :label="1">按类型汇总</el-radio>
                <el-radio :label="2">按商品汇总</el-radio>
                <el-radio :label="3">按状态汇总</el-radio>
                <el-radio :label="4">按姓名汇总</el-radio>
                <el-radio :label="5">按部门汇总</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-area">
          <el-button type="primary" @click="queryList" :disabled="isDisabled"
            >查询</el-button
          >
          <el-button type="primary" @click="exportFile">导出</el-button>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="main-content">
        <el-table
          border
          :data="tableData"
          show-summary
          :summary-method="getSummary"
        >
          <el-table-column label="序号" type="index" width="50px" />
          <el-table-column label="统计变量">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.statistic, formdata.type)"
            ></div>
          </el-table-column>
          <el-table-column label="下单时间">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.create_time)"
            ></div>
          </el-table-column>
          <el-table-column label="结束时间">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.used_time)"
            ></div>
          </el-table-column>
          <el-table-column label="姓名">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.username)"
            ></div>
          </el-table-column>
          <el-table-column label="部门">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.department)"
            ></div>
          </el-table-column>
          <el-table-column label="类型">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.category)"
            ></div>
          </el-table-column>
          <el-table-column label="商品名称">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.product)"
            ></div>
          </el-table-column>
          <el-table-column label="单位">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.unit)"
            ></div>
          </el-table-column>
          <el-table-column label="数量">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.order_count)"
            ></div>
          </el-table-column>
          <el-table-column label="报表总销售额">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.order_money)"
            ></div>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :pageSize="size"
          @pagination="queryList"
          :currentPage="current_page"
        />
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";
import Pagination from "@/components/Pagination";
import moment from "moment";
const good_state = [
  { id: 0, name: "全部" },
  { id: 1, name: "已完成" },
  { id: 2, name: "未完成" },
  { id: 3, name: "待取货" },
  { id: 4, name: "已取货" }
];
const static_type = ["", "种类型", "种商品", "种状态", "个人员", "个部门"];

export default {
  components: { Pagination },
  data() {
    return {
      grade: store.getters.grade,
      loading: false,
      company_id: "",
      canteen_id: "",
      formdata: {
        type: 1,
        date: [
          moment()
            .subtract(7, "d")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ],
        time_begin: "",
        time_end: "",
        status: 0,
        category_id: "",
        product_id: "",
        department_id: ""
      },
      companyList: [],
      departmentList: [],
      categoryOptions: [],
      productOptions: [],
      statistic: {},
      goodStateOptions: good_state,
      tableData: [],
      current_page: 1,
      size: 10,
      total: 0
    };
  },
  computed: {
    isDisabled() {
      return !!!this.formdata.date;
    },
    companiesVisible() {
      return this.grade != 3;
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
  async created() {
    if (this.companiesVisible) {
      await this.getCompanies();
    } else {
      await this.getDepartmentListWithoutCid();
      await this.getCategoryOptions();
      await this.getProductsId();
    }
    await this.queryList(1);
  },
  methods: {
    async getCompanies() {
      await $axios
        .get("https://tonglingok.com/canteen/api/v1/admin/companies")
        .then(async res => {
          let arr = res.data;
          let companiesList = flatten(arr);
          this.companyList = companiesList;
          this.formdata.company_id = companiesList[0].id;
          await this.getDepartmentList(companiesList[0].id);
          await this.getCategoryOptions(companiesList[0].id);
          await this.getProductsId(companiesList[0].id);
        })
        .catch(err => console.log(err));
    },
    async getDepartmentList(company_id) {
      await $axios
        .get(
          `https://tonglingok.com/canteen/api/v1/departments?c_id=${company_id}`
        )
        .then(res => {
          if (res.msg === "ok") {
            this.departmentList = unshiftAllOptions(
              Array.from(flatten(res.data))
            );
            this.formdata.department_id = this.departmentList[0].id;
          }
        });
    },
    async getList(company_id) {
      await this.getCategoryOptions(company_id);
      await this.getDepartmentList(company_id);
      await this.getProductsId(company_id);
    },
    async getDepartmentListWithoutCid() {
      const res = await $axios.get(
        "https://tonglingok.com/canteen/api/v1/admin/departments"
      );
      if (res.msg === "ok") {
        this.departmentList = unshiftAllOptions(Aarray.from(res.data));
        this.formdata.department_id = this.departmentList[0].id;
      }
    },
    async getCategoryOptions(company_id) {
      company_id = company_id || "";
      const res = await $axios.get(
        "https://tonglingok.com/canteen/api/v1/company/categories",
        {
          company_id: company_id
        }
      );
      if (res.msg === "ok") {
        this.categoryOptions = unshiftAllOptions(Array.from(res.data));
        this.formdata.category_id = this.categoryOptions[0].id;
      }
    },
    changeCategory() {
      this.formdata.product_id = "";
    },
    async getProductsId(company_id) {
      company_id = company_id || "";
      const res = await $axios.get(
        `https://tonglingok.com/canteen/api/v1/shop/companyProducts/search?company_id=${company_id}`
      );
      if (res.msg === "ok") {
        this.productOptions = unshiftAllOptions(Array.from(res.data));
        this.formdata.product_id = this.productOptions[0].id;
      }
    },

    changeProduct() {
      this.formdata.category_id = this.categoryOptions[0].id;
    },
    async remoteMethod(query) {
      if (query != "") {
        this.loading = true;
        const res = await $axios.get(
          `https://tonglingok.com/canteen/api/v1/shop/companyProducts/search?product=${query}`,
          {
            company_id: this.formdata.company_id || ""
          }
        );
        if (res.msg === "ok") {
          this.productOptions = Array.from(res.data);
        }
        this.loading = false;
      } else {
        await this.getProductsId();
      }
    },
    async exportFile() {
      await this.$exportExcel(
        "https://tonglingok.com/canteen/api/v1/shop/order/exportConsumptionStatistic",
        this.formdata
      );
    },
    async queryList(page) {
      page = typeof page == Number ? page : 1;
      const res = await $axios.get(
        `https://tonglingok.com/canteen/api/v1/shop/orderConsumption?page=${page}&size=${
          this.size
        }`,
        this.formdata
      );
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.total = res.data.total;
        this.current_page = res.data.current_page;
        this.statistic = res.data.statistic;
      }
    },
    getSummary(params) {
      const { columns, data } = params;
      const sums = ["合计"];
      sums[1] = this.tableData.length + static_type[this.formdata.type];
      sums[10] = "总金额：" + this.statistic.statisticMoney;
      return sums;
    }
  }
};
</script>

<style lang="scss" scoped>
.canteen-statistics-manager {
  .types-radio {
    display: flex;
    justify-content: space-between;
    .el-radio-group {
      display: block;
    }
  }
}
</style>
