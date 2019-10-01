<template>
  <div>
    <div class="details">
      <div class="nav-title">企业明细</div>
      <el-divider></el-divider>
      <div class="main">
        <div class="main-header">
          <span style="margin:10px;">公司：</span>
          <el-input style="width:150px;marigin:10px" placeholder="请输入公司"></el-input>
          <span style="margin:10px;">时间：</span>
          <el-date-picker v-model="value1" style="margin:10px;" type="date" placeholder="选择日期"></el-date-picker>
          <el-button style="margin:10px;" type="primary">查询</el-button>
        </div>
        <div class="main-content">
          <el-table style="width:100%" :data="data">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.canteen" style="width:100%">
                  <el-table-column prop="name" label="饭堂名称"></el-table-column>
                  <el-table-column prop="shop" label="功能模块"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="200px"></el-table-column>
            <el-table-column label="公司级别" prop="grade">
              <template slot-scope="props">
                <span>{{props.row.grade | handleGrades}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="parent_name" label="归属企业"></el-table-column>
            <el-table-column prop="name" label="公司名称"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: null,
      data: [
        {
          id: 2,
          create_time: "2019-07-29 01:28:17",
          name: "一级企业",
          grade: 1,
          parent_id: 0,
          parent_name: null,
          canteen: [
            { id: 1, c_id: 2, name: "大饭堂" },
            { id: 4, c_id: 2, name: "饭堂1" },
            { id: 5, c_id: 2, name: "饭堂2" }
          ],
          shop: null
        },
        {
          id: 3,
          create_time: "2019-08-06 16:07:15",
          name: "企业A",
          grade: 1,
          parent_id: 2,
          parent_name: null,
          canteen: [
            { id: 6, c_id: 3, name: "饭堂1" },
            { id: 7, c_id: 3, name: "饭堂2" }
          ],
          shop: { id: 1, c_id: 3, name: "小饭堂" }
        },
        {
          id: 4,
          create_time: "2019-08-07 17:03:48",
          name: "企业A1",
          grade: 2,
          parent_id: 3,
          parent_name: "企业A",
          canteen: [],
          shop: null
        },
        {
          id: 5,
          create_time: "2019-08-07 17:08:43",
          name: "企业A2",
          grade: 2,
          parent_id: 3,
          parent_name: "企业A",
          canteen: [],
          shop: null
        },
        {
          id: 6,
          create_time: "2019-08-07 17:10:42",
          name: "企业A11",
          grade: 3,
          parent_id: 4,
          parent_name: "企业A1",
          canteen: [],
          shop: null
        },
        {
          id: 8,
          create_time: "2019-08-20 22:51:57",
          name: "企业1",
          grade: 1,
          parent_id: 0,
          parent_name: "",
          canteen: [{ id: 9, c_id: 8, name: "饭堂" }],
          shop: null
        },
        {
          id: 9,
          create_time: "2019-08-21 09:36:06",
          name: "一级企业",
          grade: 1,
          parent_id: 0,
          parent_name: "",
          canteen: [{ id: 10, c_id: 9, name: "饭堂" }],
          shop: null
        },
        {
          id: 10,
          create_time: "2019-08-21 10:14:09",
          name: "周兵一级企业",
          grade: 1,
          parent_id: 0,
          parent_name: "",
          canteen: [{ id: 11, c_id: 10, name: "饭堂" }],
          shop: null
        },
        {
          id: 11,
          create_time: "2019-08-21 17:23:55",
          name: "周兵另一个以及企业",
          grade: 1,
          parent_id: 0,
          parent_name: "",
          canteen: [{ id: 12, c_id: 11, name: "饭堂" }],
          shop: null
        },
        {
          id: 12,
          create_time: "2019-08-22 16:44:20",
          name: "一",
          grade: 1,
          parent_id: 0,
          parent_name: "",
          canteen: [{ id: 13, c_id: 12, name: "饭堂" }],
          shop: null
        }
      ]
    };
  },
  filters: {
    handleGrades: function(str) {
      let changeNum = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九"
      ];
      if (str == "") {
        return "";
      } else {
        return `${changeNum[str]}级企业`;
      }
    }
  }
};
</script>

<style scoped>

</style>