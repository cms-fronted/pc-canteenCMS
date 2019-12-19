import "@babel/polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "./store";
import Moment from "moment";
import animated from "animate.css";
import print from "./plugins/print";
import "./plugins/element.js";
import "@/assets/iconfont/iconfont.css";
import "@/style/index.scss"; // glob scss
const order_status = ["", "已完成", "已取消", "待取货", "待送货"];

Vue.filter("coverTime", function (data, str) {
  return Moment(data).format(str);
});
Vue.prototype.$moment = Moment;
Vue.prototype.showCellData = function (str, type, status) {
  //全局方法 处理表格中 的空数据
  if(type === 3){
    return `<span>${order_status[str]}</span>`
  } else {
    return !str ? `<span>/</span>` : `<span>${str}</span>`;
  }
};

Vue.prototype.showCellStatus = function (str, status) {
  switch (str) {
    case 2:
      return `<span>${status}</span>`
      break;
    case 3:
      return `<span >${status}</span>`
      break;
    case 4:
      return `<span>${status}</span>`
      break;
    default:
      return `<span>${status}</span>`
  }
}
Vue.use(animated);
Vue.use(print);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
