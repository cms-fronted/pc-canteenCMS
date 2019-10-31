<template>
  <div>
    <div class="cash">
      <div class="nav-title">现金充值</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span class="content-header">人员信息</span>
          <el-input class="filter-input" v-model="filterText" placeholder="关键字查询"  style="width:200px"></el-input>
          <span class="content-header">充值金额</span>
          <el-input v-model="balance" placeholder="请输入"  style="width:200px"></el-input>
          <span class="content-header">备注</span>
          <el-input v-model="balance" placeholder="请输入"  style="width:200px"></el-input>
          <el-button type="primary">充值</el-button>
          <el-button type="primary" @click="batchRecharge">批量充值</el-button>
        </div>
        <div class="main-content clearfix">
          <div class="department-tree">
            <el-tree
              :data="departmentList"
              :props="defaultProps"
              ref="tree"
              @node-click="handleNodeClick"
              :default-expand-all="true"
              :render-content="renderContent"
            ></el-tree>
          </div>
          <div class="query-list">
            <el-table style="width:100%" :data="personnelList" border @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column label="公司" prop="company"></el-table-column>
              <el-table-column label="部门" prop="department"></el-table-column>
              <el-table-column label="员工编号" prop="code"></el-table-column>
              <el-table-column label="姓名" prop="username"></el-table-column>
              <el-table-column label="手机号码" prop="phone"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <el-dialog title="批量充值" :visible.sync="dialogFormVisible">
        <div class="dialog-header clearfix">
          <span class="download">下载模板：<a href="#" download>团体充值模板.xls</a></span>
          <el-upload
            class="upload-excel upload"
            ref="upload"
            :limit="limit"
            :headers="header"
            :show-file-list="false"
            accept=".xls,.xlsx"
            action=""
            :on-success='handleSuccess'
            :data="{}"
            name=""
            >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 人员信息 充值金额 备注 充值 批量充值
import $axios from "@/api/index";
import Pagination from '@/components/Pagination';
import store from '@/store'
export default {
  data(){
    return {
      header: {
        token: store.getters.token
      },
      filterText: "",
      balance: "",
      remark: "",
      tableData: [],
      defaultProps: {
        children: "items",
        label: "name"
      },
      departmentList: [],
      department_id: "",
      personnelList: [
        {company:"公司A",department:"后勤部",code:"123456",username:"测试1",phone:"13512345654"},
        {company:"公司B",department:"后勤部1",code:"123456",username:"测试2",phone:"13512345654"},
        {company:"公司C",department:"后勤部",code:"123456",username:"测试3",phone:"13512345654"}
      ],
      dialogFormVisible: false,
      limit: 1,
    }
  },
  created(){
    this.fetchDepartmentList();
  },
  methods: {
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
    },
    fetchDepartmentList(){
      // 先默认获取 c_id为2的公司的部门列表
      $axios
        .get("/v1/departments?c_id=2")
        .then(res => {
          this.departmentList = res.data;
        })
        .catch(err => console.log(err));
    },
    handleNodeClick(val) {
      let {id,name} = val;
      this.department_id = id;
      this.fetchPersonnelList();
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>（{node.data.count}）</span>
        </span>);
    },
    fetchPersonnelList(){
      $axios
        .get("/v1/staffs?page=1&size=10&c_id=2&d_id=${this.department_id}")
        .then(res => {
          console.log(res)
          // this.personnelList = res.data.data;
        })
        .catch(err => console.log(err));
    },
    handleSelectionChange(){

    },
    batchRecharge(){
      this.dialogFormVisible = true;
    },
    handleSuccess(){
      this.sendMessage(res.msg);
    }
  }
}
</script>

<style lang="scss" scpoed>
  .clearfix::after{
    content: "";
    display: block;
    clear: both;
  }
  .main-header{
    .content-header{
      padding: 12px 10px;
    }
  }
  .main-content{
    .department-tree{
      width: 20%;
      float: left;
      min-height: 550px;
    }
    .query-list{
      width: 75%;
      float: right;
    }
  }
  .dialog-header{
    .download{
      float: left;
      padding: 10px 0;
    }
    .upload{
      float: right;
    }
  }
</style>

