<template>
  <div>
    <el-dialog
      :visible.sync="isOpen"
      width="40%"
      @close="closeDialog"
      center
      :title="dialogTitle"
    >
      <el-dialog
        :visible.sync="addMachineVisible"
        width="40%"
        @close="closeMachineDialog"
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
          <el-button type="primary" @click="_submitMachineInfo"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <el-card body-style="paddingBottom: 5px">
        <div slot="header" class="clearfix">
          <span>小卖部</span>
        </div>
        <div>
          <span style="margin-right: 8px">
            小卖部名称
            <el-input
              v-model="shop_name"
              size="small"
              style="width:200px;marginRight:10px"
              :disabled="!!shop_id"
            ></el-input>
          </span>
          <div style="marginTop:5px">
            <el-radio-group v-model="taking_mode">
              <el-radio :label="1">自取</el-radio>
              <el-radio :label="2">外卖</el-radio>
              <el-radio :label="3">全部</el-radio>
            </el-radio-group>
            <el-button
              style="marginLeft: 5px"
              type="primary"
              size="small"
              @click="addShop"
              v-if="!isEdit"
              :disabled="!shop_name"
              >新增小卖部</el-button
            >
            <el-button
              style="marginLeft: 5px"
              type="primary"
              size="small"
              @click="editShop"
              :disabled="!shop_name"
              v-else
              >编辑小卖部</el-button
            >
          </div>
        </div>
      </el-card>
      <el-card class="box-card" body-style="paddingBottom: 5px">
        <div slot="header" class="clearfix">
          <span>硬件设置</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="addNewMachine"
            >添加硬件</el-button
          >
        </div>
        <el-table :data="machineTable" style="width:100%" size="mini">
          <el-table-column label="编号" prop="number"></el-table-column>
          <el-table-column label="设备名称" prop="name"></el-table-column>
          <el-table-column label="设备号" prop="code"></el-table-column>
          <!-- <el-table-column label="密码" prop="pwd"></el-table-column> -->
          <el-table-column label="状态">
            <template slot-scope="scoped">
              <span>{{ scoped.row.state === 1 ? "正常" : "异常" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <el-button
                size="small"
                type="text"
                @click="_editMachine(scoped.row)"
                >编辑</el-button
              >
              <!-- <el-button size="small" type="text" @click="_deleteMachine(scoped.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="closeDialog" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
export default {
  data() {
    return {
      isOpen: false,
      shop_name: "",
      taking_mode: 1,
      addMachineVisible: false,
      isEditMachine: false,
      checkAll: { system: false, shop: false, canteen: false },
      modulesCheckbox: { system: [], canteen: [], shop: [] }, //每一个功能模块对应的id
      checkedModules: {
        system: [],
        shop: [],
        canteen: []
      },
      shop_id: "",
      machineForm: {
        belong_id: "",
        id: "",
        name: "",
        code: "",
        number: "",
        pwd: ""
      },
      isIndeterminate: {
        system: false,
        shop: false,
        canteen: false
      },
      machineTable: [],
      modules: [] //系统所有功能模块
    };
  },
  props: [
    "visible",
    "company_id",
    "dialogTitle",
    "isEdit",
    "formdata",
    "machineList"
  ],
  watch: {
    visible(val) {
      this.isOpen = val;
    },
    formdata(val) {
      this.shop_name = val.name;
    },
    machineList(val) {
      if (this.isEdit) {
        this.machineTable = val;
      }
    }
  },
  created() {
    // this.getModules();
  },
  methods: {
    closeDialog() {
      this.shop_name = "";
      this.shop_id = "";
      this.taking_mode = 1;
      this.$emit("closeDialog", false);
    },
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
    //打开添加硬件对话框
    addNewMachine() {
      this.addMachineVisible = true;
      this.machineForm = {};
    },
    closeMachineDialog() {
      this.addMachineVisible = false;
      this.isEditMachine = false;
      this.machineForm = {};
    },
    //编辑硬件
    _editMachine(row) {
      this.isEditMachine = true;
      this.machineForm = Object.assign({}, row);
      this.addMachineVisible = true;
    },
    //新增硬件
    _submitMachineInfo() {
      if (!this.isEditMachine) {
        this.machineForm.belong_id = this.formdata.id || this.shop_id;
        this.machineForm.company_id = this.company_id;
        this.machineForm.machine_type = "shop";
        console.log(this.machineForm);
        $axios
          .post("v1/canteen/saveMachine", this.machineForm)
          .then(res => {
            this.$emit(
              "updateMachineTable",
              { id: this.canteen_id || this.formdata.id },
              "shop"
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
              "shop"
            );
            this.closeMachineDialog();
            this.$message.success("修改成功");
          })
          .catch(err => console.log(err));
      }
    },
    //发起添加新小卖部请求
    addShop() {
      $axios
        .post("/v1/shop/save", {
          c_id: this.company_id,
          name: this.shop_name,
          taking_mode: this.taking_mode
        })
        .then(res => {
          if (res.msg === "ok") {
            this.$message.success("新增成功");
            this.shop_id = res.data.shop_id;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => console.log(err));
    },
    editShop() {
      $axios
        .post("/v1/shop/update", {
          id: this.formdata.id,
          name: this.shop_name,
          taking_mode: this.taking_mode
        })
        .then(res => {
          if (res.msg === "ok") this.$message.success("修改成功");
        })
        .catch(err => console.log(err));
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
