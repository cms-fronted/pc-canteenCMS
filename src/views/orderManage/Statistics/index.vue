<template>
  <div>
    <div class="statistics">
      <div class="nav-title">订餐统计</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <div class="select-title">
            <el-form
              :inline="true"
              :model="formdata"
              label-width="40px"
              label-position="left"
            >
              <el-form-item label="开始">
                <el-date-picker
                  v-model="formdata.time_begin"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  style="width:180px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束">
                <el-date-picker
                  v-model="formdata.time_end"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  style="width:180px"
                  type="datetime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="公司">
                <el-select
                  v-model="company_id"
                  placeholder="请选择公司"
                  @change="getCanteenList"
                >
                  <el-option
                    v-for="item in companyOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消费地点" label-width="70px">
                <el-select v-model="canteen_id" placeholder="请选择消费地点">
                  <el-option
                    v-for="item in canteenOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" @click="queryList">查询</el-button>
              <el-button type="primary">导出</el-button>
            </el-form>
          </div>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="tableData" border></el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import { flatten } from "@/utils/flatternArr";
export default {
  data() {
    return {
      formdata: {
        time_begin: "",
        time_end: ""
      },
      company_id: "",
      companyOptions: [],
      canteen_id: "",
      canteenOptions: [],
      tableData: []
    };
  },
  created() {
    this.getCompanies();
  },
  methods: {
    async getCompanies() {
      const res = await $axios.get("/v1/admin/companies", this.queryForm);
      if (res.msg === "ok") {
        this.companyOptions = flatten(res.data);
        console.log(this.canteenOptions);
      }
    },
    getCanteenList(val) {
      this.canteenOptions = [];
      if (String(val).includes(",")) {
        this.canteenList = [{ name: "全部" }];
        this.formdata.canteen_id = "";
      } else {
        this.getCanteenList(val);
      }
    },
    getCanteenList(company_id) {
      if (company_id) {
        $axios
          .get(`/v1/company/consumptionLocation?company_id=${company_id}`)
          .then(res => {
            this.canteenOptions = Array.from(res.data.canteen);
            this.canteenOptions.unshift({ id: 0, name: "全部" });
          })
          .catch(err => console.log(err));
      }
    },
    queryList() {
      $axios
        .get("/v1/order/orderStatistic", {
          company_ids: this.company_id,
          canteen_id: this.canteen_id,
          time_begin: this.formdata.time_begin,
          time_end: this.formdata.time_end,
          page: 1,
          size: 10
        })
        .then(res => {
          console.log(res);
          this.tableData = Array.from(res.data.data);
          /* this.total = res.data.total;
        this.current_page = res.data.current_page; */
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scpoed></style>
