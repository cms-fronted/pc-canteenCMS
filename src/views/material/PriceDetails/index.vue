<template>
  <div class="details">
    <div class="nav-title">材料价格明细</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <span class="content-header">公司：</span>
        <el-select v-model="company_id" placeholder="请选择" style="width:150px" 
          @change="fetchCanteenList(company_id)">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <span class="content-header">消费地点：</span>
        <el-select v-model="canteen_id" placeholder="请选择" style="width:150px">
          <el-option
            v-for="item in canteenList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          :clearable="true"
          v-model="keyword"
          style="width:180px;margin: 0 15px;"
        ></el-input>
        <el-button type="primary" plain style="margin-left:0" @click="fetchTableList">查询</el-button>
        <el-button type="primary" @click="deriveData">导出</el-button>
        <el-button type="primary">批量导入</el-button>
        <el-button type="primary" @click="handleClick({},'_add','新增材料')">添加</el-button>
      </div>
      <div class="main-content">
        <el-table style="width:100%; font-size:14px" :data="tableData" border>
          <el-table-column prop="id" label="序号" width="200px"></el-table-column>
          <el-table-column prop="name" label="材料名称"></el-table-column>
          <el-table-column label="单价/元">
            <template slot-scope="scope">{{scope.row.price}}元/kg</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleClick(scope.row,'_edit','编辑材料')">编辑</el-button>
              <el-button size="mini" type="danger" @click="_delete(scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 10" :total="total" :page.sync="page" @pagination="getList"></pagination>
      </div>
    </div>
    <handle-dialog
      :visible="visible"
      ref="materialDialog"
      :type="editType"
      :editFormdata="editFormdata"
      :title="dialogTitle"
      @close="closeDialog"
      @confirm="confirmUpdate"
    />
  </div>
</template>

<script>
import HandleDialog from "./dialog";
import $axios from "@/api/index";
import Pagination from '@/components/Pagination'
export default {
  data() {
    return {
      company_id: "",
      companyList: [],
      canteen_id: "",
      canteenList: [],
      tableData: [],
      keyword: "",
      editType: "",
      dialogTitle: "",
      visible: false,
      editFormdata: {},
      result: [],
      total: 0,
      page: 1,
    };
  },
  created(){
    this.fetchCompanyList();
    // this.fetchCanteenList();
  },
  methods: {
    flatten(arr){
      for(var i = 0, len = arr.length; i < len; i++){
        this.companyList.push({id:arr[i].id, name:arr[i].name})
        if(typeof arr[i].items !==  'undefined' ){
          this.flatten(arr[i].items);
        }
      }
    },
    fetchCompanyList(){
      $axios
        .get('/v1/admin/companies')
        .then(res => {
          this.flatten(res.data);
          // 需要有全部这个选项 id:1,2,3 name:"全部"
          let temp = '';
          this.companyList.forEach((item,index) => {
            if(index <= this.companyList.length){
              temp += item.id + ','
            }
          })
          temp = temp.slice(0,-1)
          this.companyList.unshift({id:temp,name:'全部'})
        })
        .catch(error => console.log(err));
    },
    fetchCanteenList(id){
      this.canteenList = [];
      if(typeof id === 'string' && id.indexOf(',')){
        this.canteenList.unshift({id:'',name:'全部'})
        this.canteen_id = ''
      }else{
        this.canteen_id = '';
        $axios
        .get(`/v1/canteens?company_id=${id}`)
        .then(res => {
          this.canteenList = res.data;
        })
        .catch(error => console.log(err));
      }
      
    },
    fetchTableList(){
      $axios
        .get(`/v1/materials?page=${this.page}&size=10&key=${this.keyword}&canteen_ids=${this.canteen_id}&company_ids=${this.company_id}`)
        .then(res => {
          this.tableData = res.data.data;
          this.total = res.data.total;
        })
        .catch(error => console.log(err));
    },
    handleClick(row = {}, type, title) {
      // handleClick({},'_add','新增材料')
      // handleClick(scope.row,'_edit','编辑材料')
      this.visible = true;
      this.dialogTitle = title;
      // 编辑类型为
      this.editType = type;
      Object.assign(this.editFormdata, {}, row);
      console.log(this.editFormdata)
    },

    _delete(row) {
      console.log(row);
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/v1/material/handel", {
              id: row.id
            })
            .then(res => {
              if (res.data.msg == "ok") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }else {
                this.$message({
                  type: "info",
                  message: "操作失败"
                })
              }
            })
            .catch(err => console.log(err));
        })
    },
    getList(val){
      this.page = val;
      this.fetchTableList();
    },
    closeDialog(val) {
      this.visible = val;
      this.editFormdata = {};
    },
    deriveData(){
      // 导出 excel
      console.log('导出')
      console.log('this.keyword:',this.keyword)
      console.log('this.canteen_id:',this.canteen_id)
      console.log('this.company_id:',this.company_id)
      $axios
        .get(`/v1/material/export?key=${this.keyword}&canteen_ids=${this.canteen_id}&company_ids=${this.company_id}`)
        .then(res => {
          console.log(res)
          console.log(res.data.url);
          // console.log(this.tableData)
        })
        .catch(error => console.log(err));
    },
    confirmUpdate(val){
      if(val === 'ok'){
        this.fetchTableList();
      }
    }
  },
  components: {
    HandleDialog,Pagination
  }
};
</script>

<style  lang="scss" scoped>
  .main{
    .main-content{
      .el-table{
        th,td{
          text-align: center;
        }
      }
    }
  }
</style>