<template>
  <div class="good-search">
    <div class="nav-title">商品查询</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :inline="true" ref="queryForm" :model="queryForm">
          <el-form-item label="供应商">
            <el-select v-model="queryForm.supplier_id">
              <el-option
                v-for="item in supplierOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="queryForm.category_id">
              <el-option
                v-for="item in categoryOptions"
                :label="item.name"
                :key="item.id"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="queryList(1)">查询</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table :data="tableData">
          <el-table-column label="照片">
            <template slot-scope="props">
              <div style="text-align:center">
                <img style="height:100px;" :src="props.row.image" :alt="props.row.name" srcset />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="类型" prop="category"></el-table-column>
          <el-table-column label="单位" prop="unit"></el-table-column>
          <el-table-column label="单价" prop="price"></el-table-column>
          <el-table-column label="库存量" prop="stock"></el-table-column>
          <el-table-column label="供应商" prop="supplier"></el-table-column>
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
import { unshiftAllOptions } from "@/utils/flatternArr";
import Pagination from "@/components/Pagination";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      queryForm: {
        supplier_id: "", //供应商id
        category_id: "" //商品类型id
      },
      categoryOptions: [],
      supplierOptions: [],
      tableData: [],
      size: 10,
      total: 0,
      current_page: 1
    };
  },
  created() {
    this.getCategoryList();
    this.getSupplierList();
  },
  methods: {
    async getCategoryList(company_id) {
      const res = await $axios.get("/v1/company/categories");
      if (res.msg === "ok") {
        this.categoryOptions = unshiftAllOptions(Array.from(res.data));
      }
    },
    async getSupplierList() {
      const res = await $axios.get("/v1/company/suppliers");
      if (res.msg === "ok") {
        this.supplierOptions = unshiftAllOptions(Array.from(res.data));
      }
    },
    async queryList(page) {
      page = page || 1;
      const res = await $axios.get(
        `/v1/shop/cms/products?page=${page}&size=${this.size}`,
        this.queryForm
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
</style>