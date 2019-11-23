<template>
  <div>
    <div class="wechat">
      <div class="nav-title">微信端设置</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span class="content-header"  v-if="companiesVisible">公司：</span>
          <el-select
            v-model="company_id"
            placeholder="请选择"
            v-if="companiesVisible"
          >
            <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-button type="primary" @click="fetchTableList">查询商品类型</el-button>
          <el-button type="primary" @click="handleClick({c_id:company_id},'_add','增加商品类型')">增加商品类型</el-button>
        </div>
        <div class="main-content">
          <el-table style="width:100%" border :data="tableList">
            <el-table-column label="公司名称" prop="company"></el-table-column>
            <el-table-column label="商品类型" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleClick(scope.row,'_edit','更改商品类型')">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 10"
            :total="total"
            :page.sync="page"
            @pagination="getList"
          ></pagination>
        </div>
      </div>
    </div>
    <handle-dialog
      :visible="visible"
      :type="editType"
      :editFormdata="editFormdata"
      :title="dialogTitle"
      :companiesVisible="companiesVisible"
      @close="closeDialog"
      @confirm="confirmUpdate"
    >
    </handle-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import HandleDialog from "./dialog";
import Pagination from "@/components/Pagination";
import store from '@/store';
export default {
  data() {
    return {
      grade: store.getters.grade,  
      companyList: [],
      company_id: "",
      tableList: [],
      currentGoodsId: "",
      total: 0,
      page: 1,
      visible: false,
      editType: "",
      editFormdata: {},
      dialogTitle: ""
    };
  },
  components: { Pagination,HandleDialog },
  created() {
    this.fetchCompanyList();
  },
  computed: {
    companiesVisible(){
      return this.grade !== 3;
    }
  },
  methods: {
    fetchCompanyList() {
      $axios
        .get("http://canteen.tonglingok.com/api/v1/companies")
        .then(res => {
          this.companyList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    fetchTableList() {
      if(this.companiesVisible){
        $axios
          .get(`http://canteen.tonglingok.com/api/v1/categories?c_id=${this.company_id}&page=${this.page}&size=10`)
          .then(res => {
            this.tableList = Array.from(res.data.data);
            this.total = res.data.total;
          })
          .catch(err => console.log(err));
      }else{
        $axios
        .get(`http://canteen.tonglingok.com/api/v1/categories?page=${this.page}&size=10`)
        .then(res => {
          console.log(res)
          this.tableList = Array.from(res.data.data);
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
      }
    },
    handleDelete(val) {
      this.currentGoodsId = val.id;
      this.$confirm("确定删除该类型吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $axios
            .post("http://canteen.tonglingok.com/api/v1/category/delete", {
              id: this.currentGoodsId
            })
            .then(res => {
              this.fetchTableList();
              this.sendMessage(res.msg);
            })
            .catch(err => console.log(err));
        })
        .catch(err => {});
    },
    sendMessage(msg) {
      if (msg === "ok") {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      } else {
        this.$message({
          type: "info",
          message: "操作失败"
        });
      }
    },
    getList(val) {
      this.page = val;
      this.fetchTableList();
    },
    closeDialog(val){
      this.visible = val;
    },
    confirmUpdate(val){
      if(val === 'ok'){
        this.fetchTableList();
      }
    },
    handleClick(row = {}, type, title){
      this.editFormdata = {}
      this.visible = true;
      this.dialogTitle = title;
      this.editType = type;
      Object.assign(this.editFormdata, {}, row);
    }
  }
};
</script>

<style lang="scss" scpoed>
.main {
  .main-content {
    .el-table {
      th,
      td {
        text-align: center;
      }
    }
  }
}
.el-dialog__wrapper {
  .el-dialog {
    width: 30%;
  }
}
</style>
