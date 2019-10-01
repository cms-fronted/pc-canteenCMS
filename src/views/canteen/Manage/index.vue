<template>
  <div>
    <div class="manage">
      <div class="nav-title">商品管理</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <el-form :model="queryform" :inline="true">
            <el-form-item label="公司" prop="company">
              <el-input style="width:150px;" v-model="queryform.company"></el-input>
            </el-form-item>
            <el-form-item label="消费地点" prop="address">
              <el-select v-model="queryform.address"></el-select>
            </el-form-item>
            <el-form-item label="供应商" prop="supplier">
              <el-select v-model="queryform.supplier"></el-select>
            </el-form-item>
            <el-form-item label="类型" prop="category">
              <el-select v-model="queryform.category"></el-select>
            </el-form-item>
            <el-button type="primary" @click="handleAdd">增加</el-button>
          </el-form>
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
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="visible" :title="title">
      <el-form label-width="80px">
        <el-form-item label="商品名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="菜品单价">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="菜品单位">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="详情">
          <el-input></el-input>
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryform: {
        company: "",
        address: "",
        supplier: "",
        category: ""
      },
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
  methods: {
    handleEdit(index, row) {
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
        this.formdata.img_url = res.data.url;
      }
    }
  }
};
</script>

<style>
</style>