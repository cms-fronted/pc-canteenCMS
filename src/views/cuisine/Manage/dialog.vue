<template>
  <el-dialog
    title="新增"
    :visible.sync="isOpen"
    class="diaForm"
    width="40%"
    @close="handleClose"
  >
    <el-dialog
      :visible.sync="materialDialogVisible"
      width="20%"
      title="添加材料"
      center
      append-to-body
    >
      <el-form ref="materialForm" :model="materialForm" label-width="60px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="materialForm.name"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="materialForm.count"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="materialDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="_addMaterial">确 定</el-button>
      </span>
    </el-dialog>
    <el-form
      ref="cuisineManageForm"
      :model="formdata"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="饭堂名称" prop="canteen_id">
        <el-select
          v-model="formdata.c_id"
          placeholder="请选择"
          style="width:120px"
          @change="getDinnersList"
        >
          <el-option
            v-for="item in canteenList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="餐次" prop="dinner_id">
        <el-select
          v-model="formdata.dinner_id"
          placeholder="请选择"
          style="width:120px"
          @change="getCategoryList"
        >
          <el-option
            v-for="item in dinnerList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="m_id">
        <el-select
          v-model="formdata.m_id"
          placeholder="请选择"
          style="width:120px"
        >
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
            action="https://tonglingok.com/canteen/api/v1/image/upload"
            list-type="picture-card"
            ref="addUpload"
            name="image"
            :limit="limit"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :class="{ hide: hideUpload }"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </div>
      </el-form-item>
    </el-form>
    <el-card class="box-card" body-style="paddingBottom: 5px">
      <div slot="header" class="clearfix">
        <span>材料数量</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="materialDialogVisible = true"
          >添加材料</el-button
        >
      </div>
      <el-table :data="material" style="width:100%" size="mini">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="数量" prop="count"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button size="small" type="text">编辑</el-button>
            <el-button
              size="small"
              type="text"
              @click="_deleteMaterial(scoped.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
    canteenList: Array,
    c_id: [String, Number]
  },
  data() {
    return {
      materialDialogVisible: false,
      value: "",
      c_list: [],
      hideUpload: false,
      formdata: {
        f_type: 2,
        c_id: "",
        dinner_id: "",
        m_id: "",
        name: "",
        price: "",
        des: ".",
        chef: "",
        img_url: "",
        material: ""
      },
      materialForm: {
        count: "",
        name: ""
      },
      material: [],
      categoryList: [],
      dinnerList: [],
      rules: {},
      isOpen: this.visible,
      dialogVisible: false,
      dialogImageUrl: "",
      limit: 1
    };
  },
  watch: {
    visible(val) {
      this.isOpen = val;
    }
  },
  methods: {
    async _add() {
      this.formdata = { ...this.formdata };
      this.formdata.material = JSON.stringify(this.material);
      const res = await $axios.post(
        "https://tonglingok.com/canteen/api/v1/food/save",
        this.formdata
      );
      if (res.msg == "ok") {
        this.$message.success("操作成功！");
        this.handleClose();
        await this.$emit("updateList");
      } else {
        this.$message.error(res.msg);
      }
    },
    _addMaterial() {
      this.material.push({ ...this.materialForm });
      this.materialDialogVisible = false;
      this.$refs.materialForm.resetFields();
    },
    getDinnersList(c_id) {
      this.formdata.dinner_id = "";
      this.formdata.m_id = "";
      $axios
        .get(
          `https://tonglingok.com/canteen/api/v1/canteen/dinners?canteen_id=${c_id}`
        )
        .then(res => {
          this.dinnerList = Array.from(res.data);
        })
        .catch(err => console.log(err));
    },
    getCategoryList(dinner_id) {
      this.formdata.m_id = "";
      $axios
        .get(
          `https://tonglingok.com/canteen/api/v1/menus/dinner?dinner_id=${dinner_id}`
        )
        .then(res => (this.categoryList = Array.from(res.data)))
        .catch(err => console.log(err));
    },
    _deleteMaterial(row) {
      this.material = this.material.filter(item => {
        return item.name != row.name;
      });
    },
    handleClose() {
      this.$refs.cuisineManageForm.resetFields();
      this.$refs.addUpload.clearFiles();
      this.hideUpload = false;
      this.material = new Array();
      this.$emit("closeDialog", false);
    },
    handleChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limit;
    },
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limit;
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
