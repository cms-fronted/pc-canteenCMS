<template>
  <div>
    <el-dialog :visible.sync="isOpen" width="45%" :title="dialogTitle" center @close="handleClose">
      <!-- 餐次信息对话框 -->
      <el-dialog
        center
        width="40%"
        :visible.sync="dinnersVisible"
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
          <el-button @click="dinnersVisible = false">取 消</el-button>
          <el-button type="primary" @click="_addDinner">确定</el-button>
        </div>
      </el-dialog>

      <!-- 硬件信息对话框 -->
      <el-dialog
        :visible.sync="addMachineVisible"
        width="40%"
        @close="addMachineVisible = false"
        append-to-body
        title="新增硬件"
      >
        <el-form ref="machineForm" :model="machineForm" label-width="80px">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="machineForm.name"></el-input>
          </el-form-item>
          <el-form-item label="设备号" prop="code">
            <el-input v-model="machineForm.code"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="number">
            <el-input v-model="machineForm.number"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd" v-if="!isEditMachine">
            <el-input v-model="machineForm.pwd" show-password></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeMachineDialog">取 消</el-button>
          <el-button type="primary" @click="_submitMachineInfo">确 定</el-button>
        </div>
      </el-dialog>
      <!-- <el-row :gutter="50">
        <el-col :span="9">
          <el-card class="box-card">
            <div>
              PC端
              <el-button type="text" @click="test">测试</el-button>
            </div>
            <div v-for="item in pcModules" :key="item.create_time">
              <el-checkbox
                :indeterminate="isIndeterminate[item.id]"
                v-model="checkAll[item.id]"
                @change="checked => handleCheckAllChange(checked,item.id)"
              >{{item.name}}</el-checkbox>
              <el-checkbox-group
                style="padding: 0 20px"
                @change="checked => handleCheckedModulesChange(checked,item.id)"
                v-model="checkedPCModules[item.id]"
              >
                <el-checkbox
                  v-for="items in item.items"
                  :label="items.id"
                  :key="items.create_time"
                >{{items.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div>
              微信端
              <el-button type="text" @click="testDefault">测试</el-button>
            </div>
            <div v-for="item in WXModules" :key="item.create_time">
              <el-checkbox
                :indeterminate="isIndeterminate[item.id]"
                v-model="checkAll[item.id]"
                @change="checked => handleCheckAllChange(checked,item.id)"
              >{{item.name}}</el-checkbox>
              <el-checkbox-group
                style="padding: 0 20px"
                @change="checked => handleCheckedModulesChange(checked,item.id)"
                v-model="checkedWXModules[item.id]"
              >
                <el-checkbox
                  v-for="items in item.items"
                  :label="items.id"
                  :key="items.create_time"
                >{{items.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div style="textAlign:center">
              <el-button>确定</el-button>
            </div>
          </el-card>
        </el-col>
      <el-col :span="14">-->
      <!--饭堂设置-->
      <el-card body-style="paddingBottom: 5px">
        <div slot="header" class="clearfix">
          <span>饭堂设置</span>
        </div>
        <span style="margin-right: 8px">
          饭堂名称
          <el-input v-model="canteens" size="small" style="width:200px;" :disabled="isEdit"></el-input>
        </span>
        <el-button
          type="primary"
          size="small"
          @click="addCanteen"
          :disabled="isEdit || canteen_id"
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
            <span slot-scope="scoped">{{scoped.row.meal_time_begin}}-{{scoped.row.meal_time_end}}</span>
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
      </el-card>
      <!--账户设置-->
      <el-card class="box-card" body-style="paddingBottom: 5px">
        <div slot="header" class="clearfix">账户设置</div>
        <el-form ref="accountForm" :model="accountForm">
          <el-form-item prop="dinningMode">
            <el-radio-group v-model="accountForm.dining_mode">
              <el-radio :label="1">堂食</el-radio>
              <el-radio :label="2">外卖</el-radio>
              <el-radio :label="3">全部</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="type">
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
        </el-form>
      </el-card>
      <!--硬件设置-->
      <el-card class="box-card" body-style="paddingBottom: 5px">
        <div slot="header" class="clearfix">
          <span>硬件设置</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="oprnMachineDialog"
          >添加硬件</el-button>
        </div>
        <el-table :data="machineTable" style="width:100%" size="mini">
          <el-table-column label="编号" prop="number"></el-table-column>
          <el-table-column label="设备名称" prop="name"></el-table-column>
          <el-table-column label="设备号" prop="code"></el-table-column>
          <!-- <el-table-column label="密码" prop="pwd"></el-table-column> -->
          <el-table-column label="状态">
            <template slot-scope="scoped">
              <span>{{scoped.row.state===1?"正常":"异常"}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <el-button size="small" type="text" @click="_editMachine(scoped.row)">编辑</el-button>
              <!-- <el-button size="small" type="text" @click="_deleteMachine(scoped.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="_submitOptions">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import $axios from "@/api/index";
import { treeToArr } from "@/utils/flatternArr";
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
  props: [
    "visible",
    "company_id",
    "dialogTitle",
    "isEdit",
    "formdata",
    "editDinnerList",
    "editAccount",
    "machineList",
    "modules"
  ],
  data() {
    return {
      testCheck: [],
      isOpen: false,
      dinnersVisible: false,
      addMachineVisible: false,
      editDinnerData: this.editDinnerList,
      editAccountForm: this.editAccount,
      isEditMachine: false,
      machineForm: {
        id: "",
        belong_id: "",
        name: "",
        code: "",
        number: "",
        pwd: ""
      },

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
        dining_mode: 1,
        clean_day: 1,
        clean_time: "08:00",
        limit_money: 1
      },
      dataTable: [],
      machineTable: []
    };
  },
  watch: {
    visible(val) {
      this.isOpen = val;
    },
    formdata(val) {
      this.canteens = val.name;
    },
    editDinnerList(val) {
      if (this.isEdit) {
        this.dataTable = val;
      }
    },
    editAccount(val) {
      if (this.isEdit) {
        this.accountForm = val;
      }
    },
    machineList(val) {
      if (this.isEdit) {
        this.machineTable = val;
      }
    }
  },
  created() {},
  methods: {
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
          this.$message.success("饭堂创建成功，请继续操作");
        });
    },
    _addDinner() {
      //添加餐次信息
      this.dataTable.push({ ...this.dinnerForm });
      this.$refs.dinnerForm.resetFields();
      this.dinnersVisible = false;
    },
    _submitOptions() {
      let data = {};
      data.dinners = JSON.stringify(this.dataTable);
      data.account = JSON.stringify(this.accountForm);
      if (this.isEdit) {
        data.c_id = this.formdata.id;
      } else {
        data.c_id = this.canteen_id;
      }
      const url = !this.isEdit
        ? "/v1/canteen/configuration/save"
        : "/v1/canteen/configuration/update";
      $axios
        .post(url, data)
        .then(res => {
          this.$message.success("设置成功");
          this.dataTable.length = 0;
          this.$emit("updateCanteenList", this.company_id);
          this.handleClose();
        })
        .catch(err => console.log(err));
    },
    handleClose() {
      this.dataTable.length = 0;
      this.$refs.accountForm.resetFields();
      this.$emit("closeAdd", false);
    },
    changeDay(val) {
      this.accountForm.clean_day = val > 31 ? 31 : val;
    },
    oprnMachineDialog() {
      this.addMachineVisible = true;
      this.machineForm = {};
    },
    closeMachineDialog() {
      this.addMachineVisible = false;
      this.isEditMachine = false;
      this.machineForm = {};
    },
    _deleteMachine(row) {
      this.machineTable = this.machineTable.filter(item => {
        return item.name != row.name;
      });
    },
    _editMachine(row) {
      this.isEditMachine = true;
      this.machineForm = Object.assign({}, row);
      this.addMachineVisible = true;
    },
    _submitMachineInfo() {
      //新增硬件
      if (!this.isEditMachine) {
        this.machineForm.belong_id = this.formdata.id || this.canteen_id;
        this.machineForm.company_id = this.company_id;
        this.machineForm.machine_type = "canteen";
        console.log(this.machineForm);
        $axios
          .post("v1/canteen/saveMachine", this.machineForm)
          .then(res => {
            this.$emit(
              "updateMachineTable",
              { id: this.canteen_id || this.formdata.id },
              "canteen"
            );
            this.closeMachineDialog();
            this.$message.success("添加成功");
          })
          .catch(err => console.log(err));
      } else {
        $axios
          .post("/v1/canteen/updateMachine", this.machineForm)
          .then(res => {
            this.$emit(
              "updateMachineTable",
              { id: this.canteen_id || this.formdata.id },
              "canteen"
            );
            this.closeMachineDialog();
            this.$message.success("修改成功");
          })
          .catch(err => console.log(err));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  .el-card__header {
    padding: 5px !important;
  }
  .el-form-item {
    margin: 0;
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


