<template>
  <div>
    <div class="cuisine-manage">
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
            <el-button type="primary" @click="fetchList">查询</el-button>
            <el-button @click="addCuisine" :disabled="locationList.length === 0">新增</el-button>
          </el-form>
        </div>
        <div class="main-content">
          <el-card
            class="card"
            :body-style="{ padding: 0 }"
            v-for="item in goodsList"
            :key="item.postID"
          >
            <div class="image">
              <img :src="item.img_url" alt />
            </div>
            <div style="padding: 14px;">
              <ul class="main-title">
                <li class="list">名称:{{ item.name }}</li>
                <!-- <li class="list">库存:{{item.goods_total}}</li> -->
                <li class="list">价格:{{ item.price }}</li>
                <li class="list">类型:{{ item.menu }}</li>
                <li class="list">主厨:{{ item.chef }}</li>
              </ul>
              <div class="btns">
                <el-button type="danger" plain @click="handleDelete(item)">删除</el-button>
                <el-button type="primary" @click="_edit(item)">编辑</el-button>
              </div>
            </div>
          </el-card>
        </div>
        <pagination
          v-if="goodsList.length > 0"
          :total="total"
          :page="current_page"
          :pageSize="pageSize"
          @pagination="fetchList"
          background
        ></pagination>
      </div>
    </div>
    <cuisine-dialog
      :c_id="queryForm.company_id"
      :visible="visible"
      @closeDialog="closeDialog"
      @_add="_add"
      :canteenList="diaLocationList"
      @updateList="fetchList(current_page)"
    />
    <el-dialog
      :visible.sync="editVisible"
      title="编辑"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="editForm" :model="editFormdata" label-width="80px">
        <el-form-item label="类型" prop="m_id">
          <el-select v-model="editFormdata.m_id" disabled>
            <el-option
              v-for="item in editCategoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="餐次" prop="dinner_id">
          <el-select v-model="editFormdata.dinner_id" disabled>
            <el-option
              v-for="item in editDinnersList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editFormdata.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="editFormdata.price"></el-input>
        </el-form-item>
        <el-form-item label="主厨" prop="chef">
          <el-input v-model="editFormdata.chef"></el-input>
        </el-form-item>
        <el-form-item style="display:block" label="图片">
          <el-upload
            ref="editUpload"
            action="/v1/image/upload"
            name="image"
            :file-list="fileList"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :class="{ hide: hideUpload }"
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
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CuisineDialog from "./dialog";
import Pagination from "@/components/Pagination";
import $axios from "@/api/index";
import { flatten, getAllOptions } from "@/utils/flatternArr";
import { get } from "http";
export default {
  data() {
    return {
      visible: false,
      editVisible: false,
      dialogVisible: false,
      uploadVisible: true,
      hideUpload: false,
      total: 20,
      current_page: 1,
      pageSize: 5,
      dialogImageUrl: "",
      companyList: [],
      locationList: [],
      diaLocationList: [],
      dinnersList: [],
      categoryList: [],
      goodsList: [],
      editFormdata: {
        name: "",
        m_id: "",
        dinner_id: "",
        chef: "",
        price: ""
      },
      editDinnersList: [],
      editCategoryList: [],
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
  components: { CuisineDialog, Pagination },
  created() {
    this.getCompanies();
  },
  methods: {
    fetchList(page) {
      page = page || 1;
      let queryForm = this.queryForm;
      let { m_id, dinner_id, canteen_id, company_id } = queryForm;
      $axios
        .get(`/v1/foods`, {
          f_type: 2,
          page: page,
          size: this.pageSize,
          company_ids: company_id,
          canteen_ids: canteen_id,
          dinner_ids: dinner_id,
          menu_ids: m_id
        })
        .then(res => {
          this.goodsList = Array.from(res.data.data);
          this.current_page = res.data.current_page;
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },
    getCompanies() {
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          let companiesList = flatten(arr);
          this.companyList = getAllOptions(companiesList);
          this.queryForm.canteen_id = null;
          this.queryForm.dinner_id = null;
          this.queryForm.m_id = null;
        })
        .catch(err => console.log(err));
    },
    getLocationList(company_id) {
      this.queryForm.canteen_id = null;
      this.queryForm.dinner_id = null;
      this.queryForm.m_id = null;
      if (!isNaN(company_id)) {
        $axios
          .get(`/v1/company/consumptionLocation?company_id=${company_id}`)
          .then(res => {
            this.diaLocationList = Array.from(res.data.canteen);
            this.locationList = getAllOptions(Array.from(res.data.canteen));
          })
          .catch(err => console.log(err));
      } else {
        this.locationList = [];
        this.categoryList = [];
        this.dinnersList = [];
      }
    },
    getDinnersList(canteen_id) {
      if (!isNaN(canteen_id)) {
        $axios
          .get(`/v1/canteen/dinners?canteen_id=${canteen_id}`)
          .then(res => {
            this.dinnersList = getAllOptions(Array.from(res.data));
          })
          .catch(err => console.log(err));
      } else {
        this.queryForm.dinner_id = "";
        this.queryForm.m_id = "";
        this.dinnersList = [];
      }
    },

    getCategoryList(dinner_id) {
      if (!isNaN(dinner_id)) {
        $axios
          .get(`/v1/menus/dinner?dinner_id=${dinner_id}`)
          .then(res => {
            this.categoryList = getAllOptions(Array.from(res.data));
          })
          .catch(err => console.log(err));
      } else {
        this.categoryList = [];
        this.queryForm.m_id = "";
      }
    },
    async getEditDinnerList(canteen_id) {
      await $axios
        .get(`/v1/canteen/dinners?canteen_id=${canteen_id}`)
        .then(res => {
          this.editDinnersList = Array.from(res.data);
        })
        .catch(err => console.log(err));
    },
    async getEditCategoryList(dinner_id) {
      await $axios
        .get(`/v1/menus/dinner?dinner_id=${dinner_id}`)
        .then(res => {
          this.editCategoryList = Array.from(res.data);
        })
        .catch(err => console.log(err));
    },
    async _edit(item) {
      let d_list = [];
      let c_list = [];
      let data = [];
      this.fileList.push(
        Object.assign(
          {},
          {
            name: `${item.name}.jpg`,
            url: item.img_url
          }
        )
      );
      this.hideUpload = true;
      this.editVisible = true;
      this.editFormdata = { ...item };
      delete this.editFormdata.img_url;
      await $axios
        .get("/v1/food", {
          id: item.id
        })
        .then(res => {
          data = res.data;
          let { dinner_id, canteen_id } = res.data;
          this.getEditDinnerList(canteen_id);
          this.getEditCategoryList(dinner_id);
          this.editFormdata.dinner_id = data.dinner_id;
          this.editFormdata.m_id = data.menu_id;
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
    confirmEdit() {
      let data = this.editFormdata;
      $axios
        .post("/v1/food/update", data)
        .then(res => console.log(res))
        .catch(err => console.log(err));
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
      this.editFormdata.img_url = res.data.url; //转义url
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
.cuisine-manage {
  .main {
    height: 100%;
    .main-content {
      display: flex;
      width: 100%;
      .main-title {
        font-size: 16px;
        // display: flex;
        // justify-content: space-between;
      }
      .list {
        margin: 20px 30px;
      }
      .card {
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