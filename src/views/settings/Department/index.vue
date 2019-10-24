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
                <el-button size="mini" @click="edit(scoped.row)">编辑</el-button>
                <el-button size="mini" @click="edit(scoped.row)">移动</el-button>
                <el-button size="mini" @click="edit(scoped.row)">删除</el-button>
                <el-button size="mini" @click="edit(scoped.row)">生成二维码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog title="新增员工" width="30%" :visible.sync="addVisible" :close-on-click-modal="false">
      <el-form :model="addFormData" ref="addFormData" label-width="100px">
        <el-form-item label="归属饭堂" prop="canteens">
          <el-checkbox-group v-model="canteens" @change="chooseCanteen">
            <el-checkbox :label="2">大饭堂</el-checkbox>
            <el-checkbox :label="3">饭堂1</el-checkbox>
            <el-checkbox :label="4">饭堂2</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="人员类型" prop="t_id">
          <el-select v-model="addFormData.t_id">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工编号" prop="code">
          <el-input v-model="addFormData.code"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="username">
          <el-input v-model="addFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addFormData.phone"></el-input>
        </el-form-item>
        <el-form-item label="卡号" prop="card_num">
          <el-input v-model="addFormData.card_num"></el-input>
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
import $axios from "@/api/index";
export default {
  data() {
    return {
      addVisible: false,
      canteens: [],
      addFormData: {
        company_id: 2,
        canteens: [],
        d_id: "",
        t_id: "",
        code: "",
        phone: "",
        card_num: "",
        username: ""
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
      tabledata: [],
      roleOptions: []
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
    this.getRole();
  },
  methods: {
    chooseCanteen(val) {
      this.addFormData.canteens = [];
      let _canteen = [];
      val.forEach(item => {
        _canteen.push({
          canteen_id: item
        });
      });
      this.addFormData.canteens = JSON.stringify(_canteen);
    },
    handleNodeClick(data) {
      console.log(data);
      this.addFormData.d_id = data.id;
    },
    getRole() {
      $axios
        .get("/v1/role/types")
        .then(res => {
          this.roleOptions = res.data.data;
        })
        .catch(err => console.log(err));
    },
    fetchTreeData() {
      $axios
        .get("/v1/departments?c_id=2")
        .then(res => {
          this.treeData = Array.from(res.data);
        })
        .catch(err => console.log(err));
    },
    fetchTabledata() {
      $axios
        .get("/v1/staffs?page=1&size=10&c_id=2&d_id=0")
        .then(res => {
          this.tabledata = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    addDialog() {
      this.addVisible = true;
    },
    edit(val) {
      console.log(val);
      $axios
        .post("/v1/department/staff/update", {
          id: 365,
          cancel_canteens: JSON.stringify([19])
        })
        .then(res => console.log(res));
    },
    handleClose() {
      this.addVisible = false;
    },
    _add() {
      $axios
        .post("/v1/department/staff/save", this.addFormData)
        .then(res => {
          if (res.msg == "ok") {
            this.addVisible = false;
            this.$message.success("添加成功");
            this.$refs.addFormData.resetFields();
          }
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
