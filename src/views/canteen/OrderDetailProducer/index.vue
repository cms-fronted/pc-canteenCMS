<template>
  <div>
    <div class="canteen-order">
      <div class="nav-title">订单明细查询</div>
      <el-divider />
      <div class="main clearfix">
        <div class="main-header">
          <el-form :model="queryform" :inline="true">
            <el-form-item label="时间">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="queryform.date"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                type="daterange"
              />
            </el-form-item>
            <el-form-item label="商品类型">
              <el-select
                v-model="queryform.category_id"
                placeholder="请选择商品类型"
                @change="getProductsId"
                style="width:200px"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-select
                v-model="queryform.product_id"
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
                />
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="deriveData">导出</el-button>
            <el-button type="primary" @click="fetchList(1)">查询</el-button>
          </el-form>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border>
            <el-table-column label="序号" type="index" width="50px" />
            <el-table-column label="下单时间" prop="create_time" />
            <el-table-column label="类型" prop="category" />
            <el-table-column label="商品名称" prop="product" />
            <!-- <el-table-column label="单位" prop="goodsUnit"></el-table-column> -->
            <el-table-column label="商品数量" prop="count" />
            <el-table-column label="商品金额(元)" prop="price" />
          </el-table>
          <pagination
            :total="total"
            :currentPage="current_page"
            :pageSize="size"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 姓名  name 手机号 phone 商品类型 type 部门 department 企业 company
// 开始时间：begin_time 结束时间 end_time 状态 goodsState  商品名称 goodsName
// l列表的信息
// 序号 下单时间 结束时间 姓名 手机号 类型 商品名称 状态
// 单位 unit  商品数量 stock 商品金额 price  地址 address 打印 print  备注 remark
import $axios from "@/api/index";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import Pagination from "@/components/Pagination";
import store from "@/store";
import moment from "moment";
export default {
  components: { Pagination },
  data() {
    return {
      grade: store.getters.grade,
      loading: false,
      categoryOptions: [],
      productOptions: [],
      queryform: {
        date: [
          moment()
            .subtract(7, "d")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ],
        status: 0,
        time_begin: "",
        time_end: "",
        category_id: "",
        product_id: ""
      },
      tableData: [],
      total: 0,
      current_page: 1,
      size: 10
    };
  },
  computed: {},
  watch: {
    queryform: {
      handler: function(val, oldVal) {
        if (val.date) {
          this.queryform.time_begin = this.queryform.date[0];
          this.queryform.time_end = this.queryform.date[1];
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    await this.getCategoryOptions();
    await this.getProductsId();
    await this.fetchList(1);
  },
  methods: {
    async getCategoryOptions() {
      const res = await $axios.get(
        "/api/v1/company/categories"
      );
      if (res.msg === "ok") {
        this.categoryOptions = unshiftAllOptions(Array.from(res.data));
        this.queryform.category_id = this.categoryOptions[0].id;
      }
    },
    /*    async getProductsId(id) {
      const res = await $axios.get(
        `/api/v1/shop/supplier/products?category_id=${id}&page=1&size=1000`
      );
      console.log(res);
    },*/
    async fetchList(page) {
      page = Number(page) || 1;
      const res = await $axios.get(
        `/api/v1/shop/order/statistic/supplier?page=${page}&size=${
          this.size
        }`,
        this.queryform
      );
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.total = res.data.total;
        this.current_page = res.data.current_page;
      }
    },
    handleEdit(index, row) {
      console.log(row);
      console.log("打印按钮被你点击啦！");
    },
    async exportFile() {
      await this.$exportExcel(
        "/api/v1/shop/order/exportOrderStatistic/supplier",
        this.queryform
      );
    },
    async getProductsId() {
      const res = await $axios.get(
        "/api/v1/shop/supplierProducts/search"
      );
      if (res.msg === "ok") {
        this.productOptions = unshiftAllOptions(Array.from(res.data));
        this.queryform.product_id = this.productOptions[0].id;
      }
    },
    async remoteMethod(query) {
      if (query != "") {
        this.loading = true;
        const res = await this.$axios({
          url: `/api/v1/shop/supplierProducts/search?product=${query}`,
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
    }
  }
};
</script>

<style lang="scss" scpoed>
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.canteen-order {
  .main-content {
    .el-table {
      th,
      td {
        text-align: center;
      }
    }
  }
}
</style>
