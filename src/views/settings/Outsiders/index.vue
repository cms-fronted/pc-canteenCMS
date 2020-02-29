<template>
  <div class="outsider">
    <div class="nav-title">外来人员</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :inline="true" :model="companyForm">
          <el-form-item label="公司" prop="company_id">
            <el-select v-model="companyForm.company_id" style="width:200px">
              <el-option
                v-for="item in companyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="getOutsidersList">查询</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table :data="tableData">
          <el-table-column prop="company" label="归属公司" width="200px"></el-table-column>
          <el-table-column prop="canteen" label="可见饭堂"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <span>
                <el-button type="text" size="small" @click="editAuthor(scoped.row)">操作</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination :total="total" :currentPage="current_page" @pagination="getOutsidersList" />
    </div>
    <el-dialog :visible.sync="visible" width="30%" @close="closeModulesDialog" title="权限编辑">
      <el-tree
        ref="modules"
        :data="modulesList"
        node-key="c_m_id"
        :default-checked-keys="defaultChecked"
        :props="defaultProps"
        show-checkbox
      ></el-tree>
      <div style="text-align:center; padding-top:15px">
        <el-button @click="closeModulesDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
export default {
  data() {
    return {
      companyForm: {
        company_id: ""
      },
      tableData: [],
      companyOptions: [],
      total: 0,
      current_page: 1,
      grade: localStorage.grade,
      visible: false,
      modulesList: [],
      defaultProps: {
        children: "items",
        label: "name"
      },
      defaultChecked: [],
      chosedCompanyId: ""
    };
  },
  components: { Pagination },
  async created() {
    if (this.grade != 3) {
      await this.getCompanies();
    }
    await this.getOutsidersList();
  },
  methods: {
    getOutsidersList: async function(page) {
      const company_id = this.companyForm.company_id;
      const res = await $axios.get("/api/v1/outsiders", {
        company_id,
        page: Number(page) || 1,
        size: 10
      });
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.total = res.data.total;
        this.current_page = res.data.current_page;
      }
    },
    getCompanies: async function() {
      const res = await $axios.get("/api/v1/admin/companies");
      if (res.msg == "ok") {
        this.companyOptions = unshiftAllOptions(flatten(res.data));
        this.companyForm.company_id = this.companyOptions[0].id;
      }
    },
    editAuthor: async function(row) {
      let company_id = row.company_id;
      this.chosedCompanyId = company_id;
      const res = await this.getModules(company_id);
      if (res.msg == "ok") {
        this.modulesList = res.data.filter(item => item.type === 2);
        this.defaultChecked = res.data
          .filter(item => item.have == 1)
          .map(itms => itms.c_m_id);
        console.log(this.defaultChecked);
        this.visible = true;
      }
    },
    getModules: async function(company_id) {
      const res = await $axios.get("/api/v1/outsider", {
        company_id
      });
      return res;
    },
    closeModulesDialog: function() {
      this.visible = false;
      this.modulesList = [];
      this.defaultChecked = [];
    },
    confirm: async function() {
      let checked = this.$refs.modules.getCheckedNodes();
      checked = checked.map(item => item.c_m_id);
      const res = await $axios.post("/api/v1/outsider/save", {
        company_id: this.chosedCompanyId,
        rules: checked.toString()
      });
      if (res.msg === "ok") {
        this.closeModulesDialog();
        this.$message.success("操作成功！");
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>

<style>
</style>