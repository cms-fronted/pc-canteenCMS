<template>
  <div>
    <div class="statistics">
      <div class="nav-title">订餐统计</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header" :class="{ 'active': !companiesVisible}">
          <div class="select-title">
            <el-form :inline="true" :model="formdata" label-width="40px" label-position="left">
              <el-form-item label="开始">
                <el-date-picker
                  v-model="formdata.time_begin"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  style="width:180px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束">
                <el-date-picker
                  v-model="formdata.time_end"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  style="width:180px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
<<<<<<< HEAD
              <el-form-item label="公司">
                <el-select v-model="company_id" placeholder="请选择公司" @change="getCanteenList">
                  <el-option
                    v-for="item in companyOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消费地点" label-width="70px">
                <el-select v-model="canteen_id" placeholder="请选择消费地点">
                  <el-option
                    v-for="item in canteenOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" @click="queryList">查询</el-button>
              <el-button type="primary">导出</el-button>
=======
              <el-form-item label="公司" v-if="companiesVisible">
              <el-select v-model="company_id" placeholder="请选择公司" style="width:200px" @change="getList">
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消费地点">
              <el-select v-model="canteen_id" placeholder="请选择消费地点" style="width:200px">
                <el-option
                  v-for="item in canteenList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
>>>>>>> temp
            </el-form>
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
import store from '@/store';
export default {
  data(){
    return {
      grade: store.getters.grade,
      formdata: {
        time_begin: "",
        time_end: ""
      },
      company_id: "",
      companyOptions: [],
      canteen_id: "",
      canteenOptions: [],
      tableData: []
    };
  },
<<<<<<< HEAD
  created() {
    this.getCompanies();
  },
  methods: {
    async getCompanies() {
      const res = await $axios.get("/v1/admin/companies", this.queryForm);
      if (res.msg === "ok") {
        this.companyOptions = flatten(res.data);
        console.log(this.canteenOptions);
      }
=======
  created(){
    this.fetchCompanyList();
  },
  computed: {
    companiesVisible(){
      return this.grade !== 3;
    }
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
>>>>>>> temp
    },
    getCanteenList(val) {
      this.canteenOptions = [];
      if (String(val).includes(",")) {
        this.canteenList = [{ name: "全部" }];
        this.formdata.canteen_id = "";
      } else {
        this.getCanteenList(val);
      }
    },
<<<<<<< HEAD
    getCanteenList(company_id) {
      if (company_id) {
=======
    getCanteenList(company_id){
      this.canteen_id = "";
      if(this.companiesVisible){
        // 企业 grade 不为3
>>>>>>> temp
        $axios
          .get(`/v1/canteens?company_id=${company_id}`)
          .then(res => {
<<<<<<< HEAD
            this.canteenOptions = Array.from(res.data.canteen);
            this.canteenOptions.unshift({ id: 0, name: "全部" });
=======
            this.canteenList = Array.from(res.data);
            console.log(this.canteenList)
          })
          .catch(err => console.log(err));
      }else{
        // 企业 grade 为3
        $axios
          .get("/v1/managerCanteens")
          .then(res => {
            this.canteenList = Array.from(res.data);
>>>>>>> temp
          })
          .catch(err => console.log(err));
      }
    },
<<<<<<< HEAD
    queryList() {
=======
    queryList(){
>>>>>>> temp
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
          console.log(res);
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
  .main-header.active{
    .select-title {
      width: 85%;
    }
    .btn-area {
      width: 15%;
      flex-direction: row;
      .el-button {
        margin-left: 8px;
      }
    }
  }
  
</style>