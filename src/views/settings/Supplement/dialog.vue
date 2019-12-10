<template>
  <el-dialog :visible.sync="isOpen" :title="params.title" @close="handleClose">
    <div class="dialog-header clearfix">
      <span class="download"
        >下载模板：<a
          href="http://canteen.tonglingok.com/static/excel/template/补录管理模板.xlsx"
          download
          >补录管理模板.xls</a
        ></span
      >
      <el-upload
        class="upload-excel upload"
        ref="upload"
        :limit="params.limit"
        :headers="params.header"
        :show-file-list="false"
        accept=".xls,.xlsx"
        action="http://canteen.tonglingok.comhttp://canteen.tonglingok.com/api/v1/wallet/supplement/upload"
        :on-success="handleSuccess"
        name="supplement"
      >
        <el-button type="primary">点击上传</el-button>
      </el-upload>
      <!-- :data="{}" -->
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean
    },
    params: Object
  },
  data() {
    return {
      isOpen: this.visible
    };
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", false);
    },
    handleSuccess(res, file, fileList) {
      this.sendMessage(res.msg);
    },
    sendMessage(msg) {
      if (msg === "ok") {
        this.$message({
          type: "success",
          message: "已成功进行补录!"
        });
      } else {
        this.$message({
          type: "info",
          message: "操作失败"
        });
      }
    }
  },
  watch: {
    visible(val) {
      this.isOpen = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.dialog-header {
  .download {
    float: left;
    padding: 10px 0;
  }
  .upload {
    float: right;
  }
}
</style>
