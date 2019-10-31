<template>
  <div class="enterprise-manage">
    <div class="nav-title">企业管理</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <div class="filter-tree">
          <el-input class="filter-input" v-model="filterText" placeholder="关键字查询"></el-input>
          <el-tree
            :data="companyList"
            :props="defaultProps"
            ref="tree"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
          ></el-tree>
        </div>
        <el-button type="primary" @click="addEnterprise">新增企业</el-button>
        <el-button type="primary">更改名称</el-button>
      </div>
      <div class="main-content">
        <el-card>
          <div slot="header" class="clearfix">
            <span>云饭堂</span>
          </div>
          <div class="card-content">
            <el-button @click="addCanteen" :disabled="!company_id">新增饭堂</el-button>
            <el-button :disabled="!company_id" @click="addShop">新增小卖部</el-button>
            <el-table style="width:50%;margin: 0 auto" size="mini" :data="canteensLocData">
              <div slot="empty">暂无饭堂</div>
              <el-table-column label="消费地点" prop="name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scoped">
                  <span>
                    <el-button type="text" size="mini" @click="_editCanteen(scoped.row)">操作</el-button>
                    <el-button type="text" size="mini">删除</el-button>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              style="width:50%;margin: 0 auto"
              size="mini"
              :data="shopLocData"
              :show-header="false"
            >
              <div slot="empty">暂无小卖部</div>
              <el-table-column prop="name"></el-table-column>
              <el-table-column>
                <template slot-scope="scoped">
                  <span>
                    <el-button type="text" size="mini" @click="_editShop(scoped.row)">操作</el-button>
                    <el-button type="text" size="mini">删除</el-button>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
      :visible.sync="addEnterpriseVisible"
      width="40%"
      title="新增企业"
      @close="addEnterpriseVisible = false"
    >
      <el-form ref="newEnterprise" :model="enterpriseForm" label-width="80px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="enterpriseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上级企业">
          <el-input :disabled="true" :value="parent.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_addEnterprise">确 定</el-button>
      </span>
    </el-dialog>
    <add-canteen-dialog
      @closeAdd="_cancelCanteen"
      :dialogTitle="canteenDialogTitle"
      :visible="addCanteenVisible"
      :company_id="company_id"
      :isEdit="isEdit"
      :formdata="editForm"
      :editDinnerList="editDinnersList"
      :editAccount="editAccount"
      :machineList="machineList"
      @updateMachineTable="(val,type) => getMachineList(val,type)"
      @updateCanteenList="getComsumptionLoc"
    ></add-canteen-dialog>
    <add-shop-dialog
      :visible="addShopVisible"
      :dialogTitle="shopDialogTitle"
      @closeDialog="closeShopDialog"
      :company_id="company_id"
      :isEdit="isEdit"
      :formdata="editForm"
      :machineList="machineList"
      @updateMachineTable="(val,type) => getMachineList(val,type)"
    ></add-shop-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import AddCanteenDialog from "./dialog";
import AddShopDialog from "./addShop";
import { async } from "q";
export default {
  components: {
    AddCanteenDialog,
    AddShopDialog
  },
  data() {
    return {
      addCanteenVisible: false,
      addEnterpriseVisible: false,
      addShopVisible: false,
      canteenDialogTitle: "",
      shopDialogTitle: "",
      editDinnersList: [],
      machineList: [],
      editAccount: {
        type: "",
        clean_type: "",
        clean_day: 1,
        clean_time: "08:00",
        limit_money: 1,
        id: "",
        dining_mode: 1
      },
      companyList: [],
      canteensLocData: [],
      shopLocData: [],
      company_id: "",
      filterText: "",
      isEdit: false,
      parent: {
        id: "",
        name: ""
      },
      defaultProps: {
        children: "items",
        label: "name"
      },
      enterpriseForm: {
        name: ""
      },
      editForm: {
        dinnersList: [],
        account: {}
      }
    };
  },
  created() {
    this.fetchCompanyList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    handleNodeClick(val) {
      let { id, name } = val;
      this.company_id = id;
      this.parent.id = id;
      this.parent.name = name;
      this.getComsumptionLoc(id);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getComsumptionLoc(id) {
      this.shopLocData = [];
      $axios
        .get(`/v1/company/consumptionLocation?company_id=${id}`)
        .then(res => {
          this.canteensLocData = Array.from(res.data.canteen);
          if (res.data.shop) {
            this.shopLocData.push(res.data.shop);
          }
        })
        .catch(err => console.log(err));
    },
    fetchCompanyList() {
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          this.companyList = Array.from(res.data);
        })
        .catch(err => console.log(err));
    },
    addCanteen() {
      this.canteenDialogTitle = "新增饭堂";
      this.isEdit = false;
      this.editForm = {};
      this.addCanteenVisible = true;
    },
    _cancelCanteen(val) {
      this.addCanteenVisible = val;
      this.editDinnersList.length = 0;
      this.editAccount = {};
    },
    addShop() {
      this.shopDialogTitle = "新增小卖部";
      this.addShopVisible = true;
    },
    closeShopDialog(val) {
      this.isEdit = val;
      this.addShopVisible = val;
    },
    addEnterprise() {
      this.addEnterpriseVisible = true;
    },
    _addEnterprise() {
      $axios
        .post("/v1/company/save", {
          parent_id: this.parent.id || 0,
          name: this.enterpriseForm.name
        })
        .then(res => {
          this.fetchCompanyList();
          this.addEnterpriseVisible = false;
          this.$message.success("添加成功");
          this.$refs.newEnterprise.resetFields();
          this.parent.id = "";
          this.parent_name = "";
        })
        .catch(err => console.log(err));
    },
    async getCanteenConfig(id) {
      let data = null;
      await $axios
        .get(`/v1/canteen/configuration?c_id=${id}`)
        .then(res => {
          data = res.data;
        })
        .catch(err => console.log(err));
      return data;
    },
    async getSystemModules(id) {
      const res = $axios.get("/v1/modules/canteen/withSystem", {
        c_id: id
      });
      return res;
    },
    async _editCanteen(val) {
      let id = val.id; //饭堂id
      this.isEdit = true;
      this.editForm = val;
      this.canteenDialogTitle = "编辑饭堂";
      const data = await this.getCanteenConfig(id);
      const modules = await this.getSystemModules(id);
      console.log(modules);
      this.getMachineList(val, "canteen");
      this.editForm.dinnersList = data.dinners;
      this.editDinnersList = Array.from(data.dinners);
      this.editAccount = { ...data.account };
      this.addCanteenVisible = true;
    },
    async _editShop(val) {
      this.editForm = val;
      this.isEdit = true;
      this.shopDialogTitle = "编辑小卖部";
      this.getMachineList(val, "shop");
      this.addShopVisible = true;
    },
    async getMachineList(val, type) {
      let data;
      await $axios
        .get("/v1/machines", {
          belong_id: val.id,
          machine_type: type,
          page: 1,
          size: 10
        })
        .then(res => {
          this.machineList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-tree {
  width: 20%;
  float: left;
  min-height: 550px;

  .filter-input {
    width: 90%;
    padding: 0 10px 18px 10px;
  }
}
.tree::after {
  clear: both;
  content: "";
  display: block;
}
.card-content {
  text-align: center;
}
.clearfix {
  text-align: center;
  font-size: 16px;
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