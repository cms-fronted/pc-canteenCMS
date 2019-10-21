<template>
  <div>
    <div class="manage">
      <div class="nav-title">商品管理</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span class="content-header">供应商：</span>
          <el-select v-model="supplier_id" placeholder="请选择" style="width:150px">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <span class="content-header">类型：</span>
          <el-select v-model="category_id" placeholder="请选择" style="width:150px">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <div class="btn-area">
            <el-button type="primary" @click="fetchTableList">查询</el-button>
            <el-button type="primary" @click="handleAdd">增加</el-button>
          </div>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tabledata" show-summary border :summary-method="getSummaries">
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
                <el-button size="mini" @click="handleEdit(props.$index, props.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteGoods(props.$index, props.row)">删除</el-button>
                <el-button size="mini" class="option" @click="upbuild(props.$index, props.row)" v-if="props.row.state === 2">上架</el-button>
                <el-button size="mini" class="option" @click="withdraw(props.$index, props.row)" v-if="props.row.state === 1">下架</el-button>
                <el-button size="mini" class="option" @click="storage(props.row)">入库</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="visible" :title="title">
      <el-form label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="formdata.name"></el-input>
        </el-form-item>
        <el-form-item label="菜品单位">
          <el-input v-model="formdata.unit"></el-input>
        </el-form-item>
        <el-form-item label="菜品单价">
          <el-input v-model="formdata.price"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="formdata.count"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="http://canteen.tonglingok.com/api/v1/image/upload"
            list-type="picture-card"
            name="image"
            :limit="limit"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- test 编辑弹窗 -->
    <revise-dialog
      :title="reviseFormTitle"
      :editData="reviseForm"
      :visible="reviseVisible"
      :disabled="true"
      :reivseParam="reivseParam"
      @closeDialog="closeDialog"
      @confirmRevise="confirmRevise"
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
export default {
  data() {
    return {
      queryform: {
        company: "",
        address: "",
        supplier: "",
        category: ""
      },
      companyList: [],
      // company_id: "",
      // canteen_id: "",
      supplier_id: "",
      // canteenList: [],
      supplierList: [],
      category_id: "",
      categoryList: [],
      formdata: {
        name: "",
        price: "",
        unit: "",
        count: "",
        image : ""
      },
      reviseForm: {
        name: "",
        price: "",
        unit: "",
        stock: "",
        image : ""
      },
      reviseFormTitle: "编辑商品",
      reviseVisible: false,
      reivseParam: {},
      storageFormVisible: false,
      storageCount: "",
      currentProductId: "",
      total: 2,
      tabledata: [],
      visible: false,
      title: "",
      dialogVisible: false,
      dialogImageUrl: "",
      limit: 1
    };
  },
  components:{
    ReviseDialog
  },
  created() {
    this.getSupplierList();
    this.getCategoryList();
  },
  methods: {
    getSupplierList(){
      this.supplier_id = "";
      $axios
        .get("/v1/company/suppliers?page=1&size=10")
        .then(res => {
          this.supplierList = res.data.data;
        })
        .catch(err => console.log(err));
    },
    getCategoryList(){
      this.category_id = "";
      $axios
        .get("/v1/company/categories?&page=1&size=10")
        .then(res => {
          this.categoryList = res.data;
        })
        .catch(err => console.log(err));
    },
    fetchTableList(){
      $axios
        .get(`/v1/shop/cms/products?supplier_id=${this.supplier_id}&category_id=${this.category_id}&page=1&size=10`)
        .then(res => {
          this.tabledata = Array.from(res.data.data);
          // console.log(this.tabledata)
          this.total = res.data.total;
        })
        .catch(err => console.log(err));

    },
    getSummaries(param){
      
      const { columns, data } = param;
      // console.log({ columns, data });
      const sums = [];
      sums[0] = '合计';
      sums[7] = this.total + '种';
      return sums;
    },
    handleClose(){
      this.visible = false;
    },
    handleClick(){
      let addForm = {};
      Object.assign(addForm,{
        "supplier_id": this.supplier_id,
        "category_id": this.category_id,
      },this.formdata);
      this.sendPostRequest("/v1/shop/product/save",addForm);
      this.visible = false;
      /* $axios
        .post(`/v1/shop/product/save`,addForm)
        .then(res => {
          this.sendMessage(res.msg);
          this.visible = false;
          this.fetchTableList();
        })
        .catch(err => console.log(err)); */
    },
    storage(row){
      this.storageFormVisible = true;
      // console.log(row);
      this.currentProductId = row.product_id;
    },
    cancelStorage(){
      this.storageFormVisible = false;
      this.storageCount = ""
    },
    confirmStorage(){
      this.storageFormVisible = false;
      this.sendPostRequest("/v1/shop/stock/save",{
        "product_id": this.currentProductId,
        "count": this.storageCount
      });
      this.storageCount = "";
    },
    withdraw(index, row){
      // console.log(index, row);
      this.$confirm("请问确定下架该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() =>{
          this.changeState(row.product_id,2);
        }).catch((err) => {});
    },
    deleteGoods(index, row){
      this.$confirm("请问确定删除该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() =>{
          this.changeState(row.product_id,3);
        }).catch((err) => {});
    },
    upbuild(index, row){
      this.$confirm("请问确定上架该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() =>{
          this.changeState(row.product_id,1);
        }).catch((err) => {});
    },
    changeState(id,state){
      this.sendPostRequest("/v1/shop/product/handel",{
        "id": id,
        "state": state,
      });
    },
    sendMessage(msg){
      if(msg === 'ok'){
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }else {
        this.$message({
          type: "info",
          message: "操作失败"
        })
      }
    },
    handleEdit(index, row) {
      this.reviseVisible = true;
      this.reviseForm = {
        name: row.name,
        price: row.price,
        unit: row.unit,
        stock: row.stock,
        image : row.image
      };
      this.reivseParam = {
        "id": row.product_id,
        "supplier_id": this.supplier_id,
        "category_id": this.category_id,
      };
    },
    handleAdd() {
      this.visible = true;
      this.title = "新增商品";
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file, fileList) {
      if (res.code === 200) {
        // this.formdata.img_url = res.data.url;
        this.formdata.image = res.data.url;
        console.log(this.formdata.image);
      }
    },
    closeDialog(val){
      this.reviseVisible = val;
    },
    confirmRevise(val){
      this.reviseVisible = false;
      this.sendPostRequest("/v1/shop/product/update",val);
    },
    // 专门负责发送 post 请求
    sendPostRequest(url,data){
      $axios
        .post(url,data)
        .then(res => {
          this.sendMessage(res.msg);
          this.fetchTableList();
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style  lang="scss" scpoed>
  .main{
    .main-header{
      display: flex;
      align-items: center;
    }
    .main-content{
      .el-table{
        th,td{
          text-align: center;
          
        }
      }
    }
    .main-content{
      .el-button{
        margin-left: 5px;
        margin-top: 5px;
      }
    }
  }
</style>