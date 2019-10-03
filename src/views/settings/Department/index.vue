<template>
  <div class="department">
    <div class="nav-title">部门人员设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-tree
          class="tree"
          :data="treeData"
          :props="defaultProps"
          accordionF
          @node-click="handleNodeClick"
        ></el-tree>
        <el-form :inline="true">
          <el-form-item label="公司">
            <el-select v-model="value">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button type="primary">编辑名称</el-button>
          <el-button type="primary">新增部门</el-button>
          <el-button type="danger">删除部门</el-button>
          <el-button type="primary">批量新增人员</el-button>
        </el-form>
        <div class="main-content">
          <el-table style="width:85%" :data="tabledata">
            <el-table-column label="归属饭堂" prop="canteen"></el-table-column>
            <el-table-column label="人员类型" prop="type"></el-table-column>
            <el-table-column label="员工编号" prop="code"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="手机号码" prop="phone"></el-table-column>
            <el-table-column label="卡号" prop="card_num"></el-table-column>
            <el-table-column label="二维码有效周期" prop="expiry_date"></el-table-column>
            <el-table-column label="新增人员">
              <template slot-scope="props">
                <span @click="edit(props.row)">新增</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "items",
        label: "name"
      },
      value: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ],
      tabledata: []
    };
  },
  created() {
    this.fetchTreeData();
    this.fetchTabledata();
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    fetchTreeData() {
      this.$axios
        .get("/v1/departments?c_id=2")
        .then(res => {
          console.log(res.data.data);
          this.treeData = res.data.data;
        })
        .catch(err => console.log(err));
    },
    fetchTabledata() {
      this.$axios
        .get("/v1/staffs?page=1&size=10&c_id=2&d_id=4")
        .then(res => {
          console.log(res);
          this.tabledata = Array.from(res.data.data.data);
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
</style>