<template>
  <el-dialog
    :visible.sync="isOpen"
    width="40%"
    center
    title="编辑企业模块"
    @close="closeDialog"
  >
    <el-card class="box-card">
      <div>PC端</div>
      <div v-for="item in pcModules" :key="item.create_time">
        <el-checkbox
          :indeterminate="isIndeterminate[item.id]"
          v-model="checkAll[item.id]"
          @change="checked => handleCheckAllChange(checked, item.id)"
          >{{ item.name }}</el-checkbox
        >
        <el-checkbox-group
          style="padding: 0 20px"
          @change="checked => handleCheckedModulesChange(checked, item.id)"
          v-model="checkedModules[item.id]"
        >
          <el-checkbox
            v-for="items in item.items"
            :label="items.id"
            :key="items.create_time"
            >{{ items.name }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <div>微信端</div>
      <div v-for="item in WXModules" :key="item.create_time">
        <el-checkbox
          :indeterminate="isIndeterminate[item.id]"
          v-model="checkAll[item.id]"
          @change="checked => handleCheckAllChange(checked, item.id)"
          >{{ item.name }}</el-checkbox
        >
        <!-- <el-checkbox-group
          style="padding: 0 20px"
          @change="checked => handleCheckedModulesChange(checked,item.id)"
          v-model="checkedModules[item.id]"
        >
          <el-checkbox
            v-for="items in item.items"
            :label="items.id"
            :key="items.create_time"
          >{{items.name}}</el-checkbox>
        </el-checkbox-group>-->
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
      addModulesIds: [], // 处理勾选后的模块id -- 有父级的父级id也放入  扁平化数组
      checkAll: {},
      modulesCheckbox: {}, //每一个小功能模块下所有的id
      checkedModules: {},
      checkedWXAllModules: {},
      isIndeterminate: {},
      pcModules: [],
      allModules: [],
      WXModules: [],
      defaultModules: []
    };
  },
  watch: {
    visible(val) {
      this.isOpen = val;
    },
    modules(val) {
      this.initData(val);
    }
  },
  methods: {
    initData(val) {
      let allModules = treeToArr(val);
      this.allModules = allModules;
      this.defaultModules = [];
      val.forEach(item => {
        let id = item.id;
        this.checkAll = Object.assign({}, this.checkAll, {
          //有多少个一级模块 就创建多少个  键为模块id，值为false 的数组
          //用于判断一级模块是否被选中， 或一级模块下的所有子模块是否被选中
          [id]: false
        });
        this.isIndeterminate = Object.assign({}, this.isIndeterminate, {
          //有多少个一级模块 就创建多少个  键为模块id，值为false 的数组
          [id]: false
        });
        this.checkedModules = Object.assign({}, this.checkedModules, {
          //有多少个一级模块 就创建多少个  键为模块id，值为false 的数组
          //用于保存 一级模块下 子模块选中 的id， 每一个对象的健值为 一级模块的id
          [id]: []
        });
        this.modulesCheckbox = Object.assign({}, this.modulesCheckbox, {
          //用于保存所有的一级模块下的 所有子模块的id
          [id]: []
        });
      });
      this.pcModules = val.filter(item => item.type === 1);
      this.WXModules = val.filter(item => item.type === 2);
      let PCarr = treeToArr(this.pcModules);
      let WXarr = treeToArr(this.WXModules);
      this.initCheckBox(
        PCarr,
        this.modulesCheckbox,
        this.checkedModules,
        this.checkAll,
        this.isIndeterminate
      );
      this.initCheckBox(
        WXarr,
        this.modulesCheckbox,
        this.checkedWXAllModules,
        this.checkAll,
        this.isIndeterminate
      );
      allModules.forEach(item => {
        if (item.have === 1) {
          this.defaultModules.push(item.id); //保存 该企业已有模块
        }
      });
    },
    initCheckBox(
      arr, //传入 pc端 / 微信 模块数组
      modulesCheckbox, // 一级模块下的对应的所有id
      checkedTypeModules, // 一级模块下 被选中的  id数组 键为对应一级模块的id
      checkAll,
      isIndeterminate
    ) {
      arr.forEach(item => {
        let id = item.id;
        let p_id = item.parent_id;
        if (p_id) {
          modulesCheckbox[p_id].push(id);
        }
        if (item.have === 1 && item.parent_id) {
          //如果 该企业已有该模块 则插入 到 已选中模块数组
          checkedTypeModules[p_id].push(item.id);
          checkAll[p_id] = //判断该一级模块下 的 所有子模块是否被选中
            checkedTypeModules[p_id].length === modulesCheckbox[p_id].length;
        } else if (item.have === 1 && p_id === 0 && !item.items) {
          this.checkAll[id] = true;
        }
        if (p_id) {
          isIndeterminate[p_id] =
            checkedTypeModules[p_id].length > 0 &&
            checkedTypeModules[p_id].length < modulesCheckbox[p_id].length;
        }
      });
    },
    handleCheckAllChange(val, index) {
      this.checkedModules["" + index] = val
        ? this.modulesCheckbox["" + index]
        : [];
      this.isIndeterminate["" + index] = false;
    },
    handleCheckedModulesChange(value, index) {
      let checkedCount = value.length;
      this.checkAll["" + index] =
        checkedCount === this.modulesCheckbox["" + index].length;
      this.isIndeterminate["" + index] =
        checkedCount > 0 &&
        checkedCount < this.modulesCheckbox["" + index].length;
    },
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    handleData() {
      //处理checkbox数据
      let checked = []; //初始化  子模块选中数组
      let modulesChecked = []; //初始化  选中数组
      let defaultModules = this.defaultModules; //已有模块
      let _add = []; // 初始化 增加模块的id 数组
      let _cancel = []; // 初始化  取消模块的id数组
      let checkAll = this.checkAll;
      let checkedModules = this.checkedModules;
      for (let [key, val] of Object.entries(checkedModules)) {
        checked.push(Array.from(val)); // 子模块插入 所有大模块下已选中的id数组
      }
      checked = Array.from(new Set(checked.flat(Infinity))); //扁平化子模块数组
      modulesChecked = [...checked]; //复制数组
      checked.forEach(id => {
        this.allModules.filter(item => {
          if (item.id === id) {
            modulesChecked.push(item.parent_id); //处理父级模块 ， 如果选中的 模块有父级 则插入父级id
          }
        });
      });
      for (let [key, val] of Object.entries(checkAll)) {
        if (val) {
          modulesChecked.push(Number(key)); //处理一级模块，如果 一级模块且无子模块的选项被选中 ，则插入一级模块的id，id为key
        }
      }
      modulesChecked = Array.from(new Set(modulesChecked)); //去重
      //如果 没有模块 ，则不存在 模块被取消的情况
      if (defaultModules.length) {
        defaultModules.forEach(id => {
          if (modulesChecked.indexOf(id) === -1) {
            //默认模块 每一个id去 当前已选中中匹配，若找不到，则被取消了
            _cancel.push(id);
          }
        });
      }
      modulesChecked.forEach(id => {
        if (defaultModules.indexOf(id) === -1) {
          //当前已选中 的每一个id 去与 默认模块钟的id匹配， 若找不到，则为新增
          _add.push(id);
        }
      });
      _cancel = Array.from(new Set(_cancel)); //去重
      return { _add, _cancel };
    },
    async _edit() {
      let { _add, _cancel } = this.handleData();
      let add_modules = [];
      let formdata = {
        company_id: this.company_id,
        canteen: {
          cancel_modules: ""
        }
      };
      if (_add.length) {
        _add.forEach((id, index) => {
          add_modules.push({
            m_id: id,
            order: index + 1
          });
        });
        formdata.canteen.add_modules = add_modules;
      }
      if (_cancel.length) {
        formdata.canteen.cancel_modules = _cancel.join(",");
      }
      formdata.canteen = JSON.stringify(formdata.canteen);
      const url = "/v1/module/company/update";
      const res = await $axios.post(url, formdata);
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

<style></style>
