<template>
  <el-dialog :visible.sync="isOpen" title="新增供应商"  @close="handleClose">
    <el-form ref="addSupplierForm" label-width="100px">
      <el-form-item label="公司">
        <el-select
          placeholder="请选择"
          v-model="addSupplierForm.c_id"
          style="width: 265px;"
        >
          <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商">
        <el-input placeholder="请输入" v-model="addSupplierForm.name"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input placeholder="请输入" v-model="addSupplierForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input placeholder="请输入" type="password" v-model="addSupplierForm.pwd"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addSupplier">确 定</el-button>
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
    editData: Object,
  },
  data() {
    return {
      isOpen: this.visible,
      companyList: [],
      addSupplierForm: {}
    }
  },
  watch: {
    visible(val) {
      this.addSupplierForm = Object.assign({}, this.addSupplierForm, this.editData);
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
      this.$emit("closeDialog1", false);
    },
    addSupplier(){
      $axios
        .post('/v1/supplier/save',this.addSupplierForm)
        .then(res => {
          this.$emit("closeDialog1", false, res.msg);
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
</style>