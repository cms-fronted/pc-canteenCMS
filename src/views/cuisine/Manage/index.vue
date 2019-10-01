<template>
  <div>
    <div class="manage">
      <span class="nav-title">菜品管理</span>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span class="content-header">所属公司：</span>
          <el-select v-model="value" placeholder="请选择" style="width:150px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="content-header">类型：</span>
          <el-select v-model="value" placeholder="请选择" style="width:150px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="content-header">餐次：</span>
          <el-select v-model="value" placeholder="请选择" style="width:150px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" plain>查询</el-button>
          <el-button type="primary" @click="addCuisine">添加</el-button>
        </div>
        <div class="main-content">
          <el-card :body-style="{ padding:0, }" v-for="o in 5" :key="o">
            <div class="image">
              <img :src="fil[o%fil.length]" alt />
            </div>
            <div style="padding: 14px;">
              <ul class="main-title">
                <li>名称：</li>
                <li>类型：</li>
                <li>餐次：</li>
                <li>价格：</li>
                <li>主厨：</li>
              </ul>
              <div class="btns">
                <el-button size="small" type="primary" @click="editCuisine">编辑</el-button>
                <el-button size="small" type="primary">删除</el-button>
                <el-button size="small" type="primary" @click="handleClick(o)">上架</el-button>
              </div>
              <!-- <div class="bottom clearfix"></div> -->
            </div>
          </el-card>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000"
          @current-change="handleClickPage"
        ></el-pagination>
      </div>
    </div>
    <cuisine-dialog :visible="visible" @closeDialog="closeDialog" :editData="editData" />
  </div>
</template>

<script>
import CuisineDialog from "./dialog";
export default {
  data() {
    return {
      visible: false,
      editData: {},
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
      currentDate: new Date(),
      fil: [
        "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
      ]
    };
  },
  components: { CuisineDialog },
  methods: {
    handleClick(o) {
      console.log(o)
    },
    closeDialog(val) {
      this.visible = val;
    },
    addCuisine() {
      this.visible = true;
    },
    editCuisine() {
      this.editData = Object.assign({},this.editData, {
        name: "111",
        price: 12,
        chef: "2e2awq",
        desc: "211"
      });
      this.visible = true;
    },

    handleClickPage(e) {
      console.log(e);
    },
    handleNext(e) {
      console.log(e);
    },
    handlePrev(e) {
      console.log(e);
    }
  }
};
</script>

<style lang="scss" scoped>
.manage {
  .main {
    height: 100%;
    .el-pagination {
      position: absolute;
      left: 40%;
    }
    .main-content {
      display: flex;
      width: 100%;
      .main-title {
        font-size: 18px;
      }
      .el-card {
        width: 100%;
        margin: 0 10px;
        .time {
          font-size: 13px;
          color: #999;
        }
        .bottom {
          margin-top: 13px;
          line-height: 12px;
        }
        .image {
          width: 100%;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        .btns {
          width:100%;
          margin-top: 10px;
          display: flex;
          justify-content: center;
        }
        .clearfix:before,
        .clearfix:after {
          display: table;
          content: "";
        }

        .clearfix:after {
          clear: both;
        }
      }
    }
  }
}
</style>