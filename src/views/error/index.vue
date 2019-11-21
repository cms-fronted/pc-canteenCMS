<template>
  <div class="page404 noPadding">
    <p class="page404_p0">
      <router-link to="/"><el-button>返回首页</el-button></router-link>
    </p>
  </div>
</template>

<script>
export default {};
</script>
<style scoped lang="scss">
.page404 {
  width: 100%;
  height: 100%;
  text-align: center;
  background: #b5c794 url(../../assets/404img/404.jpg) no-repeat center center !important;
  .page404_p0 {
    width: 200px;
    font-size: 20px;
    color: #fff;
    text-align: center;
    position: absolute;
    left: calc(50% - 100px);
    top: calc(70%);
    // padding: 300px 0 20px 0;
  }
}
</style>
