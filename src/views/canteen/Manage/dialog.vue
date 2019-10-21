<template>
  <el-dialog :visible.sync="isOpen" :title="title" @close="handleClose">
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
        <el-input v-model="formdata.stock" v-if="formdata.stock" :disabled="disabled"></el-input>
        <el-input v-model="formdata.count" v-else :disabled="disabled"></el-input>
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
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    },
    visible: {
      type: Boolean
    },
    editData: Object,
    reivseParam: Object,
    disabled: {
      type: Boolean,
      default: false
    },
    state: String
  },
  data() {
    return {
      isOpen: this.visible,
      companyList: [],
      formdata: {},
      dialogVisible: false,
      dialogImageUrl: "",
      limit: 1,
      param: {},
      requiredParam: {}
    }
  },
  methods: {
    handleClose(){
      this.$emit('closeDialog',false);
      this.formdata = {}
    },
    handlePictureCardPreview(file){
      this.dialogImageUrl = file.url;
      console.log('this.dialogImageUrl')
      console.log(this.dialogImageUrl)
      this.dialogVisible = true;
    },
    handleRemove(file, fileList){
      // console.log(file, fileList);
    },
    handleSuccess(res, file, fileList){
      if(res.code === 200){
        this.formdata.image = res.data.url;
      }
    },
    handleClick(){
      if(this.state === 'revise'){
        this.requiredParam = Object.assign({},this.param, this.formdata);
        this.formdata = {};
        this.$emit('confirm',this.requiredParam);
      }else if(this.state === 'add'){
        this.$emit('confirm',this.formdata);
        this.formdata = {};
      }
      
    }
  },
  watch: {
    visible(val){
      this.formdata = Object.assign({},this.formdata, this.editData);
      this.isOpen = val;
      this.dialogImageUrl = this.formdata.image;
      // this.dialogVisible = true;
      console.log(this.formdata)
      console.log(this.dialogImageUrl)
    },
    reivseParam(val){
      this.param = Object.assign({},this.param, this.reivseParam);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>