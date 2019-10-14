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
            <el-button type="primary" @click="AddVisible = true">增加商品类型</el-button>
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
        </div>
      </div>
      <el-dialog :visible.sync="AddVisible" title="增加商品类型">
        <el-form ref="addgoodsForm" label-width="100px">
          <el-form-item label="公司">
            <el-select
              placeholder="请选择"
              v-model="goodsForm.c_id"
            >
              <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型">
            <el-input placeholder="请输入" v-model="goodsForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
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
      tableList: [],
    }
  },
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
        .get(`/v1/categories?c_id=${this.company_id}&page=1&size=10`)
        .then(res => {
          this.tableList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    handleConfirm(){
      $axios
        .post("/v1/category/save",this.goodsForm)
        .then(res => {
          this.AddVisible = false;
          this.fetchTableList();
          alert("增加商品类型成功");
        })
        .catch(err => console.log(err));
    },
    handleClose(){
      this.AddVisible = false;
      this.goodsForm = {
        c_id: "",
        name: ""
      };
    },
    handleEdit(val){
      console.log(val);
    },
    handleDelete(val){
      $axios
        .post("/v1/category/delete",{
          id: val.id
        })
        .then(res => {
          console.log(res);
          // confirm 可能需要换成 dialog
          confirm("确定要删除该类型吗？");
          this.fetchTableList();
          // alert("增加商品类型成功");
        })
        .catch(err => console.log(err));
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
</style>