<template>
  <div class="details">
    <div class="nav-title">菜品材料明细</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :inline="true" :model="queryForm">
          <el-form-item label="公司" v-if="companiesVisible" prop="company_id">
            <el-select @change="getCanteenOptions" v-model="queryForm.company_ids">
              <el-option
                v-for="item in companyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消费地点" prop="canteen_id">
            <el-select v-model="queryForm.canteen_ids">
              <el-option
                v-for="item in canteenOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="queryList(1)" plain>查询</el-button>
          <el-button type="primary">导出</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table style="width:100%" :data="tableData">
          <el-table-column label="序号"></el-table-column>
          <el-table-column label="餐次"></el-table-column>
          <el-table-column label="菜品"></el-table-column>
          <el-table-column label="操作"></el-table-column>
          <el-table-column label="材料名称"></el-table-column>
          <el-table-column label="单位"></el-table-column>
          <el-table-column label="数量"></el-table-column>
        </el-table>
        <pagination
          :total="total"
          :currentPage="current_page"
          :pageSize="size"
          @pagination="queryList"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import $axios from "@/api/index";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";

export default {
  components: { Pagination },
  computed: {
    companiesVisible() {
      return this.grade !== 3;
    }
  },
  data() {
    return {
      grade: store.getters.grade,
      companyOptions: [],
      canteenOptions: [],
      dinnerOptions: [],
      tableData: [],
      queryForm: {
        company_ids: "",
        canteen_ids: ""
      },
      current_page: 1,
      size: 5,
      total: 0
    };
  },
  created() {
    if(this.companiesVisible){
      this.getCompanies();
    } else{
      this.getCanteenOptions(0)
    }
  },
  methods: {
    async getCompanies() {
      const res = await $axios.get("http://canteen.tonglingok.com/api/v1/admin/companies");
      if (res.msg === "ok") {
        this.companyOptions = getAllOptions(flatten(res.data));
      }
    },
    async getCanteenOptions(c_id) {
      let company_id = c_id || "";
      this.canteenOptions = [];
      this.queryForm.canteen_ids = "";
      if (Number(company_id)) {
        const res = await $axios.get(`http://canteen.tonglingok.com/api/v1/canteens?company_id=${company_id}`);
        if (res.msg === "ok") {
          this.canteenOptions = getAllOptions(Array.from(res.data));
        }
        return res;
      }
    },
    async getDinnerOptions(canteen_id) {
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/canteen/dinners?canteen_id=${canteen_id}`
      );
      if (res.msg === "ok") {
        this.dinnerOptions = getAllOptions(Array.from(res.data));
      }
    },
    async queryList(page) {
      page = page || 1;
      let form = {};
      form = JSON.parse(JSON.stringify(this.queryForm));
      if (String(form.canteen_ids).includes(",")) {
        delete form.company_ids;
      } else if (String(form.company_ids).includes(",")) {
        delete form.canteen_ids;
      }
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/materials?page=${page}&size=${this.size}`,
        form
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

<style></style>
