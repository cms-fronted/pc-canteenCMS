<template>
  <div>
    <div class="manage">
      <div class="nav-title">商品管理</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span class="content-header">所属公司：</span>
          <el-select
            v-model="company_id"
            placeholder="请选择"
            style="width:150px"
            @change="getList(company_id)"
          >
          <!-- @change="getCanteenList(company_id)" -->
            <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <span class="content-header">消费地点：</span>
          <el-select v-model="canteen_id" placeholder="请选择" style="width:150px">
            <el-option v-for="item in canteenList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
          <el-table style="width:100%" :data="tabledata">
            <el-table-column label="图片">
              <template slot-scope="props">
                <div style="text-align:center">
                  <img
                    style="height:100px;"
                    src="http://canteen.tonglingok.com/static/image/20190923/e88f560bd4bce780c8410bc5d503c7fa.jpg"
                    :alt="props.name"
                    srcset
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="类型" prop="category"></el-table-column>
            <el-table-column label="单价"></el-table-column>
            <el-table-column label="供应商" prop="supplier"></el-table-column>
            <el-table-column label="库存" prop="stock"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="props">
                <el-button size="mini" @click="handleEdit(props.$index, props.row)">编辑</el-button>
                <el-button size="mini" type="danger">删除</el-button>
                <el-button size="mini" class="option" @click="withdraw(props.$index, props.row)">下架</el-button>
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
      company_id: "",
      canteen_id: "",
      supplier_id: "",
      canteenList: [],
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
      storageFormVisible: false,
      storageCount: "",
      currentProductId: "",
      tabledata: [
        {
          product_id: 6,
          image: "/static/image",
          name: "鸡蛋2",
          category: "生鲜",
          unit: "元/500g",
          price: "100.0",
          stock: "100",
          supplier: "供应商1"
        },
        {
          product_id: 5,
          image: "/static/image",
          name: "鸡蛋1",
          category: "生鲜",
          unit: "元/500g",
          price: "100.0",
          stock: "100",
          supplier: "供应商1"
        }
      ],
      visible: false,
      title: "",
      dialogVisible: false,
      dialogImageUrl: "",
      limit: 1
    };
  },
  created() {
    this.fetchCompanyList();
  },
  methods: {
    fetchCompanyList(){
      $axios
      .get("/v1/companies")
      .then(res => {
        this.companyList = Array.from(res.data.data);
      })
      .catch(err => console.log(err));
    },
    getList(id){
      this.getCanteenList(id);
      this.getSupplierList(id);
      this.getCategoryList(id);
    },
    getCanteenList(id){
      this.canteen_id = "";
      $axios
        .get("/v1/canteens/company", {
          company_id: id
        })
        .then(res => {
          this.canteenList = res.data.canteens;
        })
        .catch(err => console.log(err));
    },
    getSupplierList(id){
      this.supplier_id = "";
      // .get(`/v1/suppliers?c_id=${id}&page=1&size=10`)
      // /v1/company/suppliers?page=1&size=10
      $axios
        .get(`/v1/suppliers?c_id=${id}&page=1&size=10`)
        .then(res => {
          // console.log(res);
          this.supplierList = res.data.data;
        })
        .catch(err => console.log(err));
    },
    getCategoryList(id){
      this.category_id = "";
      $axios
        .get(`/v1/categories?c_id=${id}&page=1&size=10`)
        .then(res => {
          this.categoryList = res.data.data;
        })
        .catch(err => console.log(err));
    },
    fetchTableList(){
      console.log(1);
      // /v1/shop/cms/products?$supplier_id&category_id=1&page=1&size=10
      console.log(this.supplier_id);
      console.log(this.category_id);
      $axios
        .get(`/v1/shop/cms/products?supplier_id=${this.supplier_id}&category_id=${this.category_id}&page=1&size=10`)
        .then(res => {
          console.log(res);
        })
        .catch(err => console.log(err));

    },
    handleClose(){
      this.visible = false;
    },
    handleClick(){
      let addForm = {};
      Object.assign(addForm,{
        "company_id": this.company_id,
        "supplier_id": this.supplier_id,
        "category_id": this.category_id,
      },this.formdata);
      $axios
        .post(`/v1/shop/product/save`,addForm)
        .then(res => {
          console.log(addForm);
        })
        .catch(err => console.log(err));
    },
    storage(row){
      this.storageFormVisible = true;
      console.log(row);
      this.currentProductId = row.product_id;
    },
    cancelStorage(){
      this.storageFormVisible = false;
      this.storageCount = ""
    },
    confirmStorage(){
      this.storageFormVisible = false;
      $axios
        .post('/v1/shop/stock/save',{
          "product_id": this.currentProductId,
          "count": this.storageCount
        })
        .then(res => {
          console.log(res);
          this.sendMessage(res.msg);
          this.storageCount = "";
        })
        .catch(err => console.log(err));
    },
    withdraw(index, row){
      console.log(index, row);
      this.$confirm("请问确定下架该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() =>{
          $axios
            .post("/v1/shop/product/handel",{
              "id": this.supplier_id,
              "state": 2,
            })
            .then(res => {
              console.log(res);
              // this.tabledata.splice(index,1,0);
              this.sendMessage(res.msg);
            })
            .catch(err => console.log(err));
        }).catch((err) => {});
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
      this.visible = true;
      this.title = "编辑商品";
      console.log(index, row);
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
    }
  }
};
</script>

<style  lang="scss" scpoed>
  .main{
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
      }
      .el-button.option{
        margin-top: 5px;
      }
    }
  }
</style>