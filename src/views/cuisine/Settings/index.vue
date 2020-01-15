<template>
  <div class="setting">
    <div class="nav-title">菜单设置</div>
    <el-divider />
    <div class="main">
      <div class="main-header">
        <span class="content-header" v-if="companiesVisible">公司：</span>
        <el-select
          v-model="company_id"
          placeholder="请选择"
          filterable
          style="width:150px"
          @change="getLocationList(company_id)"
          v-if="companiesVisible"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <span class="content-header">消费地点：</span>
        <el-select
          v-model="canteen_id"
          placeholder="请选择"
          style="width:150px"
        >
          <el-option
            v-for="item in locationList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button @click="AddVisible = true" style="margin-left:10px"
          >新增</el-button
        >
        <el-button @click="fetchTableList(1)">查询</el-button>
      </div>
      <div class="main-content">
        <el-table
          style="width:100%"
          :data="tableList"
          :span-method="objectSpanMethod"
        >
          <el-table-column label="公司级别" prop="grade" />
          <el-table-column label="公司名称" prop="company_name" />
          <el-table-column label="消费地点" prop="canteen_name" />
          <el-table-column label="餐类" prop="category_name" />
          <el-table-column label="菜类明细" prop="category" />
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.status" disabled>
                <el-radio :label="1">固定</el-radio>
                <el-radio :label="2">动态</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="可选菜品" prop="number" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                style="margin:2px"
                @click="_edit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                style="margin:2px"
                type="danger"
                @click="_delete(scope.row)"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :pageSize="size"
          :currentPage="current_page"
          @pagination="fetchTableList"
        />
      </div>
    </div>
    <el-dialog
      :visible.sync="AddVisible"
      title="新增菜单"
      @close="closeNewMenu"
    >
      <el-form ref="addMenuForm" :model="menuForm" label-width="100px">
        <el-form-item label="饭堂">
          <el-select
            v-model="menuForm.c_id"
            placeholder="请选择"
            @change="getDinnersList"
          >
            <el-option
              v-for="item in locationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="餐次">
          <el-select v-model="menuForm.d_id">
            <el-option
              v-for="item in dinnerList"
              :value="item.id"
              :label="item.name"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜类">
          <div
            v-for="(item, index) in listObj"
            :key="index"
            style="margin:5px 0"
          >
            <el-input
              v-model="item.category"
              :disabled="item.disabled"
              style="width:150px"
            />
            <el-button
              @click.prevent="removeInput(item)"
              icon="el-icon-delete"
              style="marginLeft:5px"
            />
          </div>
          <el-button @click="addListObjItem">添加</el-button>
        </el-form-item>
        <el-form-item label="选菜数量状态">
          <el-radio-group v-model="menuForm.status" @change="changeStatus">
            <el-radio :label="1">固定</el-radio>
            <el-radio :label="2">动态</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量" v-if="menuForm.status === 1">
          <el-input v-model="menuForm.number" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeNewMenu">取 消</el-button>
        <el-button type="primary" @click="addNewMenu">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="editVisible" width="30%" title="编辑菜单" center>
      <el-form :model="editForm" label-width="60px">
        <el-form-item label="菜类" prop="category">
          <el-input v-model="editForm.category" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">固定</el-radio>
            <el-radio :label="2">动态</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量" prop="number" v-if="editForm.status === 1">
          <el-input v-model="editForm.number" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="_editClose">取 消</el-button>
        <el-button type="primary" @click="_editConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $axios from "@/api/index";
