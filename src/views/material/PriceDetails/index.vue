<template>
  <div class="details">
    <div class="nav-title">材料价格明细</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <span class="content-header">公司：</span>
        <el-select
          v-model="company_id"
          placeholder="请选择"
          style="width:150px"
          @change="fetchCanteenList(company_id)"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
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
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          :clearable="true"
          v-model="keyword"
          style="width:180px;margin: 0 15px;"
        ></el-input>
        <el-button
          type="primary"
          plain
          style="margin-left:0"
          @click="fetchTableList"
          >查询</el-button
        >
        <el-button type="primary" @click="deriveData">导出</el-button>
        <el-upload
          class="upload-excel"
          ref="upload"
          :limit="limit"
          :headers="header"
          :show-file-list="false"
          accept=".xls,.xlsx"
          action="/v1/material/upload"
          :on-success="handleSuccess"
          :data="{ c_id: canteen_id }"
          name="materials"
        >
          <el-button type="primary">批量导入</el-button>
        </el-upload>
        <el-button
          type="primary"
          @click="handleClick({ c_id: canteen_id }, '_add', '新增材料')"
          >添加</el-button
        >
      </div>
      <!-- 共有{{total}}条记录 -->
      <div class="total" v-show="total > 0">
        <span
          >共有 <strong>{{ total }}</strong> 条记录</span
        >
      </div>
      <div class="main-content">
        <el-table style="width:100%; font-size:14px" :data="tableData" border>
          <el-table-column
            prop="id"
            label="序号"
            width="200px"
          ></el-table-column>
          <el-table-column prop="name" label="材料名称"></el-table-column>
          <el-table-column label="单价/元">
            <template slot-scope="scope"
              >{{ scope.row.price }}元/kg</template
            >
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
          :page.sync="page"
          @pagination="getList"
        ></pagination>
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
export default {
  data() {
    return {
      header: {
        token: store.getters.token
      },
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
      limit: 1
    };
  },
  created() {
    this.fetchCompanyList();
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
    // 数组扁平化
    flatten(arr) {
      for (var i = 0, len = arr.length; i < len; i++) {
        this.companyList.push({ id: arr[i].id, name: arr[i].name });
        if (typeof arr[i].items !== "undefined") {
          this.flatten(arr[i].items);
        }
      }
    },
    fetchCompanyList() {
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          this.flatten(res.data);
          let temp = "";
          this.companyList.forEach((item, index) => {
            if (index <= this.companyList.length) {
              temp += item.id + ",";
            }
          });
          temp = temp.slice(0, -1);
          this.companyList.unshift({ id: temp, name: "全部" });
        })
        .catch(error => console.log(err));
    },
    fetchCanteenList(id) {
      this.canteenList = [];
      if (typeof id === "string" && id.indexOf(",")) {
        this.canteenList.unshift({ id: "", name: "全部" });
        this.canteen_id = "";
      } else {
        this.canteen_id = "";
        $axios
          .get(`/v1/canteens?company_id=${id}`)
          .then(res => {
            this.canteenList = res.data;
          })
          .catch(error => console.log(err));
      }
    },
    fetchTableList() {
      $axios
        .get(
          `/v1/materials?page=${this.page}&size=10&key=${
            this.keyword
          }&canteen_ids=${this.canteen_id}&company_ids=${this.company_id}`
        )
        .then(res => {
          this.tableData = res.data.data;
          this.total = res.data.total;
        })
        .catch(error => console.log(err));
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
          .post("/v1/material/handel", {
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
    getList(val) {
      this.page = val;
      this.fetchTableList();
    },
    closeDialog(val) {
      this.visible = val;
      this.editFormdata = {};
    },
    deriveData() {
      $axios
        .get(
          `/v1/material/export?key=${this.keyword}&canteen_ids=${
            this.canteen_id
          }&company_ids=${this.company_id}`
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
    confirmUpdate(val) {
      if (val === "ok") {
        this.fetchTableList();
      }
    },
    handleSuccess(res, file, fileList) {
      this.sendMessage(res.msg);
      this.fetchTableList();
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
