<template>
  <el-dialog :visible.sync="isOpen" width="25%" center title="编辑企业模块" @close="closeDialog">
    <el-card class="box-card">
      <div class="ts">
        <el-tree
          ref="tree"
          :data="modules"
          show-checkbox
          node-key="id"
          default-expand-all
          highlight-current
          :props="defaultProps"
          :default-checked-keys="defaultChecked"
          :render-content="renderContent"
          class="treenode"
        ></el-tree>
      </div>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="_edit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import $axios from "@/api/index";
import { treeToArr } from "@/utils/flatternArr";
export default {
  props: ["visible", "modules", "company_id"],
  data() {
    return {
      isOpen: false,
      defaultModules: [],
      defaultProps: {
        children: "items",
        label: "name"
      },
      haveModules: [],
      defaultChecked: []
    };
  },
  watch: {
    visible(val) {
      this.isOpen = val;
    },
    modules: {
      handler(val) {
        this.defaultChecked = [];
        this.haveModules = [];
        this.allModules = treeToArr(val);
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
      }
    }
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
      let add_modules = [],
        cancel_modules = [];
      let halfCheckedNode = this.$refs.tree
        .getHalfCheckedNodes()
        .map(item => item.id);
      //当前选中节点
      let checkedNode = this.$refs.tree.getCheckedNodes().map(item => item.id);
      let nowChecked = [...halfCheckedNode, ...checkedNode];
      // console.log("当前选中节点---", nowChecked);
      // console.log("原有节点----", this.haveModules);
      // 遍历当前选中的节点id， 如果原有的节点找不到此id则为新增
      nowChecked.forEach(item => {
        if (this.haveModules.indexOf(item) === -1) {
          // console.log("新增的节点id······", item);
          add_modules.push({ m_id: item, order: "" });
        }
      });
      // 遍历原有的节点id， 如果前选中的节点找不到此id则为移除
      this.haveModules.forEach(item => {
        if (nowChecked.indexOf(item) === -1) {
          // console.log("删除的节点id````````", item);
          cancel_modules.push(item);
        }
      });
      console.log("新增模块id········", add_modules);
      console.log("取消模块id········", cancel_modules);
      let canteen = {
        add_modules,
        cancel_modules: cancel_modules.toString()
      };
      let data = {
        company_id: this.company_id,
        canteen: JSON.stringify(canteen)
      };
      return data;
    },
    closeDialog() {
      this.defaultChecked = [];
      this.haveModules = [];
      this.$emit("closeDialog", false);
    },

    async _edit() {
      let data = this.getNodeChecked();
      const url = "https://tonglingok.com/canteen/api/v1/module/company/update";
      const res = await $axios.post(url, data);
      if (res.msg === "ok") {
        this.$message.success("修改成功");
        this.closeDialog();
      } else {
        this.$message.error("修改失败");
      }
    }
  }
};
</script>

<style scoped>
.box-card {
  text-align: center;
}
.el-tree {
  height: 450px;
  overflow-y: scroll;
}
.custom-tree-node {
  font-size: 14px;
  padding-right: 8px;
}
</style>
