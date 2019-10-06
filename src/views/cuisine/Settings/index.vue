<template>
  <div class="setting">
    <div class="nav-title">菜单设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <span class="content-header">所属公司：</span>
        <el-select v-model="company_id" placeholder="请选择" style="width:150px">
          <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span class="content-header">类型：</span>
        <el-select v-model="value" placeholder="请选择" style="width:150px">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button @click="AddVisible = true">新增</el-button>
      </div>
      <div class="main-content">
        <el-table style="width:100%">
          <el-table-column label="公司级别"></el-table-column>
          <el-table-column label="公司名称"></el-table-column>
          <el-table-column label="消费地点"></el-table-column>
          <el-table-column label="餐类"></el-table-column>
          <el-table-column label="菜类明细"></el-table-column>
          <el-table-column label="状态"></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="AddVisible" title="新增菜单">
      <el-form ref="addMenuForm" :model="menuForm" label-width="100px">
        <el-form-item label="饭堂">
          <el-select v-model="menuForm.c_id" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="餐次">
          <el-checkbox-group v-model="menuForm.name">
            <el-checkbox :label="1">早餐</el-checkbox>
            <el-checkbox :label="2">午餐</el-checkbox>
            <el-checkbox :label="3">晚餐</el-checkbox>
            <el-checkbox :label="4">宵夜</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="菜类名称">
          <el-input
            v-for="(item, index) in listObj"
            :key="index"
            :disabled="item.disabled"
            v-model="item.category"
          ></el-input>
          <el-button @click="addListObjItem">添加</el-button>
        </el-form-item>
        <el-form-item label="选菜数量状态">
          <el-radio-group v-model="menuForm.status" @change="changeStatus">
            <el-radio :label="1">固定</el-radio>
            <el-radio :label="2">动态</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="menuForm.number" :disabled="isMoving"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
export default {
  data() {
    return {
      companyList: [],
      company_id: "",
      listObj: [{ category: "", disabled: false }],
      value: "",
      AddVisible: false,
      isMoving: true,
      detail: [],
      menuForm: {
        c_id: "",
        name: [],
        status: 1,
        dinner_name: "",
        number: 0,
        detail: []
      },
      options: []
    };
  },
  watch: {
    listObj: function() {}
  },
  created() {
    this.getCanteenList();
    this.fetchCompanyList();
  },
  methods: {
    fetchCompanyList() {
      $axios
        .get("/v1/companies")
        .then(res => {
          this.companyList = Array.from(res.data.data);
        })
        .catch(err => console.log(err));
    },
    addListObjItem() {
      let len = this.listObj.length;
      if (!!this.listObj[len - 1].category) {
        this.listObj[len - 1].disabled = true;
        this.detail.push({
          category: this.listObj[len - 1].category,
          count: this.menuForm.number,
          status: this.menuForm.status
        });
        this.menuForm.detail = JSON.stringify(this.detail);
        this.listObj.push({ category: "", disabled: false });
      }
    },
    handleClose() {
      this.AddVisible = false;
      this.listObj = [{ category: "", disabled: false }];
      this.menuForm = {
        c_id: "",
        name: [],
        status: 1,
        dinner_name: "",
        number: 0,
        detail: []
      };
      this.isMoving = true;
    },
    handleClick() {
      console.log(this.menuForm);
      $axios
        .post("/v1/menu/save", this.menuForm)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    changeStatus() {
      this.isMoving = !this.isMoving;
      this.menuForm.number = this.isMoving == 1 ? 0 : "";
    },
    getCanteenList() {
      $axios
        .get("/v1/canteens/company", {
          company_id: 3
        })
        .then(res => {
          this.options = res.data.canteens;
        });
    },

    rowspan(idx, prop) {
      this.spanArr[idx] = [];
      this.position = 0;
      this.dataList.forEach((item, index) => {
        if (index === 0) {
          this.spanArr[idx].push(1);
          this.position = 0;
        } else {
          if (this.dataList[index][prop] === this.dataList[index - 1][prop]) {
            this.spanArr[idx][this.position] += 1; //有相同项
            this.spanArr[idx].push(0); // 名称相同后往数组里面加一项0
          } else {
            this.spanArr[idx].push(1); //同列的前后两行单元格不相同
            this.position = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      for (let i = 0; i < 3 /* 对应rowspan -> idx的长度 */; i++) {
        if (columnIndex === i) {
          const _row = this.spanArr[i][rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        }
      }
    }
  }
};
</script>

<style>
</style>