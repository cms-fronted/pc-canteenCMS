<template>
  <div>
    <el-dialog :visible="isOpen" width="90%" title="新增饭堂" center @close="handleClose">
      <!-- 新增餐次信息对话框 -->
      <el-dialog
        center
        width="40%"
        :visible="dinnersVisible"
        append-to-body
        @close="dinnersVisible = false"
      >
        <el-form ref="dinnerForm" :model="dinnerForm" label-width="120px">
          <el-form-item label="餐次名称" prop="name">
            <el-input v-model="dinnerForm.name" style="width:150px;"></el-input>
          </el-form-item>
          <el-form-item label="消费状态" prop="fixed">
            <el-radio-group v-model="dinnerForm.fixed">
              <el-radio :label="1">固定</el-radio>
              <el-radio :label="2">动态</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="订餐截止日期" label-width="120px" prop="type">
            <el-radio-group v-model="dinnerForm.type" @change="dinnerForm.type_number = ''">
              <el-radio label="day">
                天
                <span v-if="dinnerForm.type == 'day'">
                  提前
                  <el-input v-model="dinnerForm.type_number" style="width:50px"></el-input>天
                </span>
              </el-radio>
              <el-radio label="week">
                周
                <span v-if="dinnerForm.type == 'week'">
                  提前
                  <el-select v-model="dinnerForm.type_number" placeholder="请选择" style="width:120px">
                    <el-option
                      v-for="item in weekOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                </span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label prop="limit_time">
            <el-time-select
              :picker-options="{    start: '06:30',    step: '00:30',    end: '23:30'  }"
              v-model="dinnerForm.limit_time"
              placeholder="请选择时间"
              style="marginTop: 5px; marginLeft: 5px; "
            ></el-time-select>
          </el-form-item>
          <el-form-item label="就餐时间" prop="meal_time">
            <el-time-select
              style="width:100px"
              placeholder="起始"
              v-model="dinnerForm.meal_time_begin"
              :picker-options="{ start: '06:30', step: '00:30', end: '23:30'}"
            ></el-time-select>
            <span style="margin: 0 10px;">——</span>
            <el-time-select
              style="width:100px"
              placeholder="结束"
              v-model="dinnerForm.meal_time_end"
              :picker-options="{ start: '06:30', step: '00:30', end: '23:30', minTime: dinnerForm.meal_time_begin}"
            ></el-time-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="_addDinner">确定</el-button>
        </div>
      </el-dialog>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-card class="box-card">
            <div>PC端</div>
            <div style="margin: 15px 0;" v-for="(items, index) in modules" :key="items.create_time">
              <el-checkbox
                :indeterminate="isIndeterminate[index]"
                v-model="checkAll[index]"
                @change="checked => handleCheckAllChange(checked,index)"
              >{{items.name}}</el-checkbox>
              <el-checkbox-group
                v-model="checkedModules[index]"
                @change="val => handleCheckedModulesChange(val,index)"
              >
                <el-checkbox
                  v-for="items in items.items"
                  :label="items.id"
                  :key="items.id"
                >{{items.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card body-style="paddingBottom: 5px">
            <div slot="header" class="clearfix">
              <span>饭堂设置</span>
            </div>
            <span style="margin-right: 8px">
              饭堂名称
              <el-input v-model="canteens" size="small" style="width:200px;"></el-input>
            </span>
            <el-button
              type="primary"
              size="small"
              @click="addCanteen"
              :disabled="!canteens || canteen_id"
            >新增饭堂</el-button>
            <el-button type="primary" size="small" @click="handleClick">添加餐次</el-button>
            <el-table style="width:100%" :data="dataTable" size="small">
              <el-table-column label="餐次" width="60px" prop="name"></el-table-column>
              <!-- <el-table-column label="订餐单位" width="80px" prop="" ></el-table-column> -->
              <el-table-column label="订餐截止时间">
                <span
                  slot-scope="scoped"
                >{{scoped.row.type === 'day' ? `提前${scoped.row.type_number}天` : `周${scoped.row.type_number+1}前`}}</span>
              </el-table-column>
              <el-table-column label="就餐时间">
                <span
                  slot-scope="scoped"
                >{{scoped.row.meal_time_begin}}-{{scoped.row.meal_time_end}}</span>
              </el-table-column>
              <el-table-column label="餐费状态">
                <span slot-scope="scoped">{{scoped.row.fixed === 1 ? '固定' : '动态'}}</span>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scoped">
                  <el-button size="small" type="text">编辑</el-button>
                  <el-button size="small" type="text" @click="_delete(scoped.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <div style="textAlign:center;marginTop: 5px">
              <el-button @click="submitDetail" size="small">提交</el-button>
            </div>-->
          </el-card>
          <el-card class="box-card" body-style="paddingBottom: 5px">
            <div slot="header" class="clearfix">账户设置</div>
            <el-form ref="accountForm" :model="accountForm">
              <el-form-item>
                <el-radio-group v-model="accountForm.type">
                  <el-radio :label="2">不可透支消费</el-radio>
                  <el-radio :label="1">可透支消费</el-radio>
                </el-radio-group>
                <span v-if="accountForm.type === 1" style="marginTop: 5px;">
                  可透支
                  <el-input
                    v-model="accountForm.limit_money"
                    style="width:120px"
                    size="small"
                    type="number"
                    min="0"
                  ></el-input>元
                </span>
              </el-form-item>
              <el-form-item>
                <div style="marginTop: 5px">
                  <el-radio-group v-model="accountForm.clean_type">
                    <el-radio :label="2">非系统自动清零</el-radio>
                    <el-radio :label="1">系统自动清零</el-radio>
                  </el-radio-group>
                  <span style="marginLeft: 5px" v-if="accountForm.clean_type === 1">
                    每月
                    <el-input
                      style="width:100px"
                      size="small"
                      v-model="accountForm.clean_day"
                      type="number"
                      @change="changeDay"
                      min="1"
                      max="31"
                    ></el-input>号清除
                  </span>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="_addOptions">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import $axios from "@/api/index";
const weekOptions = [
  { label: "周一", value: 0 },
  { label: "周二", value: 1 },
  { label: "周三", value: 2 },
  { label: "周四", value: 3 },
  { label: "周五", value: 4 },
  { label: "周六", value: 5 },
  { label: "周日", value: 6 }
];
export default {
  data() {
    return {
      isOpen: false,
      dinnersVisible: false,
      checkAll: { system: false, shop: false, canteen: false },
      modulesCheckbox: { system: [], canteen: [], shop: [] }, //每一个功能模块对应的id
      checkedModules: {
        system: [],
        shop: [],
        canteen: []
      },
      isIndeterminate: {
        system: false,
        shop: false,
        canteen: false
      },
      modules: [], //系统所有功能模块
      canteen_id: null,
      canteens: null,
      advancedType: 1,
      day: "",
      week: "",
      weekOptions: weekOptions,
      dinnerForm: {
        name: "",
        type: "day",
        type_number: "",
        limit_time: "",
        meal_time_begin: "",
        meal_time_end: "",
        fixed: 1
      },
      accountForm: {
        type: "",
        clean_type: "",
        clean_day: 1,
        clean_time: "08:00",
        limit_money: 1
      },
      dataTable: []
    };
  },
  props: ["visible", "company_id"],
  watch: {
    visible(val) {
      this.isOpen = val;
    }
  },
  created() {
    this.getModules();
  },
  methods: {
    handleCheckAllChange(val, index) {
      this.checkedModules["" + index] = val
        ? this.modulesCheckbox["" + index]
        : [];
      this.isIndeterminate["" + index] = false;
    },
    handleCheckedModulesChange(value, index) {
      let checkedCount = value.length;
      this.checkAll["" + index] =
        checkedCount === this.modulesCheckbox["" + index].length;
      this.isIndeterminate["" + index] =
        checkedCount > 0 &&
        checkedCount < this.modulesCheckbox["" + index].length;
    },
    getModules() {
      let systemModules = $axios.get("/v1/modules?type=1");
      let canteenModules = $axios.get("/v1/modules?type=2");
      let shopModules = $axios.get("/v1/modules?type=3");
      let modulesCheck = Promise.all([
        systemModules,
        canteenModules,
        shopModules
      ]);
      modulesCheck.then(res => {
        const systemModules = res[0].data[0];
        const canteenModules = res[1].data[0];
        const shopModules = res[2].data[0];
        let arr = [];
        for (let item in systemModules) {
          if (item === "items") {
            systemModules[item].forEach(i =>
              this.modulesCheckbox.system.push(i.id)
            );
          }
        }
        for (let item in canteenModules) {
          if (item === "items") {
            canteenModules[item].forEach(i =>
              this.modulesCheckbox.canteen.push(i.id)
            );
          }
        }
        for (let item in shopModules) {
          if (item === "items") {
            shopModules[item].forEach(i =>
              this.modulesCheckbox.shop.push(i.id)
            );
          }
        }
        this.modules = Object.assign(
          {},
          { system: systemModules },
          { canteen: canteenModules },
          { shop: shopModules }
        );
      });
    },
    handleClick() {
      this.dinnersVisible = true;
    },
    addCanteen() {
      $axios
        .post("/v1/canteen/save", {
          canteens: this.canteens,
          c_id: this.company_id
        })
        .then(res => {
          this.canteens = "";
          this.canteen_id = res.data.canteen_id;
        });
    },
    _addDinner() {
      this.dataTable.push({ ...this.dinnerForm });
      this.$refs.dinnerForm.resetFields();
      this.dinnersVisible = false;
    },
    _addOptions() {
      let data = {};
      data.dinners = JSON.stringify(this.dataTable);
      data.c_id = this.canteen_id;
      data.account = JSON.stringify(this.accountForm);
      $axios
        .post("/v1/canteen/configuration/save", data)
        .then(res => {
          console.log(res);
        })
        .catch(err => console.log(err));
    },
    handleClose() {
      this.$emit("closeAdd", false);
    },
    changeDay(val) {
      console.log(val);
      this.accountForm.clean_day = val > 31 ? 31 : val;
    },
    _delete(row) {
      this.dataTable = this.dataTable.filter(item => {
        return item.name != row.name;
      });
    },
    submitDetail() {
      console.log(111);
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  .el-card__header {
    padding: 5px !important;
  }
}
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
