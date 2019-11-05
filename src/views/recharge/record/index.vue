<template>
  <div>
    <div class="record">
      <div class="nav-title">充值记录明细</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <div class="select-title">
            <el-form :inline="true" :model="formdata" label-width="80px">
              <el-form-item label="开始">
                <el-date-picker
                  v-model="formdata.time_begin"
                  value-format="yyyy-MM-dd"
                  style="width:200px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <!-- value-format="yyyy-MM-dd HH:mm:ss" -->
              <el-form-item label="结束">
                <el-date-picker
                  v-model="formdata.time_end"
                  value-format="yyyy-MM-dd"
                  style="width:200px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="公司"  v-if="companiesVisible">
                <el-select v-model="formdata.company_ids" placeholder="请选择公司" style="width:200px">
                  <el-option
                    v-for="item in companiesList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input placeholder="请输入姓名" v-model="formdata.username"></el-input>
              </el-form-item>
              <el-form-item label="充值途径">
                <el-select v-model="formdata.type" placeholder="请选择" style="width:200px">
                  <el-option
                    v-for="item in recharge_wayList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.type"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="充值人员">
                <!-- <el-input placeholder="请输入" v-model="formdata.recharge_personnel" style="width:200px"></el-input> -->
                <el-select v-model="formdata.admin_id" placeholder="请选择" style="width:200px">
                  <el-option
                    v-for="item in adminList"
                    :key="item.id"
                    :label="item.role"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="btn-area">
            <el-button type="primary" @click="fetchTableList">查询</el-button>
            <el-button type="primary">导出</el-button>
          </div>
        </div>
        <div class="total" v-show="total > 0"><span>共有 <strong>{{total}}</strong> 条记录</span></div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border>
             <el-table-column label="创建时间" prop="create_time"></el-table-column>
             <el-table-column label="姓名" prop="username"></el-table-column>
             <el-table-column label="充值金额" prop="money"></el-table-column>
             <el-table-column label="充值途径" prop="type"></el-table-column>
             <el-table-column label="充值人员" prop="admin"></el-table-column>
             <el-table-column label="备注" prop="remark"></el-table-column>
          </el-table>
          <pagination v-show="total > 10" :total="total" :page.sync="current_page" @pagination="getList"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// http://canteen.tonglingok.com/api/v1/recharges?time_begin=2019-09-01&time_end=2019-11-01&admin_id=0&username&type=all&page=1&size=10
// 需要的参数 time_begin time_end username type √ admin_id    page size
import $axios from "@/api/index";
import Pagination from '@/components/Pagination'
import { flatten } from "@/utils/flatternArr";
import store from '@/store';
export default {
  data (){
    return {
      grade: store.getters.grade,
      // module_id: store.getters.module_id,
      formdata: {
        time_begin: "",
        time_end: "",
        admin_id: "",
        type: "",  
        username: "",
        page: 1,
        size: 10,
        company_ids: "",
      },
      companiesList: [],
      adminList: [
        {id: 1,"role": "饭堂管理员1"},
        {id: 2,"role": "饭堂管理员2"},
        {id: 3,"role": "饭堂管理员3"}
      ],
      // 充值途径:目前有：cash：现金；weixin:微信；nonghang:农行；all：全部
      recharge_wayList: [
        {id: '0',name: '全部',type: "all"},
        {id: '1',name: '现金',type: "cash"},
        {id: '2',name: '微信',type: "weixin"},
        {id: '3',name: '农行',type: "nonghang"}
      ],
      tableData: [
        {
          "create_time": "2019-10-31 18:32:47",
          "username": '李四',
          "money": "200.00",
          "type": "cash",
          "admin": "系统超级管理员",
          "remark": ""
        },
        {
          "create_time": "2019-10-31 18:32:47",
          "username": '王五',
          "money": "203.00",
          "type": "cash",
          "admin": "系统超级管理员",
          "remark": ""
        }
      ],
      total: 0,
      current_page: 1
    }
  },
  created(){
    this.fetchAdminList();
    this.fetchCompanyList();
  },
  computed: {
    companiesVisible(){
      return this.grade !== 3;
    }
  },
  components:{Pagination},
  methods:{
    fetchCompanyList(){
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          console.log('hi')
          let arr = res.data;
          let allCompanies = [];
          let companiesList = flatten(arr);
          companiesList.forEach(element => {
            let id = element.id;
            allCompanies.push(id);
          });
          allCompanies = allCompanies.join(",");
          companiesList.unshift({
            name: "全部",
            id: allCompanies
          });
          this.companiesList = companiesList;
          console.log(this.companiesList)
        })
        .catch(err => console.log(err));
    },
    fetchAdminList(){
      /* console.log("请求接口：")
      console.log("/v1/wallet/recharge/admins?module_id=1") */
      $axios
        .get("/v1/wallet/recharge/admins?module_id=1")
        .then(res => {
          console.log(res)
        })
        .catch(err => console.log(err));
    },
    fetchTableList(){
      this.formdata.admin_id = 1;
      // console.log(this.formdata)
      $axios
        .get("/v1/recharges",this.formdata)
        .then(res => {
          console.log(res)
          this.tableData = Array.from(res.data.data);
          // current_page total
          this.current_page = res.data.current_page;
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    getList(){

    }
  }
}
</script>

<style lang="scss" scpoed>
.main-header {
  .select-title {
    float: left;
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    .el-select {
      width: 200px;
    }
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
.main-content{
  .el-table{
    th,td{
      text-align: center;
    }
  }
}
.main {
  .total{
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>