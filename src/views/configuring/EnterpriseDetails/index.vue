<template>
  <div>
    <div class="enterprise-details">
      <div class="nav-title">企业明细</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <el-form :inline="true" ref="queryForm" label-position="left" :model="queryForm">
            <el-form-item label="企业名称" prop="name" label-width="80px">
              <el-select v-model="queryForm.name">
                <el-option
                  v-for="item in companyOptions"
                  :label="item.name"
                  :key="item.id"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间" prop="create_time" label-width="50px">
              <el-date-picker
                v-model="queryForm.create_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-button type="primary" @click="fetchList">查询</el-button>
          </el-form>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="companyList">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.canteen" style="width:100%">
                  <el-table-column prop="name" label="饭堂名称"></el-table-column>
                  <el-table-column prop="shop" label="功能模块"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="200px"></el-table-column>
            <el-table-column label="公司级别" prop="grade">
              <template slot-scope="props">
                <span>{{props.row.grade | handleGrades}}</span>
              </template>
            </el-table-column>
            <el-table-column label="归属企业">
              <template slot-scope="scoped">
                <span>{{scoped.row.parent_name ? scoped.row.parent_name : "无"}}</span>
              </template>
            </el-table-column>
            <el-table-column label="公司名称">
              <template slot-scope="scoped">
                <el-button
                  type="text"
                  @click="() => openDetailDialog(scoped.row)"
                >{{scoped.row.name}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog
      width="80%"
      :visible.sync="detailDialogVisible"
      :show-close="false"
      @close="closeDetailDialog"
      title="明细"
      center
    >
      <el-row :gutter="10">
        <el-col :span="4">
          <div class="lf-col">
            <el-table class="canteen-table" size="mini" :show-header="false" :data="canteenList">
              <el-table-column>
                <template slot-scope="scoped">
                  <el-button type="text">{{scoped.row.name}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <p style="padding: 5px 0">
              <el-tag>企业人数：{{staffs}}人</el-tag>
            </p>
          </div>
        </el-col>
        <el-col :span="18">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>企业明细</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import { flatten } from "@/utils/flatternArr";
export default {
  data() {
    return {
      detailDialogVisible: false,
      companyOptions: [],
      companyList: [],
      canteenList: [],
      detailForm: {},
      queryForm: {
        name: "",
        created_time: ""
      },
      staffs: 100,
      current_page: 1,
      size: 10,
      total: ""
    };
  },
  filters: {
    handleGrades: function(str) {
      let changeNum = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九"
      ];
      if (str == "") {
        return "";
      } else {
        return `${changeNum[str]}级企业`;
      }
    }
  },
  created() {
    this.fetchList();
    this.getCompaniesList();
  },
  methods: {
    async fetchList() {
      const res = await $axios.get(
        `/v1/companies?page=${this.current_page}&size=${this.size}`,
        this.queryForm
      );
      if (res.msg === "ok") {
        this.companyList = Array.from(res.data.data);
      }
    },
    async getCompaniesList() {
      const res = await $axios.get("/v1/admin/companies");
      this.companyOptions = Array.from(flatten(res.data));
    },
    async openDetailDialog(row) {
      this.canteenList = Array.from(row.canteen);
      const res = await $axios.get(`/v1/canteens/company?company_id=${row.id}`);
      console.log(res);
      this.detailDialogVisible = true;
    },
    closeDetailDialog() {
      this.detailDialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.lf-col {
  text-align: center;
}
.clearfix {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
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

// .box-card {
//   width: 100%;
// }
</style>