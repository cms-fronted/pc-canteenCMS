<template>
  <div class="order-statistics">
    <div class="nav-title">消费总报表</div>
    <el-divider />
    <div class="main">
      <div class="main-header">
        <div class="select-title">
          <el-form :model="formdata" label-width="70px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="时间">
                  <el-date-picker
                    class="date-picker"
                    value-format="yyyy-MM-dd"
                    v-model="formdata.date"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    type="daterange"
                  /> </el-form-item
              ></el-col>
              <el-col :span="6">
                <el-form-item label="公司" v-if="companiesVisible">
                  <el-select
                    placeholder="请选择企业"
                    filterable
                    v-model="formdata.company_ids"
                    @change="getList"
                  >
                    <el-option
                      v-for="item in companiesList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select> </el-form-item
              ></el-col>
              <el-col :span="6">
                <el-form-item label="消费地点">
                  <el-select
                    v-model="formdata.canteen_id"
                    placeholder="请选择饭堂"
                  >
                    <el-option
                      v-for="item in locationList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select> </el-form-item
              ></el-col>
              <el-col :span="6">
                <el-form-item label="部门" v-if="companiesVisible">
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
                  </el-select> </el-form-item
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="姓名">
                  <el-input
                    v-model="formdata.username"
                    placeholder="请输入姓名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="消费类型">
                  <el-select v-model="formdata.status">
                    <el-option
                      v-for="item in consumptionOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="人员类型">
                  <el-select v-model="formdata.staff_type_id">
                    <el-option
                      v-for="item in roleOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select> </el-form-item
              ></el-col>
            </el-row>

            <el-form-item class="types-radio">
              <el-radio-group
                v-model="formdata.type"
                @change="queryList(current_page)"
              >
                <el-radio :label="1">按部门汇总</el-radio>
                <el-radio :label="2">按姓名汇总</el-radio>
                <el-radio :label="3">按人员类型汇总</el-radio>
                <el-radio :label="4">按消费地点汇总</el-radio>
                <el-radio :label="5">按消费类型汇总</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-area">
          <el-button type="primary" @click="queryList" :disabled="isDisabled"
            >查询</el-button
          >
          <el-button type="primary" @click="exportFile">导出</el-button>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="main-content">
        <el-table
          :data="tableData"
          border
          show-summary
          :summary-method="getOuterSum"
        >
          <el-table-column type="expand" width="60px">
            <template slot-scope="tableScoped">
              <el-table
                size="mini"
                :data="
                  tableScoped.row.dinnerStatistic ||
                    tableScoped.row.dinner_statistic
                "
                show-summary
                :summary-method="getInnerSum"
              >
                <el-table-column prop="dinner" label="餐次信息">
                  <div
                    slot-scope="scoped"
                    v-html="showCellData(scoped.row.dinner)"
                  ></div>
                </el-table-column>
                <el-table-column label="订餐数量" prop="order_count">
                  <div
                    slot-scope="scoped"
                    v-html="showCellData(scoped.row.order_count)"
                  ></div
                ></el-table-column>
                <el-table-column label="金额" prop="order_money">
                  <div
                    slot-scope="scoped"
                    v-html="showCellData(scoped.row.order_money)"
                  ></div
                ></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="统计变量">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.statistic)"
            ></div
          ></el-table-column>
          <el-table-column label="开始时间">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.time_begin)"
            ></div
          ></el-table-column>
          <el-table-column label="结束时间">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.time_end)"
            ></div
          ></el-table-column>
          <el-table-column label="姓名">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.username)"
            ></div
          ></el-table-column>
          <el-table-column label="部门">
            <div
              slot-scope="scoped"
              v-html="showCellData(scoped.row.department)"
            ></div
          ></el-table-column>
        </el-table>
        <pagination
          v-if="formdata.type === 2 && total > 10"
          :total="total"
          :pageSize="size"
          :currentPage="current_page"
          @pagination="queryList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";
import moment from "moment";

