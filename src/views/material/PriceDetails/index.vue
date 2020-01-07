<template>
  <div class="details">
    <div class="nav-title">材料价格明细</div>
    <el-divider />
    <div class="main">
      <div class="main-header">
        <span class="content-header" v-if="companiesVisible">公司：</span>
        <el-select
          v-model="company_id"
          placeholder="请选择"
          style="width:150px"
          filterable
          @change="fetchCanteenList(company_id)"
          v-if="companiesVisible"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <span class="content-header">消费地点：</span>
        <el-select
          v-model="canteen_id"
          placeholder="请选择"
          style="width:150px"
        >
          <el-option
            v-for="item in canteenList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          :clearable="true"
          v-model="keyword"
          style="width:180px;margin: 0 15px;"
        />
        <el-button type="primary" plain @click="fetchTableList">查询</el-button>
        <el-button type="primary" @click="deriveData">导出</el-button>
        <el-upload
          class="upload-excel"
          ref="upload"
          :limit="limit"
          :headers="header"
          :show-file-list="false"
          accept=".xls, .xlsx"
          action="http://canteen.tonglingok.com/api/v1/material/upload"
          :on-success="handleSuccess"
          :data="{ c_id: canteen_id }"
          name="materials"
        >
          <el-button type="primary" style="margin-left:10px"
            >批量导入</el-button
          >
        </el-upload>
        <el-button
          type="primary"
          @click="handleClick({ c_id: canteen_id }, '_add', '新增材料')"
          style="margin-left:10px"
          >添加</el-button
        >
      </div>
      <!-- 共有{{total}}条记录 -->
      <div class="total" v-show="total > 0">
        <span>
          共有
          <strong>{{ total }}</strong> 条记录
        </span>
      </div>
      <div class="main-content">
        <el-table style="width:100%; font-size:14px" :data="tableData" border>
          <el-table-column prop="id" label="序号" width="200px" />
          <el-table-column prop="name" label="材料名称" />
          <el-table-column label="单价/元">
            <template slot-scope="scope">{{ scope.row.price }}元/kg</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleClick(scope.row, '_edit', '编辑材料')"
                >编辑</el-button
              >
              <el-button size="mini" type="danger" @click="_delete(scope.row)"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 10"
          :total="total"
          :currentPage="current_page"
          @pagination="getList"
        />
      </div>
    </div>
    <handle-dialog
      :visible="visible"
      ref="materialDialog"
      :type="editType"
      :editFormdata="editFormdata"
      :title="dialogTitle"
      @close="closeDialog"
      @confirm="confirmUpdate"
    />
  </div>
</template>

<script>
import HandleDialog from "./dialog";
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import store from "@/store";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";

export default {
  data() {
    return {
      header: {
        token: store.getters.token
      },
      grade: store.getters.grade,
      company_id: "",
      companyList: [],
      canteen_id: "",
      canteenList: [],
      tableData: [],
      keyword: "",
      editType: "",
      dialogTitle: "",
      visible: false,
      editFormdata: {},
      result: [],
      total: 0,
      page: 1,
      limit: 1,
      current_page: 1
    };
  },
  async created() {
    if (this.companiesVisible) {
      await this.fetchCompanyList();
      await this.fetchTableList(1);
    } else {
      await this.fetchCanteenList(0);
      await this.fetchTableList(1);
    }
  },
  computed: {
    companiesVisible() {
      return this.grade !== 3;
    }
  },
  methods: {
    sendMessage(msg) {
      if (msg === "ok") {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      } else {
        this.$message({
          type: "info",
          message: "操作失败"
        });
      }
    },
    async fetchCompanyList() {
      await $axios
        .get("http://canteen.tonglingok.com/api/v1/admin/companies")
        .then(res => {
          this.companyList = getAllOptions(flatten(res.data));
          this.company_id = this.companyList[0].id;
          this.canteenList.unshift({ id: "", name: "全部" });
        })
        .catch(error => console.log(error));
    },
    async fetchCanteenList(id) {
      this.canteen_id = "";
      if (this.companiesVisible) {
        if (typeof id === "string" && id.indexOf(",")) {
          this.canteenList.unshift({ id: "", name: "全部" });
        } else {
          await $axios
            .get(
              `http://canteen.tonglingok.com/api/v1/canteens?company_id=${id}`
            )
            .then(res => {
              this.canteenList = getAllOptions(flatten(res.data));
              this.canteen_id = this.canteenList[0].id;
            })
            .catch(err => console.log(err));
        }
      } else {
        await $axios
          .get("http://canteen.tonglingok.com/api/v1/managerCanteens")
          .then(res => {
            this.canteenList = Array.from(res.data);
            this.canteen_id = this.canteenList[0].id;
          })
          .catch(err => console.log(err));
      }
    },
    async fetchTableList(page) {
      page = Number(page) || 1;
      await $axios
        .get(
          `http://canteen.tonglingok.com/api/v1/materials?page=${page}&size=10&key=${this.keyword}&canteen_ids=${this.canteen_id}&company_ids=${this.company_id}`
        )
        .then(res => {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.current_page = res.data.current_page;
        })
        .catch(error => console.log(error));
    },
    handleClick(row = {}, type, title) {
      this.visible = true;
      this.dialogTitle = title;
      this.editType = type;
      Object.assign(this.editFormdata, {}, row);
    },
    _delete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .post("http://canteen.tonglingok.com/api/v1/material/handel", {
            id: row.id
          })
          .then(res => {
            this.fetchTableList();
            if (res.data.msg == "ok") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message({
                type: "info",
                message: "操作失败"
              });
            }
          })
          .catch(err => console.log(err));
      });
    },
    async getList(val) {
      this.page = val;
      await this.fetchTableList(val);
    },
    closeDialog(val) {
      this.visible = val;
      this.editFormdata = {};
    },
    async deriveData() {
      await $axios
        .get(
          `http://canteen.tonglingok.com/api/v1/material/export?key=${this.keyword}&canteen_ids=${this.canteen_id}&company_ids=${this.company_id}`
        )
        .then(res => {
          if (this.tableData.length > 0) {
            let aTag = document.createElement("a");
            aTag.download = "材料价格明细";
            aTag.href = res.data.url;
            aTag.click();
          }
        })
        .catch(error => console.log(err));
    },
    async confirmUpdate(val) {
      if (val === "ok") {
        await this.fetchTableList(this.current_page);
      }
    },
    handleSuccess(res, file, fileList) {
      this.sendMessage(res.msg);
      this.fetchTableList(this.current_page);
    }
  },
  components: {
    HandleDialog,
    Pagination
  }
};
</script>

<style lang="scss" scoped>
.main {
  .main-content {
    .el-table {
      th,
      td {
        text-align: center;
      }
    }
  }
  .upload-excel {
    display: inline-block;
  }
  .total {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
