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
          <el-button type="primary" @click="addDialog">新增人员</el-button>
          <el-button type="primary">批量新增人员</el-button>
          <el-button type="danger">删除部门</el-button>
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
            <el-table-column label="新增人员" prop="new">
              <template slot-scope="scoped">
                <el-button size="mini" @click="edit(scoped.row)">新增</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog title="新增员工" width="30%" :visible.sync="addVisible" :close-on-click-modal="false">
      <el-form :model="addFormData" label-width="100px">
        <el-form-item label="归属饭堂">
          <el-radio-group v-model="addFormData.c_id">
            <el-radio :label="1">A饭堂</el-radio>
            <el-radio :label="2">B饭堂</el-radio>
            <el-radio :label="3">C饭堂</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="人员类型">
          <el-select v-model="addFormData.t_id">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input v-model="addFormData.card_num"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="addFormData.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="_add">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      addVisible: false,
      addFormData: {
        c_id: "",
        d_id: "",
        t_id: "",
        code: "",
        name: "",
        phone: "",
        card_num: ""
      },
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
  computed: {
    ...mapState({
      role: state => state.user.role
    })
  },
  created() {
    this.fetchTreeData();
    this.fetchTabledata();
  },
  methods: {
    handleNodeClick(data) {
    },
    fetchTreeData() {
      this.$axios
        .get("/v1/departments?c_id=2")
        .then(res => {
          this.treeData = res.data.data;
        })
        .catch(err => console.log(err));
    },
    fetchTabledata() {
      this.$axios
        .get("/v1/staffs?page=1&size=10&c_id=2&d_id=4")
        .then(res => {
          this.tabledata = Array.from(res.data.data.data);
        })
        .catch(err => console.log(err));
    },
    addDialog() {
      this.addVisible = true;
    },
    edit(val) {
      console.log(val);
    },
    handleClose() {
      this.addVisible = false;
    },
    _add() {
      console.log(this.addFormData);
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
