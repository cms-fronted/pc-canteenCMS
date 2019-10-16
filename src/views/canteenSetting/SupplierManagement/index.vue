<template>
  <div>
    <div class="supplier">
      <div class="nav-title">供应商管理</div>
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
            <el-button type="primary" @click="fetchSupplierList">查询供应商</el-button>
            <el-button type="primary" @click="showAddSupplier">增加供应商</el-button>
          </div>
        </div>
        <div class="main-content">
          <el-table style="width:100%" border :data="supplierList">
            <el-table-column label="公司名称" prop="company"></el-table-column>
            <el-table-column label="供应商" prop="name"></el-table-column>
            <el-table-column label="账号" prop="account"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 新增供应商 -->
        <el-dialog :visible.sync="addSupplierVisible" title="新增供应商">
          <el-form ref="addSupplierForm" label-width="100px">
            <el-form-item label="公司">
              <el-select
                placeholder="请选择"
                v-model="addSupplierForm.c_id"
                style="width: 265px;"
              >
                <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商">
              <el-input placeholder="请输入" v-model="addSupplierForm.name"></el-input>
            </el-form-item>
            <el-form-item label="账号">
              <el-input placeholder="请输入" v-model="addSupplierForm.account"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input placeholder="请输入" type="password" v-model="addSupplierForm.pwd"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addSupplierVisible = false">取 消</el-button>
            <el-button type="primary" @click="addSupplier">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 更新供应商 -->
        <el-dialog :visible.sync="reviseSupplierVisible" title="编辑供应商">
          <el-form ref="ReviseSupplierForm" label-width="100px">
            <el-form-item label="供应商">
              <el-input placeholder="请输入" v-model="reviseSupplierForm.name"></el-input>
            </el-form-item>
            <el-form-item label="账号">
              <el-input placeholder="请输入" v-model="reviseSupplierForm.account"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input placeholder="请输入" v-model="reviseSupplierForm.pwd" type="password"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="reviseSupplierVisible = false">取 消</el-button>
            <el-button type="primary" @click="reviseSupplier">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 删除时温馨提示 -->
        <el-dialog
          title="温馨提示"
          :visible.sync="TipDialogVisible"
          width="30%"
        >
          <span>确定删除该供应商吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="TipDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmDelete">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
export default {
  data(){
    return {
      company_id: "",
      companyList: [],
      supplierList: [],
      reviseSupplierForm: {
        "id": "",
        "name": "",
        "account": "",
        "pwd": ""
      },
      addSupplierForm: {
        "c_id": "",
        "name": "",
        "account": "",
        "pwd": ""
      },
      addSupplierVisible: false,
      reviseSupplierVisible: false,
      TipDialogVisible: false,
      currentSupplierId: ""
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
    fetchSupplierList(){
      $axios
        .get(`/v1/suppliers?c_id=${this.company_id}&page=1&size=10`)
        .then(res => {
          this.supplierList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    showAddSupplier(){
      this.addSupplierVisible = true;
    },
    addSupplier(){
       $axios
        .post('/v1/supplier/save',this.addSupplierForm)
        .then(res => {
          this.addSupplierVisible = false;
          this.addSupplierForm = {
            "c_id": "",
            "name": "",
            "account": "",
            "pwd": ""
          }
          this.sendMessage(res.msg);
          this.fetchSupplierList();
        })
        .catch(err => console.log(err));
    },
    handleEdit(val){
      this.reviseSupplierVisible = true;
      this.reviseSupplierForm.id = val.id;
      this.reviseSupplierForm.name = val.name;
      this.reviseSupplierForm.account = val.account;
    },
    reviseSupplier(){
      $axios
        .post('/v1/supplier/update',this.reviseSupplierForm)
        .then(res => {
          this.reviseSupplierVisible = false;
          this.reviseSupplierForm = {
            "id": "",
            "name": "",
            "account": "",
            "pwd": ""
          }
          this.fetchSupplierList();
          this.sendMessage(res.msg);
        })
        .catch(err => console.log(err));
    },
    handleDelete(val){
      this.currentSupplierId = val.id;
      this.TipDialogVisible = true;
    },
    confirmDelete(){
      $axios
        .post("/v1/supplier/delete",{
          id: this.currentSupplierId
        })
        .then(res => {
          this.TipDialogVisible = false;
          this.fetchSupplierList();
          this.sendMessage(res.msg);
        })
        .catch(err => console.log(err));
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
    
    // .el-dialog__wrapper{
    //   .el-form-item{
    //     .el-input{
    //       width: 217px;
    //     }
    //   }
    // }
  }
  .supplier{
      .el-dialog__wrapper{
        .el-dialog{
          width: 30%;
        }
      }
    }
</style>