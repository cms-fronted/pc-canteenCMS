<template>
  <div class="department">
    <div class="nav-title">部门人员设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :inline="true">
          <el-form-item label="公司" v-if="companiesVisible">
            <el-select
              v-model="queryForm.c_id"
              placeholder="请选择企业"
              filterable
              @change="selectCompany"
            >
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
          <el-upload
            class="upload-excel"
            ref="upload"
            :limit="100"
            :headers="header"
            :show-file-list="false"
            accept=".xls, .xlsx"
            action="https://tonglingok.com/canteen/api/v1/department/staff/upload"
            :on-success="handleSuccess"
            :data="{ c_id: c_id }"
            name="staffs"
          >
            <el-button
              type="primary"
              :disabled="!!!c_id"
              style="margin-left:10px"
              >批量导入人员</el-button
            >
          </el-upload>
          <el-button
            type="danger"
            style="margin-left:10px"
            :disabled="!!!d_id"
            @click="deleteDepartment"
            >删除当前部门</el-button
          >
          <el-button type="primary" @click="openRoleTypeDialog"
            >新增类型</el-button
          >
          <el-button @click="downloadTemplate">模板下载</el-button>
          <el-button @click="exportFile">导出</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-row :gutter="10">
          <el-col :span="6">
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
              :highlight-current="true"
              @node-click="handleNodeClick"
              :expand-on-click-node="false"
            >
              <span class="department-tree-node" slot-scope="{ node, data }">
                <span>
                  <!-- <el-button
                    type="text"
                    @click="handleNodeClick(data, $event)"
                    > -->
                  {{ node.label }}
                  <!-- </el-button
                  > -->
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
          <el-col :span="18">
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
              <el-table-column label="手机号码" prop="phone"></el-table-column>
              <el-table-column label="卡号" prop="card_num"></el-table-column>
              <el-table-column label="消费二维码" show-overflow-tooltip>
                <template slot-scope="scoped">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scoped.row.expiry_date"
                    placement="bottom"
                  >
                    <el-button
                      size="mini"
                      type="text"
                      @click="showQRcode(scoped.row)"
                      >点击查看</el-button
                    >
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="new">
                <template slot-scope="scoped">
                  <div class="table-button">
                    <el-button
                      size="mini"
                      type="text"
                      @click="editStaff(scoped.row)"
                      >编辑</el-button
                    >
                    <el-button
                      size="mini"
                      type="text"
                      @click="openMoveStaff(scoped.row)"
                      >移动</el-button
                    >
                    <el-button
                      size="mini"
                      type="text"
                      @click="_deleteStaff(scoped.row)"
                      >删除</el-button
                    >
                    <el-button
                      size="mini"
                      type="text"
                      @click="openQRSettingDialog(scoped.row)"
                      >设置二维码</el-button
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

    <el-dialog
      :title="staffTitle"
      width="30%"
      center
      :visible.sync="addStaffVisible"
      :close-on-click-modal="false"
      @close="closeStaffDialog"
    >
      <el-form :model="addFormData" ref="addFormData" label-width="100px">
        <el-form-item label="归属饭堂" prop="canteens_arr">
          <el-checkbox-group v-model="addFormData.canteens_arr">
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
      :visible.sync="QRsettingVisible"
      @close="closeQRSettingDialog"
      width="35%"
      center
      title="设置二维码"
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
      :visible.sync="moveDialogVisible"
      width="30%"
      title="移动员工"
      @close="closeMoveDialog"
      center
    >
      <el-form ref="moveStaff" label-width="80px">
        <el-form-item label="当前部门">
          <el-input v-model="cureentDepartment.department" disabled></el-input>
        </el-form-item>
        <el-form-item label="移至">
          <el-select
            filterable
            placeholder="请选择部门"
            v-model="cureentDepartment.new_d_id"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeMoveDialog">取 消</el-button>
        <el-button type="primary" @click="_comfirmMove">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      width="30%"
      :visible.sync="roleTypeDialogVisible"
      center
      title="新增角色类型"
      @close="closeRoleTypeDialog"
    >
      <el-form :model="roleTypeForm" ref="roleTypeForm" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleTypeForm.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRoleTypeDialog">取 消</el-button>
        <el-button type="primary" @click="_addRoleType">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="QRcodeVisible"
      :show-close="false"
      width="40%"
      ref="print"
      center
      title="二维码信息"
      top="5vh"
    >
      <img width="100%" :src="QRcodeDetail.url" alt />
      <ul class="qr-detail">
        <li>员工姓名：{{ QRcodeDetail.username }}</li>
        <li>生成时间：{{ QRcodeDetail.create_time }}</li>
        <li>失效时间：{{ QRcodeDetail.expiry_date }}</li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="QRcodeVisible = false">关 闭</el-button>
        <el-button type="success" @click="_print">打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "@/store";
