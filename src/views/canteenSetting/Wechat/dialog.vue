<template>
  <el-dialog :visible.sync="isOpen" :title="title" @close="handleClose">
    <el-form ref="addGoodsForm" label-width="100px" :model="formdata">
      <el-form-item label="公司" v-if="companiesVisible">
        <el-select
          placeholder="请选择"
          v-model="formdata.c_id"
          style="width: 265px;"
        >
          <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品类型">
        <el-input placeholder="请输入" v-model="formdata.name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import $axios from "@/api/index";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";

export default {
  props: {
    visible: {
      type: Boolean
    },
    title: {
      type: String,
      required: true
    },
    editFormdata: {
      type: Object
    },
    type: {
      type: String
    },
    companiesVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      isOpen: this.visible,
      companyList: [],
      formdata: {}
    }
  },
  watch: {
    visible(val) {
      this.isOpen = val;
      this.formdata = Object.assign({}, this.editFormdata);
    }
  },
  created(){
    this.fetchCompanyList();
  },
  methods: {
    sendPostRequest(url,data){
      $axios
        .post(url,data)
        .then(res => {
          this.handleClose();
          this.sendMessage(res.msg);
          this.$emit("confirm",res.msg);
        })
        .catch(err => console.log(err));
    },
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
    fetchCompanyList(){
      $axios
        .get("http://canteen.tonglingok.com/api/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          this.companyList = flatten(arr);
        })
        .catch(err => console.log(err));
    },
    handleClose(){
      this.$emit("close", false);
    },
    handleConfirm(){
      let data = this.formdata;
      if(this.type === '_add'){
        this.sendPostRequest("http://canteen.tonglingok.com/api/v1/category/save", data);
        this.$refs["addGoodsForm"].resetFields();
      }else{
        let {id,name} = data;
        this.sendPostRequest("http://canteen.tonglingok.com/api/v1/category/update", {id,name});
        this.$refs["addGoodsForm"].resetFields();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>