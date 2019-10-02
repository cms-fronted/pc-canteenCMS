import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from './store'
import GLOBAL_ROLE from '@/utils/globalRole'
import './plugins/element.js'
import '@/assets/iconfont/iconfont.css'
import Axios from 'axios';

import Moment from 'moment'

Vue.prototype.GLOBAL_ROLE = GLOBAL_ROLE;

Vue.filter('coverTime', function (data, str) {
  return Moment(data).format(str)
})
console.log(GLOBAL_ROLE)
Axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.common['token'] = GLOBAL_ROLE.token || "";
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
Axios.defaults.withCredentials = true;
Vue.prototype.$axios = Axios;
import '@/style/index.scss' // glob scss
import animated from 'animate.css'
Vue.use(animated)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
