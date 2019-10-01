<template>
  <div>
    <div class="strategy">
      消费策略设置
      <el-table :data="budgetList" border style="width: 100%" :span-method="objectSpanMethod">
        <el-table-column prop="date" label="消费地点" width="180"></el-table-column>
        <el-table-column prop="name" label="人员类型" width="180"></el-table-column>
        <el-table-column prop="address" label="餐饮"></el-table-column>
        <el-table-column prop="address2" label="是否未定餐允许就餐"></el-table-column>
        <el-table-column prop="address" label="消费状态"></el-table-column>
        <el-table-column prop="address" label="订餐数量"></el-table-column>
        <el-table-column prop="address" label="允许消费次数"></el-table-column>
        <el-table-column prop="address" label="次数类型"></el-table-column>
        <el-table-column prop="address" label="金额">
          <template slot-scope="scope">
            <i class="el-icon-ice-cream-square"></i>
            <el-link type="primary" disabled>{{scope.row.money}}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      budgetList: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          money: 200
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王二虎",
          address: "上海市普陀区金沙江路 1519 弄",
          address2: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王大虎",
          address: "上海市普陀区金沙江路 1519 弄",
          address2: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎虎",
          address: "上海市普陀区金沙江路 1516 弄",
          address2: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎虎",
          address: "上海市普陀区金沙江路 1519 弄",
          address2: "上海市普陀区金沙江路 1519 弄"
        }
      ],
      spanArr: [], //二维数组，用于存放单元格合并规则
      position: 0 //用于存储相同项的开始index
    };
  },
  mounted() {
    this.rowspan(0, "date");
    this.rowspan(1, "name");
    this.rowspan(2, "address");
    this.rowspan(3, "address2");
    console.log(this.spanArr)
  },
  methods: {
    rowspan(idx, prop) {
      this.spanArr[idx] = [];
      this.position = 0;
      this.budgetList.forEach((item, index) => {
        if (index === 0) {
          this.spanArr[idx].push(1);
          this.position = 0;
        } else {
          if (
            this.budgetList[index][prop] === this.budgetList[index - 1][prop]
          ) {
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
      console.log(rowIndex)
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