<template>
  <el-dialog :visible.sync="isOpen" title="编辑供应商">
    <el-form ref="ReviseSupplierForm" label-width="100px">
      <el-form-item label="供应商">
        <el-input placeholder="请输入" v-model="reviseSupplierForm.name"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input placeholder="请输入" v-model="reviseSupplierForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input placeholder="请输入" v-model="reviseSupplierForm.pwd" type="password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="reviseSupplier">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import $axios from "@/api/index";
export default {
  props: {
    visible: {
      type: Boolean
    },
    editData: Object
  },
  data() {
    return {
      isOpen: this.visible,
      companyList: [],
      reviseSupplierForm: {}
    }
  },
  watch: {
    visible(val) {
      this.reviseSupplierForm = Object.assign({}, this.reviseSupplierForm, this.editData);
      this.isOpen = val;
    }
  },
  created(){
    this.fetchCompanyList();
  },
  methods: {
    fetchCompanyList(){
      $axios
        .get("/v1/companies")
        .then(res => {
          this.companyList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    handleClose(){
      this.$emit("closeDialog2", false);
      this.reviseSupplierForm = {}
    },
    reviseSupplier(){
      $axios
        .post('/v1/supplier/update',this.reviseSupplierForm)
        .then(res => {
          this.$emit("closeDialog2", false, res.msg);
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
</style>