<template>
  <div class="canteen-statistics-manager">
    <div class="nav-title">消费订单汇总查询</div>
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
            <el-form-item label="公司" v-if="companiesVisible">
              <el-select
                v-model="formdata.company_id"
                placeholder="请选择企业"
                @change="getDepartmentList"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
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
            <el-form-item label="商品类型">
              <el-select v-model="formdata.category_id">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-select
                v-model="formdata.product_id"
                remote
                filterable
                :remote-method="remoteMethod"
                :loading="loading"
                placeholder="请选择商品名称"
                style="width:200px"
              >
                <el-option
                  v-for="item in productOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formdata.status">
                <el-option
                  v-for="item in goodStateOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
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
          <el-button type="primary">导出</el-button>
        </div>
      </div>
      <div class="main-content">
        <el-table border :data="tableData">
          <el-table-column
            label="序号"
            type="index"
            width="50px"
          ></el-table-column>
          <el-table-column label="统计变量">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.statistic)"
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
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";
import Pagination from "@/components/Pagination";
const good_state = [
  { id: 0, name: "全部" },
  { id: 1, name: "已完成" },
  { id: 2, name: "未完成" },
  { id: 3, name: "待取货" },
  { id: 4, name: "已取货" }
];
export default {
  components: { Pagination },
  data() {
    return {
      grade: store.getters.grade,
      loading: false,
      company_id: "",
      canteen_id: "",
      formdata: {
        type: 1
      },
      companyList: [],
      departmentList: [],
      categoryOptions: [],
      productOptions: [],
      goodStateOptions: good_state,
      tableData: [],
      isDisabled: true,
      current_page: 1,
      size: 10,
      total: 0
    };
  },
  computed: {
    isAble() {
      return !!this.formdata.time_end && !!this.formdata.time_begin;
    },
    companiesVisible() {
      return this.grade !== 3;
    }
  },
  watch: {
    isAble(val) {
      this.isDisabled = !val;
    }
  },
  created() {
    if (this.companiesVisible) {
      this.getCompanies();
    } else {
      this.getDepartmentListWithoutCid();
    }
    this.getCategoryOptions();
    this.getProductsId();
  },
  methods: {
    getCompanies() {
      $axios
        .get("http://canteen.tonglingok.com/api/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          let allCompanies = [];
          let companiesList = flatten(arr);
          this.companyList = companiesList;
        })
        .catch(err => console.log(err));
    },
    async getDepartmentList(company_id) {
      const res = await $axios.get(`v1/departments?c_id=${company_id}`);
      if (res.msg === "ok") {
        this.departmentList = unshiftAllOptions(Array.from(flatten(res.data)));
      }
    },
    async getDepartmentListWithoutCid() {
      const res = await $axios.get(
        "http://canteen.tonglingok.com/api/v1/admin/departments"
      );
      if (res.msg === "ok") {
        this.departmentList = unshiftAllOptions(Aarray.from(res.data));
      }
    },
    async getCategoryOptions() {
      const res = await $axios.get(
        "http://canteen.tonglingok.com/api/v1/company/categories"
      );
      if (res.msg === "ok") {
        this.categoryOptions = unshiftAllOptions(Array.from(res.data));
      }
    },
    async getProductsId(id) {
      const res = await this.$axios({
        url: `http://canteen.tonglingok.com/api/v1/shop/supplierProducts/search`,
        methods: "get",
        headers: { token: store.getters.token }
      });
      if (res.data.msg === "ok") {
        console.log(res.data.data);
        this.productOptions = unshiftAllOptions(Array.from(res.data.data));
      }
    },
    async remoteMethod(query) {
      if (query != "") {
        this.loading = true;
        const res = await this.$axios({
          url: `http://canteen.tonglingok.com/api/v1/shop/supplierProducts/search?product=${query}`,
          methods: "get",
          headers: { token: store.getters.token }
        });
        if (res.data.msg === "ok") {
          console.log(res.data.data);
          this.productOptions = Array.from(res.data.data);
        }
        this.loading = false;
      } else {
        await this.getProductsId();
      }
    },
    async queryList(page) {
      page = typeof page == Number ? page : 1;
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/shop/orderConsumption?page=${page}&size=${
          this.size
        }`,
        this.formdata
      );
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.total = res.data.total;
        this.current_page = res.data.current_page;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.canteen-statistics-manager {
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
</style>
