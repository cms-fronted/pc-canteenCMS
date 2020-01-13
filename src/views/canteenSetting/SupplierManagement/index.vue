<template>
  <div>
    <div class="supplier">
      <div class="nav-title">供应商管理</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span class="content-header" v-if="companiesVisible">公司：</span>
          <el-select
            v-model="company_id"
            placeholder="请选择"
            v-if="companiesVisible"
            filterable
            style="width:250px"
          >
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            style="margin-left:10px"
            @click="fetchSupplierList"
            >查询供应商</el-button
          >
          <el-button type="primary" @click="handleClick({ c_id: company_id })"
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
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >Delete</el-button
                >
                <el-button size="mini" @click="handleEdit(scope.row)"
                  >重置密码</el-button
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
          @close="closeDialog"
          :editData="editFormdata"
          :companiesVisible="companiesVisible"
        ></add-dialog>
        <el-dialog
          title="重置密码"
          :visible.sync="resetpwdVisible"
          @close="handleClose"
        >
          <span class="content-header">密码：</span>
          <el-input
            placeholder="请输入"
            type="password"
            v-model="pwd"
            style="width: 320px;"
          ></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="confirmReset">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import AddDialog from "./dialog";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";
export default {
  data() {
    return {
      grade: store.getters.grade,
      company_id: "",
      companyList: [],
      supplierList: [],
      reviseSupplierForm: {
        id: "",
        name: "",
        account: "",
        pwd: ""
      },
      addVisible: false,
      reviseVisible: false,
      currentSupplierId: "",
      page: 1,
      total: 0,
      editFormdata: {
        c_id: "",
        name: "",
        account: "",
        pwd: ""
      },
      pwd: "",
      resetpwdVisible: false
    };
  },
  components: { AddDialog, Pagination },
  async created() {
    await this.fetchCompanyList();
    await this.fetchSupplierList();
  },
  computed: {
    companiesVisible() {
      return this.grade !== 3;
    }
  },
  methods: {
    async fetchCompanyList() {
      await $axios
        .get("http://canteen.tonglingok.com/api/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          this.companyList = flatten(arr);
          this.company_id = this.companyList[0].id;
        })
        .catch(err => console.log(err));
    },
    async fetchSupplierList() {
      if (this.companiesVisible) {
        await $axios
          .get(
            `http://canteen.tonglingok.com/api/v1/suppliers?c_id=${
              this.company_id
            }&page=${this.page}&size=10`
          )
          .then(res => {
            this.supplierList = Array.from(res.data.data);
            this.total = res.data.total;
          })
          .catch(err => console.log(err));
      } else {
        await $axios
          .get(
            `http://canteen.tonglingok.com/api/v1/suppliers?page=${
              this.page
            }&size=10`
          )
          .then(res => {
            this.supplierList = Array.from(res.data.data);
            this.total = res.data.total;
          })
          .catch(err => console.log(err));
      }
    },
    showAddSupplier() {
      this.addVisible = true;
    },
    handleEdit(val) {
      this.resetpwdVisible = true;
      let { id, name, account } = val;
      this.reviseSupplierForm = { id, name, account };
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
            .post("http://canteen.tonglingok.com/api/v1/supplier/delete", {
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
    closeDialog(val, msg) {
      this.addVisible = val;
      if (msg === "ok") {
        this.fetchSupplierList();
        this.sendMessage(msg);
      }
    },
    getList(val) {
      this.page = val;
      this.fetchSupplierList();
    },
    handleClick(row = {}) {
      this.addVisible = true;
      Object.assign(this.editFormdata, {}, row);
    },
    handleClose() {
      this.pwd = "";
      this.resetpwdVisible = false;
    },
    confirmReset() {
      this.reviseSupplierForm.pwd = this.pwd;
      $axios
        .post(
          "http://canteen.tonglingok.com/api/v1/supplier/update",
          this.reviseSupplierForm
        )
        .then(res => {
          this.resetpwdVisible = false;
          this.pwd = "";
          this.sendMessage(res.msg);
        })
        .catch(err => console.log(err));
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
