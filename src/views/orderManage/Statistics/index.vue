<template>
  <div>
    <div class="statistics">
      <div class="nav-title">订餐统计</div>
      <el-divider />
      <div class="main">
        <div class="main-header">
          <div class="select-title">
            <el-form label-width="70px" :model="formdata">
              <el-row :gutter="10">
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
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="公司" v-if="companiesVisible">
                    <el-select
                      v-model="formdata.company_ids"
                      placeholder="请选择公司"
                      filterable
                      @change="getList"
                    >
                      <el-option
                        v-for="item in companyOptions"
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
                      placeholder="请选择消费地点"
                    >
                      <el-option
                        v-for="item in canteenOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select> </el-form-item
                ></el-col>
              </el-row>
            </el-form>
          </div>
          <div class="btn-area">
            <el-button
              type="primary"
              @click="queryList(1)"
              :disabled="isDisabled"
              plain
              >查询</el-button
            >
            <el-button type="primary" @click="exportFile">导出</el-button>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border>
            <el-table-column label="日期" prop="ordering_date" />
            <el-table-column label="公司" prop="company" />
            <el-table-column label="消费地点" prop="canteen" />
            <el-table-column label="餐次" prop="dinner" />
            <el-table-column label="消费人数" prop="count" />
          </el-table>
          <pagination
            @pagination="queryList"
            :total="total"
            :pageSize="size"
            :currentPage="current_page"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import Pagination from "@/components/Pagination";
import store from "@/store";
import moment from "moment";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      grade: store.getters.grade,
      formdata: {
        date: [
          moment()
            .subtract(7, "d")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ],
        time_begin: "",
        time_end: "",
        company_ids: "",
        canteen_id: ""
      },
      company_id: "",
      canteen_id: "",
      companyOptions: [],
      canteenOptions: [],
      tableData: [],
      spanArr: [], //二维数组，用于存放单元格合并规则
      position: 0, //用于存储相同项的开始index
      // isDisabled: true,
      current_page: 1,
      size: 10,
      total: 0
    };
  },
  async created() {
    if (this.companiesVisible) {
      await this.getCompanies();
      await this.queryList(1);
    } else {
      await this.getLocationList();
      await this.queryList(1);
    }
  },
  computed: {
    companiesVisible() {
      return this.grade != 3;
    },
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
    getList(val) {
      this.formdata.canteen_id = "";
      if (String(val).includes(",")) {
        this.canteenOptions = [{ name: "全部", id: 0 }];
        this.formdata.canteen_id = 0;
      } else {
        this.getLocationList(val);
      }
    },
    async getCompanies() {
      const res = await $axios.get(
        "/api/v1/admin/companies"
      );
      if (res.msg == "ok") {
        let arr = res.data;
        let companiesList = getAllOptions(flatten(arr));
        this.companyOptions = companiesList;
        this.formdata.company_ids = this.companyOptions[0].id;
        this.canteenOptions = [{ name: "全部", id: 0 }];
        this.formdata.canteen_id = 0;
        await this.getLocationList(this.companyOptions[0].id);
      }
    },
    async getLocationList(company_id) {
      let res;
      if (company_id) {
        res = await $axios.get(
          `/api/v1/canteens?company_id=${company_id}`
        );
      } else {
        res = await $axios.get(
          "/api/v1/managerCanteens"
        );
        this.formdata.company_ids = localStorage.getItem('company_id');
      }
      if (res.msg === "ok") {
        this.canteenOptions = unshiftAllOptions(Array.from(res.data));
        this.formdata.canteen_id = this.canteenOptions[0].id;
      }
    },
    async exportFile() {
      await this.$exportExcel(
        "/api/v1/order/orderStatistic/export",
        this.formdata
      );
    },
    async queryList(page) {
      page = typeof page == "number" ? page : 1;
      const res = await $axios.get(
        `/api/v1/order/orderStatistic?page=${page}&size=${this.size}`,
        this.formdata
      );
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.current_page = res.data.current_page;
        this.total = res.data.total;
        this.rowspan(0, "grade");
        this.rowspan(1, "company_name");
        this.rowspan(2, "canteen_name");
        this.rowspan(3, "category_name");
      }
    },
    rowspan(idx, prop) {
      this.spanArr[idx] = [];
      this.position = 0;
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr[idx].push(1);
          this.position = 0;
        } else {
          if (this.tableData[index][prop] === this.tableData[index - 1][prop]) {
            this.spanArr[idx][this.position] += 1; //有相同项
            this.spanArr[idx].push(0); // 名称相同后往数组里面加一项0
          } else {
            this.spanArr[idx].push(1); //同列的前后两行单元格不相同
            this.position = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      for (let i = 0; i < 4 /* 对应rowspan -> idx的长度 */; i++) {
        if (columnIndex === i) {
          const _row = this.spanArr[i][rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        }
      }
    }
  }
};
</script>

<style lang="scss" scpoed>
/*.main-header {
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
}*/
/*.main-header.active {*/
/*  .select-title {*/
/*    width: 85%;*/
/*  }*/
/*  .btn-area {*/
/*    width: 15%;*/
/*    flex-direction: row;*/
/*    .el-button {*/
/*      margin-left: 8px;*/
/*    }*/
/*  }*/
/*}*/
</style>
