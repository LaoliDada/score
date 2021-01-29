// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import VueRouter from 'vue-router';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$ajax = axios.create({
  baseURL:'//172.16.10.120:3000',
  withCredentials: 'include'
});
Vue.prototype.$ajax.interceptors.response.use(
  response =>{
    console.log(response)
    if(response.data.code == 30002){
      window.location.href = '172.16.10.120:8082/#/index'
    }
    return response;
  }
)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
