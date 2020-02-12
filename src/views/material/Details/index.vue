<template>
  <div class="details">
    <div class="nav-title">菜品材料明细</div>
    <el-divider />
    <div class="main">
      <div class="main-header">
        <el-form :inline="true" :model="queryForm">
          <el-form-item label="公司" v-if="companiesVisible" prop="company_id">
            <el-select
              @change="getCanteenOptions"
              placeholder="请选择企业"
              filterable
              v-model="queryForm.company_ids"
            >
              <el-option
                v-for="item in companyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="消费地点" prop="canteen_id">
            <el-select v-model="queryForm.canteen_ids">
              <el-option
                v-for="item in canteenOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="queryList(1)" plain>查询</el-button>
          <el-button type="primary" @click="exportFile">导出</el-button>
        </el-form>
      </div>
      <div class="main-content">
        <el-table style="width:100%" :data="tableData">
          <el-table-column type="expand">
            <template slot-scope="prop">
              <el-table :data="prop.row.material">
                <el-table-column label="材料名称" prop="name">
                </el-table-column>
                <el-table-column label="数量" prop="count" />
                <el-table-column label="操作">
                  <template slot-scope="scoped">
                    <span
                      ><el-button
                        type="text"
                        @click="openMaterialDialog(scoped.row, 'edit')"
                        size="mini"
                        >编辑</el-button
                      ><el-button
                        type="text"
                        @click="deleteMaterial(scoped.row)"
                        size="mini"
                        >删除</el-button
                      ></span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="公司" prop="company" />
          <el-table-column label="饭堂" prop="canteen" />
          <el-table-column label="餐次" prop="dinner" />
          <el-table-column label="菜品" prop="name" />
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <span
                ><el-button
                  type="text"
                  @click="openMaterialDialog(scoped.row, 'add')"
                  >添加材料</el-button
                ></span
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :currentPage="current_page"
          :pageSize="size"
          @pagination="queryList"
        />
      </div>
      <el-dialog
        :title="isEditMaterial ? '编辑材料' : '新增材料'"
        :visible.sync="materialDialog"
        @close="closeMaterialDialog"
        width="30%"
      >
        <el-form ref="materialForm" :model="materialForm" label-width="60px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="materialForm.name" />
          </el-form-item>
          <el-form-item label="数量" prop="count">
            <el-input v-model="materialForm.count" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeMaterialDialog">取 消</el-button>
          <el-button type="primary" @click="submitMaterial">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import $axios from "@/api/index";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";

export default {
  components: { Pagination },
  computed: {
    companiesVisible() {
      return this.grade != 3;
    }
  },
  data() {
    return {
      grade: store.getters.grade,
      materialDialog: false,
      isEditMaterial: false,
      companyOptions: [],
      canteenOptions: [],
      dinnerOptions: [],
      tableData: [],
      queryForm: {
        company_ids: "",
        canteen_ids: ""
      },
      materialDetail: {},
      materialForm: {
        name: "",
        count: ""
      },
      current_page: 1,
      size: 10,
      total: 0
    };
  },
  async created() {
    if (this.companiesVisible) {
      await this.getCompanies();
      await this.queryList(1);
    } else {
      await this.getCanteenOptions();
      await this.queryList(1);
    }
  },
  methods: {
    async getCompanies() {
      const res = await $axios.get(
        "/api/v1/admin/companies"
      );
      if (res.msg === "ok") {
        this.companyOptions = getAllOptions(flatten(res.data));
        this.queryForm.company_ids = this.companyOptions[0].id;
        this.canteenOptions = [{ name: "全部", id: 0 }];
        this.queryForm.canteen_ids = this.canteenOptions[0].id;
        await this.getCanteenOptions(this.canteenOptions[0].id);
      }
    },
    async getCanteenOptions(c_id) {
      let company_id = c_id || localStorage.getItem("company_id");
      this.canteenOptions = [{ name: "全部", id: 0 }];
      this.queryForm.canteen_ids = 0;
      if (Number(company_id)) {
        const res = await $axios.get(
          `/api/v1/canteens?company_id=${company_id}`
        );
        if (res.msg === "ok") {
          this.canteenOptions = getAllOptions(Array.from(res.data));
          this.queryForm.canteen_ids = this.canteenOptions[0].id;
        }
        return res;
      }
    },
    async getDinnerOptions(canteen_id) {
      const res = await $axios.get(
        `/api/v1/canteen/dinners?canteen_id=${canteen_id}`
      );
      if (res.msg === "ok") {
        this.dinnerOptions = getAllOptions(Array.from(res.data));
      }
    },
    async exportFile() {
      let form = {};
      form = JSON.parse(JSON.stringify(this.queryForm));
      if (String(form.canteen_ids).includes(",")) {
        delete form.company_ids;
      } else if (String(form.company_ids).includes(",")) {
        delete form.canteen_ids;
      }
      this.$exportExcel(
        "/api/v1/material/exportFoodMaterials",
        form
      );
    },
    async queryList(page) {
      page = page || 1;
      let form = {};
      form = JSON.parse(JSON.stringify(this.queryForm));
      if (String(form.canteen_ids).includes(",")) {
        delete form.company_ids;
      } else if (String(form.company_ids).includes(",")) {
        delete form.canteen_ids;
      }
      const res = await $axios.get(
        `/api/v1/materials/food?page=${page}&size=${
          this.size
        }`,
        form
      );
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.total = res.data.total;
        this.current_page = res.data.current_page;
      }
    },
    openMaterialDialog(row, type) {
      this.materialForm.id = row.id;
      if (type == "edit") {
        this.materialForm = Object.assign({}, row);
        this.isEdit = true;
      }
      this.materialDialog = true;
    },
    async submitMaterial() {
      let res = null;
      let materials = [];
      let f_id = this.isEdit ? this.materialForm.f_id : this.materialForm.id;
      if (this.isEdit) {
        let id = this.materialForm.id;
        materials.push(
          {
            id: id,
            count: this.materialForm.count
          },
          {
            id: id,
            name: this.materialForm.name
          }
        );
        res = await $axios.post(
          "/api/v1/food/material/update",
          {
            id: f_id,
            material: JSON.stringify(materials)
          }
        );
      } else {
        materials.push({
          name: this.materialForm.name,
          count: this.materialForm.count
        });
        res = await $axios.post(
          "/api/v1/food/material/update",
          {
            id: f_id,
            material: JSON.stringify(materials)
          }
        );
      }
      if (res.msg === "ok") {
        this.closeMaterialDialog();
        this.$message.success("操作成功！");
        await this.queryList(this.current_page);
      }
    },
    closeMaterialDialog() {
      this.materialDialog = false;
      this.isEdit = false;
      this.$refs.materialForm.resetFields();
    },
    deleteMaterial(row) {
      this.$confirm("此操作将删除该条材料明细, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await $axios.post(
            "/api/v1/food/material/update",
            {
              id: row.f_id,
              material: JSON.stringify([{ id: row.id, state: 2 }])
            }
          );
          if (res.msg === "ok") {
            await this.queryList(this.current_page);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
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

<style></style>
