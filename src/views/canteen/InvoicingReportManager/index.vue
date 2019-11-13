<template>
  <div class="invoicing-report-manager">
    <div class="nav-title">进销统计报表</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :model="formdata" label-width="60px" :inline="true">
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
          <el-form-item label="供应商">
            <el-select v-model="formdata.supplier_id">
              <el-option
                v-for="item in supplierOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
          <el-button>导出</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table :data="tableData" style="width:100%">
          <el-table-column
            label="序号"
            type="index"
            width="50px"
          ></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
          <el-table-column label="单位" prop="unit">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.unit)"
            ></div>
          </el-table-column>
          <el-table-column label="总进货量" prop="purchase_sum">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.purchase_sum)"
            ></div
          ></el-table-column>
          <el-table-column label="总销售量" prop="sale_sum">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.sale_sum)"
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
export default {
  components: { Pagination },
  data() {
    return {
      supplierOptions: [],
      tableData: [],
      formdata: {},
      current_page: 1,
      size: 10,
      total: 0,
      isDisabled: true
    };
  },
  created() {
    this.getSupplierList();
  },
  computed: {
    isAble() {
      return !!this.formdata.time_end && !!this.formdata.time_begin;
    }
  },
  watch: {
    isAble(val) {
      this.isDisabled = !val;
    }
  },
  methods: {
    async getSupplierList() {
      const res = await $axios.get("/v1/company/suppliers");
      if (res.msg === "ok") {
        this.supplierOptions = Array.from(res.data);
      }
    },
    async queryList(page) {
      page = typeof page == Number ? page : 1;
      const res = await $axios.get(
        `/v1/shop/salesReport/manager?page=${page}&size=${this.size}`,
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

<style></style>
