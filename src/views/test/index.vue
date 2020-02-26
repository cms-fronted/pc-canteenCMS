<template>
  <div class="linkage">
    <el-select v-model="province_id" @change="choseProvince" placeholder="省级地区">
      <el-option v-for="item in province_arr" :key="item.id" :label="item.value" :value="item.id"></el-option>
    </el-select>
    <el-select v-model="city_id" @change="choseCity" placeholder="市级地区">
      <el-option v-for="item in now_city_arr" :key="item.id" :label="item.value" :value="item.id"></el-option>
    </el-select>
    <el-select v-model="area_id" @change="choseBlock" placeholder="区级地区">
      <el-option v-for="item in now_area_arr" :key="item.id" :label="item.value" :value="item.id"></el-option>
    </el-select>
    <el-button @click="test">保存</el-button>
  </div>
</template>

<script>
import $axios from "@/api/index";
import mapJson from "../../utils/map.json";
export default {
  data() {
    return {
      province_id: "",
      city_id: "",
      area_id: "",
      province: "",
      city: "",
      area: "",
      now_city_arr: [], // 当前选中省级的市
      now_area_arr: [], //当前选中市级的区
      province_arr: [], // 所有省
      city_arr: "", // 所有市
      area_arr: "" // 所有区
    };
  },
  methods: {
    // 加载china地点数据，三级
    getCityData: function() {
      var that = this;
      var data = mapJson;
      that.province_arr = [];
      that.city_arr = [];
      that.area_arr = [];
      // 省市区数据分类
      for (var item in data) {
        if (item.match(/0000$/)) {
          //省
          that.province_arr.push({
            id: item,
            value: data[item],
            children: []
          });
        } else if (item.match(/00$/)) {
          //市
          that.city_arr.push({ id: item, value: data[item], children: [] });
        } else {
          //区
          that.area_arr.push({ id: item, value: data[item] });
        }
      }
      // 分类市级
      for (var index in that.province_arr) {
        for (var index1 in that.city_arr) {
          if (
            that.province_arr[index].id.slice(0, 2) ===
            that.city_arr[index1].id.slice(0, 2)
          ) {
            that.province_arr[index].children.push(that.city_arr[index1]);
          }
        }
      }
      // 分类区级
      for (var item1 in that.city_arr) {
        for (var item2 in that.area_arr) {
          if (
            that.area_arr[item2].id.slice(0, 4) ===
            that.city_arr[item1].id.slice(0, 4)
          ) {
            that.city_arr[item1].children.push(that.area_arr[item2]);
          }
        }
      }
    },
    // 选省
    choseProvince: function(e) {
      for (var index2 in this.province_arr) {
        if (e === this.province_arr[index2].id) {
          this.province = this.province_arr[index2].value;
          this.now_city_arr = this.province_arr[index2].children;
          this.city = this.province_arr[index2].children[0].value;
          this.city_id = this.province_arr[index2].children[0].id;
          this.now_area_arr = this.province_arr[index2].children[0].children;
          this.area = this.province_arr[index2].children[0].children[0].value;
          this.area_id = this.now_area_arr[0].id;
        }
      }
    },
    // 选市
    choseCity: function(e) {
      for (var index3 in this.city_arr) {
        if (e === this.city_arr[index3].id) {
          this.city_id = this.city_arr[index3].id;
          this.now_area_arr = this.city_arr[index3].children;
          this.area = this.city_arr[index3].children[0].value;
          this.area_id = this.now_area_arr[0].id;
        }
      }
    },
    // 选区
    choseBlock: function(e) {
      this.area_id = e;
    },
    test() {
      console.log(this.province, this.city, this.area);
    }
  },
  created: function() {
    this.getCityData();
  }
};
</script>

<style scoped>
</style>
