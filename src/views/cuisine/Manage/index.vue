<template>
  <div>
    <div class="manage">
      <span class="nav-title">菜品管理</span>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <el-form :inline="true" label-width="80px" :model="queryForm">
            <el-form-item label="公司" prop="company_ids">
              <el-select v-model="queryForm.company_id" @change="getLocationList">
                <el-option
                  v-for="item in companyList"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消费地点" prop="canteen_id">
              <el-select v-model="queryForm.canteen_id" @change="getDinnersList">
                <el-option
                  v-for="item in locationList"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="餐次" prop="dinner_id">
              <el-select v-model="queryForm.dinner_id" @change="getCategoryList">
                <el-option
                  v-for="item in dinnersList"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="category">
              <el-select v-model="queryForm.m_id">
                <el-option
                  v-for="item in categoryList"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary">查询</el-button>
            <el-button @click="addCuisine">新增</el-button>
          </el-form>
        </div>
        <div class="main-content">
          <el-card :body-style="{ padding:0, }" v-for="(item) in goodsList" :key="item.postID">
            <div class="image">
              <!-- <img :src="getImageUrl(item.PicPath)" alt /> -->
            </div>
            <div style="padding: 14px;">
              <ul class="main-title">
                <li class="list">名称:{{item.goods_name}}</li>
                <li class="list">库存:{{item.goods_total}}</li>
                <li class="list">价格:{{item.goods_price}}/{{item.unit}}</li>
                <li class="list">类型:{{item.goods_type}}</li>
                <li class="list">主厨:{{item.postID}}</li>
              </ul>
              <div class="btns">
                <el-button type="danger" plain @click="handleDelete(item)">删除</el-button>
                <el-button type="primary" @click="handleEdit(item)">编辑</el-button>
              </div>
            </div>
          </el-card>
        </div>
        <!-- <el-pagination
          background
          layout="prev, pager, next"
          :total="sum"
          :page-size="5"
          :current-page.sync="page"
          @current-change="fetchList"
          @prev-click="fetchList"
          @next-click="fetchList"
        ></el-pagination>-->
      </div>
    </div>
    <cuisine-dialog :visible="visible" @closeDialog="closeDialog" @_add="_add" :canteenList="locationList" />
    <el-dialog
      :visible.sync="editVisible"
      title="编辑"
      width="40%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="editForm" v-model="editFormdata" :inline="true">
        <el-form-item style="display:block" label="图片">
          <el-upload
            ref="editUpload"
            action="http://yuncanteen.51canteen.com:9230/NewJMConsumeJMHG/Mall_photo.ashx"
            name="photo"
            :file-list="fileList"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :class="{hide:hideUpload}"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="名称" prop="goods_name">
          <el-input v-model="editFormdata.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="goods_total">
          <el-input v-model="editFormdata.goods_total"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="editFormdata.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="editFormdata.unit"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="goods_type">
          <el-input v-model="editFormdata.goods_type"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CuisineDialog from "./dialog";
