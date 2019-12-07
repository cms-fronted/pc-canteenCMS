<template>
  <div>
    <div class="manage">
      <div class="nav-title">商品管理</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span class="content-header">供应商：</span>
          <el-select
            v-model="supplier_id"
            placeholder="请选择"
            style="width:150px"
          >
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="content-header">类型：</span>
          <el-select
            v-model="category_id"
            placeholder="请选择"
            style="width:150px"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="fetchTableList">查询</el-button>
          <el-button type="primary" @click="handleAdd">增加</el-button>
        </div>
        <div class="main-content">
          <el-table
            style="width:100%"
            :data="tabledata"
            show-summary
            border
            :summary-method="getSummaries"
          >
            <el-table-column label="图片">
              <template slot-scope="props">
                <div style="text-align:center">
                  <img
                    style="height:100px;"
                    :src="props.row.image"
                    :alt="props.row.name"
                    srcset
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="类型" prop="category"></el-table-column>
            <el-table-column label="单位" prop="unit"></el-table-column>
            <el-table-column label="单价" prop="price"></el-table-column>
            <el-table-column label="供应商" prop="supplier"></el-table-column>
            <el-table-column label="库存" prop="stock"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="props">
                <el-button
                  size="mini"
                  @click="handleEdit(props.$index, props.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteGoods(props.$index, props.row)"
                  >删除</el-button
                >
                <el-button
                  size="mini"
                  class="option"
                  @click="upbuild(props.$index, props.row)"
                  v-if="props.row.state === 2"
                  >上架</el-button
                >
                <el-button
                  size="mini"
                  class="option"
                  @click="withdraw(props.$index, props.row)"
                  v-if="props.row.state === 1"
                  >下架</el-button
                >
                <el-button
                  size="mini"
                  class="option"
                  @click="storage(props.row)"
                  >入库</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <add-dialog
      :title="addFormTitle"
      :editData="addForm"
      :visible="addVisible"
      state="add"
      @closeDialog="closeAddDialog"
      @confirm="confirmAdd"
    ></add-dialog>
    <revise-dialog
      :title="reviseFormTitle"
      :editData="reviseForm"
      :visible="reviseVisible"
      :disabled="true"
      state="revise"
      :reivseParam="reivseParam"
      @closeDialog="closeReviseDialog"
      @confirm="confirmRevise"
    ></revise-dialog>
    <el-dialog title="入库" :visible.sync="storageFormVisible">
      <el-form>
        <el-form-item label="入库数量" label-width="80px">
          <el-input v-model="storageCount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelStorage">取 消</el-button>
        <el-button type="primary" @click="confirmStorage">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import ReviseDialog from "./dialog";
import AddDialog from "./dialog";
export default {
  data() {
    return {
      supplier_id: "",
      supplierList: [],
      category_id: "",
      categoryList: [],
      addForm: {
        name: "",
        price: "",
        unit: "",
        count: "",
        image: ""
      },
      reviseForm: {
        name: "",
        price: "",
        unit: "",
        stock: "",
        image: ""
      },
      reviseFormTitle: "编辑商品",
      reviseVisible: false,
      reivseParam: {},
      storageFormVisible: false,
      storageCount: "",
      currentProductId: "",
      total: 2,
      tabledata: [],
      addVisible: false,
      addFormTitle: "新增商品"
    };
  },
  components: {
    ReviseDialog,
    AddDialog
  },
  created() {
    this.getSupplierList();
    this.getCategoryList();
    this.fetchTableList();
  },
  methods: {
    /* 公用方法*/
    // 专门负责发送 post 请求
    sendPostRequest(url, data) {
      $axios
        .post(url, data)
        .then(res => {
          this.sendMessage(res.msg);
          this.fetchTableList();
        })
        .catch(err => console.log(err));
    },
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
    // 封装方法 changeState 处理商品状态
    changeState(id, state) {
      this.sendPostRequest(
        "http://canteen.tonglingok.com/api/v1/shop/product/handel",
        {
          id: id,
          state: state
        }
      );
    },
    // 获取相关数据列表
    getSupplierList() {
      this.supplier_id = "";
      $axios
        .get("http://canteen.tonglingok.com/api/v1/company/suppliers")
        .then(res => {
          this.supplierList = res.data;
          this.supplierList.unshift({
            id: 0,
            name: "全部"
          });
        })
        .catch(err => console.log(err));
    },
    getCategoryList() {
      this.category_id = "";
      $axios
        .get(
          "http://canteen.tonglingok.com/api/v1/company/categories?&page=1&size=10"
        )
        .then(res => {
          this.categoryList = res.data;
          this.categoryList.unshift({
            id: 0,
            name: "全部"
          });
        })
        .catch(err => console.log(err));
    },
    // 获取商品类型列表和处理
    fetchTableList() {
      $axios
        .get(
          `http://canteen.tonglingok.com/api/v1/shop/cms/products?supplier_id=${
            this.supplier_id
          }&category_id=${this.category_id}&page=1&size=10`
        )
        .then(res => {
          this.tabledata = Array.from(res.data.data);
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    getSummaries(param) {
      // const { columns, data } = param;
      // console.log({ columns, data });
      const sums = [];
      sums[0] = "合计";
      sums[7] = this.total + "种";
      return sums;
    },
    handleEdit(index, row) {
      this.reviseVisible = true;
      this.reviseForm = {
        name: row.name,
        price: row.price,
        unit: row.unit,
        stock: row.stock,
        image: row.image
      };
      this.reivseParam = {
        id: row.product_id,
        supplier_id: this.supplier_id,
        category_id: this.category_id
      };
    },
    handleAdd() {
      this.addVisible = true;
    },
    // 处理编辑商品弹窗
    closeReviseDialog(val) {
      this.reviseVisible = val;
    },
    confirmRevise(val) {
      this.reviseVisible = false;
      this.sendPostRequest(
        "http://canteen.tonglingok.com/api/v1/shop/product/update",
        val
      );
    },
    // 处理添加商品弹窗
    closeAddDialog(val) {
      this.addVisible = val;
    },
    confirmAdd(formData) {
      let addForm = {};
      Object.assign(
        addForm,
        {
          supplier_id: this.supplier_id,
          category_id: this.category_id
        },
        formData
      );
      this.sendPostRequest(
        "http://canteen.tonglingok.com/api/v1/shop/product/save",
        addForm
      );
      this.addVisible = false;
    },
    // 入库处理
    storage(row) {
      this.storageFormVisible = true;
      this.currentProductId = row.product_id;
    },
    cancelStorage() {
      this.storageFormVisible = false;
      this.storageCount = "";
    },
    confirmStorage() {
      this.storageFormVisible = false;
      this.sendPostRequest(
        "http://canteen.tonglingok.com/api/v1/shop/stock/save",
        {
          product_id: this.currentProductId,
          count: this.storageCount
        }
      );
      this.storageCount = "";
    },
    // 下架处理
    withdraw(index, row) {
      this.$confirm("请问确定下架该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changeState(row.product_id, 2);
        })
        .catch(err => {});
    },
    // 删除处理
    deleteGoods(index, row) {
      this.$confirm("请问确定删除该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changeState(row.product_id, 3);
        })
        .catch(err => {});
    },
    // 上架处理
    upbuild(index, row) {
      this.$confirm("请问确定上架该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changeState(row.product_id, 1);
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss" scpoed>
.manage {
  .main-content {
    .el-button {
      margin-left: 5px;
      margin-top: 5px;
    }
  }
}
</style>
