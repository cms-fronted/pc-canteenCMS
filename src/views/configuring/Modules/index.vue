<template>
  <div class="modules">
    <div class="nav-title">模块管理</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-button type="primary" @click="changeDefault">
          {{ changeDefaultStatus ? "完成默认设置" : "更改默认设置" }}
        </el-button>
        <el-button type="primary" @click="openModuleDialog">增加模块</el-button>
        <el-button type="primary">模块设置</el-button>
        <!-- <el-button type="primary">删除模块</el-button> -->
      </div>
      <div class="main-content">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ title }}</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="modules-tree-container">
                <div class="block">
                  <p>饭堂功能模块</p>
                  <el-tree
                    ref="canteenTree"
                    :data="canteenModules"
                    node-key="id"
                    :props="defaultProps"
                    :show-checkbox="changeDefaultStatus"
                    @check-change="
                      (obj, checked, childrenChecked) =>
                        checkChange(obj, checked, childrenChecked, 2)
                    "
                    default-expand-all
                  >
                    <span class="modules-tree-node" slot-scope="{ node, data }">
                      <span>
                        {{ data.type === 1 ? "PC端" : "移动端" }}——{{
                          node.label
                        }}
                      </span>
                      <span class="btns-text">
                        <el-button
                          type="text"
                          size="mini"
                          @click="() => openEditModuleDialog(data)"
                          >编辑</el-button
                        >
                        <el-button
                          type="text"
                          size="mini"
                          @click="() => openModuleDialog(node, data)"
                          v-if="data.type === 1"
                          >新增</el-button
                        >
                      </span>
                    </span>
                  </el-tree>
                </div>
              </div>
            </el-col>
            <el-col :span="16">
              <el-table :data="modulesData" border>
                <el-table-column label="模块名称" prop="name"></el-table-column>
                <el-table-column label="模块类型">
                  <template slot-scope="scoped">
                    <span>{{ scoped.row.type === 1 ? "PC端" : "移动端" }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否默认">
                  <template slot-scope="scoped">
                    <span>{{
                      scoped.row.default === 1 ? "默认" : "非默认"
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scoped">
                    <span>{{ scoped.row.state === 1 ? "启用" : "停用" }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scoped">
                    <el-button
                      size="small"
                      @click="changeModulesState(scoped.row)"
                      >{{ scoped.row.state === 1 ? "停用" : "启用" }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
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
      <el-form
        :model="modulesForm"
        ref="modulesForm"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="功能类型" prop="system" v-if="false">
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
          <el-radio-group v-model="modulesForm.type" :disabled="typeDisabled">
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
        <el-button type="primary" @click="submitEditModulesForm"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import { flatten, treeToArr } from "@/utils/flatternArr";
export default {
  data() {
    return {
      title: "默认设置模块",
      systemType: 2,
      noParentId: true,
      typeDisabled: false,
      modulesDialogTitle: "新增模块",
      changeDefaultStatus: false,
      modulesVisible: false,
      editModuleVisible: false,
      modulesBelong: "",
      modulesForm: {
        name: "",
        url: "",
        icon: "",
        type: 1,
        default: 1,
        parent_id: ""
      },
      editModuleForm: {},
      systemModules: [],
      s_modules: [],
      canteenModules: [],
      c_modules: [],
      modulesData: [],
      shopModules: [],
      p_modules: [],
      defaultProps: {
        label: "name",
        children: "items"
      },
      timer: null
    };
  },
  created() {
    this.renderModules();
  },
  watch: {
    changeDefaultStatus(val) {
      this.title = !val ? "默认设置模块" : "更改默认模块";
    }
  },
  methods: {
    openModuleDialog(node, data, type) {
      let dataForm = data || {};
      if (dataForm.id) {
        this.modulesForm.parent_id = data.id;
        this.modulesForm.type = dataForm.type;
        this.typeDisabled = true;
      } else {
        this.modulesForm.parent_id = 0;
        this.typeDisabled = false;
      }
      this.modulesVisible = true;
    },
    closeModuleDialog() {
      this.modulesVisible = false;
      this.systemType = 1;
      this.$refs.modulesForm.resetFields();
    },
    openEditModuleDialog(data) {
      this.editModuleVisible = true;
      this.editModuleForm = Object.assign({}, { name: data.name, id: data.id });
    },
    closeEditModuleDialog() {
      this.editModuleVisible = false;
      this.editModuleForm = {};
    },
    async checkChange(obj, checked, childrenChecked, type) {
      let form = {};
      let canChange = [];
      let defaultType = checked ? 1 : 2;
      if (obj.items) {
        obj.items.forEach(item => {
          if (item.default === 1) {
            defaultType = 1;
          }
        });
      }
      form = Object.assign(
        {},
        {
          type: type,
          modules: [{ id: obj.id, default: defaultType }]
        }
      );
      form.modules = JSON.stringify(form.modules);
      let res = await $axios.post(
        "http://canteen.tonglingok.com/api/v1/module/default/handel",
        form
      );
      if (res.msg === "ok") {
        if (!obj.items) {
          this.timer = setTimeout(() => {
            this.$message.success("修改成功");
          }, 300);
        }
      }
    },
    changeDefault() {
      this.changeDefaultStatus = !this.changeDefaultStatus;
      if (!this.changeDefaultStatus) {
        this.renderModules();
      }
    },
    async submitModulesForm() {
      let type = this.systemType;
      const url =
        "http://canteen.tonglingok.com/api/v1/module/system/canteen/save";
      let res = await $axios.post(url, this.modulesForm);
      if (res.msg === "ok") {
        this.closeModuleDialog();
        this.renderModules();
        this.$message.success("模块添加成功");
      }
    },
    async submitEditModulesForm() {
      let res = await $axios.post(
        "http://canteen.tonglingok.com/api/v1/module/update",
        this.editModuleForm
      );
      if (res.msg === "ok") {
        this.closeEditModuleDialog();
        this.$message.success("修改成功");
        this.renderModules();
      }
    },
    async renderModules() {
      try {
        const res = await $axios.get(
          "http://canteen.tonglingok.com/api/v1/modules?type=2"
        );
        if (res.msg === "ok") {
          this.canteenModules = Array.from(res.data);
          this.modulesData = treeToArr(res.data);
          this.c_modules = flatten(res.data);
          this.handleModuleData(this.c_modules, "canteenTree");
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleModuleData(data, treeRef) {
      let checkKey = [];
      let index = "";
      data.forEach(item => {
        if (item.default == 1 && item.p_id === 0) {
          checkKey.push(item.id);
        }
        if (item.default == 1 && item.p_id !== 0) {
          checkKey.push(item.id);
        }
        if (item.default === 2 && item.p_id !== 0) {
          if (checkKey.indexOf(item.p_id) !== -1) {
            checkKey.splice(checkKey.indexOf(item.p_id), 1);
          }
        }
      });
      this.$refs[treeRef].setCheckedKeys(checkKey);
    },
    async changeModulesState(row) {
      let data = {};
      data.id = row.id;
      data.state = row.state === 1 ? 2 : 1;
      const res = await $axios.post(
        "http://canteen.tonglingok.com/api/v1/module/system/handel",
        data
      );
      if (res.msg === "ok") {
        this.$message.success("操作成功!");
        this.renderModules();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modules-tree-container {
  width: 100%;
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
