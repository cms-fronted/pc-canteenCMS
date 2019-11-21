<template>
  <div>
    <div class="home">
      <p class="title">主页</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  mounted() {
    this.$store.dispatch("user/_getUserModules").then(res => {
      console.log(res);
    });
  }
};
</script>

<style lang="scss" scoped></style>
