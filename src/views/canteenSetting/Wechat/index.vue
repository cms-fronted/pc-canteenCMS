<template>
  <div>
    <div class="wechat">
      <div class="nav-title">微信端设置</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <div class="select-title">
            <span class="content-header">公司：</span>
            <el-select
              v-model="company_id"
              placeholder="请选择"
            >
              <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="btn-area">
            <el-button type="primary" @click="fetchTableList">查询商品类型</el-button>
            <el-button type="primary" @click="addGoods">增加商品类型</el-button>
          </div>
        </div>
        <div class="main-content">
          <el-table style="width:100%" border :data="tableList">
            <el-table-column label="公司名称" prop="company"></el-table-column>
            <el-table-column label="商品类型" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 10" :total="total" :page.sync="page" @pagination="getList"></pagination>
          </div>
        </div>
      </div>
      <!-- 增加商品类型弹窗  -->
      <add-dialog 
        :visible="AddVisible" 
        @closeDialog1="closeDialog1" 
        :editData="goodsForm"
      ></add-dialog>
      <!-- 更改商品类型弹窗 -->
      <revise-dialog 
        :visible="reviseVisible" 
        @closeDialog2="closeDialog2" 
        :editData="reviseForm"
        :c_id="currentCompanyId"
      ></revise-dialog>
    </div>
</template>

<script>
import $axios from "@/api/index";
import AddDialog from "./dialog1";
import ReviseDialog from "./dialog2";
import Pagination from '@/components/Pagination'
export default {
  data(){
    return {
      companyList: [],
      company_id: "",
      AddVisible: false,
      goodsForm: {
        c_id: "",
        name: ""
      },
      reviseForm:{
        id: "",
        name: ""
      },
      tableList: [],
      currentGoodsId : "",
      reviseVisible: false,
      currentCompanyId: "",
      total: 0,
      page: 1,
    }
  },
  components: { AddDialog,ReviseDialog,Pagination },
  created(){
    this.fetchCompanyList();
  },
  methods:{
    fetchCompanyList(){
      $axios
        .get("/v1/companies")
        .then(res => {
          this.companyList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    fetchTableList(){
      $axios
        .get(`/v1/categories?c_id=${this.company_id}&page=${this.page}&size=10`)
        .then(res => {
          this.tableList = Array.from(res.data.data);
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    handleEdit(val){
      this.reviseForm.id = val.id;
      this.reviseForm.name = val.name;
      this.currentCompanyId = val.c_id;
      this.reviseVisible = true;
    },
    handleDelete(val){
      this.currentGoodsId = val.id;
      this.$confirm("确定删除该类型吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() =>{
          $axios
            .post("/v1/category/delete",{
              id: this.currentGoodsId
            })
            .then(res => {
              this.fetchTableList();
              this.sendMessage(res.msg);
            })
            .catch(err => console.log(err));
        }).catch((err) => {});
    },
    addGoods(){
      this.AddVisible = true;
    },
    sendMessage(msg){
      if(msg === 'ok'){
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }else {
        this.$message({
          type: "info",
          message: "操作失败"
        })
      }
    },
    closeDialog1(val,msg){
      this.goodsForm = {
        c_id: "",
        name: ""
      };
      this.AddVisible = val;
      if(msg === 'ok'){
        this.fetchTableList();
        this.sendMessage(msg);
      }
    },
    closeDialog2(val,msg){
      this.reviseForm = {
        id: "",
        name: ""
      };
      this.reviseVisible = val;
      if(msg === 'ok'){
        this.fetchTableList();
        this.sendMessage(msg);
      }
    },
    getList(val){
      this.page = val;
      this.fetchTableList();
    }
  }
}
</script>

<style lang="scss" scpoed>
  .main{
    .main-header{
      display: flex;
      justify-content: space-between;
    }
    .main-content{
      .el-table{
        th,td{
          text-align: center;
        }
      }
    }
  }
  .el-dialog__wrapper{
    .el-dialog{
      width: 30%;
    }
  }
</style>