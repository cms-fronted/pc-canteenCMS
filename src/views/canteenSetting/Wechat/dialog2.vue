<template>
  <el-dialog :visible.sync="isOpen" title="更改商品类型"  @close="handleClose">
    <el-form ref="reviseGoodsForm" label-width="100px">
      <el-form-item label="公司">
        <el-select
          placeholder="请选择"
          v-model="company_id"
        >
          <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品类型">
        <el-input placeholder="请输入" v-model="reviseForm.name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="ConfirmRevise">确 定</el-button>
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
    c_id: [Number,String]
  },
  data() {
    return {
      isOpen: this.visible,
      companyList: [],
      reviseForm: {},
      company_id: this.c_id
    }
  },
  watch: {
    visible(val) {
      this.reviseForm = Object.assign({}, this.reviseForm, this.editData);
      this.isOpen = val;
    },
    c_id(val){
        this.company_id = val;
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
      this.reviseForm = {};
    },
    ConfirmRevise(){
      $axios
        .post("/v1/category/update",this.reviseForm)
        .then(res => {
          this.$emit("closeDialog2", false, res.msg);
        })
        .catch(err => console.log(err));
    },
  }
};
</script>

<style lang="scss" scoped>
</style>