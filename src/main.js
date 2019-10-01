import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from './store'
import './plugins/element.js'
import '@/assets/iconfont/iconfont.css'
import Axios from 'axios';

import Moment from 'moment'

Vue.filter('coverTime',function(data,str){
  return Moment(data).format(str)
})
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
