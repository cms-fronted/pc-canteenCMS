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
      <!--  -->
      <el-dialog :visible.sync="AddVisible" title="增加商品类型" class="add-goods-form">
        <el-form ref="addGoodsForm" label-width="100px">
          <el-form-item label="公司">
            <el-select
              placeholder="请选择"
              v-model="goodsForm.c_id"
            >
              <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型">
            <el-input placeholder="请输入" v-model="goodsForm.name" style="width: 217px;"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 更改商品类型  dialog-->
      <el-dialog :visible.sync="reviseVisible" title="更改商品类型">
        <el-form ref="reviseGoodsForm" label-width="100px">
          <el-form-item label="公司">
            <el-select
              placeholder="请选择"
              v-model="currentCompanyId"
              disabled
            >
              <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型">
            <el-input placeholder="请输入" v-model="reviseForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reviseVisible = false">取 消</el-button>
           <!-- @click="handleConfirm" -->
          <el-button type="primary" @click="ConfirmRevise">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 删除时温馨提示 -->
      <el-dialog
        title="温馨提示"
        :visible.sync="TipDialogVisible"
        width="30%"
      >
        <span>确定删除该类型吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="TipDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmDelete">确 定</el-button>
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
      reviseForm:{
        id: "",
        name: ""
      },
      tableList: [],
      TipDialogVisible: false,
      currentGoodsId : "",
      reviseVisible: false,
      currentCompanyId: ""
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
          this.goodsForm = {
            c_id: "",
            name: ""
          };
          this.fetchTableList();
          if(res.msg === 'ok'){
            this.$message({
              type: "success",
              message: "添加成功!"
            });
          }else {
            this.$message({
              type: "info",
              message: "操作失败"
            })
          }
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
      this.reviseForm.id = val.id;
      this.reviseForm.name = val.name;
      this.currentCompanyId = val.c_id;
      this.reviseVisible = true;
    },
    ConfirmRevise(){
      $axios
        .post("/v1/category/update",this.reviseForm)
        .then(res => {
          this.reviseVisible = false;
          this.fetchTableList();
        })
        .catch(err => console.log(err));
    },
    handleDelete(val){
      this.currentGoodsId = val.id;
      this.TipDialogVisible = true;
    },
    confirmDelete(){
      $axios
        .post("/v1/category/delete",{
          id: this.currentGoodsId
        })
        .then(res => {
          this.TipDialogVisible = false;
          this.fetchTableList();
          if(res.msg === 'ok'){
            this.$message({
              type: "success",
              message: "你已成功删除!"
            });
          }else {
            this.$message({
              type: "info",
              message: "操作失败"
            })
          }
        })
        .catch(err => console.log(err));
    }
  }
}
</script>

<style lang="scss" scpoed>
  .wechat{
    .el-dialog__wrapper{
      .el-dialog{
        width: 30%;
      }
    }
  }
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