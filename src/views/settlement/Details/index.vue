<template>
  <div>
    <div class="settlement-details">
      <div class="main">
        <div class="nav-title">消费明细</div>
        <el-divider></el-divider>
        <div class="main-header">
          <div class="select-title">
            <el-form :inline="true" :model="formdata" label-width="60px" label-position="left">
              <el-form-item label="开始">
                <el-date-picker
                  v-model="formdata.time_begin"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束">
                <el-date-picker
                  v-model="formdata.time_end"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="公司" v-if="companiesVisible">
                <el-select v-model="formdata.company_ids" @change="getOptions" placeholder="请选择公司">
                  <el-option
                    v-for="item in companyOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="消费地点" label-width="80px">
                <el-select
                  v-model="formdata.canteen_id"
                  @change="getDinnersOptions"
                  placeholder="请选择饭堂"
                >
                  <el-option
                    v-for="item in canteenOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="餐次">
                <el-select v-model="formdata.dinner_id" placeholder="请选择餐次">
                  <el-option
                    v-for="item in dinnersOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门" prop="department_id"  v-if="companiesVisible">
                <el-select v-model="formdata.department_id" placeholder="请选择部门">
                  <el-option
                    v-for="item in departmentOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input placeholder="请输入姓名" style="80px" v-model="formdata.name"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" label-width="80px">
                <el-input placeholder="请输入手机号码" v-model="formdata.phone"></el-input>
              </el-form-item>
              <el-form-item label="消费类型" label-width="80px" prop="consumption_type">
                <el-select v-model="formdata.consumption_type" placeholder="请选择类型">
                  <el-option label="订餐就餐" :value="1"></el-option>
                  <el-option label="订餐未就餐" :value="2"></el-option>
                  <el-option label="未订餐就餐" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="btn-area">
            <el-button type="primary" @click="queryList(1)" :disabled="isDisabled">查询</el-button>
            <el-button type="primary">导出</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="序号" width="50"></el-table-column>
        <el-table-column prop="create_date" label="下单时间" width="180"></el-table-column>
        <el-table-column prop="place" label="消费地点"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="c_name" label="商品名称"></el-table-column>
        <el-table-column prop="num" label="商品数量"></el-table-column>
        <el-table-column prop="price" label="商品金额"></el-table-column>
        <el-table-column prop="deliver_way" label="配送方式"></el-table-column>
        <el-table-column prop="note" label="备注" width="300"></el-table-column>
      </el-table>
      <pagination
        :total="total"
        :pageSize="size"
        :currentPage="current_page"
        @pagination="queryList"
      ></pagination>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from '@/store';
export default {
  components: { Pagination },
  data() {
    return {
      grade: store.getters.grade,
      formdata: {
        company_ids: null,
        canteen_id: null,
        department_id: null,
        dinner_id: null,
        time_begin: "",
        time_end: "",
        phone: null,
        name: null,
        consumption_type: null
      },
      current_page: 1,
      size: 10,
      total: 0,
      tableData: [],
      canteenOptions: [],
      companyOptions: [],
      departmentOptions: [],
      dinnersOptions: [],
      isDisabled: true
    };
  },
  created() {
    if(this.companiesVisible){
      this.getCompanyOptions();
    }else{
      this.getCanteenOptions();
    }
  },
  methods: {
    getOptions(company_ids) {
      this.canteenOptions = [];
      this.dinnersOptions = [];
      this.departmentOptions = [];
      this.formdata.canteen_id = "";
      this.formdata.dinner_id = "";
      this.formdata.department_id = "";
      if (!Number(company_ids)) return;
      this.getCanteenOptions(company_ids);
      this.getDepartmentOptions(company_ids);
    },
    async getCompanyOptions() {
      const res = await $axios.get("http://canteen.tonglingok.com/api/v1/admin/companies");
      if (res.msg === "ok") {
        this.companyOptions = getAllOptions(flatten(res.data));
      }
    },
    async getCanteenOptions(company_ids) {
      let res;
      if(company_ids){
        res = await $axios.get(
          `http://canteen.tonglingok.com/api/v1/canteens?company_id=${company_ids}`
        );
      }else{
        res = await $axios.get("http://canteen.tonglingok.com/api/v1/managerCanteens");
      }
      if (res.msg === "ok") {
        this.canteenOptions = unshiftAllOptions(Array.from(res.data)); //给数组添加一个全部option
      }
    },
    async getDepartmentOptions(company_ids) {
      const res = await $axios.get(`v1/departments?c_id=${company_ids}`);
      if (res.msg === "ok") {
        this.departmentOptions = unshiftAllOptions(flatten(res.data));
      }
    },
    async getDinnersOptions(canteen_id) {
      //饭堂不为全部时， 0 为全部
      if (canteen_id) {
        const res = await $axios.get(
          `http://canteen.tonglingok.com/api/v1/canteen/dinners?canteen_id=${canteen_id}`
        );
        if (res.msg === "ok") {
          this.dinnersOptions = unshiftAllOptions(Array.from(res.data));
        }
      }
    },
    async queryList(page) {
      page = page || 1;
      const res = await $axios.get(
        `http://canteen.tonglingok.com/api/v1/order/orderSettlement?page=${page}&size=${this.size}`,
        this.formdata
      );
      if (res.msg === "ok") {
        this.tableData = [...res.data.data];
        this.total = res.data.total;
        this.current_page = res.data.current_page;
      }
    }
  },
  computed: {
    isAble() {
      return (
        !!this.formdata.time_end &&
        !!this.formdata.time_begin &&
        !!this.formdata.company_ids
      );
    },
    companiesVisible(){
      return this.grade !== 3;
    }
  },
  watch: {
    isAble(val) {
      this.isDisabled = !val;
    }
  }
};
</script>

<style lang="scss" scoped>
.settlement-details {
  .main-header {
    .select-title {
      float: left;
      width: 90%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-input {
        width: 160px;
      }
      .el-select {
        width: 160px;
      }
    }
  }
  .btn-area {
    float: right;
    width: 10%;
    display: flex;
    flex-direction: column;
    display: block;
    .el-button {
      margin-bottom: 20px;
    }
  }
}
</style>