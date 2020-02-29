<template>
  <div>
    <el-dialog :visible.sync="isOpen" width="45%" :title="dialogTitle" center @close="handleClose">
      <!-- 餐次信息对话框 -->
      <el-dialog
        center
        width="40%"
        :visible.sync="dinnersVisible"
        append-to-body
        @close="_closeDinnerForm"
      >
        <el-form ref="dinnerForm" :model="dinnerForm" label-width="120px">
          <el-form-item label="餐次名称">
            <el-select style="width:150px;" v-model="dinnerForm.name">
              <el-option
                v-for="item in dinnerOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消费策略">
            <el-radio-group v-model="dinnerForm.fixed">
              <el-radio :label="1">固定</el-radio>
              <el-radio :label="2">动态</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="订餐截止日期" label-width="120px">
            <el-radio-group v-model="dinnerForm.type" @change="dinnerForm.type_number = ''">
              <el-radio label="day">
                天
                <span v-if="dinnerForm.type == 'day'">
                  提前
                  <el-input v-model="dinnerForm.type_number" style="width:50px" />天
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
                    />
                  </el-select>
                </span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label>
            <el-time-select
              v-model="dinnerForm.limit_time"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              placeholder="请选择时间"
              style="marginTop: 5px; marginLeft: 5px; "
            />
          </el-form-item>
          <el-form-item label="就餐时间">
            <el-time-select
              style="width:100px"
              placeholder="起始"
              v-model="dinnerForm.meal_time_begin"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
            />
            <span style="margin: 0 10px;">——</span>
            <el-time-select
              style="width:100px"
              placeholder="结束"
              v-model="dinnerForm.meal_time_end"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59',
                minTime: dinnerForm.meal_time_begin
              }"
            />
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
            <el-input v-model="machineForm.name" />
          </el-form-item>
          <el-form-item label="设备号" prop="code">
            <el-input v-model="machineForm.code" />
          </el-form-item>
          <el-form-item label="编号" prop="number">
            <el-input v-model="machineForm.number" />
          </el-form-item>
          <el-form-item label="密码" prop="pwd" v-if="!isEditMachine">
            <el-input v-model="machineForm.pwd" show-password />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeMachineDialog">取 消</el-button>
          <el-button type="primary" @click="_submitMachineInfo">确 定</el-button>
        </div>
      </el-dialog>
      <!--饭堂设置-->
      <el-card body-style="paddingBottom: 5px">
        <div slot="header" class="clearfix">
          <span>饭堂设置</span>
        </div>
        <span style="margin-right: 8px">
          饭堂名称：
          <el-input v-model="canteens" size="small" style="width:200px;" :disabled="isEdit" />
        </span>
        <el-button
          type="primary"
          size="small"
          @click="addCanteen"
          :disabled="isEdit || canteen_id"
        >新增饭堂</el-button>
        <el-button type="primary" size="small" @click="handleClick">添加餐次</el-button>
        <el-table style="width:100%" :data="dataTable" size="small">
          <el-table-column label="餐次" width="60px" prop="name" />
          <!-- <el-table-column label="订餐单位" width="80px" prop="" ></el-table-column> -->
          <el-table-column label="订餐截止时间">
            <span slot-scope="scoped">
              {{
              scoped.row.type === "day"
              ? `提前${scoped.row.type_number}天`
              : `周${scoped.row.type_number + 1}前`
              }}
            </span>
          </el-table-column>
          <el-table-column label="就餐时间">
            <span
              slot-scope="scoped"
            >{{ scoped.row.meal_time_begin }}-{{ scoped.row.meal_time_end }}</span>
          </el-table-column>
          <el-table-column label="消费策略">
            <span slot-scope="scoped">{{ scoped.row.fixed === 1 ? "固定" : "动态" }}</span>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <el-button size="small" type="text" @click="_editDinner(scoped.row)">编辑</el-button>
              <el-button size="small" type="text" @click="_deleteDinner(scoped.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--账户设置-->
      <el-card class="box-card" body-style="paddingBottom: 5px">
        <div slot="header" class="clearfix">账户设置</div>
        <el-form ref="accountForm" :model="accountForm">
          <el-form-item prop="out">
            <el-checkbox v-model="accountForm.out" :true-label="1" :false-label="2">允许非企业人员就餐</el-checkbox>
          </el-form-item>
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
              />元
            </span>
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 外卖设置  -->
      <el-card
        class="box-card"
        body-style="paddingBottom: 5px"
        v-if="accountForm.dining_mode&&accountForm.dining_mode  != 1"
      >
        <div slot="header" class="clearfix">外卖设置</div>
        <el-form ref="outConfigForm" :model="outConfigForm" label-width="90px">
          <el-form-item prop="fee" label="配送费用：">
            <div>
              企业人员
              <el-input
                v-model="outConfigForm.in_fee"
                size="small"
                style="width: 50px; margin:0 5px"
              ></el-input>元；
              非企业人员
              <el-input
                v-model="outConfigForm.out_fee"
                size="small"
                style="width: 50px; margin:0 5px"
              ></el-input>元；
            </div>
          </el-form-item>
          <el-form-item prop="address_limit" label="配送范围：">
            <el-radio-group v-model="outConfigForm.address_limit">
              <el-radio :label="1">仅配送指定范围</el-radio>
              <el-radio :label="2">无限制</el-radio>
            </el-radio-group>
            <p>
              <el-button type="text" @click="addNewAddr">添加地址选项</el-button>
            </p>
            <div
              class="address-setting"
              v-if="outConfigForm.address_limit && outConfigForm.address_limit==1"
            >
              <div v-for="(item,key) in addrList" :key="key">
                <el-select
                  style="width:20%"
                  size="small"
                  :disabled="item.disabled"
                  v-model="item.province_id"
                  @change="(e)=>choseProvince(key,e)"
                  placeholder="省级地区"
                >
                  <el-option
                    v-for="prov in item.province_arr"
                    :key="prov.id"
                    :label="prov.value"
                    :value="prov.id"
                  ></el-option>
                </el-select>
                <el-select
                  style="width:20%"
                  size="small"
                  :disabled="item.disabled"
                  v-model="item.city_id"
                  @change="(e)=>choseCity(key,e)"
                  placeholder="市级地区"
                >
                  <el-option
                    v-for="city in item.now_city_arr"
                    :key="city.id"
                    :label="city.value"
                    :value="city.id"
                  ></el-option>
                </el-select>
                <el-select
                  style="width:20%"
                  size="small"
                  :disabled="item.disabled"
                  v-model="item.area_id"
                  @change="(e)=>choseBlock(key,e)"
                  placeholder="区级地区"
                >
                  <el-option
                    v-for="area in item.now_area_arr"
                    :key="area.id"
                    :label="area.value"
                    :value="area.id"
                  ></el-option>
                </el-select>
                <el-input v-model="item.addr" style="width:30%" size="small"></el-input>
                <el-button
                  @click.prevent="removeAddr(item, key)"
                  size="small"
                  icon="el-icon-delete"
                  style="marginLeft:1px"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="remark" label="外送说明：">
            <el-input
              style="padding: 10px 0"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="outConfigForm.remark"
            ></el-input>
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
            @click="openMachineDialog"
          >添加硬件</el-button>
        </div>
        <el-table :data="machineTable" style="width:100%" size="mini">
          <el-table-column label="编号" prop="number" />
          <el-table-column label="设备名称" prop="name" />
          <el-table-column label="设备号" prop="code" />
          <!-- <el-table-column label="密码" prop="pwd"></el-table-column> -->
          <el-table-column label="状态">
            <template slot-scope="scoped">
              <span>{{ scoped.row.state === 1 ? "正常" : "异常" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <el-button size="small" type="text" @click="_editMachine(scoped.row)">编辑</el-button>
              <el-button size="small" type="text" @click="_deleteMachine(scoped.row)">删除</el-button>
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
import mapJson from "../../../utils/map.json";
import { Loading } from "element-ui";
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
const dinner_name = [
  { value: "早餐" },
  { value: "午餐" },
  { value: "下午茶" },
  { value: "晚餐" },
  { value: "宵夜" }
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
    "modules",
    "editAddressForm",
    "editOutConfig"
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
      isEditDinner: false,
      editedDinnerIndex: null,
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
      dinnerOptions: dinner_name,
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
        limit_money: 1,
        out: 1
      },
      outConfigForm: {
        in_fee: "",
        out_fee: "",
        address_limit: 1,
        remark: ""
      },
      addrList: [
        {
          province_id: "",
          city_id: "",
          area_id: "",
          province: "",
          city: "",
          area: "",
          now_city_arr: [], // 当前选中省级的市
          now_area_arr: [], //当前选中市级的区
          province_arr: [], // 所有省
          city_arr: [], // 所有市
          area_arr: [], // 所有区
          addr: "",
          disabled: false
        }
      ],
      cancelAddressId: [],
      dataTable: [],
      machineTable: [],
      addressList: []
    };
  },
  watch: {
    visible(val) {
      if (val && !this.isEdit) {
        this.getCityData();
      }
      this.isOpen = val;
    },
    formdata(val) {
      this.canteens = val.name;
    },
    machineList(val) {
      if (this.isEdit) {
        this.machineTable = val;
      }
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
    editOutConfig(val) {
      if (this.isEdit) {
        this.outConfigForm = val;
      }
    },
    editAddressForm(val) {
      if (this.isEdit) {
        val.forEach((item, index) => {
          this.addrList[index].id = item.id;
          this.addrList[index].province_id = item.province;
          this.addrList[index].city_id = item.city;
          this.addrList[index].area_id = item.area;
          this.addrList[index].province = item.province;
          this.addrList[index].city = item.city;
          this.addrList[index].area = item.area;
          this.addrList[index].addr = item.address;
          this.addrList[index].disabled = true;
        });
      }
      if (!val.length) {
        this.getCityData();
      }
    }
  },
  created() {
    if (!this.isEdit) {
    }
  },
  methods: {
    handleClick() {
      this.dinnersVisible = true;
    },
    trim(val) {
      return val.replace(/(^\s*)|(\s*$)/g, "");
    },
    async addCanteen() {
      let loading = Loading.service({ text: "拼命加载中" });
      await $axios
        .post("/api/v1/canteen/save", {
          canteens: this.trim(this.canteens),
          c_id: this.company_id
        })
        .then(res => {
          if (res.msg === "ok") {
            this.canteens = "";
            this.canteen_id = res.data.canteen_id;
            this.$message.success("饭堂创建成功，请继续操作");
            this.$emit("updateCanteenList", this.company_id);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
      loading.close();
    },
    _addDinner() {
      //添加餐次信息
      if (
        !this.dinnerForm.meal_time_begin ||
        !this.dinnerForm.meal_time_end ||
        !this.dinnerForm.limit_time ||
        !this.dinnerForm.name
      ) {
        this.$message.error("请正确填写餐次信息");
        return;
      }
      console.log(this.dataTable);
      let table = JSON.parse(JSON.stringify(this.dataTable));
      if (this.isEditDinner) {
        console.log(this.dinnerForm);
        this.$set(this.dataTable, this.editedDinnerIndex, this.dinnerForm);
        this._closeDinnerForm();
      } else {
        this.dataTable.push({ ...this.dinnerForm });
        this._closeDinnerForm();
      }
    },
    _editDinner(row) {
      this.dinnerForm = Object.assign({}, row);
      this.editedDinnerIndex = this.dataTable.findIndex(item => item === row);
      this.isEditDinner = true;
      this.dinnersVisible = true;
    },
    _deleteDinner(row) {
      if (row.id) {
        this.$confirm("此操作将删除该餐次, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            this.dataTable = this.dataTable.filter(item => item !== row);
            const res = await $axios.post("/api/v1/canteen/dinner/delete", {
              dinner_id: row.id
            });

            if (res.msg === "ok") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.dataTable = this.dataTable.filter(item => item !== row);
      }
    },
    _closeDinnerForm() {
      this.dinnerForm = {
        name: "",
        type: "day",
        type_number: "",
        limit_time: "",
        meal_time_begin: "",
        meal_time_end: "",
        fixed: 1
      };
      this.editedDinnerIndex = null;
      this.dinnersVisible = false;
      this.isEditDinner = false;
    },
    // 配置饭堂请求
    _submitOptions() {
      let data = {};
      let add = [];
      let address = {};
      data.dinners = JSON.stringify(this.dataTable);
      data.account = JSON.stringify(this.accountForm);
      data.out_config = JSON.stringify(this.outConfigForm);
      if (this.isEdit) {
        add = this.address;
        address = { add, cancel: this.cancelAddressId };
        data.address = JSON.stringify(address);
        data.c_id = this.formdata.id;
      } else {
        data.c_id = this.canteen_id;
        data.address = JSON.stringify(this.address);
      }
      const url = !this.isEdit
        ? "/api/v1/canteen/configuration/save"
        : "/api/v1/canteen/configuration/update";
      $axios
        .post(url, data)
        .then(res => {
          if (res.msg === "ok") {
            this.$message.success("设置成功");
            this.dataTable.length = 0;
            this.$emit("updateCanteenList", this.company_id);
            this.canteen_id = null;
            this.handleClose();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => console.log(err));
    },
    handleClose() {
      this.dataTable.length = 0;
      this.cancelAddressId = [];
      this.addrList = [
        {
          province_id: "",
          city_id: "",
          area_id: "",
          province: "",
          city: "",
          area: "",
          now_city_arr: [], // 当前选中省级的市
          now_area_arr: [], //当前选中市级的区
          province_arr: [], // 所有省
          city_arr: [], // 所有市
          area_arr: [], // 所有区
          addr: ""
        }
      ];
      (this.outConfigForm = {
        in_fee: "",
        out_fee: "",
        address_limit: 1,
        remark: ""
      }),
        this.$refs.accountForm.resetFields();
      this.$emit("closeAdd", false);
    },
    changeDay(val) {
      this.accountForm.clean_day = val > 31 ? 31 : val;
    },
    openMachineDialog() {
      this.addMachineVisible = true;
      this.machineForm = {};
    },
    closeMachineDialog() {
      this.addMachineVisible = false;
      this.isEditMachine = false;
      this.machineForm = {};
    },
    _deleteMachine(row) {
      let id = row.id;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await $axios.post("/api/v1/canteen/deleteMachine", {
            id
          });
          if (res.msg === "ok") {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            await this.getCompanyMachine(this.company_id);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    _editMachine(row) {
      this.isEditMachine = true;
      this.machineForm = Object.assign({}, row);
      this.addMachineVisible = true;
    },
    async _submitMachineInfo() {
      //新增硬件
      if (!this.isEditMachine) {
        this.machineForm.belong_id = this.formdata.id || this.canteen_id;
        this.machineForm.company_id = this.company_id;
        this.machineForm.machine_type = "canteen";
        const res = await $axios.post(
          "/api/v1/canteen/saveMachine",
          this.machineForm
        );
        if (res.msg === "ok") {
          await this.$emit(
            "updateMachineTable",
            { id: this.canteen_id || this.formdata.id },
            "canteen"
          );
          this.$message.success("添加成功");
        } else {
          this.$message.error(res.msg);
        }
        this.closeMachineDialog();
      } else {
        $axios
          .post("/api/v1/canteen/updateMachine", this.machineForm)
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
    },
    // 加载china地点数据，三级
    getCityData: function() {
      let len = this.addrList.length;
      let that = this;
      let data = mapJson;
      that.addrList[len - 1].province_arr = [];
      that.addrList[len - 1].city_arr = [];
      that.addrList[len - 1].area_arr = [];
      // 省市区数据分类
      for (let item in data) {
        if (item.match(/0000$/)) {
          //省
          that.addrList[len - 1].province_arr.push({
            id: item,
            value: data[item],
            children: []
          });
        } else if (item.match(/00$/)) {
          //市
          that.addrList[len - 1].city_arr.push({
            id: item,
            value: data[item],
            children: []
          });
        } else {
          //区
          that.addrList[len - 1].area_arr.push({ id: item, value: data[item] });
        }
      }
      // 分类市级
      for (let index in that.addrList[len - 1].province_arr) {
        for (let index1 in that.addrList[len - 1].city_arr) {
          if (
            that.addrList[len - 1].province_arr[index].id.slice(0, 2) ===
            that.addrList[len - 1].city_arr[index1].id.slice(0, 2)
          ) {
            that.addrList[len - 1].province_arr[index].children.push(
              that.addrList[len - 1].city_arr[index1]
            );
          }
        }
      }
      // 分类区级
      for (let item1 in that.addrList[len - 1].city_arr) {
        for (let item2 in that.addrList[len - 1].area_arr) {
          if (
            that.addrList[len - 1].area_arr[item2].id.slice(0, 4) ===
            that.addrList[len - 1].city_arr[item1].id.slice(0, 4)
          ) {
            that.addrList[len - 1].city_arr[item1].children.push(
              that.addrList[len - 1].area_arr[item2]
            );
          }
        }
      }
    },
    // 选省
    choseProvince: function(key, e) {
      for (let index2 in this.addrList[key].province_arr) {
        if (e === this.addrList[key].province_arr[index2].id) {
          this.addrList[key].province = this.addrList[key].province_arr[
            index2
          ].value;
          this.addrList[key].now_city_arr = this.addrList[key].province_arr[
            index2
          ].children;
          this.addrList[key].city = this.addrList[key].province_arr[
            index2
          ].children[0].value;
          this.addrList[key].city_id = this.addrList[key].province_arr[
            index2
          ].children[0].id;
          this.addrList[key].now_area_arr = this.addrList[key].province_arr[
            index2
          ].children[0].children;
          this.addrList[key].area = this.addrList[key].province_arr[
            index2
          ].children[0].children[0].value;
          this.addrList[key].area_id = this.addrList[key].now_area_arr[0].id;
        }
      }
    },
    // 选市
    choseCity: function(key, e) {
      for (let index3 in this.addrList[key].city_arr) {
        if (e === this.addrList[key].city_arr[index3].id) {
          this.addrList[key].city_id = this.addrList[key].city_arr[index3].id;
          this.addrList[key].now_area_arr = this.addrList[key].city_arr[
            index3
          ].children;
          this.addrList[key].area = this.addrList[key].city_arr[
            index3
          ].children[0].value;
          this.addrList[key].area_id = this.addrList[key].now_area_arr[0].id;
        }
      }
    },
    // 选区
    choseBlock: function(key, e) {
      this.addrList[key].area_id = e;
    },
    addNewAddr() {
      this.addrList.push({
        province_id: "",
        city_id: "",
        area_id: "",
        province: "",
        city: "",
        area: "",
        now_city_arr: [], // 当前选中省级的市
        now_area_arr: [], //当前选中市级的区
        province_arr: [], // 所有省
        city_arr: [], // 所有市
        area_arr: [], // 所有区
        addr: "",
        disabled: false
      });
      this.getCityData();
    },
    removeAddr(item, key) {
      if (this.addrList.length === 1) return;
      this.addrList.splice(key, 1);
      if (item.id) {
        this.cancelAddressId.push(item.id);
      }
    }
  },
  computed: {
    address: function() {
      return this.addrList.map(item => {
        return {
          id: item.id,
          province: item.province,
          area: item.area,
          city: item.city,
          address: item.addr
        };
      });
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
