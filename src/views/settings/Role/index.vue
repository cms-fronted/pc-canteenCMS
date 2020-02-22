<template>
  <div class="role-play">
    <div class="nav-title">角色设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="60px">
          <el-form-item label="公司" prop="c_name" v-if="companiesVisible">
            <el-select v-model="queryForm.c_name" placeholder="请选择企业" filterable>
              <el-option
                v-for="item in companyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="queryForm.state">
              <el-option label="全部" value="3"></el-option>
              <el-option label="正常" value="1"></el-option>
              <el-option label="停用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字" prop="key">
            <el-input placeholder="请输入关键字" v-model="queryForm.key"></el-input>
          </el-form-item>
          <el-button @click="fetchList">查询</el-button>
          <el-button @click="openNewRoleDialog">新增角色</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table :data="datatable" style="width:100%">
          <el-table-column label="归属公司" prop="company"></el-table-column>
          <el-table-column label="角色名称" prop="role"></el-table-column>
          <el-table-column label="账号" prop="account"></el-table-column>
          <el-table-column label="可见饭堂">
            <template slot-scope="scoped">
              <span>
                {{
                scoped.row.canteen.map(item => item.canteen_name).join(",")
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scoped">
              <el-tag :type="scoped.row.state === 1 ? 'success' : 'danger'">
                {{
                scoped.row.state === 1 ? "正常" : "停用"
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click="operateRoles(scoped.row)"
                >{{ scoped.row.state === 1 ? "停用" : "启用" }}</el-button>
                <el-button type="text" size="mini" @click="_edit(scoped.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="_delete(scoped.row)">删除</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :pageSize="size"
          :currentPage="current_page"
          @pagination="fetchList"
        />
      </div>
    </div>
    <el-dialog
      :visible.sync="newRoleDialogVisible"
      width="60%"
      center
      :title="isEdit ? '编辑角色' : '新增角色'"
      @close="closeNewRoleDialog"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form :model="roleForm" ref="roleForm" label-width="70px" label-position="left">
            <el-form-item label="公司名称" prop="c_id" v-if="!isEdit">
              <el-select
                v-model="roleForm.c_id"
                placeholder="请输入公司"
                filterable
                @change="selectCompany"
              >
                <el-option
                  v-for="item in companyOptions"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可见饭堂" prop="canteens">
              <el-checkbox-group v-model="roleForm.canteens">
                <el-checkbox
                  class="canteenCheckbox"
                  v-for="item in canteenGroup"
                  :value="item.id"
                  :key="item.id"
                  :label="item"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone" v-if="!isEdit">
              <el-input v-model="roleForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="role">
              <el-input v-model="roleForm.role" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="角色账号" prop="account" v-if="!isEdit">
              <el-input v-model="roleForm.account" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="角色密码" prop="passwd" v-if="!isEdit">
              <el-input v-model="roleForm.passwd" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item label="角色说明" prop="remark">
              <el-input
                v-model="roleForm.remark"
                placeholder="请输入角色说明..."
                type="textarea"
                :rows="2"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="18">
          <show-modules
            :modules="modules"
            @getModules="(modules, checkAll) => getRoleRules(modules, checkAll)"
            :isConfirm="isConfirmRules"
            :disabled="false"
            :isShow="true"
          ></show-modules>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeNewRoleDialog">取 消</el-button>
        <el-button type="primary" @click="_confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import ShowModules from "@/components/ShowModules";
import Pagination from "@/components/Pagination";
import { flatten, treeToArr } from "@/utils/flatternArr";
import store from "@/store";
export default {
  components: { Pagination, ShowModules },
  data() {
    return {
      grade: store.getters.grade,
      modulesDialogType: "role",
      isEdit: false,
      newRoleDialogVisible: false,
      queryForm: {},
      roleForm: {
        canteens: [],
        rules: []
      },
      companyOptions: [],
      canteenGroup: [],
      haveCanteen: [],
      datatable: [],
      current_page: 1,
      total: 0,
      size: 10,
      modules: [],
      isConfirmRules: false
    };
  },
  async created() {
    if (this.grade !== 3) {
      await this.getCompanies();
    }
    await this.fetchList();
  },
  computed: {
    companiesVisible() {
      return this.grade != 3;
    }
  },
  methods: {
    async getCompanies() {
      const res = await $axios.get("/api/v1/admin/companies", this.queryForm);
      if (res.msg === "ok") {
        this.companyOptions = flatten(res.data);
      }
    },
    async fetchList(page) {
      page = Number(page) || 1;
      const res = await $axios.get(
        "/api/v1/roles?page=" + page + "&size=" + this.size,
        this.queryForm
      );
      if (res.msg === "ok") {
        this.datatable = Array.from(res.data.data);
        this.current_page = res.data.current_page;
        this.total = res.data.total;
      }
    },
    async getCanteenList(c_id) {
      let company_id = c_id || "";
      const res = await $axios.get(
        `/api/v1/company/consumptionLocation?company_id=${company_id}`
      );
      if (res.msg === "ok") {
        this.canteenGroup = Array.from(res.data.canteen);
      }
      return res;
    },
    async getCanteenModules(company_id) {
      const res = await $axios.get(
        `/api/v1/modules/canteen/withoutSystem?company_id=${company_id}`
      );
      if (res.msg === "ok") {
        this.modules = Array.from(res.data);
      }
      return res;
    },
    async openNewRoleDialog() {
      // if (this.grade == 3) {
      //   let c_id = localStorage.getItem("company_id");
      //   await this.getCanteenList(c_id);
      // }
      this.newRoleDialogVisible = true;
      this.roleForm = { canteens: [], rules: [] };
      this.isConfirmRules = false;
    },
    closeNewRoleDialog() {
      this.isEdit = false;
      this.roleForm = { canteens: [], rules: [] };
      this.modules = [];
      this.newRoleDialogVisible = false;
    },
    async selectCompany(id) {
      const company = this.companyOptions.filter(item => item.id === id);
      this.roleForm.company = company[0].name;
      this.isConfirmRules = false;
      await this.getCanteenList(id);
      await this.getCanteenModules(id);
    },
    async _confirm() {
      let canteens = [];
      let res = null;
      let newCanteen = [];

      if (!this.isConfirmRules) {
        this.$message.warning("请先确定角色模块");
        return;
      }
      this.roleForm.rules = this.roleForm.rules.toString();
      if (!this.roleForm.rules) {
        delete this.roleForm.rules;
      }
      if (this.isEdit) {
        delete this.roleForm.phone;
        delete this.roleForm.company;
        delete this.roleForm.company_id;
        delete this.roleForm.create_time;
        let canteensChecked = this.roleForm.canteens;
        let haveCanteenId = this.haveCanteen.map(item => item.canteen_id);
        canteensChecked = canteensChecked.map(item => item.id);
        let add = [];
        let cancel = [];
        this.haveCanteen.forEach(item => {
          if (!canteensChecked.includes(item.canteen_id)) {
            cancel.push(item.id);
          }
        });
        canteensChecked.forEach(id => {
          if (haveCanteenId.indexOf(id) === -1) {
            let addCanteen = this.roleForm.canteens.filter(
              item => item.id === id
            );
            add.push({
              c_id: addCanteen[0].id,
              name: addCanteen[0].name
            });
          }
        });
        cancel = Array.from(new Set(cancel)).toString();
        canteens.push({
          add,
          cancel
        });

        this.roleForm.canteens = JSON.stringify(canteens[0]);
        this.roleForm.canteen = []; //没有字段不传
        res = await $axios.post("/api/v1/role/update", this.roleForm);
      } else {
        canteens = this.roleForm.canteens ? this.roleForm.canteens : [];
        canteens.forEach(item => {
          newCanteen.push({
            c_id: item.id,
            name: item.name
          });
        });
        this.roleForm.canteens = JSON.stringify(newCanteen);
        res = await $axios.post("/api/v1/role/save", this.roleForm);
      }
      if (res.msg === "ok") {
        this.$message.success("操作成功");
        await this.fetchList();
        this.newRoleDialogVisible = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    async _edit(row) {
      this.isConfirmRules = false;
      this.isEdit = true;
      await this.getCanteenList(row.company_id);
      let canteens = [];
      //当前可见饭堂
      this.roleForm = Object.assign({}, row, { canteens });
      let canteenChecked = row.canteen.map(item => item.canteen_id);
      canteenChecked.filter(id => {
        this.canteenGroup.forEach(item => {
          if (item.id === id) {
            this.roleForm.canteens.push(item);
          }
        });
      });
      this.haveCanteen = row.canteen;
      this.roleForm = Object.assign({}, this.roleForm);
      // row.canteen.forEach(item =>
      //   canteens.push({ id: item.canteen_id, name: item.canteen_name })
      // );
      let id = row.id;
      const res = await this.getEditRole(id);
      if (res.msg === "ok") {
        this.modules = Array.from(res.data.modules);
      }
      this.newRoleDialogVisible = true;
    },
    async operateRoles(row) {
      let state = row.state;
      if (state == 1) {
        state = 2;
      } else {
        state = 1;
      }
      const res = await $axios.post("/api/v1/role/handel", {
        id: row.id,
        state: state
      });
      if (res.msg === "ok") {
        this.$message.success("修改成功");
        await this.fetchList();
      }
    },
    getRoleRules(modules, checkAll) {
      this.isConfirmRules = true;
      let allModules = treeToArr(this.modules);
      let checked = [];
      for (let [key, val] of Object.entries(modules)) {
        checked.push(val);
      }
      checked = checked.flat(Infinity);
      checked.forEach(id => {
        allModules.filter(item => {
          if (item.id === id && item.parent_id) {
            checked.push(item.parent_id);
          }
        });
      });
      for (let [key, val] of Object.entries(checkAll)) {
        if (val) {
          checked.push(Number(key)); //处理一级模块，如果 一级模块且无子模块的选项被选中 ，则插入一级模块的id，id为key
        }
      }
      checked = Array.from(new Set(checked));
      let rules = [];

      let role_modules = treeToArr(this.modules);
      checked.forEach(id => {
        role_modules.forEach(item => {
          if (item.id === id) {
            rules.push(item.c_m_id);
          }
        });
      });
      this.roleForm.rules = rules;
    },
    async getEditRole(id) {
      const res = await $axios.get(`/api/v1/role?id=${id}`);
      return res;
    },
    async _delete(row) {
      this.$confirm("此操作将删除员工" + row.username + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await $axios.post("/api/v1/role/handel", {
            id: row.id,
            state: 3
          });
          if (res.msg === "ok") {
            this.$message.success("删除成功");
            await this.fetchList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.canteenCheckbox {
  margin-bottom: -5px;
}
</style>
