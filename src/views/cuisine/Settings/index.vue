<template>
  <div class="setting">
    <div class="nav-title">菜单设置</div>
    <el-divider></el-divider>
    <div class="main">
      <div class="main-header">
        <span class="content-header">所属公司：</span>
        <el-select
          v-model="company_id"
          placeholder="请选择"
          style="width:150px"
          @change="getCanteenList(company_id)"
        >
          <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span class="content-header">消费地点：</span>
        <el-select v-model="canteen_id" placeholder="请选择" style="width:150px">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button @click="AddVisible = true">新增</el-button>
        <el-button @click="fetchTableList">查询</el-button>
      </div>
      <div class="main-content">
        <el-table style="width:100%" :data="tableList" :span-method="objectSpanMethod">
          <el-table-column label="公司级别" prop="grade"></el-table-column>
          <el-table-column label="公司名称" prop="company_name"></el-table-column>
          <el-table-column label="消费地点" prop="canteen_name"></el-table-column>
          <el-table-column label="餐类" prop="category_name"></el-table-column>
          <el-table-column label="菜类明细" prop="category"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.status" disabled>
                <el-radio :label="1">固定</el-radio>
                <el-radio :label="2">动态</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="可选菜品" prop="number"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="_delete(scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="AddVisible" title="新增菜单">
      <el-form ref="addMenuForm" :model="menuForm" label-width="100px">
        <el-form-item label="饭堂">
          <el-select
            v-model="menuForm.c_id"
            placeholder="请选择"
            @change="getCanteenDetail(menuForm.c_id)"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="餐次">
          <el-checkbox-group v-model="menuForm.name">
            <el-checkbox v-for="item in canteen_detail" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            <!-- <el-checkbox :label="1">早餐</el-checkbox> -->
            <!-- <el-checkbox :label="2">午餐</el-checkbox> -->
            <!-- <el-checkbox :label="3">晚餐</el-checkbox> -->
            <!-- <el-checkbox :label="4">宵夜</el-checkbox> -->
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
import { async } from "q";
export default {
  data() {
    return {
      companyList: [],
      company_id: "",
      canteen_id: "",
      canteen_detail: [],
      listObj: [{ category: "", disabled: false }],
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
      options: [],
      tableList: [],
      spanArr: [], //二维数组，用于存放单元格合并规则
      position: 0 //用于存储相同项的开始index
    };
  },
  watch: {
    listObj: function() {}
  },
  created() {
    // this.getCanteenList();
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
      /*新增input框*/
      let len = this.listObj.length;
      if (!!this.listObj[len - 1].category) {
        this.listObj[len - 1].disabled = true;
        this.detail.push({
          category: this.listObj[len - 1].category,
          count: this.menuForm.number,
          status: this.menuForm.status
        });
        console.log(this.detail);
        this.menuForm.detail = JSON.stringify(this.detail);
        console.log(this.menuForm.detail);
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
      $axios
        .post("/v1/menu/save", this.menuForm)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    changeStatus() {
      this.isMoving = !this.isMoving;
      this.menuForm.number = this.isMoving == 1 ? 0 : "";
    },
    fetchTableList() {
      $axios
        .get(`/v1/menus/company?company_id=${this.company_id}&canteen_id=${this.canteen_id}`)
        .then(res => {
          let _data = Array.from(res.data.data);
          let _list = [];
          _data.forEach(i => {
            i.dinner.forEach(j => {
              j.menus.forEach(k => {
                _list.push({
                  grade: i.company.grade,
                  company_name: i.company.name,
                  company_id: i.company.id,
                  id: j.id,
                  canteen_name: i.name,
                  category_name: j.name, //早餐，午餐，晚餐
                  category: k.category, //荤菜，素菜，汤
                  status: k.status,
                  number: k.count
                });
              });
            });
          });
          this.tableList = Array.from(_list);
          this.rowspan(0, "grade");
          this.rowspan(1, "company_name");
          this.rowspan(2, "canteen_name");
          this.rowspan(3, "category_name");
        })
        .catch(err => console.log(err));
    },
    getCanteenList(id) {
      this.canteen_id = "";
      this.menuForm.c_id = "";
      $axios
        .get("/v1/canteens/company", {
          company_id: id
        })
        .then(res => {
          this.options = res.data.canteens;
        });
    },
    getCanteenDetail(canteen_id) {
      $axios
        .get(`/v1/menus/canteen?canteen_id=${canteen_id}`)
        .then(res => this.canteen_detail = Array.from(res.data))
        .catch(err => console.log(err));
    },
    handleEdit(val) {
      console.log(val);
    },
    rowspan(idx, prop) {
      this.spanArr[idx] = [];
      this.position = 0;
      console.log(this.tableList);
      this.tableList.forEach((item, index) => {
        if (index === 0) {
          this.spanArr[idx].push(1);
          this.position = 0;
        } else {
          if (this.tableList[index][prop] === this.tableList[index - 1][prop]) {
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
      for (let i = 0; i < 4 /* 对应rowspan -> idx的长度 */; i++) {
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