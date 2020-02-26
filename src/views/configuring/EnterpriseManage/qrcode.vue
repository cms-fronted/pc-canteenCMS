<template>
  <el-dialog :visible="visible" width="30%" title="二维码信息" center @close="closeDialog">
    <img width="100%" :src="url" alt />
    <div style="textAlign: center">
        <p>非企业人员可以使用微信扫描该</p>
        <p>二维码进入饭堂消费</p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "QrcodeDialog",
  data() {
    return {
      qrcodeVisible: false
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  watch: {
    visible(val) {
      this.qrcodeVisible = val;
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog", false);
    }
  }
};
</script>

<style>
</style>