<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
    </div>
    <div>PC端</div>
    <div v-for="item in pcModules" :key="item.create_time">
      <el-checkbox
        :indeterminate="isIndeterminate[item.id]"
        :disabled="disabled"
        v-model="checkAll[item.id]"
        @change="checked => handleCheckAllChange(checked, item.id)"
        >{{ item.name }}</el-checkbox
      >
      <el-checkbox-group
        style="padding: 0 20px"
        :disabled="disabled"
        @change="checked => handleCheckedModulesChange(checked, item.id)"
        v-model="checkedModules[item.id]"
      >
        <el-checkbox
          :disabled="disabled"
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
        :disabled="disabled"
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
    <div style="textAlign: center" v-if="isShow">
      <el-button @click="confirm" :disabled="isConfirm">确定</el-button>
    </div>
  </el-card>
</template>

<script>
import { treeToArr } from "@/utils/flatternArr";
export default {
  props: ["modules", "isConfirm", "disabled", "isShow"],
  data() {
    return {
      title: "模块明细",
      addModulesIds: [], // 处理勾选后的模块id -- 有父级的父级id也放入  扁平化数组
      checkAll: {},
      modulesCheckbox: {}, //每一个小功能模块下所有的id
      checkedModules: {},
      checkedWXAllModules: {},
      isIndeterminate: {},
      pcModules: [],
      allModules: [],
      WXModules: [],
      defaultModules: [],
      confirmed: false
    };
  },
  watch: {
    modules: {
      handler(val) {
        this.handleModules(val);
      },
      immediate: true
    },
    // isConfirm: {
    //   handler(val) {
    //     this.confirmed = val;
    //   }
    // }
  },
  methods: {
    handleModules(val) {
      let allModules = treeToArr(val);
      this.allModules = allModules;
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
    confirm() {
      this.confirmed = true;
      this.$emit("getModules", this.checkedModules, this.checkAll);
    }
  }
};
</script>

<style lang="scss" scoped>
.clearfix {
  text-align: center;
  font-size: 16px;
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
</style>
