import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "./store";
import Axios from "axios";
import Moment from "moment";
import animated from "animate.css";
import "./plugins/element.js";
import "@/assets/iconfont/iconfont.css";
import "@/style/index.scss"; // glob scss

Vue.filter("coverTime", function(data, str) {
  return Moment(data).format(str);
});

Vue.prototype.$axios = Axios;
Vue.use(animated);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
