<template>
  <el-dialog :visible.sync="isOpen" title="增加商品类型" @close="handleClose">
    <el-form ref="addGoodsForm" label-width="100px">
      <el-form-item label="公司">
        <el-select
          placeholder="请选择"
          v-model="goodsForm.c_id"
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
      <el-form-item label="商品类型">
        <el-input placeholder="请输入" v-model="goodsForm.name"></el-input>
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
export default {
  props: {
    visible: {
      type: Boolean
    },
    editData: Object,
    title: String
  },
  data() {
    return {
      isOpen: this.visible,
      companyList: [],
      goodsForm: {}
    };
  },
  watch: {
    visible(val) {
      this.goodsForm = Object.assign({}, this.goodsForm, this.editData);
      this.isOpen = val;
    }
  },
  created() {
    this.fetchCompanyList();
  },
  methods: {
    fetchCompanyList() {
      $axios
        .get("https://tonglingok.com/canteen/api/v1/companies")
        .then(res => {
          this.companyList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    handleClose() {
      this.$emit("closeDialog1", false);
      this.goodsForm = {};
    },
    handleConfirm() {
      $axios
        .post(
          "https://tonglingok.com/canteen/api/v1/category/save",
          this.goodsForm
        )
        .then(res => {
          this.$emit("closeDialog1", false, res.msg);
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped></style>
