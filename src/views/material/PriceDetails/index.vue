<template>
  <div class="details">
    <div class="nav-title">材料价格明细</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          :clearable="true"
          v-model="keyword"
          style="width:180px;margin-right:15px;"
        ></el-input>
        <el-button type="primary" plain style="margin-left:0">查询</el-button>
        <el-button type="primary">导出</el-button>
        <el-button type="primary">批量导入</el-button>
        <el-button type="primary" @click="handleClick({},'_add','新增材料')">添加</el-button>
      </div>
      <div class="main-content">
        <el-table style="width:100%; font-size:14px" :data="tableData">
          <el-table-column prop="id" label="序号" width="200px"></el-table-column>
          <el-table-column prop="name" label="材料名称"></el-table-column>
          <el-table-column label="单价/元">
            <template slot-scope="scope">{{scope.row.price}}元/kg</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleClick(scope.row,'_edit','编辑材料')">编辑</el-button>
              <el-button size="mini" type="danger" @click="_delete(scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <handle-dialog
      :visible="visible"
      ref="materialDialog"
      :type="editType"
      :editFormdata="editFormdata"
      :title="dialogTitle"
      @close="closeDialog"
    />
  </div>
</template>

<script>
import HandleDialog from "./dialog";
export default {
  data() {
    return {
      tableData: [
        {
          id: 5,
          name: "生姜",
          price: 20,
          unit: "kg",
          state: 1,
          create_time: "2019-08-16 10:27:50",
          canteen_id: 6,
          company_id: 3,
          canteen: "饭堂1",
          company: "企业A"
        }
      ],
      keyword: "",
      editType: "",
      dialogTitle: "",
      visible: false,
      editFormdata: {}
    };
  },
  methods: {
    handleClick(row = {}, type, title) {
      this.visible = true;
      this.dialogTitle = title;
      this.editType = type;
      Object.assign(this.editFormdata, {}, row);
    },

    _delete(row) {
      console.log(row);
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/v1/material/handel", {
              id: row.id
            })
            .then(res => {
              if (res.data.msg == "ok") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }else {
                this.$message({
                  type: "info",
                  message: "操作失败"
                })
              }
            })
            .catch(err => console.log(err));
        })
    },
    closeDialog(val) {
      this.visible = val;
      this.editFormdata = {};
    }
  },
  components: {
    HandleDialog
  }
};
</script>

<style>
</style>