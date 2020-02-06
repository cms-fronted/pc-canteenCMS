<template>
  <!--TODO: 增加外层Card组件设置表头-->
  <div class="invoicing-report-producer">
    <div class="nav-title">进销统计报表</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :model="formdata" label-width="60px" :inline="true">
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
          <el-button type="primary" @click="queryList">查询</el-button>
          <el-button @click="exportFile">导出</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table
          :data="tableData"
          style="width:100%"
          show-summary
          :summary-method="getSummary"
        >
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
          <el-table-column label="总销售额">
            <template slot-scope="scoped">
              <span>
                {{ scoped.row.sale_sum * scoped.row.purchase_sum }}
              </span>
            </template>
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
import moment from "moment";
export default {
  components: { Pagination },
  data() {
    return {
      tableData: [],
      formdata: {
        date: [
          moment()
            .subtract(7, "d")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ]
      },
      current_page: 1,
      size: 10,
      total: 0
    };
  },
  async created() {
    await this.queryList(1);
  },
  computed: {
    isDisabled() {
      return !!!this.formdata.date;
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
    async queryList(page) {
      page = typeof page == Number ? page : 1;
      const res = await $axios.get(
        `https://tonglingok.com/canteen/api/v1/shop/salesReport/supplier?page=${page}&size=${
          this.size
        }`,
        this.formdata
      );
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.total = res.data.total;
        this.current_page = res.data.current_page;
        this.allMoney = res.data.money;
      }
    },
    async exportFile() {
      await this.$exportExcel(
        "https://tonglingok.com/canteen/api/v1/shop/order/exportSalesReport/supplier",
        this.formdata
      );
    },
    getSummary(params) {
      const { columns, data } = params;
      const sums = ["合计（元）"];
      sums[6] = "总金额：" + this.allMoney;
      return sums;
    }
  }
};
</script>

<style></style>