import $axios from "@/api/index";
import { flatten } from "@/utils/flatternArr";
export default {
  data() {
    return {
      visible: false,
      editVisible: false,
      dialogVisible: false,
      uploadVisible: true,
      hideUpload: false,
      dialogImageUrl: "",
      companyList: [],
      locationList: [],
      dinnersList: [],
      categoryList: [],
      goodsList: [],
      editFormdata: {
        postID: "",
        goods_name: "",
        goods_type: "",
        goods_total: "",
        unit: "",
        PicPath: ""
      },
      queryForm: {
        canteen_id: "",
        company_id: "",
        dinner_id: "",
        m_id: ""
      },
      fileList: [],
      types_select: [],
      provider_select: []
    };
  },
  components: { CuisineDialog },
  created() {
    this.getCompanies();
  },
  methods: {
    getCompanies() {
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          let allCompanies = [];
          let companiesList = flatten(arr);
          companiesList.forEach(element => {
            let id = element.id;
            allCompanies.push(id);
          });
          allCompanies = allCompanies.join(",");
          companiesList.unshift({
            name: "全部",
            id: allCompanies
          });
          this.companyList = companiesList;
        })
        .catch(err => console.log(err));
    },
    getLocationList(company_id) {
      if (!isNaN(company_id)) {
        $axios
          .get(`/v1/company/consumptionLocation?company_id=${company_id}`)
          .then(res => {
            this.locationList = Array.from(res.data.canteen);
          })
          .catch(err => console.log(err));
      } else {
        this.locationList = [];
        this.categoryList = [];
        this.dinnersList = [];
        this.queryForm.canteen_id = null;
        this.queryForm.dinner_id = null;
        this.queryForm.m_id = null;
      }
    },
    getDinnersList(canteen_id) {
      if (!isNaN(canteen_id)) {
        $axios
          .get(`/v1/canteen/dinners?canteen_id=${canteen_id}`)
          .then(res => {
            this.dinnersList = Array.from(res.data);
          })
          .catch(err => console.log(err));
      }
    },
    getCategoryList(dinner_id) {
      if (!isNaN(dinner_id)) {
        $axios
          .get(`/v1/menus/dinner?dinner_id=${dinner_id}`)
          .then(res => console.log(res))
          .catch(err => console.log(err));
      }
    },
    handleEdit(item) {
      // this.fileList.push(
      //   Object.assign(
      //     {},
      //     {
      //       name: `${item.goods_name}.jpg`,
      //       url: this.getImageUrl(item.PicPath)
      //     }
      //   )
      // );
      this.hideUpload = true;
      this.editVisible = true;
      this.editFormdata = Object.assign({}, item);
    },

    confirmEdit() {
      Object.assign(this.editFormdata, {
        types: "edit_goods"
      });
      this.$axios
        .post("/NewJMConsumeJMHG/Mall.ashx", this.editFormdata)
        .then(res => {
          if (res.data.code == "200") {
            this.$message.success(res.data.msg);
            this.fileList = new Array();
            this.$refs.editUpload.clearFiles();
            this.$refs["editForm"].resetFields();
            this.fetchList(this.page);
            this.editVisible = false;
          } else {
            this.$message.fail(res.data.msg);
          }
        })
        .catch(err => console.log(err));
    },
    handleClose(done) {
      this.fileList = new Array();
      this.editVisible = false;
    },
    closeDialog(val) {
      this.editData = {};
      this.visible = val;
    },

    openNewType() {
      this.newTypeVisible = true;
    },

    addCuisine() {
      this.visible = true;
    },

    _add() {
      this.fetchList(this.page);
    },

    handleClickPage(e) {
      this.page = e;
      this.fetchList(e);
    },
    handleNext(e) {
      this.page = e;
      this.fetchList(e);
    },
    handlePrev(e) {
      this.page = e;
      this.fetchList(e);
    },
    // getImageUrl(url) {
    //   console.log(url);
    //   return `${GLOBAL.baseURL}${url.replace(/\\/g, "/")}`;
    // },
    handleChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limit;
    },
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limit;
    },
    handlePreview(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file, fileList) {
      this.editFormdata.PicPath = res.data.replace(/\\/g, "\\\\"); //转义url
      console.log(this.editFormdata);
    },

    handleDelete(item) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/NewJMConsumeJMHG/Mall.ashx", {
              types: "delete_goods",
              postID: item.postID
            })
            .then(() => {
              this.fetchList(this.page);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
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

<style lang="scss">
.manage {
  .main {
    height: 100%;
    .main-content {
      display: flex;
      width: 100%;
      .main-title {
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .list {
        margin: 10px;
      }
      // .list:last-child {
      //   margin-right: auto;
      // }
      .el-card {
        width: 19%;
        margin: 0 10px;
        .time {
          font-size: 13px;
          color: #999;
        }
        .bottom {
          margin-top: 13px;
          line-height: 12px;
        }
        .image {
          width: 100%;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          img {
            width: 100%;
            height: 100%;
          }
          // .imgs {
          //   object-fit: contain;
          // }
        }
        .btns {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          .el-button {
            margin: 5px;
          }
        }
      }
    }
  }
}
</style>