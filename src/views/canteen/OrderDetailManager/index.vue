<template>
  <div class="shop-order-detail-manager">
    <div class="nav-title">订单明细查询</div>
    <el-divider />
    <div class="main">
      <div class="main-header">
        <div class="select-title">
          <el-form :model="formdata" :inline="true">
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
                v-model="formdata.company_id"
                filterable
                placeholder="请选择企业"
                @change="getDepartmentList"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
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
                />
              </el-select>
            </el-form-item>

            <el-form-item label="状态">
              <el-select v-model="formdata.status" placeholder="请选择状态">
                <el-option
                  v-for="item in goodStateOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-area">
          <el-button type="primary" @click="fetchList" :disabled="isDisabled"
            >查询</el-button
          >
          <el-button type="primary" @click="deriveData">导出</el-button>
        </div>
      </div>
      <div class="main-content">
        <el-table style="width:100%" :data="tableData" border>
          <el-table-column label="序号" type="index" width="50px" />
          <el-table-column label="下单时间">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.create_time)"
            ></div
          ></el-table-column>
          <el-table-column label="结束时间">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.used_time)"
            ></div
          ></el-table-column>
          <el-table-column label="姓名">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.username)"
            ></div
          ></el-table-column>
          <el-table-column label="手机号码">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.phone)"
            ></div
          ></el-table-column>
          <el-table-column label="商品数量">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.order_count)"
            ></div>
          </el-table-column>
          <el-table-column label="商品金额(元)">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.money)"
            ></div
          ></el-table-column>
          <el-table-column label="地址">
            <template slot-scope="scoped">
              <span>{{
                scoped.row.address ? scoped.row.address.address : "/"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <span
                ><el-button type="text" @click="checkDetail(scoped.row)"
                  >明细</el-button
                ><el-button
                  type="text"
                  @click="print(scoped.row)"
                  v-loading.fullscreen.lock="fullscreenLoading"
                  >打印</el-button
                ></span
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :pageSize="size"
          @pagination="fetchList"
          :currentPage="current_page"
        />
      </div>
    </div>
    <el-dialog
      ref="detail"
      :visible.sync="detailDialogVisible"
      width="520px"
      @close="closeDetailDialog"
      :title="dialogTitle"
      center
      :show-close="false"
      top="5vh"
    >
      <ul>
        <li v-if="isPrint">收货人：{{ detailForm.address.name }}</li>
        <li v-if="isPrint">手机号码：{{ detailForm.address.phone }}</li>
        <!-- <li v-if="isPrint">送货时间{{ detailForm.address.name }}</li> -->
        <li v-if="isPrint">
          送货地址：{{
            detailForm.address.province +
              detailForm.address.city +
              detailForm.address.area +
              detailForm.address.address
          }}
        </li>
      </ul>
      <p v-if="isPrint" style="textAlign:center">订单明细</p>
      <el-table
        size="mini"
        :data="detailForm.products"
        :cell-class-name="tableRowClassName"
        :header-cell-class-name="tableRowClassName"
      >
        <el-table-column label="类型" prop="category" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="单位" prop="unit" />
        <el-table-column label="数量" prop="count" />
        <el-table-column label="金额" prop="price">
          <div
            slot-scope="scoped"
            v-html="showCellData(scoped.row.price)"
          ></div>
        </el-table-column>
      </el-table>
    </el-dialog>
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
export default {
  components: { Pagination },
  data() {
    return {
      fullscreenLoading: false,
      grade: store.getters.grade,
      isPrint: false,
      detailDialogVisible: false,
      companyList: [],
      departmentList: [],
      goodStateOptions: good_state,
      formdata: {
        date: [
          moment()
            .subtract(7, "d")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ]
      },
      tableData: [
        /*        {
          order_id: 6,
          create_time: "2019-09-28 08:14:10",
          used_time: null,
          username: "LANGBIN",
          phone: "15521323081",
          order_count: 2,
          money: 10,
          address_id: 1,
          address: {
            id: 1,
            address: "江门市白石大道东4号路3栋"
          }
        }*/
      ],
      detailForm: {
        products: [
          /*      {
            category: "111",
            name: "11111",
            price: "1111",
            unit: "11111",
            count: "111"
          }*/
        ]
      },
      current_page: 1,
      size: 10,
      total: 0
    };
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
  computed: {
    companiesVisible() {
      return this.grade !== 3;
    },
    isDisabled() {
      return !!!this.formdata.date;
    },
    dialogTitle() {
      return !this.isPrint ? "订单明细" : "小票";
    }
  },
  async created() {
    if (this.companiesVisible) {
      await this.getCompanies();
    } else {
      await this.getDepartmentListWithoutCid();
    }
    await this.fetchList(1);
  },
  methods: {
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      return "table-border";
    },
    async getCompanies() {
      await $axios
        .get("http://canteen.tonglingok.com/api/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          let companiesList = flatten(arr);
          this.companyList = companiesList;
          this.formdata.company_id = companiesList[0].id;
          this.getDepartmentList(companiesList[0].id);
        })
        .catch(err => console.log(err));
    },
    async getDepartmentList(company_id) {
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/departments?c_id=${company_id}`
      );
      if (res.msg === "ok") {
        this.departmentList = unshiftAllOptions(Array.from(flatten(res.data)));
        this.formdata.department_id = this.departmentList[0].id;
      }
    },
    async getDepartmentListWithoutCid() {
      const res = await $axios.get(
        "http://canteen.tonglingok.com/api/v1/admin/departments"
      );
      if (res.msg === "ok") {
        this.departmentList = unshiftAllOptions(Array.from(res.data));
        this.formdata.department_id = this.departmentList[0].id;
      }
    },
    async fetchList(page) {
      page = typeof page === Number ? page : 1;
      // page = page || 1;
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/shop/order/statistic/manager?page=${page}&size=${
          this.size
        }`,
        this.formdata
      );
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.total = res.data.total;
        this.current_page = res.data.current_page;
      }
    },
    closeDetailDialog() {
      this.detailDialogVisible = false;
      this.isPrint = false;
      this.detailForm = {};
    },
    async checkDetail(row) {
      let id = row.order_id;
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/shop/order/products?order_id=${id}`
      );
      if (res.msg === "ok") {
        this.detailForm = Object.assign({}, res.data);
        this.detailDialogVisible = true;
      }
      // console.log(this.$refs.detail.$el.innerHTML);
    },
    async print(row) {
      this.isPrint = true;
      let id = row.order_id;
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/shop/order/products?order_id=${id}`
      );
      if (res.msg === "ok") {
        this.detailForm = Object.assign({}, res.data);
        this.detailDialogVisible = true;
      }
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$print(this.$refs.detail, { noPrint: ".el-button" });
      }, 1000);
    },
    deriveData() {
      console.log("点击导出表格");
    }
  }
};
</script>

<style lang="scss" scpoed>
.el-table .table-border {
  border: 1px solid #111;
}
.el-table::before {
  height: 0;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.shop-order-detail-manager {
  .el-select {
    width: 220px;
  }
  .main-header {
    .select-title {
      float: left;
      width: 90%;
      display: flex;
      flex-wrap: wrap;
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
