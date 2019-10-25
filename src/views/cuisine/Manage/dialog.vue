<template>
  <el-dialog title="菜品管理" :visible.sync="isOpen" class="diaForm" width="30%" @close="handleClose">
    <el-form
      ref="cuisineManageForm"
      :model="formdata"
      :rules="rules"
      label-width="80px"
      :inline="true"
    >
      <el-form-item label="饭堂名称" prop="canteen_id">
        <el-select
          v-model="formdata.canteen_id"
          placeholder="请选择"
          style="width:120px"
          @change="getDinnersList"
        >
          <el-option v-for="item in canteenList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="餐次" prop="dinner_id" @change="getCategoryList">
        <el-select v-model="formdata.dinner_id" placeholder="请选择" style="width:120px">
          <el-option v-for="item in dinnerList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="m_id">
        <el-select v-model="formdata.m_id" placeholder="请选择" style="width:120px">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜品名称" prop="name">
        <el-input type="text" v-model="formdata.name"></el-input>
      </el-form-item>
      <el-form-item label="菜品单价" prop="price">
        <el-input type="text" v-model="formdata.price"></el-input>
      </el-form-item>
      <el-form-item label="主厨名称" prop="chef">
        <el-input type="text" v-model="formdata.chef"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="img_url">
        <div class="imgs">
          <el-upload
            action="/v1/image/upload"
            list-type="picture-card"
            ref="addUpload"
            name="image"
            :limit="limit"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :class="{hide:hideUpload}"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="_add">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import $axios from "@/api/index";
export default {
  props: {
    visible: {
      type: Boolean
    },
    editData: Object,
    canteenList: Array
  },
  data() {
    return {
      value: "",
      hideUpload: false,
      formdata: {
        f_type: 2,
        canteen_id: "",
        dinner_id: "",
        m_id: "",
        name: "",
        price: "",
        chef: "",
        img_url: "",
        material: []
      },
      categoryList: [],
      dinnerList: [],
      rules: {},
      isOpen: this.visible,
      dialogVisible: false,
      dialogImageUrl: "",
      limit: 1,
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        }
      }
    };
  },
  watch: {
    visible(val) {
      this.isOpen = val;
    }
  },
  methods: {
    _add() {
      $axios
        .post("/v1/food/save", this.formdata)
        .then(res => {
          this.handleClose();
          console.log(res);
        })
        .catch(err => console.log(err));
    },
    getDinnersList(canteen_id) {
      $axios
        .get(`/v1/canteen/dinners?canteen_id=${canteen_id}`)
        .then(res => {
          this.dinnerList = Array.from(res.data);
        })
        .catch(err => console.log(err));
    },
    getCategoryList(dinner_id) {
      $axios
        .get(`/v1/menus/dinner?dinner_id=${dinner_id}`)
        .then(res => (this.categoryList = Array.from(res.data)))
        .catch(err => console.log(err));
    },
    handleClose() {
      this.$emit("closeDialog", false);
    },
    handleChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limit;
    },
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limit;
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file, fileList) {
      this.hideUpload = fileList.length >= this.limit;
      this.formdata.img_url = res.data.url;
    }
  }
};
</script>

<style lang="scss" scoped>
.imgs {
  height: 150px;
  width: 100%;
  .el-image {
    width: 100%;
    height: 100%;
  }
}
</style>