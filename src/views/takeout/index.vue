<template>
  <div class="takeout">
    <div class="nav-title">外卖管理</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :model="queryForm" :inline="true">
          <el-form-item label="日期">
            <el-date-picker
              v-model="queryForm.ordering_date"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd"
              type="datetime"
              style="width:140px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="公司" v-if="companiesVisible">
            <el-select
              filterable
              v-model="queryForm.company_ids"
              @change="getCanteenOptions"
              placeholder="请选择公司"
            >
              <el-option
                v-for="item in companyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
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
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="餐次">
            <el-select v-model="queryForm.dinner_id" placeholder="请选择餐次">
              <el-option
                v-for="item in dinnersOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="used">
            <el-select v-model="queryForm.used">
              <el-option label="全部" :value="3"></el-option>
              <el-option label="已打印" :value="1"></el-option>
              <el-option label="未打印" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="queryList" :disabled="isDisabled"
            >查询</el-button
          >
          <el-button type="primary">导出</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table :data="tableData" border style="width:100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="订单ID" prop="order_id"></el-table-column>
          <el-table-column label="日期" prop="ordering_date"></el-table-column>
          <el-table-column label="消费地点" prop="canteen"></el-table-column>
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="手机号码" prop="phone"></el-table-column>
          <el-table-column label="餐次">
            <template slot-scope="scoped">
              <span>
                <el-button
                  type="text"
                  @click="openDetailDialog(scoped.row.dinner)"
                  >{{ scoped.row.dinner }}</el-button
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="money"></el-table-column>
          <el-table-column label="送货地点" show-overflow-tooltip>
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
          <el-table-column label="状态">
            <template slot-scope="scoped">
              <el-tag :type="scoped.row.used === 1 ? 'success' : 'warning'">
                {{ scoped.row.used === 1 ? "已派单" : "未派单" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <span v-if="scoped.row.used === 2">
                <el-button type="success" @click="openDetailDialog(scoped.row)"
                  >打印小票</el-button
                >
              </span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-if="!tableData"
          :total="total"
          :page="current_page"
          @pagination="queryList"
        ></pagination>
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
        <li>送货时间：{{ detailForm.address.name }}</li>
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
          <template slot-scope="scoped">
            {{ scoped.row.price ? scoped.row.price : "/" }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";
export default {
  data() {
    return {
      grade: store.getters.grade,
      detailDialogVisible: false,
      queryForm: {
        ordering_date: "",
        company_ids: null,
        dinner_id: "",
        canteen_id: "",
        used: 3
      },
      tableData: [],
      canteenOptions: [],
      companyOptions: [],
      dinnersOptions: [],
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
      return this.grade !== 3;
    }
  },
  watch: {
    isAble(val) {
      this.isDisabled = !val;
    }
  },
  created() {
    if (this.companiesVisible) {
      this.getCompanyOptions();
    } else {
      this.getCanteenOptions();
    }
  },
  methods: {
    async getCompanyOptions() {
      const res = await $axios.get(
        "http://canteen.tonglingok.com/api/v1/admin/companies"
      );
      if (res.msg === "ok") {
        this.companyOptions = getAllOptions(flatten(res.data));
      }
    },
    async getCanteenOptions(company_ids) {
      this.canteenOptions = [];
      this.dinnersOptions = [];
      this.queryForm.dinner_id = null;
      this.queryForm.canteen_id = null;
      let res;
      if (company_ids) {
        if (!Number(company_ids)) return;
        res = await $axios.get(
          `http://canteen.tonglingok.com/api/v1/canteens?company_id=${company_ids}`
        );
      } else {
        res = await $axios.get(
          "http://canteen.tonglingok.com/api/v1/managerCanteens"
        );
      }
      if (res.msg === "ok") {
        this.canteenOptions = unshiftAllOptions(Array.from(res.data));
      }
    },
    async getDinnersOptions(canteen_id) {
      //饭堂不为全部时， 0 为全部
      if (canteen_id) {
        const res = await $axios.get(
          `http://canteen.tonglingok.com/api/v1/canteen/dinners?canteen_id=${canteen_id}`
        );
        if (res.msg === "ok") {
          this.dinnersOptions = unshiftAllOptions(Array.from(res.data));
        }
      }
    },
    async queryList() {
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.canteen_id = queryForm.canteen_id ? queryForm.canteen_id : 0;
      queryForm.dinner_id = queryForm.dinner_id ? queryForm.dinner_id : 0;
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/order/takeoutStatistic?page=${
          this.current_page
        }&size=${this.size}`,
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
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/order/info/print?order_id=${id}`
      );
      if (res.msg === "ok") {
        this.detailForm = res.data;
        this.detailDialogVisible = true;
        setTimeout(() => {
          this.$print(this.$refs.print);
        }, 1000);
      }
    },
    async closeDetailDialog() {
      this.detailDialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.takeout {
  .el-select,
  .el-input {
    width: 120px;
  }
}
</style>
