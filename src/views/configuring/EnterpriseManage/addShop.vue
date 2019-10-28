<template>
  <div>
    <el-dialog :visible.sync="isOpen" width="90%" @close="closeDialog" :title="dialogTitle">
      <el-dialog
        :visible.sync="addProductVisible"
        width="40%"
        @close="addProductVisible = false"
        append-to-body
        title="新增硬件"
      >
        <el-form ref="productForm" :model="productForm" label-width="80px">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="productForm.name"></el-input>
          </el-form-item>
          <el-form-item label="设备号" prop="code">
            <el-input v-model="productForm.code"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="number">
            <el-input v-model="productForm.number"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input v-model="productForm.pwd"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addProductVisible = false">取 消</el-button>
          <el-button type="primary" @click="_addProduct">确 定</el-button>
        </div>
      </el-dialog>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-card class="box-card">
            <div>PC端</div>
            <div style="margin: 15px 0;" v-for="(items, index) in modules" :key="items.create_time">
              <el-checkbox
                :indeterminate="isIndeterminate[index]"
                v-model="checkAll[index]"
                @change="checked => handleCheckAllChange(checked,index)"
              >{{items.name}}</el-checkbox>
              <el-checkbox-group
                v-model="checkedModules[index]"
                @change="val => handleCheckedModulesChange(val,index)"
              >
                <el-checkbox
                  v-for="items in items.items"
                  :label="items.id"
                  :key="items.id"
                >{{items.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card body-style="paddingBottom: 5px">
            <div slot="header" class="clearfix">
              <span>小卖部</span>
            </div>
            <div>
              <span style="margin-right: 8px">
                小卖部名称
                <el-input v-model="shop_name" size="small" style="width:200px;marginRight:10px"></el-input>
                <el-radio-group v-model="taking_mode">
                  <el-radio :label="1">自取</el-radio>
                  <el-radio :label="2">外卖</el-radio>
                  <el-radio :label="3">全部</el-radio>
                </el-radio-group>
              </span>
              <el-button type="primary" size="small" @click="addShop" v-if="!isEdit">新增小卖部</el-button>
              <el-button type="primary" size="small" @click="editShop" v-else>编辑小卖部</el-button>
            </div>
          </el-card>
          <el-card class="box-card" body-style="paddingBottom: 5px">
            <div slot="header" class="clearfix">
              <span>硬件设置</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="addNewProduct"
              >添加硬件</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
export default {
  data() {
    return {
      isOpen: false,
      shop_name: "",
      taking_mode: 1,
      addProductVisible: false,
      checkAll: { system: false, shop: false, canteen: false },
      modulesCheckbox: { system: [], canteen: [], shop: [] }, //每一个功能模块对应的id
      checkedModules: {
        system: [],
        shop: [],
        canteen: []
      },
      productForm: {
        c_id: this.company_id, //toFixed: 换成小卖部id
        name: "",
        code: "",
        number: "",
        pwd: ""
      },
      isIndeterminate: {
        system: false,
        shop: false,
        canteen: false
      },
      modules: [] //系统所有功能模块
    };
  },
  props: ["visible", "company_id", "dialogTitle", "isEdit", "formdata"],
  watch: {
    visible(val) {
      this.isOpen = val;
    }
  },
  created() {
    this.getModules();
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog", false);
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
    getModules() {
      let systemModules = $axios.get("/v1/modules?type=1");
      let canteenModules = $axios.get("/v1/modules?type=2");
      let shopModules = $axios.get("/v1/modules?type=3");
      let modulesCheck = Promise.all([
        systemModules,
        canteenModules,
        shopModules
      ]);
      modulesCheck.then(res => {
        const systemModules = res[0].data[0];
        const canteenModules = res[1].data[0];
        const shopModules = res[2].data[0];
        let arr = [];
        for (let item in systemModules) {
          if (item === "items") {
            systemModules[item].forEach(i =>
              this.modulesCheckbox.system.push(i.id)
            );
          }
        }
        for (let item in canteenModules) {
          if (item === "items") {
            canteenModules[item].forEach(i =>
              this.modulesCheckbox.canteen.push(i.id)
            );
          }
        }
        for (let item in shopModules) {
          if (item === "items") {
            shopModules[item].forEach(i =>
              this.modulesCheckbox.shop.push(i.id)
            );
          }
        }
        this.modules = Object.assign(
          {},
          { system: systemModules },
          { canteen: canteenModules },
          { shop: shopModules }
        );
      });
    },
    //打开添加硬件对话框
    addNewProduct() {
      this.addProductVisible = true;
    },
    //发起添加硬件请求
    _addProduct() {
      let data = this.productForm;
      $axios.post("");
    },
    //发起添加新小卖部请求
    addShop() {
      $axios
        .post("/v1/shop/save", {
          c_id: this.company_id,
          name: this.shop_name,
          taking_mode: this.taking_mode
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    editShop() {
      $axios
        .post("/v1/shop/update", {
          id: this.formdata.id,
          name: this.shop_name,
          taking_mode: this.taking_mode
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
.clearfix {
  text-align: center;
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