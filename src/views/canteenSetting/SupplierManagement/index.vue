<template>
  <div>
    <div class="supplier">
      <div class="nav-title">供应商管理</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span class="content-header">公司：</span>
          <el-select v-model="company_id" placeholder="请选择">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="fetchSupplierList"
            >查询供应商</el-button
          >
          <el-button type="primary" @click="showAddSupplier"
            >增加供应商</el-button
          >
        </div>
        <div class="main-content">
          <el-table style="width:100%" border :data="supplierList">
            <el-table-column label="公司名称" prop="company"></el-table-column>
            <el-table-column label="供应商" prop="name"></el-table-column>
            <el-table-column label="账号" prop="account"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >Delete</el-button
                >
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
        <add-dialog
          :visible="addVisible"
          @closeDialog1="closeDialog1"
          :editData="addSupplierForm"
        ></add-dialog>
        <revise-dialog
          :visible="reviseVisible"
          @closeDialog2="closeDialog2"
          :editData="reviseSupplierForm"
        ></revise-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import AddDialog from "./dialog1";
import ReviseDialog from "./dialog2";
import Pagination from "@/components/Pagination";
export default {
  data() {
    return {
      company_id: "",
      companyList: [],
      supplierList: [],
      reviseSupplierForm: {
        id: "",
        name: "",
        account: "",
        pwd: ""
      },
      addSupplierForm: {
        c_id: "",
        name: "",
        account: "",
        pwd: ""
      },
      addVisible: false,
      reviseVisible: false,
      currentSupplierId: "",
      page: 1,
      total: 0
    };
  },
  components: { AddDialog, ReviseDialog, Pagination },
  created() {
    this.fetchCompanyList();
  },
  methods: {
    fetchCompanyList() {
      $axios
        .get("/v1/companies")
        .then(res => {
          this.companyList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    fetchSupplierList() {
      $axios
        .get(`/v1/suppliers?c_id=${this.company_id}&page=${this.page}&size=10`)
        .then(res => {
          this.supplierList = Array.from(res.data.data);
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    showAddSupplier() {
      this.addVisible = true;
    },
    handleEdit(val) {
      this.reviseVisible = true;
      this.reviseSupplierForm.id = val.id;
      this.reviseSupplierForm.name = val.name;
      this.reviseSupplierForm.account = val.account;
    },
    handleDelete(val) {
      this.currentSupplierId = val.id;
      this.$confirm("确定删除该供应商吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $axios
            .post("/v1/supplier/delete", {
              id: this.currentSupplierId
            })
            .then(res => {
              this.fetchSupplierList();
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
    closeDialog1(val, msg) {
      this.addSupplierForm = {
        c_id: "",
        name: "",
        account: "",
        pwd: ""
      };
      this.addVisible = val;
      if (msg === "ok") {
        this.fetchSupplierList();
        this.sendMessage(msg);
      }
    },
    closeDialog2(val, msg) {
      this.reviseSupplierForm = {
        id: "",
        name: "",
        account: "",
        pwd: ""
      };
      this.reviseVisible = val;
      if (msg === "ok") {
        this.fetchSupplierList();
        this.sendMessage(msg);
      }
    },
    getList(val) {
      this.page = val;
      this.fetchSupplierList();
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
.supplier {
  .el-dialog__wrapper {
    .el-dialog {
      width: 30%;
    }
  }
}
</style>
