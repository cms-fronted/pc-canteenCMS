<template>
  <div>
    <div class="details">
      <div class="nav-title">企业明细</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span style="margin:10px;">公司：</span>
          <el-input style="width:150px;marigin:10px" placeholder="请输入公司"></el-input>
          <span style="margin:10px;">时间：</span>
          <el-date-picker v-model="value1" style="margin:10px;" type="date" placeholder="选择日期"></el-date-picker>
          <el-button style="margin:10px;" type="primary">查询</el-button>
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
            <el-table-column prop="parent_name" label="归属企业"></el-table-column>
            <el-table-column prop="name" label="公司名称"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
export default {
  data() {
    return {
      value1: null,
      companyList: []
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
    this.fetchList()
  },
  methods: {
    fetchList() {
      $axios
        .get("/v1/companies")
        .then(res => {
          this.companyList = Array.from(res.data.data)
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
</style>