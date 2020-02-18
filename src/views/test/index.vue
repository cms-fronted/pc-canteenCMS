<template>
  <div class="ts">
    <el-tree
      ref="tree"
      :data="result"
      show-checkbox
      node-key="id"
      default-expand-all
      highlight-current
      :props="defaultProps"
      :default-checked-keys="defaultChecked"
      :render-content="renderContent"
      class="treenode"
    ></el-tree>
    <el-button @click="getNodeChecked">保存</el-button>
  </div>
</template>

<script>
import { treeToArr } from "@/utils/flatternArr";
import res from "./res";
export default {
  name: "test",
  data() {
    return {
      result: res.data,
      defaultProps: {
        children: "items",
        label: "name"
      },
      allModules: treeToArr(res.data),
      defaultChecked: [],
      haveModules: []
    };
  },
  created() {
    this.allModules.forEach(element => {
      if (element.have === 1) {
        this.haveModules.push(element.id);
      }
      if (!element.items) {
        if (element.have === 1) {
          this.defaultChecked.push(element.id);
        }
      }
    });
    console.log(this.result);
  },
  mounted() {
    console.log(this.$refs.tree);
  },
  methods: {
    renderContent(h, { node, data, store }) {
      let type = node.data.type === 1 ? "PC端" : "微信端";
      return (
        <span class="custom-tree-node">
          <span>
            {type}——>{node.data.name}
          </span>
        </span>
      );
    },
    getNodeChecked() {
      //当前选中半节点
      let halfCheckedNode = this.$refs.tree
        .getHalfCheckedNodes()
        .map(item => item.id);
      //当前选中节点
      let checkedNode = this.$refs.tree.getCheckedNodes().map(item => item.id);
      let nowChecked = [...halfCheckedNode, ...checkedNode];
      console.log("当前选中节点---", nowChecked);
      console.log("原有节点----", this.haveModules);
      // 遍历当前选中的节点id， 如果原有的节点找不到此id则为新增
      nowChecked.forEach(item => {
        if (this.haveModules.indexOf(item) === -1) {
          console.log("新增的节点id······", item);
        }
      });
      // 遍历原有的节点id， 如果前选中的节点找不到此id则为移除
      this.haveModules.forEach(item => {
        if (nowChecked.indexOf(item) === -1) {
          console.log("删除的节点id````````", item);
        }
      });
    }
  }
};
</script>

<style scoped>
.ts {
  background-color: skyblue;
  position: absolute;
  margin: 50px 0 0 -200px;
  left: 50%;
  text-align: center;
  width: 500px;
  height: 500px;
}
.el-tree {
  margin: 0 auto;
  width: 300px;
  height: 450px;
  overflow-y: scroll;
}
.custom-tree-node {
  font-size: 14px;
  padding-right: 8px;
}
</style>