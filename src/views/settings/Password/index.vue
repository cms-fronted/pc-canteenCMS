<template>
  <div class="password">
    <div class="nav-title">更改密码</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-content">
        <el-card style="width:30%;">
          <el-form
            label-position="left"
            :model="passwordForm"
            ref="passwordForm"
            label-width="60px"
          >
            <el-form-item label="旧密码" prop="old">
              <el-input
                v-model="passwordForm.oldPassword"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new">
              <el-input
                v-model="passwordForm.newPassword"
                show-password
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="btn">
            <el-button type="primary" :disabled="isDisabled" @click="modifyPsw"
              >确认</el-button
            >
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
export default {
  data() {
    return {
      passwordForm: {
        oldPassword: "",
        newPassword: ""
      },
      isDisabled: true
    };
  },
  watch: {
    isAble(val) {
      this.isDisabled = !val;
    }
  },
  computed: {
    isAble() {
      return this.passwordForm.oldPassword && this.passwordForm.newPassword;
    }
  },
  methods: {
    async modifyPsw() {
      await $axios
        .post("/v1/role/passwd/update", this.passwordForm)
        .then(res => {
          if (res.msg === "ok") {
            this.$message.success("密码修改成功");
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
.password {
  .btn {
    text-align: center;
  }
}
</style>
