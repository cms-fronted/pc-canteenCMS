<template>
  <div class="role-play">
    <div class="nav-title">角色设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="60px">
          <el-form-item label="公司" prop="c_name">
            <el-select v-model="queryForm.c_name">
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
          <el-table-column label="归属公司" prop="company_name"></el-table-column>
          <el-table-column label="角色名称" prop="role"></el-table-column>
          <el-table-column label="账号" prop="account"></el-table-column>
          <el-table-column label="可见饭堂">
            <template slot-scope="scoped">
              <span>{{scoped.row.canteen.toString()}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scoped">
              <el-tag
                :type="scoped.row.state===1?'success':'danger'"
              >{{scoped.row.state===1?'正常':'停用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <span>
                <el-button type="text" @click="_edit(scoped.row)">编辑</el-button>
                <el-button type="text">删除</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="newRoleDialogVisible" width="60%" center title="新增角色">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form :model="roleForm" ref="roleForm" label-width="70px" label-position="left">
            <el-form-item label="公司名称" prop="c_id">
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
            <el-form-item label="可见饭堂" prop="canteen">
              <el-checkbox-group v-model="roleForm.canteen">
                <el-checkbox
                  class="canteenCheckbox"
                  v-for="item in canteenGroup"
                  :key="item.id"
                  :label="item"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="roleForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="role">
              <el-input v-model="roleForm.role" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="角色账号" prop="account">
              <el-input v-model="roleForm.account" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="角色密码" prop="passwd">
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
          <p style="fontSize:16px;padding:5px">
            <b>可见模块</b>
          </p>
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
import { flatten } from "@/utils/flatternArr";
export default {
  data() {
    return {
      newRoleDialogVisible: false,
      queryForm: {},
      roleForm: {
        canteen: []
      },
      companyOptions: [],
      canteenGroup: [],
      datatable: [],
      current_page: 1,
      total: 0,
      size: 10
    };
  },
  created() {
    this.getCompanies();
    this.fetchList();
  },
  methods: {
    async getCompanies() {
      const res = await $axios.get("/v1/admin/companies", this.queryForm);
      if (res.msg === "ok") {
        this.companyOptions = flatten(res.data);
      }
    },
    async fetchList() {
      const res = await $axios.get(
        "/v1/roles?page=" + this.current_page + "&size=" + this.size,
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
        `/v1/company/consumptionLocation?company_id=${company_id}`
      );
      if (res.msg === "ok") {
        this.canteenGroup = Array.from(res.data.canteen);
      }
    },
    async getCanteenModuls(c_id) {
      const res = await $axios.get(
        `/v1/modules/canteen/withSystem?c_id${c_id}`
      );
      console.log(res);
    },
    openNewRoleDialog() {
      this.newRoleDialogVisible = true;
    },
    closeNewRoleDialog() {
      this.newRoleDialogVisible = false;
    },
    selectCompany(id) {
      const company = this.companyOptions.filter(item => item.id === id);
      this.roleForm.company = company[0].name;
      this.getCanteenList(id);
      this.getCanteenModuls(id);
    },
    _confirm() {
      console.log(this.roleForm);
    },
    _edit(row) {
      console.log(row);
    }
  }
};
</script>

<style lang="scss" scoped>
.canteenCheckbox {
  margin-bottom: -5px;
}
</style>