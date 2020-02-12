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
    },
    type: {
      type: String
    }
  },
  methods: {
    doClose() {
      this.$emit("close", false);
    },
    handleClick() {
      console.log(this.GLOBAL_ROLE);
      let data = this.formdata;
      if (this.type === "_add") {
        this.sendPostRequest(
          "/api/v1/material/save",
          data
        );
        this.$refs["addMaterialForm"].resetFields();
      } else {
        const { id, name, price, unit } = data;
        this.sendPostRequest(
          "/api/v1/material/update",
          { id, name, price, unit }
        );
      }
    },
    sendPostRequest(url, data) {
      $axios
        .post(url, data)
        .then(res => {
          this.doClose();
          this.sendMessage(res.msg);
          this.$emit("confirm", res.msg);
        })
        .catch(err => console.log(err));
    },
    sendMessage(msg) {
      if (msg === "ok") {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      } else {
        this.$message({
          type: "info",
          message: "操作失败"
        });
      }
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
