<template>
  <div class="material-storage">
    <div class="nav-title">入库材料管理</div>
    <el-divider></el-divider>
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
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消费地点" prop="canteen_id">
            <el-select v-model="queryForm.canteen_id">
              <el-option
                v-for="item in canteenOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="queryList(1)">查询</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table :data="tableData">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="消费地点">
            <template slot-scope="scoped">
              <span>{{ scoped.row.canteen.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报表名称" prop="title"></el-table-column>
          <el-table-column
            label="生成时间"
            prop="create_time"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <span>
                <el-button type="text" @click="showDetail(scoped.row)"
                  >查询</el-button
                >
                <el-button type="text" @click="exportFile(scoped.row)"
                  >导出</el-button
                >
                <el-button type="text" @click="deleteDetail(scoped.row)"
                  >作废</el-button
                >
              </span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :currentPage="current_page"
          :pageSize="size"
          @pagination="queryList"
        ></pagination>
      </div>
    </div>
    <el-dialog
      :visible.sync="detailVisible"
      @close="closeDetailDialog"
      title="明细"
      center
      width="60%"
    >
      <el-card>
        <div slot="header" class="clearfix">
          <span>{{ detailForm.title }}</span>
          <span style="float: right">总价：{{ detailMoney }}</span>
        </div>
        <el-table :data="detailData">
          <el-table-column type="index" width="50px"></el-table-column>
          <el-table-column label="日期" prop="ordering_date"></el-table-column>
          <el-table-column label="餐次" prop="dinner"></el-table-column>
          <el-table-column label="材料名称" prop="material"></el-table-column>
          <!-- <el-table-column label="单位" prop=""></el-table-column> -->
          <el-table-column
            label="材料数量"
            prop="order_count"
          ></el-table-column>
          <el-table-column
            label="订货数量"
            prop="material_count"
          ></el-table-column>
          <el-table-column label="单价" prop="material_price"></el-table-column>
          <el-table-column label="总价">
            <template slot-scope="scoped">
              <span>{{
                scoped.row.material_count * scoped.row.material_price
              }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="detailTotal"
          :pageSize="detailSize"
          :current_page="detailCurrentPage"
          @pagination="getDetailList"
        ></pagination>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import { mapState } from "vuex";
import Pagination from "@/components/Pagination";
import { flatten, unshiftAllOptions } from "@/utils/flatternArr";
import moment from "moment";
export default {
  components: { Pagination },
  data() {
    return {
      detailVisible: false,
      companyOptions: [],
      canteenOptions: [],
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
      tableData: [],
      detailData: [],
      detailForm: {},
      current_page: 1,
      size: 10,
      total: 0,
      detailTotal: 0,
      detailSize: 5,
      detailMoney: 0,
      detailCurrentPage: 1,
      checked_id: []
    };
  },
  computed: {
    ...mapState({
      role: state => state.user.role,
      grade: state => state.user.grade,
      token: state => state.user.token
    }),
    companiesVisible() {
      return this.grade != 3;
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
  async created() {
    if (this.companiesVisible) {
      await this.getCompanies();
    } else {
      await this.getCanteenOptions();
    }
    await this.queryList(1);
  },
  methods: {
    async getCompanies() {
      const res = await $axios.get(
        "https://tonglingok.com/canteen/api/v1/admin/companies"
      );
      if (res.msg === "ok") {
        this.companyOptions = flatten(res.data);
        this.queryForm.company_id = this.companyOptions[0].id;
        await this.getCanteenOptions(this.queryForm.company_id);
      }
    },
    async getCanteenOptions(c_id) {
      let company_id = c_id || localStorage.getItem("company_id");
      const res = await $axios.get(
        `https://tonglingok.com/canteen/api/v1/canteens?company_id=${company_id}`
      );
      if (res.msg === "ok") {
        this.canteenOptions = Array.from(res.data);
        this.queryForm.canteen_id = this.canteenOptions[0].id;
      }
      return res;
    },
    async exportFile(row) {
      let id = row.id;
      this.$exportExcel(
        "https://tonglingok.com/canteen/api/v1/material/exportMaterialReports",
        { report_id: id }
      );
    },
    async queryList(page) {
      page = page || 1;
      const res = await $axios.get(
        `https://tonglingok.com/canteen/api/v1/order/material/reports?page=${page}&size=${
          this.size
        }`,
        this.queryForm
      );
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.total = res.data.total;
        this.current_page = res.data.current_page;
      }
    },
    async getDetailList(page) {
      page = page || 1;
      const res = await $axios.get(
        `https://tonglingok.com/canteen/api/v1/order/material/report?page=${page}&size=${
          this.detailSize
        }&id=${this.detailForm.id}`
      );
      if (res.msg === "ok") {
        this.detailData = Array.from(res.data.list.data);
        this.detailTotal = res.data.list.total;
        this.detailCurrentPage = res.data.list.current_page;
        this.detailMoney = res.data.money;
      }
      console.log(this.detailData);
    },
    handleSelectionChange(val) {
      console.log(val);
    },
    async showDetail(row) {
      this.detailForm = Object.assign({}, row);
      await this.getDetailList();
      this.detailVisible = true;
    },
    closeDetailDialog() {
      this.detailForm = {};
      this.detailData = [];
      this.detailVisible = false;
    },
    deleteDetail(row) {
      let id = row.id;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await $axios.post(
            "https://tonglingok.com/canteen/api/v1/order/material/report/delete",
            {
              id
            }
          );
          if (res.msg === "ok") {
            this.$message.success("操作成功!");
            this.queryList(this.current_page);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
.material-storage {
  .clearfix {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin: -20px;
    padding: 10px 20px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
}
</style>
