<template>
  <div class="outsider">
    <div class="nav-title">外来人员</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-form :inline="true" :model="companyForm">
          <el-form-item label="公司" prop="company_id">
            <el-select v-model="companyForm.company_id" style="width:200px">
              <el-option :label="111" :value="111"></el-option>
            </el-select>
          </el-form-item>
          <el-button>查询</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table :data="tableData"></el-table>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
export default {
  data() {
    return {
      companyForm: {
        company_id: ""
      },
      tableData: []
    };
  },
  async created() {
    await this.getOutsidersList();
  },
  methods: {
    getOutsidersList: async function(e) {
      const res = await $axios.get("/api/v1/outsiders?company_id=0");
      if (res.msg === "ok") {
        console.log(res);
      }
    }
  }
};
</script>

<style>
</style>