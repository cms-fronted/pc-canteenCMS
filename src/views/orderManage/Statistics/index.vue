<template>
  <div>
    <div class="statistics">
      <div class="nav-title">订餐统计</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <div class="select-title">
            <el-form :inline="true" :model="formdata" label-width="80px">
              <el-form-item label="开始时间">
                <el-date-picker v-model="formdata.time_begin" style="width:200px" type="datetime"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker v-model="formdata.time_end" style="width:200px" type="datetime"></el-date-picker>
              </el-form-item>
              <el-form-item label="公司">
                <!-- @change="getCanteenList(company_id)" -->
              <el-select v-model="company_id" placeholder="请选择公司" @change="getList">
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
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            </el-form>
          </div>
          <div class="btn-area">
            <el-button type="primary" @click="queryList">查询</el-button>
            <el-button type="primary">导出</el-button>
          </div>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import { flatten } from "@/utils/flatternArr";
export default {
  data(){
    return {
      formdata: {
        time_begin: "",
        time_end: ""
      },
      company_id: "",
      companyList: "",
      canteen_id: "",
      canteenList: "",
      tableData: []
    }
  },
  created(){
    this.fetchCompanyList();
  },
  methods:{
    fetchCompanyList(){
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          let allCompanies = [];
          let companyList = flatten(arr);
          companyList.forEach(element => {
            let id = element.id;
            allCompanies.push(id);
          });
          allCompanies = allCompanies.join(",");
          companyList.unshift({
            name: "全部",
            id: allCompanies
          });
          this.companyList = companyList;
        })
        .catch(err => console.log(err));
    },
    getList(val) {
      if (String(val).includes(",")) {
        this.canteenList = [{ name: "全部" }];
        this.formdata.canteen_id = "";
      } else {
        console.log(val)
        this.getCanteenList(val);
      }
    },
    getCanteenList(company_id){
      if (company_id) {
        $axios
          .get(`/v1/company/consumptionLocation?company_id=${company_id}`)
          .then(res => {
            console.log(1)
            console.log(res)
            this.canteenList = Array.from(res.data.canteen);
          })
          .catch(err => console.log(err));
      }
    },
    // /v1/order/orderStatistic?company_ids=6&canteen_id=1&time_begin=2019-09-07&time_end=2019-09-07&page=1&size=20
    queryList(){
      $axios
      .get("/v1/order/orderStatistic", {
        company_ids: this.company_id,
        canteen_id: this.canteen_id,
        time_begin: this.formdata.time_begin,
        time_end: this.formdata.time_end,
        page: 1,
        size: 10
      })
      .then(res => {
        console.log(res)
        this.tableData = Array.from(res.data.data);
        /* this.total = res.data.total;
        this.current_page = res.data.current_page; */
      })
      .catch(err => console.log(err));
    }
  }
}
</script>

<style lang="scss" scpoed>
  .main-header{
    .select-title {
      float: left;
      width: 90%;
      display: flex;
      flex-wrap: wrap;
    }
    .btn-area {
      float: right;
      width: 10%;
      display: flex;
      flex-direction: column;
      display: block;
      .el-button {
        margin-bottom: 20px;
      }
    }
  }
  
</style>