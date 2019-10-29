<template>
  <div>
    <div class="supplement">
      <div class="nav-title">补录管理</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <div class="select-title">
            <span class="content-header">人员信息</span>
            <el-input class="filter-input" v-model="filterText" placeholder="输入人员信息"  style="width:200px"></el-input>
            <el-button type="primary">查询</el-button>
            <el-button type="primary">批量补录</el-button>
          </div>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border>
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column label="公司" prop="company"></el-table-column>
            <el-table-column label="归属饭堂" prop="canteen"></el-table-column>
            <el-table-column label="部门" prop="department"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="员工编号" prop="code"></el-table-column>
            <el-table-column label="卡号" prop="card_num"></el-table-column>
          </el-table>
          <div class="supply-form">
            <el-form :inline="true" :model="formdata" label-width="80px">
              <el-form-item label="消费地点">
                <el-select v-model="formdata.canteen_id" style="width:200px" placeholder="请选择消费地点">
                  <el-option
                    v-for="item in canteenList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消费日期">
                <el-date-picker
                  v-model="formdata.time"
                  style="width:200px"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="消费餐次">
                <el-select v-model="formdata.dinner_id" style="width:200px" placeholder="请选择消费餐次">
                  <el-option
                    v-for="item in dinnersList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消费金额">
                <el-input placeholder="请输入消费金额" v-model="formdata.money"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input placeholder="请输入备注" v-model="formdata.remark"></el-input>
              </el-form-item>
              <div class="radio-area">
                <el-radio v-model="formdata.radio" label="1">补充</el-radio>
                <el-radio v-model="formdata.radio" label="2">补扣</el-radio>
              </div>
            </el-form>
            <div class="btn-area">
              <el-button type="primary">取消</el-button>
              <el-button type="primary">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <el-dialog title="批量充值" :visible.sync="dialogFormVisible">
        <div class="dialog-header clearfix">
          <span class="download">下载模板：<a href="#" download>补录管理模板.xls</a></span>
          <el-upload
            class="upload-excel upload"
            ref="upload"
            :limit="limit"
            :headers="header"
            :show-file-list="false"
            accept=".xls,.xlsx"
            action=""
            :on-success='handleSuccess'
            :data="{}"
            name=""
            >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
export default {
  data(){
    return {
      filterText: "",
      tableData: [
        {company:"A企业",canteen:"大饭堂",department:"后勤部",username:"张三三",code:"aaaaaaaa",card_num:"122324"},
        {company:"B企业",canteen:"中饭堂",department:"后勤部",username:"李四",code:"aaaaaaaa",card_num:"122324"},
        {company:"C企业",canteen:"小饭堂",department:"后勤部",username:"王五",code:"aaaaaaaa",card_num:"122324"}
      ],
      formdata: {
        canteen_id: "",
        time: "",
        dinner_id: "",
        money: "",
        remark: "",
        radio: "1",
      },
      canteenList: [],
      dinnersList: [],
      dialogFormVisible: true
    }
  },
  created(){
    this.fetchCanteenList();
  },
  methods: {
    fetchCanteenList(){
      // 不确定消费地点的接口是否是这个
      /* $axios
        .get("/v1/company/consumptionLocation")
        .then(res => {
          console.log(res)
          this.canteenList = res.data;
        })
        .catch(error => console.log(err)); */
    }
  }
}
</script>

<style lang="scss" scpoed>
  .main-header{
    .content-header{
      padding: 12px 10px;
    }
  }
  .main-content{
    .supply-form{
      position: relative;
      height: 180px;
      margin-top: 20px;
      padding: 20px;
      background: #fff;
      .radio-area{
        display: inline-block;
        padding: 11px 0;
        margin-left: 10px;
      }
      .btn-area{
        position: absolute;
        left: 50%;
        transform: translateX(-50%); 
      }
      .el-button+.el-button {
        margin-left: 30px;
      }
    }
  }
</style>

  