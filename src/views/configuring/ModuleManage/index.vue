<template>
  <div class="module-setting">
    <div class="nav-title">模块设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        公司：
        <el-select
          v-model="c_id"
          placeholder="请选择企业"
          filterable
          style="width:200px"
        >
          <el-option
            v-for="item in companyOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button @click="getModuleWithoutSystem" style="margin-left:10px">查询</el-button>
      </div>
      <div class="main-content">
        <el-table :data="modulesList">
          <el-table-column prop="c_m_id" label="c_m_id"></el-table-column>
          <el-table-column prop="name" label="模块名称"></el-table-column>
          <el-table-column prop="category" label="模块类型">
            <template slot-scope="props">
              <span>{{
                props.row.category === 1 ? "普通模块" : "特殊模块"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="props">
              <el-button @click="changeCategory(props.row)">切换</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { flatten, unshiftAllOptions } from "@/utils/flatternArr";
import $axios from "@/api/index";

export default {
  data() {
    return {
      c_id: null,
      companyOptions: [],
      modulesList: []
    };
  },
  async created() {
    await this.getCompanies();
  },
  methods: {
    async getCompanies() {
      const res = await $axios.get(
        "http://canteen.tonglingok.com/api/v1/admin/companies"
      );
      if (res.msg === "ok") {
        this.companyOptions = flatten(res.data);
        this.c_id = this.companyOptions[0].id;
      }
    },
    async getModuleWithoutSystem() {
      const res = await $axios.get(
        "http://canteen.tonglingok.com/api/v1/modules/canteen/withoutSystem?company_id=" +
          this.c_id
      );
      if (res.msg === "ok") {
        this.modulesList = Array.from(res.data);
      }
    },
    async changeCategory(row) {
      const res = await $axios.post(
        "http://canteen.tonglingok.com/api/v1/canteen/module/category",
        {
          c_m_id: row.c_m_id,
          category: row.category === 1 ? 2 : 1
        }
      );
      if (res.msg === ok) {
        this.$message.success("修改成功");
        await this.getModuleWithoutSystem();
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>

<style></style>
