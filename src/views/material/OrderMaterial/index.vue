<template>
  <div class="order-material">
    <div class="nav-title">材料明细下单表</div>
    <el-divider />
    <div class="main">
      <div class="main-header">
        <el-form :inline="true" :model="queryForm">
          <el-form-item label="时间">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="queryForm.date"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              type="daterange"
            />
          </el-form-item>
          <el-form-item label="公司" v-if="companiesVisible" prop="company_id">
            <el-select
              @change="getCanteenOptions"
              placeholder="请选择企业"
              filterable
              v-model="queryForm.company_id"
            >
              <el-option
                v-for="item in companyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="消费地点" prop="canteen_id">
            <el-select v-model="queryForm.canteen_id">
              <el-option
                v-for="item in canteenOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="queryList(1)" plain>查询</el-button>
          <el-button type="primary">导出</el-button>
          <el-button type="primary" @click="createCell">提交</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table style="width:100%" :data="tableData">
          <el-table-column type="index" width="50px" />
          <el-table-column label="日期" prop="ordering_date" />
          <el-table-column label="餐次" prop="dinner" />
          <el-table-column label="材料名称" prop="material" />
          <el-table-column label="材料数量" prop="order_count" />
          <el-table-column label="订货数量" prop="material_count">
            <template slot-scope="scoped">
              <el-input
                size="mini"
                width="50px"
                v-model="scoped.row.material_count"
              />
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="material_price">
            <template slot-scope="scoped">
              <el-input
                size="mini"
                width="50px"
                v-model="scoped.row.material_price"
              />
            </template>
          </el-table-column>
          <el-table-column label="总价">
            <template slot-scope="scoped">
              <span>{{
                scoped.row.material_count * scoped.row.material_price
              }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :currentPage="current_page"
          :pageSize="size"
          @pagination="queryList"
        />
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      title="报表名称"
      @close="closeDialog"
    >
      <el-form label-width="100px">
        <el-form-item label="报表名称">
          <el-input v-model="updateForm.title" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import $axios from "@/api/index";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";
import moment from "moment";

export default {
  components: { Pagination },
  computed: {
    companiesVisible() {
      return this.grade !== 3;
    }
  },
  watch: {
    queryForm: {
      handler: function(val, oldVal) {
        if (val.date) {
          this.queryForm.time_begin = this.queryForm.date[0];
          this.queryForm.time_end = this.queryForm.date[1];
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      grade: store.getters.grade,
      dialogVisible: false,
      companyOptions: [],
      canteenOptions: [],
      dinnerOptions: [],
      tableData: [],
      queryForm: {
        date: [
          moment()
            .subtract(7, "d")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ],
        company_id: "",
        canteen_id: ""
      },
      updateForm: {},
      current_page: 1,
      size: 50,
      total: 0
    };
  },
  async created() {
    if (this.companiesVisible) {
      await this.getCompanies();
      await this.queryList(1);
    } else {
      await this.getCanteenOptions(0);
      await this.queryList(1);
    }
  },
  methods: {
    async getCompanies() {
      const res = await $axios.get(
        "http://canteen.tonglingok.com/api/v1/admin/companies"
      );
      if (res.msg === "ok") {
        this.companyOptions = flatten(res.data);
        this.queryForm.company_id = this.companyOptions[0].id;
        await this.getCanteenOptions(this.queryForm.company_id);
      }
    },
    async getCanteenOptions(c_id) {
      let company_id = c_id || "";
      this.canteenOptions = [];
      this.queryForm.canteen_id = "";
      if (Number(company_id)) {
        const res = await $axios.get(
          `http://canteen.tonglingok.com/api/v1/canteens?company_id=${company_id}`
        );
        if (res.msg === "ok") {
          this.canteenOptions = Array.from(res.data);
          this.queryForm.canteen_id = this.canteenOptions[0].id;
        }
        return res;
      }
    },
    async getDinnerOptions(canteen_id) {
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/canteen/dinners?canteen_id=${canteen_id}`
      );
      if (res.msg === "ok") {
        this.dinnerOptions = Array.from(res.data);
      }
    },
    async queryList(page) {
      page = page || 1;
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/order/materialsStatistic?page=${page}&size=${
          this.size
        }`,
        this.queryForm
      );
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.list.data);
        this.total = res.data.list.total;
        this.current_page = res.data.list.current_page;
      }
    },
    createCell() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.updateForm.title = "";
    },
    async submitOrder() {
      this.updateForm = Object.assign({}, this.updateForm, this.queryForm);
      this.updateForm.materials = JSON.stringify(this.tableData);
      console.log(this.updateForm);
      const res = await $axios.post(
        "http://canteen.tonglingok.com/api/v1/order/material/update",
        this.updateForm
      );
      if (res.msg === "ok") {
        this.queryForm = {};
        this.tableData = [];
        this.closeDialog();
      } else {
        this.closeDialog();
        this.$message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.order-material {
  .main {
    .main-header {
      .el-select {
        width: 160px;
      }
      .el-input {
        width: 160px;
      }
    }
  }
}
</style>
