<template>
  <div class="modules">
    <div class="nav-title">模块管理</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-button type="primary">更改默认设置</el-button>
        <el-button type="primary" @click="openModuleDialog">增加模块</el-button>
        <el-button type="primary">删除模块</el-button>
        <el-button type="primary">编辑模块</el-button>
      </div>
      <div class="main-content">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{title}}</span>
          </div>
          <div class="modules-tree-container">
            <div class="block" style="borderRight:1px solid #eff2f6">
              <p>系统功能模块</p>
              <el-tree
                :data="shopModules"
                :props="defaultProps"
                show-checkbox
                @check-change="checkChange"
                default-expand-all
              >
                <span class="modules-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span class="btns-text">
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => openEditModuleDialog(data,1)"
                    >编辑</el-button>
                    <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
                  </span>
                </span>
              </el-tree>
            </div>
            <div class="block" style="borderRight:1px solid #eff2f6">
              <p>饭堂功能模块</p>
              <el-tree
                :data="canteenModules"
                :props="defaultProps"
                show-checkbox
                @check-change="checkChange"
                default-expand-all
              >
                <span class="modules-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span class="btns-text">
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => openEditModuleDialog(data,2)"
                    >编辑</el-button>
                    <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
                  </span>
                </span>
              </el-tree>
            </div>
            <div class="block" style="borderRight:1px solid #eff2f6">
              <p>小卖部功能模块</p>
              <el-tree
                :data="shopModules"
                :props="defaultProps"
                show-checkbox
                @check-change="checkChange"
                default-expand-all
              >
                <span class="modules-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span class="btns-text">
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => openEditModuleDialog(data,3)"
                    >编辑</el-button>
                    <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
      :visible.sync="modulesVisible"
      :title="modulesDialogTitle"
      center
      width="30%"
      @close="closeModuleDialog"
    >
      <el-form :model="modulesForm" ref="modulesForm" label-width="80px" label-position="right">
        <el-form-item label="功能类型" prop="system">
          <el-radio-group v-model="systemType">
            <el-radio :label="1">系统功能</el-radio>
            <el-radio :label="2">饭堂</el-radio>
            <el-radio :label="3">小卖部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="modulesForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模块路由" prop="url">
          <el-input v-model="modulesForm.url"></el-input>
        </el-form-item>
        <el-form-item label="icon地址" prop="icon">
          <el-input v-model="modulesForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="模块类型" prop="type">
          <el-radio-group v-model="modulesForm.type">
            <el-radio :label="1">pc端</el-radio>
            <el-radio :label="2">手机端</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="默认模块" prop="default">
          <el-radio-group v-model="modulesForm.default">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModuleDialog">取 消</el-button>
        <el-button type="primary" @click="submitModulesForm">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="editModuleVisible"
      title="编辑模块"
      center
      width="20%"
      @close="closeEditModuleDialog"
    >
      <el-form :model="editModuleForm" ref="editModuleForm">
        <el-form-item label="名称" label-width="40px">
          <el-input v-model="editModuleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditModuleDialog">取 消</el-button>
        <el-button type="primary" @click="submitEditModulesForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
export default {
  data() {
    return {
      title: "默认模块",
      systemType: 1,
      modulesDialogTitle: "新增模块",
      modulesVisible: false,
      editModuleVisible: false,
      modulesBelong: "",
      modulesForm: {
        name: "",
        url: "",
        icon: "",
        type: 1,
        default: 1,
        parent_id: 0
      },
      editModuleForm: {},
      systemModules: [],
      canteenModules: [],
      shopModules: [],
      defaultProps: {
        label: "name",
        children: "items"
      }
    };
  },
  created() {
    this.renderModules();
  },
  methods: {
    openModuleDialog() {
      this.modulesVisible = true;
    },
    closeModuleDialog() {
      this.modulesVisible = false;
      this.systemType = 1;
      this.$refs.modulesForm.resetFields();
    },
    openEditModuleDialog(data, type) {
      this.editModuleVisible = true;
      this.editModuleForm = Object.assign(
        {},
        { name: data.name, id: data.id, type: type }
      );
    },
    closeEditModuleDialog() {
      this.editModuleVisible = false;
      this.editModuleForm = {};
    },
    checkChange(obj, checked, childrenChecked) {
      console.log(obj);
      console.log(checked);
      console.log(childrenChecked);
    },
    async submitModulesForm() {
      let url = "";
      let type = this.systemType;
      switch (type) {
        case 1:
          url = "/v1/module/system/save";
          break;
        case 2:
          url = "/v1/module/system/canteen/save";
          break;
        case 3:
          url = "/v1/module/system/shop/save";
          break;
      }
      let res = await $axios.post(url, this.modulesForm);
      if (res.msg === "ok") {
        this.closeModuleDialog();
        this.getModules();
        this.$message.success("模块添加成功");
      }
    },
    async submitEditModulesForm() {
      let res = await $axios.post("/v1/module/update", this.editModuleForm);
      if (res.msg === "ok") {
        this.closeEditModuleDialog();
        this.$message.success("修改成功");
        this.renderModules();
      }
    },
    getModules() {
      let systemModules = this.$axios.get("/v1/modules?type=1");
      let canteenModules = this.$axios.get("/v1/modules?type=2");
      let shopModules = this.$axios.get("/v1/modules?type=3");
      let reqList = [];
      reqList.push(systemModules, canteenModules, shopModules);
      return this.$axios.all(reqList).then(
        this.$axios.spread(function(...resList) {
          return resList;
        })
      );
    },
    async renderModules() {
      try {
        let resq = await this.getModules();
        let system = resq[0].data.data;
        let canteen = resq[1].data.data;
        let shop = resq[2].data.data;
        this.systemModules = Array.from(system);
        this.canteenModules = Array.from(canteen);
        this.shopModules = Array.from(shop);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modules-tree-container {
  width: 70%;
  flex: 1;
  display: flex;
  // justify-content: space-between;
  font-size: 18px;
  // padding-right: 8px;
  .modules-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .block {
    flex: 1;
  }
  p {
    text-align: center;
  }
}

.clearfix {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: -20px;
  padding: 10px 20px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
</style>