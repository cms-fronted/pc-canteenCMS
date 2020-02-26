<template>
  <div class="enterprise-manage">
    <div class="nav-title">企业管理</div>
    <el-divider />
    <div class="main">
      <div class="main-header">
        <el-button
          type="primary"
          v-if="grade != 3"
          @click="() => addEnterprise({}, {})"
        >{{ globalCid ? "新增下属企业" : "新增一级企业" }}</el-button>
      </div>
      <div class="main-content">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-card>
              <div>
                <el-input v-model="filterText" placeholder="关键字查询" size="small" />
                <el-tree
                  :data="companyList"
                  :props="defaultProps"
                  node-key="id"
                  ref="tree"
                  :filter-node-method="filterNode"
                >
                  <span class="enterprise-tree-node" slot-scope="{ node, data }">
                    <span>
                      <el-button
                        type="text"
                        size="mini"
                        @click="handleNodeClick(data)"
                      >{{ node.label }}</el-button>
                    </span>
                    <span class="btns-text">
                      <el-button
                        v-if="node.level != 1 || grade == 1"
                        type="text"
                        size="mini"
                        @click="() => editEnterpriseDialog(node, data)"
                      >编辑</el-button>

                      <el-button type="text" size="mini" @click="() => addEnterprise(node, data)">新增</el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card>
              <div slot="header" class="clearfix">
                <span>{{ this.parent.name || "云饭堂" }}</span>
              </div>
              <div class="card-content">
                <el-button @click="addCanteen" :disabled="!company_id">新增饭堂</el-button>
                <el-button :disabled="!company_id" @click="addShop">新增小卖部</el-button>
                <el-button :disabled="!company_id" @click="addPayConfig">新增支付信息</el-button>
                <el-button :disabled="!company_id" @click="getQrCode">查看非企业人员二维码信息</el-button>

                <el-table style="width:50%;margin: 0 auto" size="mini" :data="canteensLocData">
                  <div slot="empty">暂无饭堂</div>
                  <el-table-column label="消费地点" prop="name" />
                  <el-table-column label="操作">
                    <template slot-scope="scoped">
                      <span>
                        <el-button type="text" size="mini" @click="_editCanteen(scoped.row)">操作</el-button>
                        <!-- <el-button type="text" size="mini">删除</el-button> -->
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
                  <el-table-column prop="name" />
                  <el-table-column>
                    <template slot-scope="scoped">
                      <span>
                        <!-- <el-button type="text" size="mini">删除</el-button> -->
                        <el-button type="text" size="mini" @click="_editShop(scoped.row)">操作</el-button>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
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
          <el-input v-model="enterpriseForm.name" />
        </el-form-item>
        <el-form-item label="上级企业">
          <el-input :disabled="true" :value="parent.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_addEnterprise">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible="payConfigVisible" width="40%" title="新增支付方式" @close="closePayConfig">
      <el-form ref="newPayConfig" :model="payConfigForm" label-width="120px">
        <el-form-item label="公众号appId">
          <el-input v-model="payConfigForm.app_id" />
        </el-form-item>
        <el-form-item label="支付商户id">
          <el-input v-model="payConfigForm.mch_id" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_addPayConfig">确 定</el-button>
        <el-button @click="closePayConfig">取 消</el-button>
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
      :modules="modules"
      :editAddressForm="editAddressForm"
      @updateMachineTable="(val, type) => getMachineList(val, type)"
      @updateCanteenList="getComsumptionLoc"
    />
    <add-shop-dialog
      :visible="addShopVisible"
      :dialogTitle="shopDialogTitle"
      @closeDialog="closeShopDialog"
      :company_id="company_id"
      :isEdit="isEdit"
      :formdata="editForm"
      :machineList="machineList"
      @updateCanteenList="getComsumptionLoc"
      @updateMachineTable="(val, type) => getMachineList(val, type)"
    />
    <edit-enterprise-dialog
      :visible="editEnterpriseDialogVisible"
      :modules="modules"
      :company_id="company_id"
      @closeDialog="closeEditEnterprise"
    />
    <qrcode-dialog :visible="qrcodeDialogVisible" @closeDialog="closeQrCode" :url="qrcodeUrl" />
  </div>
</template>

