<template>
  <div>
    <div class="cash">
      <div class="nav-title">现金充值</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span class="content-header">人员信息</span>
          <el-input class="filter-input" v-model="key" placeholder="关键字查询" prefix-icon="el-icon-search" style="width:180px"></el-input>
          <el-button type="primary" @click="fetchPersonnelList">查询</el-button>
          <span class="content-header">充值金额</span>
          <el-input v-model="money" placeholder="请输入"  style="width:180px"></el-input>
          <span class="content-header">备注</span>
          <el-input v-model="remark" placeholder="请输入"  style="width:180px"></el-input>
          <el-button type="primary" @click="recharge">充值</el-button>
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
            <pagination v-show="total > 10" :total="total" :page.sync="current_page" @pagination="getList"></pagination>
          </div>
        </div>
      </div>
      <el-dialog title="批量充值" :visible.sync="dialogFormVisible" @close="handleClose">
        <div class="dialog-header clearfix">
          <span class="download">下载模板：<a style="color: blue;" href="http://canteen.tonglingok.com/static/excel/template/%E6%89%B9%E9%87%8F%E7%8E%B0%E9%87%91%E5%85%85%E5%80%BC%E6%A8%A1%E6%9D%BF.xlsx" download>团体充值模板.xls</a></span>
          <el-upload
            class="upload-excel upload"
            ref="upload"
            :limit="limit"
            :headers="header"
            accept=".xls,.xlsx"
            action="/v1/wallet/recharge/upload"
            
            :on-success='handleSuccess'
            :auto-upload="false"
            :on-change="handleChange"
            name="cash"
            >
            <el-button type="primary">选择上传文件</el-button>
          </el-upload>
          <!-- :show-file-list="false"  -->
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
          <!-- @click="dialogFormVisible = false"   -->
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 人员信息 充值金额 备注 充值 批量充值
// http://canteen.tonglingok.com/api/v1/department/staffs/recharge?page=1&size=10&department_id=4&key=
// page  size department_id key
import $axios from "@/api/index";
import Pagination from '@/components/Pagination';
import store from '@/store'
export default {
  data(){
    return {
      header: {
        token: store.getters.token
      },
      key: "",
      money: "",
      remark: "",
      detail: [],
      tableData: [],
      defaultProps: {
        children: "items",
        label: "name"
      },
      departmentList: [],
      department_id: "",
      personnelList: [
        /* {"id": 364,"company": "一级企业","department": "董事会-修改","code": "0080808","username": "黄工","phone": "13411111111","card_num":"123"},
        {"id": 365,"company": "一级企业","department": "部门A","code": "0080808","username": "肖工","phone": "13411111132","card_num":"234"}, */
      ],
      dialogFormVisible: false,
      limit: 1,
      total: 0,
      current_page: 1,
    }
  },
  created(){
    this.fetchDepartmentList();
  },
  components:{Pagination},
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
      // 先默认获取 c_id为2的公司的部门列表 到时需要修改成 /v1/departments/recharge
      // get("/v1/departments?c_id=2") /v1/departments/recharge
      $axios
        .get("/v1/departments/recharge")
        .then(res => {
          // console.log(res)
          this.departmentList = res.data;
        })
        .catch(err => console.log(err));
    },
    handleNodeClick(val) {
      let {id,name} = val;
      this.department_id = id;
      // 点击某个部门，出现右边的这个部门的人员明细
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
        .get("/v1/department/staffs/recharge",{
          "page": 1,
          "size": 10,
          "department_id": this.department_id,
          "key": this.key
        })
        .then(res => {
          this.personnelList = res.data.data;
        })
        .catch(err => console.log(err));
    },
    handleSelectionChange(arr){
      this.detail = [];
      arr.forEach(item => {
        this.detail.push({"phone":item.phone,"card_num":item.card_num})
      })
    },
    recharge(){
      $axios
        .post("/v1/wallet/recharge/cash",{
          "money": this.money,
          "remark": this.remark,
          "detail": JSON.stringify(this.detail)
        })
        .then(res => {
          this.sendMessage(res.msg);
        })
        .catch(err => console.log(err));
    },
    batchRecharge(){
      this.dialogFormVisible = true;
    },
    handleSuccess(res, file, fileList){
      this.$refs.upload.clearFiles();
      this.sendMessage(res.msg);
    },
    handleChange(file, fileList){
      if(file.status === 'ready'){
        this.$message({
          type: 'info',
          message: "已成功选择文件上传，请点击确定按钮确认"
        });
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
      this.dialogFormVisible = false;
    },
    handleClose(){
      this.dialogFormVisible = false;
      // this.$refs.upload.clearFiles();
    },
    getList(val){
      this.current_page = val;
      this.fetchTableList();
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
      width: 177px;
      .el-upload {
        margin-left: 50px;
      }
    }
  }
</style>

