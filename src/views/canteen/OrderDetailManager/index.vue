<template>
  <div>
    <div class="shop-order-detail-manager">
      <div class="nav-title">订单明细查询</div>
      <el-divider></el-divider>
      <div class="main clearfix">
        <div class="main-header">
          <div class="select-title">
            <el-form :model="queryform" :inline="true">
              <el-form-item label="姓名：">
                <el-input placeholder="请输入姓名" v-model="queryform.name" style="width:217px"></el-input>
              </el-form-item>
              <el-form-item label="手机号码：">
                <el-input placeholder="请输入手机号码" v-model="queryform.phone" style="width:217px"></el-input>
              </el-form-item>
              <el-form-item label="所属企业：" v-if="companiesVisible">
                <el-select v-model="queryform.company_id" placeholder="请选择企业">
                  <el-option
                    v-for="item in companyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门：" v-if="companiesVisible">
                <el-select v-model="queryform.department_id" placeholder="请选择部门">
                  <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开始时间：">
                <el-date-picker v-model="queryform.begin_time" style="width:217px" type="datetime"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间：">
                <el-date-picker v-model="queryform.end_time" style="width:217px" type="datetime"></el-date-picker>
              </el-form-item>
              <el-form-item label="状态：">
                <el-select v-model="queryform.goodsState" placeholder="请选择状态">
                  <el-option
                    v-for="item in queryform.stateList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品类型：">
                <el-select v-model="queryform.type" placeholder="请选择商品">
                  <el-option
                    v-for="item in queryform.categoryList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品名称：">
                <el-select v-model="queryform.goodsName" placeholder="请选择商品名称">
                  <el-option
                    v-for="item in queryform.goodList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="btn-area">
            <el-button type="primary" @click="deriveData">导出</el-button>
            <el-button type="primary" @click="fetchTableList">查询</el-button>
          </div>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border>
            <el-table-column label="序号" prop="ordinal"></el-table-column>
            <el-table-column label="下单时间" prop="begin_time"></el-table-column>
            <el-table-column label="结束时间" prop="end_time"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="手机号码" prop="phone"></el-table-column>
            <el-table-column label="类型" prop="goodsType"></el-table-column>
            <el-table-column label="商品名称" prop="goodsName"></el-table-column>
            <el-table-column label="单位" prop="goodsUnit"></el-table-column>
            <el-table-column label="商品数量" prop="goodsStock"></el-table-column>
            <el-table-column label="商品金额(元)" prop="goodsPrice"></el-table-column>
            <el-table-column label="状态" prop="goodsState"></el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
            <!-- 用户打印的话，发送请求到后台，后台返回一个地址，然后进行下载 -->
            <el-table-column label="打印">
              <template slot-scope="props">
                <el-button
                  size="mini"
                  @click="handleEdit(props.$index, props.row)"
                  v-if="props.row.print"
                >打印</el-button>
                <span v-else>/</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 姓名  name 手机号 phone 商品类型 type 部门 department 企业 company
// 开始时间：begin_time 结束时间 end_time 状态 goodsState  商品名称 goodsName
// l列表的信息
// 序号 下单时间 结束时间 姓名 手机号 类型 商品名称 状态
// 单位 unit  商品数量 stock 商品金额 price  地址 address 打印 print  备注 remark
import $axios from "@/api/index";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";
export default {
  data() {
    return {
      grade: store.getters.grade,
      companyList: [],
      departmentList: [],
      queryform: {
        name: "",
        phone: "",
        type: "",
        categoryList: [],
        department_id: "",
        company_id: "",
        begin_time: "",
        end_time: "",
        goodsState: "",
        stateList: [
          { name: "全部", label: "全部" },
          { name: "已完成", label: "已完成" },
          { name: "已取消", label: "已取消" },
          { name: "待取货", label: "待取货" },
          { name: "待送货", label: "待送货" }
        ],
        goodsName: "",
        goodList: []
      },
      tableData: [
        {
          ordinal: "1",
          begin_time: "2019-05-25  8:30",
          end_time: "2019-05-25  8:35",
          name: "test1",
          phone: "13547546780",
          goodsType: "蔬菜、水果",
          goodsName: "白菜、西洋菜",
          goodsUnit: "斤",
          goodsStock: "10",
          goodsPrice: "5",
          goodsState: "已取消",
          address: "白石大道东11号",
          print: true,
          remark: "/"
        },
        {
          ordinal: "2",
          begin_time: "2019-06-25  8:30",
          end_time: "2019-06-25  8:35",
          name: "test2",
          phone: "13547546580",
          goodsType: "蔬菜",
          goodsName: "西洋菜",
          goodsUnit: "斤",
          goodsStock: "10",
          goodsPrice: "3",
          goodsState: "待取货",
          address: "/",
          print: false,
          remark: "xxx"
        }
      ]
    };
  },
  computed: {
    companiesVisible() {
      return this.grade !== 3;
    }
  },
  created() {
    if (this.companiesVisible) {
      this.getCompanies();
    }
  },
  methods: {
    getCompanies() {
      $axios
        .get("/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          let allCompanies = [];
          let companiesList = getAllOptions(flatten(arr));
          this.companyList = companiesList;
        })
        .catch(err => console.log(err));
    },
    getDepartmentList(company_id) {
      if (company_id) {
        $axios
          .get(`v1/departments?c_id=${company_id}`)
          .then(res => {
            let arr = res.data;
            let departmentList = unshiftAllOptions(flatten(arr));
            this.departmentList = departmentList;
          })
          .catch(err => console.log(err));
      }
    },
    handleEdit(index, row) {
      console.log(row);
      console.log("打印按钮被你点击啦！");
    },
    fetchTableList() {
      console.log("获取查询后的列表");
    },
    deriveData() {
      console.log("点击导出表格");
    }
  }
};
</script>

<style lang="scss" scpoed>
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.shop-order-detail-manager {
  .main-header {
    .select-title {
      float: left;
      width: 90%;
      display: flex;
      flex-wrap: wrap;
    }
    .btn-area {
      float: right;
      width: 10%;
      display: flex;
      flex-direction: column;
      .el-button {
        margin-bottom: 20px;
      }
    }
  }
  .main-content {
    .el-table {
      th,
      td {
        text-align: center;
      }
    }
  }
}
</style>