<script>
import $axios from "@/api/index";
import AddCanteenDialog from "./dialog";
import QrcodeDialog from "./qrcode.vue";
import AddShopDialog from "./addShop";
import { Loading } from "element-ui";
import EditEnterpriseDialog from "./editEnterprise";
export default {
  components: {
    AddCanteenDialog,
    AddShopDialog,
    EditEnterpriseDialog,
    QrcodeDialog
  },
  data() {
    return {
      loading: null,
      globalCid: localStorage.getItem("company_id"), //全局企业id
      grade: localStorage.getItem("grade"),
      editEnterpriseDialogVisible: false,
      qrcodeDialogVisible: false,
      addCanteenVisible: false,
      addEnterpriseVisible: false,
      addShopVisible: false,
      payConfigVisible: false,
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
      modules: {},
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
      },
      editAddressForm: [],
      payConfigForm: {},
      qrcodeUrl: ""
    };
  },
  async created() {
    await this.fetchCompanyList();
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
    async getComsumptionLoc(id) {
      this.shopLocData = [];
      const res = await $axios.get(
        `/api/v1/company/consumptionLocation?company_id=${id}`
      );
      if (res.msg == "ok") {
        this.canteensLocData = Array.from(res.data.canteen);
        if (res.data.shop) {
          this.shopLocData.push(res.data.shop);
        }
      }
    },
    async fetchCompanyList() {
      const res = await $axios.get("/api/v1/admin/companies");
      if (res.msg == "ok") {
        this.companyList = [];
        if (res.data instanceof Object) {
          this.companyList.push(res.data);
        }
        if (res.data instanceof Array) {
          this.companyList = Array.from(res.data);
        }
      }
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
      this.modules = [];
    },
    addShop() {
      this.shopDialogTitle = "新增小卖部";
      this.addShopVisible = true;
    },
    addPayConfig() {
      this.payConfigVisible = true;
    },
    closePayConfig() {
      this.payConfigVisible = false;
      this.payConfigForm = {};
    },
    async _addPayConfig() {
      let formdata = Object.assign({}, this.payConfigForm, {
        company_id: this.company_id
      });
      const res = await $axios.post("/api/v1/company/wxConfig/save");
      if (res.msg === "ok") {
        this.$message.success("新增支付信息成功");
        this.closePayConfig();
      } else {
        this.$message.error("请填写正确信息");
        this.closePayConfig();
      }
    },
    closeShopDialog(val) {
      this.isEdit = val;
      this.addShopVisible = val;
    },
    addEnterprise(node, data) {
      let arr = Object.keys(data);
      if (arr.length) {
        this.parent.name = data.name;
        this.parent.id = data.id;
      } else {
        this.parent.name = "";
        this.parent.id = localStorage.getItem("company_id");
      }
      this.addEnterpriseVisible = true;
    },
    async editEnterpriseDialog(node, data) {
      let id = data.id;
      this.company_id = id;
      const modulesRes = await this.getSystemModules(id);
      if (modulesRes.msg === "ok") {
        this.modules = Array.from(modulesRes.data);
      }
      this.editEnterpriseDialogVisible = true;
    },
    closeEditEnterprise(val) {
      this.editEnterpriseDialogVisible = val;
      this.modules = [];
    },
    async _addEnterprise() {
      this.loading = Loading.service({ text: "拼命加载中..." });
      const res = await $axios.post("/api/v1/company/save", {
        parent_id: this.parent.id || 0,
        name: this.enterpriseForm.name
      });
      if (res.msg == "ok") {
        this.addEnterpriseVisible = false;
        await this.fetchCompanyList();
        this.$message.success(
          `添加成功，企业账号为:${res.data.company_id}-admin`
        );
        this.$refs.newEnterprise.resetFields();
        this.parent.id = "";
        this.parent_name = "";
      }

      this.loading.close();
    },
    async getCanteenConfig(id) {
      let data = null;
      await $axios
        .get(`/api/v1/canteen/configuration?c_id=${id}`)
        .then(res => {
          data = res;
        })
        .catch(err => console.log(err));
      return data;
    },
    async getSystemModules(id) {
      const res = $axios.get("/api/v1/modules/canteen/withSystem", {
        c_id: id
      });
      return res;
    },
    async _editCanteen(val) {
      let id = val.id; //饭堂id
      this.isEdit = true;
      this.editForm = val;
      this.canteenDialogTitle = "编辑饭堂";
      const res = await this.getCanteenConfig(id);
      if (res.msg == "ok") {
        this.editForm.dinnersList = res.data.dinners;
        this.editAddressForm = res.data.address;
        this.editDinnersList = Array.from(res.data.dinners);
        this.editAccount = { ...res.data.account };
        this.addCanteenVisible = true;
      }
      await this.getMachineList(val, "canteen");
    },
    async _editShop(val) {
      this.editForm = val;
      this.isEdit = true;
      this.shopDialogTitle = "编辑小卖部";
      await this.getMachineList(val, "shop");
      this.addShopVisible = true;
    },
    async getMachineList(val, type) {
      let data;
      await $axios
        .get("/api/v1/machines", {
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
    },
    async getQrCode() {
      const res = await $axios.get("/api/v1/company/qrcode", {
        company_id: this.company_id
      });
      if (res.msg === "ok") {
        this.qrcodeUrl = res.data.url;
        this.qrcodeDialogVisible = true;
      }
    },
    closeQrCode() {
      this.qrcodeDialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.enterprise-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
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
