import "@babel/polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "./store";
import Axios from "axios";
import Moment from "moment";
import animated from "animate.css";
import print from "./plugins/print";
import "./plugins/element.js";
import "@/assets/iconfont/iconfont.css";
import "@/style/index.scss"; // glob scss

Vue.filter("coverTime", function(data, str) {
  return Moment(data).format(str);
});

Vue.prototype.showCellData = function(str) {
  //全局方法 处理表格中 的空数据
  return !str ? `<span>/</span>` : `<span>${str}</span>`;
};
Vue.prototype.$axios = Axios;
Vue.use(animated);
Vue.use(print);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
