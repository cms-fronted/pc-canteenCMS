<template>
  <div class="canteen-statistics">
    <div class="nav-title">消费订单汇总查询</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <div class="select-title">
          <el-form :inline="true" :model="formdata" label-width="80px">
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
            <el-form-item label="商品类型">
              <el-select v-model="formdata.good_type">
                <el-option
                  v-for="item in goodsTypeOptions"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-select v-model="formdata.good_name">
                <el-option
                  v-for="(item,index) in goodsOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formdata.state">
                <el-option
                  v-for="item in goodStateOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="types-radio">
              <el-radio-group v-model="formdata.sum_order" @change="queryList(current_page)">
                <el-radio label="dept_name">按类型汇总</el-radio>
                <el-radio label="usr_name">按商品汇总</el-radio>
                <el-radio label="state">按状态汇总</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-area">
          <el-button type="primary" @click="queryList" :disabled="isDisabled">查询</el-button>
          <el-button type="primary">导出</el-button>
        </div>
      </div>
      <div class="main-content">
        <el-table border :data="tableData">
          <el-table-column label="序号" prop="id"></el-table-column>
          <el-table-column label="统计变量" prop="sum"></el-table-column>
          <el-table-column label="下单时间" prop="time_begin"></el-table-column>
          <el-table-column label="结束时间" prop="time_end"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="部门" prop="department"></el-table-column>
          <el-table-column label="类型" prop="good_type"></el-table-column>
          <el-table-column label="商品名称" prop="good_name"></el-table-column>
          <el-table-column label="单位" prop="unit"></el-table-column>
          <el-table-column label="数量" prop="count"></el-table-column>
          <el-table-column label="商品总金额" prop="price"></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
        </el-table>
        <pagination
          :total="total"
          :pageSize="size"
          @pagination="queryList"
          :currentPage="current_page"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
const good_state = [
  { id: 1, name: "已完成" },
  { id: 2, name: "未完成" },
  { id: 3, name: "待取货" },
  { id: 4, name: "已取货" }
];
export default {
  components: { Pagination },
  data() {
    return {
      company_id: "",
      canteen_id: "",
      formdata: {},
      goodsTypeOptions: [],
      goodsOptions: [],
      goodStateOptions: good_state,
      tableData: [],
      isDisabled: true,
      current_page: 1,
      size: 10,
      total: 0
    };
  },
  computed: {
    isAble() {
      return (
        !!this.formdata.time_end &&
        !!this.formdata.time_begin &&
        !!this.formdata.company_ids
      );
    }
  },
  watch: {
    isAble(val) {
      this.isDisabled = !val;
    }
  },
  methods: {
    async queryList(page) {
      page = page || 1;
      const res = await $axios.get("/v1/shop/cms/products", this.formdata); //待对接
      if (res.msg === "ok") {
        this.tableData = Array.from(res.data.data);
        this.total = res.data.total;
        this.current_page = res.data.current_page;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.canteen-statistics {
  .select-title {
    float: left;
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    .el-input {
      width: 220px;
    }
    .el-select {
      width: 220px;
    }
    .types-radio {
      display: flex;
      justify-content: space-between;
      .el-radio-group {
        display: block;
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