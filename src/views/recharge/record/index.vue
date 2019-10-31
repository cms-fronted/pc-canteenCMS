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
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:200px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束">
                <el-date-picker
                  v-model="formdata.time_end"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:200px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="公司">
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
                <el-input placeholder="请输入姓名" v-model="formdata.name"></el-input>
              </el-form-item>
              <el-form-item label="充值途径">
                <el-select v-model="formdata.recharge_way_id" placeholder="请选择" style="width:200px">
                  <el-option
                    v-for="item in recharge_wayList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="充值人员">
                <el-input placeholder="请输入" v-model="formdata.recharge_personnel" style="width:200px"></el-input>
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
             <el-table-column label="创建时间" prop="time_begin"></el-table-column>
             <el-table-column label="姓名" prop="name"></el-table-column>
             <el-table-column label="充值金额" prop="money"></el-table-column>
             <el-table-column label="充值途径" prop="channel"></el-table-column>
             <el-table-column label="充值人员" prop="personnel"></el-table-column>
             <el-table-column label="备注" prop="remark"></el-table-column>
          </el-table>
          <pagination v-show="total > 10" :total="total" :page.sync="page" @pagination="getList"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from '@/components/Pagination'
import { flatten } from "@/utils/flatternArr";
export default {
  data (){
    return {
      formdata: {
        time_begin: "",
        time_end: "",
        recharge_way_id: "",  
        company_ids: "",
        name: "",
        recharge_personnel: ""
      },
      recharge_wayList: [
        {id: '0',name: '全部'},
        {id: '1',name: '现金'},
        {id: '2',name: '微信'}
      ],
      companiesList: [],
      tableData: [
        {time_begin: '2019-06-10 13:50:13',name: '张三',money: '100',channel: '现金充值',personnel: '管理员',remark: ''},
        {time_begin: '2019-06-10 13:50:13',name: '李四',money: '100',channel: '现金充值',personnel: '管理员',remark: ''},
        {time_begin: '2019-06-10 13:50:13',name: '王五',money: '100',channel: '现金充值',personnel: '管理员',remark: ''}
      ],
      total: 0,
      page: 1
    }
  },
  created(){
    this.getCompanies();
  },
  components:{Pagination},
  methods:{
    getCompanies(){
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          console.log(res)
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
        })
        .catch(err => console.log(err));
    },
    fetchTableList(){

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