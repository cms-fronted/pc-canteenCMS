<template>
  <div class="manage">
    <div class="nav-title">企业管理</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-tree
          class="tree"
          :data="companyList"
          :props="defaultProps"
          accordionF
          @node-click="handleNodeClick"
        ></el-tree>
        <el-form :inline="true">
          <el-form-item label="公司">
            <el-select v-model="company_id" placeholder="请选择" style="width:150px">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span>
              <el-button type="primary">查询</el-button>
              <el-button type="primary" @click="addEnterprise">新增企业</el-button>
              <el-button type="primary">更改名称</el-button>
            </span>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-content">
        <el-card>
          <div slot="header" class="clearfix">
            <span>云饭堂</span>
          </div>
          <div class="card-content">
            <el-button @click="addCanteen" :disabled="!company_id">新增饭堂</el-button>
            <el-button :disabled="!company_id">新增小卖部</el-button>
            <el-table style="width:50%;margin: 0 auto" size="mini">
              <el-table-column>消费地点</el-table-column>
              <el-table-column>操作</el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
      :visible.sync="addEnterpriseVisible"
      width="40%"
      title="新增企业"
      @close="addEnterpriseVisible = false"
    >
      <el-form ref="newEnterprise" :model="enterpriseForm" label-width="80px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="enterpriseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上级企业">
          <el-input :disabled="true" :value="parent.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_addEnterprise">确 定</el-button>
      </span>
    </el-dialog>
    <add-dialog @closeAdd="_cancelCanteen" :visible="addCanteenVisible" :company_id="company_id"></add-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import AddDialog from "./dialog";
export default {
  components: {
    AddDialog
  },
  data() {
    return {
      addCanteenVisible: false,
      addEnterpriseVisible: false,
      companyList: [],
      company_id: "",
      parent: {
        id: "",
        name: ""
      },
      defaultProps: {
        children: "items",
        label: "name"
      },
      enterpriseForm: {
        name: ""
      }
    };
  },
  created() {
    this.fetchCompanyList();
  },
  methods: {
    handleNodeClick(val) {
      let { id, name } = val;
      this.company_id = id;
      this.parent.id = id;
      this.parent.name = name;
      this.getComsumptionLoc(id);
      console.log(this.company_id);
    },
    getComsumptionLoc(id) {
      $axios
        .get(`/v1/company/consumptionLocation?company_id=${id}`)
        .then(res => console.log(res));
    },
    fetchCompanyList() {
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          console.log(res);
          this.companyList = Array.from(res.data);
        })
        .catch(err => console.log(err));
    },
    addCanteen() {
      this.addCanteenVisible = true;
    },
    _cancelCanteen(val) {
      this.addCanteenVisible = val;
    },
    addEnterprise() {
      this.addEnterpriseVisible = true;
    },
    _addEnterprise() {
      $axios
        .post("/v1/company/save", {
          parent_id: this.parent.id || 0,
          name: this.enterpriseForm.name
        })
        .then(res => {
          this.fetchCompanyList();
          this.addEnterpriseVisible = false;
          this.$message.success("添加成功");
          this.$refs.newEnterprise.resetFields();
          this.parent.id = "";
          this.parent_name = "";
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
.tree {
  width: 20%;
  float: left;
  min-height: 550px;
}
.tree::after {
  clear: both;
  content: "";
  display: block;
}
.card-content {
  text-align: center;
}
.clearfix {
  text-align: center;
  font-size: 16px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>