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
              <el-button type="primary">新增企业</el-button>
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
            <el-button>新增饭堂</el-button>
            <el-button>新增小卖部</el-button>
              <el-table style="width:50%;margin: 0 auto" size="mini">
                <el-table-column>消费地点</el-table-column>
                <el-table-column>操作</el-table-column>
              </el-table>
          </div>
        </el-card>
      </div>
    </div>
    <add-dialog></add-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import AddDialog from "./dialog"
export default {
  components:{
    AddDialog
  },
  data() {
    return {
      companyList: [],
      company_id: "",
      defaultProps: {
        children: "items",
        label: "name"
      }
    };
  },
  created() {
    this.fetchCompanyList();
  },
  methods: {
    handleNodeClick(val) {
      console.log(val)
    },
    fetchCompanyList() {
      $axios
        .get("/v1/companies")
        .then(res => {
          this.companyList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
.tree {
  width: 15%;
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