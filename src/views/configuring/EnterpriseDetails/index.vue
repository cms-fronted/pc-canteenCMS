<template>
  <div>
    <div class="enterprise-details">
      <div class="nav-title">企业明细</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <el-form
            :inline="true"
            ref="queryForm"
            label-position="left"
            :model="queryForm"
          >
            <el-form-item label="公司" prop="name" label-width="80px" v-if="companiesVisible">
              <el-select v-model="queryForm.name">
                <el-option
                  v-for="item in companyOptions"
                  :label="item.name"
                  :key="item.id"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间" prop="create_time" label-width="50px">
              <el-date-picker
                v-model="queryForm.create_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-button type="primary" @click="fetchList">查询</el-button>
          </el-form>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="companyList">
            <el-table-column
              prop="create_time"
              label="创建时间"
              width="200px"
            ></el-table-column>
            <el-table-column label="公司级别" prop="grade">
              <template slot-scope="props">
                <span>{{ props.row.grade | handleGrades }}</span>
              </template>
            </el-table-column>
            <el-table-column label="归属企业">
              <template slot-scope="scoped">
                <span>{{
                  scoped.row.parent_name ? scoped.row.parent_name : "无"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="公司名称">
              <template slot-scope="scoped">
                <el-button
                  type="text"
                  @click="() => openDetailDialog(scoped.row)"
                  >{{ scoped.row.name }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="total"
            @pagination="fetchList"
            :pageSize="size"
            :currentPage="current_page"
          ></pagination>
        </div>
      </div>
    </div>

    <el-dialog
      width="50%"
      :visible.sync="detailDialogVisible"
      @close="closeDetailDialog"
      title="企业明细"
      center
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="lf-col">
            <el-table class="canteen-table" size="mini" :data="canteenList">
              <el-table-column label="饭堂名称">
                <template slot-scope="scoped">
                  <el-button type="text">{{ scoped.row.name }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <p style="padding: 5px 0">
              <el-tag>企业人数：{{ staffs }}人</el-tag>
            </p>
          </div>
        </el-col>
        <el-col :span="18">
          <show-modules :modules="modules" :disabled="true"></show-modules>
          <el-card class="box-card" body-style="paddingBottom: 5px">
            <div slot="header" class="clearfix">
              <span>硬件列表</span>
            </div>
            <el-table :data="machineList" size="mini">
              <el-table-column label="设备类别">
                <template slot-scope="scoped">
                  <span>{{ scoped.row.machine_type | showMachineType }}</span>
                </template>
              </el-table-column>
              <el-table-column label="设备序号" prop="number"></el-table-column>
              <el-table-column label="设备名称" prop="name"></el-table-column>
              <el-table-column label="硬件号" prop="code"></el-table-column>
              <el-table-column label="状态" prop="state">
                <template slot-scope="scoped">
                  <span>{{ scoped.row.state | showState }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scoped">
                  <span>
                    <el-button type="text" @click="_delete(scoped.row)"
                      >删除</el-button
                    >
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              :pageSize="machine_size"
              :currentPage="machine_page"
              @pagination="getCompanyMachine"
              :small="true"
              :total="machine_total"
            ></pagination>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import ShowModules from "@/components/ShowModules";
import Pagination from "@/components/Pagination";
import { flatten } from "@/utils/flatternArr";
import store from "@/store";
export default {
  components: { ShowModules, Pagination },
  data() {
    return {
      grade: store.getters.grade,
      detailDialogVisible: false,
      company_id: "",
      companyOptions: [],
      companyList: [],
      canteenList: [],
      machineList: [],
      modules: [],
      detailForm: {},
      queryForm: {
        name: "",
        created_time: ""
      },
      staffs: 100,
      current_page: 1,
      size: 10,
      total: 10,
      machine_page: 1,
      machine_size: 3,
      machine_total: 10
    };
  },
  filters: {
    handleGrades: function(str) {
      let changeNum = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九"
      ];
      if (str == "") {
        return "";
      } else {
        return `${changeNum[str]}级企业`;
      }
    },
    showState: function(val) {
      return val === 1 ? "正常" : "异常";
    },
    showMachineType: function(val) {
      return val === "canteen" ? "饭堂" : "小卖部";
    }
  },
  created() {
    this.fetchList();
    this.getCompaniesList();
  },
  computed: {
    companiesVisible() {
      return this.grade !== 3;
    },
  },
  methods: {
    async fetchList(page) {
      page = page || 1;
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/companies?page=${page}&size=${this.size}`,
        this.queryForm
      );
      if (res.msg === "ok") {
        this.companyList = Array.from(res.data.data);
      }
    },
    async getCompaniesList() {
      const res = await $axios.get("http://canteen.tonglingok.com/api/v1/admin/companies");
      this.companyOptions = Array.from(flatten(res.data));
    },
    async openDetailDialog(row) {
      this.company_id = row.id;
      let company_id = row.id;
      this.canteenList = Array.from(row.canteen);
      await this.getModules(company_id);
      await this.getCompanyDetail(company_id);
      await this.getCompanyMachine();

      this.detailDialogVisible = true;
    },
    closeDetailDialog() {
      this.detailDialogVisible = false;
    },
    async getCompanyDetail(company_id) {
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/canteens/company?company_id=${company_id}`
      );
      if (res.msg === "ok") {
        this.staffs = res.data.staffs;
      }
      return res;
    },
    async getModules(company_id) {
      const res = await $axios.get("http://canteen.tonglingok.com/api/v1/modules/canteen/withSystem", {
        c_id: company_id
      });
      if (res.msg === "ok") {
        this.modules = Array.from(res.data);
      }
      return res;
    },
    async getCompanyMachine(page) {
      const res = await $axios.get("http://canteen.tonglingok.com/api/v1/machines/company", {
        company_id: this.company_id,
        page: page || 1,
        size: this.machine_size
      });
      if (res.msg === "ok") {
        this.machineList = Array.from(res.data.data);
        this.machine_total = res.data.total;
      }
      return res;
    },
    async _delete(row) {
      let id = row.id;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await $axios.post("http://canteen.tonglingok.com/api/v1/canteen/deleteMachine", { id });
          if (res.msg === "ok") {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            await this.getCompanyMachine(this.company_id);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.lf-col {
  text-align: center;
}
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

// .box-card {
//   width: 100%;
// }
</style>
