<template>
  <div class="sideBar" id="domSideBar">
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        background-color="white"
        text-color="#000"
        active-text-color="rgb(79, 148, 212)"
        mode="vertical"
        :collapse-transition="false"
        :collapse="opened"
        :unique-opened="true"
      >
        <sidebar-item
          v-for="item in routes"
          :key="item.path"
          :item="item"
          :basePath="item.path"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from "./SideBarItem";
import { mapGetters } from "vuex";
export default {
  components: { SidebarItem },
  computed: {
    // routes() {
    //   return this.$router.options.routes;
    // },
    ...mapGetters(["opened", "routes"]),
    // booleanOpen() {
    //   return this.opened === 'true' ? true : false
    // },
    activeMenu() {
      return this.$route.path;
    }
  }
};
</script>