import Pagination from "@/components/Pagination";
import $axios from "@/api/index";
import { flatten, unshiftAllOptions } from "@/utils/flatternArr";
export default {
  components: { Pagination },
  data() {
    return {
      header: {
        token: store.getters.token
      },
      d_id: "", //该页面全局部门id
      c_id: "", //该页面全局企业id
      addStaffVisible: false,
      newDepartmentVisible: false,
      isEditDepartment: false,
      QRsettingVisible: false,
      moveDialogVisible: false,
      roleTypeDialogVisible: false,
      QRcodeVisible: false,
      filterText: "",
      canteens: [],
      haveCanteens: [],
      isEditStaff: false,
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
        id: "",
        canteens_arr: [],
        company_id: "", //新增员工归属企业id
        canteens: [],
        d_id: "",
        t_id: "",
        code: "",
        phone: "",
        card_num: "",
        username: ""
      },
      treeData: [], //部门树状数据
      departmentOptions: [], //将部门树状数据转换为扁平化数据
      defaultProps: {
        children: "items",
        label: "name"
      },
      cureentDepartment: {
        department: "", //当前部门名称
        id: "", //员工id
        new_d_id: "" //新部门id
      },
      roleTypeForm: {
        name: ""
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
      grade: state => state.user.grade,
      token: state => state.user.token
    }),
    staffTitle: {
      get() {
        return this.isEditStaff ? "编辑员工" : "新增员工";
      }
    },
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
    },
    companiesVisible() {
      return this.grade != 3;
    }
  },
  async created() {
    // this.fetchList();
    await this.getRoleType();
    if (this.companyOptions) {
      //  await this.fetchDepartmentTreeData();
      await this.getCompanies();
    } else {
      await this.getDepartmentListWithoutCid();
    }
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
    async getCompanies() {
      const res = await $axios.get(
        "https://tonglingok.com/canteen/api/v1/admin/companies"
      );
      if (res.msg === "ok") {
        this.companyOptions = flatten(res.data);
        this.queryForm.c_id = this.companyOptions[0].id;
        this.c_id = this.companyOptions[0].id;
        await this.fetchDepartmentTreeData(this.c_id);
        await this.getCanteenOptions(this.c_id);
      }
    },
    async getDepartmentListWithoutCid() {
      const res = await $axios.get(
        "https://tonglingok.com/canteen/api/v1/admin/departments"
      );
      if (res.msg === "ok") {
        this.departmentList = unshiftAllOptions(Array.from(res.data));
      }
    },
    async getRoleType() {
      const res = await $axios.get(
        "https://tonglingok.com/canteen/api/v1/role/types"
      );
      if (res.msg === "ok") {
        this.roleOptions = res.data.data;
      }
    },
    async fetchDepartmentTreeData(c_id) {
      c_id = c_id || this.queryForm.c_id || "";
      const res = await $axios.get(
        `https://tonglingok.com/canteen/api/v1/departments?c_id=${c_id}`
      );
      if (res.msg === "ok") {
        this.treeData = Array.from(res.data);
        this.departmentOptions = flatten(res.data);
      }
    },
    async exportFile() {
      await this.$exportExcel(
        "https://tonglingok.com/canteen/api/v1/export/staffs",
        {
          company_id: this.c_id,
          department_id: this.d_id
        }
      );
    },
    async fetchList(page) {
      page = Number(page) || this.current_page;
      const res = await $axios.get(
        `https://tonglingok.com/canteen/api/v1/staffs?page=${page}&size=${
          this.size
        }`,
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
    async selectCompany(c_id) {
      await this.fetchDepartmentTreeData(c_id);
      await this.getCanteenOptions(c_id);
      this.c_id = c_id;
      this.d_id = "";
      this.addFormData.company_id = c_id;
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
        `https://tonglingok.com/canteen/api/v1/company/consumptionLocation?company_id=${company_id}`
      );
      if (res.msg === "ok") {
        this.canteenGroup = Array.from(res.data.canteen);
      }
      return res;
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
          "https://tonglingok.com/canteen/api/v1/department/save",
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
          "https://tonglingok.com/canteen/api/v1/department/update",
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
          const res = await $axios.post(
            "https://tonglingok.com/canteen/api/v1/department/delete",
            {
              id: detail.id
            }
          );
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

    async openStaffDialog() {
      await this.getCanteenOptions(this.c_id);
      this.addStaffVisible = true;
    },
    editStaff(val) {
      this.isEditStaff = true;
      let canteensChecked = val.canteens.map(item => item.canteen_id);
      canteensChecked.filter(id => {
        //饭堂多选框的值 是一个对象数组，判断 id为数组的哪一个对象插入
        this.canteenGroup.forEach(item => {
          if (item.id === id) {
            this.addFormData.canteens_arr.push(item);
          }
        });
      });
      this.haveCanteens = canteensChecked;
      this.addFormData = Object.assign({}, this.addFormData, val);
      this.addStaffVisible = true;
    },
    closeStaffDialog() {
      this.addFormData = {
        id: "",
        canteens_arr: [],
        company_id: "", //新增员工归属企业id
        canteens: [],
        d_id: "",
        t_id: "",
        code: "",
        phone: "",
        card_num: "",
        username: ""
      };
      this.addStaffVisible = false;
      this.isEditStaff = false;
    },
    async _addNewStaff() {
      if (!this.isEditStaff) {
        //新增员工
        this.addFormData.company_id = this.c_id;
        this.addFormData.d_id = this.d_id;
        this.addFormData.canteens = [];
        let _canteen = [];
        this.addFormData.canteens_arr.forEach(item => {
          _canteen.push({
            canteen_id: item.id
          });
        });
        this.addFormData.canteens = JSON.stringify(_canteen);
        const res = await $axios.post(
          "https://tonglingok.com/canteen/api/v1/department/staff/save",
          this.addFormData
        );
        if (res.msg === "ok") {
          this.$message.success("添加成功");
          this.closeStaffDialog();
          await this.fetchList(this.current_page);
        } else {
          this.$message.error(res.msg);
        }
      } else {
        let checked = this.addFormData.canteens_arr.map(item => item.id);
        let add = [];
        let cancel = [];
        this.haveCanteens.forEach(id => {
          //已有模块中搜索 选中的每一项，找不到的则为被移除， 再去找到与用户饭堂关系的饭堂id
          if (checked.indexOf(id) === -1) {
            this.addFormData.canteens.forEach(item => {
              if (item.canteen_id === id) {
                cancel.push(item.id);
              }
            });
          }
        });

        checked.forEach(id => {
          if (this.haveCanteens.indexOf(id) === -1) {
            //选中模块中所搜 已有的每一项， 找不到的则为新增
            add.push(id);
          }
        });
        this.addFormData.cancel_canteens = JSON.stringify(cancel);
        this.addFormData.canteens = JSON.stringify(add);
        const res = await $axios.post(
          "https://tonglingok.com/canteen/api/v1/department/staff/update",
          this.addFormData
        );
        if (res.msg === "ok") {
          this.$message.success("修改成功");
          this.closeStaffDialog();
          await this.fetchList(this.current_page);
        }
      }
    },
    async _deleteStaff(row) {
      let id = row.id;
      this.$confirm("此操作将删除员工" + row.username + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await $axios.post(
            "https://tonglingok.com/canteen/api/v1/department/staff/delete",
            { id }
          );
          if (res.msg === "ok") {
            this.$message.success("删除成功");
            await this.fetchList(this.current_page);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
      const res = await $axios.post(
        "https://tonglingok.com/canteen/api/v1/staff/qrcode/save",
        this.QRForm
      );
      console.log(res);
      if (res.msg === "ok") {
        this.$message.success("设置成功");
        this.closeQRSettingDialog();
        await this.fetchList(this.current_page);
      } else {
        this.$message.error(res.msg);
      }
    },
    closeMoveDialog() {
      this.cureentDepartment = {};
      this.moveDialogVisible = false;
    },
    openMoveStaff(row) {
      this.moveDialogVisible = true;
      console.log(row);
      let d_id = row.d_id; //当前所属部门id
      this.cureentDepartment = Object.assign(
        {},
        { department: row.department, id: row.id }
      );
    },
    async _comfirmMove() {
      let staff_id = this.cureentDepartment.id;
      let new_d_id = this.cureentDepartment.new_d_id;
      const res = await $axios.post(
        "https://tonglingok.com/canteen/api/v1/department/staff/move",
        {
          id: staff_id,
          d_id: new_d_id
        }
      );
      if (res.msg === "ok") {
        this.$message.success("操作成功");
        this.closeMoveDialog();
      } else {
        this.$message.error(res.msg);
      }
    },
    handleSuccess(res, file, fileList) {
      if (res.msg === "ok") {
        this.$message({
          message: "上传成功",
          type: "success",
          duration: 1000
        });
        if (res.data && res.data.fail) {
          res.data.fail.forEach(item => {
            setTimeout(() => {
              this.$message({
                message: `${item.name}新增失败,${item.msg}`,
                type: "error",
                duration: 1000,
                showClose: true
              });
            }, 1000);
          });
        }
      } else {
        this.$message.error("请上传正确模板文件");
      }
    },
    openRoleTypeDialog() {
      this.roleTypeDialogVisible = true;
    },
    closeRoleTypeDialog() {
      this.$refs.roleTypeForm.resetFields();
      this.roleTypeDialogVisible = false;
    },
    async _addRoleType() {
      const res = await $axios.post(
        "https://tonglingok.com/canteen/api/v1/role/type/save",
        this.roleTypeForm
      );
      if (res.msg === "ok") {
        this.$message.success("新增成功");
        await this.getRoleType();
        this.closeRoleTypeDialog();
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
    },
    _print() {
      this.$print(this.$refs.print, { noPrint: ".el-button" });
    },
    downloadTemplate() {
      window.open(
        "http://canteen.tonglingok.com/static/excel/template/上传部门员工信息模板.xlsx"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.department {
  .table-button {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .upload-excel {
    display: inline-block;
  }
}
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
.tree {
  overflow-x: scroll;
  overflow-y: hidden;
}
</style>
