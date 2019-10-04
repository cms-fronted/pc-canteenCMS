<template>
  <el-dialog
    title="菜品管理"
    :visible.sync="isOpen"
    class="diaForm"
    :show="show"
    width="40%"
    @close="handleClose"
  >
    <el-select v-model="value" placeholder="请选择" style="width:120px">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select v-model="value" placeholder="请选择" style="width:120px">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select v-model="value" placeholder="请选择" style="width:120px">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-form ref="cuisineManageForm" :model="formdata" :rules="rules" label-width="80px">
      <el-form-item label="菜品名称" prop="name">
        <el-input type="text" v-model="formdata.name"></el-input>
      </el-form-item>
      <el-form-item label="菜品单价" prop="price">
        <el-input type="text" v-model="formdata.price"></el-input>
      </el-form-item>
      <el-form-item label="主厨" prop="chef">
        <el-input type="text" v-model="formdata.chef"></el-input>
      </el-form-item>
      <!-- <el-form-item label="介绍" prop="desc" >
        <el-input type="text" v-model="formdata.desc"></el-input>
      </el-form-item>-->
      <el-form-item label="图片" prop="img_url">
        <div class="imgs">
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
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClick">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean
    },
    editData: Object
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        }
      ],
      value: "",
      formdata: {
        name: "",
        price: "",
        desc: "",
        chef: "",
        img_url: ""
      },
      rules: {},
      isOpen: this.visible,
      dialogVisible: false,
      dialogImageUrl: "",
      limit: 1
    };
  },
  watch: {
    visible(val) {
      this.formdata = Object.assign({}, this.formdata, this.editData);
      this.isOpen = val;
    }
  },
  methods: {
    handleClick() {
      this.$refs["cuisineManageForm"].resetFields();
    },
    handleClose() {
      this.$emit("closeDialog", false);
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

<style lang="scss" scoped>
.el-select {
  margin: 0 20px 10px 40px;
}
.imgs {
  height: 150px;
  width: 100%;
  .el-image {
    width: 100%;
    height: 100%;
  }
}
</style>