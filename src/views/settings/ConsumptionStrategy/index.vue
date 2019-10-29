<template>
  <div class="strategy">
    <div class="nav-title">消费策略设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :model="queryForm" :inline="true" label-width="60px">
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
            <el-button @click="queryList" :disabled="!!queryForm.c_id">查询</el-button>
            <el-button @click="settingDialogVisible  =true">新增</el-button>
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
        <el-table-column label="未定餐允许就餐">
          <template slot-scope="scoped">
            <span>
              {{
              scoped.row.unordered_meals === 1 ? "允许" : "拒绝"
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="consumption_count" label="允许消费次数"></el-table-column>
        <el-table-column prop="status" label="消费状态">
          <template slot-scope="scope">
            <span>{{scope.row.status | consumptionType}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="num_type" label="次数类型"></el-table-column>
        <el-table-column prop="money" label="金额"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <span>
              <el-button type="text" @click="_editSetting(scoped.row)">编辑</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="settingDialogVisible"
      width="30%"
      title="新增策略"
      @close="closeSettingDialog"
    >
      <el-form :model="newSettingForm" ref="newSettingForm" label-width="100px">
        <el-form-item label="公司" prop="company_id">
          <el-select v-model="newSettingForm.company_id" @change="getDialogCanteenList">
            <el-option
              v-for="item in companiesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="饭堂" prop="c_id">
          <el-select v-model="newSettingForm.c_id">
            <el-option
              v-for="item in dialogCanteenList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员类型" prop="t_id">
          <el-select v-model="newSettingForm.t_id">
            <el-option
              v-for="item in roleTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="未订餐就餐" prop="unordered_meals">
          <el-radio-group v-model="newSettingForm.unordered_meals">
            <el-radio :label="1">允许</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSettingDialog">取 消</el-button>
        <el-button type="primary" @click="_addNewSetting">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { flatten, getAllOptions } from "@/utils/flatternArr";
import $axios from "@/api/index";
export default {
  data() {
    return {
      settingDialogVisible: false,
      queryForm: {
        company_id: "",
        c_id: ""
      },
      canteenList: [],
      dialogCanteenList: [],
      companiesList: [],
      roleTypeList: [],
      newSettingForm: {
        company_id: "",
        c_id: "",
        t_id: "",
        unordered_meals: ""
      },
      current_page: 1,
      budgetList: [],
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
    async getDialogCanteenList(company_id) {
      this.newSettingForm.c_id = "";
      this.newSettingForm.t_id = "";
      await $axios
        .get(`/v1/company/consumptionLocation?company_id=${company_id}`)
        .then(res => {
          this.dialogCanteenList = Array.from(res.data.canteen);
        })
        .catch(err => console.log(err));
    },
    async queryList() {
      let data = await $axios
        .get("/v1/canteen/consumptionStrategy", {
          c_id: this.queryForm.c_id,
          page: this.current_page,
          size: 3
        })
        .then(res => {
          this.budgetList = Array.from(res.data);
          console.log(this.budgetList);
          this.handleData();
          this.rowspan(0, "canteen");
          this.rowspan(1, "role");
          this.rowspan(2, "dinner");
        });
    },
    async getRoleType() {
      await $axios
        .get("/v1/role/types")
        .then(res => (this.roleTypeList = Array.from(res.data.data)));
    },
    async _addNewSetting() {
      await $axios
        .post("/v1/canteen/consumptionStrategy/save", this.newSettingForm)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    closeSettingDialog() {
      this.settingDialogVisible = false;
      this.$refs.newSettingForm.resetFields();
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
    _editSetting(row) {
      console.log(row);
    },
    handleData() {
      let _data = [];
      this.budgetList.forEach(i => {
        if (i.detail) {
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
        } else {
          _data.push({
            canteen: i.canteen.name,
            canteen_id: i.canteen.id,
            dinner: i.dinner.name,
            dinner_id: i.dinner.id,
            role: i.role.name,
            role_id: i.role.id,
            consumption_count: i.consumption_count,
            unordered_meals: i.unordered_meals,
            ordered_count: i.ordered_count
          });
        }
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