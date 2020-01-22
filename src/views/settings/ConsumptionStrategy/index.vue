<template>
  <div class="strategy">
    <div class="nav-title">消费策略设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :model="queryForm" :inline="true" label-width="60px">
          <el-form-item label="公司" v-if="companiesVisible">
            <el-select
              v-model="queryForm.company_id"
              placeholder="请选择企业"
              filterable
              @change="getCanteenList"
            >
              <el-option
                v-for="item in companiesList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
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
          <el-button @click="queryList" :disabled="!!!queryForm.c_id"
            >查询</el-button
          >
          <el-button @click="settingDialogVisible = true">新增</el-button>
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
        <el-table-column
          prop="canteen"
          label="消费地点"
          width="120px"
        ></el-table-column>
        <el-table-column
          prop="role"
          label="人员类型"
          width="120px"
        ></el-table-column>
        <el-table-column
          prop="dinner"
          label="餐饮"
          width="120px"
        ></el-table-column>
        <el-table-column label="未定餐允许就餐" width="150px">
          <template slot-scope="scoped">
            <span>
              {{ scoped.row.unordered_meals === 1 ? "允许" : "拒绝" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="consumption_count"
          label="允许消费次数"
          width="150px"
        ></el-table-column>
        <el-table-column
          prop="ordered_count"
          label="订餐数量"
          width="100px"
        ></el-table-column>
        <el-table-column prop="status" label="消费状态" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.status | consumptionType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="num_type"
          label="次数类型"
          width="80px"
        ></el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scoped">
            <el-tag
              type="info"
              size="small"
              effect="dark"
              style="marginRight:5px"
              >标准金额:{{ scoped.row.money }}元</el-tag
            >
            <el-tag type="warning" size="small" effect="dark"
              >附加金额:{{ scoped.row.money }}元</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <span>
              <el-button type="text" @click="_editSetting(scoped.row)"
                >编辑</el-button
              >
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
        <el-form-item label="公司" prop="company_id" v-if="companiesVisible">
          <el-select
            v-model="newSettingForm.company_id"
            @change="getDialogCanteenList"
          >
            <el-option
              v-for="item in companiesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="饭堂" prop="c_id">
          <el-select v-model="newSettingForm.c_id">
            <el-option
              v-for="item in dialogCanteenList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="人员类型" prop="t_id">
          <el-select v-model="newSettingForm.t_id">
            <el-option
              v-for="item in roleTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
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

    <el-dialog
      :visible.sync="changeSettingVisible"
      title="修改策略"
      width="40%"
      @close="_closeEditSettingDialog"
    >
      <el-dialog
        width="40%"
        append-to-body
        :visible.sync="addCountVisible"
        @close="_closeCountDialog"
      >
        <el-form :model="countDetailForm">
          <el-form-item label="次数类型">
            <p>第{{ detail.length + 1 }}次</p>
          </el-form-item>
          <el-form-item label="订餐就餐">
            <span>
              标准金额
              <el-input
                style="width:100px"
                size="mini"
                type="number"
                v-model="orderingMealForm.money"
              />
            </span>
            <span>
              附加金额
              <el-input
                style="width:100px"
                size="mini"
                type="number"
                v-model="orderingMealForm.sub_money"
              />
            </span>
          </el-form-item>
          <el-form-item label="订餐未就餐">
            <span>
              标准金额
              <el-input
                style="width:100px"
                size="mini"
                type="number"
                v-model="noMealOrderedForm.money"
              />
            </span>
            <span>
              附加金额
              <el-input
                style="width:100px"
                size="mini"
                type="number"
                v-model="noMealOrderedForm.sub_money"
              />
            </span>
          </el-form-item>
          <el-form-item label="未订餐就餐">
            <span>
              标准金额
              <el-input
                style="width:100px"
                size="mini"
                type="number"
                v-model="unOrderedMealForm.money"
              />
            </span>
            <span>
              附加金额
              <el-input
                style="width:100px"
                size="mini"
                type="number"
                v-model="unOrderedMealForm.sub_money"
              />
            </span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="_closeCountDialog">取 消</el-button>
          <el-button type="primary" @click="_changeDetail">确 定</el-button>
        </span>
      </el-dialog>

      <el-form
        :model="editSettingForm"
        ref="editSettingForm"
        label-width="100px"
      >
        <el-form-item label="未定餐就餐" prop="unordered_meals">
          <el-radio-group v-model="editSettingForm.unordered_meals">
            <el-radio :label="1">允许</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订餐数量">
          <el-input
            type="number"
            v-model="editSettingForm.ordered_count"
            style="width:100px"
          />
        </el-form-item>
      </el-form>
      <el-card class="box-card" body-style="paddingBottom: 5px">
        <div slot="header" class="clearfix">
          <span>消费设置</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="_openCountDialog"
            >添加次数</el-button
          >
        </div>
        <el-table style="width:100%" :data="detailStrategy" height="250">
          <el-table-column label="次数" width="80px">
            <template slot-scope="scoped">
              <span>第{{ scoped.row.number }}次</span>
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              <span>{{ scope.row.status | consumptionType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额">
            <template slot-scope="scoped">
              <el-tag
                type="info"
                size="mini"
                effect="dark"
                style="marginRight:5px"
                >标准:{{ scoped.row.money }}元</el-tag
              >
              <el-tag type="warning" size="mini" effect="dark"
                >附加:{{ scoped.row.money }}元</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column labell="操作">
            <template slot-scope="scoped">
              <el-button type="text" @click="_editStrategy(scoped.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                @click="_delete(scoped.row)"
                style="margin-left:10px"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="_closeEditSettingDialog">取 消</el-button>
        <el-button type="primary" @click="changeSetting">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible="strategyDetailVisible" append-to-body width="30%">
      <el-form :model="rowDetailForm">
        <el-form-item label="次数类型">
          <p>第{{ rowDetailForm.number }}次</p>
        </el-form-item>
        <el-form-item :label="rowDetailForm.status | consumptionType">
          <span>
            标准金额
            <el-input
              style="width:100px"
              size="mini"
              type="number"
              v-model="rowDetailForm.money"
            />
          </span>
          <span>
            附加金额
            <el-input
              style="width:100px"
              size="mini"
              type="number"
              v-model="rowDetailForm.sub_money"
            />
          </span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="_cloeseRowDtailDialog">取 消</el-button>
        <el-button type="primary" @click="_changeRowDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { flatten, getAllOptions } from "@/utils/flatternArr";
import $axios from "@/api/index";
import store from "@/store";
export default {
  data() {
    return {
      grade: store.getters.grade,
      settingDialogVisible: false,
      changeSettingVisible: false,
      addCountVisible: false,
      strategyDetailVisible: false,
      isEdit: false,
      strategyRowIndex: null,
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
      editSettingForm: {},
      rowDetailForm: {},
      detail: [],
      detailStrategy: [],
      countDetailForm: {},
      orderingMealForm: {
        money: "",
        sub_money: ""
      },
      noMealOrderedForm: {
        money: "",
        sub_money: ""
      },
      unOrderedMealForm: {
        money: "",
        sub_money: ""
      },
      current_page: 1,
      budgetList: [],
      dataList: [],
      spanArr: [], //二维数组，用于存放单元格合并规则
      position: 0 //用于存储相同项的开始index
    };
  },
  /*  async mounted() {
    await this.getCompanies();
    await this.getRoleType();
  },*/
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
  computed: {
    companiesVisible() {
      return this.grade != 3;
    }
  },
  async created() {
    if (this.companiesVisible) {
      await this.getCompanies();
      await this.getRoleType();
      await this.queryList(1);
    } else {
      await this.getRoleType();
      await this.getCanteenList();
      await this.queryList(1);
    }
  },
  methods: {
    async getCompanies() {
      await $axios
        .get("http://canteen.tonglingok.com/api/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          this.companiesList = flatten(arr);
          this.queryForm.company_id = this.companiesList[0].id;
          this.getCanteenList(this.queryForm.company_id);
        })
        .catch(err => console.log(err));
    },
    async getCanteenList(company_id) {
      if (company_id) {
        await $axios
          .get(
            `http://canteen.tonglingok.com/api/v1/canteens?company_id=${company_id}`
          )
          .then(res => {
            this.canteenList = Array.from(res.data);
            this.queryForm.c_id = this.canteenList[0].id;
          })
          .catch(err => console.log(err));
      } else {
        await $axios
          .get("http://canteen.tonglingok.com/api/v1/managerCanteens")
          .then(res => {
            this.canteenList = Array.from(res.data);
            this.dialogCanteenList = Array.from(res.data);
            this.queryForm.c_id = this.canteenList[0].id;
          })
          .catch(err => console.log(err));
      }
    },
    async getDialogCanteenList(company_id) {
      this.newSettingForm.c_id = "";
      this.newSettingForm.t_id = "";
      await $axios
        .get(
          `http://canteen.tonglingok.com/api/v1/company/consumptionLocation?company_id=${company_id}`
        )
        .then(res => {
          this.dialogCanteenList = Array.from(res.data.canteen);
        })
        .catch(err => console.log(err));
    },
    async queryList(page) {
      page = Number(page) || 1;
      let data = await $axios
        .get(
          "http://canteen.tonglingok.com/api/v1/canteen/consumptionStrategy",
          {
            c_id: this.queryForm.c_id,
            page: page,
            size: 10
          }
        )
        .then(res => {
          this.budgetList = Array.from(res.data);
          this.handleData();
          this.rowspan(0, "canteen");
          this.rowspan(1, "role");
          this.rowspan(2, "dinner");
        });
    },
    async getRoleType() {
      await $axios
        .get("http://canteen.tonglingok.com/api/v1/role/types")
        .then(res => (this.roleTypeList = Array.from(res.data.data)));
    },
    async _addNewSetting() {
      let res;
      if (this.isEdit) {
        this.newSettingForm.detail = JSON.stringify(this.newSettingForm.detail);
        res = await $axios.post(
          "http://canteen.tonglingok.com/api/v1/canteen/consumptionStrategy/update",
          this.newSettingForm
        );
      } else {
        res = await $axios.post(
          "http://canteen.tonglingok.com/api/v1/canteen/consumptionStrategy/save",
          this.newSettingForm
        );
      }
      if (res.msg == "ok") {
        this.$message.success("添加成功");
        await this.queryList();
      } else {
        this.$message.error(res.msg);
      }
      this.closeSettingDialog();
    },
    closeSettingDialog() {
      this.settingDialogVisible = false;
      this.isEdit = false;
      this.$refs.newSettingForm.resetFields();
    },
    _editSetting(row) {
      let editData = this.budgetList.filter(item => item.id === row.id);
      let objData = editData[0];
      let { detail } = objData;
      this.isEdit = true;
      this.editSettingForm = Object.assign({}, objData);

      //处理已有消费策略详情
      if (!detail) {
        this.changeSettingVisible = true;
        return;
      }
      this.detail = detail;
      detail &&
        detail.forEach(i => {
          i.strategy.forEach(j => {
            this.detailStrategy.push({
              number: i.number,
              status: j.status,
              money: j.money,
              sub_money: j.sub_money
            });
          });
        });
      this.changeSettingVisible = true;
    },
    _closeEditSettingDialog() {
      this.$refs.editSettingForm.resetFields();
      this.detail = [];
      this.detailStrategy = [];
      this.isEdit = false;
      this.changeSettingVisible = false;
    },
    _openCountDialog() {
      this.addCountVisible = true;
    },
    _closeCountDialog() {
      this.addCountVisible = false;
      this.orderingMealForm = {};
      this.noMealOrderedForm = {};
      this.unOrderedMealForm = {};
    },
    //处理消费策略数据
    _changeDetail() {
      let number = this.detail.length + 1;
      let detail = [
        {
          number: number,
          status: "ordering_meals",
          ...this.orderingMealForm
        },
        {
          number: number,
          status: "no_meals_ordered",
          ...this.noMealOrderedForm
        },
        {
          number: number,
          status: "unordered_meals",
          ...this.unOrderedMealForm
        }
      ];
      detail.forEach(item => this.detailStrategy.push(item));
      this.detail.push({ number: number, strategy: detail });
      this._closeCountDialog();
    },
    //提交消费策略设置修改请求
    async changeSetting() {
      if (!this.detail.length) {
        return this.$message.error("消费设置不能为空");
      }
      this.editSettingForm.consumption_count = this.detail.length;
      this.editSettingForm.detail = JSON.stringify(this.detail);
      const res = await $axios.post(
        "http://canteen.tonglingok.com/api/v1/canteen/consumptionStrategy/update",
        this.editSettingForm
      );
      if (res.msg === "ok") {
        this.$message.success("修改成功");
        await this.queryList();
      } else {
        this.$message.error(res.msg);
      }
      this._closeEditSettingDialog();
    },
    //处理合并数据
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (column.label == "人员类型") {
    //     let _row, _col;
    //     _row = row.detail[0].strategy.length;
    //     return {
    //       rowspan: _row,
    //       colspan: 1
    //     };
    //   }
    // },
    handleData() {
      let _data = [];
      this.budgetList.forEach(i => {
        if (i.detail) {
          i.detail.forEach(j => {
            j.strategy.forEach(k => {
              _data.push({
                id: i.id,
                canteen: i.canteen.name,
                canteen_id: i.canteen.id,
                dinner: i.dinner.name,
                dinner_id: i.dinner.id,
                role: i.role.name,
                role_id: i.role.id,
                money: k.money,
                status: k.status,
                sub_money: k.sub_money,
                num_type: j.number,
                consumption_count: i.detail.length,
                unordered_meals: i.unordered_meals,
                ordered_count: i.ordered_count
              });
            });
          });
        } else {
          _data.push({
            id: i.id,
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
    _editStrategy(row) {
      console.log(this.detailStrategy);
      this.rowDetailForm = Object.assign({}, row);
      this.strategyDetailVisible = true;
      this.strategyRowIndex = this.detailStrategy.findIndex(item => {
        return item.status === row.status && item.number == row.number;
      });

      // this.$set(this.detailStrategy,index, {
      //   number:row.number,
      //   status: row.status,
      //   sub_money:5,
      //   money:55
      // })
    },
    _changeRowDetail() {
      const obj = this.rowDetailForm;
      obj.number = this.detailStrategy[this.strategyRowIndex].number;
      this.$set(this.detailStrategy, this.strategyRowIndex, obj);
      this.getDetail();
      this._cloeseRowDtailDialog();
    },
    _cloeseRowDtailDialog() {
      this.strategyDetailVisible = false;
      this.rowDetailForm = {};
      this.strategyRowIndex = null;
    },
    _delete(row) {
      this.detailStrategy = this.detailStrategy.filter(
        item => item.number !== row.number
      );
this.getDetail()
      // let detailArr = [];
      // this.detailStrategy.forEach((item, index) => {
      //   let number = Math.ceil((index + 1) / 3);
      //   item.number = number;
      // });
      // for (let i = 1; i <= this.detailStrategy.length / 3; i++) {
      //   detailArr.push({ number: i, strategy: [] });
      // }
      // detailArr.forEach(i => {
      //   this.detailStrategy.forEach(j => {
      //     if (i.number === j.number) {
      //       i.strategy.push({
      //         status: j.status,
      //         sub_money: j.sub_money,
      //         money: j.money
      //       });
      //     }
      //   });
      // });
      // this.detail = detailArr;
    },
    getDetail() {
         let detailArr = [];
      this.detailStrategy.forEach((item, index) => {
        let number = Math.ceil((index + 1) / 3);
        item.number = number;
      });
      for (let i = 1; i <= this.detailStrategy.length / 3; i++) {
        detailArr.push({ number: i, strategy: [] });
      }
      detailArr.forEach(i => {
        this.detailStrategy.forEach(j => {
          if (i.number === j.number) {
            i.strategy.push({
              status: j.status,
              sub_money: j.sub_money,
              money: j.money
            });
          }
        });
      });
      this.detail = detailArr;
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

<style lang="scss" scoped>
.clearfix {
  text-align: center;
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
</style>
