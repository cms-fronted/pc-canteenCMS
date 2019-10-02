<template>
  <el-dialog
    :title="title"
    :visible.sync="isOpen"
    width="25%"
    ref="materialDialog"
    @close="doClose"
    class="materialDialog"
  >
    <el-form
      :rules="rules"
      :model="formdata"
      label-width="80px"
      ref="addMaterialForm"
      center
      title="新增材料"
    >
      <el-form-item label="材料名称" prop="name">
        <el-input v-model="formdata.name"></el-input>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="formdata.price"></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="formdata.unit"></el-input>
      </el-form-item>
      <div class="btn">
        <el-button @click="doClose">取消</el-button>
        <el-button type="primary" @click.native="handleClick">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import $axios from "@/api/index";
export default {
  data() {
    return {
      formdata: {},
      rules: {},
      isOpen: this.visible
    };
  },
  watch: {
    visible(val) {
      this.isOpen = val;
      this.formdata = Object.assign({}, this.editFormdata);
    }
  },
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
    }
  },
  methods: {
    doClose() {
      this.$emit("close", false);
    },
    handleClick() {
      console.log(this.GLOBAL_ROLE);
      let data = this.formdata;
      Object.assign(data, { c_id: 1 });
      $axios
        .post("/v1/material/save", data)
        .then(res => {
          console.log(res);
          this.doClose();
          this.$message.success("添加成功");
          this.$refs["addMaterialForm"].resetFields();
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
.materialDialog {
  .btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>