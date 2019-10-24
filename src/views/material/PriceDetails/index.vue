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
        <el-table style="width:100%; font-size:14px" :data="tableData">
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
      </div>
    </div>
    <handle-dialog
      :visible="visible"
      ref="materialDialog"
      :type="editType"
      :editFormdata="editFormdata"
      :title="dialogTitle"
      @close="closeDialog"
    />
  </div>
</template>

<script>
import HandleDialog from "./dialog";
import $axios from "@/api/index";
export default {
  data() {
    return {
      company_id: "",
      companyList: [],
      canteen_id: "",
      canteenList: [],
      tableData: [
        {
          id: 5,
          name: "生姜",
          price: 20,
          unit: "kg",
          state: 1,
          create_time: "2019-08-16 10:27:50",
          canteen_id: 6,
          company_id: 3,
          canteen: "饭堂1",
          company: "企业A"
        }
      ],
      keyword: "",
      editType: "",
      dialogTitle: "",
      visible: false,
      editFormdata: {},
      result: []
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
          console.log(temp)
        })
        .catch(error => console.log(err));
    },
    fetchCanteenList(id){
      if(typeof id === 'string' && id.indexOf(',')){
        // console.log(typeof id)
        // console.log('hhh')
        console.log(id)
        this.canteenList.unshift({id:'all',name:'全部'})
        // this.canteen_id = '全部'
      }else{
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
        .get(`/v1/materials?page=1&size=10&key=${this.keyword}&canteen_ids=${this.canteen_id}&company_ids=${this.company_ids}`)
        .then(res => {
          console.log(res)
          // tableData
        })
        .catch(error => console.log(err));
    },
    handleClick(row = {}, type, title) {
      this.visible = true;
      this.dialogTitle = title;
      this.editType = type;
      Object.assign(this.editFormdata, {}, row);
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
    closeDialog(val) {
      this.visible = val;
      this.editFormdata = {};
    },
    deriveData(){

    }
  },
  components: {
    HandleDialog
  }
};
</script>

<style>
</style>