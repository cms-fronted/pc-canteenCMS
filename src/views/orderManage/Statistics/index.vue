<template>
  <div>
    <div class="statistics">
      <div class="nav-title">订餐统计</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <div class="select-title">
            <el-form :inline="true" :model="formdata">
              <el-form-item label="开始时间">
                <el-date-picker v-model="formdata.time_begin" style="width:200px" type="datetime"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker v-model="formdata.time_end" style="width:200px" type="datetime"></el-date-picker>
              </el-form-item>
              <el-form-item label="公司">
                <!-- @change="getCanteenList(company_id)" -->
                <el-select v-model="company_id" placeholder="请选择公司">
                  <el-option
                    v-for="item in companyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消费地点">
                <el-select v-model="canteen_id" placeholder="请选择消费地点">
                  <el-option
                    v-for="item in canteenList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary">查询</el-button>
              <el-button type="primary">导出</el-button>
            </el-form>
          </div>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border></el-table>
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
      formdata: {
        time_begin: "",
        time_end: ""
      },
      company_id: "",
      companyList: "",
      canteen_id: "",
      canteenList: "",
      options: [
        {
          value: "公司1",
          label: "公司1"
        }
      ],
      tableData: []
    };
  },
  created() {
    this.fetchCompanyList();
    // this.getCanteenList();
  },
  methods: {
    fetchCompanyList() {
      // get('/v1/companies')
      $axios
        .get('/v1/manager/companies?name="周兵一级企业"')
        .then(res => {
        })
        .catch(error => console.log(err));
    },
    getCanteenList() {
      this.canteen_id = "";
      $axios
        .get("/v1/canteens")
        .then(res => {})
        .catch(error => console.log(err));
    }
  }
};
</script>

<style lang="scss" scpoed>
</style>