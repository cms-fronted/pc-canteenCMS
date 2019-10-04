<template>
  <div class="strategy">
    <div class="nav-title">消费策略设置</div>
    <el-divider></el-divider>
    <el-table :data="budgetList" border style="width: 100%" >
      <!--:span-method="objectSpanMethod"-->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.detail" style="width:100%" >
            <el-table-column prop="number" label="次数类型" align="center"></el-table-column>
            <el-table-column prop="satus" label="消费状态" align="center">
              <template slot-scope="scope">
                <ul>
                  <li v-for="(item,index) in scope.row.strategy" :key="index" style="height:36px;line-height:36px">
                    {{item.satus | consumptionType}}
                    <hr style="margin:0; margin-left:-10px; border: none; height:1px; background-color:#EBEEF5; width:110%"  />
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="金额" align="center">
              <template slot-scope="scope">
                <ul>
                  <li v-for="(item,index) in scope.row.strategy" :key="index" style="height:36px;line-height:36px">
                    标准金额:{{item.money}}元
                    附加金额:{{item.money}}元
                    <hr style="margin:0; margin-left:-10px; border: none; height:1px; background-color:#EBEEF5; width:110%"  />
                  </li>
                </ul>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="canteen" label="消费地点" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.canteen.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="人员类型" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.role.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="餐饮">
        <template slot-scope="scope">
          <span>{{scope.row.dinner.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address2" label="免订餐就餐">
        <template slot-scope="scope">
          <span>{{scope.row.unordered_meals}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address2" label="未定餐允许就餐"></el-table-column>
      <el-table-column prop="address" label="允许消费次数">
        <template slot-scope="scope">
          <span>{{scope.row.consumption_count }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      budgetList: [
        {
          id: 14,
          unordered_meals: 1,
          detail: [
            {
              number: 1,
              strategy: [
                { satus: "ordering_meals", money: 10, sub_money: 5 },
                { satus: "no_meals_ordered", money: 10, sub_money: 5 },
                { satus: "unordered_meals", money: 10, sub_money: 5 }
              ]
            },
            {
              number: 2,
              strategy: [
                { satus: "ordering_meals", money: 10, sub_money: 5 },
                { satus: "no_meals_ordered", money: 10, sub_money: 5 },
                { satus: "unordered_meals", money: 10, sub_money: 5 }
              ]
            }
          ],
          consumption_count: 1,
          ordered_count: 1,
          dinner: { id: 5, name: "早餐" },
          role: { id: 1, name: "局长" },
          canteen: { id: 1, name: "大饭堂" }
        },
        {
          id: 15,
          unordered_meals: 1,
          detail: [
            {
              number: 1,
              strategy: [
                { satus: "ordering_meals", money: 10, sub_money: 5 },
                { satus: "no_meals_ordered", money: 10, sub_money: 5 },
                { satus: "unordered_meals", money: 10, sub_money: 5 }
              ]
            },
            {
              number: 2,
              strategy: [
                { satus: "ordering_meals", money: 10, sub_money: 5 },
                { satus: "no_meals_ordered", money: 10, sub_money: 5 },
                { satus: "unordered_meals", money: 10, sub_money: 5 }
              ]
            }
          ],
          consumption_count: 1,
          ordered_count: 1,
          dinner: { id: 6, name: "中餐" },
          role: { id: 1, name: "局长" },
          canteen: { id: 1, name: "大饭堂" }
        },
        {
          id: 16,
          unordered_meals: 1,
          detail: [
            {
              number: 1,
              strategy: [
                { satus: "ordering_meals", money: 10, sub_money: 5 },
                { satus: "no_meals_ordered", money: 10, sub_money: 5 },
                { satus: "unordered_meals", money: 10, sub_money: 5 }
              ]
            },
            {
              number: 2,
              strategy: [
                { satus: "ordering_meals", money: 10, sub_money: 5 },
                { satus: "no_meals_ordered", money: 10, sub_money: 5 },
                { satus: "unordered_meals", money: 10, sub_money: 5 }
              ]
            }
          ],
          consumption_count: 1,
          ordered_count: 1,
          dinner: { id: 7, name: "晚餐" },
          role: { id: 1, name: "局长" },
          canteen: { id: 1, name: "大饭堂" }
        }
      ],
      spanArr: [], //二维数组，用于存放单元格合并规则
      position: 0 //用于存储相同项的开始index
    };
  },
  mounted() {
    // this.rowspan(0, "date");
    // this.rowspan(1, "name");
    // this.rowspan(2, "address");
    // this.rowspan(3, "address2");
    console.log(this.budgetList);
  },
  filters:{
    consumptionType: function(str) {
      switch(str){
        case "ordering_meals": 
          return "订餐就餐";
        case "no_meals_ordered" :
          return "订餐未就餐"
        case "unordered_meals":
          return "未订餐就餐"
      }
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == "人员类型") {
        let _row, _col;
        _row = row.detail[0].strategy.length;
        return {
          rowspan: _row,
          colspan: 1
        };
      }
    },
    printScope(val) {
      console.log(val);
    }

    // rowspan(idx, prop) {
    //   this.spanArr[idx] = [];
    //   this.position = 0;
    //   this.budgetList.forEach((item, index) => {
    //     if (index === 0) {
    //       this.spanArr[idx].push(1);
    //       this.position = 0;
    //     } else {
    //       if (
    //         this.budgetList[index][prop] === this.budgetList[index - 1][prop]
    //       ) {
    //         this.spanArr[idx][this.position] += 1; //有相同项
    //         this.spanArr[idx].push(0); // 名称相同后往数组里面加一项0
    //       } else {
    //         this.spanArr[idx].push(1); //同列的前后两行单元格不相同
    //         this.position = index;
    //       }
    //     }
    //   });
    // },
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   console.log(rowIndex);
    //   for (let i = 0; i < 4 /* 对应rowspan -> idx的长度 */; i++) {
    //     if (columnIndex === i) {
    //       const _row = this.spanArr[i][rowIndex];
    //       const _col = _row > 0 ? 1 : 0;
    //       return {
    //         rowspan: _row,
    //         colspan: _col
    //       };
    //     }
    //   }
    // }
  }
};
</script>

<style>
</style>