import Pagination from "@/components/Pagination";
import { flatten, getAllOptions, unshiftAllOptions } from "@/utils/flatternArr";
import store from "@/store";
export default {
  components: { Pagination },
  data() {
    return {
      grade: store.getters.grade,
      editVisible: false,
      editForm: {
        category: "",
        status: 0,
        number: 0
      },
      companyList: [],
      company_id: "",
      canteen_id: "",
      dinnerList: [],
      listObj: [{ category: "", disabled: false }],
      AddVisible: false,
      isMoving: true,
      detail: [],
      menuForm: {
        c_id: "",
        d_id: [],
        status: 1,
        dinner_name: "",
        number: 0,
        detail: []
      },
      locationList: [],
      tableList: [],
      spanArr: [], //二维数组，用于存放单元格合并规则
      position: 0, //用于存储相同项的开始index
      current_page: 1,
      size: 3,
      total: 10
    };
  },
  watch: {
    listObj: function() {}
  },
  async created() {
    if (this.companiesVisible) {
      await this.getCompanies();
      await this.fetchTableList(1);
    } else {
      await this.getLocationList(0);
      await this.fetchTableList(1);
    }
  },
  computed: {
    companiesVisible() {
      return this.grade !== 3;
    }
  },
  methods: {
    async getCompanies() {
      await $axios
        .get("http://canteen.tonglingok.com/api/v1/admin/companies")
        .then(res => {
          let arr = res.data;
          let allCompanies = [];
          let companiesList = flatten(arr);
          companiesList.forEach(element => {
            let id = element.id;
            allCompanies.push(id);
          });
          allCompanies = allCompanies.join(",");
          companiesList.unshift({
            name: "全部",
            id: allCompanies
          });
          this.companyList = companiesList;
          this.company_id = this.companyList[0].id;
          this.locationList = [{ name: "全部", id: 0 }];
          this.canteen_id = 0;
        })
        .catch(err => console.log(err));
    },
    getLocationList(company_id) {
      this.menuForm.c_id = "";
      this.menuForm.dinner_id = "";
      this.menuForm.m_id = "";
      this.locationList = [{ name: "全部", id: 0 }];
      this.canteen_id = 0;
      if (!isNaN(company_id)) {
        if (company_id) {
          $axios
            .get(
              `http://canteen.tonglingok.com/api/v1/canteens?company_id=${company_id}`
            )
            .then(res => {
              this.locationList = unshiftAllOptions(Array.from(res.data));
              this.canteen_id = this.locationList[0].id;
            })
            .catch(err => console.log(err));
        } else {
          $axios
            .get("http://canteen.tonglingok.com/api/v1/managerCanteens")
            .then(res => {
              this.locationList = unshiftAllOptions(Array.from(res.data));
              this.canteen_id = this.locationList[0].id;
            })
            .catch(err => console.log(err));
        }
      } else {
        this.locationList = [{ name: "全部", id: 0 }];
        this.canteen_id = 0;
        this.categoryList = [];
        this.dinnersList = [];
      }
    },
    getDinnersList(canteen_id) {
      $axios
        .get(
          `http://canteen.tonglingok.com/api/v1/canteen/dinners?canteen_id=${canteen_id}`
        )
        .then(res => {
          this.dinnerList = Array.from(res.data);
        })
        .catch(err => console.log(err));
    },
    removeInput(item) {
      var index = this.listObj.indexOf(item);
      let len = this.listObj.length;
      if (index !== -1) {
        this.listObj.splice(index, 1);
        this.detail.splice(index, 1);
        this.menuForm.detail = JSON.stringify(this.detail);
      }
    },
    addListObjItem() {
      /*新增input框*/
      let len = this.listObj.length;
      if (len == 0) {
        this.listObj.push({ category: "", disabled: false });
        return;
      }
      if (!!this.listObj[len - 1].category) {
        let newCatogry = this.listObj[len - 1];
        if(this.detail.find(item => {
          return item.category === newCatogry.category
        })){
          return this.$message.error("该菜类已存在，请勿重复添加")
        }
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
    closeNewMenu() {
      this.AddVisible = false;
      this.listObj = [{ category: "", disabled: false }];
      this.dinnerList = [];
      this.menuForm = {
        c_id: "",
        name: [],
        status: 1,
        dinner_name: "",
        number: 0,
        detail: []
      };
    },
    async addNewMenu() {
      const res = await $axios.post(
        "http://canteen.tonglingok.com/api/v1/menu/save",
        this.menuForm
      );
      if (res.msg === "ok") {
        this.$message.success("操作成功");
        this.detail = [];
        this.fetchTableList();
        this.closeNewMenu();
      }
    },
    changeStatus() {
      // this.isMoving = !this.isMoving;
      // this.menuForm.number = this.isMoving == 1 ? 0 : "";
    },
    async fetchTableList(page) {
      page = typeof page == "number" ? page : 1;
      await $axios
        .get(
          `http://canteen.tonglingok.com/api/v1/menus/company?company_id=${this.company_id}&canteen_id=${this.canteen_id}&size=${this.size}&page=${page}`
        )
        .then(res => {
          let _data = Array.from(res.data.data);
          this.total = res.data.total;
          let _list = [];
          _data.forEach(i => {
            if (i.dinner.length) {
              //如果设置了菜类明细
              i.dinner.forEach(j => {
                if (j.menus.length) {
                  //如果设置了菜类状态和可选数量
                  j.menus.forEach(k => {
                    _list.push({
                      grade: i.company.grade,
                      company_name: i.company.name,
                      company_id: i.company.id,
                      canteen_name: i.name,
                      canteen_id: i.id,
                      category_name: j.name, //早餐，午餐，晚餐
                      category: k.category, //荤菜，素菜，汤
                      dinner_id: j.id,
                      menu_id: k.id,
                      status: k.status,
                      number: k.count
                    });
                  });
                } else {
                  _list.push({
                    grade: i.company.grade,
                    company_name: i.company.name,
                    company_id: i.company.id,
                    canteen_name: i.name,
                    canteen_id: i.id,
                    category_name: j.name, //早餐，午餐，晚餐
                    dinner_id: j.id
                  });
                }
              });
            } else {
              _list.push({
                grade: i.company.grade,
                company_name: i.company.name,
                company_id: i.company.id,
                canteen_name: i.name
              });
            }
          });
          this.tableList = Array.from(_list);
          this.rowspan(0, "grade");
          this.rowspan(1, "company_name");
          this.rowspan(2, "canteen_name");
          this.rowspan(3, "category_name");
        })
        .catch(err => console.log(err));
    },
    getCanteenDetail(canteen_id) {
      $axios
        .get(
          `http://canteen.tonglingok.com/api/v1/menus/canteen?canteen_id=${canteen_id}`
        )
        .then(res => (this.canteen_detail = Array.from(res.data)))
        .catch(err => console.log(err));
    },
    _edit(val) {
      this.editForm = Object.assign({}, val);
      this.editVisible = true;
    },
    _delete(row) {
      console.log(row);
      let detail = [{ id: row.menu_id, state: 2 }];
      detail = JSON.stringify(detail);
      let formdata = {
        c_id: row.canteen_id,
        d_id: row.dinner_id,
        detail: detail
      };
      console.log(formdata);
      this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await $axios.post(
            "http://canteen.tonglingok.com/api/v1/menu/save",
            formdata
          );
          console.log("test");
          if (res.msg === "ok") {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.fetchTableList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async _editConfirm() {
      //修改餐次配置信息
      let {
        menu_id,
        status,
        number,
        category,
        canteen_id,
        dinner_id
      } = this.editForm;
      number = status === 1 ? number : "0";
      let detail = [
        { id: menu_id, status: status, category: category, count: number }
      ];
      detail = JSON.stringify(detail);
      let formdata = { c_id: canteen_id, d_id: dinner_id, detail: detail };
      const res = await $axios.post(
        "http://canteen.tonglingok.com/api/v1/menu/save",
        formdata
      );
      if (res.msg === "ok") {
        this.$message.success("操作成功!");
        this.fetchTableList();
        this._editClose();
      }
    },
    _editClose() {
      this.editVisible = false;
      this.editForm = {};
    },
    rowspan(idx, prop) {
      this.spanArr[idx] = [];
      this.position = 0;
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

<style></style>