const consumption_options = [
  { id: 0, name: "全部" },
  { id: 1, name: "订餐就餐" },
  { id: 2, name: "订餐未就餐" },
  { id: 3, name: "未订餐就餐" },
  { id: 4, name: "补录操作" }
];
export default {
  components: { Pagination },
  data() {
    return {
      grade: store.getters.grade,
      company_id: "",
      canteen_id: "",
      formdata: {
        type: 1,
        date: [
          moment()
            .subtract(7, "d")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ],
        time_begin: "",
        time_end: "",
        staff_type_id: "",
        name: "",
        status: "",
        department_id: "",
        canteen_id: ""
      },
      departmentList: [],
      locationList: [],
      companiesList: [],
      roleOptions: [],
      tableData: [
        /* {
          statistic: "股东",
          time_begin: "2019-10-11",
          time_end: "2019-11-30",
          department: "股东",
          dinnerStatistic: [
            {
              dinner_id: 6,
              dinner: "中餐",
              order_count: "8",
              order_money: 28
            },
            {
              dinner_id: 5,
              dinner: "早餐",
              order_count: "2",
              order_money: 4
            },
            {
              dinner_id: 7,
              dinner: "晚餐",
              order_count: "5",
              order_money: 3
            }
          ]
        }*/
      ],
      summary: {
        allMoney: 0,
        allCount: 0
      },
      consumptionOptions: consumption_options,
      current_page: 1,
      size: 10,
      total: 0
    };
  },
  computed: {
    isDisabled() {
      return !!!this.formdata.date;
    },
    companiesVisible() {
      return this.grade != 3;
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
  async created() {
    if (this.companiesVisible) {
      await this.getCompanies();
      await this.getRoleType();
      await this.queryList(1);
    } else {
      await this.getLocationList();
      await this.getDepartmentListWithoutCid();
      await this.getRoleType();
      await this.queryList(1);
    }
  },
  methods: {
    getList(val) {
      if (String(val).includes(",")) {
        this.departmentList = [{ name: "全部", id: 0 }];
        this.locationList = [{ name: "全部", id: 0 }];
        this.formdata.department_id = 0;
        this.formdata.canteen_id = 0;
      } else {
        this.getDepartmentList(val);
        this.getLocationList(val);
      }
    },
    async getCompanies() {
      const res = await $axios.get(
        "https://tonglingok.com/canteen/api/v1/admin/companies"
      );
      if (res.msg === "ok") {
        let arr = res.data;
        let companiesList = getAllOptions(flatten(arr));
        this.companiesList = companiesList;
        this.departmentList = [{ name: "全部", id: 0 }];
        this.locationList = [{ name: "全部", id: 0 }];
        this.formdata.department_id = 0;
        this.formdata.canteen_id = 0;
        this.formdata.company_ids = this.companiesList[0].id;
        await this.getLocationList(this.formdata.company_ids);
      }
    },

    async getDepartmentListWithoutCid() {
      const res = await $axios.get(
        "https://tonglingok.com/canteen/api/v1/admin/departments"
      );
      if (res.msg === "ok") {
        this.departmentList = unshiftAllOptions(Array.from(res.data));
        this.formdata.department_id = this.departmentList[0].id;
      }
    },
    async getDepartmentList(company_id) {
      if (company_id && Number(company_id)) {
        await $axios
          .get(
            `https://tonglingok.com/canteen/api/v1/departments?c_id=${company_id}`
          )
          .then(res => {
            let arr = res.data;
            let departmentList = unshiftAllOptions(flatten(arr));
            this.departmentList = departmentList;
            this.formdata.department_id = this.departmentList[0].id;
          })
          .catch(err => console.log(err));
      }
    },
    async getLocationList(company_id) {
      let res = null;
      if (company_id && Number(company_id)) {
        res = await $axios.get(
          `https://tonglingok.com/canteen/api/v1/canteens?company_id=${company_id}`
        );
      } else {
        res = await $axios.get(
          "https://tonglingok.com/canteen/api/v1/managerCanteens"
        );
      }
      if (res.msg === "ok") {
        this.locationList = unshiftAllOptions(Array.from(res.data));
        this.formdata.canteen_id = this.locationList[0].id;
      }
    },
    async getRoleType() {
      const res = await $axios.get(
        "https://tonglingok.com/canteen/api/v1/role/types"
      );
      if (res.msg === "ok") {
        this.roleOptions = unshiftAllOptions(res.data.data);
        this.formdata.staff_type_id = this.roleOptions[0].id;
      }
    },
    async exportFile() {
      if (this.formdata.canteen_id) {
        delete this.formdata.company_ids;
      }
      await this.$exportExcel(
        "https://tonglingok.com/canteen/api/v1/order/consumptionStatistic/export",
        this.formdata
      );
    },
    async queryList(page) {
      if (this.formdata.canteen_id) {
        delete this.formdata.company_ids;
      }
      page = typeof page == "number" ? page : 1;
      const type = this.formdata.type;
      if (this.formdata.canteen_id) {
        delete this.formdata.company_ids;
      }
      const res = await $axios.get(
        `https://tonglingok.com/canteen/api/v1/order/consumptionStatistic?page=${page}&size=${
          this.size
        }`,
        this.formdata
      );
      if (res.msg === "ok") {
        if (type === 2) {
          this.tableData = Array.from(res.data.data);
          this.current_page = res.data.current_page;
          this.total = res.data.total;
          this.summary.allMoney = "";
          this.summary.allCount = "/";
        } else {
          this.tableData = Array.from(res.data.statistic);
          this.current_page = res.data.current_page;
          this.total = res.data.total;
          this.summary.allMoney = res.data.allMoney;
          this.summary.allCount = res.data.allCount;
        }
      }
    },
    getInnerSum(params) {
      const { columns, data } = params;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[0] = "合计";
          return;
        }
        const values = data.map(item => {
          return Number(item[column.property]); // property为el-table标签钟的prop属性值
        });
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          index == 1 ? (sums[index] += "次") : (sums[index] += "元");
        } else {
          sums[index] = "N/A";
        }
      });
      return sums;
    },
    getOuterSum(params) {
      const { columns, data } = params;
      const sums = ["合计", "/", "/", "/"];
      sums[1] = this.summary.allCount + "个";
      sums[5] = "总金额：" + this.summary.allMoney + "元";
      return sums;
    }
  }
};
</script>

<style lang="scss" scoped>
.order-statistics {
  // .main-header {
  //   .select-title {
  //     float: left;
  //     width: 90%;
  //     display: flex;
  //     flex-wrap: wrap;
  //     .el-input {
  //       width: 200px;
  //     }
  //     .el-select {
  //       width: 200px;
  //     }
  .types-radio {
    display: flex;
    justify-content: space-between;
    .el-radio-group {
      display: block;
    }
  }
  //   }
  //   .btn-area {
  //     float: right;
  //     width: 10%;
  //     display: flex;
  //     flex-direction: column;
  //     display: block;
  //     .el-button {
  //       margin-bottom: 20px;
  //     }
  //   }
  // }
}
</style>
