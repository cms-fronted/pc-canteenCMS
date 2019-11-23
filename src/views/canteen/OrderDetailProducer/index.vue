<template>
  <div>
    <div class="canteen-order">
      <div class="nav-title">订单明细查询</div>
      <el-divider></el-divider>
      <div class="main clearfix">
        <div class="main-header">
          <el-form :model="queryform" :inline="true">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="queryform.time_begin"
                style="width:200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="datetime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="queryform.time_end"
                style="width:200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="datetime"
              ></el-date-picker>
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
                ></el-option>
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
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="deriveData">导出</el-button>
            <el-button type="primary" @click="fetchList(1)">查询</el-button>
          </el-form>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border>
            <el-table-column label="序号" type="index" width="50px"></el-table-column>
            <el-table-column label="下单时间" prop="create_time"></el-table-column>
            <el-table-column label="类型" prop="category"></el-table-column>
            <el-table-column label="商品名称" prop="product"></el-table-column>
            <!-- <el-table-column label="单位" prop="goodsUnit"></el-table-column> -->
            <el-table-column label="商品数量" prop="count"></el-table-column>
            <el-table-column label="商品金额(元)" prop="price"></el-table-column>
          </el-table>
          <pagination :total="total" :currentPage="current_page" :pageSize="size"></pagination>
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

export default {
  components: { Pagination },
  data() {
    return {
      grade: store.getters.grade,
      loading: false,
      categoryOptions: [],
      productOptions: [],
      queryform: {},
      tableData: [],
      total: 0,
      current_page: 1,
      size: 10
    };
  },
  computed: {},
  created() {
    this.getCategoryOptions();
    this.getProductsId();
  },
  methods: {
    async getCategoryOptions() {
      const res = await $axios.get("http://canteen.tonglingok.com/api/v1/company/categories");
      if (res.msg === "ok") {
        this.categoryOptions = unshiftAllOptions(Array.from(res.data));
      }
    },
    async getProductsId(id) {
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/shop/supplier/products?category_id=${id}&page=1&size=1000`
      );
      console.log(res);
    },
    async fetchList(page) {
      page = page || 1;
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/shop/order/statistic/supplier?page=${page}&size=${this.size}`,
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
    deriveData() {
      console.log("点击导出表格");
    },
    async getProductsId() {
      const res = await $axios.get("http://canteen.tonglingok.com/api/v1/shop/supplierProducts/search");
      if (res.msg === "ok") {
        this.productOptions = unshiftAllOptions(Array.from(res.data));
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
