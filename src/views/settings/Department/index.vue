<template>
  <div class="department">
    <div class="nav-title">部门人员设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :inline="true">
          <el-form-item label="公司">
            <el-select v-model="queryForm.c_id" @change="selectCompany">
              <el-option
                v-for="item in companyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button
            type="primary"
            :disabled="!!!queryForm.c_id"
            @click="() => openDepartmentDialog({}, { id: 0 })"
            >新增一级部门</el-button
          >
          <el-button type="primary" @click="openStaffDialog" :disabled="!!!d_id"
            >新增人员</el-button
          >
          <el-button type="primary" :disabled="!!!d_id">批量新增人员</el-button>
          <el-button type="danger" :disabled="!!!d_id" @click="deleteDepartment"
            >删除部门</el-button
          >
        </el-form>
        <div class="main-content">
          <el-row :gutter="10">
            <el-col :span="4">
              <el-input
                size="small"
                v-model="filterText"
                placeholder="关键字查询"
              ></el-input>
              <el-tree
                class="tree"
                ref="tree"
                :data="treeData"
                :props="defaultProps"
                :filter-node-method="filterNode"
                default-expand-all
              >
                <span class="department-tree-node" slot-scope="{ node, data }">
                  <span>
                    <el-button type="text" @click="handleNodeClick(data)">{{
                      node.label
                    }}</el-button>
                  </span>
                  <span class="btns-text">
                    <el-button
                      type="text"
                      size="small"
                      @click="() => editDepartmentDialog(node, data)"
                      >编辑</el-button
                    >
                    <el-button
                      type="text"
                      size="small"
                      @click="() => openDepartmentDialog(node, data)"
                      >新增</el-button
                    >
                  </span>
                </span>
              </el-tree>
            </el-col>
            <el-col :span="20">
              <el-table style="width:100%" :data="tabledata">
                <el-table-column label="归属饭堂">
                  <template slot-scope="scoped">
                    <span>
                      {{
                        scoped.row.canteens
                          .map(item => {
                            if (item.info && item.info.name) {
                              return item.info.name;
                            }
                          })
                          .filter(item => item)
                          .join(",")
                      }}
                      <!--使用filter去除空对象-->
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="人员类型" prop="type"></el-table-column>
                <el-table-column label="员工编号" prop="code"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column
                  label="手机号码"
                  prop="phone"
                ></el-table-column>
                <el-table-column label="卡号" prop="card_num"></el-table-column>
                <el-table-column label="二维码有效周期" show-overflow-tooltip>
                  <template slot-scope="scoped">
                    <el-button type="text" @click="showQRcode(scoped.row)">{{
                      scoped.row.expiry_date
                    }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" prop="new">
                  <template slot-scope="scoped">
                    <div style="display:flex; flex-wrap:wrap">
                      <el-button
                        size="mini"
                        style="marginBottom: 2px"
                        @click="edit(scoped.row)"
                        >编辑</el-button
                      >
                      <el-button
                        size="mini"
                        style="marginBottom: 2px"
                        @click="edit(scoped.row)"
                        >移动</el-button
                      >
                      <el-button
                        size="mini"
                        style="marginBottom: 2px"
                        @click="_deleteStaff(scoped.row)"
                        >删除</el-button
                      >
                      <el-button
                        size="mini"
                        @click="openQRSettingDialog(scoped.row)"
                        >生成二维码</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                :currentPage="current_page"
                :total="total"
                :pageSize="size"
                @pagination="fetchList"
              ></pagination>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <el-dialog
      title="新增员工"
      width="30%"
      center
      :visible.sync="addStaffVisible"
      :close-on-click-modal="false"
      @close="closeStaffDialog"
    >
      <el-form :model="addFormData" ref="addFormData" label-width="100px">
        <el-form-item label="归属饭堂" prop="canteens">
          <el-checkbox-group v-model="canteens" @change="chooseCanteen">
            <el-checkbox
              v-for="item in canteenGroup"
              :label="item"
              :key="item.id"
              :value="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="人员类型" prop="t_id">
          <el-select v-model="addFormData.t_id">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工编号" prop="code">
          <el-input v-model="addFormData.code"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="username">
          <el-input v-model="addFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addFormData.phone"></el-input>
        </el-form-item>
        <el-form-item label="卡号" prop="card_num">
          <el-input v-model="addFormData.card_num"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeStaffDialog">取 消</el-button>
        <el-button type="primary" @click="_addNewStaff">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="newDepartmentVisible"
      title="新增部门"
      center
      width="30%"
      @close="closeDepartmentDialog"
    >
      <el-form :model="departmentForm" label-width="80px" ref="departmentForm">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="departmentForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="departmentForm.parent_id" label="归属部门">
          <el-input
            :disabled="true"
            v-model="departmentForm.parent_name"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDepartmentDialog">取 消</el-button>
        <el-button type="primary" @click="_addNewDepartment">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      @close="closeQRSettingDialog"
      :visible.sync="QRsettingVisible"
      width="35%"
      center
      title="二维码设置"
    >
      <el-form :model="QRForm">
        <el-form-item label="二维码有效期">
          <el-input style="width:50px" size="small" v-model="year" />年
          <el-input style="width:50px" size="small" v-model="month" />月
          <el-input style="width:50px" size="small" v-model="day" />日
          <el-input style="width:50px" size="small" v-model="hour" />时
          <el-input style="width:50px" size="small" v-model="minute" />分
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeQRSettingDialog">取 消</el-button>
        <el-button type="primary" @click="_comfirmSettingQR">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="QRcodeVisible"
      width="20%"
      center
      title="二维码信息"
    >
      <img width="100%" :src="QRcodeDetail.url" alt />
      <ul class="qr-detail">
        <li>员工姓名：{{ QRcodeDetail.username }}</li>
        <li>生成时间：{{ QRcodeDetail.create_time }}</li>
        <li>失效时间：{{ QRcodeDetail.expiry_date }}</li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Pagination from "@/components/Pagination";
import $axios from "@/api/index";
import { flatten } from "@/utils/flatternArr";
export default {
  components: { Pagination },
  data() {
    return {
      d_id: "", //该页面全局部门id
      c_id: "", //该页面全局企业id
      addStaffVisible: false,
      newDepartmentVisible: false,
      isEditDepartment: false,
      QRsettingVisible: false,
      QRcodeVisible: false,
      filterText: "",
      canteens: [],
      departmentDetail: {},
      queryForm: {
        c_id: ""
      },
      departmentForm: {
        name: "",
        parent_id: "0",
        c_id: ""
      },
      QRForm: {
        id: "",
        minute: "",
        hour: "",
        day: "",
        month: "",
        year: ""
      },
      QRcodeDetail: {},
      addFormData: {
        company_id: "", //新增员工归属企业id
        canteens: [],
        d_id: "",
        t_id: "",
        code: "",
        phone: "",
        card_num: "",
        username: ""
      },
      treeData: [],
      defaultProps: {
        children: "items",
        label: "name"
      },
      value: "",
      canteenGroup: [],
      tabledata: [],
      roleOptions: [],
      companyOptions: [],
      current_page: 1,
      size: 5,
      total: 10
    };
  },
  filters: {
    showTime(val, str) {
      return this.$moment(val).format(str);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    ...mapState({
      role: state => state.user.role,
      grade: state => state.user.grade
    }),
    year: {
      get() {
        let val = this.QRForm.year.toString().replace(/[^\d]/g, "");
        val = this.validateNumber(val, "year");
        return val;
      },
      set(val) {
        val = this.validateNumber(val, "year");
        this.QRForm.year = val;
      }
    },
    month: {
      get() {
        let val = this.QRForm.month.toString().replace(/[^\d]/g, "");
        val = this.validateNumber(val, "month");
        return val;
      },
      set(val) {
        val = this.validateNumber(val, "month");
        this.QRForm.month = val;
      }
    },
    day: {
      get() {
        let val = this.QRForm.day.toString().replace(/[^\d]/g, "");
        val = this.validateNumber(val, "day");
        return val;
      },
      set(val) {
        val = this.validateNumber(val, "day");
        this.QRForm.day = val;
      }
    },
    hour: {
      get() {
        let val = this.QRForm.hour.toString().replace(/[^\d]/g, "");
        val = this.validateNumber(val, "hour");
        return val;
      },
      set(val) {
        val = this.validateNumber(val, "hour");
        this.QRForm.hour = val;
      }
    },
    minute: {
      get() {
        let val = this.QRForm.minute.toString().replace(/[^\d]/g, "");
        val = this.validateNumber(val, "minute");
        return val;
      },
      set(val) {
        val = this.validateNumber(val, "minute");
        this.QRForm.minute = val;
      }
    }
  },
  created() {
    this.fetchDepartmentTreeData();
    this.fetchList();
    this.getRoleType();
    this.getCompanies();
  },
  methods: {
    validateNumber(val, type) {
      switch (type) {
        case "year":
          if (val < 0) {
            return 0;
          } else if (val > 5) {
            return 5;
          } else {
            return val;
          }
          break;
        case "month":
          if (val < 0) {
            return 0;
          } else if (val > 11) {
            return 11;
          } else {
            return val;
          }
          break;
        case "day":
          if (val < 0) {
            return 0;
          } else if (val > 30) {
            return 30;
          } else {
            return val;
          }
          break;
        case "hour":
          if (val < 0) {
            return 0;
          } else if (val > 23) {
            return 23;
          } else {
            return val;
          }
          break;
        case "minute":
          if (val < 0) {
            return 0;
          } else if (val > 59) {
            return 59;
          } else {
            return val;
          }
          break;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    async selectCompany(c_id) {
      await this.getCanteenOptions(c_id);
      await this.fetchDepartmentTreeData(c_id);
      this.c_id = c_id;
      this.addFormData.company_id = c_id;
      this.d_id = "";
      this.addFormData.d_id = "";
      this.departmentDetail = {};
    },
    async handleNodeClick(data) {
      this.d_id = data.id;
      this.addFormData.d_id = data.id;
      this.departmentDetail = data;
      await this.fetchList(1);
    },
    async getCanteenOptions(c_id) {
      let company_id = c_id || "";
      const res = await $axios.get(
        `/v1/company/consumptionLocation?company_id=${company_id}`
      );
      if (res.msg === "ok") {
        this.canteenGroup = Array.from(res.data.canteen);
      }
      return res;
    },
    chooseCanteen(val) {
      this.addFormData.canteens = [];
      let _canteen = [];
      val.forEach(item => {
        _canteen.push({
          canteen_id: item.id
        });
      });
      this.addFormData.canteens = JSON.stringify(_canteen);
    },

    editDepartmentDialog(node, data) {
      this.isEditDepartment = true;
      this.departmentForm = Object.assign({}, this.departmentForm, data);
      this.newDepartmentVisible = true;
    },
    openDepartmentDialog(node, data) {
      this.departmentForm.c_id = this.queryForm.c_id;
      this.departmentForm = Object.assign({}, this.departmentForm, {
        parent_id: data.id,
        parent_name: data.name
      });
      this.newDepartmentVisible = true;
    },
    closeDepartmentDialog() {
      this.newDepartmentVisible = false;
      this.isEditDepartment = false;
      this.$refs.departmentForm.resetFields();
    },
    async _addNewDepartment() {
      if (!this.isEditDepartment) {
        //新增部门
        const res = await $axios.post(
          "/v1/department/save",
          this.departmentForm
        );
        if (res.msg === "ok") {
          this.$message.success("新增部门成功");
          this.closeDepartmentDialog();
          await this.fetchDepartmentTreeData();
        } else {
          this.$message.error("操作失败，失败原因:" + res.msg);
        }
      } else {
        //编辑部门
        const res = await $axios.post(
          "/v1/department/update",
          this.departmentForm
        );
        if (res.msg === "ok") {
          this.$message.success("修改成功");
          this.closeDepartmentDialog();
          await this.fetchDepartmentTreeData();
        } else {
          this.$message.error("操作失败，失败原因:" + res.msg);
        }
      }
    },
    async deleteDepartment() {
      let detail = this.departmentDetail;
      this.$confirm(`此操作将删除${detail.name}部门, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await $axios.post("/v1/department/delete", {
            id: detail.id
          });
          if (res.msg === "ok") {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            await this.fetchDepartmentTreeData();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async getCompanies() {
      const res = await $axios.get("/v1/admin/companies");
      if (res.msg === "ok") {
        this.companyOptions = flatten(res.data);
      }
    },
    async getRoleType() {
      const res = await $axios.get("/v1/role/types");
      if (res.msg === "ok") {
        this.roleOptions = res.data.data;
      }
    },
    async fetchDepartmentTreeData(c_id) {
      c_id = c_id || this.queryForm.c_id || "";
      const res = await $axios.get(`/v1/departments?c_id=${c_id}`);
      if (res.msg === "ok") {
        this.treeData = Array.from(res.data);
      }
    },
    async fetchList(page) {
      page = page || this.current_page;
      const res = await $axios.get(
        `/v1/staffs?page=${page}&size=${this.size}`,
        {
          c_id: this.c_id, //company_id,
          d_id: this.d_id //d_id,
        }
      );
      if (res.msg === "ok") {
        this.tabledata = Array.from(res.data.data);
        this.current_page = res.data.current_page;
        this.total = res.data.total;
      }
    },
    openStaffDialog() {
      this.addStaffVisible = true;
    },
    edit(val) {
      console.log(val);
    },
    closeStaffDialog() {
      this.$refs.addFormData.resetFields();
      this.addStaffVisible = false;
    },
    async _addNewStaff() {
      const res = await $axios.post(
        "/v1/department/staff/save",
        this.addFormData
      );
      if (res.msg === "ok") {
        this.$message.success("添加成功");
        this.closeStaffDialog();
        await this.fetchList(1);
      } else {
        this.$message.error(res.msg);
      }
    },
    async _deleteStaff(row) {
      let id = row.id;
      const res = await $axios.post("/v1/department/staff/delete", { id });
      if (res.msg === "ok") {
        this.$message.success("删除成功");
        await this.fetchList(this.current_page);
      }
    },
    openQRSettingDialog(row) {
      let id = row.id; //员工id
      this.QRForm.id = id;
      this.QRsettingVisible = true;
      console.log(this.QRForm);
    },
    closeQRSettingDialog() {
      this.QRsettingVisible = false;
      this.QRForm = { minute: "", hour: "", day: "", month: "", year: "" };
    },
    async _comfirmSettingQR() {
      const res = await $axios.post("/v1/staff/qrcode/save", this.QRForm);
      console.log(res);
      if (res.msg === "ok") {
        this.$message.success("设置成功");
        this.closeQRSettingDialog();
        await this.fetchList(this.current_page);
      } else {
        this.$message.error(res.msg);
      }
    },
    showQRcode(row) {
      console.log(row);
      this.QRcodeDetail = Object.assign({}, this.QRcodeDetail, row);
      this.QRcodeVisible = true;
    },
    closeQRcode() {
      this.QRcodeVisible = false;
      this.QRcodeDetail = {};
    }
  }
};
</script>

<style lang="scss" scoped>
.department-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.canteenCheckbox {
  margin-bottom: -5px;
}
.qr-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  li {
    flex: 1;
    display: block;
  }
}
</style>
