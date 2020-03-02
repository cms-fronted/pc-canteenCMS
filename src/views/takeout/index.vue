<template>
  <div class="takeout">
    <div class="nav-title">外卖管理</div>
    <el-divider />
    <div class="main">
      <div class="main-header">
        <el-form :model="queryForm" label-width="70px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="日期">
                <el-date-picker
                  v-model="queryForm.ordering_date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="datetime"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司" v-if="companiesVisible">
                <el-select
                  filterable
                  v-model="queryForm.company_ids"
                  @change="getListOptions"
                  placeholder="请选择公司"
                >
                  <el-option
                    v-for="item in companyOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="饭堂">
                <el-select
                  v-model="queryForm.canteen_id"
                  @change="getDinnersOptions"
                  placeholder="请选择饭堂"
                >
                  <el-option
                    v-for="item in canteenOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="餐次">
                <el-select v-model="queryForm.dinner_id" placeholder="请选择餐次">
                  <el-option
                    v-for="item in dinnersOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="部门" prop="department">
                <el-select v-model="queryForm.department_id">
                  <el-option
                    v-for="item in departmentsOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="status">
                <el-select v-model="queryForm.status">
                  <el-option label="全部" :value="6" />
                  <el-option label="已支付" :value="1" />
                  <el-option label="已取消" :value="2" />
                  <el-option label="已接单" :value="3" />
                  <el-option label="已完成" :value="4" />
                  <el-option label="已退回" :value="5" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="人员类型" prop="user_type" label-width="100px">
                <el-select v-model="queryForm.user_type">
                  <el-option label="全部" :value="0" />
                  <el-option label="外来人员" :value="1" />
                  <el-option label="企业内部人员" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="btn-area">
          <el-button type="primary" @click="queryList" :disabled="isDisabled">查询</el-button>
          <el-button type="primary" @click="exportFile">导出</el-button>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="main-content">
        <el-table :data="tableData" border style="width:100%">
          <el-table-column type="selection" width="55" :selectable="selectable" />
          <el-table-column label="订单ID" prop="order_id" />
          <el-table-column label="日期" prop="ordering_date" />
          <el-table-column label="消费地点" prop="canteen" />
          <el-table-column label="用户名" prop="username" width="80px" />
          <el-table-column label="手机号码" prop="phone" />
          <el-table-column label="餐次" width="60px">
            <template slot-scope="scoped">
              <span>
                <el-button type="text" @click="openDetailDialog(scoped.row)">{{ scoped.row.dinner }}</el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="money" width="60px" />
          <el-table-column label="送货地点" min-width="200px">
            <template slot-scope="scoped">
              <span>
                {{
                scoped.row.province +
                scoped.row.area +
                scoped.row.city +
                scoped.row.address
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80px">
            <template slot-scope="scoped">
              <span v-if="scoped.row.status == 1">已支付</span>
              <span v-if="scoped.row.status == 2">已取消</span>
              <span v-if="scoped.row.status == 3">已接单</span>
              <span v-if="scoped.row.status == 4">已完成</span>
              <span v-if="scoped.row.status == 5">已退回</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <span v-if="scoped.row.used === 2">
                <el-button
                  type="success"
                  size="small"
                  @click="openDetailDialog(scoped.row, 'check')"
                >打印小票</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-if="!tableData" :total="total" :page="current_page" @pagination="queryList" />
      </div>
    </div>
    <el-dialog
      ref="print"
      :visible.sync="detailDialogVisible"
      width="375px"
      @close="closeDetailDialog"
      title="小票"
      center
      :show-close="false"
      top="5vh"
    >
      <ul>
        <li>收货人：{{ detailForm.address.name }}</li>
        <li>手机号码：{{ detailForm.address.phone }}</li>
        <!--        <li>送货时间：{{ detailForm.address.name }}</li>-->
        <li>
          送货地址：{{
          detailForm.address.province +
          detailForm.address.city +
          detailForm.address.area +
          detailForm.address.address
          }}
        </li>
      </ul>
      <p style="textAlign:center; fontSize:18px">订单明细</p>
      <el-table size="mini" :data="detailForm.foods">
        <el-table-column label="菜品" prop="name"></el-table-column>
        <el-table-column label="数量" prop="count"></el-table-column>
        <el-table-column label="金额" prop="price">
          <template slot-scope="scoped">{{ scoped.row.price ? scoped.row.price : "/" }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import moment from "moment";
import store from "@/store";
export default {
  data() {
    return {
      grade: store.getters.grade,
      detailDialogVisible: false,
      queryForm: {
        ordering_date: moment().format("YYYY-MM-DD"),
        company_ids: null,
        dinner_id: "",
        canteen_id: "",
        department_id: "",
        status: 6,
        user_type: 0
      },
      tableData: [],
      canteenOptions: [],
      companyOptions: [],
      dinnersOptions: [],
      departmentsOptions: [],
      detailForm: {
        id: 8,
        address_id: 1,
        d_id: 6,
        type: 2,
        create_time: "2019-09-09 16:34:15",
        hidden: 2,
        foods: [
          {
            detail_id: 5,
            o_id: 8,
            food_id: 1,
            count: 1,
            name: "菜品1",
            price: "5.0"
          },
          {
            detail_id: 6,
            o_id: 8,
            food_id: 3,
            count: 1,
            name: "菜品2",
            price: "5.0"
          }
        ],
        address: {
          id: 1,
          province: "广东省",
          city: "江门市",
          area: "蓬江区",
          address: "江门市白石大道东4号路3栋",
          name: "张三",
          phone: "18956225230",
          sex: 1
        }
      },
      total: 0,
      size: 10,
      current_page: 1,
      isDisabled: true
    };
  },
  computed: {
    isAble() {
      return !!this.queryForm.ordering_date && !!this.queryForm.company_ids;
    },
    companiesVisible() {
      return this.grade != 3;
    }
  },
  watch: {
    isAble(val) {
      this.isDisabled = !val;
    }
  },
  async created() {
    if (this.companiesVisible) {
      await this.getCompanyOptions();
      await this.queryList(1);
    } else {
      await this.getCanteenOptions();
      await this.getDepartmenOptionsWithoutCid();
      await this.queryList(1);
    }
  },
  components: { Pagination },
  methods: {
    async getCompanyOptions() {
      const res = await $axios.get("/api/v1/admin/companies");
      if (res.msg === "ok") {
        this.companyOptions = getAllOptions(flatten(res.data));
        this.queryForm.company_ids = this.companyOptions[0].id;
        this.canteenOptions = [{ name: "全部", id: 0 }];
        this.dinnersOptions = [{ name: "全部", id: 0 }];
        this.departmentsOptions = [{ name: "全部", id: 0 }];
        this.queryForm.dinner_id = 0;
        this.queryForm.canteen_id = 0;
        this.queryForm.department_id = 0;
        if (this.companyOptions.length === 1) {
          await this.getListOptions(this.companyOptions[0].id);
        }
      }
    },
    async getListOptions(company_ids) {
      this.canteenOptions = [{ name: "全部", id: 0 }];
      this.dinnersOptions = [{ name: "全部", id: 0 }];
      this.departmentsOptions = [{ name: "全部", id: 0 }];
      this.queryForm.dinner_id = 0;
      this.queryForm.canteen_id = 0;
      this.queryForm.department_id = 0;
      await this.getCanteenOptions(company_ids);
      await this.getDepartmentOptions(company_ids);
    },
    async getDepartmentOptions(company_ids) {
      const res = await $axios.get(`/api/v1/departments?c_id=${company_ids}`);
      if (res.msg === "ok") {
        this.departmentsOptions = unshiftAllOptions(
          Array.from(flatten(res.data))
        );
        this.queryForm.department_id = this.departmentsOptions[0].id;
      }
    },
    async getDepartmenOptionsWithoutCid() {
      const res = await $axios.get("/api/v1/admin/departments");
      if (res.msg === "ok") {
        this.departmentsOptions = unshiftAllOptions(Array.from(res.data));
        this.queryForm.department_id = this.departmentsOptions[0].id;
      }
    },
    async getCanteenOptions(company_ids) {
      this.canteenOptions = [{ name: "全部", id: 0 }];
      this.dinnersOptions = [{ name: "全部", id: 0 }];
      this.queryForm.dinner_id = 0;
      this.queryForm.canteen_id = 0;
      let res;
      if (company_ids) {
        if (!Number(company_ids)) return;
        res = await $axios.get(`/api/v1/canteens?company_id=${company_ids}`);
      } else {
        res = await $axios.get("/api/v1/managerCanteens");
      }
      if (res.msg === "ok") {
        this.canteenOptions = unshiftAllOptions(Array.from(res.data));
        this.queryForm.canteen_id = this.canteenOptions[0].id;
      }
    },
    async getDinnersOptions(canteen_id) {
      //饭堂不为全部时， 0 为全部
      if (canteen_id) {
        const res = await $axios.get(
          `/api/v1/canteen/dinners?canteen_id=${canteen_id}`
        );
        if (res.msg === "ok") {
          this.dinnersOptions = unshiftAllOptions(Array.from(res.data));
        }
      }
    },
    async exportFile() {
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.canteen_id = queryForm.canteen_id ? queryForm.canteen_id : 0;
      queryForm.dinner_id = queryForm.dinner_id ? queryForm.dinner_id : 0;
      await this.$exportExcel(
        "/api/v1/order/takeoutStatistic/export",
        queryForm
      );
    },
    async queryList(page) {
      page = typeof page == "number" ? page : 1;
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.canteen_id = queryForm.canteen_id ? queryForm.canteen_id : 0;
      queryForm.dinner_id = queryForm.dinner_id ? queryForm.dinner_id : 0;
      const res = await $axios.get(
        `/api/v1/order/takeoutStatistic?page=${page}&size=${this.size}`,
        queryForm
      );
      if (res.msg === "ok") {
        this.tableData = [...res.data.data];
        this.total = res.data.total;
        this.current_page = res.data.current_page;
      }
    },
    async openDetailDialog(row) {
      let id = row.order_id;
      const res = await $axios.get(`/api/v1/order/info/print?order_id=${id}`);
      if (res.msg === "ok") {
        this.detailForm = res.data;
        this.detailDialogVisible = true;
        setTimeout(() => {
          this.$print(this.$refs.print);
        }, 1000);
      }
      await $axios.post("/api/v1/order/used", { ids: id }).then(res => {
        if (res.msg === "ok") {
          this.$message.success("外卖订单完成");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    async closeDetailDialog() {
      this.detailDialogVisible = false;
    },
    selectable(row, index) {
      if (row.status != 1) {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
