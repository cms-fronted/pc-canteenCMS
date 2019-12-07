<template>
  <el-dialog :visible.sync="isOpen" title="新增供应商" @close="handleClose">
    <el-form ref="addForm" label-width="100px" :model="formdata">
      <el-form-item label="公司" v-if="companiesVisible">
        <el-select
          placeholder="请选择"
          v-model="formdata.c_id"
          style="width: 265px;"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商">
        <el-input placeholder="请输入" v-model="formdata.name"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input placeholder="请输入" v-model="formdata.account"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          placeholder="请输入"
          type="password"
          v-model="formdata.pwd"
        ></el-input>
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
    companiesVisible: Boolean
  },
  data() {
    return {
      isOpen: this.visible,
      companyList: [],
      formdata: {}
    };
  },
  watch: {
    visible(val) {
      this.formdata = Object.assign({}, this.formdata, this.editData);
      this.isOpen = val;
    }
  },
  created() {
    this.fetchCompanyList();
  },
  methods: {
    fetchCompanyList() {
      $axios
        .get("http://canteen.tonglingok.com/api/v1/companies")
        .then(res => {
          this.companyList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    handleClose() {
      this.$emit("close", false);
      this.$refs["addForm"].resetFields();
    },
    addSupplier() {
      $axios
        .post(
          "http://canteen.tonglingok.com/api/v1/supplier/save",
          this.formdata
        )
        .then(res => {
          this.$refs["addForm"].resetFields();
          this.$emit("close", false, res.msg);
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped></style>
