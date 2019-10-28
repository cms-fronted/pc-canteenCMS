<template>
  <div class="strategy">
    <div class="nav-title">消费策略设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :model="queryForm" :inline="true" label-width="80px">
          <el-form-item label="公司">
            <el-select v-model="queryForm.company_id" @change="getCanteenList">
              <el-option
                v-for="item in companiesList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
            <el-form-item label="饭堂">
              <el-select v-model="queryForm.c_id">
                <el-option
                  v-for="item in canteenList"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="queryList">查询</el-button>
            <el-button>新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-cotent">
      <el-table
        :data="dataList"
        :span-method="objectSpanMethod"
        size="mini"
        border
        style="width: 100%"
      >
        <el-table-column prop="canteen" label="消费地点" width="180"></el-table-column>
        <el-table-column prop="role" label="人员类型" width="180"></el-table-column>
        <el-table-column prop="dinner" label="餐饮"></el-table-column>
        <el-table-column prop="no_meals_ordered" label="未定餐允许就餐"></el-table-column>
        <el-table-column prop="consumption_count" label="允许消费次数"></el-table-column>
        <el-table-column prop="status" label="消费状态">
          <template slot-scope="scope">
            <span>{{scope.row.status | consumptionType}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="num_type" label="次数类型"></el-table-column>
        <el-table-column prop="money" label="金额"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { flatten, getAllOptions } from "@/utils/flatternArr";
import $axios from "@/api/index";
export default {
  data() {
    return {
      queryForm: {
        company_id: "",
        c_id: ""
      },
      canteenList: [],
      companiesList: [],
      current_page: 1,
      budgetList: [],
      // budgetList: [
      //   {
      //     id: 14,
      //     unordered_meals: 1,
      //     detail: [
      //       {
      //         number: 1,
      //         strategy: [
      //           { satus: "ordering_meals", money: 10, sub_money: 5 },
      //           { satus: "no_meals_ordered", money: 10, sub_money: 5 },
      //           { satus: "unordered_meals", money: 10, sub_money: 5 }
      //         ]
      //       },
      //       {
      //         number: 2,
      //         strategy: [
      //           { satus: "ordering_meals", money: 10, sub_money: 5 },
      //           { satus: "no_meals_ordered", money: 10, sub_money: 5 },
      //           { satus: "unordered_meals", money: 10, sub_money: 5 }
      //         ]
      //       }
      //     ],
      //     consumption_count: 1,
      //     ordered_count: 1,
      //     dinner: { id: 5, name: "早餐" },
      //     role: { id: 1, name: "局长" },
      //     canteen: { id: 1, name: "大饭堂" }
      //   },
      //   {
      //     id: 15,
      //     unordered_meals: 1,
      //     detail: [
      //       {
      //         number: 1,
      //         strategy: [
      //           { satus: "ordering_meals", money: 10, sub_money: 5 },
      //           { satus: "no_meals_ordered", money: 10, sub_money: 5 },
      //           { satus: "unordered_meals", money: 10, sub_money: 5 }
      //         ]
      //       },
      //       {
      //         number: 2,
      //         strategy: [
      //           { satus: "ordering_meals", money: 10, sub_money: 5 },
      //           { satus: "no_meals_ordered", money: 10, sub_money: 5 },
      //           { satus: "unordered_meals", money: 10, sub_money: 5 }
      //         ]
      //       }
      //     ],
      //     consumption_count: 1,
      //     ordered_count: 1,
      //     dinner: { id: 6, name: "中餐" },
      //     role: { id: 1, name: "局长" },
      //     canteen: { id: 1, name: "大饭堂" }
      //   },
      //   {
      //     id: 16,
      //     unordered_meals: 1,
      //     detail: [
      //       {
      //         number: 1,
      //         strategy: [
      //           { satus: "ordering_meals", money: 10, sub_money: 5 },
      //           { satus: "no_meals_ordered", money: 10, sub_money: 5 },
      //           { satus: "unordered_meals", money: 10, sub_money: 5 }
      //         ]
      //       },
      //       {
      //         number: 2,
      //         strategy: [
      //           { satus: "ordering_meals", money: 10, sub_money: 5 },
      //           { satus: "no_meals_ordered", money: 10, sub_money: 5 },
      //           { satus: "unordered_meals", money: 10, sub_money: 5 }
      //         ]
      //       }
      //     ],
      //     consumption_count: 1,
      //     ordered_count: 1,
      //     dinner: { id: 7, name: "晚餐" },
      //     role: { id: 1, name: "局长" },
      //     canteen: { id: 1, name: "大饭堂" }
      //   }
      // ],
      dataList: [],
      spanArr: [], //二维数组，用于存放单元格合并规则
      position: 0 //用于存储相同项的开始index
    };
  },
  mounted() {
    this.getCompanies();
    this.getRoleType();
    this.handleData();
    this.rowspan(0, "canteen");
    this.rowspan(1, "role");
    this.rowspan(2, "dinner");
  },
  filters: {
    consumptionType: function(str) {
      switch (str) {
        case "ordering_meals":
          return "订餐就餐";
        case "no_meals_ordered":
          return "订餐未就餐";
        case "unordered_meals":
          return "未订餐就餐";
      }
    }
  },
  methods: {
    async getCompanies() {
      await $axios
        .get("/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          this.companiesList = flatten(arr);
          this.queryForm.c_id = null;
          this.canteenList = [];
        })
        .catch(err => console.log(err));
    },
    async getCanteenList(company_id) {
      await $axios
        .get(`/v1/company/consumptionLocation?company_id=${company_id}`)
        .then(res => {
          this.canteenList = Array.from(res.data.canteen);
        })
        .catch(err => console.log(err));
    },
    async queryList() {
      let data = await $axios.get("/v1/canteen/consumptionStrategy", {
        c_id: this.queryForm.c_id,
        page: this.current_page,
        size: 3
      });
    },
    async getRoleType(){
      let res = await $axios.get('/v1/role/types')
      console.log(res);
      return res;
    },
    //处理合并数据
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == "人员类型") {
        let _row, _col;
        _row = row.detail[0].strategy.length;
        return {
          rowspan: _row,
          colspan: 1
        };
      }
    },
    printScope(val) {
      console.log(val);
    },
    handleData() {
      let _data = [];
      this.budgetList.forEach(i => {
        i.detail.forEach(j => {
          j.strategy.forEach(k => {
            _data.push({
              canteen: i.canteen.name,
              canteen_id: i.canteen.id,
              dinner: i.dinner.name,
              dinner_id: i.dinner.id,
              role: i.role.name,
              role_id: i.role.id,
              money: k.money,
              status: k.satus,
              sub_money: k.sub_money,
              num_type: j.number,
              consumption_count: i.consumption_count,
              unordered_meals: i.unordered_meals,
              ordered_count: i.ordered_count
            });
          });
        });
      });
      this.dataList = _data;
    },

    rowspan(idx, prop) {
      this.spanArr[idx] = [];
      this.position = 0;
      this.dataList.forEach((item, index) => {
        if (index === 0) {
          this.spanArr[idx].push(1);
          this.position = 0;
        } else {
          if (this.dataList[index][prop] === this.dataList[index - 1][prop]) {
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
      for (let i = 0; i < 3 /* 对应rowspan -> idx的长度 */; i++) {
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

<style>
</style>