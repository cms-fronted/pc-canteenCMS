<template>
  <div>
    <div class="statistics">
      <div class="nav-title">订餐统计</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header" :class="{ 'active': !companiesVisible}">
          <div class="select-title">
            <el-form :inline="true" :model="formdata" label-width="40px" label-position="left">
              <el-form-item label="开始">
                <el-date-picker
                  v-model="formdata.time_begin"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  style="width:180px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束">
                <el-date-picker
                  v-model="formdata.time_end"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  style="width:180px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="公司" v-if="companiesVisible">
                <el-select
                  v-model="formdata.company_ids"
                  placeholder="请选择公司"
                  style="width:200px"
                  @change="getList"
                >
                  <el-option
                    v-for="item in companyOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消费地点" label-width="80px">
                <el-select v-model="formdata.canteen_id" placeholder="请选择消费地点" style="width:200px">
                  <el-option
                    v-for="item in canteenOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" @click="queryList(1)" :disabled="isDisabled">查询</el-button>
              <el-button type="primary">导出</el-button>
            </el-form>
          </div>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border>
            <el-table-column label="日期" prop="ordering_date"></el-table-column>
            <el-table-column label="公司" prop="company"></el-table-column>
            <el-table-column label="消费地点" prop="canteen"></el-table-column>
            <el-table-column label="餐次" prop="dinner"></el-table-column>
            <el-table-column label="消费人数" prop="count"></el-table-column>
          </el-table>
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
export default {
  components: {
    Pagination
  },
  data() {
    return {
      grade: store.getters.grade,
      formdata: {
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
      isDisabled: true,
      current_page: 1,
      size: 10,
      total: 0
    };
  },
  created() {
    this.getCompanies();
  },
  computed: {
    companiesVisible() {
      return this.grade !== 3;
    },
    isAble() {
      return (
        !!this.formdata.time_end &&
        !!this.formdata.time_begin &&
        !!this.formdata.company_ids
      );
    }
  },
  watch: {
    isAble(val) {
      this.isDisabled = !val;
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
    getCompanies() {
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          let allCompanies = [];
          let companiesList = getAllOptions(flatten(arr));
          this.companyOptions = companiesList;
        })
        .catch(err => console.log(err));
    },
    async getLocationList(company_id) {
      if (company_id) {
        const res = await $axios.get(
          `/v1/company/consumptionLocation?company_id=${company_id}`
        );
        if (res.msg === "ok") {
          this.canteenOptions = unshiftAllOptions(Array.from(res.data.canteen));
        }
      }
    },
    async queryList(page) {
      page = page || 1;
      const res = await $axios.get(
        `/v1/order/orderStatistic?page=${page}&size=${this.size}`,
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
      console.log(res);
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
.main-header.active {
  .select-title {
    width: 85%;
  }
  .btn-area {
    width: 15%;
    flex-direction: row;
    .el-button {
      margin-left: 8px;
    }
  }
}
</style>
